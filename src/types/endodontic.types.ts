// Endodontic Type Definitions for Phase 12
// Strict typing for canal measurements and multi-visit workflows

export type CanalName = 'MB' | 'MB2' | 'ML' | 'DB' | 'DL' | 'D' | 'M' | 'P' | 'L' | 'B';
export type ReferencePoint = 'Cusp Tip' | 'Incisal Edge' | 'Buccal Cusp' | 'Palatal Cusp' | 'Mesial Cusp' | 'Distal Cusp';
export type ProcedureType = 'ACCESS_BMP' | 'OBTURATION' | 'DRESSING_CHANGE' | 'RECALL';

export interface Canal {
    id: string; // Unique ID for React keys
    name: CanalName;
    referencePoint: ReferencePoint;
    workingLength: number; // mm (validated 15-30)
    maf: string; // Master Apical File, e.g., "25/.06"
    masterCone: string; // ISO size, e.g., "25", "30", "35"
}

export interface EndodonticSitting {
    sittingNumber: number;
    date: string; // ISO format
    procedure: ProcedureType;
    canals: Canal[];
    notes?: string;
    completed: boolean;
    doctorId?: string;
}

export interface EndodonticMetadata {
    toothNumber: number;
    cavityClass: string; // I, II, III, IV, V, VI
    sittings: EndodonticSitting[];
    obturated: boolean;
    obturationDate?: string;
    postEndoNotificationScheduled?: boolean;
}

// Inventory deduction interface
export interface InventoryDeduction {
    itemName: string;
    quantity: number;
    size?: string; // For GP points (ISO 15-80)
    reason: string;
    patientId: string;
    toothNumber: number;
}

// Tooth anatomy presets for canal suggestions
export const TOOTH_CANAL_PRESETS: Record<number, CanalName[]> = {
    // Maxillary
    11: ['L', 'B'], // Central Incisor
    12: ['L', 'B'], // Lateral Incisor
    13: ['L', 'B'], // Canine
    14: ['B', 'P'], // First Premolar
    15: ['B', 'P'], // Second Premolar
    16: ['MB', 'MB2', 'DB', 'P'], // First Molar
    17: ['MB', 'DB', 'P'], // Second Molar
    21: ['L', 'B'],
    22: ['L', 'B'],
    23: ['L', 'B'],
    24: ['B', 'P'],
    25: ['B', 'P'],
    26: ['MB', 'MB2', 'DB', 'P'],
    27: ['MB', 'DB', 'P'],

    // Mandibular
    31: ['L', 'B'], // Central Incisor
    32: ['L', 'B'], // Lateral Incisor
    33: ['L'], // Canine
    34: ['B', 'L'], // First Premolar
    35: ['B', 'L'], // Second Premolar
    36: ['MB', 'ML', 'D'], // First Molar
    37: ['M', 'D'], // Second Molar
    41: ['L', 'B'],
    42: ['L', 'B'],
    43: ['L'],
    44: ['B', 'L'],
    45: ['B', 'L'],
    46: ['MB', 'ML', 'D'],
    47: ['M', 'D']
};

// Validation helper
export function validateWorkingLength(wl: number): { valid: boolean; error?: string } {
    if (isNaN(wl)) {
        return { valid: false, error: 'Working length must be a number' };
    }
    if (wl < 15) {
        return { valid: false, error: 'Working length too short (min 15mm)' };
    }
    if (wl > 30) {
        return { valid: false, error: 'Working length too long (max 30mm)' };
    }
    return { valid: true };
}

// Helper to get canal presets
export function getCanalsForTooth(toothNumber: number): CanalName[] {
    return TOOTH_CANAL_PRESETS[toothNumber] || ['L', 'B'];
}
