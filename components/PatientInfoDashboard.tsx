import PatientHistory from "@/components/PatientHistory"

export default function PatientInfoDashboard({ patientID }: { patientID: string }) {
    return (
        <div>
            <PatientHistory patientID={patientID} />
        </div>
    )
}