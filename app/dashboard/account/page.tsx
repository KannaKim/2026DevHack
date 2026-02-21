"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import users from "@/data/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, ShieldCheck, Syringe } from "lucide-react";

type Vaccine = {
  name: string;
  dosesReceived: number;
  lastDoseDate: string | null;
};

type Patient = {
  id: number;
  name: string;
  dob: string;
  conditions?: string[]; // optional
  vaccines: Vaccine[];
};

function formatDOB(dob?: string) {
  if (!dob || !/^\d{8}$/.test(dob)) return "Not available";

  const year = Number(dob.substring(0, 4));
  const month = Number(dob.substring(4, 6)) - 1;
  const day = Number(dob.substring(6, 8));

  const date = new Date(year, month, day);

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function calculateAge(dob?: string) {
  if (!dob || !/^\d{8}$/.test(dob)) return "—";

  const year = Number(dob.substring(0, 4));
  const month = Number(dob.substring(4, 6)) - 1;
  const day = Number(dob.substring(6, 8));

  const birthDate = new Date(year, month, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export default function ProfilePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // For demo, we take first user
  const patient = users[0] as Patient;

  const age = calculateAge(patient?.dob);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(".animate-item");

    gsap.fromTo(
      elements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      },
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-8 p-6 max-w-5xl mx-auto"
    >
      {/* ================= Profile Overview ================= */}
      <Card className="rounded-2xl shadow-md border bg-white hover:shadow-lg transition">
        <CardHeader className="flex flex-row items-center gap-3">
          <User className="text-blue-500" />
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {patient.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar size={16} />
              Date of Birth
            </p>
            <p className="text-lg font-medium">{formatDOB(patient.dob)}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Age</p>
            <p className="text-lg font-medium">{age} years</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <ShieldCheck size={16} />
              Chronic Conditions
            </p>

            {patient.conditions?.length ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {patient.conditions.map((condition: string, index: number) => (
                  <Badge
                    key={index}
                    variant="destructive"
                    className="rounded-full"
                  >
                    {condition}
                  </Badge>
                ))}
              </div>
            ) : (
              <Badge variant="secondary" className="mt-1">
                None
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ================= Vaccine Summary ================= */}
      <Card className="animate-item rounded-2xl shadow-sm border bg-white hover:shadow-md transition">
        <CardHeader className="flex flex-row items-center gap-3">
          <Syringe className="text-emerald-500" />
          <CardTitle className="text-xl font-semibold">
            Vaccination Summary
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {patient.vaccines?.length ? (
              patient.vaccines.map((vac: any, index: number) => (
                <div
                  key={index}
                  className="p-4 border rounded-xl hover:bg-muted/50 transition group"
                >
                  <p className="font-medium text-base group-hover:text-blue-600 transition">
                    {vac.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Doses Taken: {vac.dosesReceived}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last Dose: {vac.lastDoseDate || "—"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                No vaccination records available.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
