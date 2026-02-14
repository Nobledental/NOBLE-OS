/**
 * Treatment Record Types
 * 
 * Tracks clinical treatments for automated billing integration
 */

export type TreatmentCategory =
    | 'diagnostic'
    | 'preventive'
    | 'restorative'
    | 'endodontic'
    | 'prosthodontic'
    | 'surgical'
    | 'orthodontic'
    | 'periodontic';

export type TreatmentStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export interface TreatmentProcedure {
    id: string; // e.g., 'consultation', 'scaling', 'crown_zirconia', 'rct', 'iopa'
    name: string;
    category: TreatmentCategory;
}

export interface TreatmentRecord {
    id: string;
    appointmentId: string;
    patientId: string;
    doctorId: string;
    createdAt: string;
    updatedAt: string;

    // Treatment details
    procedure: TreatmentProcedure;

    // Tooth-specific (FDI notation: 11-48)
    teethAffected: number[]; // e.g., [11, 12, 21]
    teethCount: number; // Auto-calculated from teethAffected.length

    // Status tracking
    status: TreatmentStatus;
    completedAt?: string;

    // Billing integration
    autoAddedToBilling: boolean;
    billingLineItemId?: string; // Reference to invoice item

    // Clinical documentation
    notes?: string;
    complications?: string[];
    materials?: string[]; // e.g., ['Zirconia block', 'Temp cement']

    // Session tracking (for multi-visit procedures like RCT)
    isMultiSession: boolean;
    sessionNumber?: number;
    totalSessions?: number;
    nextSessionDate?: string;
}

/**
 * Helper to determine tooth type from FDI number
 */
export function getToothType(toothNumber: number): 'anterior' | 'premolar' | 'molar' {
    const anteriorTeeth = [11, 12, 13, 21, 22, 23, 31, 32, 33, 41, 42, 43];
    const premolarTeeth = [14, 15, 24, 25, 34, 35, 44, 45];
    const molarTeeth = [16, 17, 18, 26, 27, 28, 36, 37, 38, 46, 47, 48];

    if (anteriorTeeth.includes(toothNumber)) return 'anterior';
    if (premolarTeeth.includes(toothNumber)) return 'premolar';
    if (molarTeeth.includes(toothNumber)) return 'molar';

    // Default to premolar for edge cases
    return 'premolar';
}

/**
 * Get quadrant from FDI number
 */
export function getQuadrant(toothNumber: number): 1 | 2 | 3 | 4 {
    const firstDigit = Math.floor(toothNumber / 10);
    return firstDigit as 1 | 2 | 3 | 4;
}

/**
 * Check if tooth is permanent or deciduous
 */
export function isPermanentTooth(toothNumber: number): boolean {
    const firstDigit = Math.floor(toothNumber / 10);
    return firstDigit <= 4; // 1-4 are permanent, 5-8 are deciduous
}
