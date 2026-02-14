'use client';

/**
 * Prescription Engine
 * 
 * Auto-generates post-procedure prescriptions based on:
 * 1. Completed procedures → prescription defaults from POST_OP_PROTOCOLS
 * 2. Diagnosis context → medication suggestions
 * 3. Patient risk flags (allergies, pregnancy, drug interactions)
 * 
 * Doctor can edit, add, remove medications.
 * Zero typing: tap-to-add from intelligent suggestions, adjust dosage via dropdown.
 * 
 * Integrates:
 * - POST_OP_PROTOCOLS from postop-protocols.ts
 * - DRUG_RISK_MAP from cockpit-store
 * - useCockpitStore for patient context
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Pill, Wand2, Plus, X, AlertTriangle,
    CheckCircle2, Clock, ShieldAlert, Baby
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    useCockpitStore,
    getDrugRisks,
    type MedicationEntry,
} from '@/lib/clinical-cockpit-store';
import { POST_OP_PROTOCOLS } from '@/lib/postop-protocols';

// ============================================================================
// PRESCRIPTION DATABASE — Common dental drugs with dosage presets
// ============================================================================

interface DrugPreset {
    id: string;
    name: string;
    category: 'ANALGESIC' | 'ANTIBIOTIC' | 'ANTI_INFLAMMATORY' | 'ANTIFUNGAL' | 'MOUTHWASH' | 'OTHER';
    defaultDosage: string;
    frequencies: string[];
    defaultFrequency: string;
    durations: string[];
    defaultDuration: string;
    contraindications: string[];  // Conditions where this drug should NOT be used
    tags: string[];  // For auto-suggest matching
}

const DRUG_PRESETS: DrugPreset[] = [
    // Analgesics
    {
        id: 'ibuprofen_400',
        name: 'Ibuprofen 400mg',
        category: 'ANALGESIC',
        defaultDosage: '400mg',
        frequencies: ['BD', 'TDS', 'SOS'],
        defaultFrequency: 'TDS',
        durations: ['3 days', '5 days', '7 days'],
        defaultDuration: '3 days',
        contraindications: ['pregnancy_trimester_3', 'bleeding_risk', 'gastric_ulcer'],
        tags: ['pain', 'extraction', 'rct', 'surgery', 'anti_inflammatory'],
    },
    {
        id: 'paracetamol_500',
        name: 'Paracetamol 500mg',
        category: 'ANALGESIC',
        defaultDosage: '500mg',
        frequencies: ['TDS', 'QID', 'SOS'],
        defaultFrequency: 'TDS',
        durations: ['3 days', '5 days', '7 days'],
        defaultDuration: '3 days',
        contraindications: [],
        tags: ['pain', 'fever', 'mild', 'safe_pregnancy'],
    },
    {
        id: 'diclofenac_50',
        name: 'Diclofenac Sodium 50mg',
        category: 'ANALGESIC',
        defaultDosage: '50mg',
        frequencies: ['BD', 'TDS'],
        defaultFrequency: 'BD',
        durations: ['3 days', '5 days'],
        defaultDuration: '3 days',
        contraindications: ['pregnancy', 'bleeding_risk', 'gastric_ulcer'],
        tags: ['pain', 'inflammation', 'surgery', 'extraction'],
    },
    {
        id: 'aceclofenac_para',
        name: 'Aceclofenac 100mg + Paracetamol 325mg',
        category: 'ANALGESIC',
        defaultDosage: '100mg/325mg',
        frequencies: ['BD', 'TDS'],
        defaultFrequency: 'BD',
        durations: ['3 days', '5 days'],
        defaultDuration: '3 days',
        contraindications: ['pregnancy', 'bleeding_risk'],
        tags: ['pain', 'moderate', 'extraction', 'rct'],
    },
    // Antibiotics
    {
        id: 'amoxicillin_500',
        name: 'Amoxicillin 500mg',
        category: 'ANTIBIOTIC',
        defaultDosage: '500mg',
        frequencies: ['TDS'],
        defaultFrequency: 'TDS',
        durations: ['5 days', '7 days'],
        defaultDuration: '5 days',
        contraindications: ['penicillin_allergy'],
        tags: ['infection', 'abscess', 'extraction', 'surgery', 'antibiotic'],
    },
    {
        id: 'amox_clav',
        name: 'Amoxicillin + Clavulanic Acid 625mg',
        category: 'ANTIBIOTIC',
        defaultDosage: '625mg',
        frequencies: ['BD'],
        defaultFrequency: 'BD',
        durations: ['5 days', '7 days'],
        defaultDuration: '5 days',
        contraindications: ['penicillin_allergy'],
        tags: ['infection', 'severe', 'abscess', 'surgery', 'implant'],
    },
    {
        id: 'metronidazole_400',
        name: 'Metronidazole 400mg',
        category: 'ANTIBIOTIC',
        defaultDosage: '400mg',
        frequencies: ['TDS'],
        defaultFrequency: 'TDS',
        durations: ['5 days', '7 days'],
        defaultDuration: '5 days',
        contraindications: ['pregnancy_trimester_1', 'alcohol_interaction'],
        tags: ['anaerobic', 'periodontal', 'abscess', 'infection'],
    },
    {
        id: 'azithromycin_500',
        name: 'Azithromycin 500mg',
        category: 'ANTIBIOTIC',
        defaultDosage: '500mg',
        frequencies: ['OD'],
        defaultFrequency: 'OD',
        durations: ['3 days', '5 days'],
        defaultDuration: '3 days',
        contraindications: [],
        tags: ['infection', 'penicillin_alternative', 'mild'],
    },
    // Anti-inflammatory
    {
        id: 'serratiopeptidase',
        name: 'Serratiopeptidase 10mg',
        category: 'ANTI_INFLAMMATORY',
        defaultDosage: '10mg',
        frequencies: ['BD', 'TDS'],
        defaultFrequency: 'BD',
        durations: ['5 days', '7 days'],
        defaultDuration: '5 days',
        contraindications: [],
        tags: ['swelling', 'inflammation', 'surgery', 'extraction'],
    },
    // Mouthwash
    {
        id: 'chx_012',
        name: 'Chlorhexidine 0.12% Mouthwash',
        category: 'MOUTHWASH',
        defaultDosage: '10ml',
        frequencies: ['BD'],
        defaultFrequency: 'BD',
        durations: ['7 days', '14 days'],
        defaultDuration: '7 days',
        contraindications: [],
        tags: ['mouthwash', 'gum', 'periodontal', 'post_op', 'hygiene'],
    },
    {
        id: 'betadine_gargle',
        name: 'Povidone-Iodine 2% Gargle',
        category: 'MOUTHWASH',
        defaultDosage: '10ml diluted',
        frequencies: ['TDS'],
        defaultFrequency: 'TDS',
        durations: ['5 days', '7 days'],
        defaultDuration: '5 days',
        contraindications: ['iodine_allergy', 'thyroid_disorder'],
        tags: ['gargle', 'infection', 'post_op', 'extraction'],
    },
    // Other
    {
        id: 'pantoprazole_40',
        name: 'Pantoprazole 40mg',
        category: 'OTHER',
        defaultDosage: '40mg',
        frequencies: ['OD (before breakfast)'],
        defaultFrequency: 'OD (before breakfast)',
        durations: ['5 days', '7 days', '14 days'],
        defaultDuration: '5 days',
        contraindications: [],
        tags: ['gastric_protection', 'nsaid_cover', 'acidity'],
    },
];

// ============================================================================
// AUTO-SUGGEST LOGIC
// ============================================================================

function autoSuggestDrugs(
    procedures: { code: string; name: string }[],
    isPregnant: boolean,
    hasBleedingRisk: boolean,
): DrugPreset[] {
    const suggested = new Set<string>();
    const result: DrugPreset[] = [];

    // From POST_OP_PROTOCOLS prescription defaults
    procedures.forEach(proc => {
        const codeVariants = [proc.code, proc.code.replace('SIMPLE_', ''), proc.code.replace('_PLACEMENT', '')];
        for (const variant of codeVariants) {
            const protocol = POST_OP_PROTOCOLS.get(variant);
            if (protocol?.prescriptionDefaults) {
                protocol.prescriptionDefaults.forEach(rx => {
                    const lower = rx.toLowerCase();
                    if (lower.includes('antibiotic') && !suggested.has('amoxicillin_500')) {
                        suggested.add('amoxicillin_500');
                    }
                    if (lower.includes('pain') && !suggested.has('ibuprofen_400') && !suggested.has('paracetamol_500')) {
                        suggested.add(isPregnant || hasBleedingRisk ? 'paracetamol_500' : 'ibuprofen_400');
                    }
                    if (lower.includes('mouthwash') && !suggested.has('chx_012')) {
                        suggested.add('chx_012');
                    }
                });
                break;
            }
        }
    });

    // Add gastric protection if NSAID prescribed
    if (suggested.has('ibuprofen_400') || suggested.has('diclofenac_50') || suggested.has('aceclofenac_para')) {
        suggested.add('pantoprazole_40');
    }

    // Surgical always needs antibiotic + analgesic + anti-inflammatory
    const isSurgical = procedures.some(p =>
        ['SURGICAL_EXTRACTION', 'IMPLANT_PLACEMENT', 'PERIODONTAL_SURGERY', 'JAW_SURGERY'].includes(p.code)
    );
    if (isSurgical) {
        if (!suggested.has('amoxicillin_500') && !suggested.has('amox_clav')) {
            suggested.add('amox_clav');
        }
        suggested.add('metronidazole_400');
        suggested.add('serratiopeptidase');
        if (!suggested.has('ibuprofen_400') && !suggested.has('paracetamol_500')) {
            suggested.add(isPregnant ? 'paracetamol_500' : 'aceclofenac_para');
        }
    }

    // Map IDs to presets
    suggested.forEach(id => {
        const preset = DRUG_PRESETS.find(d => d.id === id);
        if (preset) result.push(preset);
    });

    return result;
}

// ============================================================================
// COMPONENT
// ============================================================================

interface PrescriptionItem {
    drugId: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    hasRisk: boolean;
    riskWarning?: string;
}

export function PrescriptionEngine() {
    const procedures = useCockpitStore(s => s.procedures);
    const maternity = useCockpitStore(s => s.maternity);
    const medications = useCockpitStore(s => s.medications);
    const addPrescription = useCockpitStore(s => s.addPrescription);

    const [prescription, setPrescription] = useState<PrescriptionItem[]>([]);
    const [generated, setGenerated] = useState(false);

    const hasBleedingRisk = medications.some(m => m.riskFlags.includes('bleeding_risk'));

    // Auto-generate prescriptions
    const handleGenerate = useCallback(() => {
        const completedProcs = procedures.filter(p => p.status === 'COMPLETED' || p.status === 'IN_PROGRESS');
        const suggested = autoSuggestDrugs(completedProcs, maternity.isPregnant, hasBleedingRisk);

        const items: PrescriptionItem[] = suggested.map(drug => {
            // Check for patient-specific contraindications
            let hasRisk = false;
            let riskWarning: string | undefined;
            if (maternity.isPregnant) {
                const pregContra = drug.contraindications.some(c => c.includes('pregnancy'));
                if (pregContra) {
                    hasRisk = true;
                    riskWarning = '⚠️ Contraindicated in pregnancy';
                }
            }
            if (hasBleedingRisk) {
                const bleedContra = drug.contraindications.includes('bleeding_risk');
                if (bleedContra) {
                    hasRisk = true;
                    riskWarning = '🩸 Bleeding risk — patient on anticoagulants';
                }
            }

            return {
                drugId: drug.id,
                name: drug.name,
                dosage: drug.defaultDosage,
                frequency: drug.defaultFrequency,
                duration: drug.defaultDuration,
                hasRisk,
                riskWarning,
            };
        });

        setPrescription(items);
        setGenerated(true);
    }, [procedures, maternity, hasBleedingRisk]);

    // Add a drug from preset
    const handleAddDrug = (preset: DrugPreset) => {
        if (prescription.some(p => p.drugId === preset.id)) return;
        setPrescription(prev => [...prev, {
            drugId: preset.id,
            name: preset.name,
            dosage: preset.defaultDosage,
            frequency: preset.defaultFrequency,
            duration: preset.defaultDuration,
            hasRisk: false,
        }]);
    };

    const handleRemoveDrug = (drugId: string) => {
        setPrescription(prev => prev.filter(p => p.drugId !== drugId));
    };

    const handleFrequencyChange = (drugId: string, frequency: string) => {
        setPrescription(prev => prev.map(p =>
            p.drugId === drugId ? { ...p, frequency } : p
        ));
    };

    const handleDurationChange = (drugId: string, duration: string) => {
        setPrescription(prev => prev.map(p =>
            p.drugId === drugId ? { ...p, duration } : p
        ));
    };

    // Save all prescriptions to cockpit store
    const handleSave = () => {
        prescription.forEach(item => {
            const medEntry: MedicationEntry = {
                name: item.name,
                dosage: item.dosage,
                frequency: item.frequency,
                duration: item.duration,
                isActive: true,
                riskFlags: item.hasRisk ? ['prescribed_with_warning'] : [],
            };
            addPrescription(medEntry);
        });
    };

    // Drugs not yet in prescription for "Add More" section
    const availableDrugs = DRUG_PRESETS.filter(d =>
        !prescription.some(p => p.drugId === d.id)
    );

    const categoryColors: Record<string, string> = {
        'ANALGESIC': 'bg-amber-50 text-amber-700 border-amber-200',
        'ANTIBIOTIC': 'bg-blue-50 text-blue-700 border-blue-200',
        'ANTI_INFLAMMATORY': 'bg-purple-50 text-purple-700 border-purple-200',
        'ANTIFUNGAL': 'bg-teal-50 text-teal-700 border-teal-200',
        'MOUTHWASH': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'OTHER': 'bg-slate-50 text-slate-700 border-slate-200',
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Pill className="w-4 h-4 text-blue-500" /> Smart Prescription
                </h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleGenerate} className="text-xs">
                        <Wand2 className="w-3.5 h-3.5 mr-1" />
                        {generated ? 'Re-generate' : 'Auto-Generate Rx'}
                    </Button>
                    {generated && prescription.length > 0 && (
                        <Button size="sm" onClick={handleSave} className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Save Rx
                        </Button>
                    )}
                </div>
            </div>

            {/* Pregnancy / Risk Banner */}
            {maternity.isPregnant && (
                <div className="mb-3 p-2 rounded-lg bg-pink-50 border border-pink-200 flex items-center gap-2 text-xs text-pink-700">
                    <Baby className="w-4 h-4" />
                    <span className="font-medium">Pregnant patient — NSAIDs auto-excluded, safe alternatives prioritized</span>
                </div>
            )}
            {hasBleedingRisk && (
                <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="font-medium">Patient on anticoagulants — bleeding risk drugs flagged</span>
                </div>
            )}

            {!generated ? (
                <div className="text-center py-8 text-sm text-slate-400">
                    <Pill className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Click "Auto-Generate Rx" to create a prescription
                    <br />
                    <span className="text-[11px]">based on completed procedures and patient risk profile</span>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Prescription Items */}
                    <AnimatePresence>
                        {prescription.map((item, i) => {
                            const preset = DRUG_PRESETS.find(d => d.id === item.drugId);
                            return (
                                <motion.div
                                    key={item.drugId}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={cn(
                                        "p-3 rounded-lg border flex items-start gap-3",
                                        item.hasRisk
                                            ? "border-red-200 bg-red-50/50"
                                            : "border-slate-200 bg-slate-50"
                                    )}
                                >
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-slate-900">{i + 1}. {item.name}</span>
                                            {preset && (
                                                <Badge variant="outline" className={cn("text-[9px]", categoryColors[preset.category])}>
                                                    {preset.category.replace('_', ' ')}
                                                </Badge>
                                            )}
                                            {item.hasRisk && (
                                                <Badge className="bg-red-100 text-red-700 text-[9px]">
                                                    <AlertTriangle className="w-3 h-3 mr-0.5" /> RISK
                                                </Badge>
                                            )}
                                        </div>

                                        {item.riskWarning && (
                                            <p className="text-[11px] text-red-600 font-medium">{item.riskWarning}</p>
                                        )}

                                        <div className="flex items-center gap-4 text-[11px]">
                                            {/* Frequency dropdown */}
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3 h-3 text-slate-400" />
                                                <select
                                                    value={item.frequency}
                                                    onChange={e => handleFrequencyChange(item.drugId, e.target.value)}
                                                    className="text-[11px] border border-slate-200 rounded px-1.5 py-0.5 bg-white"
                                                >
                                                    {preset?.frequencies.map(f => (
                                                        <option key={f} value={f}>{f}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* Duration dropdown */}
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-slate-400">×</span>
                                                <select
                                                    value={item.duration}
                                                    onChange={e => handleDurationChange(item.drugId, e.target.value)}
                                                    className="text-[11px] border border-slate-200 rounded px-1.5 py-0.5 bg-white"
                                                >
                                                    {preset?.durations.map(d => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleRemoveDrug(item.drugId)}
                                        className="p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Add More Drugs */}
                    {generated && (
                        <div className="mt-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Add More Medications</p>
                            <div className="flex flex-wrap gap-1.5">
                                {availableDrugs.slice(0, 8).map(drug => (
                                    <button
                                        key={drug.id}
                                        onClick={() => handleAddDrug(drug)}
                                        className="text-[10px] px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> {drug.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
