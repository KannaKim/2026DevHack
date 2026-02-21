"use client"

import { useState } from "react"
import PatientInfoDashboard from "@/components/PatientInfoDashboard"
import { ClinicHeader } from "@/components/clinic/clinic-header"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

export default function ClinicPage() {
  const [search, setSearch] = useState("")
  const [submittedSearch, setSubmittedSearch] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittedSearch(search.trim())
  }

  return (
    <div className="min-h-screen bg-background">
      <ClinicHeader
        showSearch={!!submittedSearch}
        search={search}
        onSearchChange={setSearch}
        onSubmit={handleSubmit}
      />

      <div className="mx-auto w-full max-w-6xl px-4">

        <div
          className={`transition-all duration-500 ease-in-out flex flex-col items-center ${
            submittedSearch ? "pt-6" : "justify-center min-h-[calc(100vh-72px)]"
          }`}
        >

          {!submittedSearch && (
            <>
              <div className="mb-8 flex flex-col items-center">
                <h1 className="text-5xl sm:text-7xl font-semibold tracking-tighter text-blue-500 mb-2">
                  Clinic<span className="text-foreground">Search</span>
                </h1>
              </div>

              <form
                onSubmit={handleSubmit}
                className="relative flex items-center w-full max-w-2xl px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 hover:shadow-md focus-within:shadow-md transition-shadow bg-background"
              >
                <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-3 h-[18px] w-[18px]" />
                <input
                  type="text"
                  placeholder="Search patients authorization code"
                  className="flex-grow outline-none bg-transparent text-base"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
            </>
          )}

          {submittedSearch && (
            <div className="w-full mt-6 pb-12">
              <PatientInfoDashboard patientID={submittedSearch} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}