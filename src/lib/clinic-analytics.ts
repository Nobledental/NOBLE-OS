/**
 * Phase 25: Business Oracle - Clinic Analytics Engine
 * 
 * BI Engine with conversion rates, LTV, leakage detection, and forecasting
 */

import { v4 as uuid } from 'uuid';

// =============================================================================
// TYPES
// =============================================================================

export interface ConversionMetrics {
    totalDiagnosed: number;
    totalAccepted: number;
    conversionRate: number;
    byProcedure: Map<string, { diagnosed: number; accepted: number; rate: number }>;
    byDoctor: Map<string, { diagnosed: number; accepted: number; rate: number }>;
    trend: 'up' | 'down' | 'stable';
    previousPeriodRate: number;
}

export interface PatientLTV {
    patientId: string;
    patientName: string;
    firstVisit: Date;
    totalRevenue: number;
    visitCount: number;
    avgRevenuePerVisit: number;
    ltv12Month: number;
    predictedLifetimeValue: number;
    riskOfChurn: 'low' | 'medium' | 'high';
    lastVisit: Date;
    daysSinceLastVisit: number;
}

export interface RevenueLeakage {
    id: string;
    category: 'DIAGNOSED_NOT_SCHEDULED' | 'INCOMPLETE_TREATMENT' | 'DROPPED_PATIENT' | 'PROSTHETIC_CONVERSION';
    description: string;
    patientId: string;
    patientName: string;
    procedureCode: string;
    procedureName: string;
    potentialRevenue: number;
    diagnosedAt: Date;
    daysPending: number;
    suggestedAction: string;
}

export interface MonthlyForecast {
    month: string;
    year: number;
    predictedCaseVolume: number;
    predictedRevenue: number;
    confidence: number;
    factors: string[];
    suggestions: string[];
}

export interface SourceAnalysis {
    source: 'SEO' | 'GOOGLE_ADS' | 'REFERRAL' | 'REPEAT' | 'WALK_IN' | 'SOCIAL' | 'OTHER';
    patientCount: number;
    revenue: number;
    conversionRate: number;
    avgTicketSize: number;
    costPerAcquisition?: number;
    roi?: number;
}

export interface ClinicAnalyticsSummary {
    period: { from: Date; to: Date };
    conversion: ConversionMetrics;
    avgLTV: number;
    topPatientsByLTV: PatientLTV[];
    totalLeakage: number;
    leakageItems: RevenueLeakage[];
    forecast: MonthlyForecast;
    sourceBreakdown: SourceAnalysis[];
    insights: string[];
}

// =============================================================================
// CLINIC ANALYTICS SERVICE
// =============================================================================

export class ClinicAnalyticsService {
    /**
     * Calculate conversion rate metrics
     */
    calculateConversionRate(
        diagnoses: Array<{
            id: string;
            patientId: string;
            procedureCode: string;
            doctorId: string;
            diagnosedAt: Date;
            accepted: boolean;
            acceptedAt?: Date;
        }>,
        periodDays: number = 30
    ): ConversionMetrics {
        const cutoff = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
        const current = diagnoses.filter(d => d.diagnosedAt >= cutoff);
        const previous = diagnoses.filter(d => {
            const prevCutoff = new Date(cutoff.getTime() - periodDays * 24 * 60 * 60 * 1000);
            return d.diagnosedAt >= prevCutoff && d.diagnosedAt < cutoff;
        });

        const totalDiagnosed = current.length;
        const totalAccepted = current.filter(d => d.accepted).length;
        const conversionRate = totalDiagnosed > 0 ? (totalAccepted / totalDiagnosed) * 100 : 0;

        const prevTotal = previous.length;
        const prevAccepted = previous.filter(d => d.accepted).length;
        const previousPeriodRate = prevTotal > 0 ? (prevAccepted / prevTotal) * 100 : 0;

        // By procedure
        const byProcedure = new Map<string, { diagnosed: number; accepted: number; rate: number }>();
        for (const d of current) {
            const existing = byProcedure.get(d.procedureCode) || { diagnosed: 0, accepted: 0, rate: 0 };
            existing.diagnosed++;
            if (d.accepted) existing.accepted++;
            existing.rate = (existing.accepted / existing.diagnosed) * 100;
            byProcedure.set(d.procedureCode, existing);
        }

        // By doctor
        const byDoctor = new Map<string, { diagnosed: number; accepted: number; rate: number }>();
        for (const d of current) {
            const existing = byDoctor.get(d.doctorId) || { diagnosed: 0, accepted: 0, rate: 0 };
            existing.diagnosed++;
            if (d.accepted) existing.accepted++;
            existing.rate = (existing.accepted / existing.diagnosed) * 100;
            byDoctor.set(d.doctorId, existing);
        }

        const trend = conversionRate > previousPeriodRate + 2 ? 'up' :
            conversionRate < previousPeriodRate - 2 ? 'down' : 'stable';

        return {
            totalDiagnosed,
            totalAccepted,
            conversionRate,
            byProcedure,
            byDoctor,
            trend,
            previousPeriodRate
        };
    }

    /**
     * Calculate Patient Lifetime Value
     */
    calculatePatientLTV(
        patientId: string,
        patientName: string,
        invoices: Array<{
            date: Date;
            total: number;
        }>,
        firstVisit: Date
    ): PatientLTV {
        const now = new Date();
        const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const visitCount = invoices.length;
        const avgRevenuePerVisit = visitCount > 0 ? totalRevenue / visitCount : 0;

        // Calculate 12-month LTV
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        const ltv12Month = invoices
            .filter(inv => inv.date >= oneYearAgo)
            .reduce((sum, inv) => sum + inv.total, 0);

        // Predict lifetime value (simple: avg per year * expected years)
        const monthsActive = Math.max(1, (now.getTime() - firstVisit.getTime()) / (30 * 24 * 60 * 60 * 1000));
        const monthlyAvg = totalRevenue / monthsActive;
        const predictedLifetimeValue = monthlyAvg * 60; // 5 years

        // Last visit and churn risk
        const sortedInvoices = [...invoices].sort((a, b) => b.date.getTime() - a.date.getTime());
        const lastVisit = sortedInvoices[0]?.date || firstVisit;
        const daysSinceLastVisit = Math.floor((now.getTime() - lastVisit.getTime()) / (24 * 60 * 60 * 1000));

        const riskOfChurn: 'low' | 'medium' | 'high' =
            daysSinceLastVisit > 365 ? 'high' :
                daysSinceLastVisit > 180 ? 'medium' : 'low';

        return {
            patientId,
            patientName,
            firstVisit,
            totalRevenue,
            visitCount,
            avgRevenuePerVisit,
            ltv12Month,
            predictedLifetimeValue,
            riskOfChurn,
            lastVisit,
            daysSinceLastVisit
        };
    }

    /**
     * Detect revenue leakage
     */
    detectRevenueLeakage(
        diagnoses: Array<{
            id: string;
            patientId: string;
            patientName: string;
            procedureCode: string;
            procedureName: string;
            estimatedPrice: number;
            diagnosedAt: Date;
            scheduled: boolean;
            completed: boolean;
        }>,
        tariffs: Map<string, number>
    ): RevenueLeakage[] {
        const leakages: RevenueLeakage[] = [];
        const now = new Date();

        for (const diagnosis of diagnoses) {
            const daysPending = Math.floor(
                (now.getTime() - diagnosis.diagnosedAt.getTime()) / (24 * 60 * 60 * 1000)
            );

            // Diagnosed but not scheduled (after 14 days)
            if (!diagnosis.scheduled && daysPending > 14) {
                leakages.push({
                    id: uuid(),
                    category: 'DIAGNOSED_NOT_SCHEDULED',
                    description: `${diagnosis.procedureName} diagnosed but not scheduled`,
                    patientId: diagnosis.patientId,
                    patientName: diagnosis.patientName,
                    procedureCode: diagnosis.procedureCode,
                    procedureName: diagnosis.procedureName,
                    potentialRevenue: diagnosis.estimatedPrice || tariffs.get(diagnosis.procedureCode) || 0,
                    diagnosedAt: diagnosis.diagnosedAt,
                    daysPending,
                    suggestedAction: `Call ${diagnosis.patientName} to schedule ${diagnosis.procedureName}`
                });
            }

            // Incomplete treatment (scheduled but not completed after 30 days)
            if (diagnosis.scheduled && !diagnosis.completed && daysPending > 30) {
                leakages.push({
                    id: uuid(),
                    category: 'INCOMPLETE_TREATMENT',
                    description: `${diagnosis.procedureName} scheduled but incomplete`,
                    patientId: diagnosis.patientId,
                    patientName: diagnosis.patientName,
                    procedureCode: diagnosis.procedureCode,
                    procedureName: diagnosis.procedureName,
                    potentialRevenue: diagnosis.estimatedPrice || tariffs.get(diagnosis.procedureCode) || 0,
                    diagnosedAt: diagnosis.diagnosedAt,
                    daysPending,
                    suggestedAction: `Follow up with ${diagnosis.patientName} for treatment completion`
                });
            }
        }

        // Check for prosthetic conversion (RCT without Crown)
        const rctPatients = diagnoses
            .filter(d => d.procedureCode === 'RCT' && d.completed)
            .map(d => d.patientId);

        const crownPatients = new Set(
            diagnoses
                .filter(d => d.procedureCode === 'CROWN' && d.scheduled)
                .map(d => d.patientId)
        );

        for (const patientId of rctPatients) {
            if (!crownPatients.has(patientId)) {
                const rctDiagnosis = diagnoses.find(d => d.patientId === patientId && d.procedureCode === 'RCT');
                if (rctDiagnosis) {
                    leakages.push({
                        id: uuid(),
                        category: 'PROSTHETIC_CONVERSION',
                        description: 'RCT completed without Crown scheduled',
                        patientId: rctDiagnosis.patientId,
                        patientName: rctDiagnosis.patientName,
                        procedureCode: 'CROWN',
                        procedureName: 'Crown',
                        potentialRevenue: tariffs.get('CROWN') || 5000,
                        diagnosedAt: rctDiagnosis.diagnosedAt,
                        daysPending: Math.floor((now.getTime() - rctDiagnosis.diagnosedAt.getTime()) / (24 * 60 * 60 * 1000)),
                        suggestedAction: `Remind ${rctDiagnosis.patientName} about Crown for RCT tooth`
                    });
                }
            }
        }

        return leakages;
    }

    /**
     * Simple linear regression forecasting
     */
    forecastNextMonth(
        historicalData: Array<{ month: number; year: number; caseVolume: number; revenue: number }>,
        targetMonth: number,
        targetYear: number
    ): MonthlyForecast {
        if (historicalData.length < 3) {
            return {
                month: new Date(targetYear, targetMonth - 1).toLocaleString('en-IN', { month: 'long' }),
                year: targetYear,
                predictedCaseVolume: 0,
                predictedRevenue: 0,
                confidence: 0,
                factors: ['Insufficient historical data'],
                suggestions: ['Continue recording data for accurate forecasts']
            };
        }

        // Convert months to sequential numbers for regression
        const data = historicalData.map((d, i) => ({
            x: i,
            caseVolume: d.caseVolume,
            revenue: d.revenue
        }));

        // Simple linear regression
        const n = data.length;
        const sumX = data.reduce((s, d) => s + d.x, 0);
        const sumCases = data.reduce((s, d) => s + d.caseVolume, 0);
        const sumRevenue = data.reduce((s, d) => s + d.revenue, 0);
        const sumXCases = data.reduce((s, d) => s + d.x * d.caseVolume, 0);
        const sumXRevenue = data.reduce((s, d) => s + d.x * d.revenue, 0);
        const sumX2 = data.reduce((s, d) => s + d.x * d.x, 0);

        const casesSlope = (n * sumXCases - sumX * sumCases) / (n * sumX2 - sumX * sumX);
        const casesIntercept = (sumCases - casesSlope * sumX) / n;

        const revenueSlope = (n * sumXRevenue - sumX * sumRevenue) / (n * sumX2 - sumX * sumX);
        const revenueIntercept = (sumRevenue - revenueSlope * sumX) / n;

        const nextX = n;
        const predictedCaseVolume = Math.round(casesSlope * nextX + casesIntercept);
        const predictedRevenue = Math.round(revenueSlope * nextX + revenueIntercept);

        // Calculate confidence based on data consistency
        const avgCases = sumCases / n;
        const variance = data.reduce((s, d) => s + Math.pow(d.caseVolume - avgCases, 2), 0) / n;
        const stdDev = Math.sqrt(variance);
        const coefficientOfVariation = avgCases > 0 ? (stdDev / avgCases) * 100 : 100;
        const confidence = Math.max(0, Math.min(95, 100 - coefficientOfVariation));

        // Generate insights
        const factors: string[] = [];
        const suggestions: string[] = [];

        if (casesSlope > 0) {
            factors.push('Upward trend in case volume');
        } else if (casesSlope < 0) {
            factors.push('Downward trend in case volume');
            suggestions.push('Consider launching promotional offers');
        }

        // Check for seasonality
        if (targetMonth === 5) {
            factors.push('May typically sees 30% spike (school holidays)');
            suggestions.push('Launch pediatric dental check-up campaign');
        }
        if (targetMonth === 12) {
            factors.push('December typically slower (holiday season)');
        }

        if (predictedCaseVolume > avgCases * 1.2) {
            suggestions.push('Expect high volume - consider extending hours or adding staff');
        }

        return {
            month: new Date(targetYear, targetMonth - 1).toLocaleString('en-IN', { month: 'long' }),
            year: targetYear,
            predictedCaseVolume,
            predictedRevenue,
            confidence,
            factors,
            suggestions
        };
    }

    /**
     * Analyze patient acquisition sources
     */
    analyzeSourceBreakdown(
        patients: Array<{
            id: string;
            source: SourceAnalysis['source'];
            totalRevenue: number;
            visitCount: number;
            converted: boolean;
        }>,
        marketingCosts?: Map<SourceAnalysis['source'], number>
    ): SourceAnalysis[] {
        const sourceMap = new Map<SourceAnalysis['source'], {
            patients: typeof patients;
            revenue: number;
            converted: number;
        }>();

        for (const patient of patients) {
            const existing = sourceMap.get(patient.source) || { patients: [], revenue: 0, converted: 0 };
            existing.patients.push(patient);
            existing.revenue += patient.totalRevenue;
            if (patient.converted) existing.converted++;
            sourceMap.set(patient.source, existing);
        }

        const results: SourceAnalysis[] = [];
        for (const [source, data] of sourceMap.entries()) {
            const patientCount = data.patients.length;
            const conversionRate = patientCount > 0 ? (data.converted / patientCount) * 100 : 0;
            const avgTicketSize = patientCount > 0 ? data.revenue / patientCount : 0;
            const cost = marketingCosts?.get(source);
            const cpa = cost && patientCount > 0 ? cost / patientCount : undefined;
            const roi = cost && data.revenue > 0 ? ((data.revenue - cost) / cost) * 100 : undefined;

            results.push({
                source,
                patientCount,
                revenue: data.revenue,
                conversionRate,
                avgTicketSize,
                costPerAcquisition: cpa,
                roi
            });
        }

        return results.sort((a, b) => b.revenue - a.revenue);
    }

    /**
     * Generate smart offer suggestions
     */
    generateOfferSuggestions(
        chairUtilization: Map<string, number>, // dayOfWeek -> percentage
        procedureTrends: Map<string, number>, // procedureCode -> change percentage
        seasonalFactors: { month: number; events: string[] }
    ): Array<{
        title: string;
        description: string;
        discountType: 'percentage' | 'flat';
        discountValue: number;
        targetProcedures: string[];
        suggestedDays: string[];
        reason: string;
    }> {
        const suggestions: Array<{
            title: string;
            description: string;
            discountType: 'percentage' | 'flat';
            discountValue: number;
            targetProcedures: string[];
            suggestedDays: string[];
            reason: string;
        }> = [];

        // Check for low utilization days
        for (const [day, utilization] of chairUtilization.entries()) {
            if (utilization < 50) {
                const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][parseInt(day)];
                suggestions.push({
                    title: `${dayName} Special`,
                    description: `25% off all procedures on ${dayName} mornings`,
                    discountType: 'percentage',
                    discountValue: 25,
                    targetProcedures: ['ALL'],
                    suggestedDays: [dayName],
                    reason: `Chair utilization is only ${utilization}% on ${dayName}s`
                });
            }
        }

        // Check for declining procedure trends
        for (const [procedure, change] of procedureTrends.entries()) {
            if (change < -20) {
                suggestions.push({
                    title: `${procedure} Boost`,
                    description: `10% off ${procedure} treatments this month`,
                    discountType: 'percentage',
                    discountValue: 10,
                    targetProcedures: [procedure],
                    suggestedDays: ['All'],
                    reason: `${procedure} enquiries are down ${Math.abs(change)}%`
                });
            }
        }

        // Seasonal suggestions
        if (seasonalFactors.month === 5) {
            suggestions.push({
                title: 'Back to School Check-up',
                description: 'Free consultation + ₹500 off first treatment for children',
                discountType: 'flat',
                discountValue: 500,
                targetProcedures: ['CONSULTATION', 'SCALING', 'FILLING'],
                suggestedDays: ['All'],
                reason: 'School holiday season - peak time for pediatric visits'
            });
        }

        return suggestions;
    }
}

export const clinicAnalyticsService = new ClinicAnalyticsService();
