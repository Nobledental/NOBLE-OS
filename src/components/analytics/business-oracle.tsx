'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    TrendingUp, TrendingDown, AlertTriangle, DollarSign,
    Users, Target, Calendar, Lightbulb, ArrowRight,
    BarChart3, PieChart, Activity, Brain, Sparkles
} from 'lucide-react';
import {
    ConversionMetrics,
    PatientLTV,
    RevenueLeakage,
    MonthlyForecast,
    SourceAnalysis
} from '@/lib/clinic-analytics';
import { hapticPatterns } from '@/components/gestures/ios-gestures';

// =============================================================================
// CONVERSION RATE CARD
// =============================================================================

interface ConversionCardProps {
    metrics: ConversionMetrics;
    onViewDetails?: () => void;
}

export function ConversionCard({ metrics, onViewDetails }: ConversionCardProps) {
    const TrendIcon = metrics.trend === 'up' ? TrendingUp :
        metrics.trend === 'down' ? TrendingDown : Activity;
    const trendColor = metrics.trend === 'up' ? 'text-green-500' :
        metrics.trend === 'down' ? 'text-red-500' : 'text-gray-500';

    return (
        <Card className="glass-card p-4">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    <p className="text-3xl font-bold">{metrics.conversionRate.toFixed(1)}%</p>
                </div>
                <div className={`p-2 rounded-lg ${metrics.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30' : metrics.trend === 'down' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <TrendIcon className={`w-5 h-5 ${trendColor}`} />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Diagnosed</span>
                    <span className="font-medium">{metrics.totalDiagnosed}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accepted</span>
                    <span className="font-medium text-green-600">{metrics.totalAccepted}</span>
                </div>
                <Progress value={metrics.conversionRate} className="h-2" />
            </div>

            <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                    vs last period: {metrics.previousPeriodRate.toFixed(1)}%
                </span>
                {onViewDetails && (
                    <Button variant="ghost" size="sm" onClick={onViewDetails}>
                        Details <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                )}
            </div>
        </Card>
    );
}

// =============================================================================
// LTV LEADERBOARD
// =============================================================================

interface LTVLeaderboardProps {
    patients: PatientLTV[];
    limit?: number;
}

export function LTVLeaderboard({ patients, limit = 5 }: LTVLeaderboardProps) {
    const topPatients = [...patients]
        .sort((a, b) => b.predictedLifetimeValue - a.predictedLifetimeValue)
        .slice(0, limit);

    return (
        <Card className="glass-card p-4">
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Top Patients by LTV</h3>
            </div>

            <div className="space-y-3">
                {topPatients.map((patient, index) => (
                    <div key={patient.patientId} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-amber-100 text-amber-700' :
                            index === 1 ? 'bg-gray-100 text-gray-700' :
                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                    'bg-muted text-muted-foreground'
                            }`}>
                            {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{patient.patientName}</p>
                            <p className="text-xs text-muted-foreground">
                                {patient.visitCount} visits
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-medium text-green-600">
                                ₹{patient.predictedLifetimeValue.toLocaleString('en-IN')}
                            </p>
                            <Badge variant={
                                patient.riskOfChurn === 'low' ? 'default' :
                                    patient.riskOfChurn === 'medium' ? 'secondary' : 'destructive'
                            } className="text-xs">
                                {patient.riskOfChurn} risk
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

// =============================================================================
// REVENUE LEAKAGE ALERT
// =============================================================================

interface LeakageAlertProps {
    leakages: RevenueLeakage[];
    onAction?: (leakage: RevenueLeakage) => void;
}

export function LeakageAlert({ leakages, onAction }: LeakageAlertProps) {
    const [expanded, setExpanded] = useState(false);
    const totalLeakage = leakages.reduce((sum, l) => sum + l.potentialRevenue, 0);
    const displayLeakages = expanded ? leakages : leakages.slice(0, 3);

    if (leakages.length === 0) {
        return (
            <Card className="glass-card p-4 bg-green-50 dark:bg-green-950/20 border-green-200">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="font-medium text-green-700">No Revenue Leakage Detected</p>
                        <p className="text-sm text-green-600/80">All diagnosed treatments are on track</p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="glass-card p-4 border-amber-200 dark:border-amber-800">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="font-medium">Revenue Leakage Detected</p>
                        <p className="text-2xl font-bold text-amber-600">
                            ₹{totalLeakage.toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>
                <Badge variant="secondary">{leakages.length} items</Badge>
            </div>

            <div className="space-y-2">
                {displayLeakages.map((leakage) => (
                    <div
                        key={leakage.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                        <div className="flex-1">
                            <p className="font-medium text-sm">{leakage.patientName}</p>
                            <p className="text-xs text-muted-foreground">
                                {leakage.description} • {leakage.daysPending} days
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-amber-600">
                                ₹{leakage.potentialRevenue.toLocaleString('en-IN')}
                            </span>
                            {onAction && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        hapticPatterns.softTap();
                                        onAction(leakage);
                                    }}
                                >
                                    Act
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {leakages.length > 3 && (
                <Button
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? 'Show Less' : `Show ${leakages.length - 3} More`}
                </Button>
            )}
        </Card>
    );
}

// =============================================================================
// FORECAST CARD
// =============================================================================

interface ForecastCardProps {
    forecast: MonthlyForecast;
}

export function ForecastCard({ forecast }: ForecastCardProps) {
    return (
        <Card className="glass-card p-4">
            <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold">Forecast: {forecast.month} {forecast.year}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold">{forecast.predictedCaseVolume}</p>
                    <p className="text-xs text-muted-foreground">Expected Cases</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">
                        ₹{(forecast.predictedRevenue / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-muted-foreground">Projected Revenue</p>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <Progress value={forecast.confidence} className="flex-1 h-2" />
                <span className="text-xs text-muted-foreground">
                    {forecast.confidence.toFixed(0)}% confidence
                </span>
            </div>

            {forecast.factors.length > 0 && (
                <div className="space-y-2 mb-4">
                    <p className="text-xs font-medium text-muted-foreground">Factors:</p>
                    {forecast.factors.map((factor, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                            <Activity className="w-3 h-3 text-primary" />
                            <span>{factor}</span>
                        </div>
                    ))}
                </div>
            )}

            {forecast.suggestions.length > 0 && (
                <div className="pt-4 border-t space-y-2">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        Suggestions:
                    </p>
                    {forecast.suggestions.map((suggestion, i) => (
                        <div key={i} className="text-sm p-2 bg-primary/5 rounded">
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}

// =============================================================================
// SOURCE BREAKDOWN CHART
// =============================================================================

interface SourceBreakdownProps {
    sources: SourceAnalysis[];
}

export function SourceBreakdown({ sources }: SourceBreakdownProps) {
    const total = sources.reduce((sum, s) => sum + s.revenue, 0);
    const colors = {
        SEO: 'bg-blue-500',
        GOOGLE_ADS: 'bg-green-500',
        REFERRAL: 'bg-purple-500',
        REPEAT: 'bg-amber-500',
        WALK_IN: 'bg-pink-500',
        SOCIAL: 'bg-cyan-500',
        OTHER: 'bg-gray-500'
    };

    return (
        <Card className="glass-card p-4">
            <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Patient Sources</h3>
            </div>

            {/* Stacked Bar */}
            <div className="h-4 rounded-full overflow-hidden flex mb-4">
                {sources.map((source) => (
                    <div
                        key={source.source}
                        className={colors[source.source]}
                        style={{ width: `${(source.revenue / total) * 100}%` }}
                        title={`${source.source}: ₹${source.revenue.toLocaleString('en-IN')}`}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="space-y-2">
                {sources.map((source) => (
                    <div key={source.source} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${colors[source.source]}`} />
                            <span className="text-sm">{source.source.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">{source.patientCount} pts</span>
                            <span className="font-medium">
                                ₹{source.revenue.toLocaleString('en-IN')}
                            </span>
                            {source.roi !== undefined && (
                                <Badge variant={source.roi > 0 ? 'default' : 'destructive'}>
                                    {source.roi > 0 ? '+' : ''}{source.roi.toFixed(0)}% ROI
                                </Badge>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

// =============================================================================
// SMART OFFER SUGGESTION CARD
// =============================================================================

interface OfferSuggestionProps {
    suggestion: {
        title: string;
        description: string;
        discountType: 'percentage' | 'flat';
        discountValue: number;
        targetProcedures: string[];
        suggestedDays: string[];
        reason: string;
    };
    onAccept?: () => void;
    onDismiss?: () => void;
}

export function OfferSuggestionCard({ suggestion, onAccept, onDismiss }: OfferSuggestionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Card className="glass-card-heavy p-4 border-2 border-primary/20">
                <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-primary font-medium">NEO Suggestion</p>
                        <h3 className="font-semibold">{suggestion.title}</h3>
                    </div>
                </div>

                <p className="text-sm mb-4">{suggestion.description}</p>

                <div className="p-3 bg-muted/50 rounded-lg mb-4">
                    <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={onDismiss}
                    >
                        Dismiss
                    </Button>
                    <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                            hapticPatterns.successPulse();
                            onAccept?.();
                        }}
                    >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Create Offer
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}
