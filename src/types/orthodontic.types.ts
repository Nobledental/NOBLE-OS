/**
 * Phase 13: Orthodontic Case Study & Cephalometric Engine
 * TypeScript interfaces for orthodontic analysis data structures
 */

export type LandmarkName = 'S' | 'N' | 'A' | 'B' | 'Or' | 'Po' | 'Go' | 'Gn';
export type SkeletalClass = 'Class I' | 'Class II' | 'Class III';
export type VerticalPattern = 'Normal' | 'High Angle' | 'Low Angle';
export type ProfileType = 'Convex' | 'Concave' | 'Straight';
export type WireType = 'NiTi' | 'SS' | 'TMA';
export type MilestoneType = 'BONDING' | 'WIRE_CHANGE' | 'ELASTICS' | 'DEBONDING' | 'ADJUSTMENT';
export type TreatmentRecommendation = 'Extraction' | 'Expansion' | 'IPR' | 'None';

export interface Point {
    x: number;
    y: number;
}

export interface CephalometricLandmark {
    id: string;
    name: LandmarkName;
    x: number;
    y: number;
    label: string;
}

export interface CephalometricAngles {
    SNA: number;
    SNB: number;
    ANB: number;
    FMA: number;
    skeletalClass: SkeletalClass;
    verticalPattern: VerticalPattern;
    calculatedAt: string;
}

export interface ProfileAnalysis {
    nasolabialAngle: number;
    eLineUpperLip: number; // mm from E-Line (positive = protrusive)
    eLineLowerLip: number; // mm from E-Line
    profileType: ProfileType;
    photoAssetId?: string;
}

export interface ToothMeasurement {
    toothNumber: number;
    mesiodistalWidth: number; // mm
}

export interface ALDCalculation {
    upperArchRequired: number; // mm
    upperArchAvailable: number; // mm
    lowerArchRequired: number; // mm
    lowerArchAvailable: number; // mm
    upperDiscrepancy: number; // mm (negative = crowding)
    lowerDiscrepancy: number; // mm
    recommendation: TreatmentRecommendation;
    notes?: string;
}

export interface ApplianceMilestone {
    id: string;
    date: string;
    type: MilestoneType;
    wireType?: WireType;
    arch?: 'Upper' | 'Lower' | 'Both';
    elasticsConfiguration?: string;
    notes: string;
    photoAssetIds?: string[];
}

export interface OrthodonticMetadata {
    cephalometricLandmarks: CephalometricLandmark[];
    angles?: CephalometricAngles;
    profileAnalysis?: ProfileAnalysis;
    aldCalculation?: ALDCalculation;
    milestones: ApplianceMilestone[];
    bondingDate?: string;
    estimatedDebondingDate?: string;
    treatmentDurationMonths?: number;
    xrayAssetId?: string; // Ceph X-ray reference
}

// Landmark descriptions for UI tooltips
export const LANDMARK_DESCRIPTIONS: Record<LandmarkName, string> = {
    'S': 'Sella: Center of sella turcica',
    'N': 'Nasion: Most anterior point of frontonasal suture',
    'A': 'A-Point: Deepest point on maxillary base between ANS and prosthion',
    'B': 'B-Point: Deepest point on mandibular symphysis',
    'Or': 'Orbitale: Lowest point on inferior margin of orbit',
    'Po': 'Porion: Uppermost point of external auditory meatus',
    'Go': 'Gonion: Most posterior-inferior point on angle of mandible',
    'Gn': 'Gnathion: Most anterior-inferior point on mandibular symphysis'
};

// Normal ranges for clinical reference
export const NORMAL_RANGES = {
    SNA: { min: 80, max: 84, unit: '°', description: 'Anteroposterior position of maxilla' },
    SNB: { min: 78, max: 82, unit: '°', description: 'Anteroposterior position of mandible' },
    ANB: { min: 2, max: 4, unit: '°', description: 'Skeletal relationship (Class I/II/III)' },
    FMA: { min: 20, max: 30, unit: '°', description: 'Vertical growth pattern' },
    nasolabialAngle: { min: 94, max: 110, unit: '°', description: 'Upper lip inclination' },
    eLineUpperLip: { min: -4, max: 0, unit: 'mm', description: 'Upper lip to E-Line' },
    eLineLowerLip: { min: -2, max: 0, unit: 'mm', description: 'Lower lip to E-Line' }
};

// Classification helpers
export function classifySkeletalPattern(anb: number): SkeletalClass {
    if (anb < 0) return 'Class III';
    if (anb > 4) return 'Class II';
    return 'Class I';
}

export function assessVerticalGrowth(fma: number): VerticalPattern {
    if (fma > 30) return 'High Angle';
    if (fma < 20) return 'Low Angle';
    return 'Normal';
}

export function classifyProfile(nasolabialAngle: number): ProfileType {
    if (nasolabialAngle < 94) return 'Convex';
    if (nasolabialAngle > 110) return 'Concave';
    return 'Straight';
}

export function determineTreatmentRecommendation(discrepancy: number): TreatmentRecommendation {
    if (discrepancy < -4) return 'Extraction';
    if (discrepancy < -2) return 'Expansion';
    if (discrepancy < 0) return 'IPR';
    return 'None';
}
