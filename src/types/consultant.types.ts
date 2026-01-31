/**
 * Phase 19: Specialist Collaboration & Referral Portal
 * Consultant roles, secure referral links, and billing splits
 */

import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

// =============================================================================
// CONSULTANT & SPECIALIST TYPES
// =============================================================================

export type ConsultantSpecialty =
    | 'orthodontics'
    | 'oral_surgery'
    | 'endodontics'
    | 'periodontics'
    | 'prosthodontics'
    | 'pediatric'
    | 'oral_medicine'
    | 'implantology';

export interface ConsultantProfile {
    id: string;
    userId: string;
    name: string;
    specialty: ConsultantSpecialty;
    registrationNumber: string; // MDS/BDS registration
    assignedPatients: string[]; // Patient IDs
    commissionPercentage: number; // e.g., 60 = 60% goes to consultant
    isActive: boolean;
    joiningDate: string;
    contactEmail: string;
    contactPhone: string;
}

export interface CaseAssignment {
    id: string;
    patientId: string;
    consultantId: string;
    assignedBy: string; // Admin user ID
    assignedAt: string;
    department: ConsultantSpecialty;
    status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'transferred';
    notes: string;
    expectedCompletionDate?: string;
}

// =============================================================================
// REFERRAL LINK SYSTEM
// =============================================================================

export interface ReferralLink {
    id: string;
    patientId: string;
    token: string; // High-entropy hash
    createdBy: string;
    createdAt: string;
    expiresAt: string; // 7 days from creation
    accessCount: number;
    lastAccessedAt?: string;
    accessedBy?: string[]; // IP or device fingerprint
    isRevoked: boolean;

    // What to share
    includeTimeline: boolean;
    includeXrays: boolean;
    includeSmartAnalysis: boolean;
    includeRiskPredictor: boolean;
    customMessage?: string;
}

export interface ReferralView {
    patientName: string;
    patientAge: number;
    mainComplaint: string;
    timeline: ReferralTimelineEntry[];
    xrays: ReferralXray[];
    smartAnalysis: Record<string, any>;
    riskScores: Record<string, number>;
    provisionalDiagnosis: string;
    referringDoctor: string;
    createdAt: string;
}

export interface ReferralTimelineEntry {
    date: string;
    type: 'visit' | 'treatment' | 'note';
    summary: string;
}

export interface ReferralXray {
    id: string;
    type: 'IOPA' | 'OPG' | 'CBCT' | 'Cephalometric' | 'Other';
    signedUrl: string; // Supabase signed URL (60-min validity)
    capturedDate: string;
    notes?: string;
}

// =============================================================================
// CONSULTANT BILLING
// =============================================================================

export interface ConsultantProcedure {
    id: string;
    consultantId: string;
    patientId: string;
    procedureCode: string;
    procedureName: string;
    performedAt: string;
    totalAmount: number;
    consultantShare: number; // Amount payable to consultant
    clinicCommission: number; // Amount retained by clinic
    status: 'pending' | 'completed' | 'paid';
    invoiceId?: string;
    settlementId?: string;
}

export interface ConsultantLedger {
    consultantId: string;
    consultantName: string;
    periodStart: string;
    periodEnd: string;
    totalProcedures: number;
    grossRevenue: number;
    consultantEarnings: number;
    clinicCommission: number;
    pendingPayout: number;
    paidAmount: number;
    procedures: ConsultantProcedure[];
}

export interface EODConsultantSummary {
    date: string;
    consultants: {
        consultantId: string;
        consultantName: string;
        procedureCount: number;
        totalEarnings: number;
        payableAmount: number;
    }[];
    totalPayableToConsultants: number;
}

// =============================================================================
// COLLABORATIVE NOTES
// =============================================================================

export interface ConsultantNote {
    id: string;
    caseAssignmentId: string;
    authorId: string;
    authorName: string;
    authorRole: 'chief_dentist' | 'consultant';
    content: string;
    createdAt: string;
    editedAt?: string;
    attachments?: {
        type: 'xray' | 'document' | 'image';
        url: string;
        name: string;
    }[];
    isInternal: boolean; // Not visible to patient
}

export interface TreatmentPhaseApproval {
    id: string;
    caseAssignmentId: string;
    currentPhase: string;
    proposedPhase: string;
    requestedBy: string;
    requestedAt: string;
    approvedBy?: string;
    approvedAt?: string;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
}

// =============================================================================
// REFERRAL STATUS TRACKING
// =============================================================================

export interface ReferralTracker {
    referralId: string;
    patientId: string;
    patientName: string;
    referredTo: string; // External center name
    referralDate: string;
    linkOpened: boolean;
    openedAt?: string;
    treatmentStarted: boolean;
    treatmentStartedAt?: string;
    treatmentCompleted: boolean;
    treatmentCompletedAt?: string;
    returnedToClinic: boolean;
    returnedAt?: string;
    status: 'sent' | 'viewed' | 'in_treatment' | 'completed' | 'returned' | 'lost';
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generates a secure, high-entropy token for referral links
 */
export function generateReferralToken(): string {
    return crypto.randomBytes(32).toString('base64url');
}

/**
 * Creates a referral link with 7-day expiration
 */
export function createReferralLink(
    patientId: string,
    createdBy: string,
    options: Partial<Pick<ReferralLink, 'includeTimeline' | 'includeXrays' | 'includeSmartAnalysis' | 'includeRiskPredictor' | 'customMessage'>> = {}
): ReferralLink {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return {
        id: uuidv4(),
        patientId,
        token: generateReferralToken(),
        createdBy,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        accessCount: 0,
        isRevoked: false,
        includeTimeline: options.includeTimeline ?? true,
        includeXrays: options.includeXrays ?? true,
        includeSmartAnalysis: options.includeSmartAnalysis ?? true,
        includeRiskPredictor: options.includeRiskPredictor ?? true,
        customMessage: options.customMessage
    };
}

/**
 * Validates if a referral token is still valid
 */
export function isReferralTokenValid(referral: ReferralLink): { valid: boolean; reason?: string } {
    if (referral.isRevoked) {
        return { valid: false, reason: 'Link has been revoked' };
    }

    if (new Date(referral.expiresAt) < new Date()) {
        return { valid: false, reason: 'Link has expired' };
    }

    return { valid: true };
}

/**
 * Calculates consultant billing split
 */
export function calculateConsultantSplit(
    totalAmount: number,
    consultantPercentage: number
): { consultantShare: number; clinicCommission: number } {
    const consultantShare = Math.round(totalAmount * (consultantPercentage / 100) * 100) / 100;
    const clinicCommission = Math.round((totalAmount - consultantShare) * 100) / 100;

    return { consultantShare, clinicCommission };
}

/**
 * Generates EOD consultant payout summary
 */
export function generateEODConsultantSummary(
    date: string,
    procedures: ConsultantProcedure[],
    consultants: ConsultantProfile[]
): EODConsultantSummary {
    const dayProcedures = procedures.filter(
        p => p.performedAt.startsWith(date) && p.status === 'completed'
    );

    const consultantMap = new Map<string, {
        consultantId: string;
        consultantName: string;
        procedureCount: number;
        totalEarnings: number;
        payableAmount: number;
    }>();

    for (const proc of dayProcedures) {
        const consultant = consultants.find(c => c.id === proc.consultantId);
        if (!consultant) continue;

        const existing = consultantMap.get(proc.consultantId);
        if (existing) {
            existing.procedureCount++;
            existing.totalEarnings += proc.totalAmount;
            existing.payableAmount += proc.consultantShare;
        } else {
            consultantMap.set(proc.consultantId, {
                consultantId: proc.consultantId,
                consultantName: consultant.name,
                procedureCount: 1,
                totalEarnings: proc.totalAmount,
                payableAmount: proc.consultantShare
            });
        }
    }

    const consultantSummaries = Array.from(consultantMap.values());
    const totalPayable = consultantSummaries.reduce((sum, c) => sum + c.payableAmount, 0);

    return {
        date,
        consultants: consultantSummaries,
        totalPayableToConsultants: Math.round(totalPayable * 100) / 100
    };
}

// =============================================================================
// RLS POLICY TEMPLATES (for Supabase)
// =============================================================================

export const CONSULTANT_RLS_POLICIES = {
    /**
     * Consultants can only see their assigned patients
     */
    patientIsolation: `
        CREATE POLICY consultant_patient_isolation ON patients
        FOR SELECT
        USING (
            id = ANY(
                SELECT unnest(assigned_patients) 
                FROM consultant_profiles 
                WHERE user_id = auth.uid()
            )
        );
    `,

    /**
     * Consultants can only view clinical notes for their patients
     */
    notesIsolation: `
        CREATE POLICY consultant_notes_isolation ON clinical_notes
        FOR SELECT
        USING (
            patient_id = ANY(
                SELECT unnest(assigned_patients) 
                FROM consultant_profiles 
                WHERE user_id = auth.uid()
            )
        );
    `,

    /**
     * Consultants can only insert procedures for their patients
     */
    proceduresInsert: `
        CREATE POLICY consultant_procedures_insert ON consultant_procedures
        FOR INSERT
        WITH CHECK (
            consultant_id = (
                SELECT id FROM consultant_profiles 
                WHERE user_id = auth.uid()
            )
        );
    `,

    /**
     * Consultants can view their own ledger
     */
    ledgerIsolation: `
        CREATE POLICY consultant_ledger_isolation ON consultant_ledger
        FOR SELECT
        USING (
            consultant_id = (
                SELECT id FROM consultant_profiles 
                WHERE user_id = auth.uid()
            )
        );
    `
};
