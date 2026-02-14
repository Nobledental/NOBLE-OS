'use client';

/**
 * Treatment Plan Fork
 * 
 * The decision point where the doctor chooses:
 * - Medical Management → Prescription Engine
 * - Surgical Management → Procedure Selection
 * 
 * Integrates:
 * - suggestProcedures() from cockpit-store (auto-suggests based on diagnosis)
 * - SURGICAL_PROCEDURES definitions
 * - RESTORATION_MATERIALS for restorative cases
 */

import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GitBranch, Pill, Scissors, ChevronRight,
    Plus, CheckCircle2, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    useCockpitStore,
    suggestProcedures,
    SURGICAL_PROCEDURES,
    RESTORATION_MATERIALS,
    type ProcedureEntry,
} from '@/lib/clinical-cockpit-store';

export function TreatmentPlanFork() {
    const managementType = useCockpitStore(s => s.managementType);
    const setManagementType = useCockpitStore(s => s.setManagementType);
    const diagnoses = useCockpitStore(s => s.diagnoses);
    const procedures = useCockpitStore(s => s.procedures);
    const addProcedure = useCockpitStore(s => s.addProcedure);
    const anesthesiaMode = useCockpitStore(s => s.anesthesiaMode);
    const setAnesthesiaMode = useCockpitStore(s => s.setAnesthesiaMode);

    // Auto-suggest procedures based on confirmed/provisional diagnoses
    const suggestedProcs = useMemo(() => {
        if (diagnoses.length === 0) return SURGICAL_PROCEDURES;
        const allSuggested = diagnoses.flatMap(d => suggestProcedures(d.diagnosis));
        // Deduplicate
        const unique = allSuggested.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);
        return unique.length > 0 ? unique : SURGICAL_PROCEDURES;
    }, [diagnoses]);

    const handleAddProcedure = useCallback((procDef: typeof SURGICAL_PROCEDURES[0]) => {
        const proc: ProcedureEntry = {
            id: `proc_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            code: procDef.id,
            name: procDef.label,
            category: procDef.requiresWARS ? 'surgical' : 'restorative',
            toothNumbers: [],
            managementType: managementType,
            anesthesiaMode: procDef.requiresPAE ? (anesthesiaMode || 'LA') : null,
            status: 'PLANNED',
        };
        addProcedure(proc);
    }, [managementType, anesthesiaMode, addProcedure]);

    const isProcAdded = (id: string) => procedures.some(p => p.code === id);

    return (
        <div className="space-y-4">
            {/* Management Type Toggle */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-pink-500" /> Management Type
                </h3>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setManagementType('MEDICAL')}
                        className={cn(
                            'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                            managementType === 'MEDICAL'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-md'
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-blue-300'
                        )}
                    >
                        <Pill className={cn('w-8 h-8', managementType === 'MEDICAL' ? 'text-blue-600' : 'text-slate-400')} />
                        <span className={cn('text-sm font-semibold', managementType === 'MEDICAL' ? 'text-blue-700' : 'text-slate-600')}>
                            Medical
                        </span>
                        <span className="text-[10px] text-slate-500">Medications, Therapy</span>
                    </button>

                    <button
                        onClick={() => setManagementType('SURGICAL')}
                        className={cn(
                            'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                            managementType === 'SURGICAL'
                                ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 shadow-md'
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-rose-300'
                        )}
                    >
                        <Scissors className={cn('w-8 h-8', managementType === 'SURGICAL' ? 'text-rose-600' : 'text-slate-400')} />
                        <span className={cn('text-sm font-semibold', managementType === 'SURGICAL' ? 'text-rose-700' : 'text-slate-600')}>
                            Surgical
                        </span>
                        <span className="text-[10px] text-slate-500">Procedures, Extractions</span>
                    </button>
                </div>
            </div>

            {/* Anesthesia Selection (for surgical) */}
            <AnimatePresence>
                {managementType === 'SURGICAL' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                    >
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Anesthesia Type</h4>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setAnesthesiaMode('LA')}
                                className={cn(
                                    'flex-1 px-4 py-2 rounded-lg border text-xs font-medium transition-all',
                                    anesthesiaMode === 'LA'
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30'
                                        : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                                )}
                            >
                                Local Anesthesia (LA)
                            </button>
                            <button
                                onClick={() => setAnesthesiaMode('GA')}
                                className={cn(
                                    'flex-1 px-4 py-2 rounded-lg border text-xs font-medium transition-all',
                                    anesthesiaMode === 'GA'
                                        ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30'
                                        : 'border-slate-200 text-slate-600 hover:border-red-300'
                                )}
                            >
                                General Anesthesia (GA)
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Procedure Selection */}
            {managementType && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                            {diagnoses.length > 0 ? 'AI-Suggested Procedures' : 'Available Procedures'}
                        </h4>
                        {diagnoses.length > 0 && (
                            <Badge variant="outline" className="text-[9px] text-pink-600 border-pink-200">
                                Based on {diagnoses.length} diagnosis(es)
                            </Badge>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {suggestedProcs.map(proc => (
                            <button
                                key={proc.id}
                                onClick={() => !isProcAdded(proc.id) && handleAddProcedure(proc)}
                                disabled={isProcAdded(proc.id)}
                                className={cn(
                                    'flex items-center justify-between p-3 rounded-lg border text-left transition-all',
                                    isProcAdded(proc.id)
                                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/30'
                                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-pink-300 hover:bg-pink-50/50 cursor-pointer'
                                )}
                            >
                                <div>
                                    <span className="text-xs font-medium text-slate-900 dark:text-white">{proc.label}</span>
                                    <div className="flex gap-1 mt-1">
                                        {proc.requiresWARS && (
                                            <Badge variant="outline" className="text-[8px] text-amber-600 border-amber-200">WARS</Badge>
                                        )}
                                        {proc.requiresPAE && (
                                            <Badge variant="outline" className="text-[8px] text-red-600 border-red-200">PAE</Badge>
                                        )}
                                    </div>
                                </div>
                                {isProcAdded(proc.id) ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    <Plus className="w-4 h-4 text-slate-400" />
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Added Procedures Summary */}
            {procedures.length > 0 && (
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-xl border border-pink-200/50 dark:border-pink-800/30 p-4">
                    <h4 className="text-xs font-semibold text-pink-800 dark:text-pink-300 mb-2">
                        Planned Procedures ({procedures.length})
                    </h4>
                    {procedures.map(p => (
                        <div key={p.id} className="flex items-center justify-between bg-white/60 dark:bg-slate-800/50 rounded-lg px-3 py-2 mb-1">
                            <span className="text-xs text-slate-700 dark:text-slate-300">{p.name}</span>
                            <Badge
                                variant="outline"
                                className={cn('text-[9px]',
                                    p.status === 'COMPLETED' ? 'text-emerald-600 border-emerald-200' :
                                        p.status === 'IN_PROGRESS' ? 'text-amber-600 border-amber-200' :
                                            'text-slate-500 border-slate-200'
                                )}
                            >
                                {p.status}
                            </Badge>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
