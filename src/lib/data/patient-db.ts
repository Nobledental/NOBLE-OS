// Mock Patient Database
export interface PatientFile {
    id: string;
    name: string;
    type: 'xray' | 'report' | 'prescription' | 'consent';
    date: string;
    size: string;
}

export interface PatientRecord {
    id: string;
    healthFloId: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female';
    phone: string;
    lastVisit: string;
    status: 'Active' | 'Inactive';
    files: PatientFile[];
    history: { date: string; treatment: string; doctor: string }[];
}

export const MOCK_PATIENT_DB: PatientRecord[] = [
    {
        id: 'P001',
        healthFloId: 'HFLO-8821',
        name: 'John Doe',
        age: 34,
        gender: 'Male',
        phone: '+91 98765 43210',
        lastVisit: '2024-02-01',
        status: 'Active',
        files: [
            { id: 'F01', name: 'OPG_Full_Mouth.jpg', type: 'xray', date: '2024-02-01', size: '2.4 MB' },
            { id: 'F02', name: 'Blood_Report.pdf', type: 'report', date: '2024-01-15', size: '1.1 MB' }
        ],
        history: [
            { date: '2024-02-01', treatment: 'Root Canal Treatment', doctor: 'Dr. Dhivakaran' },
            { date: '2024-01-15', treatment: 'Consultation', doctor: 'Dr. Dhivakaran' }
        ]
    },
    {
        id: 'P002',
        healthFloId: 'HFLO-9932',
        name: 'Jane Smith',
        age: 28,
        gender: 'Female',
        phone: '+91 91234 56789',
        lastVisit: '2023-12-10',
        status: 'Inactive',
        files: [
            { id: 'F03', name: 'Prescription_Dec10.pdf', type: 'prescription', date: '2023-12-10', size: '0.5 MB' }
        ],
        history: [
            { date: '2023-12-10', treatment: 'Scaling', doctor: 'Dr. Sarah' }
        ]
    }
];
