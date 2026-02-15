'use client';

/**
 * Case Sheet Container — The Clinical Cockpit Orchestrator
 * 
 * Noble White Edition: Bento-Glass aesthetic, monochrome Indigo stepper,
 * no framer-motion, all glove-ready (48px) touch targets.
 * 
 * Phases: Intake → Exam → Investigation → Diagnosis → Treatment → Execution → Post-Op
 */

import React, { useMemo } from 'react';
import {
    UserCheck, ClipboardList, Stethoscope, Search,
    Brain, GitBranch, Play, CheckCircle2,
    ChevronLeft, ChevronRight, AlertTriangle,
    Shield, Activity, Baby, Heart, UserRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CaseQueue } from '@/components/clinical/case-queue';

import { cn } from '@/lib/utils';
import {
    useCockpitStore,
    type CockpitPhase,
    PEDIATRIC_AGE_THRESHOLD
} from '@/lib/clinical-cockpit-store';

// Existing Components — Reused
import { AdvancedIntake } from '@/components/clinical/advanced-intake';
import AIProvisionalDiagnosis from '@/components/clinical/ai-diagnosis';
import { ClinicalConsultation } from '@/components/clinical/consultation';
import { ClinicalMediaVault } from '@/components/clinical/cockpit/clinical-media-vault';
import { PediatricMilestones } from '@/components/clinical/cockpit/pediatric-milestones';
import { OrthoAnalysis } from '@/components/clinical/cockpit/ortho-analysis';
import { ToothGrid } from '@/components/clinical/cockpit/tooth-grid';

// Cockpit Components
import { PatientIntakePanel } from './patient-intake-panel';
import { VitalsRecorder } from './vitals-recorder';
import { DiagnosisEngine } from './diagnosis-engine';
import { TreatmentPlanFork } from './treatment-plan-fork';
import { SurgicalSuite } from './surgical-suite';
import { SmartNoteInjector } from './smart-note-injector';
import { PostOpPanel } from './post-op-panel';

// ============================================================================
// PHASE METADATA — Monochrome Indigo
// ============================================================================

const PHASES: { id: CockpitPhase; label: string; icon: React.ReactNode }[] = [
    { id: 'PATIENT_SELECT', label: 'Patient', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'INTAKE', label: 'Intake', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'EXAMINATION', label: 'Examine', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'INVESTIGATION', label: 'Investigate', icon: <Search className="w-4 h-4" /> },
    { id: 'DIAGNOSIS', label: 'Diagnose', icon: <Brain className="w-4 h-4" /> },
    { id: 'TREATMENT_PLAN', label: 'Plan', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'EXECUTION', label: 'Execute', icon: <Play className="w-4 h-4" /> },
    { id: 'POST_OP', label: 'Post-Op', icon: <CheckCircle2 className="w-4 h-4" /> },
];

const PHASE_ORDER: CockpitPhase[] = PHASES.map(p => p.id);

// ============================================================================
// PHASE PROGRESS BAR — Clean monochrome stepper
// ============================================================================

function PhaseProgressBar() {
    const phase = useCockpitStore(s => s.phase);
    const setPhase = useCockpitStore(s => s.setPhase);
    const currentIndex = PHASE_ORDER.indexOf(phase);

    return (
        <div className="flex items-center gap-1 p-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm">
            {PHASES.map((p, i) => {
                const isActive = p.id === phase;
                const isPast = i < currentIndex;
                const isFuture = i > currentIndex;

                return (
                    <React.Fragment key={p.id}>
                        <button
                            onClick={() => isPast && setPhase(p.id)}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[40px]',
                                isActive && 'bg-clinical-action text-white shadow-md ring-2 ring-clinical-action/20',
                                isPast && 'bg-emerald-50 text-emerald-700 cursor-pointer hover:bg-emerald-100',
                                isFuture && 'bg-slate-50 text-slate-400 cursor-not-allowed'
                            )}
                            disabled={isFuture}
                        >
                            {isPast ? <CheckCircle2 className="w-3.5 h-3.5 text-clinical-complete" /> : p.icon}
                            <span className="hidden lg:inline">{p.label}</span>
                        </button>
                        {/* Connector line between steps */}
                        {i < PHASES.length - 1 && (
                            <div className={cn(
                                'hidden lg:block w-4 h-0.5 rounded-full flex-shrink-0',
                                i < currentIndex ? 'bg-clinical-complete' : 'bg-slate-200'
                            )} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

// ============================================================================
// RISK BANNER — Clean, no framer-motion
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

    const riskColor = clinicalRiskScore > 70
        ? 'border-l-red-500 bg-red-50'
        : clinicalRiskScore > 40
            ? 'border-l-clinical-risk bg-amber-50'
            : 'border-l-clinical-action bg-indigo-50/50';

    return (
        <div className={cn('rounded-xl border border-slate-200/60 border-l-4 p-3 mb-4', riskColor)}>
            <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-clinical-risk" />
                <span className="font-semibold text-sm text-slate-900">
                    Clinical Risk Alerts
                </span>
                <Badge
                    variant="outline"
                    className={cn(
                        'text-[10px] ml-auto font-bold',
                        clinicalRiskScore > 70 ? 'text-red-600 border-red-300' :
                            clinicalRiskScore > 40 ? 'text-clinical-risk border-amber-300' :
                                'text-clinical-action border-indigo-300'
                    )}
                >
                    Risk Score: {clinicalRiskScore}%
                </Badge>
            </div>
            <div className="space-y-1">
                {allAlerts.map((alert, i) => (
                    <p key={i} className="text-xs text-slate-700">
                        {alert}
                    </p>
                ))}
            </div>
        </div>
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
        showMilestones && { label: 'Pediatric', color: 'bg-sky-50 text-sky-700 border-sky-200', icon: <Baby className="w-3 h-3" /> },
        showMaternity && { label: 'Maternity', color: 'bg-pink-50 text-pink-700 border-pink-200', icon: <Heart className="w-3 h-3" /> },
        showWARS && { label: 'WARS', color: 'bg-amber-50 text-clinical-risk border-amber-200', icon: <Shield className="w-3 h-3" /> },
        showPAE && { label: 'PAE', color: 'bg-red-50 text-red-700 border-red-200', icon: <Activity className="w-3 h-3" /> },
        showOrthoAnalysis && { label: 'Ortho', color: 'bg-violet-50 text-violet-700 border-violet-200', icon: <GitBranch className="w-3 h-3" /> },
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
// PATIENT HEADER — Bento-Glass, no gradients
// ============================================================================

function PatientHeader() {
    const patient = useCockpitStore(s => s.patient);
    const visitId = useCockpitStore(s => s.visitId);
    const clearSession = useCockpitStore(s => s.clearSession);

    if (!patient) return null;

    return (
        <div className="flex items-center justify-between p-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-clinical-action flex items-center justify-center text-white font-bold text-sm">
                    {patient.name.charAt(0)}
                </div>
                <div>
                    <h3 className="font-semibold text-sm text-slate-900">{patient.name}</h3>
                    <p className="text-[11px] text-slate-500">
                        {patient.age}y / {patient.gender} · {patient.phone}
                        {patient.bloodGroup && ` · ${patient.bloodGroup}`}
                    </p>
                </div>
                <Badge variant="outline" className="text-[10px] ml-2 bg-white text-slate-500 border-slate-200">
                    Visit: {visitId?.slice(-6)}
                </Badge>
            </div>
            <div className="flex items-center gap-2">
                <ConditionalModuleBadges />
                <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSession}
                    className="text-xs text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 h-10 rounded-xl transition-colors"
                >
                    End Session
                </Button>
            </div>
        </div>
    );
}

// ============================================================================
// PHASE RENDERERS — No AnimatePresence, CSS transitions only
// ============================================================================

function PhaseContent() {
    const phase = useCockpitStore(s => s.phase);
    const patient = useCockpitStore(s => s.patient);

    return (
        <div className="flex-1 animate-in fade-in duration-200">
            {phase === 'PATIENT_SELECT' && <PatientSelectPhase />}
            {phase === 'INTAKE' && patient && <PatientIntakePanel />}
            {phase === 'EXAMINATION' && patient && <ExaminationPhase />}
            {phase === 'INVESTIGATION' && patient && <InvestigationPhase />}
            {phase === 'DIAGNOSIS' && patient && <DiagnosisPhase />}
            {phase === 'TREATMENT_PLAN' && patient && <TreatmentPlanFork />}
            {phase === 'EXECUTION' && patient && <ExecutionPhase />}
            {phase === 'POST_OP' && patient && <PostOpPhase />}
        </div>
    );
}

// Patient Select Phase — Clean empty state
function PatientSelectPhase() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-clinical-action flex items-center justify-center mb-6 shadow-md">
                <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                Select a Patient
            </h2>
            <p className="text-sm text-slate-500 mb-6 max-w-md">
                Select a patient from today&apos;s appointments or search by name/phone to begin the clinical session.
            </p>
            <div className="text-xs text-slate-500 bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-3 max-w-sm">
                💡 <strong>Tip:</strong> Click any patient in the Appointment Queue to auto-load their case sheet with pre-filled history.
            </div>
        </div>
    );
}

// Examination Phase — Vitals + Tooth Grid + Conditional Modules
import { DentitionChart } from '@/components/clinical/tooth-chart';
import { getDentitionMode } from '@/types/clinical';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

function ExaminationPhase() {
    const patient = useCockpitStore(s => s.patient);
    const showMaternity = useCockpitStore(s => s.showMaternity);
    const showMilestones = useCockpitStore(s => s.showMilestones);
    const toothState = useCockpitStore(s => s.toothState);
    const setToothState = useCockpitStore(s => s.setToothState);
    const [isChartOpen, setIsChartOpen] = React.useState(false);

    return (
        <div className="space-y-6">
            <VitalsRecorder type="PRE_OP" />

            {/* FDI Digital Twin Trigger */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white flex items-center justify-between shadow-xl relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.01]" onClick={() => setIsChartOpen(true)}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                        <UserRound className="w-6 h-6 text-indigo-300" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg tracking-tight">FDI Digital Twin</h3>
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Interactive 3D Charting</p>
                    </div>
                </div>

                <Button
                    variant="secondary"
                    className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] items-center gap-2 hidden sm:flex bg-white text-slate-900 border-none hover:bg-indigo-50"
                >
                    Open Chart <ChevronRight className="w-3 h-3" />
                </Button>
            </div>

            <Dialog open={isChartOpen} onOpenChange={setIsChartOpen}>
                <DialogContent className="max-w-[95vw] h-[90vh] rounded-[3rem] p-0 border-none bg-slate-50/95 backdrop-blur-3xl overflow-hidden shadow-2xl">
                    <div className="h-full flex flex-col">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white/50">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">FDI Digital Twin</h2>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Interactive Dental Charting • {patient?.name}</p>
                            </div>
                            <Button variant="ghost" className="h-12 w-12 rounded-full bg-slate-100 hover:bg-slate-200" onClick={() => setIsChartOpen(false)}>
                                <ChevronRight className="w-6 h-6 text-slate-600 rotate-90" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 flex items-center justify-center">
                            <div className="scale-110 lg:scale-125 origin-top">
                                <DentitionChart
                                    data={toothState}
                                    onChange={setToothState}
                                    mode={getDentitionMode(patient?.age ?? 30)}
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-white border-t border-slate-200 flex justify-end gap-4">
                            <Button variant="outline" className="h-14 rounded-2xl px-8 font-bold text-slate-500 border-slate-200 hover:bg-slate-50" onClick={() => setIsChartOpen(false)}>CANCEL</Button>
                            <Button className="h-14 rounded-2xl px-8 font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-xl" onClick={() => setIsChartOpen(false)}>SAVE & CLOSE</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {patient && <ClinicalConsultation patientId={patient.id} />}
            <AdvancedIntake />
            {showMaternity && <MaternityModule />}
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
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                        <Search className="w-4 h-4 text-clinical-action" /> IOPA Exposures
                    </h3>
                    <Badge variant="outline" className="text-clinical-action border-indigo-200 font-bold text-[10px]">
                        {iopaCount} exposures → auto-billed
                    </Badge>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        size="sm"
                        onClick={incrementIOPA}
                        className="bg-clinical-action hover:bg-indigo-700 text-white h-10 rounded-xl px-4 font-semibold"
                    >
                        + Add IOPA
                    </Button>
                    <p className="text-xs text-slate-500">
                        Each exposure is automatically added to the billing ledger.
                    </p>
                </div>
            </div>

            {/* Media Gallery */}
            {patient && <ClinicalMediaVault />}
        </div>
    );
}

// Diagnosis Phase — AI + ICD-10 + Ortho
function DiagnosisPhase() {
    return (
        <div className="space-y-6">
            <AIProvisionalDiagnosis />
            <DiagnosisEngine />
            {(useCockpitStore.getState().showOrthoAnalysis) && (
                <OrthoAnalysis />
            )}
        </div>
    );
}

// Execution Phase
function ExecutionPhase() {
    return (
        <div className="space-y-6">
            <SurgicalSuite />
            <SmartNoteInjector />
        </div>
    );
}

// Post-Op Phase
function PostOpPhase() {
    return <PostOpPanel />;
}

// ============================================================================
// CONDITIONAL MODULES — Light-mode only
// ============================================================================

function MaternityModule() {
    const maternity = useCockpitStore(s => s.maternity);
    const setMaternity = useCockpitStore(s => s.setMaternity);

    return (
        <div className="bg-pink-50/50 rounded-2xl border border-pink-200/60 p-4">
            <h4 className="text-sm font-semibold text-pink-800 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" /> Maternity Vault
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-700 min-h-[40px]">
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
                            className="w-full text-xs rounded-lg border-pink-200 bg-white px-2 py-2"
                        >
                            <option value="">Select</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(m => (
                                <option key={m} value={m}>Month {m}</option>
                            ))}
                        </select>
                    </div>
                )}
                {maternity.isPregnant && maternity.trimester && (
                    <Badge variant="outline" className="text-[10px] self-center bg-pink-50 text-pink-700 border-pink-200">
                        Trimester {maternity.trimester}
                    </Badge>
                )}
                <label className="flex items-center gap-2 text-xs text-slate-700 min-h-[40px]">
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
        <div className="bg-sky-50/50 rounded-2xl border border-sky-200/60 p-4">
            <h4 className="text-sm font-semibold text-sky-800 mb-3 flex items-center gap-2">
                <Baby className="w-4 h-4" /> Pediatric Assessment
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white/80 rounded-xl p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Age</p>
                    <p className="text-sm font-semibold text-slate-900">{patient?.age} years</p>
                </div>
                <div className="bg-white/80 rounded-xl p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Dentition Stage</p>
                    <p className="text-sm font-semibold text-slate-900">
                        {patient && patient.age < 6 ? 'Primary' : patient && patient.age < PEDIATRIC_AGE_THRESHOLD ? 'Mixed' : 'Permanent'}
                    </p>
                </div>
                <div className="bg-white/80 rounded-xl p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Suggested Chart</p>
                    <p className="text-sm font-semibold text-slate-900">
                        {patient && patient.age < 6 ? 'Deciduous FDI (51-85)' : 'Permanent FDI (11-48)'}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// NAVIGATION FOOTER — Glove-ready, semantic
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
        <div className="flex items-center justify-between p-3 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm">
            <Button
                variant="outline"
                onClick={prevPhase}
                disabled={isFirst}
                className="text-xs h-12 rounded-xl px-5 font-semibold border-slate-200"
            >
                <ChevronLeft className="w-4 h-4 mr-1.5" /> Previous
            </Button>
            <span className="text-xs text-slate-500 tabular-nums">
                Step {currentIndex + 1} of {PHASE_ORDER.length}: <strong className="text-slate-700">{PHASES[currentIndex]?.label}</strong>
            </span>
            <Button
                onClick={nextPhase}
                disabled={isLast}
                className="text-xs h-12 rounded-xl px-5 font-semibold bg-clinical-action hover:bg-indigo-700 text-white"
            >
                Next <ChevronRight className="w-4 h-4 ml-1.5" />
            </Button>
        </div>
    );
}

// ============================================================================
// MAIN CONTAINER
// ============================================================================

export function CaseSheetContainer() {
    const patient = useCockpitStore(s => s.patient);
    const selectPatient = useCockpitStore(s => s.selectPatient);

    // No-Patient Guard: Show inline patient selection
    if (!patient) {
        return (
            <div className="flex flex-col gap-6 h-full items-center justify-center py-12 px-6">
                <div className="text-center space-y-2 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                        <UserRound className="w-8 h-8 text-clinical-action" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Select a Patient</h2>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                        Choose a patient from the active queue below to begin the clinical workflow.
                    </p>
                </div>
                <div className="w-full max-w-2xl">
                    <CaseQueue onSelectPatient={(p) => {
                        selectPatient({
                            id: p.id,
                            name: p.name,
                            age: 30,
                            gender: 'MALE',
                            phone: '',
                            isRegistered: true,
                        });
                    }} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 h-full pb-[var(--dock-mobile-height)] md:pb-0">
            {/* Phase Progress Bar */}
            <PhaseProgressBar />

            {/* Patient Header */}
            <PatientHeader />

            {/* Risk Banner */}
            <RiskBanner />

            {/* Pediatric Milestones (Age < threshold or Manual Toggle) */}
            {((patient && patient.age < PEDIATRIC_AGE_THRESHOLD) || useCockpitStore.getState().showMilestones) && (
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
