/**
 * Phase 15: Periodontal Charting & Surgery Suite
 * TypeScript interfaces for periodontal assessment data
 */

export type MobilityGrade = 0 | 1 | 2 | 3;
export type FurcationClass = 0 | 1 | 2 | 3;
export type AAPStage = 'I' | 'II' | 'III' | 'IV';
export type AAPGrade = 'A' | 'B' | 'C';
export type SurgeryProcedure = 'SRP' | 'GINGIVECTOMY' | 'FLAP' | 'MUCOGINGIVAL_GRAFT' | 'BONE_GRAFT' | 'GTR';
export type SutureMaterial = '3-0 Silk' | '4-0 Vicryl' | '5-0 Vicryl' | '4-0 Chromic' | '5-0 Prolene';

// 6-point probing data per tooth
export interface ProbingSite {
    depth: number; // Probing Depth in mm
    cal?: number; // Clinical Attachment Level (optional)
    bop: boolean; // Bleeding on Probing
    recession?: number; // Gingival recession in mm
}

// Full probing record for one tooth (6 sites)
export interface ToothProbingData {
    toothNumber: number;
    // Buccal sites (Mesial-Buccal, Mid-Buccal, Distal-Buccal)
    buccalMesial: ProbingSite;
    buccalMid: ProbingSite;
    buccalDistal: ProbingSite;
    // Lingual/Palatal sites (Mesial-Lingual, Mid-Lingual, Distal-Lingual)
    lingualMesial: ProbingSite;
    lingualMid: ProbingSite;
    lingualDistal: ProbingSite;
    // Additional tooth-level data
    mobility: MobilityGrade;
    furcation: FurcationClass;
    plaque: boolean;
    calculus: boolean;
    suppuration: boolean;
}

export interface PeriodontalChart {
    chartDate: string;
    examiner: string;
    teeth: ToothProbingData[];
    // Summary metrics
    totalSites: number;
    sitesWithPD4plus: number;
    sitesWithPD5plus: number;
    bopPercentage: number;
    // AAP Classification
    aapStage?: AAPStage;
    aapGrade?: AAPGrade;
    isActive: boolean; // BOP > 10%
}

export interface SurgeryRecord {
    id: string;
    date: string;
    procedure: SurgeryProcedure;
    teethInvolved: number[];
    quadrant?: 'UR' | 'UL' | 'LR' | 'LL';
    sutureMaterial?: SutureMaterial;
    sutureRemovalDate?: string;
    notes: string;
    complications?: string;
}

export interface PerioMetadata {
    charts: PeriodontalChart[];
    surgeries: SurgeryRecord[];
    treatmentPlan?: string[];
    alerts: PeriodontalAlert[];
}

export interface PeriodontalAlert {
    type: 'PD_CRITICAL' | 'BOP_HIGH' | 'MOBILITY_III' | 'FURCATION_III';
    toothNumber?: number;
    message: string;
    suggestedAction: string;
    severity: 'warning' | 'critical';
}

// Probing site order for snake-path navigation
export const SITE_ORDER: (keyof Omit<ToothProbingData, 'toothNumber' | 'mobility' | 'furcation' | 'plaque' | 'calculus' | 'suppuration'>)[] = [
    'buccalMesial', 'buccalMid', 'buccalDistal',
    'lingualDistal', 'lingualMid', 'lingualMesial'
];

// FDI tooth numbering (upper right → upper left → lower left → lower right)
export const TOOTH_ORDER_UPPER = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
export const TOOTH_ORDER_LOWER = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

// Color coding thresholds
export function getProbingDepthColor(depth: number): string {
    if (depth <= 3) return '#22c55e'; // Green - Healthy
    if (depth === 4) return '#eab308'; // Yellow - Gingivitis
    return '#ef4444'; // Red - Periodontitis
}

// AAP Staging based on interdental CAL and bone loss
export function calculateAAPStage(maxCAL: number, boneLossPercent?: number): AAPStage {
    if (maxCAL <= 2) return 'I';
    if (maxCAL <= 4) return 'II';
    if (maxCAL <= 5 || (boneLossPercent && boneLossPercent < 50)) return 'III';
    return 'IV'; // CAL > 5mm or bone loss > 50%
}

// AAP Grading based on progression rate
export function calculateAAPGrade(boneLossPerYear?: number, diabetes?: boolean, smoking?: boolean): AAPGrade {
    if (smoking) return 'C'; // Smoking = Grade C (rapid progression risk)
    if (diabetes) return 'B'; // Diabetes = Grade B (moderate risk)
    if (boneLossPerYear && boneLossPerYear > 2) return 'C';
    if (boneLossPerYear && boneLossPerYear > 0.5) return 'B';
    return 'A'; // Slow progression
}

// Create empty probing site
export function createEmptyProbingSite(): ProbingSite {
    return { depth: 0, bop: false };
}

// Create empty tooth probing data
export function createEmptyToothData(toothNumber: number): ToothProbingData {
    return {
        toothNumber,
        buccalMesial: createEmptyProbingSite(),
        buccalMid: createEmptyProbingSite(),
        buccalDistal: createEmptyProbingSite(),
        lingualMesial: createEmptyProbingSite(),
        lingualMid: createEmptyProbingSite(),
        lingualDistal: createEmptyProbingSite(),
        mobility: 0,
        furcation: 0,
        plaque: false,
        calculus: false,
        suppuration: false
    };
}

// Calculate chart summary metrics
export function calculateChartSummary(teeth: ToothProbingData[]): {
    totalSites: number;
    sitesWithPD4plus: number;
    sitesWithPD5plus: number;
    bopPercentage: number;
    bopCount: number;
} {
    let totalSites = 0;
    let sitesWithPD4plus = 0;
    let sitesWithPD5plus = 0;
    let bopCount = 0;

    teeth.forEach(tooth => {
        const sites = [
            tooth.buccalMesial, tooth.buccalMid, tooth.buccalDistal,
            tooth.lingualMesial, tooth.lingualMid, tooth.lingualDistal
        ];

        sites.forEach(site => {
            if (site.depth > 0) {
                totalSites++;
                if (site.depth >= 4) sitesWithPD4plus++;
                if (site.depth >= 5) sitesWithPD5plus++;
                if (site.bop) bopCount++;
            }
        });
    });

    return {
        totalSites,
        sitesWithPD4plus,
        sitesWithPD5plus,
        bopCount,
        bopPercentage: totalSites > 0 ? Math.round((bopCount / totalSites) * 100) : 0
    };
}

// Generate alerts based on chart data
export function generatePerioAlerts(teeth: ToothProbingData[]): PeriodontalAlert[] {
    const alerts: PeriodontalAlert[] = [];

    teeth.forEach(tooth => {
        const sites = [
            tooth.buccalMesial, tooth.buccalMid, tooth.buccalDistal,
            tooth.lingualMesial, tooth.lingualMid, tooth.lingualDistal
        ];

        // Check for deep pockets
        const maxPD = Math.max(...sites.map(s => s.depth));
        if (maxPD >= 5) {
            alerts.push({
                type: 'PD_CRITICAL',
                toothNumber: tooth.toothNumber,
                message: `Tooth #${tooth.toothNumber}: PD ${maxPD}mm`,
                suggestedAction: maxPD >= 7 ? 'Flap Surgery recommended' : 'Deep Scaling / SRP required',
                severity: maxPD >= 7 ? 'critical' : 'warning'
            });
        }

        // Check mobility
        if (tooth.mobility >= 3) {
            alerts.push({
                type: 'MOBILITY_III',
                toothNumber: tooth.toothNumber,
                message: `Tooth #${tooth.toothNumber}: Class III Mobility`,
                suggestedAction: 'Consider Extraction or Splinting',
                severity: 'critical'
            });
        }

        // Check furcation
        if (tooth.furcation >= 3) {
            alerts.push({
                type: 'FURCATION_III',
                toothNumber: tooth.toothNumber,
                message: `Tooth #${tooth.toothNumber}: Class III Furcation`,
                suggestedAction: 'Hemisection, Root Amputation, or Extraction',
                severity: 'critical'
            });
        }
    });

    return alerts;
}
