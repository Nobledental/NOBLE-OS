"use client";

import { useState, useEffect, useRef } from "react";
import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import { Mic, Square, Copy, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function OtterVoice() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("Patient complains of sensitivity in the upper right quadrant...");
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            // @ts-ignore
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                let interim = '';
                let final = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final += event.results[i][0].transcript;
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }
                if (final) {
                    setTranscript(prev => prev + " " + final);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error(event.error);
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
            toast.info("Listening... Speak clearly.");
        }
    };

    return (
        <PanzeCard className="h-full flex flex-col relative overflow-hidden bg-white text-slate-900 border-slate-200 shadow-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Mic className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-slate-900">Clinical Voice Assistant</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Powered by Noble AI</p>
                    </div>
                </div>
                {isListening && (
                    <div className="flex gap-1 items-end h-4">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1 bg-emerald-500 rounded-full animate-pulse"
                                style={{
                                    height: `${Math.random() * 100}%`,
                                    animationDuration: `${0.5 + Math.random()}s`
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Transcript Area */}
            <div className="flex-1 bg-slate-50 rounded-xl p-4 font-mono text-sm leading-relaxed overflow-y-auto min-h-[100px] border border-slate-200 shadow-inner">
                <p className="text-slate-700 whitespace-pre-wrap font-medium">
                    {transcript}
                    {isListening && <span className="animate-pulse text-indigo-500 ml-1">|</span>}
                </p>
            </div>

            {/* Controls */}
            <div className="mt-4 flex gap-2">
                <Button
                    onClick={toggleListening}
                    className={cn(
                        "flex-1 font-bold transition-all shadow-lg",
                        isListening
                            ? "bg-rose-500 hover:bg-rose-600 text-white animate-pulse shadow-rose-200"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                    )}
                >
                    {isListening ? (
                        <>
                            <Square className="w-4 h-4 mr-2" /> Stop Recording
                        </>
                    ) : (
                        <>
                            <Mic className="w-4 h-4 mr-2" /> Start Dictation
                        </>
                    )}
                </Button>
                <Button variant="outline" size="icon" className="border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-indigo-600">
                    <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-amber-500">
                    <Sparkles className="w-4 h-4" />
                </Button>
            </div>

            {/* Warning if API not supported */}
            <div className="text-[10px] text-slate-400 mt-2 text-center flex items-center justify-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                <span>Microphone access required for transcription.</span>
            </div>
        </PanzeCard>
    );
}
