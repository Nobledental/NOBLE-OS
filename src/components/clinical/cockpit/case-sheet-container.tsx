'use client';

/**
 * Case Sheet Container — The Clinical Cockpit Orchestrator
 * 
 * This is the brain of the doctor's workflow. It:
 * 1. Renders phases in sequence: Intake → Exam → Investigation → Diagnosis → Treatment → Execution → Post-Op
 * 2. Conditionally mounts modules based on patient context (age, gender, diagnosis)
 * 3. Integrates EVERY existing clinical engine:
 *    - provisionalDiagnosisEngine (ICD-10)
 *    - AutomationEngine (billing + stock)
 *    - POST_OP_PROTOCOLS (recovery)
 *    - ToothMapStateManager (index auto-update)
 *    - classifyGVBlack, classifyKennedy, interpretPSR
 *    - SmartNote templates
 *    - Drug risk engine
 */

import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserCheck, ClipboardList, Stethoscope, Search,
    Brain, GitBranch, Play, CheckCircle2,
    ChevronLeft, ChevronRight, AlertTriangle,
    Shield, Activity, Baby, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    useCockpitStore,
    type CockpitPhase,
} from '@/lib/clinical-cockpit-store';

// Existing Components — Reused
import { AdvancedIntake } from '@/components/clinical/advanced-intake';
import AIProvisionalDiagnosis from '@/components/clinical/ai-diagnosis';
import { ClinicalConsultation } from '@/components/clinical/consultation';
import { ClinicalMediaVault } from '@/components/clinical/cockpit/clinical-media-vault';
import { PediatricMilestones } from '@/components/clinical/cockpit/pediatric-milestones';
import { OrthoAnalysis } from '@/components/clinical/cockpit/ortho-analysis';
import { ToothGrid } from '@/components/clinical/cockpit/tooth-grid';

// New Cockpit Components
import { PatientIntakePanel } from './patient-intake-panel';
import { VitalsRecorder } from './vitals-recorder';
import { DiagnosisEngine } from './diagnosis-engine';
import { TreatmentPlanFork } from './treatment-plan-fork';
import { SurgicalSuite } from './surgical-suite';
import { SmartNoteInjector } from './smart-note-injector';
import { PostOpPanel } from './post-op-panel';

// ============================================================================
// PHASE METADATA
// ============================================================================

const PHASES: { id: CockpitPhase; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'PATIENT_SELECT', label: 'Patient', icon: <UserCheck className="w-4 h-4" />, color: 'bg-blue-500' },
    { id: 'INTAKE', label: 'Intake', icon: <ClipboardList className="w-4 h-4" />, color: 'bg-indigo-500' },
    { id: 'EXAMINATION', label: 'Examine', icon: <Stethoscope className="w-4 h-4" />, color: 'bg-purple-500' },
    { id: 'INVESTIGATION', label: 'Investigate', icon: <Search className="w-4 h-4" />, color: 'bg-violet-500' },
    { id: 'DIAGNOSIS', label: 'Diagnose', icon: <Brain className="w-4 h-4" />, color: 'bg-fuchsia-500' },
    { id: 'TREATMENT_PLAN', label: 'Plan', icon: <GitBranch className="w-4 h-4" />, color: 'bg-pink-500' },
    { id: 'EXECUTION', label: 'Execute', icon: <Play className="w-4 h-4" />, color: 'bg-rose-500' },
    { id: 'POST_OP', label: 'Post-Op', icon: <CheckCircle2 className="w-4 h-4" />, color: 'bg-emerald-500' },
];

const PHASE_ORDER: CockpitPhase[] = PHASES.map(p => p.id);

// ============================================================================
// PHASE PROGRESS BAR
// ============================================================================

function PhaseProgressBar() {
    const phase = useCockpitStore(s => s.phase);
    const setPhase = useCockpitStore(s => s.setPhase);
    const currentIndex = PHASE_ORDER.indexOf(phase);

    return (
        <div className="flex items-center gap-1 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            {PHASES.map((p, i) => {
                const isActive = p.id === phase;
                const isPast = i < currentIndex;
                const isFuture = i > currentIndex;

                return (
                    <button
                        key={p.id}
                        onClick={() => isPast && setPhase(p.id)}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300',
                            isActive && `${p.color} text-white shadow-md scale-105`,
                            isPast && 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-pointer hover:bg-emerald-100',
                            isFuture && 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        )}
                        disabled={isFuture}
                    >
                        {isPast ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : p.icon}
                        <span className="hidden lg:inline">{p.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

// ============================================================================
// RISK BANNER
// ============================================================================

function RiskBanner() {
    const riskAlerts = useCockpitStore(s => s.riskAlerts);
    const maternity = useCockpitStore(s => s.maternity);
    const patient = useCockpitStore(s => s.patient);
    const clinicalRiskScore = useCockpitStore(s => s.clinicalRiskScore);

    const allAlerts: string[] = useMemo(() => {
        const alerts = [...riskAlerts];
        if (maternity.isPregnant) {
            alerts.push(`🤰 PREGNANT: Trimester ${maternity.trimester || '?'} — Avoid elective procedures. Minimal X-ray exposure.`);
        }
        if (maternity.isNursing) {
            alerts.push('🍼 NURSING MOTHER: Verify drug safety for lactation before prescribing.');
        }
        if (patient && patient.age < 6) {
            alerts.push('👶 PEDIATRIC PATIENT: Use weight-based dosing. Check eruption timeline.');
        }
        return alerts;
    }, [riskAlerts, maternity, patient]);

    if (allAlerts.length === 0) return null;

    const riskColor = clinicalRiskScore > 70 ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
        : clinicalRiskScore > 40 ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
            : 'border-blue-500 bg-blue-50 dark:bg-blue-950/30';

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('rounded-xl border-l-4 p-3 mb-4', riskColor)}
        >
            <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    Clinical Risk Alerts
                </span>
                <Badge
                    variant="outline"
                    className={cn(
                        'text-[10px] ml-auto',
                        clinicalRiskScore > 70 ? 'text-red-600 border-red-300' :
                            clinicalRiskScore > 40 ? 'text-amber-600 border-amber-300' :
                                'text-blue-600 border-blue-300'
                    )}
                >
                    Risk Score: {clinicalRiskScore}%
                </Badge>
            </div>
            <div className="space-y-1">
                {allAlerts.map((alert, i) => (
                    <p key={i} className="text-xs text-slate-700 dark:text-slate-300">
                        {alert}
                    </p>
                ))}
            </div>
        </motion.div>
    );
}

// ============================================================================
// CONDITIONAL MODULE BADGES
// ============================================================================

function ConditionalModuleBadges() {
    const showMaternity = useCockpitStore(s => s.showMaternity);
    const showMilestones = useCockpitStore(s => s.showMilestones);
    const showWARS = useCockpitStore(s => s.showWARS);
    const showPAE = useCockpitStore(s => s.showPAE);
    const showOrthoAnalysis = useCockpitStore(s => s.showOrthoAnalysis);
    const patient = useCockpitStore(s => s.patient);

    const modules = [
        showMilestones && { label: 'Pediatric', color: 'bg-sky-100 text-sky-700 border-sky-200', icon: <Baby className="w-3 h-3" /> },
        showMaternity && { label: 'Maternity', color: 'bg-pink-100 text-pink-700 border-pink-200', icon: <Heart className="w-3 h-3" /> },
        showWARS && { label: 'WARS', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Shield className="w-3 h-3" /> },
        showPAE && { label: 'PAE', color: 'bg-red-100 text-red-700 border-red-200', icon: <Activity className="w-3 h-3" /> },
        showOrthoAnalysis && { label: 'Ortho', color: 'bg-violet-100 text-violet-700 border-violet-200', icon: <GitBranch className="w-3 h-3" /> },
    ].filter(Boolean) as { label: string; color: string; icon: React.ReactNode }[];

    if (modules.length === 0 || !patient) return null;

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Active Modules:</span>
            {modules.map(m => (
                <Badge key={m.label} variant="outline" className={cn('text-[10px] gap-1 border', m.color)}>
                    {m.icon} {m.label}
                </Badge>
            ))}
        </div>
    );
}

// ============================================================================
// PATIENT HEADER
// ============================================================================

function PatientHeader() {
    const patient = useCockpitStore(s => s.patient);
    const visitId = useCockpitStore(s => s.visitId);
    const clearSession = useCockpitStore(s => s.clearSession);
    const computeRiskScore = useCockpitStore(s => s.computeRiskScore);

    if (!patient) return null;

    return (
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-xl border border-indigo-100/50 dark:border-indigo-800/30">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {patient.name.charAt(0)}
                </div>
                <div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{patient.name}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {patient.age}y / {patient.gender} · {patient.phone}
                        {patient.bloodGroup && ` · ${patient.bloodGroup}`}
                    </p>
                </div>
                <Badge variant="outline" className="text-[10px] ml-2 bg-white/70 text-slate-500">
                    Visit: {visitId?.slice(-6)}
                </Badge>
            </div>
            <div className="flex items-center gap-2">
                <ConditionalModuleBadges />
                <Button variant="ghost" size="sm" onClick={clearSession} className="text-xs text-slate-400 hover:text-red-500">
                    End Session
                </Button>
            </div>
        </div>
    );
}

// ============================================================================
// PHASE RENDERERS
// ============================================================================

function PhaseContent() {
    const phase = useCockpitStore(s => s.phase);
    const patient = useCockpitStore(s => s.patient);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={phase}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex-1"
            >
                {phase === 'PATIENT_SELECT' && <PatientSelectPhase />}
                {phase === 'INTAKE' && patient && <PatientIntakePanel />}
                {phase === 'EXAMINATION' && patient && <ExaminationPhase />}
                {phase === 'INVESTIGATION' && patient && <InvestigationPhase />}
                {phase === 'DIAGNOSIS' && patient && <DiagnosisPhase />}
                {phase === 'TREATMENT_PLAN' && patient && <TreatmentPlanFork />}
                {phase === 'EXECUTION' && patient && <ExecutionPhase />}
                {phase === 'POST_OP' && patient && <PostOpPhase />}
            </motion.div>
        </AnimatePresence>
    );
}

// Patient Select Phase
function PatientSelectPhase() {
    const selectPatient = useCockpitStore(s => s.selectPatient);

    // In a real implementation, this would fetch from Supabase/Healthflo
    // For now, this is a placeholder that will be connected to the patient search
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
                <UserCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Select a Patient
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">
                Select a patient from today&apos;s appointments or search by name/phone to begin the clinical session.
            </p>
            <div className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-3 max-w-sm">
                💡 <strong>Tip:</strong> Click any patient in the Appointment Queue to auto-load their case sheet with pre-filled history.
            </div>
        </div>
    );
}

// Examination Phase — Integrates Vitals + Tooth Grid + Conditional Modules
function ExaminationPhase() {
    const patient = useCockpitStore(s => s.patient);
    const showMaternity = useCockpitStore(s => s.showMaternity);
    const showMilestones = useCockpitStore(s => s.showMilestones);

    return (
        <div className="space-y-6">
            {/* Vitals Recorder */}
            <VitalsRecorder type="PRE_OP" />

            {/* Oral Examination - Uses existing consultation component */}
            {patient && <ClinicalConsultation patientId={patient.id} />}

            {/* Advanced Intake - Reuse existing component */}
            <AdvancedIntake />

            {/* Conditional: Maternity Module */}
            {showMaternity && <MaternityModule />}

            {/* Conditional: Pediatric Milestones */}
            {showMilestones && <PediatricModule />}
        </div>
    );
}

// Investigation Phase
function InvestigationPhase() {
    const patient = useCockpitStore(s => s.patient);
    const iopaCount = useCockpitStore(s => s.iopaCount);
    const incrementIOPA = useCockpitStore(s => s.incrementIOPA);

    return (
        <div className="space-y-6">
            {/* IOPA Counter */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Search className="w-4 h-4 text-violet-500" /> IOPA Exposures
                    </h3>
                    <Badge variant="outline" className="text-violet-600 border-violet-200">
                        {iopaCount} exposures → auto-billed
                    </Badge>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        size="sm"
                        onClick={incrementIOPA}
                        className="bg-violet-600 hover:bg-violet-700 text-white"
                    >
                        + Add IOPA
                    </Button>
                    <p className="text-xs text-slate-500">
                        Each exposure is automatically added to the billing ledger.
                    </p>
                </div>
            </div>

            {/* Media Gallery - Reuse existing */}
            {patient && <ClinicalMediaVault />}
        </div>
    );
}

// Diagnosis Phase — Integrates AI Provisional Diagnosis Engine
function DiagnosisPhase() {
    return (
        <div className="space-y-6">
            {/* AI Diagnosis Engine — Reuses existing AIProvisionalDiagnosis */}
            <AIProvisionalDiagnosis />

            {/* New Diagnosis Engine with ICD-10 integration */}
            <DiagnosisEngine />

            {/* Orthodontic Analysis (Conditional) */}
            {(useCockpitStore.getState().showOrthoAnalysis) && (
                <OrthoAnalysis />
            )}
        </div>
    );
}

// Execution Phase
function ExecutionPhase() {
    const showWARS = useCockpitStore(s => s.showWARS);
    const showPAE = useCockpitStore(s => s.showPAE);
    const patient = useCockpitStore(s => s.patient);

    return (
        <div className="space-y-6">
            {/* Surgical Suite */}
            <SurgicalSuite />

            {/* Smart Note Injector */}
            <SmartNoteInjector />
        </div>
    );
}

// Post-Op Phase — Uses PostOpPanel (Vitals + Rx + Notes + Billing)
function PostOpPhase() {
    return <PostOpPanel />;
}

// Conditional Modules
function MaternityModule() {
    const maternity = useCockpitStore(s => s.maternity);
    const setMaternity = useCockpitStore(s => s.setMaternity);

    return (
        <div className="bg-pink-50/50 dark:bg-pink-950/20 rounded-xl border border-pink-200/50 dark:border-pink-800/30 p-4">
            <h4 className="text-sm font-semibold text-pink-800 dark:text-pink-300 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" /> Maternity Vault
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <input
                        type="checkbox"
                        checked={maternity.isPregnant}
                        onChange={(e) => setMaternity({ isPregnant: e.target.checked, isApplicable: true })}
                        className="rounded border-pink-300"
                    />
                    Pregnant
                </label>
                {maternity.isPregnant && (
                    <div>
                        <label className="text-[10px] text-slate-500 block mb-1">Month</label>
                        <select
                            value={maternity.pregnancyMonth || ''}
                            onChange={(e) => setMaternity({ pregnancyMonth: Number(e.target.value) })}
                            className="w-full text-xs rounded border-pink-200 bg-white dark:bg-slate-800 px-2 py-1.5"
                        >
                            <option value="">Select</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(m => (
                                <option key={m} value={m}>Month {m}</option>
                            ))}
                        </select>
                    </div>
                )}
                {maternity.isPregnant && maternity.trimester && (
                    <Badge variant="outline" className="text-[10px] self-center bg-pink-100 text-pink-700 border-pink-200">
                        Trimester {maternity.trimester}
                    </Badge>
                )}
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <input
                        type="checkbox"
                        checked={maternity.isNursing}
                        onChange={(e) => setMaternity({ isNursing: e.target.checked })}
                        className="rounded border-pink-300"
                    />
                    Nursing
                </label>
            </div>
        </div>
    );
}

function PediatricModule() {
    const patient = useCockpitStore(s => s.patient);

    return (
        <div className="bg-sky-50/50 dark:bg-sky-950/20 rounded-xl border border-sky-200/50 dark:border-sky-800/30 p-4">
            <h4 className="text-sm font-semibold text-sky-800 dark:text-sky-300 mb-3 flex items-center gap-2">
                <Baby className="w-4 h-4" /> Pediatric Assessment
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white/60 dark:bg-slate-800/50 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Age</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{patient?.age} years</p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/50 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Dentition Stage</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {patient && patient.age < 6 ? 'Primary' : patient && patient.age < 12 ? 'Mixed' : 'Permanent'}
                    </p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/50 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Suggested Chart</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {patient && patient.age < 6 ? 'Deciduous FDI (51-85)' : 'Permanent FDI (11-48)'}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// NAVIGATION FOOTER
// ============================================================================

function PhaseNavigation() {
    const phase = useCockpitStore(s => s.phase);
    const nextPhase = useCockpitStore(s => s.nextPhase);
    const prevPhase = useCockpitStore(s => s.prevPhase);
    const patient = useCockpitStore(s => s.patient);
    const currentIndex = PHASE_ORDER.indexOf(phase);
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === PHASE_ORDER.length - 1;

    if (!patient && phase === 'PATIENT_SELECT') return null;

    return (
        <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <Button
                variant="outline"
                size="sm"
                onClick={prevPhase}
                disabled={isFirst}
                className="text-xs"
            >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
            </Button>
            <span className="text-xs text-slate-500">
                Step {currentIndex + 1} of {PHASE_ORDER.length}: <strong>{PHASES[currentIndex]?.label}</strong>
            </span>
            <Button
                size="sm"
                onClick={nextPhase}
                disabled={isLast}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
            >
                Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
        </div>
    );
}

// ============================================================================
// MAIN CONTAINER
// ============================================================================

export function CaseSheetContainer() {
    const patient = useCockpitStore(s => s.patient);

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Phase Progress Bar */}
            <PhaseProgressBar />

            {/* Patient Header */}
            <PatientHeader />

            {/* Pediatric Milestones (Age < 13 or Manual Toggle) */}
            {((patient && patient.age < 13) || useCockpitStore.getState().showMilestones) && (
                <PediatricMilestones />
            )}

            {/* Tooth Grid */}
            <ToothGrid />

            {/* Phase Content */}
            <div className="flex-1 overflow-y-auto">
                <PhaseContent />
            </div>

            {/* Navigation */}
            <PhaseNavigation />
        </div>
    );
}
