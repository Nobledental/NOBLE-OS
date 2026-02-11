'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ChevronUp,
    ChevronDown,
    Activity,
    Users,
    FileCheck,
    Star,
    Trophy,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
export interface PerformanceScore {
    totalPoints: number;
    rank: number;
    weekOverWeek: number;
    percentageScore: number;
    breakdown: {
        recordSharing: number;
        patientSatisfaction: number;
        treatmentSuccess: number;
        dataCompleteness: number;
    };
    recentEvents: PointEvent[];
}

export interface PointEvent {
    id: string;
    type: 'gain' | 'loss';
    amount: number;
    reason: string;
    timestamp: string;
    category: 'sharing' | 'satisfaction' | 'clinical' | 'admin';
}

const mockScore: PerformanceScore = {
    totalPoints: 850,
    rank: 42,
    weekOverWeek: 12,
    percentageScore: 85,
    breakdown: {
        recordSharing: 92,
        patientSatisfaction: 88,
        treatmentSuccess: 76,
        dataCompleteness: 95
    },
    recentEvents: [
        { id: '1', type: 'gain', amount: 50, reason: 'Perfect record sharing streak (7 days)', timestamp: '2h ago', category: 'sharing' },
        { id: '2', type: 'gain', amount: 20, reason: '5-star patient review', timestamp: '5h ago', category: 'satisfaction' },
        { id: '3', type: 'loss', amount: 10, reason: 'Incomplete surgical notes', timestamp: '1d ago', category: 'admin' },
        { id: '4', type: 'gain', amount: 30, reason: 'Successful complex implant case', timestamp: '2d ago', category: 'clinical' }
    ]
};

// --- Components ---

export function PerformanceCard({ score = mockScore }: { score?: PerformanceScore }) {
    const scoreColor = score.percentageScore >= 90 ? 'text-emerald-500' :
        score.percentageScore >= 70 ? 'text-amber-500' : 'text-red-500';

    return (
        <Card className="p-6 relative overflow-hidden bg-white border-slate-200 shadow-xl">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        Clinic Performance
                    </h3>
                    <p className="text-sm text-slate-500">Weekly Trust Score Analysis</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Global Rank</span>
                    <span className="text-2xl font-black text-slate-900">#{score.rank}</span>
                    <span className={`text-xs font-bold flex items-center ${score.weekOverWeek >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {score.weekOverOver >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {Math.abs(score.weekOverWeek)} positions
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-8 mb-8">
                {/* Circular Progress */}
                <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-slate-100"
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
                        <span className="text-3xl font-black text-slate-900">{score.totalPoints}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase">Points</span>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                    <CategoryProgress
                        icon={Users}
                        label="Record Sharing"
                        value={score.breakdown.recordSharing}
                        color="bg-blue-500"
                    />
                    <CategoryProgress
                        icon={Star}
                        label="Patient Satisfaction"
                        value={score.breakdown.patientSatisfaction}
                        color="bg-amber-500"
                    />
                    <CategoryProgress
                        icon={Activity}
                        label="Treatment Success"
                        value={score.breakdown.treatmentSuccess}
                        color="bg-emerald-500"
                    />
                    <CategoryProgress
                        icon={FileCheck}
                        label="Data Completeness"
                        value={score.breakdown.dataCompleteness}
                        color="bg-purple-500"
                    />
                </div>
            </div>
        </Card>
    );
}

function CategoryProgress({ icon: Icon, label, value, color }: any) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                </div>
                <span className="font-bold text-slate-900">{value}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    className={`h-full ${color}`}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}


export function PointEventList({ events = mockScore.recentEvents }: { events?: PointEvent[] }) {
    return (
        <Card className="p-6 bg-white border-slate-200 shadow-xl h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Recent Activity
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {events.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                        <div className={`p-2 rounded-lg shrink-0 ${event.type === 'gain' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                            {event.type === 'gain' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{event.reason}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${event.type === 'gain' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {event.type === 'gain' ? '+' : '-'}{event.amount} pts
                                </span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wide">{event.timestamp}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export function FeaturedBadge() {
    return (
        <div className="bg-gradient-to-r from-amber-200 to-yellow-400 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="relative z-10 text-amber-900">
                <div className="flex items-center gap-2 mb-2 font-black uppercase tracking-widest text-xs opacity-70">
                    <Star size={12} fill="currentColor" /> Top Performer
                </div>
                <h3 className="text-2xl font-black mb-1">Gold Tier Status</h3>
                <p className="text-sm font-medium opacity-80 mb-4">You're in the top 5% of clinics this week!</p>
                <Button size="sm" className="bg-white text-amber-900 hover:bg-amber-50 border-none font-bold shadow-sm">
                    View Benefits
                </Button>
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

                export function PointEventList({events, type}: PointEventListProps) {
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

                export function ExportButton({onExport, isLoading}: ExportButtonProps) {
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

                export function ImportRequestCard({onRequestImport}: ImportRequestCardProps) {
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

                export function FeaturedBadge({badge, weekNumber}: FeaturedBadgeProps) {
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
