
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PermissionGuard } from "@/components/security/permission-guard";
import { Lock, Skull, Syringe, Activity, FileText, Clock } from "lucide-react";

// Clinical Specialties & Components
import { CaseQueue } from "@/components/clinical/case-queue";
// ABHA Card removed
import { UniversalToothChart } from "@/components/clinical/universal-tooth-chart";
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
    const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string; uhid: string } | null>(null);

    const handleSelectPatient = () => {
        setSelectedPatient({ id: "p123", name: "Dhivakaran R", uhid: "NH-102938" });
    };

    return (
        <div className="flex-1 space-y-8 min-h-screen flex flex-col p-4 lg:p-10 animate-ios-reveal bg-[#f8fafc]/50">
            {/* Dynamic Header */}
            <div className="flex items-center justify-between shrink-0 max-w-7xl mx-auto w-full">
                <div>
                    <h2 className="text-3xl lg:text-5xl font-sans font-black tracking-tighter text-slate-900">
                        {selectedPatient ? "Cockpit" : "Command Center"}
                        <span className="text-indigo-600">.</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2 flex items-center gap-2">
                        <Activity className="w-3 h-3 text-indigo-500" />
                        {selectedPatient ? `Live Record: ${selectedPatient.uhid}` : "Choose from active case queue below"}
                    </p>
                </div>
                {selectedPatient && (
                    <Button
                        variant="ghost"
                        className="rounded-full border border-slate-200 h-14 px-8 font-black text-[11px] uppercase tracking-widest hover:bg-white shadow-sm transition-all"
                        onClick={() => setSelectedPatient(null)}
                    >
                        Close Session
                    </Button>
                )}
            </div>

            <PermissionGuard permission="can_view_clinical">
                {!selectedPatient ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full">
                        {/* LEFT COLUMN: COMMAND CENTER WIDGETS */}
                        <div className="lg:col-span-4 space-y-8">

                            {/* 1. CLINICAL RADAR (Status & Alerts) */}
                            <Card className="p-1 rounded-[2.5rem] bg-white/50 border border-slate-100 backdrop-blur-md shadow-sm">
                                <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                                    {/* Radar Animation Effect */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />

                                    <div className="relative z-10 flex flex-col h-full justify-between min-h-[200px]">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Clinical Radar</p>
                                                <h3 className="text-2xl font-black tracking-tight">System Optimal</h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                                </span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest">On Duty</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                                                        <Activity className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">Medical Alerts</p>
                                                        <p className="text-[10px] text-slate-400">High Risk (HTN/Diabetic)</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-rose-500 text-white border-none">02</Badge>
                                            </div>

                                            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                                                        <Clock className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">In-Chair Wait</p>
                                                        <p className="text-[10px] text-slate-400">Exceeding 15 mins</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-amber-500 text-black border-none">1</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* 2. PRODUCTION TARGETS */}
                            <Card className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="relative z-10">
                                    <div className="flex justify-between items-end mb-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Daily Production</p>
                                            <h3 className="text-3xl font-black text-slate-900">₹12,450</h3>
                                        </div>
                                        <Badge variant="outline" className="rounded-full border-emerald-200 text-emerald-700 bg-emerald-50 font-bold px-3 py-1 text-[10px] uppercase">
                                            24% of Goal
                                        </Badge>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[24%]" />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <span>₹0</span>
                                        <span>Target: ₹50k</span>
                                    </div>
                                </div>
                            </Card>

                            {/* 3. QUICK ACTIONS */}
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="h-20 rounded-[2rem] border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex flex-col gap-2 items-center justify-center">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">My Reports</span>
                                </Button>
                                <Button variant="outline" className="h-20 rounded-[2rem] border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex flex-col gap-2 items-center justify-center">
                                    <Syringe className="w-5 h-5 text-rose-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Protocols</span>
                                </Button>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: ACTIVE CASE QUEUE */}
                        <div className="lg:col-span-8">
                            <Card className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-[3rem] p-8 lg:p-10 h-full min-h-[600px] flex flex-col relative overflow-hidden">

                                {/* Header */}
                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                            <Activity className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight text-slate-900">Active Live Feed</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Real-time Patient Flow</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge className="h-8 rounded-full px-4 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest">
                                            3 Waiting
                                        </Badge>
                                        <Badge variant="outline" className="h-8 rounded-full px-4 border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                            1 In-Chair
                                        </Badge>
                                    </div>
                                </div>

                                {/* Queue Component */}
                                <div className="flex-1 -mx-4 px-4 overflow-y-auto custom-scrollbar relative z-10">
                                    <CaseQueue onSelectPatient={setSelectedPatient} />
                                </div>

                                {/* Bottom Design Element */}
                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col gap-10 max-w-7xl mx-auto w-full pb-20">
                        {/* 1. Patient Profile Quick-View */}
                        <PatientClinicalProfile
                            patientId={selectedPatient.id}
                            patientName={selectedPatient.name}
                            uhid={selectedPatient.uhid}
                        />

                        {/* 2. Main Workflow Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left Sidebar: Visual Reference (FDI Map) */}
                            <div className="lg:col-span-4 border border-slate-100 rounded-[3.5rem] bg-white shadow-xl p-10 flex flex-col sticky top-10 transition-all hover:shadow-2xl">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10 flex items-center gap-3">
                                    <Skull className="w-5 h-5 text-indigo-500" /> FDI Digital Twin
                                </h3>
                                <div className="flex items-center justify-center py-10">
                                    <div className="scale-125 transition-transform hover:scale-130 cursor-crosshair">
                                        <UniversalToothChart mode="MIXED" className="border-none shadow-none p-0 bg-transparent" />
                                    </div>
                                </div>

                                <div className="mt-10 pt-10 border-t border-slate-50 space-y-6">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Standard Intelligence</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button variant="outline" className="rounded-2xl h-14 text-[10px] font-black border-slate-100 hover:bg-slate-900 hover:text-white transition-all">RESTORE</Button>
                                        <Button variant="outline" className="rounded-2xl h-14 text-[10px] font-black border-slate-100 hover:bg-slate-900 hover:text-white transition-all">EXTRACT</Button>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Integrated Department Hub */}
                            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[3.5rem] shadow-xl flex flex-col overflow-hidden relative transition-all hover:shadow-2xl">
                                <Tabs defaultValue="sheets" className="flex-1 flex flex-col">
                                    <div className="px-10 py-6 border-b border-slate-50 bg-[#fbfcfd]">
                                        <TabsList className="bg-transparent gap-4 h-auto p-0 flex flex-nowrap overflow-x-auto scrollbar-hide">
                                            <TabsTrigger value="sheets" className="rounded-full px-6 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white shadow-sm transition-all">Clinical Notes</TabsTrigger>
                                            <TabsTrigger value="medical" className="rounded-full px-6 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white shadow-sm transition-all">History</TabsTrigger>
                                            <TabsTrigger value="roadmap" className="rounded-full px-6 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white shadow-sm transition-all">Roadmap</TabsTrigger>
                                            <TabsTrigger value="rx" className="rounded-full px-6 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-rose-600 data-[state=active]:text-white text-rose-600 shadow-sm transition-all border-rose-100">Rx Box</TabsTrigger>
                                            <TabsTrigger value="specialties" className="rounded-full px-6 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white shadow-sm transition-all">Lab/Smile</TabsTrigger>
                                            <TabsTrigger value="imaging" className="rounded-full px-6 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white shadow-sm transition-all">Imaging</TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <div className="flex-1 p-10 custom-scrollbar">
                                        <TabsContent value="sheets" className="mt-0">
                                            <CaseSheetRenderer patientId={selectedPatient.id} />
                                        </TabsContent>

                                        <TabsContent value="medical" className="mt-0">
                                            <MedicalHistoryDetails onBack={() => { }} />
                                        </TabsContent>

                                        <TabsContent value="roadmap" className="mt-0">
                                            <TreatmentRoadmap />
                                        </TabsContent>

                                        <TabsContent value="rx" className="mt-0 space-y-12 pb-20">
                                            <div className="gap-10 space-y-10">
                                                <PrescriptionEngine patientId={selectedPatient.id} />
                                                <SurgeryNote patientId={selectedPatient.id} />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="specialties" className="mt-0">
                                            <Tabs defaultValue="lab" className="w-full">
                                                <TabsList className="mb-10 bg-slate-50 p-1.5 rounded-3xl border border-slate-100">
                                                    <TabsTrigger value="lab" className="rounded-2xl text-[10px] uppercase font-black px-6 py-3">Digital Lab</TabsTrigger>
                                                    <TabsTrigger value="smile" className="rounded-2xl text-[10px] uppercase font-black px-6 py-3">Smile Studio</TabsTrigger>
                                                    <TabsTrigger value="share" className="rounded-2xl text-[10px] uppercase font-black px-6 py-3">Noble Share</TabsTrigger>
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
                                                <div className="flex items-center justify-between mb-10">
                                                    <TabsList className="bg-slate-50 p-1.5 rounded-3xl border border-slate-100">
                                                        <TabsTrigger value="gallery" className="rounded-2xl text-[10px] uppercase font-black px-6 py-3">Media Hub</TabsTrigger>
                                                        <TabsTrigger value="radiology" className="rounded-2xl text-[10px] uppercase font-black px-6 py-3">AI Diagnostics</TabsTrigger>
                                                        <TabsTrigger value="bridge" className="rounded-2xl text-[10px] uppercase font-black px-6 py-3">IoT Cloud</TabsTrigger>
                                                    </TabsList>
                                                </div>

                                                <TabsContent value="gallery" className="mt-0 flex-1">
                                                    <ClinicalMediaGallery />
                                                </TabsContent>

                                                <TabsContent value="radiology" className="mt-0 flex-1">
                                                    <RadiologyReportGen />
                                                </TabsContent>

                                                <TabsContent value="bridge" className="mt-0 flex-1">
                                                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 h-full">
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
