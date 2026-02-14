/**
 * Billing Calculator Engine
 * 
 * Automatically calculates billing from clinical treatments
 * Handles per-tooth calculations, tax rates, and special pricing logic
 */

import type { TreatmentRecord } from '@/types/treatment-record';
import type { InvoiceItem, TaxRate } from '@/lib/billing-store';
import { getToothType } from '@/types/treatment-record';

// Procedure to Billing Code Mapping
interface BillingMapping {
    tariffId: string;
    baseCost: number;
    perTooth: boolean;
    taxRate: TaxRate;
    description: string;
    category: string;
}

export const PROCEDURE_BILLING_MAP: Record<string, BillingMapping> = {
    // Diagnostic
    'consultation': {
        tariffId: 'CONS001',
        baseCost: 500,
        perTooth: false,
        taxRate: 0,
        description: 'General Dental Consultation',
        category: 'Diagnostic'
    },
    'iopa': {
        tariffId: 'DIAG001',
        baseCost: 200,
        perTooth: true,
        taxRate: 18,
        description: 'Intra Oral Periapical X-Ray',
        category: 'Diagnostic'
    },
    'opg': {
        tariffId: 'DIAG002',
        baseCost: 500,
        perTooth: false,
        taxRate: 18,
        description: 'Orthopantomogram (OPG)',
        category: 'Diagnostic'
    },
    'cbct': {
        tariffId: 'DIAG003',
        baseCost: 3500,
        perTooth: false,
        taxRate: 18,
        description: 'Cone Beam CT Scan',
        category: 'Diagnostic'
    },

    // Preventive
    'scaling_full': {
        tariffId: 'PREV001',
        baseCost: 1200,
        perTooth: false,
        taxRate: 18,
        description: 'Full Mouth Scaling & Polishing',
        category: 'Preventive'
    },
    'scaling_partial': {
        tariffId: 'PREV002',
        baseCost: 800,
        perTooth: false,
        taxRate: 18,
        description: 'Partial Mouth Scaling',
        category: 'Preventive'
    },
    'fluoride_application': {
        tariffId: 'PREV003',
        baseCost: 600,
        perTooth: false,
        taxRate: 12,
        description: 'Fluoride Application',
        category: 'Preventive'
    },

    // Restorative
    'filling_composite': {
        tariffId: 'REST001',
        baseCost: 1500,
        perTooth: true,
        taxRate: 12,
        description: 'Composite Filling',
        category: 'Restorative'
    },
    'filling_amalgam': {
        tariffId: 'REST002',
        baseCost: 800,
        perTooth: true,
        taxRate: 12,
        description: 'Amalgam Filling',
        category: 'Restorative'
    },
    'filling_gic': {
        tariffId: 'REST003',
        baseCost: 1000,
        perTooth: true,
        taxRate: 12,
        description: 'Glass Ionomer Cement Filling',
        category: 'Restorative'
    },

    // Endodontic (RCT - varies by tooth type)
    'rct_anterior': {
        tariffId: 'ENDO001',
        baseCost: 5500,
        perTooth: true,
        taxRate: 12,
        description: 'Root Canal Treatment - Anterior',
        category: 'Endodontic'
    },
    'rct_premolar': {
        tariffId: 'ENDO002',
        baseCost: 6500,
        perTooth: true,
        taxRate: 12,
        description: 'Root Canal Treatment - Premolar',
        category: 'Endodontic'
    },
    'rct_molar': {
        tariffId: 'ENDO003',
        baseCost: 8500,
        perTooth: true,
        taxRate: 12,
        description: 'Root Canal Treatment - Molar',
        category: 'Endodontic'
    },
    'pulpotomy': {
        tariffId: 'ENDO004',
        baseCost: 2500,
        perTooth: true,
        taxRate: 12,
        description: 'Pulpotomy',
        category: 'Endodontic'
    },

    // Prosthodontic
    'crown_zirconia': {
        tariffId: 'PROS001',
        baseCost: 8000,
        perTooth: true,
        taxRate: 12,
        description: 'Zirconia Crown',
        category: 'Prosthodontic'
    },
    'crown_metal_ceramic': {
        tariffId: 'PROS002',
        baseCost: 5500,
        perTooth: true,
        taxRate: 12,
        description: 'Porcelain Fused to Metal Crown (PFM)',
        category: 'Prosthodontic'
    },
    'crown_metal': {
        tariffId: 'PROS003',
        baseCost: 3500,
        perTooth: true,
        taxRate: 12,
        description: 'Metal Crown',
        category: 'Prosthodontic'
    },
    'crown_emax': {
        tariffId: 'PROS004',
        baseCost: 12000,
        perTooth: true,
        taxRate: 12,
        description: 'E-Max Crown',
        category: 'Prosthodontic'
    },
    'veneer_composite': {
        tariffId: 'PROS005',
        baseCost: 4000,
        perTooth: true,
        taxRate: 12,
        description: 'Composite Veneer',
        category: 'Prosthodontic'
    },
    'veneer_ceramic': {
        tariffId: 'PROS006',
        baseCost: 10000,
        perTooth: true,
        taxRate: 12,
        description: 'Ceramic Veneer',
        category: 'Prosthodontic'
    },

    // Surgical
    'extraction_simple': {
        tariffId: 'SURG001',
        baseCost: 1500,
        perTooth: true,
        taxRate: 12,
        description: 'Simple Tooth Extraction',
        category: 'Surgical'
    },
    'extraction_surgical': {
        tariffId: 'SURG002',
        baseCost: 3500,
        perTooth: true,
        taxRate: 12,
        description: 'Surgical Extraction',
        category: 'Surgical'
    },
    'extraction_impacted': {
        tariffId: 'SURG003',
        baseCost: 6500,
        perTooth: true,
        taxRate: 12,
        description: 'Impacted Tooth Removal',
        category: 'Surgical'
    },
    'implant': {
        tariffId: 'SURG004',
        baseCost: 25000,
        perTooth: true,
        taxRate: 12,
        description: 'Dental Implant',
        category: 'Surgical'
    },

    // Periodontic
    'deep_cleaning': {
        tariffId: 'PERIO001',
        baseCost: 2500,
        perTooth: false,
        taxRate: 12,
        description: 'Deep Cleaning (Scaling & Root Planing)',
        category: 'Periodontic'
    },
    'gum_surgery': {
        tariffId: 'PERIO002',
        baseCost: 8000,
        perTooth: false,
        taxRate: 12,
        description: 'Periodontal Surgery',
        category: 'Periodontic'
    },

    // Orthodontic
    'braces_consultation': {
        tariffId: 'ORTHO001',
        baseCost: 1000,
        perTooth: false,
        taxRate: 0,
        description: 'Orthodontic Consultation',
        category: 'Orthodontic'
    },
    'braces_metal': {
        tariffId: 'ORTHO002',
        baseCost: 45000,
        perTooth: false,
        taxRate: 18,
        description: 'Metal Braces (Full Treatment)',
        category: 'Orthodontic'
    },
    'braces_ceramic': {
        tariffId: 'ORTHO003',
        baseCost: 65000,
        perTooth: false,
        taxRate: 18,
        description: 'Ceramic Braces (Full Treatment)',
        category: 'Orthodontic'
    },
    'aligners': {
        tariffId: 'ORTHO004',
        baseCost: 120000,
        perTooth: false,
        taxRate: 18,
        description: 'Clear Aligners (Full Treatment)',
        category: 'Orthodontic'
    }
};

/**
 * Get RCT cost based on tooth type
 */
function getRCTCostByToothType(toothNumber: number): number {
    const toothType = getToothType(toothNumber);

    switch (toothType) {
        case 'anterior':
            return 5500;
        case 'premolar':
            return 6500;
        case 'molar':
            return 8500;
        default:
            return 6500; // Default to premolar
    }
}

/**
 * Get appropriate RCT procedure ID based on tooth type
 */
function getRCTProcedureId(toothNumber: number): string {
    const toothType = getToothType(toothNumber);
    return `rct_${toothType}`;
}

/**
 * Main Function: Calculate billing from treatment record
 */
export function calculateTreatmentBill(treatment: TreatmentRecord): InvoiceItem {
    let procedureId = treatment.procedure.id;

    // Special handling for RCT - determine procedure based on tooth type
    if (procedureId === 'rct' && treatment.teethAffected.length > 0) {
        procedureId = getRCTProcedureId(treatment.teethAffected[0]);
    }

    const billing = PROCEDURE_BILLING_MAP[procedureId];

    if (!billing) {
        throw new Error(`No billing mapping found for procedure: ${procedureId}`);
    }

    // Calculate quantity based on per-tooth flag
    const quantity = billing.perTooth ? treatment.teethCount : 1;

    // For RCT, get cost based on tooth type
    let finalCost = billing.baseCost;
    if (procedureId.startsWith('rct_') && treatment.teethAffected.length > 0) {
        finalCost = getRCTCostByToothType(treatment.teethAffected[0]);
    }

    // Build description with teeth info if applicable
    let description = billing.description;
    if (billing.perTooth && treatment.teethAffected.length > 0) {
        const teethList = treatment.teethAffected.join(', ');
        description = `${billing.description} (Teeth: ${teethList})`;
    }

    return {
        id: `auto_${treatment.id}`,
        name: description,
        baseCost: finalCost,
        taxRate: billing.taxRate,
        quantity: quantity,
        metadata: {
            source: 'auto_clinical',
            treatmentRecordId: treatment.id,
            teethTreated: treatment.teethAffected,
            completedAt: treatment.completedAt,
            procedureId: procedureId,
            category: billing.category
        }
    };
}

/**
 * Batch calculate multiple treatments
 */
export function calculateMultipleTreatments(treatments: TreatmentRecord[]): InvoiceItem[] {
    return treatments
        .filter(t => t.status === 'completed' && !t.autoAddedToBilling)
        .map(calculateTreatmentBill);
}

/**
 * Estimate cost before treatment (for treatment planning)
 */
export function estimateTreatmentCost(
    procedureId: string,
    teethCount: number = 1
): { subtotal: number; tax: number; total: number } {
    const billing = PROCEDURE_BILLING_MAP[procedureId];

    if (!billing) {
        return { subtotal: 0, tax: 0, total: 0 };
    }

    const quantity = billing.perTooth ? teethCount : 1;
    const subtotal = billing.baseCost * quantity;
    const tax = subtotal * (billing.taxRate / 100);
    const total = subtotal + tax;

    return { subtotal, tax, total };
}
