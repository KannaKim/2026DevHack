// "use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
// import { DataTable } from "@/components/data-table";
// import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ImmunizationTimeline from "@/components/ImmunizationTimeline";
import PatientProfile from "@/components/PatientProfile";

import data from "../data.json";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-row justify-evenly">
          {/* <div className="@container/main flex flex-1 flex-row gap-2"> */}
          {/* <div className="flex flex-row gap-4 py-4 md:gap-6 md:py-6"> */}
          {/* <SectionCards /> */}
          {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div> */}
          <ImmunizationTimeline />
          {/* <DataTable data={data} /> */}
          {/* </div> */}
          {/* </div> */}
        </div>
        {/* <PatientProfile /> */}
      </SidebarInset>
    </SidebarProvider>
  );
}
