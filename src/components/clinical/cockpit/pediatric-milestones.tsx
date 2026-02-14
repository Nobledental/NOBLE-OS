'use client';

/**
 * Pediatric Milestones Module
 * 
 * Visual tracker for dental development (Eruption Charts) and pediatric habits.
 * - Primary Dentition (A-T)
 * - Permanent Dentition (1-32)
 * - Habit Breaking (Thumb sucking, Tongue thrusting, etc.)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Baby, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCockpitStore } from '@/lib/clinical-cockpit-store';

// ============================================================================
// DATA: TEETH & ERUPTION TIMES
// ============================================================================

const PRIMARY_TEETH = [
    { id: 'A', label: 'A', name: 'Max Right 2nd Molar', eruption: '25-33 mo' },
    { id: 'B', label: 'B', name: 'Max Right 1st Molar', eruption: '13-19 mo' },
    { id: 'C', label: 'C', name: 'Max Right Canine', eruption: '16-22 mo' },
    { id: 'D', label: 'D', name: 'Max Right Lateral', eruption: '9-13 mo' },
    { id: 'E', label: 'E', name: 'Max Right Central', eruption: '8-12 mo' },
    { id: 'F', label: 'F', name: 'Max Left Central', eruption: '8-12 mo' },
    { id: 'G', label: 'G', name: 'Max Left Lateral', eruption: '9-13 mo' },
    { id: 'H', label: 'H', name: 'Max Left Canine', eruption: '16-22 mo' },
    { id: 'I', label: 'I', name: 'Max Left 1st Molar', eruption: '13-19 mo' },
    { id: 'J', label: 'J', name: 'Max Left 2nd Molar', eruption: '25-33 mo' },
    // Mandibular
    { id: 'T', label: 'T', name: 'Mand Right 2nd Molar', eruption: '23-31 mo' },
    { id: 'S', label: 'S', name: 'Mand Right 1st Molar', eruption: '14-18 mo' },
    { id: 'R', label: 'R', name: 'Mand Right Canine', eruption: '17-23 mo' },
    { id: 'Q', label: 'Q', name: 'Mand Right Lateral', eruption: '10-16 mo' },
    { id: 'P', label: 'P', name: 'Mand Right Central', eruption: '6-10 mo' },
    { id: 'O', label: 'O', name: 'Mand Left Central', eruption: '6-10 mo' },
    { id: 'N', label: 'N', name: 'Mand Left Lateral', eruption: '10-16 mo' },
    { id: 'M', label: 'M', name: 'Mand Left Canine', eruption: '17-23 mo' },
    { id: 'L', label: 'L', name: 'Mand Left 1st Molar', eruption: '14-18 mo' },
    { id: 'K', label: 'K', name: 'Mand Left 2nd Molar', eruption: '23-31 mo' },
];

const HABITS = [
    { id: 'THUMB_SUCKING', label: 'Thumb Sucking' },
    { id: 'TONGUE_THRUSTING', label: 'Tongue Thrusting' },
    { id: 'MOUTH_BREATHING', label: 'Mouth Breathing' },
    { id: 'LIP_BITING', label: 'Lip Biting' },
    { id: 'BRUXISM', label: 'Bruxism (Grinding)' },
    { id: 'NAIL_BITING', label: 'Nail Biting' },
];

// ============================================================================
// COMPONENTS
// ============================================================================

export function PediatricMilestones() {
    const milestones = useCockpitStore(s => s.milestones);
    const setMilestone = useCockpitStore(s => s.setMilestone);
    const toggleHabit = useCockpitStore(s => s.toggleHabit);
    const patient = useCockpitStore(s => s.patient);

    const getStatus = (dentition: 'primary' | 'permanent', id: string) =>
        milestones[dentition]?.[id] || 'unerupted';

    const handleToothClick = (dentition: 'primary' | 'permanent', id: string) => {
        const current = getStatus(dentition, id);
        const next = current === 'unerupted' ? 'erupted' : current === 'erupted' ? 'missing' : 'unerupted';
        setMilestone(dentition, id, next);
    };

    const StatusIcon = ({ status }: { status: string }) => {
        if (status === 'erupted') return <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
        if (status === 'missing') return <XCircle className="w-3 h-3 text-red-500" />;
        return <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />;
    };

    if (!patient || patient.age >= 18) return null; // Only for kids/teens

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Baby className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pediatric Milestones</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Eruption Chart & Habit Tracker</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Eruption Chart (Takes 2 cols) */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <Tabs defaultValue="primary" className="p-1">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                            <TabsList className="bg-slate-100 dark:bg-slate-800 h-8">
                                <TabsTrigger value="primary" className="text-xs h-6 px-3">Primary (Baby)</TabsTrigger>
                                <TabsTrigger value="permanent" className="text-xs h-6 px-3">Permanent</TabsTrigger>
                            </TabsList>
                            <div className="flex gap-3 text-[10px] text-slate-500">
                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Erupted</span>
                                <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> Missing/Lost</span>
                            </div>
                        </div>

                        <TabsContent value="primary" className="p-4 mt-0">
                            <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                                {/* Maxillary */}
                                {PRIMARY_TEETH.slice(0, 10).map(t => (
                                    <ToothButton
                                        key={t.id}
                                        tooth={t}
                                        status={getStatus('primary', t.id)}
                                        onClick={() => handleToothClick('primary', t.id)}
                                    />
                                ))}
                                {/* Mandibular */}
                                {PRIMARY_TEETH.slice(10, 20).reverse().map(t => (
                                    <ToothButton
                                        key={t.id}
                                        tooth={t}
                                        status={getStatus('primary', t.id)}
                                        onClick={() => handleToothClick('primary', t.id)}
                                        isLower
                                    />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="permanent" className="p-4 mt-0">
                            <div className="text-center py-8 text-slate-400 text-xs">
                                Permanent dentition chart simplified for demo.
                                <br /> Use standard chart in Examination phase for full charting.
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Habit Tracker (Takes 1 col) */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <AlertCircle className="w-3 h-3" /> Habits
                    </h4>
                    <div className="space-y-2">
                        {HABITS.map(h => {
                            const active = milestones.habits.includes(h.id);
                            return (
                                <button
                                    key={h.id}
                                    onClick={() => toggleHabit(h.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                                        active
                                            ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                                            : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                                    )}
                                >
                                    {h.label}
                                    {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToothButton({ tooth, status, onClick, isLower }: any) {
    const isErupted = status === 'erupted';
    const isMissing = status === 'missing';

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={cn(
                "relative group flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all h-16 w-full",
                isErupted ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : isMissing ? "bg-red-50 border-red-200 text-red-700 opacity-60"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
            )}
        >
            <span className="font-bold text-sm">{tooth.id}</span>
            <span className="text-[9px] opacity-70 mt-1">{isErupted ? 'Erupted' : isMissing ? 'Lost' : tooth.eruption}</span>

            {/* Status Indicator Dot */}
            <div className={cn(
                "absolute top-1 right-1 w-1.5 h-1.5 rounded-full",
                isErupted ? "bg-emerald-500" : isMissing ? "bg-red-500" : "bg-slate-200"
            )} />
        </motion.button>
    );
}
