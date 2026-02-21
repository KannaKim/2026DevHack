"use client";

import { useState } from "react";
import users from "@/data/user";
import PatientInfoDashboard from "@/components/PatientInfoDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function ClinicPage() {
  const [search, setSearch] = useState("");
  const [patient, setPatient] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const foundPatient = users.find((u) => String(u.id) === search.trim());

    if (!foundPatient) {
      setError("Patient not found.");
      setPatient(null);
      return;
    }

    setError("");
    setPatient(foundPatient);
  };

  return (
    <div className="min-h-screen">
      <div
        className={`transition-all duration-500 ease-in-out flex flex-col items-center ${
          patient ? "pt-6" : "justify-center h-screen"
        }`}
      >
        {!patient && (
          <div className="mb-8 flex flex-col items-center">
            <h1 className="text-5xl sm:text-7xl font-semibold tracking-tighter text-blue-500 mb-2">
              Clinic<span className="text-foreground">Search</span>
            </h1>
          </div>
        )}

        <div
          className={`${
            patient
              ? "w-full max-w-6xl px-4 flex gap-6 items-center border-b border-gray-200 pb-6"
              : "w-full max-w-2xl px-4"
          }`}
        >
          {patient && (
            <h2
              className="text-2xl font-semibold tracking-tighter text-blue-500 shrink-0 cursor-pointer"
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
            className={`relative flex items-center w-full px-5 py-3 rounded-full border border-gray-300 bg-background ${
              patient ? "max-w-3xl" : ""
            }`}
          >
            <FontAwesomeIcon
              icon={faSearch}
              className="text-gray-400 mr-3 h-[18px] w-[18px]"
            />

            <input
              type="text"
              placeholder="Enter Patient ID"
              className="flex-grow outline-none bg-transparent text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              type="submit"
              className="ml-3 text-blue-500 hover:text-blue-600"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>

        {error && <div className="text-red-500 mt-4 font-medium">{error}</div>}

        {patient && (
          <div className="w-full max-w-6xl px-4 mt-6 pb-12">
            <PatientInfoDashboard patient={String(patient.id)} />
          </div>
        )}
      </div>
    </div>
  );
}
