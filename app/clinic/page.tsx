"use client";

import { useState, useRef, useEffect } from "react";
import PatientInfoDashboard from "@/components/PatientInfoDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faKey } from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";

export default function ClinicPage() {
  const [search, setSearch] = useState("");
  const [patient, setPatient] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const patientCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = search.trim();
    if (!value) return;

    setError("");
    setPatient(null);
    setLoading(true);

    try {
      const res = await fetch("/api/access/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: value }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Invalid or expired access code.");
        gsap.to(".error-msg", { opacity: 1, duration: 0.3 });
        return;
      }
      setPatient({ ...data.data, id: data.data._id });

      // Animate patient card in
      gsap.fromTo(
        patientCardRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out" },
      );
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    gsap.to(patientCardRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      onComplete: () => {
        setPatient(null);
        setSearch("");
        setError("");
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col bg-background"
    >
      {/* Main Content Wrapper */}
      <div
        className={`flex flex-col items-center transition-all duration-500 ease-in-out px-4 ${
          patient ? "pt-6" : "justify-center flex-1"
        }`}
      >
        {/* Heading */}
        {!patient && (
          <div className="mb-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-blue-500">
              Clinic
              <span className="text-foreground">Search</span>
            </h1>
          </div>
        )}

        {/* Search Row */}
        <div
          className={`w-full ${
            patient
              ? "max-w-5xl flex flex-col sm:flex-row gap-4 items-center border-b border-muted pb-6"
              : "max-w-xl"
          }`}
        >
          {patient && (
            <h2
              className="text-xl sm:text-2xl font-semibold tracking-tight text-blue-500 cursor-pointer"
              onClick={resetSearch}
            >
              Clinic<span className="text-foreground">Search</span>
            </h2>
          )}

          <div className="w-full space-y-3">
            <form
              onSubmit={handleSubmit}
              className="flex items-center w-full px-4 py-3 rounded-full border border-muted bg-background shadow-sm focus-within:shadow-md transition"
            >
              <FontAwesomeIcon
                icon={faKey}
                className="text-muted-foreground mr-3 h-[16px] w-[16px]"
              />
              <input
                type="text"
                placeholder="Enter patient's access code (e.g. MED-...)"
                className="flex-grow outline-none bg-transparent text-sm sm:text-base"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (error) setError("");
                }}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !search.trim()}
                className="ml-3 text-blue-500 hover:text-blue-600 transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="text-sm">Checking...</span>
                ) : (
                  <FontAwesomeIcon icon={faSearch} />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-msg text-red-500 mt-4 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Patient Data */}
        {patient && (
          <div ref={patientCardRef} className="w-full max-w-5xl mt-6 pb-12">
            <PatientInfoDashboard patient={patient} />
          </div>
        )}
      </div>
    </div>
  );
}
