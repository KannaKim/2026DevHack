import users from "../data/user.js";
import vaccinesMaster from "../data/vac.js";

function getAgeInMonths(dobStr) {
  const y = Number(dobStr.substr(0, 4));
  const m = Number(dobStr.substr(4, 2)) - 1;
  const d = Number(dobStr.substr(6, 2));

  const dob = new Date(y, m, d);
  const today = new Date();

  let months =
    (today.getFullYear() - dob.getFullYear()) * 12 +
    (today.getMonth() - dob.getMonth());

  if (today.getDate() < dob.getDate()) months--;

  return months;
}

// helper: days between
function daysBetween(dateStr) {
  if (!dateStr) return null;
  const last = new Date(dateStr);
  const today = new Date();
  return Math.floor((today - last) / (1000 * 60 * 60 * 24));
}

// main stuff
export default function rule(patientArray) {
  const patient = patientArray[1];

  const ageMonths = getAgeInMonths(patient.dob);
  const today = new Date();

  const results = [];

  for (let master of vaccinesMaster) {
    const patientVac = patient.vaccines.find((v) => v.name === master.code);

    const dosesReceived = patientVac?.dosesReceived || 0;
    const lastDoseDate = patientVac?.lastDoseDate || null;

    let status = "NOT_ELIGIBLE";
    let reason = "";

    // age eligibility checker
    const minAge = master.eligibility?.minAgeMonths ?? 0;
    const maxAge = master.eligibility?.maxAgeMonths ?? Infinity;

    const ageEligible = ageMonths >= minAge && ageMonths <= maxAge;

    // final check
    const requiredDoses = master.schedule.length;

    if (dosesReceived >= requiredDoses) {
      status = "COMPLETED";
      reason = "Series completed";
    } else if (!ageEligible) {
      status = "NOT_ELIGIBLE";
      reason = "Not in eligible age range";
    } else {
      // interval check
      const minInterval = master.intervalRules?.minDaysBetweenDoses ?? 0;

      const daysSinceLast = daysBetween(lastDoseDate);

      if (dosesReceived === 0) {
        status = "ELIGIBLE_NOW";
        reason = "No doses received yet";
      } else if (daysSinceLast === null) {
        status = "ELIGIBLE_NOW";
        reason = "Ready for next dose";
      } else if (daysSinceLast < minInterval) {
        status = "DUE_SOON";
        reason = "Waiting minimum interval";
      } else if (daysSinceLast >= minInterval) {
        // overdue logic (simple hackathon version)
        if (daysSinceLast > minInterval + 30) {
          status = "OVERDUE";
          reason = "Past recommended interval";
        } else {
          status = "ELIGIBLE_NOW";
          reason = "Interval met";
        }
      }
    }

    // special rule: rotavirus cutoff check
    if (
      master.specialRules?.includes("must_complete_by_8_months") &&
      ageMonths > 8
    ) {
      if (dosesReceived < master.schedule.length) {
        status = "NOT_ELIGIBLE";
        reason = "Exceeded maximum age for rotavirus";
      }
    }

    results.push({
      vaccine: master.name,
      code: master.code,
      dosesReceived,
      status,
      reason,
      ageMonths,
    });
  }

  return results;
}

// TEST RUN
const output = rule(users);
console.log(JSON.stringify(output, null, 2));
