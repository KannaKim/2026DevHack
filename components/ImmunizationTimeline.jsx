"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import res from "@/lib/rule";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CalendarDays, Syringe } from "lucide-react";

const { timeline: vaccines } = res;

const sorted = [...vaccines].sort(
  (a, b) => new Date(a.isoDate) - new Date(b.isoDate),
);

export default function ImmunizationTimeline() {
  const [selected, setSelected] = useState(null);

  return (
    <TooltipProvider delayDuration={100}>
      <Card className="w-full shadow-sm border border-slate-200 rounded-2xl bg-white">
        <CardHeader className="pt-6 px-8 pb-2 shrink-0">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Syringe className="w-4 h-4 text-slate-400" />
            Immunization Timeline
          </CardTitle>
        </CardHeader>

        <CardContent className="px-8 pb-6 pt-4">
          {/* Legend */}
          <div className="flex gap-6 mb-8">
            <Legend color="bg-emerald-500" label="Completed" />
            <Legend color="bg-amber-500" label="Upcoming" />
            <Legend color="bg-rose-500" label="Missed" />
          </div>

          {/* This div is the ONLY scroll container — scrollbar stays inside the card */}
          <div
            className="overflow-x-auto overflow-y-hidden"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 transparent",
            }}
          >
            <div
              className="relative"
              style={{ minWidth: "900px", paddingBottom: "8px" }}
            >
              {/* Timeline line — vertically centred in the dot row */}
              {/* date block h-10=40px, dot h-8 centre=16px → line at top 56px */}
              <div
                className="absolute left-0 right-0 bg-slate-200"
                style={{ top: "56px", height: "2px", zIndex: 0 }}
              />

              {/* Vaccine items */}
              <div
                className="relative flex justify-between items-start w-full"
                style={{ zIndex: 1 }}
              >
                {sorted.map((vaccine) => (
                  <Tooltip key={vaccine.id}>
                    <TooltipTrigger asChild>
                      <div
                        role="button"
                        tabIndex={0}
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
                        className="flex flex-col items-center cursor-pointer group outline-none rounded-xl px-2 py-1 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-300"
                        style={{ width: "112px" }}
                      >
                        {/* Date — h-10 ensures all dots land on the same horizontal */}
                        <div
                          className="flex items-center justify-center"
                          style={{ height: "40px" }}
                        >
                          <span
                            className={`text-[10px] font-medium text-center leading-tight
                              ${
                                vaccine.status === "completed"
                                  ? "text-slate-500"
                                  : vaccine.status === "missed"
                                    ? "text-rose-400"
                                    : "text-amber-400"
                              }
                            `}
                          >
                            {vaccine.date}
                          </span>
                        </div>

                        {/* Dot — h-8 (32px), centre at 16px → total 56px from top = on the line */}
                        <div
                          className="flex items-center justify-center"
                          style={{ height: "32px" }}
                        >
                          <div
                            className={`rounded-full border-[3px] border-white shadow-md transition-transform duration-150 group-hover:scale-125
                              ${selected === vaccine.id ? "scale-125" : ""}
                              ${vaccine.color}
                            `}
                            style={{ width: "20px", height: "20px" }}
                          />
                        </div>

                        {/* Name + badge */}
                        <div className="mt-3 flex flex-col items-center gap-1">
                          <span
                            className={`text-xs font-semibold text-center leading-tight
                              ${
                                vaccine.status === "completed"
                                  ? "text-slate-800"
                                  : vaccine.status === "missed"
                                    ? "text-rose-600"
                                    : "text-amber-600"
                              }
                            `}
                          >
                            {vaccine.name}
                          </span>

                          {vaccine.status === "completed" ? (
                            <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] rounded-full px-2 py-0 hover:bg-emerald-50">
                              Done
                            </Badge>
                          ) : vaccine.status === "missed" ? (
                            <Badge className="bg-rose-50 text-rose-600 border border-rose-100 text-[9px] rounded-full px-2 py-0 hover:bg-rose-50">
                              Missed
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-50 text-amber-600 border border-amber-100 text-[9px] rounded-full px-2 py-0 hover:bg-amber-50">
                              Upcoming
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent className="bg-slate-800 text-white text-xs rounded-xl p-3 shadow-xl">
                      <div className="font-semibold mb-1">{vaccine.name}</div>
                      <div className="flex items-center gap-1 text-slate-300">
                        <CalendarDays className="w-3 h-3" />
                        {vaccine.date}
                      </div>
                      {vaccine.provider !== "—" && (
                        <div className="text-slate-400 text-[10px] mt-1">
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
    </TooltipProvider>
  );
}

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-2 text-xs text-slate-600">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      {label}
    </span>
  );
}
