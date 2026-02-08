"use client";

import { DentalMap } from "@/components/dental/dental-map";
import { useChairStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Check, Wand2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { use } from "react";

export default function ChairPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { selectedTeeth, applyTreatment, resetSelection } = useChairStore();
    const [note, setNote] = useState("");
    const [isListening, setIsListening] = useState(false);

    // Mock Voice Dictation (Web Speech API Wrapper)
    const toggleVoice = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setNote(prev => prev + " " + transcript);
            };

            recognition.start();
        } else {
            alert("Voice dictation not supported in this browser.");
        }
    };

    return (
        <div className="h-screen flex bg-background overflow-hidden relative">
            {/* Left: Dental Map (The Canvas) */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-4 flex flex-col items-center justify-center relative">
                <div className="absolute top-4 left-4 z-10">
                    <Link href="/dashboard">
                        <Button variant="outline" size="sm">← Exit Chair</Button>
                    </Link>
                </div>

                <div className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg backdrop-blur">
                    <h2 className="text-sm font-semibold">Patient: Divya Sharma</h2>
                    <p className="text-xs text-muted-foreground">ID: HF-2024-9021 • <span className="text-red-500 font-bold">Allergy: Penicillin</span></p>
                </div>

                <DentalMap />
            </div>

            {/* Right: Quick Chart Sidebar & Hybrid Note */}
            <div className="w-[400px] border-l bg-background flex flex-col shadow-xl z-20">
                <div className="p-4 border-b">
                    <h3 className="font-semibold text-lg flex items-center">
                        <Wand2 className="w-4 h-4 mr-2" />
                        Quick Chart
                    </h3>
                    <p className="text-xs text-muted-foreground">Select teeth to apply treatments</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Contextual Actions */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Procedures</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                disabled={selectedTeeth.length === 0}
                                onClick={() => applyTreatment('RCT')}
                                className="justify-start hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            >
                                ROOT CANAL (RCT)
                            </Button>
                            <Button
                                variant="outline"
                                disabled={selectedTeeth.length === 0}
                                onClick={() => applyTreatment('Filling')}
                                className="justify-start"
                            >
                                Composite Filling
                            </Button>
                            <Button
                                variant="outline"
                                disabled={selectedTeeth.length === 0}
                                onClick={() => applyTreatment('Extraction')}
                                className="justify-start"
                            >
                                Extraction
                            </Button>
                            <Button
                                variant="outline"
                                disabled={selectedTeeth.length === 0}
                                onClick={() => applyTreatment('Crown')}
                                className="justify-start"
                            >
                                Zirconia Crown
                            </Button>
                        </div>
                        {selectedTeeth.length > 0 && (
                            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                Selected: {selectedTeeth.join(", ")}
                            </div>
                        )}
                    </div>

                    {/* Hybrid Note */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold uppercase text-muted-foreground">Clinical Note</h4>
                            <Button
                                size="icon"
                                variant={isListening ? "destructive" : "secondary"}
                                className="h-6 w-6 rounded-full"
                                onClick={toggleVoice}
                            >
                                <Mic className="h-3 w-3" />
                            </Button>
                        </div>
                        <Textarea
                            placeholder="Start talking or typing..."
                            className="min-h-[150px] resize-none focus-visible:ring-indigo-500"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button size="sm">
                                <Check className="h-4 w-4 mr-2" />
                                Save Record
                            </Button>
                        </div>
                    </div>

                    {/* Smart Inventory Link (Visual Mock) */}
                    <Card className="bg-slate-50 border-dashed">
                        <CardHeader className="py-3">
                            <CardTitle className="text-xs font-medium">Auto-Stock Deductions</CardTitle>
                        </CardHeader>
                        <CardContent className="py-0 pb-3 text-xs text-muted-foreground">
                            Applying <b>RCT</b> will deduct:
                            <ul className="list-disc list-inside mt-1">
                                <li>Endo Motor File (x1)</li>
                                <li>GP Point (x3)</li>
                                <li>Sealer (0.5g)</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
