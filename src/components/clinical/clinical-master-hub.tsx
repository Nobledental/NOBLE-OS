
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PermissionGuard } from "@/components/security/permission-guard";
import { Lock, Skull, Syringe, Activity, FileText, Clock, Calendar, Phone, Package, CheckCircle2 } from "lucide-react";
import { useCockpitStore, type PatientContext } from "@/lib/clinical-cockpit-store";

// Clinical Specialties & Components
import { CaseQueue } from "@/components/clinical/case-queue";
import { DentitionChart } from "@/components/clinical/tooth-chart";
import { getDentitionMode } from "@/types/clinical";
import CaseSheetRenderer from "@/components/clinical/case-sheet-renderer";
import PrescriptionEngine from "@/components/clinical/prescription-engine";
import { SurgeryNote } from "@/components/clinical/surgery-note";
import { IntraOralCamera } from "@/components/clinical/intra-oral-camera";
import { LabTracker } from "@/components/clinical/lab-tracker";
import NobleSmileStudio from "@/components/clinical/noble-smile-studio";
import UniversalBridgeHub from "@/components/clinical/universal-bridge-hub";
import NobleSharePortal from "@/components/clinical/noble-share-portal";

// Phase 73 Components
import { PatientClinicalProfile } from "@/components/clinical/patient-clinical-profile";
import { MedicalHistoryDetails } from "@/components/clinical/medical-history-details";
import { TreatmentRoadmap } from "@/components/clinical/treatment-roadmap";

// Phase 74 Components
import { ClinicalMediaGallery } from "@/components/clinical/clinical-media-gallery";
import { RadiologyReportGen } from "@/components/clinical/radiology-report-gen";

export function ClinicalMasterHub() {
    const selectCockpitPatient = useCockpitStore(s => s.selectPatient);
    const clearSession = useCockpitStore(s => s.clearSession);
    const cockpitPatient = useCockpitStore(s => s.patient);

    // Bridge: CaseQueue patient click → cockpit store
    const handleSelectPatient = (queuePatient: { id: string; name: string; uhid: string }) => {
        const patient: PatientContext = {
            id: queuePatient.id,
            name: queuePatient.name,
            age: 30, // Will be enriched when API data is available
            gender: 'MALE',
            phone: '',
            isRegistered: true,
        };
        selectCockpitPatient(patient);
    };

    // Use cockpit patient for selected state (synced)
    const selectedPatient = cockpitPatient ? {
        id: cockpitPatient.id,
        name: cockpitPatient.name,
        uhid: `NH-${cockpitPatient.id.slice(-6).toUpperCase()}`
    } : null;

    return (
        <div className="flex-1 space-y-6 min-h-screen flex flex-col p-4 lg:p-8 bg-white">
            {/* Dynamic Header */}
            <div className="flex items-center justify-between shrink-0 max-w-7xl mx-auto w-full">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-sans font-extrabold tracking-tight text-slate-900">
                        {selectedPatient ? "Cockpit" : "Command Center"}
                        <span className="text-clinical-action">.</span>
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-1 flex items-center gap-2">
                        <Activity className="w-3 h-3 text-clinical-action" />
                        {selectedPatient ? `Live Record: ${selectedPatient.uhid}` : "Choose from active case queue below"}
                    </p>
                </div>
                {selectedPatient && (
                    <Button
                        variant="outline"
                        className="rounded-2xl border-slate-200 h-12 px-8 font-bold text-[11px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                        onClick={() => clearSession()}
                    >
                        Close Session
                    </Button>
                )}
            </div>

            <PermissionGuard permission="can_view_clinical">
                {!selectedPatient ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">
                        {/* LEFT COLUMN: COMMAND CENTER WIDGETS */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* 1. CLINICAL RADAR — Bento-Glass */}
                            <Card className="p-6 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-clinical-action mb-1">Clinical Radar</p>
                                        <h3 className="text-xl font-extrabold tracking-tight text-slate-900">System Optimal</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clinical-complete opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-clinical-complete"></span>
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">On Duty</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/80 border border-amber-100 hover:bg-amber-50 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-clinical-risk">
                                                <Activity className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">Medical Alerts</p>
                                                <p className="text-[10px] text-slate-500">High Risk (HTN/Diabetic)</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-clinical-risk text-white border-none text-xs font-bold">02</Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">In-Chair Wait</p>
                                                <p className="text-[10px] text-slate-500">Exceeding 15 mins</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="border-slate-200 text-slate-600 text-xs font-bold">1</Badge>
                                    </div>
                                </div>
                            </Card>

                            {/* 2. APPOINTMENT HORIZON */}
                            <Card className="p-6 rounded-2xl bg-white/95 border border-slate-200/60 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Schedule Horizon</p>
                                        <h3 className="text-lg font-extrabold tracking-tight text-slate-900">Patient Flow</h3>
                                    </div>
                                    <Badge variant="outline" className="rounded-full border-slate-200 text-slate-500 font-bold px-3 py-1 text-[10px] uppercase">
                                        4 Remaining
                                    </Badge>
                                </div>

                                <div className="space-y-4 relative">
                                    {/* Timeline Line */}
                                    <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100" />

                                    {/* Past Appt */}
                                    <div className="relative flex items-center gap-4 opacity-50">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center z-10">
                                            <CheckCircle2 className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 line-through">Arjun Kapoor</p>
                                            <p className="text-[10px] font-bold text-slate-400">10:00 AM • Gen. Checkup</p>
                                        </div>
                                    </div>

                                    {/* Current/Next Appt */}
                                    <div className="relative flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-clinical-action border-4 border-indigo-50 flex items-center justify-center z-10 shadow-md">
                                            <Clock className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-extrabold text-slate-900">Sarah Jenkins</p>
                                            <p className="text-[10px] font-bold text-clinical-action uppercase tracking-wider">11:30 AM • Root Canal (Active)</p>
                                        </div>
                                    </div>

                                    {/* Future Appt */}
                                    <div className="relative flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center z-10">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">Michael Ross</p>
                                            <p className="text-[10px] font-bold text-slate-400">02:00 PM • Aligners</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* 3. CLINICAL INTELLIGENCE */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 hover:bg-indigo-50 transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mb-3">
                                        <Package className="w-5 h-5 text-clinical-action" />
                                    </div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-clinical-action mb-1">Lab Works</p>
                                    <p className="text-2xl font-extrabold text-slate-900 tabular-nums">02</p>
                                    <p className="text-[10px] font-bold text-slate-500 mt-1">Arriving Today</p>
                                </Card>

                                <Card className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:bg-emerald-50 transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                                        <Phone className="w-5 h-5 text-clinical-complete" />
                                    </div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-clinical-complete mb-1">Follow-ups</p>
                                    <p className="text-2xl font-extrabold text-slate-900 tabular-nums">05</p>
                                    <p className="text-[10px] font-bold text-slate-500 mt-1">Post-op Calls</p>
                                </Card>
                            </div>

                            {/* 4. QUICK ACTIONS */}
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="h-16 rounded-2xl border-slate-200 hover:border-clinical-action/30 hover:bg-indigo-50/50 flex flex-col gap-2 items-center justify-center transition-colors">
                                    <FileText className="w-5 h-5 text-clinical-action" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">My Reports</span>
                                </Button>
                                <Button variant="outline" className="h-16 rounded-2xl border-slate-200 hover:border-clinical-risk/30 hover:bg-amber-50/50 flex flex-col gap-2 items-center justify-center transition-colors">
                                    <Syringe className="w-5 h-5 text-clinical-risk" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Protocols</span>
                                </Button>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: ACTIVE CASE QUEUE */}
                        <div className="lg:col-span-8">
                            <Card className="bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-sm rounded-2xl p-6 lg:p-8 h-full min-h-[600px] flex flex-col relative overflow-hidden">

                                {/* Header */}
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-clinical-action">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-extrabold tracking-tight text-slate-900">Active Live Feed</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Real-time Patient Flow</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge className="h-8 rounded-full px-4 bg-clinical-action text-white font-bold text-[10px] uppercase tracking-widest">
                                            3 Waiting
                                        </Badge>
                                        <Badge variant="outline" className="h-8 rounded-full px-4 border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                            1 In-Chair
                                        </Badge>
                                    </div>
                                </div>

                                {/* Queue Component */}
                                <div className="flex-1 -mx-4 px-4 overflow-y-auto relative z-10">
                                    <CaseQueue onSelectPatient={handleSelectPatient} />
                                </div>

                                {/* Fade-out at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col gap-6 max-w-7xl mx-auto w-full pb-20">
                        {/* 1. Patient Profile Quick-View */}
                        <PatientClinicalProfile
                            patientId={selectedPatient.id}
                            patientName={selectedPatient.name}
                            uhid={selectedPatient.uhid}
                        />

                        {/* 2. Main Workflow Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Left Sidebar: Visual Reference (FDI Map) */}
                            <div className="lg:col-span-4 border border-slate-200/60 rounded-2xl bg-white/95 backdrop-blur-xl shadow-sm p-6 lg:p-8 flex flex-col sticky top-10 transition-shadow hover:shadow-md">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-3">
                                    <Skull className="w-5 h-5 text-clinical-action" /> FDI Digital Twin
                                </h3>
                                <div className="flex items-center justify-center py-6">
                                    <div className="scale-110 cursor-crosshair">
                                        <DentitionChart
                                            data={useCockpitStore.getState().toothState}
                                            onChange={useCockpitStore.getState().setToothState}
                                            mode={getDentitionMode(cockpitPatient?.age ?? 30)}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 text-center">Quick Actions</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" className="rounded-xl h-12 text-[10px] font-bold border-slate-200 hover:bg-clinical-action hover:text-white hover:border-clinical-action transition-all">RESTORE</Button>
                                        <Button variant="outline" className="rounded-xl h-12 text-[10px] font-bold border-slate-200 hover:bg-clinical-action hover:text-white hover:border-clinical-action transition-all">EXTRACT</Button>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Integrated Department Hub */}
                            <div className="lg:col-span-8 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden transition-shadow hover:shadow-md">
                                <Tabs defaultValue="sheets" className="flex-1 flex flex-col">
                                    <div className="px-6 lg:px-8 py-4 border-b border-slate-100 bg-slate-50/50">
                                        <TabsList className="bg-transparent gap-2 h-auto p-0 flex flex-nowrap overflow-x-auto">
                                            <TabsTrigger value="sheets" className="rounded-xl px-4 py-2.5 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-clinical-action data-[state=active]:text-white shadow-sm transition-all">Clinical Notes</TabsTrigger>
                                            <TabsTrigger value="medical" className="rounded-xl px-4 py-2.5 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-clinical-action data-[state=active]:text-white shadow-sm transition-all">History</TabsTrigger>
                                            <TabsTrigger value="roadmap" className="rounded-xl px-4 py-2.5 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-clinical-action data-[state=active]:text-white shadow-sm transition-all">Roadmap</TabsTrigger>
                                            <TabsTrigger value="rx" className="rounded-xl px-4 py-2.5 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-clinical-risk data-[state=active]:text-white text-clinical-risk shadow-sm transition-all">Rx Box</TabsTrigger>
                                            <TabsTrigger value="specialties" className="rounded-xl px-4 py-2.5 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-clinical-action data-[state=active]:text-white shadow-sm transition-all">Lab/Smile</TabsTrigger>
                                            <TabsTrigger value="imaging" className="rounded-xl px-4 py-2.5 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-clinical-action data-[state=active]:text-white shadow-sm transition-all">Imaging</TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <div className="flex-1 p-6 lg:p-8">
                                        <TabsContent value="sheets" className="mt-0">
                                            <CaseSheetRenderer patientId={selectedPatient.id} />
                                        </TabsContent>

                                        <TabsContent value="medical" className="mt-0">
                                            <MedicalHistoryDetails onBack={() => { }} />
                                        </TabsContent>

                                        <TabsContent value="roadmap" className="mt-0">
                                            <TreatmentRoadmap />
                                        </TabsContent>

                                        <TabsContent value="rx" className="mt-0 space-y-8 pb-20">
                                            <div className="space-y-8">
                                                <PrescriptionEngine patientId={selectedPatient.id} />
                                                <SurgeryNote patientId={selectedPatient.id} />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="specialties" className="mt-0">
                                            <Tabs defaultValue="lab" className="w-full">
                                                <TabsList className="mb-6 bg-slate-50 p-1 rounded-xl border border-slate-100">
                                                    <TabsTrigger value="lab" className="rounded-lg text-[10px] uppercase font-bold px-4 py-2.5 data-[state=active]:bg-clinical-action data-[state=active]:text-white">Digital Lab</TabsTrigger>
                                                    <TabsTrigger value="smile" className="rounded-lg text-[10px] uppercase font-bold px-4 py-2.5 data-[state=active]:bg-clinical-action data-[state=active]:text-white">Smile Studio</TabsTrigger>
                                                    <TabsTrigger value="share" className="rounded-lg text-[10px] uppercase font-bold px-4 py-2.5 data-[state=active]:bg-clinical-action data-[state=active]:text-white">Noble Share</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="lab">
                                                    <LabTracker />
                                                </TabsContent>
                                                <TabsContent value="smile">
                                                    <NobleSmileStudio />
                                                </TabsContent>
                                                <TabsContent value="share">
                                                    <NobleSharePortal />
                                                </TabsContent>
                                            </Tabs>
                                        </TabsContent>

                                        <TabsContent value="imaging" className="mt-0 h-full">
                                            <Tabs defaultValue="gallery" className="w-full flex flex-col h-full">
                                                <div className="flex items-center justify-between mb-6">
                                                    <TabsList className="bg-slate-50 p-1 rounded-xl border border-slate-100">
                                                        <TabsTrigger value="gallery" className="rounded-lg text-[10px] uppercase font-bold px-4 py-2.5 data-[state=active]:bg-clinical-action data-[state=active]:text-white">Media Hub</TabsTrigger>
                                                        <TabsTrigger value="radiology" className="rounded-lg text-[10px] uppercase font-bold px-4 py-2.5 data-[state=active]:bg-clinical-action data-[state=active]:text-white">AI Diagnostics</TabsTrigger>
                                                        <TabsTrigger value="bridge" className="rounded-lg text-[10px] uppercase font-bold px-4 py-2.5 data-[state=active]:bg-clinical-action data-[state=active]:text-white">IoT Cloud</TabsTrigger>
                                                    </TabsList>
                                                </div>

                                                <TabsContent value="gallery" className="mt-0 flex-1">
                                                    <ClinicalMediaGallery />
                                                </TabsContent>

                                                <TabsContent value="radiology" className="mt-0 flex-1">
                                                    <RadiologyReportGen />
                                                </TabsContent>

                                                <TabsContent value="bridge" className="mt-0 flex-1">
                                                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
                                                        <div className="xl:col-span-3 min-h-[600px]">
                                                            <IntraOralCamera patientId={selectedPatient.id} />
                                                        </div>
                                                        <div className="xl:col-span-1">
                                                            <UniversalBridgeHub />
                                                        </div>
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                )}
            </PermissionGuard>
        </div>
    );
}
