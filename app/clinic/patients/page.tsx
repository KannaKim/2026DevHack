"use client"

import Link from "next/link"
import users from "@/lib/mock/users"
import { ClinicHeader } from "@/components/clinic/clinic-header"
import { Card } from "@/components/ui/card"

export default function PatientsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ClinicHeader />

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-blue-500">
            All Patients
          </h1>
          <p className="text-sm text-muted-foreground">
            Click a patient to open their dashboard.
          </p>
        </div>

        {/* 🔥 FLEX COLUMN LIST */}
        <div className="flex flex-col gap-4">
          {users.map((u) => (
            <Link
              key={u.id}
              href={`/clinic?patient=${u.id}`}
              className="group block"
            >
              <Card
                className="
                  w-full rounded-2xl
                  border border-border
                  px-5 py-4
                  transition-all
                  hover:shadow-md
                  hover:border-blue-500
                  cursor-pointer
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-blue-500
                "
              >
                <div className="flex items-center justify-between gap-6">

                  {/* LEFT — Name */}
                  <div className="flex flex-col">
                    <h2 className="font-medium text-base group-hover:text-blue-500 transition-colors">
                      {u.name}
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      ID: {u.id} • DOB: {u.dob}
                    </p>
                  </div>

                  {/* MIDDLE — Contact */}
                  <div className="hidden sm:flex flex-col text-sm">
                    <span className="text-muted-foreground">Email</span>
                    <span>{u.email ?? "—"}</span>
                  </div>

                  <div className="hidden sm:flex flex-col text-sm">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{u.phone ?? "—"}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}