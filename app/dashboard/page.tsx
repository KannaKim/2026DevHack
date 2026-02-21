"use client";

import { useState, useEffect } from "react";
import ImmunizationTimeline from "@/components/ImmunizationTimeline";
import { useAccessToken } from "@/hooks/useAccessToken";

export default function Page() {
  const { token, isLoading: tokenLoading } = useAccessToken();
  const [eligibilityData, setEligibilityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/patient/eligibility");
        const data = await res.json();

        if (data.success) {
          setEligibilityData(data.data);
          setError(null);
        } else {
          setError(data.message || "Failed to load eligibility data");
        }
      } catch (err) {
        console.error("Error fetching eligibility:", err);
        setError("Error loading patient data");
      } finally {
        setIsLoading(false);
      }
    };

    if (!tokenLoading) {
      fetchEligibility();
    }
  }, [tokenLoading]);

  if (isLoading || tokenLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <ImmunizationTimeline
      timeline={eligibilityData?.timeline}
      progress={eligibilityData?.progress}
      patientName={eligibilityData?.patientName}
    />
  );
}
