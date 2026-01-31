/**
 * Phase 21: HealthFlo Trust Engine - RankCalculator Service
 * 
 * 5-Pillar Ranking System (0-1000 points):
 * - 40% Clinical Diligence (metadata completeness)
 * - 20% Patient Success Rate (positive resolution)
 * - 20% Review Rating (gated after 2 visits)
 * - 20% Silent Peer Accuracy (cross-clinic comparison)
 */

import { v4 as uuidv4 } from 'uuid';

// =============================================================================
// TYPES
// =============================================================================

export interface ClinicRankProfile {
    clinicId: string;
    clinicName: string;
    dciNumber: string;
    trustScore: number; // 0-1000
    breakdown: RankBreakdown;
    tier: TrustTier;
    lastUpdated: string;
    isVerified: boolean;
    exploitFlags: ExploitFlag[];
}

export interface RankBreakdown {
    clinicalDiligence: { score: number; maxScore: 400; details: string };
    patientSuccessRate: { score: number; maxScore: 200; details: string };
    reviewRating: { score: number; maxScore: 200; details: string; isGated: boolean };
    peerAccuracy: { score: number; maxScore: 200; details: string; silentDeductions: number };
}

export type TrustTier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Unranked' | 'Flagged';

export interface ExploitFlag {
    id: string;
    type: 'bot_review' | 'fake_patient' | 'review_trading' | 'negligence' | 'manual_adjustment';
    description: string;
    flaggedAt: string;
    flaggedBy: string;
    resolved: boolean;
    resolvedAt?: string;
    adjustment?: number; // Points to add/subtract
}

export interface ClinicalNote {
    id: string;
    patientId: string;
    clinicId: string;
    doctorId: string;
    createdAt: string;
    metadata: ClinicalNoteMetadata;
}

export interface ClinicalNoteMetadata {
    chiefComplaint?: string;
    clinicalFindings?: string;
    diagnosis?: string;
    toothNumber?: number;
    dmftRecorded?: boolean;
    vitalsRecorded?: boolean;
    ohisRecorded?: boolean;
    xrayAttached?: boolean;
    treatmentPlan?: string;
    medicationPrescribed?: string;
    followUpScheduled?: boolean;
    consentObtained?: boolean;
}

export interface PatientVisit {
    id: string;
    patientId: string;
    clinicId: string;
    doctorId: string;
    visitDate: string;
    status: 'scheduled' | 'completed' | 'no_show' | 'cancelled';
    treatmentType?: string;
    outcome?: 'positive' | 'neutral' | 'negative' | 'pending';
    followUpRequired?: boolean;
}

export interface Review {
    id: string;
    patientId: string;
    clinicId: string;
    doctorId: string;
    rating: number; // 1-5
    comment?: string;
    createdAt: string;
    isVerified: boolean;
    visitCount: number; // Number of completed visits before review
}

export interface CrossClinicComparison {
    patientId: string;
    toothNumber: number;
    clinicAId: string;
    clinicAVisitDate: string;
    clinicADiagnosis?: string;
    clinicBId: string;
    clinicBVisitDate: string;
    clinicBDiagnosis: string;
    daysBetween: number;
    isMissedDiagnosis: boolean;
}

// =============================================================================
// RANK CALCULATOR SERVICE
// =============================================================================

export class RankCalculator {
    private readonly DILIGENCE_WEIGHT = 0.40;
    private readonly SUCCESS_WEIGHT = 0.20;
    private readonly REVIEW_WEIGHT = 0.20;
    private readonly PEER_WEIGHT = 0.20;
    private readonly REVIEW_GATE_VISITS = 2;
    private readonly PEER_COMPARISON_WINDOW_DAYS = 30;
    private readonly MISSED_DIAGNOSIS_PENALTY = 50;

    /**
     * Calculate full trust score for a clinic
     */
    calculateTrustScore(
        clinicId: string,
        clinicName: string,
        dciNumber: string,
        notes: ClinicalNote[],
        visits: PatientVisit[],
        reviews: Review[],
        crossComparisons: CrossClinicComparison[],
        exploitFlags: ExploitFlag[]
    ): ClinicRankProfile {
        const clinicNotes = notes.filter(n => n.clinicId === clinicId);
        const clinicVisits = visits.filter(v => v.clinicId === clinicId);
        const clinicReviews = reviews.filter(r => r.clinicId === clinicId);

        // Calculate each pillar
        const diligence = this.calculateClinicalDiligence(clinicNotes);
        const success = this.calculatePatientSuccessRate(clinicVisits);
        const reviewScore = this.calculateReviewRating(clinicReviews);
        const peerScore = this.calculatePeerAccuracy(clinicId, crossComparisons);

        // Apply exploit flags
        const activeFlags = exploitFlags.filter(f => !f.resolved);
        let manualAdjustment = 0;
        activeFlags.forEach(flag => {
            if (flag.adjustment) {
                manualAdjustment += flag.adjustment;
            }
        });

        // Calculate total
        let totalScore =
            diligence.score +
            success.score +
            reviewScore.score +
            peerScore.score +
            manualAdjustment;

        // Clamp to 0-1000
        totalScore = Math.max(0, Math.min(1000, totalScore));

        // Determine tier
        const tier = this.determineTier(totalScore, activeFlags);

        return {
            clinicId,
            clinicName,
            dciNumber,
            trustScore: Math.round(totalScore),
            breakdown: {
                clinicalDiligence: diligence,
                patientSuccessRate: success,
                reviewRating: reviewScore,
                peerAccuracy: peerScore
            },
            tier,
            lastUpdated: new Date().toISOString(),
            isVerified: dciNumber.length > 0,
            exploitFlags: activeFlags
        };
    }

    /**
     * PILLAR 1: Clinical Diligence (40% = 400 points)
     * Rewards thorough documentation
     */
    private calculateClinicalDiligence(notes: ClinicalNote[]): RankBreakdown['clinicalDiligence'] {
        if (notes.length === 0) {
            return { score: 0, maxScore: 400, details: 'No clinical notes recorded' };
        }

        const fieldWeights: Record<keyof ClinicalNoteMetadata, number> = {
            chiefComplaint: 10,
            clinicalFindings: 15,
            diagnosis: 15,
            toothNumber: 5,
            dmftRecorded: 20,
            vitalsRecorded: 10,
            ohisRecorded: 15,
            xrayAttached: 10,
            treatmentPlan: 15,
            medicationPrescribed: 5,
            followUpScheduled: 10,
            consentObtained: 10
        };

        const maxPointsPerNote = Object.values(fieldWeights).reduce((a, b) => a + b, 0); // 140
        let totalPoints = 0;

        notes.forEach(note => {
            let notePoints = 0;
            Object.entries(note.metadata).forEach(([field, value]) => {
                if (value !== undefined && value !== null && value !== '' && value !== false) {
                    notePoints += fieldWeights[field as keyof ClinicalNoteMetadata] || 0;
                }
            });
            totalPoints += notePoints;
        });

        // Average completeness across notes, scaled to 400
        const avgCompleteness = (totalPoints / notes.length) / maxPointsPerNote;
        const score = Math.round(avgCompleteness * 400);

        const completenessPercent = Math.round(avgCompleteness * 100);
        return {
            score,
            maxScore: 400,
            details: `${completenessPercent}% average note completeness across ${notes.length} notes`
        };
    }

    /**
     * PILLAR 2: Patient Success Rate (20% = 200 points)
     * Based on positive outcomes
     */
    private calculatePatientSuccessRate(visits: PatientVisit[]): RankBreakdown['patientSuccessRate'] {
        const completedVisits = visits.filter(v => v.status === 'completed');

        if (completedVisits.length === 0) {
            return { score: 0, maxScore: 200, details: 'No completed visits' };
        }

        const visitedWithOutcome = completedVisits.filter(v => v.outcome);
        const positiveOutcomes = visitedWithOutcome.filter(v => v.outcome === 'positive').length;
        const negativeOutcomes = visitedWithOutcome.filter(v => v.outcome === 'negative').length;

        if (visitedWithOutcome.length === 0) {
            return { score: 100, maxScore: 200, details: 'Outcomes pending assessment' };
        }

        // Score formula: positive rate weighted, negative impacts harder
        const positiveRate = positiveOutcomes / visitedWithOutcome.length;
        const negativeRate = negativeOutcomes / visitedWithOutcome.length;

        let score = Math.round(positiveRate * 200 - negativeRate * 100);
        score = Math.max(0, score);

        return {
            score,
            maxScore: 200,
            details: `${positiveOutcomes} positive, ${negativeOutcomes} negative outcomes from ${visitedWithOutcome.length} assessed visits`
        };
    }

    /**
     * PILLAR 3: Review Rating (20% = 200 points)
     * GATED: Only counts after 2 successful visits per patient-doctor pair
     */
    private calculateReviewRating(reviews: Review[]): RankBreakdown['reviewRating'] {
        // Filter to only verified, gated reviews
        const gatedReviews = reviews.filter(r => r.isVerified && r.visitCount >= this.REVIEW_GATE_VISITS);

        if (gatedReviews.length === 0) {
            return {
                score: 100, // Start at 50% (neutral) if no gated reviews
                maxScore: 200,
                details: 'Awaiting qualified reviews (min 2 visits required)',
                isGated: true
            };
        }

        const avgRating = gatedReviews.reduce((sum, r) => sum + r.rating, 0) / gatedReviews.length;
        const score = Math.round((avgRating / 5) * 200);

        return {
            score,
            maxScore: 200,
            details: `${avgRating.toFixed(1)}/5 average from ${gatedReviews.length} verified reviews`,
            isGated: false
        };
    }

    /**
     * PILLAR 4: Silent Peer Accuracy (20% = 200 points)
     * Cross-clinic diagnosis comparison - deductions for missed diagnoses
     */
    private calculatePeerAccuracy(
        clinicId: string,
        comparisons: CrossClinicComparison[]
    ): RankBreakdown['peerAccuracy'] {
        // Find cases where this clinic was Clinic A and missed something
        const missedCases = comparisons.filter(c =>
            c.clinicAId === clinicId &&
            c.isMissedDiagnosis &&
            c.daysBetween <= this.PEER_COMPARISON_WINDOW_DAYS
        );

        const deductions = missedCases.length * this.MISSED_DIAGNOSIS_PENALTY;
        const score = Math.max(0, 200 - deductions);

        return {
            score,
            maxScore: 200,
            details: missedCases.length === 0
                ? 'No missed diagnoses detected'
                : `${missedCases.length} potential missed diagnosis(es) detected`,
            silentDeductions: deductions
        };
    }

    /**
     * Determine trust tier based on score and flags
     */
    private determineTier(score: number, activeFlags: ExploitFlag[]): TrustTier {
        if (activeFlags.some(f => f.type === 'negligence')) return 'Flagged';
        if (score >= 850) return 'Platinum';
        if (score >= 700) return 'Gold';
        if (score >= 550) return 'Silver';
        if (score >= 400) return 'Bronze';
        return 'Unranked';
    }

    /**
     * Flag a clinic for exploit/suspicious activity
     */
    createExploitFlag(
        clinicId: string,
        type: ExploitFlag['type'],
        description: string,
        flaggedBy: string,
        adjustment?: number
    ): ExploitFlag {
        return {
            id: uuidv4(),
            type,
            description,
            flaggedAt: new Date().toISOString(),
            flaggedBy,
            resolved: false,
            adjustment
        };
    }

    /**
     * Resolve an exploit flag
     */
    resolveExploitFlag(flag: ExploitFlag): ExploitFlag {
        return {
            ...flag,
            resolved: true,
            resolvedAt: new Date().toISOString()
        };
    }
}

// Singleton export
export const rankCalculator = new RankCalculator();
