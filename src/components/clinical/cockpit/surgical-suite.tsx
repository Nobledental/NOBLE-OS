'use client';

/**
 * Surgical Suite
 * 
 * The execution center for surgical procedures:
 * - WARS Assessment (for impacted teeth only)
 * - PAE Checklist (for procedures requiring anesthesia)
 * - Anesthesia Log (drug, concentration, block type)
 * 
 * Integrates:
 * - ANESTHESIA_BLOCKS from cockpit-store
 * - WarsScore, PaeChecklist types
 * - Auto-triggers showWARS/showPAE flags
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Activity, Syringe, ClipboardCheck,
    AlertTriangle, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    useCockpitStore,
    ANESTHESIA_BLOCKS,
    type WarsScore,
    type PaeChecklist,
    type AnesthesiaLog,
} from '@/lib/clinical-cockpit-store';

// ============================================================================
// WARS ASSESSMENT
// ============================================================================

function WarsAssessment() {
    const setWarsScore = useCockpitStore(s => s.setWarsScore);
    const warsScore = useCockpitStore(s => s.warsScore);
    const [form, setForm] = useState<Partial<WarsScore>>({
        wintersClass: 'MESIOANGULAR',
        pellGregoryClass: 'II',
        pellGregoryPosition: 'B',
        ramusRelation: 'Normal',
        angulation: 45,
    });

    const calcDifficulty = useCallback((): 'EASY' | 'MODERATE' | 'DIFFICULT' => {
        let score = 0;
        if (form.wintersClass === 'HORIZONTAL' || form.wintersClass === 'INVERTED') score += 3;
        else if (form.wintersClass === 'DISTOANGULAR') score += 2;
        else if (form.wintersClass === 'MESIOANGULAR') score += 1;
        if (form.pellGregoryClass === 'III') score += 3;
        else if (form.pellGregoryClass === 'II') score += 2;
        if (form.pellGregoryPosition === 'C') score += 3;
        else if (form.pellGregoryPosition === 'B') score += 2;
        if (score >= 7) return 'DIFFICULT';
        if (score >= 4) return 'MODERATE';
        return 'EASY';
    }, [form]);

    const handleSave = useCallback(() => {
        const difficulty = calcDifficulty();
        setWarsScore({ ...form, difficultyGrade: difficulty } as WarsScore);
    }, [form, calcDifficulty, setWarsScore]);

    return (
        <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30 p-4">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" /> WARS Assessment (Impacted Tooth)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Winter's Classification */}
                <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Winter&apos;s Classification</label>
                    <select
                        value={form.wintersClass}
                        onChange={e => setForm(p => ({ ...p, wintersClass: e.target.value as WarsScore['wintersClass'] }))}
                        className="w-full text-xs rounded-lg border border-amber-200 bg-white dark:bg-slate-800 px-3 py-2"
                    >
                        <option value="VERTICAL">Vertical</option>
                        <option value="MESIOANGULAR">Mesioangular</option>
                        <option value="DISTOANGULAR">Distoangular</option>
                        <option value="HORIZONTAL">Horizontal</option>
                        <option value="INVERTED">Inverted</option>
                        <option value="TRANSVERSE">Transverse</option>
                    </select>
                </div>

                {/* Pell & Gregory Class */}
                <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Pell & Gregory Class</label>
                    <div className="flex gap-2">
                        {(['I', 'II', 'III'] as const).map(c => (
                            <button
                                key={c}
                                onClick={() => setForm(p => ({ ...p, pellGregoryClass: c }))}
                                className={cn(
                                    'flex-1 py-2 rounded-lg border text-xs font-bold transition-all',
                                    form.pellGregoryClass === c
                                        ? 'bg-amber-500 text-white border-amber-600'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300'
                                )}
                            >
                                Class {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pell & Gregory Position */}
                <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Pell & Gregory Position</label>
                    <div className="flex gap-2">
                        {(['A', 'B', 'C'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setForm(prev => ({ ...prev, pellGregoryPosition: p }))}
                                className={cn(
                                    'flex-1 py-2 rounded-lg border text-xs font-bold transition-all',
                                    form.pellGregoryPosition === p
                                        ? 'bg-amber-500 text-white border-amber-600'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300'
                                )}
                            >
                                Position {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Angulation */}
                <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                        Angulation: {form.angulation}°
                    </label>
                    <input
                        type="range"
                        min={0}
                        max={180}
                        value={form.angulation}
                        onChange={e => setForm(p => ({ ...p, angulation: Number(e.target.value) }))}
                        className="w-full accent-amber-500"
                    />
                </div>
            </div>

            {/* Difficulty Grade */}
            <div className="flex items-center justify-between mt-4 p-3 bg-white/60 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">Calculated Difficulty:</span>
                    <Badge className={cn(
                        'text-xs font-bold',
                        calcDifficulty() === 'EASY' ? 'bg-emerald-100 text-emerald-700' :
                            calcDifficulty() === 'MODERATE' ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                    )}>
                        {calcDifficulty()}
                    </Badge>
                </div>
                <Button size="sm" onClick={handleSave} className="text-xs bg-amber-600 hover:bg-amber-700 text-white">
                    {warsScore ? <><CheckCircle2 className="w-3 h-3 mr-1" /> Updated</> : 'Save WARS'}
                </Button>
            </div>
        </div>
    );
}

// ============================================================================
// PAE CHECKLIST
// ============================================================================

function PaeChecklistForm() {
    const setPaeChecklist = useCockpitStore(s => s.setPaeChecklist);
    const paeChecklist = useCockpitStore(s => s.paeChecklist);
    const [form, setForm] = useState<Partial<PaeChecklist>>({
        asaClass: 'I',
        mallampatiScore: 1,
        fitnessStatus: 'FIT',
        allergiesConfirmed: false,
        bloodWorkDone: false,
    });

    const handleSave = useCallback(() => {
        setPaeChecklist(form as PaeChecklist);
    }, [form, setPaeChecklist]);

    return (
        <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200/50 dark:border-red-800/30 p-4">
            <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Pre-Anesthetic Evaluation (PAE)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* ASA Class */}
                <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">ASA Classification</label>
                    <div className="flex gap-1">
                        {(['I', 'II', 'III', 'IV', 'V'] as const).map(c => (
                            <button
                                key={c}
                                onClick={() => setForm(p => ({ ...p, asaClass: c }))}
                                className={cn(
                                    'flex-1 py-2 rounded-lg border text-xs font-bold transition-all',
                                    form.asaClass === c
                                        ? 'bg-red-500 text-white border-red-600'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-red-300'
                                )}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mallampati Score */}
                <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Mallampati Score</label>
                    <div className="flex gap-2">
                        {([1, 2, 3, 4] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => setForm(p => ({ ...p, mallampatiScore: s }))}
                                className={cn(
                                    'flex-1 py-2 rounded-lg border text-xs font-bold transition-all',
                                    form.mallampatiScore === s
                                        ? 'bg-red-500 text-white border-red-600'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-red-300'
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Fitness Status */}
                <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Fitness Status</label>
                    <div className="flex gap-2">
                        {(['FIT', 'CONDITIONAL', 'UNFIT'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => setForm(p => ({ ...p, fitnessStatus: s }))}
                                className={cn(
                                    'flex-1 py-2 rounded-lg border text-[10px] font-bold transition-all',
                                    form.fitnessStatus === s
                                        ? s === 'FIT' ? 'bg-emerald-500 text-white border-emerald-600'
                                            : s === 'CONDITIONAL' ? 'bg-amber-500 text-white border-amber-600'
                                                : 'bg-red-500 text-white border-red-600'
                                        : 'bg-white text-slate-600 border-slate-200'
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Checkboxes */}
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <input
                        type="checkbox"
                        checked={form.allergiesConfirmed}
                        onChange={e => setForm(p => ({ ...p, allergiesConfirmed: e.target.checked }))}
                        className="rounded border-red-300"
                    />
                    Allergies Verified
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <input
                        type="checkbox"
                        checked={form.bloodWorkDone}
                        onChange={e => setForm(p => ({ ...p, bloodWorkDone: e.target.checked }))}
                        className="rounded border-red-300"
                    />
                    Blood Work Done
                </label>
            </div>

            <div className="flex justify-end mt-3">
                <Button size="sm" onClick={handleSave} className="text-xs bg-red-600 hover:bg-red-700 text-white">
                    {paeChecklist ? <><CheckCircle2 className="w-3 h-3 mr-1" /> Updated</> : 'Save PAE'}
                </Button>
            </div>
        </div>
    );
}

// ============================================================================
// ANESTHESIA LOG
// ============================================================================

function AnesthesiaLogForm() {
    const setAnesthesiaLog = useCockpitStore(s => s.setAnesthesiaLog);
    const anesthesiaLog = useCockpitStore(s => s.anesthesiaLog);
    const [form, setForm] = useState<Partial<AnesthesiaLog>>({
        drugType: 'LIGNOCAINE_WITH_ADRENALINE',
        concentration: '2%',
        adrenalineRatio: '1:80000',
        dosage: '1.8ml',
        blockType: 'IANB',
    });

    const handleSave = useCallback(() => {
        setAnesthesiaLog(form as AnesthesiaLog);
    }, [form, setAnesthesiaLog]);

    return (
        <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200/50 dark:border-indigo-800/30 p-4">
            <h4 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 mb-4 flex items-center gap-2">
                <Syringe className="w-4 h-4" /> Anesthesia Log
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Drug Type */}
                <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Drug</label>
                    <select
                        value={form.drugType}
                        onChange={e => setForm(p => ({ ...p, drugType: e.target.value as AnesthesiaLog['drugType'] }))}
                        className="w-full text-xs rounded-lg border border-indigo-200 bg-white dark:bg-slate-800 px-3 py-2"
                    >
                        <option value="LIGNOCAINE_WITH_ADRENALINE">Lignocaine with Adrenaline</option>
                        <option value="LIGNOCAINE_WITHOUT_ADRENALINE">Lignocaine without Adrenaline</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                {/* Concentration */}
                <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Concentration</label>
                    <div className="flex gap-2">
                        {['2%', '4%'].map(c => (
                            <button
                                key={c}
                                onClick={() => setForm(p => ({ ...p, concentration: c }))}
                                className={cn(
                                    'flex-1 py-2 rounded-lg border text-xs font-bold transition-all',
                                    form.concentration === c
                                        ? 'bg-indigo-500 text-white border-indigo-600'
                                        : 'bg-white text-slate-600 border-slate-200'
                                )}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Adrenaline Ratio */}
                {form.drugType === 'LIGNOCAINE_WITH_ADRENALINE' && (
                    <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Adrenaline Ratio</label>
                        <div className="flex gap-2">
                            {['1:80000', '1:200000'].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setForm(p => ({ ...p, adrenalineRatio: r }))}
                                    className={cn(
                                        'flex-1 py-2 rounded-lg border text-[10px] font-bold transition-all',
                                        form.adrenalineRatio === r
                                            ? 'bg-indigo-500 text-white border-indigo-600'
                                            : 'bg-white text-slate-600 border-slate-200'
                                    )}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dosage */}
                <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Dosage</label>
                    <select
                        value={form.dosage}
                        onChange={e => setForm(p => ({ ...p, dosage: e.target.value }))}
                        className="w-full text-xs rounded-lg border border-indigo-200 bg-white dark:bg-slate-800 px-3 py-2"
                    >
                        {['0.9ml', '1.8ml', '2.7ml', '3.6ml', '4.5ml', '5.4ml'].map(d => (
                            <option key={d} value={d}>{d} ({(parseFloat(d) / 1.8).toFixed(1)} cartridges)</option>
                        ))}
                    </select>
                </div>

                {/* Block Type */}
                <div className="md:col-span-2">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Block Type</label>
                    <div className="flex flex-wrap gap-1.5">
                        {ANESTHESIA_BLOCKS.map(block => (
                            <button
                                key={block.id}
                                onClick={() => setForm(p => ({ ...p, blockType: block.id }))}
                                className={cn(
                                    'px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all',
                                    form.blockType === block.id
                                        ? 'bg-indigo-500 text-white border-indigo-600'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                                )}
                                title={block.region}
                            >
                                {block.id}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-3">
                <Button size="sm" onClick={handleSave} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
                    {anesthesiaLog ? <><CheckCircle2 className="w-3 h-3 mr-1" /> Updated</> : 'Save Anesthesia Log'}
                </Button>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export function SurgicalSuite() {
    const showWARS = useCockpitStore(s => s.showWARS);
    const showPAE = useCockpitStore(s => s.showPAE);
    const procedures = useCockpitStore(s => s.procedures);
    const managementType = useCockpitStore(s => s.managementType);

    if (procedures.length === 0) {
        return (
            <div className="text-center py-10 text-sm text-slate-400">
                <ClipboardCheck className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                No procedures planned yet. Go back to Treatment Plan to select procedures.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* WARS Assessment — Only for impacted */}
            {showWARS && <WarsAssessment />}

            {/* PAE — For surgical procedures */}
            {showPAE && <PaeChecklistForm />}

            {/* Anesthesia Log */}
            {managementType === 'SURGICAL' && <AnesthesiaLogForm />}
        </div>
    );
}
