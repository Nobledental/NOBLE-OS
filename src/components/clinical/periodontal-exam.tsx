"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Activity,
    Droplets,
    Thermometer,
    Waves,
    LineChart,
    ChevronRight,
    Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type PeriodontalState = {
    pocketDepths: Record<string, number>; // tooth-index -> depth
    bleedingNodes: string[]; // list of tooth-indices with bleeding
    calculusLevel: 'NONE' | 'MILD' | 'SEVERE';
    gingivalTone: 'PINK' | 'RED' | 'PURPLE';
    mobility: Record<string, '0' | '1' | '2' | '3'>;
};

interface PeriodontalExamProps {
    data?: PeriodontalState;
    onChange?: (data: PeriodontalState) => void;
}

export function PeriodontalExam({ data, onChange }: PeriodontalExamProps) {
    const [state, setState] = useState<PeriodontalState>(data || {
        pocketDepths: {},
        bleedingNodes: [],
        calculusLevel: 'NONE',
        gingivalTone: 'PINK',
        mobility: {},
    });

    const updateState = (updates: Partial<PeriodontalState>) => {
        const newState = { ...state, ...updates };
        setState(newState);
        onChange?.(newState);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Periodontal Health Screening</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gingival & Periodontium Assessment</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Global Status */}
                <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-sm bg-white">
                    <div className="space-y-8">
                        <div>
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Calculus (Tartar) Presence</Label>
                            <div className="flex gap-2">
                                {['NONE', 'MILD', 'SEVERE'].map((lvl) => (
                                    <button
                                        key={lvl}
                                        onClick={() => updateState({ calculusLevel: lvl as any })}
                                        className={cn(
                                            "flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            state.calculusLevel === lvl
                                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                        )}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Gingival Tone (Color)</Label>
                            <div className="flex gap-2">
                                {[
                                    { id: 'PINK', color: 'bg-pink-400' },
                                    { id: 'RED', color: 'bg-rose-500' },
                                    { id: 'PURPLE', color: 'bg-purple-600' }
                                ].map((tone) => (
                                    <button
                                        key={tone.id}
                                        onClick={() => updateState({ gingivalTone: tone.id as any })}
                                        className={cn(
                                            "flex-1 h-12 rounded-xl flex items-center justify-center gap-2 transition-all",
                                            state.gingivalTone === tone.id
                                                ? "bg-slate-900 text-white shadow-xl"
                                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                        )}
                                    >
                                        <div className={cn("w-3 h-3 rounded-full", tone.color)} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{tone.id}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Bleeding on Probing (BOP) */}
                <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-sm bg-white">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-rose-500" />
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bleeding on Probing (BOP)</Label>
                        </div>
                        <span className="text-xl font-black text-rose-600">{state.bleedingNodes.length} pts</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 h-32 overflow-y-auto pr-2 scrollbar-thin">
                        {Array.from({ length: 32 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    const id = (i + 1).toString();
                                    const next = state.bleedingNodes.includes(id)
                                        ? state.bleedingNodes.filter(n => n !== id)
                                        : [...state.bleedingNodes, id];
                                    updateState({ bleedingNodes: next });
                                }}
                                className={cn(
                                    "w-8 h-8 rounded-lg text-[9px] font-black transition-all",
                                    state.bleedingNodes.includes((i + 1).toString())
                                        ? "bg-rose-600 text-white shadow-lg shadow-rose-200"
                                        : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 mt-4 uppercase tracking-[0.1em]">Tap tooth number to mark active bleeding sites</p>
                </Card>
            </div>

            {/* Diagnostic Interpretation Overlay */}
            {state.calculusLevel === 'SEVERE' && (
                <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-200/50 flex items-center justify-center shrink-0">
                        <Waves className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-800">Pro-Tip: Scaling Required</span>
                        <p className="text-xs font-bold text-amber-700 mt-0.5">Severe calculus detected. Recommend ultrasonic scaling and root planing to prevent attachment loss.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
