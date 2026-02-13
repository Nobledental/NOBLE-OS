
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
import { AbhaCard } from "@/components/patient/abha-card";
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
        // In a real app, this would be triggered by selecting a case from CaseQueue
        setSelectedPatient({ id: "p123", name: "Dhivakaran R", uhid: "NH-102938" });
    };

    return (
        <div className="flex-1 space-y-6 h-[calc(100vh-100px)] flex flex-col p-4 animate-ios-reveal">
            {/* Dynamic Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-4xl lg:text-5xl font-serif italic tracking-tighter text-slate-900">
                        {selectedPatient ? "Clinical Cockpit" : "Case Queue"}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
                        {selectedPatient ? `MANAGING RECORD: ${selectedPatient.uhid}` : "Select a waiting case to begin."}
                    </p>
                </div>
                {selectedPatient && (
                    <Button
                        variant="outline"
                        className="rounded-2xl border-slate-200 h-12 px-6 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50"
                        onClick={() => setSelectedPatient(null)}
                    >
                        Close & Exit Record
                    </Button>
                )}
            </div>

            <PermissionGuard permission="can_view_clinical">
                {!selectedPatient ? (
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 flex-1 overflow-y-auto">
                        <div className="xl:col-span-1 space-y-6">
                            <AbhaCard />
                            <Card className="p-8 bg-slate-900 text-white rounded-[3rem] space-y-6 shadow-2xl relative overflow-hidden">
                                <div className="absolute -right-4 -bottom-4 opacity-10">
                                    <Activity className="w-24 h-24" />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinic Dashboard</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400">Wait Time</span>
                                        <span className="text-xl font-black">14m</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400">Queue Load</span>
                                        <span className="text-xl font-black text-amber-500">HIGH</span>
                                    </div>
                                </div>
                                <Button className="w-full bg-white/10 hover:bg-white/20 border-white/10 rounded-2xl text-[10px] uppercase font-black tracking-widest h-12">
                                    Refresh Queue
                                </Button>
                            </Card>
                        </div>
                        <div className="xl:col-span-3 space-y-8 cursor-pointer" onClick={handleSelectPatient}>
                            <CaseQueue />
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                        {/* 1. Patient Profile Quick-View */}
                        <PatientClinicalProfile
                            patientId={selectedPatient.id}
                            patientName={selectedPatient.name}
                            uhid={selectedPatient.uhid}
                        />

                        {/* 2. Main Workflow Area */}
                        <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-0">
                            {/* Left Sidebar: Visual Reference (FDI Map) */}
                            <div className="xl:col-span-1 border border-slate-100 rounded-[3rem] bg-slate-50/30 p-8 overflow-y-auto flex flex-col">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-3">
                                    <Skull className="w-4 h-4 text-indigo-500" /> FDI Digital Twin
                                </h3>
                                <div className="flex-1 flex items-center justify-center py-10">
                                    <div className="scale-110">
                                        <UniversalToothChart mode="MIXED" className="border-none shadow-none p-0 bg-transparent" />
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-200/50 space-y-4">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Chart Quick-Sync</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline" className="rounded-xl h-10 text-[9px] font-black border-slate-200">RESTORE ALL</Button>
                                        <Button variant="outline" className="rounded-xl h-10 text-[9px] font-black border-slate-200">CLEAR ALL</Button>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Integrated Department Hub */}
                            <div className="xl:col-span-3 bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col overflow-hidden relative">
                                <Tabs defaultValue="sheets" className="flex-1 flex flex-col min-h-0">
                                    <div className="px-8 py-4 border-b border-slate-100 bg-slate-50/50">
                                        <TabsList className="bg-transparent gap-2 h-auto p-0 flex flex-nowrap overflow-x-auto scrollbar-hide">
                                            <TabsTrigger value="sheets" className="rounded-xl px-5 py-2.5 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">Case Sheets</TabsTrigger>
                                            <TabsTrigger value="medical" className="rounded-xl px-5 py-2.5 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">Medical History</TabsTrigger>
                                            <TabsTrigger value="roadmap" className="rounded-xl px-5 py-2.5 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">Treatment RM</TabsTrigger>
                                            <TabsTrigger value="rx" className="rounded-xl px-5 py-2.5 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-rose-600 data-[state=active]:text-white text-rose-600">Rx & Surgery</TabsTrigger>
                                            <TabsTrigger value="specialties" className="rounded-xl px-5 py-2.5 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Specialties</TabsTrigger>
                                            <TabsTrigger value="imaging" className="rounded-xl px-5 py-2.5 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white">Imaging</TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
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
                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                                                <PrescriptionEngine patientId={selectedPatient.id} />
                                                <SurgeryNote patientId={selectedPatient.id} />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="specialties" className="mt-0">
                                            <Tabs defaultValue="lab" className="w-full">
                                                <TabsList className="mb-8 bg-slate-100 p-1 rounded-2xl">
                                                    <TabsTrigger value="lab" className="rounded-xl text-[10px] uppercase font-black">Lab Work</TabsTrigger>
                                                    <TabsTrigger value="smile" className="rounded-xl text-[10px] uppercase font-black">Smile Studio</TabsTrigger>
                                                    <TabsTrigger value="share" className="rounded-xl text-[10px] uppercase font-black">Noble Share</TabsTrigger>
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
                                                <div className="flex items-center justify-between mb-8">
                                                    <TabsList className="bg-slate-100 p-1 rounded-2xl">
                                                        <TabsTrigger value="gallery" className="rounded-xl text-[10px] uppercase font-black">Media Gallery</TabsTrigger>
                                                        <TabsTrigger value="radiology" className="rounded-xl text-[10px] uppercase font-black">AI Radiology</TabsTrigger>
                                                        <TabsTrigger value="bridge" className="rounded-xl text-[10px] uppercase font-black">Bridge Sync</TabsTrigger>
                                                    </TabsList>
                                                </div>

                                                <TabsContent value="gallery" className="mt-0 flex-1">
                                                    <ClinicalMediaGallery />
                                                </TabsContent>

                                                <TabsContent value="radiology" className="mt-0 flex-1">
                                                    <RadiologyReportGen />
                                                </TabsContent>

                                                <TabsContent value="bridge" className="mt-0 flex-1">
                                                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full">
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
