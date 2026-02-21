"use client"

import { useState } from "react"
import PatientInfoDashboard from "@/components/PatientInfoDashboard"

export default function CinicPage() {
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
        <div>
            <div className="w-full h-screen p-4">
                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Search"
                        className="w-full h-10 border rounded px-3"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </form>
                {submittedSearch && (
                    <PatientInfoDashboard patientID={submittedSearch} />
                )}
            </div>
        </div>
    )
}