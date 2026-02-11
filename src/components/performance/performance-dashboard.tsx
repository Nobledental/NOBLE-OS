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
    Upload,
    Clock,
    FileText,
    CheckCircle,
    AlertTriangle
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

// --- Main Dashboard Component ---

export default function PerformanceDashboard() {
    return (
        <div className="space-y-6 p-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900">Performance Command</h2>
                    <p className="text-sm text-slate-500">Weekly Trust Score & Clinical Rankings</p>
                </div>
                <div className="flex gap-2">
                    <ExportButton onExport={(fmt) => console.log('Exporting', fmt)} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Score Card & Featured Status */}
                <div className="lg:col-span-2 space-y-6">
                    <PerformanceCard score={mockScore} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FeaturedBadge />
                        <ImportRequestCard onRequestImport={() => console.log('Import requested')} />
                    </div>
                </div>

                {/* Right Column: Recent Activity Log */}
                <div className="lg:col-span-1">
                    <PointEventList events={mockScore.recentEvents} />
                </div>
            </div>
        </div>
    );
}

// --- Sub Components ---

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
                        {score.weekOverWeek >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {Math.abs(score.weekOverWeek)} positions
                    </span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
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
                <div className="flex-1 w-full grid grid-cols-2 gap-4">
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
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {events.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                        <div className={`p-2 rounded-lg shrink-0 ${event.type === 'gain' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                            {event.type === 'gain' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{event.reason}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${event.type === 'gain' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {event.type === 'gain' ? '+' : ''}{event.amount} pts
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
        <div className="bg-gradient-to-r from-amber-200 to-yellow-400 p-6 rounded-2xl shadow-lg relative overflow-hidden group h-full">
            <div className="relative z-10 text-amber-900">
                <div className="flex items-center gap-2 mb-2 font-black uppercase tracking-widest text-xs opacity-70">
                    <Star size={12} fill="currentColor" /> Top Performer
                </div>
                <h3 className="text-2xl font-black mb-1">Gold Tier Status</h3>
                <p className="text-sm font-medium opacity-80 mb-4">You&apos;re in the top 5% of clinics this week!</p>
                <Button size="sm" className="bg-white text-amber-900 hover:bg-amber-50 border-none font-bold shadow-sm">
                    View Benefits
                </Button>
            </div>
            {/* Decorative background element */}
            <div className="absolute -bottom-4 -right-4 text-amber-500 opacity-20 transform rotate-12 scale-150">
                <Trophy size={100} />
            </div>
        </div>
    );
}

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
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className="bg-white"
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
                        className="absolute top-full right-0 mt-2 w-48 bg-white p-2 z-50 rounded-xl shadow-xl border border-slate-200"
                    >
                        <button
                            onClick={() => {
                                onExport('json');
                                setIsOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 rounded-lg flex items-center gap-2 text-slate-700 font-medium"
                        >
                            <FileText className="w-4 h-4 text-slate-400" />
                            JSON Format
                        </button>
                        <button
                            onClick={() => {
                                onExport('pdf');
                                setIsOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 rounded-lg flex items-center gap-2 text-slate-700 font-medium"
                        >
                            <FileText className="w-4 h-4 text-slate-400" />
                            PDF Summary
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface ImportRequestCardProps {
    onRequestImport: () => void;
}

export function ImportRequestCard({ onRequestImport }: ImportRequestCardProps) {
    return (
        <Card className="bg-white p-6 shadow-xl border-slate-200 h-full">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Upload className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-900">Legacy Data Import</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-3">
                        Migrate data from paper records? Request an import.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRequestImport}
                        className="w-full"
                    >
                        Request Import
                    </Button>
                </div>
            </div>
        </Card>
    );
}
