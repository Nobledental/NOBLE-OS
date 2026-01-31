// Comprehensive Diagnostic Knowledge Base for Oral Medicine
export interface DiagnosticRule {
    diagnosis: string;
    icd10Code: string;
    category: string;
    symptoms: string[];
    clinicalFindings: string[];
    vitalSigns?: string[];
    differentialScore: number; // Base confidence multiplier
}

export const diagnosticKnowledgeBase: DiagnosticRule[] = [
    // Pulpal Disorders
    {
        diagnosis: 'Reversible Pulpitis',
        icd10Code: 'K04.01',
        category: 'Pulpal',
        symptoms: ['sharp_pain', 'localized_pain', 'thermal_sensitivity', 'pain_with_cold', 'pain_with_sweet'],
        clinicalFindings: ['pain_subsides_instantly', 'stimulus_responsive', 'no_spontaneous_pain'],
        differentialScore: 0.85
    },
    {
        diagnosis: 'Irreversible Pulpitis',
        icd10Code: 'K04.02',
        category: 'Pulpal',
        symptoms: ['spontaneous_pain', 'throbbing_pain', 'radiating_pain', 'nocturnal_pain', 'lingering_pain'],
        clinicalFindings: ['pain_worse_lying_down', 'lingering_cold_pain', 'severe_pain'],
        differentialScore: 0.90
    },
    {
        diagnosis: 'Pulp Necrosis',
        icd10Code: 'K04.1',
        category: 'Pulpal',
        symptoms: ['no_pain', 'history_severe_pain', 'asymptomatic'],
        clinicalFindings: ['no_cold_response', 'negative_ept', 'discoloration'],
        differentialScore: 0.95
    },

    // Periapical Disorders
    {
        diagnosis: 'Acute Apical Periodontitis',
        icd10Code: 'K04.4',
        category: 'Periapical',
        symptoms: ['severe_pain_biting', 'pain_on_touch', 'high_tooth_sensation'],
        clinicalFindings: ['tender_to_percussion', 'no_swelling', 'localized_pain'],
        differentialScore: 0.88
    },
    {
        diagnosis: 'Periapical Abscess (Acute)',
        icd10Code: 'K04.7',
        category: 'Periapical',
        symptoms: ['severe_throbbing', 'swelling', 'pus_discharge', 'fever'],
        clinicalFindings: ['fluctuant_swelling', 'tender_to_percussion'],
        vitalSigns: ['elevated_temperature'],
        differentialScore: 0.92
    },
    {
        diagnosis: 'Chronic Apical Abscess',
        icd10Code: 'K04.6',
        category: 'Periapical',
        symptoms: ['painless_pimple', 'draining_sinus', 'mild_discomfort'],
        clinicalFindings: ['sinus_tract', 'periapical_radiolucency', 'no_acute_symptoms'],
        differentialScore: 0.87
    },

    // Periodontal Disorders
    {
        diagnosis: 'Pericoronitis',
        icd10Code: 'K05.22',
        category: 'Periodontal',
        symptoms: ['pain_wisdom_tooth', 'difficulty_opening_mouth', 'swelling_gums'],
        clinicalFindings: ['inflamed_operculum', 'partially_erupted_tooth', 'trismus'],
        differentialScore: 0.90
    },
    {
        diagnosis: 'Alveolar Osteitis (Dry Socket)',
        icd10Code: 'K04.7',
        category: 'Post-Surgical',
        symptoms: ['intense_boring_pain', 'pain_3_days_post_extraction', 'severe_pain'],
        clinicalFindings: ['empty_socket', 'exposed_bone', 'foul_odor', 'no_clot'],
        differentialScore: 0.93
    },
    {
        diagnosis: 'Gingivitis',
        icd10Code: 'K05.10',
        category: 'Periodontal',
        symptoms: ['bleeding_gums', 'red_gums', 'swollen_gums'],
        clinicalFindings: ['inflammation', 'no_pocket_depth', 'no_bone_loss'],
        differentialScore: 0.80
    },
    {
        diagnosis: 'Chronic Periodontitis',
        icd10Code: 'K05.30',
        category: 'Periodontal',
        symptoms: ['bleeding_gums', 'loose_teeth', 'bad_breath'],
        clinicalFindings: ['pocket_depth', 'bone_loss', 'tooth_mobility', 'calculus'],
        differentialScore: 0.85
    },

    // Hard Tissue
    {
        diagnosis: 'Dental Caries',
        icd10Code: 'K02.9',
        category: 'Hard Tissue',
        symptoms: ['sensitivity', 'pain_with_sweet', 'pain_with_cold'],
        clinicalFindings: ['cavity', 'decay', 'brown_lesion', 'softened_dentin'],
        differentialScore: 0.82
    },
    {
        diagnosis: 'Dentin Hypersensitivity',
        icd10Code: 'K03.8',
        category: 'Hard Tissue',
        symptoms: ['sharp_pain', 'thermal_sensitivity', 'pain_with_cold'],
        clinicalFindings: ['exposed_dentin', 'gingival_recession', 'no_cavity'],
        differentialScore: 0.78
    }
];

export interface DiagnosticInput {
    symptoms: string[];
    clinicalFindings: string[];
    vitalSigns?: string[];
}

export function provisionalDiagnosisEngine(input: DiagnosticInput) {
    const matches = diagnosticKnowledgeBase.map(rule => {
        let matchScore = 0;
        let totalCriteria = 0;

        // Score symptoms
        const symptomMatches = input.symptoms.filter(s => rule.symptoms.includes(s)).length;
        const symptomScore = rule.symptoms.length > 0 ? symptomMatches / rule.symptoms.length : 0;

        // Score clinical findings
        const findingMatches = input.clinicalFindings.filter(f => rule.clinicalFindings.includes(f)).length;
        const findingScore = rule.clinicalFindings.length > 0 ? findingMatches / rule.clinicalFindings.length : 0;

        // Score vital signs (if applicable)
        let vitalScore = 0;
        if (rule.vitalSigns && rule.vitalSigns.length > 0 && input.vitalSigns) {
            const vitalMatches = input.vitalSigns.filter(v => rule.vitalSigns!.includes(v)).length;
            vitalScore = vitalMatches / rule.vitalSigns.length;
            totalCriteria = 3;
            matchScore = (symptomScore + findingScore + vitalScore) / 3;
        } else {
            totalCriteria = 2;
            matchScore = (symptomScore + findingScore) / 2;
        }

        // Apply differential score multiplier
        const confidence = Math.min(matchScore * rule.differentialScore, 0.98);

        return {
            diagnosis: rule.diagnosis,
            icd_code: rule.icd10Code,
            category: rule.category,
            confidence,
            matchedSymptoms: symptomMatches,
            matchedFindings: findingMatches
        };
    }).filter(result => result.confidence > 0.3) // Only show meaningful matches
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5); // Top 5 diagnoses

    return matches;
}

export function searchDiagnosisBySymptom(symptom: string) {
    return diagnosticKnowledgeBase.filter(rule =>
        rule.symptoms.some(s => s.includes(symptom.toLowerCase())) ||
        rule.clinicalFindings.some(f => f.includes(symptom.toLowerCase()))
    );
}

export function getDiagnosisByICD10(code: string) {
    return diagnosticKnowledgeBase.find(rule => rule.icd10Code === code);
}
