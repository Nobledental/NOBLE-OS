/**
 * Clinical Treatments Panel
 * 
 * Shows planned treatments for a patient
 * Allows doctor to mark treatments as done
 */

"use client";

import { useState } from "react";
import { useTreatmentStore } from "@/lib/treatment-store";
import { ClinicalTreatmentCard } from "./clinical-treatment-card";
import { Button } from "@/components/ui/button";
import { Plus, Stethoscope } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClinicalTreatmentsPanelProps {
    appointmentId: string;
    patientId: string;
    patientName?: string;
}

export function ClinicalTreatmentsPanel({
    appointmentId,
    patientId,
    patientName
}: ClinicalTreatmentsPanelProps) {
    const treatments = useTreatmentStore(state =>
        state.getTreatmentsByAppointment(appointmentId)
    );

    const addTreatment = useTreatmentStore(state => state.addTreatment);

    const pendingTreatments = treatments.filter(t =>
        t.status === 'planned' || t.status === 'in_progress'
    );

    const completedTreatments = treatments.filter(t =>
        t.status === 'completed'
    );

    if (treatments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                    <Stethoscope className="w-10 h-10 text-indigo-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Treatments Planned</h3>
                <p className="text-slate-500 text-sm max-w-sm mt-2 mb-6">
                    Add treatments to this appointment to start tracking clinical work.
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Treatment
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                        Treatments {patientName && `for ${patientName}`}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        {pendingTreatments.length} pending · {completedTreatments.length} completed
                    </p>
                </div>
                <Button size="sm" variant="outline">
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                </Button>
            </div>

            {/* Pending Treatments */}
            {pendingTreatments.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Pending
                    </h4>
                    <div className="space-y-3">
                        {pendingTreatments.map(treatment => (
                            <ClinicalTreatmentCard
                                key={treatment.id}
                                treatment={treatment}
                                patientName={patientName}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Completed Treatments */}
            {completedTreatments.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Completed (Auto-billed)
                    </h4>
                    <ScrollArea className="h-[300px]">
                        <div className="space-y-3 pr-4">
                            {completedTreatments.map(treatment => (
                                <ClinicalTreatmentCard
                                    key={treatment.id}
                                    treatment={treatment}
                                    patientName={patientName}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}
