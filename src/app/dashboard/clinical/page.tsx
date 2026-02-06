import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToothMap } from "@/components/clinical/tooth-map";
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
import { SmileDesigner } from "@/components/clinical/smile-designer";
import { IntraOralCamera } from "@/components/clinical/intra-oral-camera";


const MOCK_PATIENT_ID = "p123";

export default function ClinicalPage() {
    return (
        <div className="flex-1 space-y-4 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Clinical Master</h2>
                    <p className="text-sm text-muted-foreground">Digital Tooth Map & Procedural Charting.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Schedule Follow-up
                </Button>
            </div>

            <PermissionGuard
                permission="can_view_clinical"
                fallback={
                    <div className="h-[calc(100vh-20rem)] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center space-y-4 bg-slate-50 dark:bg-slate-900/50">
                        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
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
                    <div className="xl:col-span-2 overflow-y-auto border rounded-xl bg-white shadow-sm p-4 space-y-4">
                        {/* Eka Care Style Digital Health ID */}
                        <div className="mb-4">
                            <AbhaCard />
                        </div>

                        <CaseQueue />

                        <div className="border-t pt-4">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Skull className="w-5 h-5 text-slate-500" />
                                Visual Charting
                            </h3>
                            <ToothMap patientId={MOCK_PATIENT_ID} />
                        </div>
                    </div>

                    {/* Right: Tabbed Clinical Workflow */}
                    <div className="xl:col-span-2 bg-white dark:bg-slate-900 border rounded-xl p-4 shadow-sm flex flex-col">
                        <Tabs defaultValue="notes" className="flex-1 flex flex-col">
                            <TabsList className="grid w-full grid-cols-5 mb-4">
                                <TabsTrigger value="history">History</TabsTrigger>
                                <TabsTrigger value="notes">Case Sheet</TabsTrigger>
                                <TabsTrigger value="rx">Rx</TabsTrigger>
                                <TabsTrigger value="surgery" className="data-[state=active]:text-rose-600">Surgery</TabsTrigger>
                                <TabsTrigger value="scanner" className="data-[state=active]:text-emerald-600">Smart Scan</TabsTrigger>
                                <TabsTrigger value="lab" className="data-[state=active]:text-purple-600">Lab Work</TabsTrigger>
                                <TabsTrigger value="smile" className="data-[state=active]:text-amber-500">Smile Studio</TabsTrigger>
                                <TabsTrigger value="camera" className="data-[state=active]:text-blue-500">Intra-Oral Cam</TabsTrigger>
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

                            {/* 5. Smart Scanner (OCR) */}
                            <TabsContent value="scanner" className="flex-1 overflow-y-auto">
                                <SmartScanner patientId={MOCK_PATIENT_ID} />
                            </TabsContent>

                            {/* 6. Lab Tracker (DentCare Integration) */}
                            <TabsContent value="lab" className="flex-1 overflow-y-auto">
                                <LabTracker />
                            </TabsContent>

                            {/* 7. Smile Studio (iSmile Integration) */}
                            <TabsContent value="smile" className="flex-1 overflow-y-auto min-h-0">
                                <SmileDesigner />
                            </TabsContent>

                            {/* 8. Intra-Oral Camera (USB/WiFi) */}
                            <TabsContent value="camera" className="flex-1 overflow-hidden min-h-0 p-1">
                                <IntraOralCamera patientId={MOCK_PATIENT_ID} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </PermissionGuard>
        </div>
    );
}
