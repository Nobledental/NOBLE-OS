/**
 * Phase 24: Document Sharing Queue & Penalty Logic
 * 
 * 48-hour guard, reshare limits, and doctor re-open feature
 */

import { v4 as uuid } from 'uuid';

// =============================================================================
// TYPES
// =============================================================================

export type ShareDelay = 'instant' | '1hr' | '4hr' | '24hr';
export type DocumentStatus =
    | 'pending'
    | 'queued'
    | 'shared'
    | 'revoked'
    | 'updated'
    | 'expired';

export interface DocumentShareRequest {
    id: string;
    documentId: string;
    documentType: 'clinical_summary' | 'xray' | 'prescription' | 'lab_report' | 'invoice';
    patientId: string;
    patientName: string;
    clinicId: string;
    requestedAt: Date;
    scheduledShareAt: Date;
    sharedAt?: Date;
    status: DocumentStatus;
    shareDelay: ShareDelay;
    reshareCount: number;
    maxReshares: number;
    pdfUrl?: string;
    revokedAt?: Date;
    revokeReason?: string;
    updatedVersionId?: string;
}

export interface ShareQueueConfig {
    clinicId: string;
    defaultDelay: ShareDelay;
    maxPatientReshares: number;
    penaltyThresholdHours: number;
    autoShareEnabled: boolean;
}

export interface TrustPenalty {
    id: string;
    clinicId: string;
    reason: 'LATE_SHARE' | 'PATIENT_COMPLAINT' | 'MISSING_DATA' | 'DISCREPANCY_REPORTED';
    points: number;
    documentId?: string;
    patientId?: string;
    appliedAt: Date;
    appealedAt?: Date;
    appealStatus?: 'pending' | 'approved' | 'rejected';
}

export interface DocumentRevision {
    id: string;
    originalDocumentId: string;
    versionNumber: number;
    updatedBy: string;
    updatedAt: Date;
    changeReason: string;
    previousPdfUrl: string;
    newPdfUrl: string;
    patientNotified: boolean;
}

// =============================================================================
// DOCUMENT SHARING QUEUE SERVICE
// =============================================================================

export class DocumentSharingQueueService {
    private readonly DEFAULT_CONFIG: ShareQueueConfig = {
        clinicId: '',
        defaultDelay: '1hr',
        maxPatientReshares: 3,
        penaltyThresholdHours: 48,
        autoShareEnabled: true
    };

    private readonly DELAY_MS: Record<ShareDelay, number> = {
        'instant': 0,
        '1hr': 60 * 60 * 1000,
        '4hr': 4 * 60 * 60 * 1000,
        '24hr': 24 * 60 * 60 * 1000
    };

    private readonly PENALTY_POINTS = {
        LATE_SHARE: -100,
        PATIENT_COMPLAINT: -50,
        MISSING_DATA: -25,
        DISCREPANCY_REPORTED: -75
    };

    /**
     * Create a document share request
     */
    createShareRequest(
        documentId: string,
        documentType: DocumentShareRequest['documentType'],
        patientId: string,
        patientName: string,
        clinicId: string,
        config: Partial<ShareQueueConfig> = {}
    ): DocumentShareRequest {
        const fullConfig = { ...this.DEFAULT_CONFIG, clinicId, ...config };
        const delayMs = this.DELAY_MS[fullConfig.defaultDelay];

        return {
            id: uuid(),
            documentId,
            documentType,
            patientId,
            patientName,
            clinicId,
            requestedAt: new Date(),
            scheduledShareAt: new Date(Date.now() + delayMs),
            status: delayMs === 0 ? 'shared' : 'queued',
            shareDelay: fullConfig.defaultDelay,
            reshareCount: 0,
            maxReshares: fullConfig.maxPatientReshares,
            sharedAt: delayMs === 0 ? new Date() : undefined
        };
    }

    /**
     * Process queued documents for sharing
     */
    processQueue(
        queuedRequests: DocumentShareRequest[],
        currentTime: Date = new Date()
    ): {
        toShare: DocumentShareRequest[];
        penalties: TrustPenalty[];
    } {
        const toShare: DocumentShareRequest[] = [];
        const penalties: TrustPenalty[] = [];

        for (const request of queuedRequests) {
            if (request.status !== 'queued') continue;

            // Check if scheduled time has passed
            if (currentTime >= request.scheduledShareAt) {
                toShare.push({
                    ...request,
                    status: 'shared',
                    sharedAt: currentTime
                });
            }

            // Check for 48-hour penalty
            const hoursSinceRequest = (currentTime.getTime() - request.requestedAt.getTime()) / (1000 * 60 * 60);
            if (hoursSinceRequest >= 48 && request.status !== 'shared') {
                penalties.push(this.createPenalty(request.clinicId, 'LATE_SHARE', request.documentId, request.patientId));
            }
        }

        return { toShare, penalties };
    }

    /**
     * Handle patient reshare request
     */
    handleReshareRequest(
        request: DocumentShareRequest
    ): {
        success: boolean;
        updatedRequest?: DocumentShareRequest;
        error?: string;
    } {
        if (request.reshareCount >= request.maxReshares) {
            return {
                success: false,
                error: 'Limit reached. Please contact Noble Dental for further assistance.'
            };
        }

        const updatedRequest: DocumentShareRequest = {
            ...request,
            reshareCount: request.reshareCount + 1,
            status: 'shared',
            sharedAt: new Date()
        };

        return { success: true, updatedRequest };
    }

    /**
     * Doctor re-open and update document
     */
    reopenAndUpdate(
        originalRequest: DocumentShareRequest,
        doctorId: string,
        changeReason: string,
        newPdfUrl: string
    ): {
        revokedRequest: DocumentShareRequest;
        newRequest: DocumentShareRequest;
        revision: DocumentRevision;
        notification: { title: string; body: string };
    } {
        // Revoke original
        const revokedRequest: DocumentShareRequest = {
            ...originalRequest,
            status: 'revoked',
            revokedAt: new Date(),
            revokeReason: changeReason
        };

        // Create new version
        const newRequest: DocumentShareRequest = {
            ...originalRequest,
            id: uuid(),
            status: 'shared',
            sharedAt: new Date(),
            pdfUrl: newPdfUrl,
            reshareCount: originalRequest.reshareCount
        };

        // Create revision record
        const revision: DocumentRevision = {
            id: uuid(),
            originalDocumentId: originalRequest.documentId,
            versionNumber: (originalRequest.reshareCount || 0) + 1,
            updatedBy: doctorId,
            updatedAt: new Date(),
            changeReason,
            previousPdfUrl: originalRequest.pdfUrl || '',
            newPdfUrl,
            patientNotified: true
        };

        // Generate notification
        const notification = {
            title: 'Document Updated',
            body: `Dr. ${doctorId} has updated your clinical summary. Tap to view the latest version.`
        };

        return {
            revokedRequest,
            newRequest,
            revision,
            notification
        };
    }

    /**
     * Create a trust penalty
     */
    createPenalty(
        clinicId: string,
        reason: TrustPenalty['reason'],
        documentId?: string,
        patientId?: string
    ): TrustPenalty {
        return {
            id: uuid(),
            clinicId,
            reason,
            points: this.PENALTY_POINTS[reason],
            documentId,
            patientId,
            appliedAt: new Date()
        };
    }

    /**
     * Get remaining reshares for patient
     */
    getRemainingReshares(request: DocumentShareRequest): {
        remaining: number;
        canReshare: boolean;
        message: string;
    } {
        const remaining = request.maxReshares - request.reshareCount;
        const canReshare = remaining > 0;

        let message = '';
        if (canReshare) {
            message = `${remaining} reshare${remaining === 1 ? '' : 's'} remaining`;
        } else {
            message = 'Limit reached. Please contact Noble Dental for further assistance.';
        }

        return { remaining, canReshare, message };
    }

    /**
     * Calculate time until penalty
     */
    getTimeUntilPenalty(request: DocumentShareRequest): {
        hoursRemaining: number;
        isUrgent: boolean;
        message: string;
    } {
        const requestTime = request.requestedAt.getTime();
        const penaltyTime = requestTime + (48 * 60 * 60 * 1000);
        const now = Date.now();
        const hoursRemaining = Math.max(0, (penaltyTime - now) / (1000 * 60 * 60));
        const isUrgent = hoursRemaining < 12;

        let message = '';
        if (hoursRemaining === 0) {
            message = 'Penalty applied: Document not shared within 48 hours';
        } else if (isUrgent) {
            message = `⚠️ Share within ${Math.ceil(hoursRemaining)} hours to avoid -100 point penalty`;
        } else {
            message = `${Math.ceil(hoursRemaining)} hours remaining`;
        }

        return { hoursRemaining, isUrgent, message };
    }
}

export const documentSharingQueue = new DocumentSharingQueueService();
