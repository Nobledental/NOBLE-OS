"use client";

import { useState } from "react";
import { ActiveQueue } from "./active-queue";
import { PatientTracker } from "./patient-tracker";
import { PanzeCard } from "@/components/ui/panze-card";
import {
    Stethoscope,
    ClipboardList,
    Clock,
    UserCheck,
    HeartPulse,
    ArrowLeft,
    AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CaseSheetContainer } from "@/components/clinical/cockpit/case-sheet-container";
import { useCockpitStore, type PatientContext } from "@/lib/clinical-cockpit-store";

export function DoctorDashboardView({ startInCockpit = false }: { startInCockpit?: boolean }) {
    const [cockpitOpen, setCockpitOpen] = useState(startInCockpit);
    const selectPatient = useCockpitStore(s => s.selectPatient);
    const clearSession = useCockpitStore(s => s.clearSession);
    const cockpitPatient = useCockpitStore(s => s.patient);

    // Bridge: queue patient click → cockpit
    const handlePatientSelect = (queuePatient: {
        id: string;
        name: string;
        age?: number;
        gender?: string;
        phone?: string;
    }) => {
        const patient: PatientContext = {
            id: queuePatient.id,
            name: queuePatient.name,
            age: queuePatient.age || 30,
            gender: (queuePatient.gender as 'MALE' | 'FEMALE' | 'OTHER') || 'MALE',
            phone: queuePatient.phone || '',
            isRegistered: true,
        };
        selectPatient(patient);
        setCockpitOpen(true);
    };

    const handleNewSession = () => {
        clearSession();
        setCockpitOpen(true);
    };

    const handleExitCockpit = () => {
        setCockpitOpen(false);
    };

    // ──── Cockpit Mode: Full-screen Clinical Workflow ────
    if (cockpitOpen) {
        return (
            <div className="flex flex-col h-full animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExitCockpit}
                        className="rounded-xl gap-2 text-xs font-bold uppercase tracking-widest border-slate-200 hover:bg-slate-50 h-12"
                    >
                        <ArrowLeft className="w-4 h-4" /> Dashboard
                    </Button>
                    {cockpitPatient && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold px-3 py-1">
                            {cockpitPatient.name} • {cockpitPatient.age}y {cockpitPatient.gender}
                        </Badge>
                    )}
                </div>
                <div className="flex-1 overflow-hidden">
                    <CaseSheetContainer />
                </div>
            </div>
        );
    }

    // ──── Dashboard Mode: Queue-First, Stats Below ────
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
            {/* Main Clinical Focus */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Active Clinical Feed</h2>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-clinical-progress" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Queue</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleNewSession}
                        className="rounded-2xl bg-clinical-action hover:bg-indigo-700 text-white font-bold uppercase text-[10px] tracking-widest px-6 h-12 shadow-md gap-2 transition-colors"
                    >
                        <Stethoscope size={14} /> New Session
                    </Button>
                </div>

                {/* QUEUE FIRST — Information Density Priority */}
                <ActiveQueue onPatientSelect={handlePatientSelect} />

                {/* Stats Below Queue */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={<Stethoscope className="w-5 h-5 text-clinical-action" />}
                        value="12"
                        label="Cases Today"
                    />
                    <StatCard
                        icon={<UserCheck className="w-5 h-5 text-clinical-complete" />}
                        value="08"
                        label="Completed"
                    />
                    <StatCard
                        icon={<Clock className="w-5 h-5 text-slate-500" />}
                        value="45m"
                        label="Avg Session"
                    />
                    <StatCard
                        icon={<HeartPulse className="w-5 h-5 text-clinical-complete" />}
                        value="98%"
                        label="Safety Index"
                    />
                </div>
            </div>

            {/* Sidebar: Clinical Intelligence & Audits */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <PatientTracker />

                {/* NEO Auditor — Bento-Glass (No Dark Block) */}
                <PanzeCard className="relative overflow-hidden border-l-4 border-l-clinical-action">
                    <div className="space-y-5">
                        <h4 className="font-bold tracking-tight text-sm flex items-center gap-2 text-slate-800">
                            <ClipboardList className="w-4 h-4 text-clinical-action" />
                            Clinical Auditor
                        </h4>

                        <div className="space-y-3">
                            <AuditItem
                                title="Lab Report — Suresh"
                                status="URGENT"
                                sub="Missing Working Length for RCT"
                            />
                            <AuditItem
                                title="X-Ray — Priya"
                                status="PENDING"
                                sub="Quality Check required"
                            />
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs uppercase tracking-widest"
                        >
                            View All Discrepancies
                        </Button>
                    </div>
                </PanzeCard>
            </div>
        </div>
    );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <PanzeCard className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 tabular-nums">{value}</span>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
        </PanzeCard>
    );
}

function AuditItem({ title, status, sub }: { title: string; status: string; sub: string }) {
    return (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-clinical-action/30 transition-colors cursor-pointer">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-700">{title}</span>
                <Badge className={cn(
                    "text-[8px] font-bold px-2 py-0.5 rounded uppercase",
                    status === 'URGENT'
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-indigo-100 text-indigo-700 border-indigo-200"
                )}>
                    {status === 'URGENT' && <AlertTriangle className="w-2.5 h-2.5 mr-1" />}
                    {status}
                </Badge>
            </div>
            <p className="text-[10px] font-medium text-slate-500">{sub}</p>
        </div>
    );
}
