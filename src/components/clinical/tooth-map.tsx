"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { GlassCard } from "@/components/ui/glass-card";
import { Brain, Info, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type ToothState = "HEALTHY" | "RCT" | "CROWN" | "IMPLANT" | "DECAY";

interface ToothData {
    id: number;
    state: ToothState;
}

const INITIAL_TEETH: ToothData[] = Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    state: "HEALTHY",
}));

export function ToothMap({ patientId }: { patientId: string }) {
    const [teeth, setTeeth] = useState<ToothData[]>(INITIAL_TEETH);
    const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

    const getToothStyles = (state: ToothState) => {
        switch (state) {
            case "RCT": return {
                fill: "url(#rct-gradient)",
                filter: "drop-shadow(0 0 4px rgba(251, 191, 36, 0.4))",
                stroke: "#D97706"
            };
            case "CROWN": return {
                fill: "url(#crown-gradient)",
                filter: "drop-shadow(0 0 4px rgba(217, 119, 6, 0.4))",
                stroke: "#B45309"
            };
            case "IMPLANT": return {
                fill: "url(#implant-gradient)",
                filter: "drop-shadow(0 0 4px rgba(71, 85, 105, 0.4))",
                stroke: "#1E293B"
            };
            case "DECAY": return {
                fill: "url(#decay-gradient)",
                filter: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))",
                stroke: "#B91C1C"
            };
            default: return {
                fill: "url(#healthy-gradient)",
                filter: "none",
                stroke: "rgba(148, 163, 184, 0.3)"
            };
        }
    };

    return (
        <GlassCard className="p-8 relative overflow-hidden" gradient intensity="high">
            {/* Background Decorative Mesh Snippet */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />

            <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <Brain className="w-6 h-6 text-indigo-500" />
                            Digital Twin
                        </h3>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mt-1">interactive 3d dental arch</p>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="glass rounded-full px-3">
                            <ShieldCheck className="w-3 h-3 mr-1 text-emerald-500" />
                            NEO Verified
                        </Badge>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Info className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="relative flex items-center justify-center py-12">
                    {/* SVG Filters for Enamel Luster */}
                    <svg className="absolute w-0 h-0">
                        <defs>
                            <linearGradient id="healthy-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: "#f1f5f9", stopOpacity: 1 }} />
                            </linearGradient>
                            <linearGradient id="decay-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: "#ef4444", stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: "#991b1b", stopOpacity: 1 }} />
                            </linearGradient>
                            <linearGradient id="rct-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: "#fbbf24", stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: "#b45309", stopOpacity: 1 }} />
                            </linearGradient>
                            <linearGradient id="crown-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: "#d97706", stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: "#78350f", stopOpacity: 1 }} />
                            </linearGradient>
                            <linearGradient id="implant-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: "#64748b", stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: "#0f172a", stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                    </svg>

                    <TooltipProvider>
                        <div className="grid grid-cols-8 gap-4 max-w-2xl w-full">
                            {teeth.slice(0, 16).map((tooth) => {
                                const styles = getToothStyles(tooth.state);
                                return (
                                    <Tooltip key={tooth.id}>
                                        <TooltipTrigger asChild>
                                            <div
                                                onClick={() => setSelectedTooth(tooth.id)}
                                                className={cn(
                                                    "cursor-pointer transition-all duration-500 hover:scale-125 aspect-square flex flex-col items-center justify-center rounded-2xl relative",
                                                    selectedTooth === tooth.id ? "bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)] scale-110 z-20" : "hover:bg-slate-500/5"
                                                )}
                                            >
                                                <svg viewBox="0 0 40 40" className="w-[85%] h-[85%]">
                                                    <path
                                                        d="M10 15 Q 10 5, 20 5 Q 30 5, 30 15 Q 30 35, 20 35 Q 10 35, 10 15"
                                                        fill={styles.fill}
                                                        stroke={styles.stroke}
                                                        strokeWidth="1.5"
                                                        style={{ filter: styles.filter }}
                                                        className="transition-all duration-500"
                                                    />
                                                </svg>
                                                <span className="text-[10px] font-black absolute bottom-0.5 text-slate-400 group-hover:text-indigo-500">{tooth.id}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="glass-premium px-3 py-1 text-[10px] font-bold uppercase border-none">
                                            {tooth.state}
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}

                            <div className="col-span-8 flex items-center justify-center py-6 opacity-20">
                                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
                            </div>

                            {teeth.slice(16, 32).map((tooth) => {
                                const styles = getToothStyles(tooth.state);
                                return (
                                    <Tooltip key={tooth.id}>
                                        <TooltipTrigger asChild>
                                            <div
                                                onClick={() => setSelectedTooth(tooth.id)}
                                                className={cn(
                                                    "cursor-pointer transition-all duration-500 hover:scale-125 aspect-square flex flex-col items-center justify-center rounded-2xl relative",
                                                    selectedTooth === tooth.id ? "bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)] scale-110 z-20" : "hover:bg-slate-500/5"
                                                )}
                                            >
                                                <svg viewBox="0 0 40 40" className="w-[85%] h-[85%] rotate-180">
                                                    <path
                                                        d="M10 15 Q 10 5, 20 5 Q 30 5, 30 15 Q 30 35, 20 35 Q 10 35, 10 15"
                                                        fill={styles.fill}
                                                        stroke={styles.stroke}
                                                        strokeWidth="1.5"
                                                        style={{ filter: styles.filter }}
                                                        className="transition-all duration-500"
                                                    />
                                                </svg>
                                                <span className="text-[10px] font-black absolute top-0.5 text-slate-400 rotate-180">{tooth.id}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="glass-premium px-3 py-1 text-[10px] font-bold uppercase border-none">
                                            {tooth.state}
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </TooltipProvider>
                </div>

                <div className="flex justify-center gap-6 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Decay Detected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Post-RCT</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300" />
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Healthy Enamel</span>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
