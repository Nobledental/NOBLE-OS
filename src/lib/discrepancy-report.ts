/**
 * Phase 22: Patient Discrepancy Module
 * 
 * Patient-led reporting system that shifts accountability
 * from "software spying" to "patient advocacy"
 */

import { v4 as uuidv4 } from 'uuid';

// =============================================================================
// TYPES
// =============================================================================

export interface DiscrepancyReport {
    id: string;
    patientId: string;
    patientName: string;

    // Original visit details
    originalClinicId: string;
    originalClinicName: string;
    originalDoctorId: string;
    originalDoctorName: string;
    originalVisitDate: string;
    originalDiagnosis: string; // What they said (e.g., "Healthy")

    // New visit details
    reportingClinicId: string;
    reportingClinicName: string;
    reportingDoctorId: string;
    reportingDoctorName: string;
    reportingVisitDate: string;
    newDiagnosis: string; // What was found (e.g., "Caries on #16")

    // Specific tooth/area
    affectedTooth?: number;
    affectedArea?: string;

    // Evidence
    xrayEvidence?: string[]; // URLs to X-rays
    clinicalPhotos?: string[];
    clinicalNotes?: string;

    // Status & Timeline
    status: DiscrepancyStatus;
    createdAt: string;
    deadline: string; // 48 hours from creation

    // Doctor Response
    doctorResponse?: DoctorResponse;

    // Resolution
    resolvedAt?: string;
    resolvedBy?: string;
    resolution?: DiscrepancyResolution;
    trustPointsDeducted?: number;
}

export type DiscrepancyStatus =
    | 'pending_review'      // Just filed, awaiting doctor response
    | 'doctor_notified'     // Notification sent to original doctor
    | 'doctor_responded'    // Doctor provided explanation
    | 'under_investigation' // HealthFlo team reviewing evidence
    | 'verified'            // Discrepancy confirmed - points deducted
    | 'dismissed'           // Discrepancy not valid
    | 'expired'             // Doctor didn't respond in 48 hours
    | 'withdrawn';          // Patient withdrew report

export interface DoctorResponse {
    respondedAt: string;
    explanation: string;
    supportingEvidence?: string[];
    acknowledgesMiss: boolean;
    requestsReview: boolean;
}

export interface DiscrepancyResolution {
    outcome: 'valid_miss' | 'clinical_progression' | 'interpretation_difference' | 'invalid_claim';
    explanation: string;
    trustImpact: number; // Points to deduct (negative) or add back (positive)
    appealable: boolean;
}

export interface DiscrepancyNotification {
    id: string;
    discrepancyId: string;
    recipientId: string;
    recipientType: 'doctor' | 'patient' | 'admin';
    type: 'new_report' | 'response_received' | 'deadline_warning' | 'resolution';
    message: string;
    createdAt: string;
    readAt?: string;
    actionUrl?: string;
}

// =============================================================================
// DISCREPANCY SERVICE
// =============================================================================

export class DiscrepancyService {
    private readonly RESPONSE_DEADLINE_HOURS = 48;
    private readonly BASE_DEDUCTION_POINTS = 50;

    /**
     * Patient files a new discrepancy report
     */
    createReport(
        patientId: string,
        patientName: string,
        originalVisit: {
            clinicId: string;
            clinicName: string;
            doctorId: string;
            doctorName: string;
            visitDate: string;
            diagnosis: string;
        },
        newVisit: {
            clinicId: string;
            clinicName: string;
            doctorId: string;
            doctorName: string;
            visitDate: string;
            diagnosis: string;
        },
        details: {
            affectedTooth?: number;
            affectedArea?: string;
            clinicalNotes?: string;
        }
    ): DiscrepancyReport {
        const now = new Date();
        const deadline = new Date(now.getTime() + this.RESPONSE_DEADLINE_HOURS * 60 * 60 * 1000);

        return {
            id: uuidv4(),
            patientId,
            patientName,
            originalClinicId: originalVisit.clinicId,
            originalClinicName: originalVisit.clinicName,
            originalDoctorId: originalVisit.doctorId,
            originalDoctorName: originalVisit.doctorName,
            originalVisitDate: originalVisit.visitDate,
            originalDiagnosis: originalVisit.diagnosis,
            reportingClinicId: newVisit.clinicId,
            reportingClinicName: newVisit.clinicName,
            reportingDoctorId: newVisit.doctorId,
            reportingDoctorName: newVisit.doctorName,
            reportingVisitDate: newVisit.visitDate,
            newDiagnosis: newVisit.diagnosis,
            affectedTooth: details.affectedTooth,
            affectedArea: details.affectedArea,
            clinicalNotes: details.clinicalNotes,
            status: 'pending_review',
            createdAt: now.toISOString(),
            deadline: deadline.toISOString()
        };
    }

    /**
     * Generate notification for doctor about discrepancy
     */
    createDoctorNotification(report: DiscrepancyReport): DiscrepancyNotification {
        return {
            id: uuidv4(),
            discrepancyId: report.id,
            recipientId: report.originalDoctorId,
            recipientType: 'doctor',
            type: 'new_report',
            message: `A patient has reported a potential missed diagnosis. ${report.patientName} claims that ${report.newDiagnosis} was found at ${report.reportingClinicName} which was previously marked as '${report.originalDiagnosis}'. You have 48 hours to provide a clinical explanation before your Trust Score may be affected.`,
            createdAt: new Date().toISOString(),
            actionUrl: `/dashboard/discrepancies/${report.id}`
        };
    }

    /**
     * Doctor submits their response
     */
    submitDoctorResponse(
        report: DiscrepancyReport,
        explanation: string,
        acknowledges: boolean,
        evidence?: string[]
    ): DiscrepancyReport {
        const response: DoctorResponse = {
            respondedAt: new Date().toISOString(),
            explanation,
            supportingEvidence: evidence,
            acknowledgesMiss: acknowledges,
            requestsReview: !acknowledges
        };

        return {
            ...report,
            status: 'doctor_responded',
            doctorResponse: response
        };
    }

    /**
     * Check if deadline has passed
     */
    isDeadlinePassed(report: DiscrepancyReport): boolean {
        return new Date() > new Date(report.deadline);
    }

    /**
     * Auto-expire reports where doctor didn't respond
     */
    processExpiredReport(report: DiscrepancyReport): DiscrepancyReport {
        if (!this.isDeadlinePassed(report)) {
            return report;
        }

        if (report.status === 'doctor_notified' || report.status === 'pending_review') {
            return {
                ...report,
                status: 'expired',
                resolvedAt: new Date().toISOString(),
                resolution: {
                    outcome: 'valid_miss',
                    explanation: 'Doctor failed to respond within 48-hour deadline',
                    trustImpact: -this.BASE_DEDUCTION_POINTS,
                    appealable: true
                },
                trustPointsDeducted: this.BASE_DEDUCTION_POINTS
            };
        }

        return report;
    }

    /**
     * Admin resolves a discrepancy
     */
    resolveDiscrepancy(
        report: DiscrepancyReport,
        resolution: DiscrepancyResolution,
        resolvedBy: string
    ): DiscrepancyReport {
        return {
            ...report,
            status: resolution.outcome === 'valid_miss' ? 'verified' : 'dismissed',
            resolvedAt: new Date().toISOString(),
            resolvedBy,
            resolution,
            trustPointsDeducted: resolution.trustImpact < 0 ? Math.abs(resolution.trustImpact) : 0
        };
    }

    /**
     * Patient withdraws their report
     */
    withdrawReport(report: DiscrepancyReport): DiscrepancyReport {
        return {
            ...report,
            status: 'withdrawn',
            resolvedAt: new Date().toISOString()
        };
    }

    /**
     * Calculate appropriate trust deduction based on severity
     */
    calculateDeduction(report: DiscrepancyReport): number {
        let deduction = this.BASE_DEDUCTION_POINTS;

        // More severe for missed pathology vs. minor findings
        if (report.newDiagnosis.toLowerCase().includes('caries')) {
            deduction += 10;
        }
        if (report.newDiagnosis.toLowerCase().includes('abscess')) {
            deduction += 30;
        }
        if (report.newDiagnosis.toLowerCase().includes('fracture')) {
            deduction += 20;
        }

        // Less severe if there was a long gap between visits
        const daysBetween = Math.abs(
            (new Date(report.reportingVisitDate).getTime() -
                new Date(report.originalVisitDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysBetween > 60) {
            deduction = Math.round(deduction * 0.7); // 30% reduction
        }

        return deduction;
    }

    /**
     * Get time remaining until deadline
     */
    getTimeRemaining(report: DiscrepancyReport): { hours: number; minutes: number; expired: boolean } {
        const deadline = new Date(report.deadline);
        const now = new Date();
        const diff = deadline.getTime() - now.getTime();

        if (diff <= 0) {
            return { hours: 0, minutes: 0, expired: true };
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return { hours, minutes, expired: false };
    }
}

export const discrepancyService = new DiscrepancyService();

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Check if a new diagnosis constitutes a valid discrepancy
 */
export function isValidDiscrepancy(
    originalDiagnosis: string,
    newDiagnosis: string,
    toothNumber?: number
): { valid: boolean; reason?: string } {
    // Same diagnosis is not a discrepancy
    if (originalDiagnosis.toLowerCase() === newDiagnosis.toLowerCase()) {
        return { valid: false, reason: 'Diagnoses are identical' };
    }

    // "Healthy" to any pathology is a potential miss
    if (originalDiagnosis.toLowerCase().includes('healthy')) {
        return { valid: true };
    }

    // Worsening of existing condition might be progression, not miss
    const progressionPairs = [
        ['incipient', 'caries'],
        ['gingivitis', 'periodontitis'],
        ['reversible', 'irreversible']
    ];

    for (const [earlier, later] of progressionPairs) {
        if (originalDiagnosis.toLowerCase().includes(earlier) &&
            newDiagnosis.toLowerCase().includes(later)) {
            return {
                valid: true,
                reason: 'May be clinical progression rather than missed diagnosis'
            };
        }
    }

    return { valid: true };
}
