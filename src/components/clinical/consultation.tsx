"use client"

import React, { useState } from "react"
import { Mic, Save, FileText, Wand2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export function ClinicalConsultation() {
    const [note, setNote] = useState("")
    const [isRecording, setIsRecording] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const toggleRecording = () => {
        if (!isRecording) {
            // Start Web Speech API Mock
            setIsRecording(true)
            // In real implementation: 
            // const recognition = new window.webkitSpeechRecognition();
            // recognition.onresult = (event) => setNote(prev => prev + event.results[0][0].transcript);
        } else {
            setIsRecording(false)
        }
    }

    const handleAISmartNote = () => {
        setIsProcessing(true)
        // Mock AI summarization
        setTimeout(() => {
            setNote(prev => prev + "\n[AI SUMMARY]: Patient presents with localized pain in tooth 14. Suspected RCT required.")
            setIsProcessing(false)
        }, 1500)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Clinical Consultation Note
                </h4>
                <div className="flex gap-2">
                    <Button
                        variant={isRecording ? "destructive" : "outline"}
                        size="sm"
                        onClick={toggleRecording}
                        className={isRecording ? "animate-pulse" : ""}
                    >
                        <Mic className="w-3.5 h-3.5 mr-2" />
                        {isRecording ? "Stop Voice" : "Voice-to-Note"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleAISmartNote} disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 mr-2" />}
                        AI SmartNote
                    </Button>
                </div>
            </div>

            <div className="relative">
                <Textarea
                    placeholder="Start typing clinical findings or use voice-to-note..."
                    className="min-h-[150px] resize-none border-slate-200 focus:ring-indigo-500"
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
                    <Badge variant="secondary" className="text-[10px] cursor-pointer hover:bg-indigo-100">Pain</Badge>
                    <Badge variant="secondary" className="text-[10px] cursor-pointer hover:bg-indigo-100">Swelling</Badge>
                    <Badge variant="secondary" className="text-[10px] cursor-pointer hover:bg-indigo-100">Post-Op</Badge>
                </div>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    <Save className="w-3.5 h-3.5 mr-2" />
                    Save Consultation
                </Button>
            </div>
        </div>
    )
}
