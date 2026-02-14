
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PermissionGuard } from "@/components/security/permission-guard";
import { Lock, Skull, Syringe, Activity, FileText } from "lucide-react";

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
                    <h2 className="text-5xl lg:text-7xl font-sans font-black tracking-tighter text-slate-900">
                        {selectedPatient ? "Cockpit" : "Select Patient"}
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
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
                        {/* Bento Metrics Cell */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                    <Activity className="w-32 h-32" />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Clinic Pulse</p>
                                        <h3 className="text-3xl font-black tracking-tight">System Optimal</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-200">Active</p>
                                            <p className="text-2xl font-black">12</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-200">Completed</p>
                                            <p className="text-2xl font-black">48</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-emerald-400/20 text-emerald-300 border-none px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        98% Efficiency
                                    </Badge>
                                </div>
                            </Card>

                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-6 bg-white rounded-[2.5rem] border-slate-100 shadow-sm transition-all hover:shadow-md">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Wait Time</p>
                                    <p className="text-3xl font-black text-slate-900">14<span className="text-sm font-bold text-slate-400 ml-1">min</span></p>
                                </Card>
                                <Card className="p-6 bg-white rounded-[2.5rem] border-slate-100 shadow-sm transition-all hover:shadow-md">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Capacity</p>
                                    <p className="text-3xl font-black text-emerald-500">82<span className="text-sm font-bold text-slate-400 ml-1">%</span></p>
                                </Card>
                            </div>

                            <Card className="p-8 bg-slate-900 text-white rounded-[3rem] space-y-6 shadow-2xl relative overflow-hidden group">
                                <div className="absolute -right-8 -top-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                                    <Activity className="w-48 h-48" />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 relative z-10">Queue Analytics</h3>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400">Emergencies</span>
                                        <Badge className="bg-rose-500/20 text-rose-500 border-none">02</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400">Standard</span>
                                        <span className="text-xl font-black">12</span>
                                    </div>
                                </div>
                                <Button className="w-full bg-white/10 hover:bg-white/20 border-white/10 rounded-2xl text-[10px] uppercase font-black tracking-widest h-14 backdrop-blur-md">
                                    Optimize Flow
                                </Button>
                            </Card>
                        </div>

                        {/* Main Case Feed Cell */}
                        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[3.5rem] shadow-xl p-8 lg:p-12 transition-all hover:shadow-2xl overflow-hidden flex flex-col cursor-pointer group" onClick={handleSelectPatient}>
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-2xl font-black tracking-tight text-slate-900">Live Case Feed</h3>
                                <Badge variant="outline" className="rounded-full px-4 h-8 font-black text-[10px] uppercase tracking-widest border-slate-100">3 ACTIVE</Badge>
                            </div>
                            <div className="flex-1 space-y-4">
                                <CaseQueue onSelectPatient={setSelectedPatient} />
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-50 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500 animate-pulse">Click list to activate cockpit</p>
                            </div>
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
