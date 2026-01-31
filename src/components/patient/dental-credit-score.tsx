'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    TrendingUp, TrendingDown, Shield, AlertTriangle,
    CheckCircle, Target, Trophy, Star, Zap
} from 'lucide-react';

interface DentalCreditScoreProps {
    patientId: string;
    // Historical data points
    treatmentsCompleted: number;
    treatmentsPending: number;
    missedAppointments: number;
    cleaningsCompleted: number;
    lastVisitDaysAgo: number;
    activeCaries: number;
    dmftScore: number;
    perioStatus: 'healthy' | 'gingivitis' | 'periodontitis';
    smokingStatus: boolean;
}

interface ScoreBreakdown {
    category: string;
    points: number;
    maxPoints: number;
    status: 'positive' | 'negative' | 'neutral';
    message: string;
}

/**
 * Dental Credit Score - Like CIBIL for Oral Health
 * Gamified patient motivation dashboard
 */
export default function DentalCreditScore({
    patientId,
    treatmentsCompleted,
    treatmentsPending,
    missedAppointments,
    cleaningsCompleted,
    lastVisitDaysAgo,
    activeCaries,
    dmftScore,
    perioStatus,
    smokingStatus
}: DentalCreditScoreProps) {

    // Calculate score breakdown
    const breakdown = useMemo((): ScoreBreakdown[] => {
        const items: ScoreBreakdown[] = [];

        // Treatment Compliance (max 200)
        const complianceRatio = treatmentsCompleted / Math.max(treatmentsCompleted + treatmentsPending, 1);
        const compliancePoints = Math.round(complianceRatio * 200);
        items.push({
            category: 'Treatment Compliance',
            points: compliancePoints,
            maxPoints: 200,
            status: compliancePoints >= 150 ? 'positive' : compliancePoints >= 100 ? 'neutral' : 'negative',
            message: treatmentsPending === 0
                ? 'All treatments completed! 🎉'
                : `${treatmentsPending} treatment(s) pending`
        });

        // Visit Regularity (max 200)
        let visitPoints = 200;
        if (lastVisitDaysAgo > 365) visitPoints = 50;
        else if (lastVisitDaysAgo > 180) visitPoints = 100;
        else if (lastVisitDaysAgo > 90) visitPoints = 150;
        items.push({
            category: 'Visit Regularity',
            points: visitPoints,
            maxPoints: 200,
            status: visitPoints >= 150 ? 'positive' : visitPoints >= 100 ? 'neutral' : 'negative',
            message: lastVisitDaysAgo <= 90
                ? 'Regular checkups maintained'
                : `Last visit: ${lastVisitDaysAgo} days ago`
        });

        // Preventive Care (max 150)
        const preventivePoints = Math.min(cleaningsCompleted * 30, 150);
        items.push({
            category: 'Preventive Care',
            points: preventivePoints,
            maxPoints: 150,
            status: preventivePoints >= 90 ? 'positive' : preventivePoints >= 60 ? 'neutral' : 'negative',
            message: `${cleaningsCompleted} professional cleanings`
        });

        // Caries Risk (max 150)
        const cariesPoints = Math.max(150 - (activeCaries * 30), 0);
        items.push({
            category: 'Cavity-Free Score',
            points: cariesPoints,
            maxPoints: 150,
            status: cariesPoints >= 120 ? 'positive' : cariesPoints >= 60 ? 'neutral' : 'negative',
            message: activeCaries === 0 ? 'No active cavities!' : `${activeCaries} active cavit(ies)`
        });

        // Gum Health (max 150)
        let gumPoints = 150;
        if (perioStatus === 'gingivitis') gumPoints = 100;
        else if (perioStatus === 'periodontitis') gumPoints = 50;
        items.push({
            category: 'Gum Health',
            points: gumPoints,
            maxPoints: 150,
            status: gumPoints >= 120 ? 'positive' : gumPoints >= 80 ? 'neutral' : 'negative',
            message: perioStatus === 'healthy' ? 'Healthy gums' : `${perioStatus} detected`
        });

        // Appointment Reliability (max 100)
        const reliabilityPoints = Math.max(100 - (missedAppointments * 25), 0);
        items.push({
            category: 'Appointment Reliability',
            points: reliabilityPoints,
            maxPoints: 100,
            status: reliabilityPoints >= 75 ? 'positive' : reliabilityPoints >= 50 ? 'neutral' : 'negative',
            message: missedAppointments === 0
                ? 'Never missed an appointment!'
                : `${missedAppointments} missed appointment(s)`
        });

        // Risk Factors (max 50) - bonus for no smoking
        const riskPoints = smokingStatus ? 0 : 50;
        items.push({
            category: 'Lifestyle Bonus',
            points: riskPoints,
            maxPoints: 50,
            status: riskPoints === 50 ? 'positive' : 'negative',
            message: smokingStatus ? 'Smoking impacts oral health' : 'Non-smoker bonus!'
        });

        return items;
    }, [treatmentsCompleted, treatmentsPending, missedAppointments, cleaningsCompleted,
        lastVisitDaysAgo, activeCaries, perioStatus, smokingStatus]);

    // Total score (out of 1000)
    const totalScore = useMemo(() =>
        breakdown.reduce((sum, item) => sum + item.points, 0),
        [breakdown]
    );

    const maxScore = 1000;
    const scorePercentage = (totalScore / maxScore) * 100;

    // Score tier
    const getTier = () => {
        if (totalScore >= 850) return { tier: 'Platinum', color: 'from-purple-400 to-purple-600', icon: Trophy };
        if (totalScore >= 700) return { tier: 'Gold', color: 'from-yellow-400 to-orange-500', icon: Star };
        if (totalScore >= 550) return { tier: 'Silver', color: 'from-slate-300 to-slate-500', icon: Shield };
        if (totalScore >= 400) return { tier: 'Bronze', color: 'from-orange-300 to-orange-600', icon: Target };
        return { tier: 'Needs Attention', color: 'from-red-400 to-red-600', icon: AlertTriangle };
    };

    const tier = getTier();
    const TierIcon = tier.icon;

    // Trend (mock - would come from historical data)
    const trend = totalScore > 600 ? 'up' : 'down';

    return (
        <Card className="p-4 overflow-hidden">
            {/* Header with Score */}
            <div className={`-m-4 mb-4 p-6 bg-gradient-to-br ${tier.color} text-white`}>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm opacity-80">Dental Credit Score</div>
                        <div className="text-5xl font-bold mt-1">{totalScore}</div>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-white/20 text-white border-0">
                                <TierIcon className="w-3 h-3 mr-1" />
                                {tier.tier}
                            </Badge>
                            <Badge className={`${trend === 'up' ? 'bg-green-500' : 'bg-red-500'} text-white border-0`}>
                                {trend === 'up'
                                    ? <><TrendingUp className="w-3 h-3 mr-1" /> Improving</>
                                    : <><TrendingDown className="w-3 h-3 mr-1" /> Declining</>
                                }
                            </Badge>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center">
                            <TierIcon className="w-12 h-12" />
                        </div>
                        <div className="text-xs opacity-80 mt-2">out of {maxScore}</div>
                    </div>
                </div>
            </div>

            {/* Score Gauge */}
            <div className="mb-4">
                <Progress value={scorePercentage} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>250</span>
                    <span>500</span>
                    <span>750</span>
                    <span>1000</span>
                </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
                <h4 className="font-medium text-sm">Score Breakdown</h4>
                {breakdown.map((item) => (
                    <div key={item.category} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.status === 'positive' ? 'bg-green-100 text-green-600' :
                                item.status === 'negative' ? 'bg-red-100 text-red-600' :
                                    'bg-yellow-100 text-yellow-600'
                            }`}>
                            {item.status === 'positive' ? <CheckCircle className="w-4 h-4" /> :
                                item.status === 'negative' ? <AlertTriangle className="w-4 h-4" /> :
                                    <Zap className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{item.category}</span>
                                <span className="text-sm">
                                    <strong>{item.points}</strong>/{item.maxPoints}
                                </span>
                            </div>
                            <div className="text-xs text-muted-foreground">{item.message}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Motivational Tips */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Zap className="w-4 h-4 text-blue-500" />
                    Boost Your Score
                </h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                    {treatmentsPending > 0 && (
                        <li>✓ Complete pending treatments: +{Math.round((treatmentsPending / (treatmentsCompleted + treatmentsPending)) * 200)} potential points</li>
                    )}
                    {lastVisitDaysAgo > 90 && (
                        <li>✓ Schedule a checkup: +{200 - breakdown.find(b => b.category === 'Visit Regularity')!.points} potential points</li>
                    )}
                    {activeCaries > 0 && (
                        <li>✓ Treat active cavities: +{activeCaries * 30} potential points</li>
                    )}
                    {missedAppointments > 0 && (
                        <li>✓ Keep your next appointment: Build reliability score</li>
                    )}
                </ul>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
                Your Dental Credit Score helps track your oral health journey.
                Higher scores mean lower treatment costs!
            </p>
        </Card>
    );
}
