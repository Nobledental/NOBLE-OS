"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChartingControls } from "@/components/clinical/charting-controls";
import { ClinicalHistory } from "@/components/clinical/clinical-history";
import { ClinicalNoteEditor } from "@/components/clinical/clinical-note-editor";
import PrescriptionEngine from "@/components/clinical/prescription-engine";
import { SurgeryNote } from "@/components/clinical/surgery-note";
import { SmartScanner } from "@/components/clinical/smart-scanner";
import { PermissionGuard } from "@/components/security/permission-guard";
import { Lock, FileText, Activity, Syringe, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { CaseQueue } from "@/components/clinical/case-queue";
import { AbhaCard } from "@/components/patient/abha-card";
import { LabTracker } from "@/components/clinical/lab-tracker";
import NobleSmileStudio from "@/components/clinical/noble-smile-studio";
import { IntraOralCamera } from "@/components/clinical/intra-oral-camera";
import UniversalBridgeHub from "@/components/clinical/universal-bridge-hub";
import NobleSharePortal from "@/components/clinical/noble-share-portal";
import { UniversalToothChart } from "@/components/clinical/universal-tooth-chart";


const MOCK_PATIENT_ID = "p123";

export function ClinicalMasterHub() {
    return (
        <div className="flex-1 space-y-4 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-4xl lg:text-5xl font-serif italic tracking-tighter text-slate-900">Clinical Master</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Digital Tooth Map & Procedural Charting.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Schedule Follow-up
                </Button>
            </div>

            <PermissionGuard
                permission="can_view_clinical"
                fallback={
                    <div className="h-[calc(100vh-20rem)] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center space-y-4 bg-slate-50">
                        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold">Restricted Access</h3>
                        <p className="text-muted-foreground text-center max-w-xs">
                            You do not have permission to view sensitive clinical data. Please contact the Chief Dentist.
                        </p>
                    </div>
                }
            >
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-0">
                    {/* Left: Interactive 3D/2D Map - Always Visible */}
                    <div className="xl:col-span-2 overflow-y-auto border border-slate-200 rounded-[2.5rem] bg-white shadow-xl p-8 space-y-8">
                        {/* Eka Care Style Digital Health ID */}
                        <div className="mb-4">
                            <AbhaCard />
                        </div>

                        <CaseQueue />

                        <div className="border-t border-slate-100 pt-8">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 flex items-center gap-3">
                                <Skull className="w-4 h-4" />
                                Visual Charting
                            </h3>
                            <UniversalToothChart mode="MIXED" className="border-none shadow-none p-0" />
                        </div>
                    </div>

                    {/* Right: Tabbed Clinical Workflow */}
                    <div className="xl:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl p-0 flex flex-col overflow-hidden relative">
                        <Tabs defaultValue="notes" className="flex-1 flex flex-col min-h-0">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 max-w-full">
                                    <TabsTrigger value="history">History</TabsTrigger>
                                    <TabsTrigger value="notes">Case Sheet</TabsTrigger>
                                    <TabsTrigger value="rx">Rx</TabsTrigger>
                                    <TabsTrigger value="surgery" className="data-[state=active]:text-rose-600">Surgery</TabsTrigger>
                                    <TabsTrigger value="bridge" className="data-[state=active]:text-emerald-600">Bridge Hub</TabsTrigger>
                                    <TabsTrigger value="lab" className="data-[state=active]:text-purple-600">Lab Work</TabsTrigger>
                                    <TabsTrigger value="smile" className="data-[state=active]:text-amber-500">Smile Studio</TabsTrigger>
                                    <TabsTrigger value="camera" className="data-[state=active]:text-blue-500">Intra-Oral Cam</TabsTrigger>
                                    <TabsTrigger value="share" className="data-[state=active]:text-indigo-600">Noble Share</TabsTrigger>
                                </TabsList>

                                {/* 1. History (Reference) */}
                                <TabsContent value="history" className="flex-1 overflow-y-auto">
                                    <ClinicalHistory patientId={MOCK_PATIENT_ID} />
                                </TabsContent>

                                {/* 2. Case Sheet (Active Input) */}
                                <TabsContent value="notes" className="flex-1 overflow-y-auto">
                                    <ClinicalNoteEditor patientId={MOCK_PATIENT_ID} />
                                </TabsContent>

                                {/* 3. Prescription (Active Input) */}
                                <TabsContent value="rx" className="flex-1 overflow-y-auto">
                                    <PrescriptionEngine patientId={MOCK_PATIENT_ID} />
                                </TabsContent>

                                {/* 4. Surgery/OT (Active Input) */}
                                <TabsContent value="surgery" className="flex-1 overflow-y-auto">
                                    <SurgeryNote patientId={MOCK_PATIENT_ID} />
                                </TabsContent>

                                {/* 5. Universal Bridge (Imaging) */}
                                <TabsContent value="bridge" className="flex-1 overflow-y-auto">
                                    <UniversalBridgeHub />
                                </TabsContent>

                                {/* 6. Lab Tracker (DentCare Integration) */}
                                <TabsContent value="lab" className="flex-1 overflow-y-auto">
                                    <LabTracker />
                                </TabsContent>

                                {/* 7. Smile Studio (iSmile Integration) */}
                                <TabsContent value="smile" className="flex-1 overflow-y-auto min-h-0">
                                    <NobleSmileStudio />
                                </TabsContent>

                                {/* 8. Intra-Oral Camera (USB/WiFi) */}
                                <TabsContent value="camera" className="flex-1 overflow-hidden min-h-0 p-1">
                                    <IntraOralCamera patientId={MOCK_PATIENT_ID} />
                                </TabsContent>

                                {/* 9. Noble Share (Secure Web View) */}
                                <TabsContent value="share" className="flex-1 overflow-y-auto">
                                    <NobleSharePortal />
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </PermissionGuard>
        </div>
    );
}
