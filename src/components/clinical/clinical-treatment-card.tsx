/**
 * Clinical Treatment Action Card
 * 
 * Shows treatment with "Mark as Done" button
 * Triggers automated billing when marked complete
 */

"use client";

import { Button } from "@/components/ui/button";
import { PanzeCard } from "@/components/ui/panze-card";
import { Check, Clock, Loader2 } from "lucide-react";
import { useTreatmentStore } from "@/lib/treatment-store";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { TreatmentRecord } from "@/types/treatment-record";

interface ClinicalTreatmentCardProps {
    treatment: TreatmentRecord;
    patientName?: string;
}

export function ClinicalTreatmentCard({ treatment, patientName }: ClinicalTreatmentCardProps) {
    const [isCompleting, setIsCompleting] = useState(false);
    const markAsCompleted = useTreatmentStore(state => state.markAsCompleted);

    const handleMarkAsDone = async () => {
        setIsCompleting(true);

        try {
            // Simulate small delay for UX
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mark as complete (triggers auto-billing)
            markAsCompleted(treatment.id);

            toast.success('Treatment marked as complete!', {
                description: `${treatment.procedure.name} auto-added to billing`,
                action: {
                    label: 'View Billing',
                    onClick: () => window.location.href = '/dashboard/billing'
                }
            });
        } catch (error) {
            toast.error('Failed to mark treatment as complete');
            console.error(error);
        } finally {
            setIsCompleting(false);
        }
    };

    const isCompleted = treatment.status === 'completed';
    const isInProgress = treatment.status === 'in_progress';

    return (
        <PanzeCard className={cn(
            "relative overflow-hidden transition-all duration-300",
            isCompleted && "bg-green-50/50 border-green-200",
            isInProgress && "bg-amber-50/50 border-amber-200"
        )}>
            {/* Status Badge */}
            <div className="absolute top-3 right-3">
                {isCompleted && (
                    <div className="flex items-center gap-1 bg-green-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-full">
                        <Check className="w-3 h-3" />
                        Done
                    </div>
                )}
                {isInProgress && (
                    <div className="flex items-center gap-1 bg-amber-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        In Progress
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="space-y-3">
                {/* Header */}
                <div>
                    <h3 className="text-sm font-bold text-slate-900">{treatment.procedure.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Category: {treatment.procedure.category}
                    </p>
                </div>

                {/* Teeth Info */}
                {treatment.teethAffected.length > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-600">Teeth:</span>
                        <div className="flex gap-1 flex-wrap">
                            {treatment.teethAffected.map(tooth => (
                                <span
                                    key={tooth}
                                    className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-mono text-xs"
                                >
                                    {tooth}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Notes */}
                {treatment.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2">
                        {treatment.notes}
                    </p>
                )}

                {/* Multi-session Info */}
                {treatment.isMultiSession && (
                    <div className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2">
                        Session {treatment.sessionNumber || 1} of {treatment.totalSessions || '?'}
                    </div>
                )}

                {/* Action Button */}
                {!isCompleted && (
                    <Button
                        onClick={handleMarkAsDone}
                        disabled={isCompleting}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                    >
                        {isCompleting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Marking as Done...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Mark as Done & Bill
                            </>
                        )}
                    </Button>
                )}

                {/* Completion Info */}
                {isCompleted && treatment.completedAt && (
                    <div className="text-xs text-green-700 text-center py-2">
                        ✓ Completed {new Date(treatment.completedAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                )}
            </div>
        </PanzeCard>
    );
}
