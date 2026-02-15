export type ToothStatus = 'healthy' | 'decayed' | 'restored' | 'missing' | 'rct' | 'impacted' | 'crown' | 'bridge';

export interface ToothSurface {
    m: boolean; // Mesial
    d: boolean; // Distal
    o: boolean; // Occlusal/Incisal
    b: boolean; // Buccal/Facial
    l: boolean; // Lingual/Palatal
}

export interface ToothState {
    id: string; // FDI Notation (e.g., "11", "48")
    surfaces: ToothSurface;
    status: ToothStatus;
    notes?: string;
    procedures?: string[];
}

export interface DentalChartState {
    teeth: Record<string, ToothState>;
    lastUpdated: string;
}

export const INITIAL_TOOTH_STATE = (id: string): ToothState => ({
    id,
    surfaces: { m: false, d: false, o: false, b: false, l: false },
    status: 'healthy',
});

export const FDI_PERMANENT_TEETH = {
    UR: ["18", "17", "16", "15", "14", "13", "12", "11"],
    UL: ["21", "22", "23", "24", "25", "26", "27", "28"],
    LL: ["31", "32", "33", "34", "35", "36", "37", "38"],
    LR: ["48", "47", "46", "45", "44", "43", "42", "41"],
};

export const FDI_DECIDUOUS_TEETH = {
    UR: ["55", "54", "53", "52", "51"],
    UL: ["61", "62", "63", "64", "65"],
    LL: ["71", "72", "73", "74", "75"],
    LR: ["85", "84", "83", "82", "81"],
};

export type DentitionMode = 'ADULT' | 'CHILD' | 'MIXED';

/** Compute dentition mode from patient age */
export function getDentitionMode(age: number): DentitionMode {
    if (age < 6) return 'CHILD';
    if (age < 13) return 'MIXED';
    return 'ADULT';
}

export interface ConsentTemplate {
    id: string;
    title: string;
    description: string;
    risks: string[];
    alternatives: string[];
    acknowledgement: string;
}

export interface ConsentRecord {
    id: string;
    patientId: string;
    templateId: string;
    doctorSignature?: string; // Base64 image
    patientSignature?: string; // Base64 image
    witnessSignature?: string; // Base64 image
    timestamp: string;
    status: 'pending' | 'signed' | 'revoked';
}

export const DENTAL_CONSENT_TEMPLATES: ConsentTemplate[] = [
    {
        id: 'extraction',
        title: 'Tooth Extraction Consent',
        description: 'Removal of one or more teeth due to decay, infection, or orthodontic reasons.',
        risks: [
            'Pain, swelling, and bruising',
            'Dry socket (clot loss)',
            'Possible infection requiring antibiotics',
            'Nerve proximity (temporary/permanent numbness)',
            'Sinus involvement (for upper teeth)'
        ],
        alternatives: ['Root Canal Treatment (if possible)', 'Dental Bridge/Implant (after loss)', 'No treatment (risk of infection spread)'],
        acknowledgement: 'I understand the risks and alternatives. I consent to the extraction and the use of local anesthesia.'
    },
    {
        id: 'rct',
        title: 'Root Canal Treatment (RCT) Consent',
        description: 'Clearing infection from the pulp and root of the tooth to save it.',
        risks: [
            'Discomfort or sensitivity for a few days',
            'Instrument separation (broken file in root)',
            'Perforation of the root canal',
            'Re-infection requiring re-treatment or extraction'
        ],
        alternatives: ['Extraction', 'No treatment (loss of tooth)'],
        acknowledgement: 'I understand that RCT aims to save the tooth but success cannot be guaranteed. I consent to the procedure.'
    },
    {
        id: 'implant',
        title: 'Dental Implant Consent',
        description: 'Surgical placement of an artificial root (titanium/zirconia) into the jawbone.',
        risks: [
            'Implant failure (non-integration)',
            'Infection around the implant',
            'Nerve damage (numbness)',
            'Sinus perforation',
            'Bone loss over time'
        ],
        alternatives: ['Fixed Bridge', 'Removable Dentures', 'No treatment'],
        acknowledgement: 'I understand that implant success depends on bone health and hygiene. I consent to the surgery.'
    }
];
