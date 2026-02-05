import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToothMap } from "@/components/clinical/tooth-map";
import { ChartingControls } from "@/components/clinical/charting-controls";
import { ClinicalHistory } from "@/components/clinical/clinical-history";
import { ClinicalNoteEditor } from "@/components/clinical/clinical-note-editor";
import PrescriptionEngine from "@/components/clinical/prescription-engine";
import { SurgeryNote } from "@/components/clinical/surgery-note";
import { PermissionGuard } from "@/components/security/permission-guard";
import { Lock, FileText, Activity, Syringe, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

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
                    <div className="xl:col-span-2 overflow-y-auto border rounded-xl bg-white shadow-sm p-4">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Skull className="w-5 h-5 text-slate-500" />
                            Visual Charting
                        </h3>
                        <ToothMap patientId={MOCK_PATIENT_ID} />
                    </div>

                    {/* Right: Tabbed Clinical Workflow */}
                    <div className="xl:col-span-2 bg-white dark:bg-slate-900 border rounded-xl p-4 shadow-sm flex flex-col">
                        <Tabs defaultValue="notes" className="flex-1 flex flex-col">
                            <TabsList className="grid w-full grid-cols-4 mb-4">
                                <TabsTrigger value="history">History</TabsTrigger>
                                <TabsTrigger value="notes">Case Sheet</TabsTrigger>
                                <TabsTrigger value="rx">Rx</TabsTrigger>
                                <TabsTrigger value="surgery" className="data-[state=active]:text-rose-600">Surgery</TabsTrigger>
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
                        </Tabs>
                    </div>
                </div>
            </PermissionGuard>
        </div>
    );
}
