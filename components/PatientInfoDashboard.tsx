"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import PatientHistory from "@/components/PatientHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function calculateAge(dob?: string) {
  if (!dob) return "—";

  let birthDate: Date;

  // If format is YYYYMMDD
  if (/^\d{8}$/.test(dob)) {
    const year = Number(dob.substring(0, 4));
    const month = Number(dob.substring(4, 6)) - 1;
    const day = Number(dob.substring(6, 8));
    birthDate = new Date(year, month, day);
  }
  // If format is YYYY-MM-DD
  else {
    birthDate = new Date(dob);
  }

  if (isNaN(birthDate.getTime())) return "—";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export default function PatientInfoDashboard({ patient }: { patient: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const age = calculateAge(patient.dob);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
    );
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">
      {/* ================= PATIENT OVERVIEW ================= */}
      <Card className="rounded-2xl shadow-md border bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {patient.name}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Age */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="text-lg font-medium">{age} years</p>
            </div>

            {/* DOB */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="text-lg font-medium">
                {patient.dob || "Not available"}
              </p>
            </div>

            {/* Chronic Conditions */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Chronic Conditions
              </p>

              {patient.conditions?.length ? (
                <div className="flex flex-wrap gap-2">
                  {patient.conditions.map(
                    (condition: string, index: number) => (
                      <Badge
                        key={index}
                        variant="destructive"
                        className="rounded-full"
                      >
                        {condition}
                      </Badge>
                    ),
                  )}
                </div>
              ) : (
                <Badge variant="secondary" className="rounded-full">
                  None
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= VACCINE SECTION ================= */}
      <Card className="rounded-2xl shadow-sm border bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Vaccination Record
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 pr-4">Vaccine</th>
                  <th className="text-left py-2 pr-4">Doses</th>
                  <th className="text-left py-2">Last Dose</th>
                </tr>
              </thead>

              <tbody>
                {patient?.vaccines?.length ? (
                  patient.vaccines.map((vac: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b last:border-none hover:bg-muted/40 transition"
                    >
                      <td className="py-3 pr-4 font-medium">{vac.name}</td>
                      <td className="py-3 pr-4">{vac.dosesReceived}</td>
                      <td className="py-3">{vac.lastDoseDate || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-4 text-muted-foreground text-sm"
                    >
                      No vaccination records available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {!patient?.vaccines?.length && (
              <p className="text-sm text-muted-foreground mt-4">
                No vaccination records found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ================= MEDICAL HISTORY ================= */}
      <PatientHistory patientID={String(patient.id)} />
    </div>
  );
}
