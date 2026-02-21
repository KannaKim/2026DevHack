"use client"

import { useState } from "react"
import PatientInfoDashboard from "@/components/PatientInfoDashboard"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faMicrophone } from "@fortawesome/free-solid-svg-icons"

export default function ClinicPage() {
    const [search, setSearch] = useState('')
    const [submittedSearch, setSubmittedSearch] = useState('')

    const handleSearch = (term: string) => {
        setSearch(term)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmittedSearch(search)
    }

    return (
        <div className="min-h-screen">
            <div className={`transition-all duration-500 ease-in-out flex flex-col items-center ${submittedSearch ? 'pt-6' : 'justify-center h-screen'}`}>

                {!submittedSearch && (
                    <div className="mb-8 flex flex-col items-center">
                        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tighter text-blue-500 mb-2">
                            Clinic<span className="text-foreground">Search</span>
                        </h1>
                    </div>
                )}

                <div className={`${submittedSearch ? 'w-full max-w-6xl px-4 flex gap-6 items-center border-b border-gray-200 dark:border-gray-800 pb-6' : 'w-full max-w-2xl px-4'}`}>
                    {submittedSearch && (
                        <h2 className="text-2xl font-semibold tracking-tighter text-blue-500 shrink-0 cursor-pointer" onClick={() => setSubmittedSearch('')}>
                            Clinic<span className="text-foreground">Search</span>
                        </h2>
                    )}
                    <form
                        onSubmit={handleSubmit}
                        className={`relative flex items-center w-full px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 hover:shadow-md focus-within:shadow-md transition-shadow bg-background ${submittedSearch ? 'max-w-3xl' : ''}`}
                    >
                        <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-3 h-[18px] w-[18px]" />
                        <input
                            type="text"
                            placeholder="Search patients authorization code"
                            className="flex-grow outline-none bg-transparent text-base"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <button type="submit" className="flex items-center justify-center cursor-pointer text-blue-500 hover:text-blue-600 transition-colors ml-3 outline-none focus:outline-none">
                            <span className="sr-only">Search</span>
                            <FontAwesomeIcon icon={faSearch} className="h-[18px] w-[18px]" />
                        </button>
                    </form>
                </div>

                {submittedSearch && (
                    <div className="w-full max-w-6xl px-4 mt-6 pb-12">
                        <PatientInfoDashboard patientID={submittedSearch} />
                    </div>
                )}
            </div>
        </div>
    )
}