type HistoryRecord = {
    id: string
    date: string
    diagnosis: string
    prescription: string
    notes?: string
}

// Temporary stub data
const getStubHistory = (patientID: string): HistoryRecord[] => {
    return [
        {
            id: '1',
            date: '2024-02-15',
            diagnosis: 'Hypertension',
            prescription: 'Lisinopril 10mg daily',
            notes: 'Patient reported occasional headaches. Advised to monitor BP.'
        },
        {
            id: '2',
            date: '2023-10-05',
            diagnosis: 'Type 2 Diabetes',
            prescription: 'Metformin 500mg twice daily',
            notes: 'Initial diagnosis. Diet and exercise plan discussed.'
        },
        {
            id: '3',
            date: '2023-01-20',
            diagnosis: 'Acute Bronchitis',
            prescription: 'Azithromycin 250mg 5-day course',
        }
    ]
}

export default function PatientHistory({ patientID }: { patientID: string }) {
    const history = getStubHistory(patientID)

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Patient History (ID: {patientID})</h2>

            <div className="space-y-4">
                {history.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4 shadow-sm bg-white">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-lg text-blue-800">{record.diagnosis}</h3>
                            <span className="text-sm text-gray-500">{record.date}</span>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-start">
                                <span className="font-medium w-24 text-gray-700">Prescription:</span>
                                <span className="text-gray-900">{record.prescription}</span>
                            </div>

                            {record.notes && (
                                <div className="flex items-start">
                                    <span className="font-medium w-24 text-gray-700">Notes:</span>
                                    <span className="text-gray-600 italic">{record.notes}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {history.length === 0 && (
                <p className="text-gray-500 italic">No history records found for this patient.</p>
            )}
        </div>
    )
}