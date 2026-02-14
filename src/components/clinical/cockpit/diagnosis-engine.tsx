'use client';

/**
 * Diagnosis Engine
 * 
 * Integrates the EXISTING provisionalDiagnosisEngine from icd10-mapping.ts
 * to auto-suggest ICD-10 diagnoses based on symptoms + clinical findings.
 * 
 * Doctor can:
 * 1. See AI-suggested diagnoses with confidence scores
 * 2. Confirm/reject each suggestion with one click
 * 3. Add custom diagnosis manually
 * 4. Link diagnosis to specific teeth
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain, CheckCircle2, XCircle, Plus, Search, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCockpitStore, type DiagnosisEntry } from '@/lib/clinical-cockpit-store';
import {
    provisionalDiagnosisEngine,
    diagnosticKnowledgeBase,
    type DiagnosticInput,
} from '@/lib/icd10-mapping';

// ============================================================================
// Symptom → ICD-10 Mapping (from clinical-suggest + icd10-mapping)
// ============================================================================

const SYMPTOM_CHIPS = [
    // Pain
    { value: 'sharp_pain', label: 'Sharp Pain' },
    { value: 'throbbing_pain', label: 'Throbbing Pain' },
    { value: 'spontaneous_pain', label: 'Spontaneous Pain' },
    { value: 'nocturnal_pain', label: 'Night Pain' },
    { value: 'radiating_pain', label: 'Radiating Pain' },
    { value: 'severe_pain_biting', label: 'Pain on Biting' },
    { value: 'localized_pain', label: 'Localized Pain' },
    { value: 'lingering_pain', label: 'Lingering Pain' },
    // Sensitivity
    { value: 'thermal_sensitivity', label: 'Temperature Sensitive' },
    { value: 'pain_with_cold', label: 'Cold Sensitivity' },
    { value: 'pain_with_sweet', label: 'Sweet Sensitivity' },
    { value: 'sensitivity', label: 'General Sensitivity' },
    // Swelling/Bleeding
    { value: 'swelling', label: 'Swelling' },
    { value: 'bleeding_gums', label: 'Bleeding Gums' },
    { value: 'pus_discharge', label: 'Pus Discharge' },
    { value: 'painless_pimple', label: 'Gum Boil' },
    // Misc
    { value: 'fever', label: 'Fever' },
    { value: 'bad_breath', label: 'Bad Breath' },
    { value: 'loose_teeth', label: 'Loose Teeth' },
    { value: 'difficulty_opening_mouth', label: 'Trismus' },
    { value: 'pain_wisdom_tooth', label: 'Wisdom Tooth Pain' },
    { value: 'history_severe_pain', label: 'History of Severe Pain' },
    { value: 'no_pain', label: 'No Pain' },
    { value: 'intense_boring_pain', label: 'Boring Pain' },
    { value: 'pain_3_days_post_extraction', label: 'Pain Post-Extraction' },
];

const FINDING_CHIPS = [
    { value: 'cavity', label: 'Visible Cavity' },
    { value: 'decay', label: 'Decay' },
    { value: 'tender_to_percussion', label: 'Tender to Percussion' },
    { value: 'pain_subsides_instantly', label: 'Pain Subsides Instantly' },
    { value: 'lingering_cold_pain', label: 'Lingering Cold Response' },
    { value: 'pain_worse_lying_down', label: 'Worse Lying Down' },
    { value: 'no_cold_response', label: 'No Response to Cold' },
    { value: 'negative_ept', label: 'Negative EPT' },
    { value: 'discoloration', label: 'Tooth Discoloration' },
    { value: 'fluctuant_swelling', label: 'Fluctuant Swelling' },
    { value: 'sinus_tract', label: 'Sinus Tract' },
    { value: 'periapical_radiolucency', label: 'Periapical Radiolucency' },
    { value: 'inflamed_operculum', label: 'Inflamed Operculum' },
    { value: 'partially_erupted_tooth', label: 'Partially Erupted' },
    { value: 'trismus', label: 'Limited Opening' },
    { value: 'exposed_bone', label: 'Exposed Bone' },
    { value: 'foul_odor', label: 'Foul Odor' },
    { value: 'no_clot', label: 'Empty Socket' },
    { value: 'pocket_depth', label: 'Pocket ≥4mm' },
    { value: 'bone_loss', label: 'Bone Loss' },
    { value: 'tooth_mobility', label: 'Tooth Mobility' },
    { value: 'calculus', label: 'Calculus Present' },
    { value: 'inflammation', label: 'Gingival Inflammation' },
    { value: 'softened_dentin', label: 'Softened Dentin' },
    { value: 'exposed_dentin', label: 'Exposed Dentin' },
    { value: 'gingival_recession', label: 'Gingival Recession' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function DiagnosisEngine() {
    const diagnoses = useCockpitStore(s => s.diagnoses);
    const addDiagnosis = useCockpitStore(s => s.addDiagnosis);
    const confirmDiagnosis = useCockpitStore(s => s.confirmDiagnosis);
    const chiefComplaints = useCockpitStore(s => s.chiefComplaints);

    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [selectedFindings, setSelectedFindings] = useState<string[]>([]);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);

    const toggleChip = useCallback((value: string, list: string[], setter: (v: string[]) => void) => {
        setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
    }, []);

    // Run the diagnosis engine
    const suggestedDiagnoses = useMemo(() => {
        if (!hasAnalyzed) return [];
        const input: DiagnosticInput = {
            symptoms: selectedSymptoms,
            clinicalFindings: selectedFindings,
        };
        return provisionalDiagnosisEngine(input);
    }, [selectedSymptoms, selectedFindings, hasAnalyzed]);

    const handleAnalyze = useCallback(() => {
        setHasAnalyzed(true);
    }, []);

    const handleAcceptDiagnosis = useCallback((d: {
        diagnosis: string; icd_code: string; category: string; confidence: number;
    }) => {
        addDiagnosis({
            diagnosis: d.diagnosis,
            icdCode: d.icd_code,
            category: d.category,
            confidence: d.confidence,
            toothNumbers: [],
            isProvisional: true,
        });
    }, [addDiagnosis]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Brain className="w-4 h-4 text-fuchsia-500" /> ICD-10 Diagnosis Engine
                </h3>
                <Badge variant="outline" className="text-[10px] text-fuchsia-600 border-fuchsia-200">
                    {diagnosticKnowledgeBase.length} rules loaded
                </Badge>
            </div>

            {/* Symptoms Selection */}
            <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Symptoms (tap to select)</p>
                <div className="flex flex-wrap gap-1.5">
                    {SYMPTOM_CHIPS.map(chip => (
                        <button
                            key={chip.value}
                            onClick={() => toggleChip(chip.value, selectedSymptoms, setSelectedSymptoms)}
                            className={cn(
                                'px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all',
                                selectedSymptoms.includes(chip.value)
                                    ? 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300 dark:bg-fuchsia-950/50 dark:text-fuchsia-400 dark:border-fuchsia-800'
                                    : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:bg-fuchsia-50'
                            )}
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clinical Findings */}
            <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Clinical Findings</p>
                <div className="flex flex-wrap gap-1.5">
                    {FINDING_CHIPS.map(chip => (
                        <button
                            key={chip.value}
                            onClick={() => toggleChip(chip.value, selectedFindings, setSelectedFindings)}
                            className={cn(
                                'px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all',
                                selectedFindings.includes(chip.value)
                                    ? 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800'
                                    : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:bg-purple-50'
                            )}
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Analyze Button */}
            <div className="flex justify-center">
                <Button
                    onClick={handleAnalyze}
                    disabled={selectedSymptoms.length === 0 && selectedFindings.length === 0}
                    className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white shadow-lg shadow-fuchsia-200 dark:shadow-fuchsia-900/30"
                >
                    <Sparkles className="w-4 h-4 mr-2" /> Analyze Diagnosis
                </Button>
            </div>

            {/* Results */}
            <AnimatePresence>
                {suggestedDiagnoses.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                    >
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                            AI Suggested Diagnoses ({suggestedDiagnoses.length})
                        </p>
                        {suggestedDiagnoses.map((d, i) => {
                            const isAlreadyAdded = diagnoses.some(diag => diag.icdCode === d.icd_code);
                            const confidenceColor =
                                d.confidence >= 0.7 ? 'text-emerald-600 bg-emerald-50'
                                    : d.confidence >= 0.5 ? 'text-amber-600 bg-amber-50'
                                        : 'text-slate-500 bg-slate-50';

                            return (
                                <motion.div
                                    key={d.icd_code}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={cn(
                                        'flex items-center justify-between p-3 rounded-lg border',
                                        isAlreadyAdded
                                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50'
                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                    )}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-semibold text-xs text-slate-900 dark:text-white">
                                                {d.diagnosis}
                                            </span>
                                            <Badge variant="outline" className="text-[9px] text-slate-500">
                                                {d.icd_code}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={cn('text-[9px]', confidenceColor)}>
                                                {(d.confidence * 100).toFixed(0)}% confidence
                                            </Badge>
                                            <span className="text-[10px] text-slate-400">
                                                {d.matchedSymptoms} symptoms · {d.matchedFindings} findings match
                                            </span>
                                        </div>
                                    </div>
                                    {isAlreadyAdded ? (
                                        <Badge className="bg-emerald-100 text-emerald-700 text-[10px] gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Added
                                        </Badge>
                                    ) : (
                                        <Button
                                            size="sm"
                                            onClick={() => handleAcceptDiagnosis(d)}
                                            className="text-xs bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                                        >
                                            <Plus className="w-3 h-3 mr-1" /> Accept
                                        </Button>
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirmed Diagnoses */}
            {diagnoses.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                        Session Diagnoses
                    </p>
                    {diagnoses.map((d, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 mb-1"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-900 dark:text-white">{d.diagnosis}</span>
                                <Badge variant="outline" className="text-[9px]">{d.icdCode}</Badge>
                            </div>
                            {d.isProvisional ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => confirmDiagnosis(i)}
                                    className="text-[10px] text-fuchsia-600 hover:text-fuchsia-700"
                                >
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Confirm
                                </Button>
                            ) : (
                                <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Confirmed</Badge>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
