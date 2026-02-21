"use client";

import { useState, useEffect, useRef } from "react";
import ImmunizationTimeline from "@/components/ImmunizationTimeline";
import { useAccessToken } from "@/hooks/useAccessToken";
import gsap from "gsap";

export default function Page() {
  const { token, isLoading: tokenLoading } = useAccessToken();
  const [eligibilityData, setEligibilityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/patient/eligibility");
        const data = await res.json();

        if (data.success) {
          setEligibilityData(data.data);
          setError(null);
          
          // Animate content entry
          gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          );
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
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading your immunization records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-red-50 rounded-2xl border-2 border-red-200">
          <p className="text-red-600 font-semibold text-lg mb-2">Oops!</p>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      <ImmunizationTimeline
        timeline={eligibilityData?.timeline}
        progress={eligibilityData?.progress}
        patientName={eligibilityData?.patientName}
      />
    </div>
  );
}
