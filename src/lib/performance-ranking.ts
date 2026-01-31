/**
 * Phase 24: Weekly Performance Ranking System
 * 
 * Dynamic star ratings with Monday reset and Featured status
 */

import { v4 as uuid } from 'uuid';

// =============================================================================
// TYPES
// =============================================================================

export type PerformanceCategory =
    | 'RECORD_SHARING'
    | 'CLINICAL_COMPLETION'
    | 'PATIENT_SATISFACTION'
    | 'RESPONSE_TIME'
    | 'NO_SHOW_RATE';

export interface PointEvent {
    id: string;
    clinicId: string;
    category: PerformanceCategory;
    points: number;
    reason: string;
    metadata?: Record<string, any>;
    occurredAt: Date;
    weekNumber: number;
    year: number;
}

export interface WeeklyPerformanceScore {
    id: string;
    clinicId: string;
    clinicName: string;
    weekNumber: number;
    year: number;
    startDate: Date;
    endDate: Date;

    // Scores by category (0-100)
    scores: {
        recordSharing: number;
        clinicalCompletion: number;
        patientSatisfaction: number;
        responseTime: number;
        noShowRate: number;
    };

    // Totals
    totalPoints: number;
    maxPossiblePoints: number;
    percentageScore: number;

    // Status
    isFeatured: boolean;
    rank: number;
    previousRank?: number;
    rankChange?: number;

    // Point breakdown
    pointGains: PointEvent[];
    pointLosses: PointEvent[];

    calculatedAt: Date;
}

export interface FeaturedStatus {
    clinicId: string;
    featuredFrom: Date;
    featuredUntil: Date;
    reason: string;
    badge: 'gold' | 'silver' | 'bronze';
    displayOrder: number;
}

// Point values
export const POINT_VALUES = {
    // Gains (+)
    INSTANT_RECORD_SHARE: 10,
    SAME_DAY_SHARE: 5,
    COMPLETE_CASE_SHEET: 15,
    PATIENT_REVIEW_5_STAR: 25,
    PATIENT_REVIEW_4_STAR: 15,
    FAST_RESPONSE_UNDER_5_MIN: 10,
    NO_CANCELLATIONS_DAY: 5,
    ZERO_NO_SHOWS_DAY: 10,

    // Losses (-)
    LATE_SHARE_48HR: -100,
    INCOMPLETE_CASE_SHEET: -25,
    PATIENT_COMPLAINT: -50,
    MISSED_DIAGNOSIS_REPORT: -75,
    SLOW_RESPONSE_OVER_1HR: -10,
    PATIENT_NO_SHOW: -5,
    DISCREPANCY_REPORTED: -30
};

// =============================================================================
// WEEKLY PERFORMANCE SERVICE
// =============================================================================

export class WeeklyPerformanceService {
    private readonly FEATURED_THRESHOLD = 90;
    private readonly BASE_POINTS_PER_WEEK = 500;

    /**
     * Get week number from date
     */
    getWeekNumber(date: Date): { week: number; year: number } {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        return { week, year: d.getUTCFullYear() };
    }

    /**
     * Get Monday of current week
     */
    getMondayOfWeek(date: Date = new Date()): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    /**
     * Record a point event
     */
    recordPointEvent(
        clinicId: string,
        category: PerformanceCategory,
        points: number,
        reason: string,
        metadata?: Record<string, any>
    ): PointEvent {
        const now = new Date();
        const { week, year } = this.getWeekNumber(now);

        return {
            id: uuid(),
            clinicId,
            category,
            points,
            reason,
            metadata,
            occurredAt: now,
            weekNumber: week,
            year
        };
    }

    /**
     * Calculate weekly performance score
     */
    calculateWeeklyScore(
        clinicId: string,
        clinicName: string,
        events: PointEvent[],
        weekNumber: number,
        year: number
    ): WeeklyPerformanceScore {
        // Filter events for this week
        const weekEvents = events.filter(e =>
            e.weekNumber === weekNumber &&
            e.year === year &&
            e.clinicId === clinicId
        );

        const pointGains = weekEvents.filter(e => e.points > 0);
        const pointLosses = weekEvents.filter(e => e.points < 0);

        // Calculate total points
        const totalPoints = weekEvents.reduce((sum, e) => sum + e.points, 0);
        const maxPossiblePoints = this.BASE_POINTS_PER_WEEK +
            pointGains.reduce((sum, e) => sum + e.points, 0);

        // Calculate percentage (capped at 0-100)
        const percentageScore = Math.max(0, Math.min(100,
            ((totalPoints + this.BASE_POINTS_PER_WEEK) / (this.BASE_POINTS_PER_WEEK * 2)) * 100
        ));

        // Calculate category scores
        const scores = this.calculateCategoryScores(weekEvents);

        // Determine featured status
        const isFeatured = percentageScore >= this.FEATURED_THRESHOLD;

        // Get week dates
        const monday = this.getMondayOfWeek();
        monday.setDate(monday.getDate() + (weekNumber - this.getWeekNumber(new Date()).week) * 7);
        const sunday = new Date(monday);
        sunday.setDate(sunday.getDate() + 6);

        return {
            id: uuid(),
            clinicId,
            clinicName,
            weekNumber,
            year,
            startDate: monday,
            endDate: sunday,
            scores,
            totalPoints,
            maxPossiblePoints,
            percentageScore,
            isFeatured,
            rank: 0, // Set during ranking
            pointGains,
            pointLosses,
            calculatedAt: new Date()
        };
    }

    /**
     * Calculate category scores
     */
    private calculateCategoryScores(events: PointEvent[]): WeeklyPerformanceScore['scores'] {
        const categoryPoints: Record<PerformanceCategory, { earned: number; possible: number }> = {
            RECORD_SHARING: { earned: 0, possible: 100 },
            CLINICAL_COMPLETION: { earned: 0, possible: 100 },
            PATIENT_SATISFACTION: { earned: 0, possible: 100 },
            RESPONSE_TIME: { earned: 0, possible: 100 },
            NO_SHOW_RATE: { earned: 0, possible: 100 }
        };

        for (const event of events) {
            if (categoryPoints[event.category]) {
                categoryPoints[event.category].earned += event.points;
            }
        }

        const calcScore = (cat: PerformanceCategory) =>
            Math.max(0, Math.min(100, 50 + categoryPoints[cat].earned));

        return {
            recordSharing: calcScore('RECORD_SHARING'),
            clinicalCompletion: calcScore('CLINICAL_COMPLETION'),
            patientSatisfaction: calcScore('PATIENT_SATISFACTION'),
            responseTime: calcScore('RESPONSE_TIME'),
            noShowRate: calcScore('NO_SHOW_RATE')
        };
    }

    /**
     * Perform Monday reset - recalculate all rankings
     */
    performMondayReset(
        clinicScores: WeeklyPerformanceScore[],
        previousWeekRanks: Map<string, number>
    ): WeeklyPerformanceScore[] {
        // Sort by percentage score
        const sorted = [...clinicScores].sort((a, b) =>
            b.percentageScore - a.percentageScore
        );

        // Assign ranks
        return sorted.map((score, index) => {
            const previousRank = previousWeekRanks.get(score.clinicId);
            return {
                ...score,
                rank: index + 1,
                previousRank,
                rankChange: previousRank ? previousRank - (index + 1) : undefined
            };
        });
    }

    /**
     * Get featured clinics
     */
    getFeaturedClinics(scores: WeeklyPerformanceScore[]): FeaturedStatus[] {
        const featured = scores
            .filter(s => s.isFeatured)
            .sort((a, b) => b.percentageScore - a.percentageScore)
            .slice(0, 10);

        const now = new Date();
        const nextMonday = this.getMondayOfWeek();
        nextMonday.setDate(nextMonday.getDate() + 7);

        return featured.map((score, index) => ({
            clinicId: score.clinicId,
            featuredFrom: now,
            featuredUntil: nextMonday,
            reason: `Top ${index + 1} Performer - Week ${score.weekNumber}`,
            badge: index === 0 ? 'gold' : index <= 2 ? 'silver' : 'bronze',
            displayOrder: index + 1
        }));
    }

    /**
     * Generate performance summary message
     */
    generateSummaryMessage(score: WeeklyPerformanceScore): string {
        const lines: string[] = [
            `📊 Weekly Performance Report`,
            `Week ${score.weekNumber}, ${score.year}`,
            ``,
            `Overall Score: ${score.percentageScore.toFixed(1)}%`,
            `Rank: #${score.rank}${score.rankChange ? ` (${score.rankChange > 0 ? '↑' : '↓'}${Math.abs(score.rankChange)})` : ''}`,
            ``
        ];

        if (score.isFeatured) {
            lines.push(`🌟 FEATURED CLINIC - Congratulations!`);
            lines.push(``);
        }

        lines.push(`Point Gains: +${score.pointGains.reduce((s, e) => s + e.points, 0)}`);
        lines.push(`Point Losses: ${score.pointLosses.reduce((s, e) => s + e.points, 0)}`);

        return lines.join('\n');
    }

    /**
     * Check for significant point events and generate alerts
     */
    checkForAlerts(events: PointEvent[]): string[] {
        const alerts: string[] = [];
        const recent = events.filter(e =>
            Date.now() - e.occurredAt.getTime() < 24 * 60 * 60 * 1000
        );

        const majorLosses = recent.filter(e => e.points <= -50);
        if (majorLosses.length > 0) {
            alerts.push(`⚠️ ${majorLosses.length} major point deduction(s) today`);
        }

        const totalLossToday = recent
            .filter(e => e.points < 0)
            .reduce((sum, e) => sum + e.points, 0);

        if (totalLossToday < -100) {
            alerts.push(`🔴 Lost ${Math.abs(totalLossToday)} points today - Review immediately`);
        }

        return alerts;
    }
}

export const weeklyPerformanceService = new WeeklyPerformanceService();
