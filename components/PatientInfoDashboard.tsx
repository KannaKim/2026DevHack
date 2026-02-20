import PatientHistory from "@/components/PatientHistory"

export default function PatientInfoDashboard({ patientID }: { patientID: string }) {
    return (
        <div>
            <span> For PatientID: {patientID}</span>
            <PatientHistory patientID={patientID} />
        </div>
    )
}