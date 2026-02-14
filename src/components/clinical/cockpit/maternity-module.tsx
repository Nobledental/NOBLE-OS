'use client';

/**
 * Maternity Module
 * 
 * Specialized clinical module for pregnant patients.
 * - Tracks LMP (Last Menstrual Period)
 * - Auto-calculates EDD (Expected Due Date) & Gestational Age
 * - Displays Trimester-specific dental risk warnings
 * - Updates Cockpit Store with maternity context
 */

import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Baby, Calendar, AlertTriangle, HeartPulse, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCockpitStore } from '@/lib/clinical-cockpit-store';

// ============================================================================
// LOGIC: DENTAL RISKS PER TRIMESTER
// ============================================================================

const TRIMESTER_GUIDANCE = {
    1: {
        label: '1st Trimester (0-13 weeks)',
        riskLevel: 'HIGH',
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        warnings: [
            '⚠️ ORGANOGENESIS PERIOD: Avoid elective treatment.',
            'Avoid Teratogenic drugs (Tetracycline, etc.).',
            'X-Rays only if absolute emergency (with lead apron).',
            'Symptomatic relief preferred over invasive procedures.',
        ]
    },
    2: {
        label: '2nd Trimester (14-26 weeks)',
        riskLevel: 'SAFE',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
        warnings: [
            '✅ SAFEST PERIOD for necessary dental treatment.',
            'Scale & Polish recommended (Pregnancy Gingivitis risk).',
            'Keep appointments short to avoid patient fatigue.',
            'Safe for LA with Adrenaline (1:200,000).',
        ]
    },
    3: {
        label: '3rd Trimester (27+ weeks)',
        riskLevel: 'MODERATE',
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        icon: <Baby className="w-5 h-5 text-blue-600" />,
        warnings: [
            '⚠️ SUPINE HYPOTENSION RISK: Treat in semi-reclined position.',
            'Short appointments only.',
            'Defer elective procedures until post-delivery.',
            'Monitor BP closely (Preeclampsia risk).',
        ]
    }
};

export function MaternityModule() {
    const maternity = useCockpitStore(s => s.maternity);
    const setMaternity = useCockpitStore(s => s.setMaternity);

    // Calculate dates on LMP change
    useEffect(() => {
        if (maternity.lmpDate) {
            const lmp = new Date(maternity.lmpDate);
            if (isNaN(lmp.getTime())) return;

            // Naegele's Rule: LMP + 280 days
            const edd = new Date(lmp);
            edd.setDate(lmp.getDate() + 280);

            // Gestational Age
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - lmp.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const weeks = Math.floor(diffDays / 7);

            // Determine Trimester
            let trimester: 1 | 2 | 3 = 1;
            if (weeks >= 14 && weeks <= 26) trimester = 2;
            if (weeks >= 27) trimester = 3;

            // Only update if changed prevents infinite loop
            if (maternity.trimester !== trimester) {
                setMaternity({
                    ...maternity,
                    trimester,
                    deliveryDate: edd.toISOString().split('T')[0]
                });
            }
        }
    }, [maternity.lmpDate, maternity.trimester, setMaternity, maternity]);


    const currentTrimester = maternity.trimester ? TRIMESTER_GUIDANCE[maternity.trimester] : null;

    const gestationalWeeks = useMemo(() => {
        if (!maternity.lmpDate) return 0;
        const lmp = new Date(maternity.lmpDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lmp.getTime());
        return Math.floor(diffTime / (1000 * 60 * 60 * 24) / 7);
    }, [maternity.lmpDate]);

    if (!maternity.isApplicable) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-pink-100 dark:border-pink-900/30 overflow-hidden shadow-sm"
        >
            {/* Header */}
            <div className="bg-pink-50/50 dark:bg-pink-950/20 px-4 py-3 border-b border-pink-100 dark:border-pink-900/30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-400">
                    <Baby className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Maternity Context</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Pregnancy Tracking & Dental Safety</p>
                </div>
                <div className="ml-auto">
                    <Badge variant="outline" className="border-pink-200 text-pink-700 bg-pink-50">
                        {maternity.isPregnant ? 'Current Pregnancy' : 'Post-Partum / Nursing'}
                    </Badge>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Input Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Last Menstrual Period (LMP)</Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="date"
                                className="pl-9 h-10 text-sm"
                                value={maternity.lmpDate || ''}
                                onChange={(e) => setMaternity({ lmpDate: e.target.value, isPregnant: true })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Est. Due Date (Auto-calc)</Label>
                        <div className="h-10 px-3 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                            {maternity.deliveryDate ? new Date(maternity.deliveryDate).toLocaleDateString() : '-'}
                        </div>
                    </div>
                </div>

                {/* Status Toggles */}
                <div className="flex gap-4">
                    <Button
                        variant={maternity.isNursing ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMaternity({ isNursing: !maternity.isNursing })}
                        className={cn(
                            "flex-1 gap-2 text-xs",
                            maternity.isNursing ? "bg-purple-600 hover:bg-purple-700" : "text-slate-600"
                        )}
                    >
                        <HeartPulse className="w-4 h-4" />
                        Currently Nursing
                    </Button>
                </div>

                {/* Trimester Risk Banner */}
                {maternity.isPregnant && currentTrimester && (
                    <div className={cn("rounded-xl border p-4 space-y-3", currentTrimester.color)}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {currentTrimester.icon}
                                <span className="font-bold text-sm">{currentTrimester.label}</span>
                            </div>
                            <Badge className="bg-white/50 border-transparent text-current shadow-sm whitespace-nowrap">
                                Week {gestationalWeeks}
                            </Badge>
                        </div>

                        <div className="space-y-1.5 pl-7">
                            {currentTrimester.warnings.map((w, i) => (
                                <p key={i} className="text-xs font-medium flex items-start gap-1.5">
                                    <span className="mt-0.5">•</span> {w}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Nursing Alert */}
                {maternity.isNursing && (
                    <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30 p-3 flex items-start gap-3">
                        <HeartPulse className="w-4 h-4 text-indigo-600 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-indigo-800 dark:text-indigo-300">Nursing Mother</p>
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">
                                Avoid drugs excreted in breast milk. Check prescription safety before dispensing.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
