"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function MedHistoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Activity className="size-5 text-primary" />
            Medical History
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>This is a demo medical history page.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-muted/30">
              <p className="font-medium text-foreground">Allergies</p>
              <p>Penicillin</p>
            </div>

            <div className="p-4 rounded-xl border bg-muted/30">
              <p className="font-medium text-foreground">Chronic Conditions</p>
              <p>None reported</p>
            </div>

            <div className="p-4 rounded-xl border bg-muted/30">
              <p className="font-medium text-foreground">Last Visit</p>
              <p>March 12, 2025</p>
            </div>

            <div className="p-4 rounded-xl border bg-muted/30">
              <p className="font-medium text-foreground">Primary Physician</p>
              <p>Dr. Sharma</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
