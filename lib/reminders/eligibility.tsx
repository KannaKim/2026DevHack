import { parseDob, yearsBetween, addDays, addYears, iso } from "@/lib/date";
import { ruleByName } from "@/lib/vaccines/catalog";

type User = {
  id: number;
  name: string;
  dob: string;
  pregnant?: boolean;
  gestationWeeks?: number;
  immunocompromised?: boolean;
  conditions?: string[];
  vaccines: { name: string; dosesReceived: number; lastDoseDate: string | null }[];
};

export type VaccineStatus = "completed" | "dueSoon" | "overdue" | "eligibleNow" | "notEligible";

export type VaccineResult = {
  userId: number;
  vaccineName: string;
  status: VaccineStatus;
  dueDate: string | null;
  reason: string;
};

export function evaluateUserVaccines(user: User, today = new Date()): VaccineResult[] {
  const dob = parseDob(user.dob);
  const ageYears = yearsBetween(dob, today);

  return user.vaccines.map((v) => {
    const rule = ruleByName.get(v.name.toLowerCase());
    if (!rule) {
      return { userId: user.id, vaccineName: v.name, status: "notEligible", dueDate: null, reason: "No rule found." };
    }

    const minAgeYears = rule.eligibility?.minAgeYears;
    const maxAgeYears = rule.eligibility?.maxAgeYears;
    if (typeof minAgeYears === "number" && ageYears < minAgeYears) {
      return { userId: user.id, vaccineName: v.name, status: "notEligible", dueDate: null, reason: `Under minimum age (${minAgeYears}).` };
    }
    if (typeof maxAgeYears === "number" && ageYears > maxAgeYears) {
      return { userId: user.id, vaccineName: v.name, status: "notEligible", dueDate: null, reason: `Above maximum age (${maxAgeYears}).` };
    }

    // Pneumococcal: allow if 65+ OR high-risk override list
    if (rule.code === "PNEUMOCOCCAL") {
      const isHighRisk =
        !!user.immunocompromised ||
        (user.conditions ?? []).some((c) => (rule.riskOverride ?? []).includes(c));
      if (ageYears < 65 && !isHighRisk) {
        return { userId: user.id, vaccineName: v.name, status: "notEligible", dueDate: null, reason: "Not 65+ and no high-risk override." };
      }
    }

    // --- Compute due date ---
    let due: Date | null = null;

    // Tdap booster + pregnancy priority window
    if (rule.code === "TDAP" && v.lastDoseDate) {
      // Booster every 10 years :contentReference[oaicite:7]{index=7}
      due = addYears(new Date(v.lastDoseDate + "T00:00:00"), rule.booster?.intervalYears ?? 10);

      // If pregnant and in recommended weeks, treat as eligible now :contentReference[oaicite:8]{index=8}
      const w = user.gestationWeeks;
      if (user.pregnant && typeof w === "number") {
        const start = rule.pregnancyRule?.recommendedWeeksStart ?? 27;
        const end = rule.pregnancyRule?.recommendedWeeksEnd ?? 32;
        if (w >= start && w <= end) {
          return { userId: user.id, vaccineName: v.name, status: "eligibleNow", dueDate: iso(today), reason: `Pregnancy window (${start}-${end} weeks).` };
        }
      }
    }

    // Schedule-based: next dose due by recommended age (relative to DOB)
    if (!due && Array.isArray(rule.schedule)) {
      const nextDoseNumber = (v.dosesReceived ?? 0) + 1;
      const nextDose = rule.schedule.find((s: any) => s.dose === nextDoseNumber);

      if (!nextDose) {
        return { userId: user.id, vaccineName: v.name, status: "completed", dueDate: null, reason: "Series complete." };
      }

      // recommended age → due date
      due = new Date(dob);
      if (typeof nextDose.recommendedAgeMonths === "number") {
        due.setMonth(due.getMonth() + nextDose.recommendedAgeMonths);
      } else if (typeof nextDose.recommendedAgeYears === "number") {
        due.setFullYear(due.getFullYear() + Math.floor(nextDose.recommendedAgeYears));
        const frac = nextDose.recommendedAgeYears % 1;
        if (frac === 0.5) due.setMonth(due.getMonth() + 6);
      }

      // interval rule: if lastDose exists, enforce min spacing :contentReference[oaicite:9]{index=9}
      if (v.lastDoseDate && rule.intervalRules?.minDaysBetweenDoses) {
        const minNext = addDays(new Date(v.lastDoseDate + "T00:00:00"), rule.intervalRules.minDaysBetweenDoses);
        if (minNext > due) due = minNext;
      }
    }

    if (!due) {
      return { userId: user.id, vaccineName: v.name, status: "notEligible", dueDate: null, reason: "No due date logic matched." };
    }

    // --- Convert due date to status ---
    const dueIso = iso(due);
    const todayIso = iso(today);
    const ms = new Date(dueIso + "T00:00:00").getTime() - new Date(todayIso + "T00:00:00").getTime();
    const daysUntil = Math.round(ms / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) return { userId: user.id, vaccineName: v.name, status: "overdue", dueDate: dueIso, reason: `Overdue since ${dueIso}.` };
    if (daysUntil <= 30) return { userId: user.id, vaccineName: v.name, status: "dueSoon", dueDate: dueIso, reason: `Due on ${dueIso} (≤30 days).` };
    return { userId: user.id, vaccineName: v.name, status: "completed", dueDate: dueIso, reason: `Not due soon (due ${dueIso}).` };
  });
}