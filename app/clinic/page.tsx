"use client";

import { useState } from "react";
// import users from "@/data/user"; remove this line if the GET works
import PatientInfoDashboard from "@/components/PatientInfoDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function ClinicPage() {
  const [search, setSearch] = useState("");
  const [patient, setPatient] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setPatient(null);

    try {
      const res = await fetch("/api/access/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: search.trim() }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Invalid access token.");
        return;
      }

      setPatient(data.data);
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  // The return ui

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
              onClick={() => {
                setPatient(null);
                setSearch("");
                setError("");
              }}
            >
              Clinic<span className="text-foreground">Search</span>
            </h2>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex items-center w-full px-4 py-3 rounded-full border border-muted bg-background shadow-sm focus-within:shadow-md transition"
          >
            <FontAwesomeIcon
              icon={faSearch}
              className="text-muted-foreground mr-3 h-[16px] w-[16px]"
            />

            <input
              type="text"
              placeholder="Enter Patient Access Code"
              className="flex-grow outline-none bg-transparent text-sm sm:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              type="submit"
              className="ml-3 text-blue-500 hover:text-blue-600 transition"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-500 mt-4 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Patient Data */}
        {patient && (
          <div className="w-full max-w-5xl mt-6 pb-12">
            <PatientInfoDashboard patient={patient} />
          </div>
        )}
      </div>
    </div>
  );
}
