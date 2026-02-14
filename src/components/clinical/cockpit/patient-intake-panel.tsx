'use client';

/**
 * Patient Intake Panel
 * 
 * Pre-fills from HealthFlo/existing data. Chip-select for chief complaints.
 * Drug risk auto-alerts. Medical/surgical/family/dental history.
 * 
 * Integrations:
 * - CLINICAL_SUGGESTIONS from clinical-suggest.ts (complaints/diagnosis chips)
 * - getDrugRisks from clinical-cockpit-store.ts (auto-risk flags)
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardList, Pill, AlertTriangle, HeartPulse,
    UserCheck, Shield, FileText, Plus, X, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    useCockpitStore,
    getDrugRisks,
    type MedicationEntry,
    type ChiefComplaint,
} from '@/lib/clinical-cockpit-store';
import { CLINICAL_SUGGESTIONS } from '@/lib/clinical-suggest';
import { MaternityModule } from './maternity-module';

// ============================================================================
// CHIEF COMPLAINTS SELECTOR
// ============================================================================

function ChiefComplaintsSection() {
    const chiefComplaints = useCockpitStore(s => s.chiefComplaints);
    const addChiefComplaint = useCockpitStore(s => s.addChiefComplaint);
    const removeChiefComplaint = useCockpitStore(s => s.removeChiefComplaint);
    const [search, setSearch] = useState('');

    const complaints = CLINICAL_SUGGESTIONS.filter(s => s.category === 'complaint');
    const filtered = search
        ? complaints.filter(c => c.label.toLowerCase().includes(search.toLowerCase()))
        : complaints;

    const isSelected = (id: string) => chiefComplaints.some(c => c.id === id);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-indigo-500" /> Chief Complaints
            </h4>

            {/* Selected complaints */}
            {chiefComplaints.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {chiefComplaints.map(c => (
                        <Badge
                            key={c.id}
                            className="bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs gap-1 pr-1"
                        >
                            {c.label}
                            <button onClick={() => removeChiefComplaint(c.id)} className="ml-1 hover:text-red-500">
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Search */}
            <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search complaints..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            {/* Chip selector - one-tap to add */}
            <div className="flex flex-wrap gap-2">
                {filtered.map(c => (
                    <button
                        key={c.id}
                        onClick={() => !isSelected(c.id) && addChiefComplaint({
                            id: c.id,
                            label: c.label,
                            value: c.value,
                        })}
                        disabled={isSelected(c.id)}
                        className={cn(
                            'px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all',
                            isSelected(c.id)
                                ? 'bg-indigo-50 text-indigo-300 border-indigo-100 cursor-not-allowed'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 cursor-pointer'
                        )}
                    >
                        <Plus className="w-3 h-3 inline mr-1" />
                        {c.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// MEDICATIONS & DRUG RISK ENGINE
// ============================================================================

function MedicationsSection() {
    const medications = useCockpitStore(s => s.medications);
    const addMedication = useCockpitStore(s => s.addMedication);
    const riskAlerts = useCockpitStore(s => s.riskAlerts);
    const [drugName, setDrugName] = useState('');
    const [drugDosage, setDrugDosage] = useState('');
    const [drugFrequency, setDrugFrequency] = useState('OD');

    const handleAddMed = useCallback(() => {
        if (!drugName.trim()) return;
        const risks = getDrugRisks(drugName);
        addMedication({
            name: drugName,
            dosage: drugDosage,
            frequency: drugFrequency,
            isActive: true,
            riskFlags: risks?.risks || [],
        });
        setDrugName('');
        setDrugDosage('');
    }, [drugName, drugDosage, drugFrequency, addMedication]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Pill className="w-4 h-4 text-blue-500" /> Current Medications
            </h4>

            {/* Risk Alerts */}
            <AnimatePresence>
                {riskAlerts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-3 bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/30 rounded-lg p-3"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-bold text-red-700 dark:text-red-400">DRUG INTERACTION ALERTS</span>
                        </div>
                        {riskAlerts.map((alert, i) => (
                            <p key={i} className="text-[11px] text-red-700 dark:text-red-400 leading-relaxed">{alert}</p>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Current meds list */}
            {medications.length > 0 && (
                <div className="space-y-2 mb-3">
                    {medications.map((med, i) => (
                        <div
                            key={i}
                            className={cn(
                                'flex items-center justify-between px-3 py-2 rounded-lg border text-xs',
                                med.riskFlags.length > 0
                                    ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200/50 dark:border-red-800/30'
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-900 dark:text-white">{med.name}</span>
                                <span className="text-slate-500">{med.dosage} · {med.frequency}</span>
                            </div>
                            {med.riskFlags.length > 0 && (
                                <div className="flex gap-1">
                                    {med.riskFlags.map(flag => (
                                        <Badge key={flag} variant="destructive" className="text-[9px]">
                                            {flag.replace(/_/g, ' ')}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add medication form */}
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Drug name..."
                    value={drugName}
                    onChange={e => setDrugName(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                    type="text"
                    placeholder="Dosage"
                    value={drugDosage}
                    onChange={e => setDrugDosage(e.target.value)}
                    className="w-24 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <select
                    value={drugFrequency}
                    onChange={e => setDrugFrequency(e.target.value)}
                    className="w-20 px-2 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                    <option value="OD">OD</option>
                    <option value="BD">BD</option>
                    <option value="TDS">TDS</option>
                    <option value="QID">QID</option>
                    <option value="SOS">SOS</option>
                    <option value="HS">HS</option>
                </select>
                <Button size="sm" onClick={handleAddMed} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                    <Plus className="w-3.5 h-3.5" />
                </Button>
            </div>
        </div>
    );
}

// ============================================================================
// MEDICAL HISTORY SECTION
// ============================================================================

function MedicalHistorySection() {
    const [history, setHistory] = useState({
        diabetes: false,
        hypertension: false,
        heartDisease: false,
        asthma: false,
        thyroid: false,
        hepatitis: false,
        hiv: false,
        epilepsy: false,
        bleedingDisorder: false,
        kidneysDisease: false,
        liverDisease: false,
        cancer: false,
        surgicalHistory: '',
        familyHistory: '',
    });

    const conditions = [
        { key: 'diabetes', label: 'Diabetes', icon: '🩸' },
        { key: 'hypertension', label: 'Hypertension', icon: '❤️‍🔥' },
        { key: 'heartDisease', label: 'Heart Disease', icon: '🫀' },
        { key: 'asthma', label: 'Asthma', icon: '🫁' },
        { key: 'thyroid', label: 'Thyroid Disorder', icon: '🦋' },
        { key: 'hepatitis', label: 'Hepatitis', icon: '⚠️' },
        { key: 'hiv', label: 'HIV/AIDS', icon: '🛡️' },
        { key: 'epilepsy', label: 'Epilepsy', icon: '⚡' },
        { key: 'bleedingDisorder', label: 'Bleeding Disorder', icon: '🩹' },
        { key: 'kidneysDisease', label: 'Kidney Disease', icon: '🫘' },
        { key: 'liverDisease', label: 'Liver Disease', icon: '🍂' },
        { key: 'cancer', label: 'Cancer / Radiotherapy', icon: '🎗️' },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-red-500" /> Medical History
            </h4>

            {/* Toggle grid — zero typing */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                {conditions.map(c => (
                    <button
                        key={c.key}
                        onClick={() => setHistory(prev => ({ ...prev, [c.key]: !prev[c.key as keyof typeof prev] }))}
                        className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all',
                            history[c.key as keyof typeof history]
                                ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-700 dark:text-red-400'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                        )}
                    >
                        <span>{c.icon}</span>
                        {c.label}
                    </button>
                ))}
            </div>

            {/* Surgical & Family History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Past Surgical History</label>
                    <textarea
                        placeholder="Any previous surgeries..."
                        value={history.surgicalHistory}
                        onChange={e => setHistory(prev => ({ ...prev, surgicalHistory: e.target.value }))}
                        className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-2 resize-none"
                        rows={2}
                    />
                </div>
                <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Family History</label>
                    <textarea
                        placeholder="Relevant family conditions..."
                        value={history.familyHistory}
                        onChange={e => setHistory(prev => ({ ...prev, familyHistory: e.target.value }))}
                        className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-2 resize-none"
                        rows={2}
                    />
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PatientIntakePanel() {
    const patient = useCockpitStore(s => s.patient);

    if (!patient) return null;

    return (
        <div className="space-y-4">
            {/* Patient Summary Card */}
            <div className="bg-gradient-to-r from-white to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/20 rounded-xl border border-indigo-100/50 dark:border-indigo-800/30 p-4">
                <div className="flex items-center gap-3 mb-3">
                    <UserCheck className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Patient Intake</h3>
                    <Badge variant="outline" className="text-[10px] ml-auto text-indigo-600 border-indigo-200">
                        {patient.isRegistered ? 'Registered' : 'Walk-in'}
                    </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white/60 dark:bg-slate-800/50 rounded-lg p-2">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Name</p>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{patient.name}</p>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-800/50 rounded-lg p-2">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Age / Gender</p>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{patient.age}y · {patient.gender}</p>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-800/50 rounded-lg p-2">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Blood Group</p>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{patient.bloodGroup || 'Not recorded'}</p>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-800/50 rounded-lg p-2">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Insurance</p>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            {patient.insuranceProvider || 'Self-pay'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Chief Complaints */}
            <ChiefComplaintsSection />

            {/* Maternity Context (Female Only) */}
            {patient.gender === 'FEMALE' && <MaternityModule />}

            {/* Medications & Risk Engine */}
            <MedicationsSection />

            {/* Medical History */}
            <MedicalHistorySection />
        </div>
    );
}
