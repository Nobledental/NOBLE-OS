"use client"

import React, { useState } from "react"
import { Mic, Save, FileText, Wand2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

import { toast } from "sonner"
import api from "@/lib/api"

interface ClinicalConsultationProps {
    patientId: string;
}

export function ClinicalConsultation({ patientId }: ClinicalConsultationProps) {
    const [note, setNote] = useState("")
    const [isRecording, setIsRecording] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const toggleRecording = () => {
        if (!isRecording) {
            setIsRecording(true)
            toast.info("Voice recording started (Simulation)")
        } else {
            setIsRecording(false)
            toast.success("Voice note captured")
        }
    }

    const handleAISmartNote = () => {
        setIsProcessing(true)
        setTimeout(() => {
            setNote(prev => prev + "\n[AI SUMMARY]: Patient presents with localized pain in tooth 14. Suspected RCT required.")
            setIsProcessing(false)
            toast.success("AI Summary Generated")
        }, 1500)
    }

    const handleSave = async () => {
        if (!note.trim()) {
            toast.error("Cannot save empty note");
            return;
        }

        try {
            setIsSaving(true);
            // Post to clinical notes endpoint
            await api.post('/clinical/notes', {
                patient_id: patientId,
                content: note,
                type: 'CONSULTATION'
            });
            toast.success("Clinical note saved successfully");
            setNote(""); // Clear after save
        } catch (error) {
            console.error(error);
            toast.error("Failed to save note");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center text-slate-900">
                    <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                    Clinical Consultation Note
                </h4>
                <div className="flex gap-2">
                    <Button
                        variant={isRecording ? "destructive" : "outline"}
                        size="sm"
                        onClick={toggleRecording}
                        className={isRecording ? "animate-pulse" : "border-slate-200 text-slate-600"}
                    >
                        <Mic className="w-3.5 h-3.5 mr-2" />
                        {isRecording ? "Stop Voice" : "Voice-to-Note"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleAISmartNote} disabled={isProcessing} className="border-slate-200 text-slate-600">
                        {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 mr-2" />}
                        AI SmartNote
                    </Button>
                </div>
            </div>

            <div className="relative">
                <Textarea
                    placeholder="Start typing clinical findings or use voice-to-note..."
                    className="min-h-[150px] resize-none border-slate-200 focus:ring-indigo-500 bg-slate-50/50 text-slate-900"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                {isRecording && (
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
                        <span className="text-[10px] font-bold text-red-500 uppercase">Listening...</span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <Badge variant="secondary" className="text-[10px] cursor-pointer hover:bg-indigo-100 border border-slate-200 bg-white text-slate-600">Pain</Badge>
                    <Badge variant="secondary" className="text-[10px] cursor-pointer hover:bg-indigo-100 border border-slate-200 bg-white text-slate-600">Swelling</Badge>
                    <Badge variant="secondary" className="text-[10px] cursor-pointer hover:bg-indigo-100 border border-slate-200 bg-white text-slate-600">Post-Op</Badge>
                </div>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
                    Save Consultation
                </Button>
            </div>
        </div>
    )
}
