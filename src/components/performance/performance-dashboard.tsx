'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Star, TrendingUp, TrendingDown, Award,
    AlertTriangle, CheckCircle, Clock, FileText,
    Download, Upload, Sparkles
} from 'lucide-react';
import {
    WeeklyPerformanceScore,
    POINT_VALUES,
    weeklyPerformanceService
} from '@/lib/performance-ranking';
import { hapticPatterns } from '@/components/gestures/ios-gestures';

// =============================================================================
// PERFORMANCE DASHBOARD CARD
// =============================================================================

interface PerformanceCardProps {
    score: WeeklyPerformanceScore;
    onViewDetails?: () => void;
}

export function PerformanceCard({ score, onViewDetails }: PerformanceCardProps) {
    const getRankBadge = () => {
        if (score.rank === 1) return { icon: '🥇', label: 'Gold', class: 'bg-amber-100 text-amber-800' };
        if (score.rank <= 3) return { icon: '🥈', label: 'Silver', class: 'bg-gray-100 text-gray-800' };
        if (score.rank <= 10) return { icon: '🥉', label: 'Top 10', class: 'bg-orange-100 text-orange-800' };
        return null;
    };

    const rankBadge = getRankBadge();
    const scoreColor = score.percentageScore >= 90 ? 'text-green-500' :
        score.percentageScore >= 70 ? 'text-amber-500' : 'text-red-500';

    return (
        <Card className="glass-card p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    <h3 className="font-semibold">Weekly Performance</h3>
                </div>
                {score.isFeatured && (
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                    </Badge>
                )}
            </div>

            {/* Score Circle */}
            <div className="flex items-center justify-center py-4">
                <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-muted"
                        />
                        <motion.circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            className={scoreColor}
                            initial={{ strokeDasharray: '0 352' }}
                            animate={{
                                strokeDasharray: `${(score.percentageScore / 100) * 352} 352`
                            }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold ${scoreColor}`}>
                            {score.percentageScore.toFixed(0)}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Week {score.weekNumber}
                        </span>
                    </div>
                </div>
            </div>

            {/* Rank */}
            <div className="flex items-center justify-center gap-3">
                <span className="text-lg font-medium">Rank #{score.rank}</span>
                {score.rankChange !== undefined && score.rankChange !== 0 && (
                    <Badge variant={score.rankChange > 0 ? 'default' : 'destructive'}>
                        {score.rankChange > 0 ? (
                            <><TrendingUp className="w-3 h-3 mr-1" />+{score.rankChange}</>
                        ) : (
                            <><TrendingDown className="w-3 h-3 mr-1" />{score.rankChange}</>
                        )}
                    </Badge>
                )}
                {rankBadge && (
                    <Badge className={rankBadge.class}>
                        {rankBadge.icon} {rankBadge.label}
                    </Badge>
                )}
            </div>

            {/* Category Breakdown */}
            <div className="space-y-2 pt-2">
                {Object.entries(score.scores).map(([key, value]) => {
                    const labels: Record<string, string> = {
                        recordSharing: 'Record Sharing',
                        clinicalCompletion: 'Clinical Completion',
                        patientSatisfaction: 'Patient Satisfaction',
                        responseTime: 'Response Time',
                        noShowRate: 'No-Show Rate'
                    };

                    return (
                        <div key={key} className="flex items-center gap-2">
                            <span className="text-xs w-28 text-muted-foreground">
                                {labels[key]}
                            </span>
                            <Progress value={value} className="flex-1 h-2" />
                            <span className="text-xs w-8 text-right">{value}%</span>
                        </div>
                    );
                })}
            </div>

            {/* Points Summary */}
            <div className="flex justify-between pt-2 text-sm">
                <span className="text-green-600">
                    +{score.pointGains.reduce((s, e) => s + e.points, 0)} earned
                </span>
                <span className="text-red-600">
                    {score.pointLosses.reduce((s, e) => s + e.points, 0)} lost
                </span>
            </div>

            {onViewDetails && (
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                        hapticPatterns.softTap();
                        onViewDetails();
                    }}
                >
                    View Details
                </Button>
            )}
        </Card>
    );
}

// =============================================================================
// POINT EVENT LIST
// =============================================================================

interface PointEventListProps {
    events: Array<{
        id: string;
        points: number;
        reason: string;
        occurredAt: Date;
        category: string;
    }>;
    type: 'gains' | 'losses';
}

export function PointEventList({ events, type }: PointEventListProps) {
    const sortedEvents = [...events].sort((a, b) =>
        b.occurredAt.getTime() - a.occurredAt.getTime()
    );

    const isGain = type === 'gains';
    const Icon = isGain ? CheckCircle : AlertTriangle;
    const colorClass = isGain ? 'text-green-600' : 'text-red-600';
    const bgClass = isGain ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20';

    return (
        <div className="space-y-2">
            <h4 className={`font-medium ${colorClass}`}>
                {isGain ? 'Point Gains' : 'Point Losses'}
            </h4>
            {sortedEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No events this week</p>
            ) : (
                sortedEvents.map(event => (
                    <div
                        key={event.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${bgClass}`}
                    >
                        <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${colorClass}`} />
                            <div>
                                <p className="text-sm font-medium">{event.reason}</p>
                                <p className="text-xs text-muted-foreground">
                                    {event.occurredAt.toLocaleString('en-IN', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                        <span className={`font-bold ${colorClass}`}>
                            {isGain ? '+' : ''}{event.points}
                        </span>
                    </div>
                ))
            )}
        </div>
    );
}

// =============================================================================
// EXPORT BUTTON
// =============================================================================

interface ExportButtonProps {
    onExport: (format: 'json' | 'pdf' | 'combined') => void;
    isLoading?: boolean;
}

export function ExportButton({ onExport, isLoading }: ExportButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <Button
                variant="outline"
                onClick={() => {
                    hapticPatterns.softTap();
                    setIsOpen(!isOpen);
                }}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <Download className="w-4 h-4 mr-2" />
                )}
                Export Data
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-48 glass-card-heavy p-2 z-50"
                    >
                        <button
                            onClick={() => {
                                onExport('json');
                                setIsOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-muted rounded flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            JSON Format
                        </button>
                        <button
                            onClick={() => {
                                onExport('pdf');
                                setIsOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-muted rounded flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            PDF Summary
                        </button>
                        <button
                            onClick={() => {
                                onExport('combined');
                                setIsOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-muted rounded flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Full Bundle (JSON + PDF)
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// =============================================================================
// IMPORT REQUEST CARD
// =============================================================================

interface ImportRequestCardProps {
    onRequestImport: () => void;
}

export function ImportRequestCard({ onRequestImport }: ImportRequestCardProps) {
    return (
        <Card className="glass-card p-4">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold">Legacy Data Import</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Need to migrate data from paper records or other software?
                        Request a data import from our support team.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => {
                            hapticPatterns.softTap();
                            onRequestImport();
                        }}
                    >
                        Request Import
                    </Button>
                </div>
            </div>
        </Card>
    );
}

// =============================================================================
// FEATURED CLINIC BADGE
// =============================================================================

interface FeaturedBadgeProps {
    badge: 'gold' | 'silver' | 'bronze';
    weekNumber: number;
}

export function FeaturedBadge({ badge, weekNumber }: FeaturedBadgeProps) {
    const badges = {
        gold: {
            icon: '🥇',
            gradient: 'from-amber-400 via-yellow-300 to-amber-500',
            label: 'Gold Featured'
        },
        silver: {
            icon: '🥈',
            gradient: 'from-gray-300 via-gray-100 to-gray-400',
            label: 'Silver Featured'
        },
        bronze: {
            icon: '🥉',
            gradient: 'from-orange-400 via-orange-300 to-orange-500',
            label: 'Featured Clinic'
        }
    };

    const config = badges[badge];

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${config.gradient} text-black shadow-lg`}
        >
            <span className="text-xl">{config.icon}</span>
            <div className="text-sm font-medium">
                <div>{config.label}</div>
                <div className="text-xs opacity-75">Week {weekNumber}</div>
            </div>
        </motion.div>
    );
}
