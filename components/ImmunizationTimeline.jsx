"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarDays, Syringe } from "lucide-react";

const vaccines = [
  {
    id: 1,
    name: "COVID-19",
    date: "Jan 10, 2024",
    isoDate: "2024-01-10",
    status: "completed",
    color: "bg-emerald-500",
    ringColor: "ring-emerald-200",
    dotColor: "#10b981",
    provider: "CVS Pharmacy",
    lot: "EK9782",
  },
  {
    id: 2,
    name: "Tdap",
    date: "May 15, 2024",
    isoDate: "2024-05-15",
    status: "completed",
    color: "bg-rose-500",
    ringColor: "ring-rose-200",
    dotColor: "#f43f5e",
    provider: "Primary Care",
    lot: "TDP2241",
  },
  {
    id: 3,
    name: "Flu Shot",
    date: "Oct 01, 2024",
    isoDate: "2024-10-01",
    status: "completed",
    color: "bg-amber-500",
    ringColor: "ring-amber-200",
    dotColor: "#f59e0b",
    provider: "Walgreens",
    lot: "FLU9921",
  },
  {
    id: 4,
    name: "Tetanus",
    date: "Oct 14, 2026",
    isoDate: "2026-10-14",
    status: "upcoming",
    color: "bg-slate-300",
    ringColor: "ring-slate-200",
    dotColor: "#cbd5e1",
    provider: "—",
    lot: "—",
  },
  {
    id: 5,
    name: "Shingrix",
    date: "Oct 14, 2046",
    isoDate: "2046-10-14",
    status: "upcoming",
    color: "bg-slate-300",
    ringColor: "ring-slate-200",
    dotColor: "#cbd5e1",
    provider: "—",
    lot: "—",
  },
];

export default function ImmunizationTimeline() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans">
        <Card className="w-full max-w-3xl shadow-sm border border-slate-200 rounded-2xl bg-white">
          <CardHeader className="pb-2 pt-6 px-5 sm:px-8">
            <CardTitle className="text-base sm:text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Syringe className="w-4 h-4 text-slate-400 shrink-0" />
              Immunization Timeline
            </CardTitle>
          </CardHeader>

          <CardContent className="px-5 sm:px-8 pb-8 pt-4">
            {/* Legend */}
            <div className="flex gap-4 mb-8">
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                Completed
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block shrink-0" />
                Upcoming
              </span>
            </div>

            {/* Timeline */}
            <div className="relative overflow-x-auto pb-2">
              <div className="min-w-[320px]">
                {/* Connector Line */}
                <div className="absolute top-[18px] left-0 right-0 h-px bg-slate-200 z-0" />
                {/* Completed segment overlay */}
                <div
                  className="absolute top-[18px] left-0 h-px bg-slate-400 z-0"
                  style={{ width: "50%" }}
                />

                <div className="relative z-10 flex justify-between items-start">
                  {vaccines.map((vaccine) => (
                    <Tooltip key={vaccine.id}>
                      <TooltipTrigger asChild>
                        <div
                          role="button"
                          tabIndex={0}
                          aria-pressed={selected === vaccine.id}
                          onClick={() =>
                            setSelected(
                              selected === vaccine.id ? null : vaccine.id,
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              setSelected(
                                selected === vaccine.id ? null : vaccine.id,
                              );
                          }}
                          onMouseEnter={() => setHovered(vaccine.id)}
                          onMouseLeave={() => setHovered(null)}
                          className={`flex flex-col items-center gap-2 sm:gap-3 cursor-pointer group outline-none
                            rounded-xl px-1 py-1 transition-all duration-150
                            focus-visible:ring-2 focus-visible:ring-slate-400
                            ${selected === vaccine.id ? "bg-slate-50" : "hover:bg-slate-50/60"}
                          `}
                        >
                          {/* Date */}
                          <span
                            className={`text-[9px] sm:text-[10px] leading-tight text-center font-medium transition-colors duration-150 whitespace-nowrap
                              ${vaccine.status === "completed" ? "text-slate-500" : "text-slate-400"}
                              ${hovered === vaccine.id || selected === vaccine.id ? "text-slate-700" : ""}
                            `}
                          >
                            {vaccine.date}
                          </span>

                          {/* Dot */}
                          <div
                            className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white shadow-md
                              transition-transform duration-150 group-hover:scale-125
                              ${vaccine.color}
                              ${vaccine.status === "upcoming" ? "opacity-60" : "opacity-100"}
                              ${selected === vaccine.id ? "scale-125" : ""}
                            `}
                          />

                          {/* Label */}
                          <span
                            className={`text-[10px] sm:text-[11px] font-semibold text-center leading-tight transition-colors duration-150
                              ${vaccine.status === "completed" ? "text-slate-700" : "text-slate-400"}
                              ${hovered === vaccine.id || selected === vaccine.id ? "text-slate-900" : ""}
                            `}
                            style={{ maxWidth: 64 }}
                          >
                            {vaccine.name}
                          </span>

                          {vaccine.status === "completed" ? (
                            <Badge className="text-[8px] sm:text-[9px] px-1.5 py-0 bg-emerald-50 text-emerald-600 border border-emerald-100 font-medium rounded-full hover:bg-emerald-50">
                              Done
                            </Badge>
                          ) : (
                            <Badge className="text-[8px] sm:text-[9px] px-1.5 py-0 bg-slate-50 text-slate-400 border border-slate-200 font-medium rounded-full hover:bg-slate-50">
                              Due
                            </Badge>
                          )}
                        </div>
                      </TooltipTrigger>

                      <TooltipContent
                        side="top"
                        className="bg-slate-800 text-white text-xs rounded-xl p-3 shadow-xl max-w-[180px]"
                      >
                        <div className="font-semibold mb-1">{vaccine.name}</div>
                        <div className="flex items-center gap-1 text-slate-300 mb-0.5">
                          <CalendarDays className="w-3 h-3" />
                          {vaccine.date}
                        </div>
                        {vaccine.provider !== "—" && (
                          <div className="text-slate-400 text-[10px]">
                            {vaccine.provider} · Lot: {vaccine.lot}
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
