"use client";


import { DentitionChart } from "@/components/clinical/tooth-chart";
import { getDentitionMode } from "@/types/clinical";
import { useChairStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Check, Wand2, Loader2, ArrowLeft } from "lucide-react";
import { useState, use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export default function ChairPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { selectedTeeth, applyTreatment, resetSelection } = useChairStore();
    const [note, setNote] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch Patient Details
    const { data: patient, isLoading } = useQuery({
        queryKey: ['patient', id],
        queryFn: async () => {
            const res = await api.get(`/patients/${id}`);
            return res.data;
        }
    });

    const chartMode = getDentitionMode(patient?.age ?? 30);

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

    const handleSave = async () => {
        if (!note.trim() && selectedTeeth.length === 0) {
            toast.error("Nothing to save");
            return;
        }

        try {
            setIsSaving(true);
            await api.post('/clinical/notes', {
                patient_id: id,
                content: note,
                procedures: selectedTeeth,
                type: 'PROCEDURE'
            });
            toast.success("Procedure & Note Saved");
            setNote("");
            resetSelection();
        } catch (e) {
            toast.error("Failed to save record");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;

    return (
        <div className="h-screen flex bg-slate-50 overflow-hidden relative">
            {/* Left: Dental Map (The Canvas) */}
            <div className="flex-1 bg-slate-100 p-4 flex flex-col items-center justify-center relative">
                <div className="absolute top-4 left-4 z-10">
                    <Link href={`/dashboard/patients/${id}`}>
                        <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Profile
                        </Button>
                    </Link>
                </div>

                <div className="absolute top-4 right-4 z-10 bg-white/90 p-3 rounded-xl shadow-lg border border-slate-200 backdrop-blur">
                    <h2 className="text-sm font-bold text-slate-800">Patient: {patient?.name}</h2>
                    <p className="text-xs text-slate-500 font-medium">ID: {patient?.healthflo_id} • <span className="text-red-500 font-bold">Allergy: Penicillin</span></p>
                </div>

                <div className="scale-90 origin-center max-h-screen overflow-auto">
                    <DentitionChart mode={chartMode} data={{}} onChange={() => { }} />
                </div>
            </div>

            {/* Right: Quick Chart Sidebar & Hybrid Note */}
            <div className="w-[400px] border-l bg-white flex flex-col shadow-2xl z-20">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-black text-xl flex items-center text-slate-900 tracking-tight">
                        <Wand2 className="w-5 h-5 mr-2 text-indigo-600" />
                        Quick Chart
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Select teeth to apply treatments</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Contextual Actions */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Common Procedures</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                disabled={selectedTeeth.length === 0}
                                onClick={() => applyTreatment('RCT')}
                                className="justify-start hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 h-auto py-3 border-slate-200"
                            >
                                <div className="text-left">
                                    <div className="font-bold text-xs">ROOT CANAL</div>
                                    <div className="text-[10px] opacity-70">Single/Multi visit</div>
                                </div>
                            </Button>
                            <Button
                                variant="outline"
                                disabled={selectedTeeth.length === 0}
                                onClick={() => applyTreatment('Filling')}
                                className="justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 h-auto py-3 border-slate-200"
                            >
                                <div className="text-left">
                                    <div className="font-bold text-xs">COMPOSITE</div>
                                    <div className="text-[10px] opacity-70">Light Cure Filling</div>
                                </div>
                            </Button>
                            <Button
                                variant="outline"
                                disabled={selectedTeeth.length === 0}
                                onClick={() => applyTreatment('Extraction')}
                                className="justify-start hover:bg-red-50 hover:text-red-700 hover:border-red-200 h-auto py-3 border-slate-200"
                            >
                                <div className="text-left">
                                    <div className="font-bold text-xs">EXTRACTION</div>
                                    <div className="text-[10px] opacity-70">Surgical/Simple</div>
                                </div>
                            </Button>
                            <Button
                                variant="outline"
                                disabled={selectedTeeth.length === 0}
                                onClick={() => applyTreatment('Crown')}
                                className="justify-start hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 h-auto py-3 border-slate-200"
                            >
                                <div className="text-left">
                                    <div className="font-bold text-xs">CROWN</div>
                                    <div className="text-[10px] opacity-70">Zirconia/PFM</div>
                                </div>
                            </Button>
                        </div>
                        {selectedTeeth.length > 0 && (
                            <div className="text-xs font-bold text-indigo-600 bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex items-center gap-2">
                                <span className="uppercase tracking-wider">Active:</span> {selectedTeeth.join(", ")}
                            </div>
                        )}
                    </div>

                    {/* Hybrid Note */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Clinical Note</h4>
                            <Button
                                size="icon"
                                variant={isListening ? "destructive" : "secondary"}
                                className={isListening ? "animate-pulse shadow-lg shadow-red-500/30" : "bg-slate-100 text-slate-600"}
                                onClick={toggleVoice}
                            >
                                <Mic className="h-4 w-4" />
                            </Button>
                        </div>
                        <Textarea
                            placeholder="Dictate or type clinical findings..."
                            className="min-h-[150px] resize-none focus-visible:ring-indigo-500 bg-slate-50 border-slate-200 rounded-xl"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 rounded-lg font-bold" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                                Save Record
                            </Button>
                        </div>
                    </div>

                    {/* Smart Inventory Link (Visual Mock) */}
                    <Card className="bg-slate-50 border-dashed border-2 shadow-none">
                        <CardHeader className="py-3">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">Auto-Stock Deductions</CardTitle>
                        </CardHeader>
                        <CardContent className="py-0 pb-3 text-xs text-slate-500 font-medium">
                            Applying <span className="font-bold text-slate-800">RCT</span> will deduct:
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-1 text-[11px]">
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
