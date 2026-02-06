"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, FileText, Mic } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OtterVoice } from "@/components/clinical/otter-voice";

export function ClinicalNoteEditor({ patientId }: { patientId: string }) {
    const [notes, setNotes] = useState({
        subjective: "",
        objective: "",
        assessment: "",
        plan: ""
    });

    const handleChange = (field: keyof typeof notes, value: string) => {
        setNotes(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        console.log("Saving SOAP Note:", { patientId, ...notes });
        toast.success("Clinical notes saved successfully.");
    };

    return (
        <Card className="h-full border-none shadow-none">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        Case Sheet (SOAP)
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                                <Mic className="w-4 h-4" />
                                Dictate Notes
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-transparent border-none shadow-none">
                            <OtterVoice />
                        </DialogContent>
                    </Dialog>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subjective (Chief Complaint)</Label>
                    <Textarea
                        placeholder="Patient's stated symptoms, history of present illness..."
                        className="min-h-[80px] bg-slate-50 focus:bg-white transition-colors"
                        value={notes.subjective}
                        onChange={(e) => handleChange("subjective", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Objective (Observations)</Label>
                    <Textarea
                        placeholder="Vital signs, physical exam findings, specific tooth status..."
                        className="min-h-[80px] bg-slate-50 focus:bg-white transition-colors"
                        value={notes.objective}
                        onChange={(e) => handleChange("objective", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assessment (Diagnosis)</Label>
                    <Textarea
                        placeholder="Clinical diagnosis based on S & O..."
                        className="min-h-[60px] bg-slate-50 focus:bg-white transition-colors"
                        value={notes.assessment}
                        onChange={(e) => handleChange("assessment", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plan (Treatment)</Label>
                    <Textarea
                        placeholder="Proposed procedure, medication, referrals..."
                        className="min-h-[80px] bg-slate-50 focus:bg-white transition-colors"
                        value={notes.plan}
                        onChange={(e) => handleChange("plan", e.target.value)}
                    />
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save to Patient Record
                </Button>
            </CardContent>
        </Card>
    );
}
