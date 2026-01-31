/**
 * Phase 17: Multi-Decade Dental Health Tracker & FDI Chronology Engine
 * FDI numbering, eruption chronology, hygiene indices, and timeline events
 */

// =============================================================================
// FDI TOOTH NUMBERING SYSTEM
// =============================================================================

// Adult teeth: Quadrants 1-4 (11-18, 21-28, 31-38, 41-48)
// Primary teeth: Quadrants 5-8 (51-55, 61-65, 71-75, 81-85)

export type AdultTooth =
    | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18
    | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28
    | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38
    | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48;

export type PrimaryTooth =
    | 51 | 52 | 53 | 54 | 55
    | 61 | 62 | 63 | 64 | 65
    | 71 | 72 | 73 | 74 | 75
    | 81 | 82 | 83 | 84 | 85;

export type FDITooth = AdultTooth | PrimaryTooth;

export type DentitionStage = 'primary' | 'mixed' | 'permanent';
export type Gender = 'male' | 'female';

export interface ToothInfo {
    fdiNumber: FDITooth;
    name: string;
    type: 'incisor' | 'canine' | 'premolar' | 'molar';
    isPrimary: boolean;
    quadrant: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

// =============================================================================
// ERUPTION CHRONOLOGY (Gender-specific, in months)
// =============================================================================

export interface EruptionData {
    toothNumber: FDITooth;
    eruptionAgeMale: { min: number; max: number }; // in months
    eruptionAgeFemale: { min: number; max: number };
    sheddingAge?: { min: number; max: number }; // for primary teeth only
    successorTooth?: AdultTooth; // permanent tooth replacing primary
}

// Primary Teeth Eruption (FDI 51-85)
export const PRIMARY_ERUPTION_DATA: EruptionData[] = [
    // Central Incisors
    { toothNumber: 51, eruptionAgeMale: { min: 8, max: 12 }, eruptionAgeFemale: { min: 6, max: 10 }, sheddingAge: { min: 72, max: 84 }, successorTooth: 11 },
    { toothNumber: 61, eruptionAgeMale: { min: 8, max: 12 }, eruptionAgeFemale: { min: 6, max: 10 }, sheddingAge: { min: 72, max: 84 }, successorTooth: 21 },
    { toothNumber: 71, eruptionAgeMale: { min: 6, max: 10 }, eruptionAgeFemale: { min: 5, max: 8 }, sheddingAge: { min: 72, max: 84 }, successorTooth: 31 },
    { toothNumber: 81, eruptionAgeMale: { min: 6, max: 10 }, eruptionAgeFemale: { min: 5, max: 8 }, sheddingAge: { min: 72, max: 84 }, successorTooth: 41 },

    // Lateral Incisors
    { toothNumber: 52, eruptionAgeMale: { min: 9, max: 13 }, eruptionAgeFemale: { min: 8, max: 12 }, sheddingAge: { min: 84, max: 96 }, successorTooth: 12 },
    { toothNumber: 62, eruptionAgeMale: { min: 9, max: 13 }, eruptionAgeFemale: { min: 8, max: 12 }, sheddingAge: { min: 84, max: 96 }, successorTooth: 22 },
    { toothNumber: 72, eruptionAgeMale: { min: 7, max: 12 }, eruptionAgeFemale: { min: 6, max: 10 }, sheddingAge: { min: 84, max: 96 }, successorTooth: 32 },
    { toothNumber: 82, eruptionAgeMale: { min: 7, max: 12 }, eruptionAgeFemale: { min: 6, max: 10 }, sheddingAge: { min: 84, max: 96 }, successorTooth: 42 },

    // Canines
    { toothNumber: 53, eruptionAgeMale: { min: 16, max: 22 }, eruptionAgeFemale: { min: 14, max: 20 }, sheddingAge: { min: 120, max: 144 }, successorTooth: 13 },
    { toothNumber: 63, eruptionAgeMale: { min: 16, max: 22 }, eruptionAgeFemale: { min: 14, max: 20 }, sheddingAge: { min: 120, max: 144 }, successorTooth: 23 },
    { toothNumber: 73, eruptionAgeMale: { min: 17, max: 23 }, eruptionAgeFemale: { min: 15, max: 21 }, sheddingAge: { min: 108, max: 132 }, successorTooth: 33 },
    { toothNumber: 83, eruptionAgeMale: { min: 17, max: 23 }, eruptionAgeFemale: { min: 15, max: 21 }, sheddingAge: { min: 108, max: 132 }, successorTooth: 43 },

    // First Molars
    { toothNumber: 54, eruptionAgeMale: { min: 13, max: 19 }, eruptionAgeFemale: { min: 12, max: 18 }, sheddingAge: { min: 108, max: 132 }, successorTooth: 14 },
    { toothNumber: 64, eruptionAgeMale: { min: 13, max: 19 }, eruptionAgeFemale: { min: 12, max: 18 }, sheddingAge: { min: 108, max: 132 }, successorTooth: 24 },
    { toothNumber: 74, eruptionAgeMale: { min: 14, max: 18 }, eruptionAgeFemale: { min: 12, max: 18 }, sheddingAge: { min: 108, max: 132 }, successorTooth: 34 },
    { toothNumber: 84, eruptionAgeMale: { min: 14, max: 18 }, eruptionAgeFemale: { min: 12, max: 18 }, sheddingAge: { min: 108, max: 132 }, successorTooth: 44 },

    // Second Molars
    { toothNumber: 55, eruptionAgeMale: { min: 25, max: 33 }, eruptionAgeFemale: { min: 23, max: 31 }, sheddingAge: { min: 120, max: 144 }, successorTooth: 15 },
    { toothNumber: 65, eruptionAgeMale: { min: 25, max: 33 }, eruptionAgeFemale: { min: 23, max: 31 }, sheddingAge: { min: 120, max: 144 }, successorTooth: 25 },
    { toothNumber: 75, eruptionAgeMale: { min: 23, max: 31 }, eruptionAgeFemale: { min: 22, max: 30 }, sheddingAge: { min: 120, max: 144 }, successorTooth: 35 },
    { toothNumber: 85, eruptionAgeMale: { min: 23, max: 31 }, eruptionAgeFemale: { min: 22, max: 30 }, sheddingAge: { min: 120, max: 144 }, successorTooth: 45 },
];

// Permanent Teeth Eruption (FDI 11-48)
export const PERMANENT_ERUPTION_DATA: EruptionData[] = [
    // First Molars (6-year molars)
    { toothNumber: 16, eruptionAgeMale: { min: 72, max: 84 }, eruptionAgeFemale: { min: 66, max: 78 } },
    { toothNumber: 26, eruptionAgeMale: { min: 72, max: 84 }, eruptionAgeFemale: { min: 66, max: 78 } },
    { toothNumber: 36, eruptionAgeMale: { min: 72, max: 84 }, eruptionAgeFemale: { min: 66, max: 78 } },
    { toothNumber: 46, eruptionAgeMale: { min: 72, max: 84 }, eruptionAgeFemale: { min: 66, max: 78 } },

    // Central Incisors
    { toothNumber: 11, eruptionAgeMale: { min: 84, max: 96 }, eruptionAgeFemale: { min: 78, max: 90 } },
    { toothNumber: 21, eruptionAgeMale: { min: 84, max: 96 }, eruptionAgeFemale: { min: 78, max: 90 } },
    { toothNumber: 31, eruptionAgeMale: { min: 72, max: 84 }, eruptionAgeFemale: { min: 66, max: 78 } },
    { toothNumber: 41, eruptionAgeMale: { min: 72, max: 84 }, eruptionAgeFemale: { min: 66, max: 78 } },

    // Lateral Incisors
    { toothNumber: 12, eruptionAgeMale: { min: 96, max: 108 }, eruptionAgeFemale: { min: 90, max: 102 } },
    { toothNumber: 22, eruptionAgeMale: { min: 96, max: 108 }, eruptionAgeFemale: { min: 90, max: 102 } },
    { toothNumber: 32, eruptionAgeMale: { min: 84, max: 96 }, eruptionAgeFemale: { min: 78, max: 90 } },
    { toothNumber: 42, eruptionAgeMale: { min: 84, max: 96 }, eruptionAgeFemale: { min: 78, max: 90 } },

    // Canines
    { toothNumber: 13, eruptionAgeMale: { min: 132, max: 156 }, eruptionAgeFemale: { min: 120, max: 144 } },
    { toothNumber: 23, eruptionAgeMale: { min: 132, max: 156 }, eruptionAgeFemale: { min: 120, max: 144 } },
    { toothNumber: 33, eruptionAgeMale: { min: 108, max: 132 }, eruptionAgeFemale: { min: 102, max: 126 } },
    { toothNumber: 43, eruptionAgeMale: { min: 108, max: 132 }, eruptionAgeFemale: { min: 102, max: 126 } },

    // First Premolars
    { toothNumber: 14, eruptionAgeMale: { min: 120, max: 144 }, eruptionAgeFemale: { min: 114, max: 138 } },
    { toothNumber: 24, eruptionAgeMale: { min: 120, max: 144 }, eruptionAgeFemale: { min: 114, max: 138 } },
    { toothNumber: 34, eruptionAgeMale: { min: 120, max: 144 }, eruptionAgeFemale: { min: 114, max: 138 } },
    { toothNumber: 44, eruptionAgeMale: { min: 120, max: 144 }, eruptionAgeFemale: { min: 114, max: 138 } },

    // Second Premolars
    { toothNumber: 15, eruptionAgeMale: { min: 132, max: 156 }, eruptionAgeFemale: { min: 126, max: 150 } },
    { toothNumber: 25, eruptionAgeMale: { min: 132, max: 156 }, eruptionAgeFemale: { min: 126, max: 150 } },
    { toothNumber: 35, eruptionAgeMale: { min: 132, max: 156 }, eruptionAgeFemale: { min: 126, max: 150 } },
    { toothNumber: 45, eruptionAgeMale: { min: 132, max: 156 }, eruptionAgeFemale: { min: 126, max: 150 } },

    // Second Molars (12-year molars)
    { toothNumber: 17, eruptionAgeMale: { min: 144, max: 168 }, eruptionAgeFemale: { min: 138, max: 162 } },
    { toothNumber: 27, eruptionAgeMale: { min: 144, max: 168 }, eruptionAgeFemale: { min: 138, max: 162 } },
    { toothNumber: 37, eruptionAgeMale: { min: 144, max: 168 }, eruptionAgeFemale: { min: 138, max: 162 } },
    { toothNumber: 47, eruptionAgeMale: { min: 144, max: 168 }, eruptionAgeFemale: { min: 138, max: 162 } },

    // Third Molars (Wisdom teeth)
    { toothNumber: 18, eruptionAgeMale: { min: 204, max: 300 }, eruptionAgeFemale: { min: 204, max: 300 } },
    { toothNumber: 28, eruptionAgeMale: { min: 204, max: 300 }, eruptionAgeFemale: { min: 204, max: 300 } },
    { toothNumber: 38, eruptionAgeMale: { min: 204, max: 300 }, eruptionAgeFemale: { min: 204, max: 300 } },
    { toothNumber: 48, eruptionAgeMale: { min: 204, max: 300 }, eruptionAgeFemale: { min: 204, max: 300 } },
];

// =============================================================================
// ERUPTION PREDICTION FUNCTIONS
// =============================================================================

export interface EruptionPrediction {
    toothNumber: FDITooth;
    status: 'erupted' | 'erupting' | 'expected_soon' | 'future';
    expectedAgeRange: string;
    message: string;
}

export function getExpectedEruptions(
    ageInMonths: number,
    gender: Gender
): EruptionPrediction[] {
    const predictions: EruptionPrediction[] = [];
    const allData = [...PRIMARY_ERUPTION_DATA, ...PERMANENT_ERUPTION_DATA];

    for (const data of allData) {
        const ageRange = gender === 'male' ? data.eruptionAgeMale : data.eruptionAgeFemale;

        let status: EruptionPrediction['status'];
        let message: string;

        if (ageInMonths > ageRange.max + 12) {
            status = 'erupted';
            message = 'Should be present';
        } else if (ageInMonths >= ageRange.min && ageInMonths <= ageRange.max) {
            status = 'erupting';
            message = 'Currently erupting';
        } else if (ageInMonths >= ageRange.min - 6 && ageInMonths < ageRange.min) {
            status = 'expected_soon';
            message = 'Expected within 6 months';
        } else {
            status = 'future';
            message = `Expected at ${Math.round(ageRange.min / 12)}-${Math.round(ageRange.max / 12)} years`;
        }

        predictions.push({
            toothNumber: data.toothNumber,
            status,
            expectedAgeRange: `${Math.round(ageRange.min / 12)}-${Math.round(ageRange.max / 12)} years`,
            message
        });
    }

    return predictions;
}

export function getDentitionStage(ageInMonths: number): DentitionStage {
    if (ageInMonths < 72) return 'primary'; // < 6 years
    if (ageInMonths < 156) return 'mixed'; // 6-13 years
    return 'permanent'; // 13+ years
}

export function getExpectedSheddingTeeth(ageInMonths: number, gender: Gender): PrimaryTooth[] {
    const shedding: PrimaryTooth[] = [];

    for (const data of PRIMARY_ERUPTION_DATA) {
        if (data.sheddingAge) {
            if (ageInMonths >= data.sheddingAge.min - 6 && ageInMonths <= data.sheddingAge.max + 6) {
                shedding.push(data.toothNumber as PrimaryTooth);
            }
        }
    }

    return shedding;
}

// =============================================================================
// OHI-S (Simplified Oral Hygiene Index)
// =============================================================================

export type OHIScore = 0 | 1 | 2 | 3;

// Index teeth for OHI-S
export const OHI_INDEX_TEETH = {
    debris: [16, 11, 26, 36, 31, 46] as AdultTooth[], // Buccal: 16, 11, 26, 31; Lingual: 36, 46
    calculus: [16, 11, 26, 36, 31, 46] as AdultTooth[]
};

export interface OHISResult {
    debrisScores: Record<number, OHIScore>;
    calculusScores: Record<number, OHIScore>;
    debrisIndex: number; // DI-S (0-3)
    calculusIndex: number; // CI-S (0-3)
    ohisTotal: number; // OHI-S (0-6)
    interpretation: 'Good' | 'Fair' | 'Poor';
    recommendation: string;
}

export function calculateOHIS(
    debrisScores: Record<number, OHIScore>,
    calculusScores: Record<number, OHIScore>
): OHISResult {
    const debrisValues = Object.values(debrisScores);
    const calculusValues = Object.values(calculusScores);

    const debrisIndex = debrisValues.reduce((a, b) => a + b, 0) / debrisValues.length;
    const calculusIndex = calculusValues.reduce((a, b) => a + b, 0) / calculusValues.length;
    const ohisTotal = debrisIndex + calculusIndex;

    let interpretation: OHISResult['interpretation'];
    let recommendation: string;

    if (ohisTotal <= 1.2) {
        interpretation = 'Good';
        recommendation = '6-monthly recall, continue current hygiene routine';
    } else if (ohisTotal <= 3.0) {
        interpretation = 'Fair';
        recommendation = 'Scaling, OHI reinforcement, 3-month recall';
    } else {
        interpretation = 'Poor';
        recommendation = 'Urgent scaling, intensive OHI, monthly follow-up';
    }

    return {
        debrisScores,
        calculusScores,
        debrisIndex: Math.round(debrisIndex * 100) / 100,
        calculusIndex: Math.round(calculusIndex * 100) / 100,
        ohisTotal: Math.round(ohisTotal * 100) / 100,
        interpretation,
        recommendation
    };
}

// =============================================================================
// VMI (Volpe-Manhold Index) - Lower Lingual Calculus
// =============================================================================

export interface VMIResult {
    measurements: Record<number, number>; // tooth -> mm measurement
    totalScore: number;
    severity: 'Minimal' | 'Mild' | 'Moderate' | 'Heavy';
    recommendation: string;
}

// VMI is measured on lower lingual incisors (31, 32, 41, 42)
export const VMI_INDEX_TEETH = [31, 32, 41, 42] as AdultTooth[];

export function calculateVMI(measurements: Record<number, number>): VMIResult {
    const total = Object.values(measurements).reduce((a, b) => a + b, 0);

    let severity: VMIResult['severity'];
    let recommendation: string;

    if (total <= 1) {
        severity = 'Minimal';
        recommendation = 'Routine prophylaxis';
    } else if (total <= 3) {
        severity = 'Mild';
        recommendation = 'Scaling, improve lingual brushing';
    } else if (total <= 6) {
        severity = 'Moderate';
        recommendation = 'Thorough scaling, electric toothbrush recommended';
    } else {
        severity = 'Heavy';
        recommendation = 'Ultrasonic scaling, tobacco cessation if applicable';
    }

    return {
        measurements,
        totalScore: Math.round(total * 10) / 10,
        severity,
        recommendation
    };
}

// =============================================================================
// SMOKING INDEX
// =============================================================================

export interface SmokingIndexResult {
    cigarettesPerDay: number;
    yearsOfSmoking: number;
    smokingIndex: number;
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
    perioRisk: string;
    oralCancerRisk: string;
}

export function calculateSmokingIndex(
    cigarettesPerDay: number,
    yearsOfSmoking: number
): SmokingIndexResult {
    const si = cigarettesPerDay * yearsOfSmoking;

    let riskLevel: SmokingIndexResult['riskLevel'];
    let perioRisk: string;
    let oralCancerRisk: string;

    if (si === 0) {
        riskLevel = 'Low';
        perioRisk = 'No tobacco-related perio risk';
        oralCancerRisk = 'Baseline risk';
    } else if (si < 100) {
        riskLevel = 'Moderate';
        perioRisk = '2x increased risk of periodontitis';
        oralCancerRisk = 'Elevated risk - annual screening';
    } else if (si < 200) {
        riskLevel = 'High';
        perioRisk = '4x increased risk, aggressive perio likely';
        oralCancerRisk = 'High risk - biannual screening mandatory';
    } else {
        riskLevel = 'Very High';
        perioRisk = '6x+ risk, treatment prognosis guarded';
        oralCancerRisk = 'CRITICAL - immediate biopsy for any suspicious lesion';
    }

    return {
        cigarettesPerDay,
        yearsOfSmoking,
        smokingIndex: si,
        riskLevel,
        perioRisk,
        oralCancerRisk
    };
}

// =============================================================================
// CAIRO RECESSION CLASSIFICATION (replaces Miller's)
// =============================================================================

export type CairoRT = 'RT1' | 'RT2' | 'RT3';

export interface CairoRecessionResult {
    toothNumber: number;
    classification: CairoRT;
    description: string;
    prognosis: string;
    suggestedTreatment: string;
}

export function classifyCairoRecession(
    hasInterdentalAttachmentLoss: boolean,
    recessionExtendsToMGJ: boolean
): CairoRecessionResult['classification'] {
    if (!hasInterdentalAttachmentLoss) {
        return 'RT1'; // No interproximal CAL loss
    }
    if (recessionExtendsToMGJ) {
        return 'RT3'; // Interproximal CAL > buccal
    }
    return 'RT2'; // Interproximal CAL ≤ buccal
}

export function getCairoRecessionDetails(
    toothNumber: number,
    classification: CairoRT
): CairoRecessionResult {
    const details: Record<CairoRT, Omit<CairoRecessionResult, 'toothNumber' | 'classification'>> = {
        'RT1': {
            description: 'No interproximal attachment loss',
            prognosis: 'Excellent - 100% root coverage possible',
            suggestedTreatment: 'Connective tissue graft or coronally advanced flap'
        },
        'RT2': {
            description: 'Interproximal CAL ≤ buccal CAL',
            prognosis: 'Good - partial root coverage expected',
            suggestedTreatment: 'CTG + CAF, manage expectations'
        },
        'RT3': {
            description: 'Interproximal CAL > buccal CAL',
            prognosis: 'Limited - minimal root coverage possible',
            suggestedTreatment: 'Consider restorative option (GIC), periodontal referral'
        }
    };

    return {
        toothNumber,
        classification,
        ...details[classification]
    };
}

// =============================================================================
// TIMELINE EVENT SCHEMA
// =============================================================================

export interface DentalSnapshot {
    date: string;
    ageInMonths: number;
    dmft: { d: number; m: number; f: number; total: number };
    ohis?: OHISResult;
    smokingIndex?: SmokingIndexResult;
    psr?: [number, number, number, number, number, number];
    notes: string;
}

export interface TimelineEvent {
    id: string;
    patientId: string;
    eventDate: string;
    eventType: 'checkup' | 'treatment' | 'surgery' | 'emergency';
    ageAtEvent: number; // in years
    snapshot: DentalSnapshot;
    fdiChartState: Record<number, string>; // tooth -> status
    provider: string;
}

export interface LifelongTimeline {
    patientId: string;
    dateOfBirth: string;
    gender: Gender;
    events: TimelineEvent[];
    trendData: {
        dates: string[];
        dmft: number[];
        ohis: number[];
    };
}

// =============================================================================
// TREND CALCULATION
// =============================================================================

export function calculateTrendData(events: TimelineEvent[]): LifelongTimeline['trendData'] {
    const sorted = [...events].sort((a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );

    return {
        dates: sorted.map(e => e.eventDate),
        dmft: sorted.map(e => e.snapshot.dmft.total),
        ohis: sorted.map(e => e.snapshot.ohis?.ohisTotal || 0)
    };
}

export function getAgeStageLabel(ageInMonths: number): string {
    if (ageInMonths < 6) return 'Infant';
    if (ageInMonths < 36) return 'Primary Eruption (6mo-3yrs)';
    if (ageInMonths < 72) return 'Complete Primary (3-6yrs)';
    if (ageInMonths < 144) return 'Mixed Dentition (6-12yrs)';
    if (ageInMonths < 300) return 'Permanent Dentition (12-25yrs)';
    if (ageInMonths < 480) return 'Early Adult Maintenance (25-40yrs)';
    return 'Mature Maintenance (40+yrs)';
}
