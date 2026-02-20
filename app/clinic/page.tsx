"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import PatientInfoDashboard from "../components/PatientInfoDashboard"

export default function ClinicPage() {
    const searchParams = useSearchParams()
    const [search, setSearch] = useState('')

    const handleSearch = (term: string) => {
        setSearch(term)
        console.log(search)
    }

    return (
        <div>
            <div className="w-full h-screen p-4">
                <input
                    placeholder="Search"
                    className="w-full h-10 border rounded px-3"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <PatientInfoDashboard />
        </div>
    )
}