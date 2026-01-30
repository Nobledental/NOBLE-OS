"use client";

import { ToothMap } from "@/components/clinical/tooth-map";
import { ChartingControls } from "@/components/clinical/charting-controls";
import { ClinicalHistory } from "@/components/clinical/clinical-history";
import { PermissionGuard } from "@/components/security/permission-guard";
import { Lock } from "lucide-react";

const MOCK_PATIENT_ID = "p123";

export default function ClinicalPage() {
    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clinical Master</h2>
                    <p className="text-muted-foreground">Digital Tooth Map & Procedural Charting.</p>
                </div>
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
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-16rem)] animate-in fade-in duration-500">
                    <div className="xl:col-span-3 overflow-y-auto">
                        <ToothMap patientId={MOCK_PATIENT_ID} />
                    </div>

                    <div className="xl:col-span-1 bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
                        <ChartingControls patientId={MOCK_PATIENT_ID} />
                    </div>
                </div>
            </PermissionGuard>
        </div>
    );
}
