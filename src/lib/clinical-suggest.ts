"use client";

export interface ClinicalSuggestion {
    id: string;
    label: string;
    value: string;
    category: 'complaint' | 'diagnosis' | 'observation' | 'procedure' | 'advice';
}

export const CLINICAL_SUGGESTIONS: ClinicalSuggestion[] = [
    // Chief Complaints
    { id: 'cc-1', label: 'Acute Toothache', value: 'Acute toothache in the upper/lower jaw.', category: 'complaint' },
    { id: 'cc-2', label: 'Pulsating Pain', value: 'Pulsating pain, worsens at night.', category: 'complaint' },
    { id: 'cc-3', label: 'Sensitivity (Cold)', value: 'Extreme sensitivity to cold liquids.', category: 'complaint' },
    { id: 'cc-4', label: 'Bleeding Gums', value: 'Bleeding while brushing or flossing.', category: 'complaint' },
    { id: 'cc-5', label: 'Mobile Tooth', value: 'Loose tooth noted by the patient.', category: 'complaint' },
    { id: 'cc-6', label: 'Fractured Tooth', value: 'Fractured front/back tooth due to trauma/eating.', category: 'complaint' },

    // Findings / Diagnosis
    { id: 'dx-1', label: 'Deep Carious Lesion', value: 'Deep carious lesion involving dentin.', category: 'diagnosis' },
    { id: 'dx-2', label: 'Irreversible Pulpitis', value: 'Symptomatic Irreversible Pulpitis.', category: 'diagnosis' },
    { id: 'dx-3', label: 'Chronic Periodontitis', value: 'Generalized Chronic Periodontitis.', category: 'diagnosis' },
    { id: 'dx-4', label: 'Impacted Molar', value: 'Surgically impacted third molar.', category: 'diagnosis' },
    { id: 'dx-5', label: 'Periapical Abscess', value: 'Acute periapical abscess with localized swelling.', category: 'diagnosis' },

    // Advice / Instructions
    { id: 'adv-1', label: 'Extraction Care', value: 'Bite on gauze for 45 mins. Soft, cold diet for 24h. No spitting.', category: 'advice' },
    { id: 'adv-2', label: 'RCT Care', value: 'Avoid chewing on the treated side until the crown is fixed.', category: 'advice' },
    { id: 'adv-3', label: 'Scaling Care', value: 'Slight sensitivity is normal. Use warm salt water rinses.', category: 'advice' }
];

export interface ClinicalTemplate {
    id: string;
    name: string;
    description: string;
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    advice?: string;
}

export const CLINICAL_TEMPLATES: ClinicalTemplate[] = [
    {
        id: 'extraction-protocol',
        name: 'Standard Extraction',
        description: 'Routine tooth removal protocol',
        subjective: 'Patient reports persistent pain and decay. Desires removal.',
        objective: 'Deep decay noted, tooth non-restorable. No localized swelling.',
        assessment: 'Non-restorable carious tooth.',
        plan: 'Extraction under LA (2% Lignocaine). Sutures as needed.',
        advice: 'Bite on gauze for 45 mins. No spitting, no smoking. Soft cold diet.'
    },
    {
        id: 'rct-first-visit',
        name: 'RCT (First Visit)',
        description: 'Initiating Root Canal Treatment',
        subjective: 'Sharp throbbing pain, keeps patient awake at night.',
        objective: 'Tender on percussion. Deep caries on occlusal surface.',
        assessment: 'Acute Irreversible Pulpitis.',
        plan: 'Access opening, BMP, and pulp extirpation. Ca(OH)2 dressing.',
        advice: 'Avoid chewing on this side. Mild soreness is normal.'
    },
    {
        id: 'scaling-prophy',
        name: 'Scaling & Prophylaxis',
        description: 'Routine cleaning protocol',
        subjective: 'Patient complains of bleeding gums and deposits.',
        objective: 'Generalized supra and sub-gingival calculus. Gingival inflammation.',
        assessment: 'Chronic Generalized Gingivitis.',
        plan: 'Full mouth scaling and polishing.',
        advice: 'Warm salt water rinses 2-3 times daily for 3 days.'
    }
];
