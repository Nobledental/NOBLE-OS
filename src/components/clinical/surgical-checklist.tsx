"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ShieldCheck,
    AlertTriangle,
    FileSignature,
    Stethoscope,
    Users,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SurgicalSafetyChecklistProps {
    isOpen: boolean;
    onClose: () => void;
    onApproval: () => void;
    procedureName: string;
    hasRiskFactors: boolean;
}

export function SurgicalSafetyChecklist({
    isOpen,
    onClose,
    onApproval,
    procedureName,
    hasRiskFactors
}: SurgicalSafetyChecklistProps) {
    const [checks, setChecks] = useState({
        consentSigned: false,
        identityVerified: false,
        procedureConfirmed: false,
        medicalHistoryReviewed: false,
        surgicalSiteMarked: false,
    });

    const isComplete = Object.values(checks).every(Boolean);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-white p-8 border-b border-slate-100">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100">
                            <ShieldCheck className="w-6 h-6 text-rose-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-slate-900 text-xl font-black tracking-tight">Surgical Safety Checklist</DialogTitle>
                            <DialogDescription className="text-rose-600 font-bold uppercase tracking-widest text-[10px] mt-1">High-Risk Protocol Verification</DialogDescription>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8 bg-white">
                    {hasRiskFactors && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[10px] font-black uppercase text-rose-800 tracking-widest">Pre-Op Warning</h4>
                                <p className="text-[10px] font-bold text-rose-600/80 leading-relaxed uppercase mt-1">
                                    Patient has medical risk markers (e.g., bleeding/pregnancy). Ensure physician clearance is attached.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {[
                            { id: 'identityVerified', label: 'Patient Identity & Site Confirmed', icon: Users },
                            { id: 'procedureConfirmed', label: `Planned Procedure: ${procedureName}`, icon: Activity },
                            { id: 'consentSigned', label: 'Informed Consent Signed & Witnessed', icon: FileSignature },
                            { id: 'medicalHistoryReviewed', label: 'Medical History & Risks Reviewed', icon: Stethoscope },
                        ].map((item) => (
                            <div
                                key={item.id}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl transition-all border",
                                    checks[item.id as keyof typeof checks]
                                        ? "bg-emerald-50 border-emerald-100"
                                        : "bg-slate-50 border-slate-100"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn(
                                        "w-4 h-4",
                                        checks[item.id as keyof typeof checks] ? "text-emerald-600" : "text-slate-400"
                                    )} />
                                    <span className={cn(
                                        "text-xs font-bold",
                                        checks[item.id as keyof typeof checks] ? "text-emerald-900" : "text-slate-600"
                                    )}>{item.label}</span>
                                </div>
                                <Checkbox
                                    checked={checks[item.id as keyof typeof checks]}
                                    onCheckedChange={(val) => setChecks(prev => ({ ...prev, [item.id]: !!val }))}
                                    className="rounded-lg w-6 h-6 border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 sm:justify-center">
                    <Button
                        disabled={!isComplete}
                        onClick={onApproval}
                        className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl disabled:opacity-50 disabled:grayscale transition-all"
                    >
                        Sign & Authorize Surgery
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
