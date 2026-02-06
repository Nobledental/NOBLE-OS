"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, FileText, Mic, Sparkles, Wand2, X, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OtterVoice } from "@/components/clinical/otter-voice";
import { cn } from "@/lib/utils";
import { CLINICAL_SUGGESTIONS, CLINICAL_TEMPLATES, ClinicalTemplate, ClinicalSuggestion } from "@/lib/clinical-suggest";
import { motion, AnimatePresence } from "framer-motion";

// Define the type for the notes state
export type ClinicalNoteState = {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    advice: string;
};

export function ClinicalNoteEditor({
    patientId,
    initialNotes,
    onNotesChange,
    onArchive
}: {
    patientId: string;
    initialNotes?: ClinicalNoteState;
    onNotesChange?: (notes: ClinicalNoteState) => void;
    onArchive?: (notes: ClinicalNoteState) => void;
}) {
    const [notes, setNotes] = useState<ClinicalNoteState>(initialNotes || {
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
        advice: ""
    });
    const [activeField, setActiveField] = useState<keyof ClinicalNoteState | null>(null);
    const [suggestions, setSuggestions] = useState<ClinicalSuggestion[]>([]);

    useEffect(() => {
        if (initialNotes) {
            setNotes(initialNotes);
        }
    }, [initialNotes]);

    const handleChange = (field: keyof ClinicalNoteState, value: string) => {
        const updatedNotes = { ...notes, [field]: value };
        setNotes(updatedNotes);
        onNotesChange?.(updatedNotes);
    };

    const applyTemplate = (template: ClinicalTemplate) => {
        setNotes({
            subjective: template.subjective || notes.subjective,
            objective: template.objective || notes.objective,
            assessment: template.assessment || notes.assessment,
            plan: template.plan || notes.plan,
            advice: template.advice || notes.advice
        });
        toast.info(`Applied template: ${template.name}`);
    };

    const addSuggestion = (suggestion: ClinicalSuggestion) => {
        if (!activeField) return;
        const currentText = notes[activeField];
        const newText = currentText ? `${currentText}\n${suggestion.value}` : suggestion.value;
        handleChange(activeField, newText);
        setSuggestions([]);
    };

    useEffect(() => {
        if (activeField) {
            const categoryMap: Record<string, string> = {
                subjective: 'complaint',
                assessment: 'diagnosis',
                objective: 'observation',
                plan: 'procedure',
                advice: 'advice'
            };
            const filtered = CLINICAL_SUGGESTIONS.filter(s => s.category === categoryMap[activeField]);
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [activeField]);

    const handleSave = () => {
        console.log("Saving SOAP Note:", { patientId, ...notes });
        onArchive?.(notes);
        toast.success("Clinical notes archived and saved successfully.");
    };

    return (
        <Card className="h-full border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-2xl font-black italic tracking-tighter">
                            <FileText className="w-6 h-6 text-indigo-500" />
                            Case Sheet
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">SOAP-AI Guided Documentation</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="rounded-2xl gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest h-10 px-4">
                                    <Mic className="w-4 h-4" />
                                    Dictate
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-transparent border-none shadow-none">
                                <OtterVoice />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-8 mt-4">
                {/* Quick Templates Bar */}
                <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Wand2 className="w-3 h-3 text-indigo-400" /> Quick Smart Templates
                    </Label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {CLINICAL_TEMPLATES.map(template => (
                            <button
                                key={template.id}
                                onClick={() => applyTemplate(template)}
                                className="flex-shrink-0 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            >
                                {template.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Subjective */}
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-amber-400" /> S - Subjective
                        </Label>
                        <Textarea
                            placeholder="Patient's stated symptoms, history of present illness..."
                            className="min-h-[140px] bg-slate-50 border-slate-100 rounded-[2rem] p-6 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-sm transition-all"
                            value={notes.subjective}
                            onFocus={() => setActiveField('subjective')}
                            onChange={(e) => handleChange("subjective", e.target.value)}
                        />
                    </div>

                    {/* Objective */}
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">O - Objective</Label>
                        <Textarea
                            placeholder="Vital signs, physical exam findings, specific tooth status..."
                            className="min-h-[140px] bg-slate-50 border-slate-100 rounded-[2rem] p-6 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-sm transition-all"
                            value={notes.objective}
                            onFocus={() => setActiveField('objective')}
                            onChange={(e) => handleChange("objective", e.target.value)}
                        />
                    </div>

                    {/* Assessment */}
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">A - Assessment</Label>
                        <Textarea
                            placeholder="Clinical diagnosis based on S & O..."
                            className="min-h-[120px] bg-slate-50 border-slate-100 rounded-[2rem] p-6 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-sm transition-all"
                            value={notes.assessment}
                            onFocus={() => setActiveField('assessment')}
                            onChange={(e) => handleChange("assessment", e.target.value)}
                        />
                    </div>

                    {/* Plan & Advice */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">P - Plan</Label>
                            <Textarea
                                placeholder="Proposed procedure, medication, referrals..."
                                className="min-h-[120px] bg-slate-50 border-slate-100 rounded-[2rem] p-6 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-sm transition-all"
                                value={notes.plan}
                                onFocus={() => setActiveField('plan')}
                                onChange={(e) => handleChange("plan", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Post-Procedure Advice</Label>
                    <Textarea
                        placeholder="Instructions given to patient..."
                        className="min-h-[80px] bg-slate-50 border-slate-100 rounded-[2.5rem] p-6 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-sm transition-all"
                        value={notes.advice}
                        onFocus={() => setActiveField('advice')}
                        onChange={(e) => handleChange("advice", e.target.value)}
                    />
                </div>

                {/* Suggestions Overlay */}
                <AnimatePresence>
                    {suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="p-6 bg-indigo-600 rounded-[2.5rem] shadow-2xl shadow-indigo-500/30"
                        >
                            <div className="flex justify-between items-center mb-4 px-2">
                                <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">AI Assisted Suggestions</span>
                                <button onClick={() => setSuggestions([])} className="text-white hover:bg-white/10 p-1 rounded-lg transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map(suggestion => (
                                    <button
                                        key={suggestion.id}
                                        onClick={() => addSuggestion(suggestion)}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold text-white transition-all"
                                    >
                                        + {suggestion.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    className="w-full h-16 bg-slate-900 hover:bg-black rounded-3xl text-sm font-black uppercase tracking-widest gap-3 shadow-xl transform active:scale-[0.98] transition-all"
                    onClick={handleSave}
                >
                    <ClipboardCheck className="w-5 h-5 text-indigo-400" />
                    Archive Clinical Record
                </Button>
            </CardContent>
        </Card>
    );
}

