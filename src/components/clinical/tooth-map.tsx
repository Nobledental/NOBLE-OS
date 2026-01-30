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

    const getToothColor = (state: ToothState) => {
        switch (state) {
            case "RCT": return "fill-amber-400 stroke-amber-600";
            case "CROWN": return "fill-yellow-600 stroke-yellow-700";
            case "IMPLANT": return "fill-slate-600 stroke-slate-800";
            case "DECAY": return "fill-red-500 stroke-red-700";
            default: return "fill-white dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">HealthFlo Map</h3>
                <div className="flex gap-2">
                    <Badge variant="outline">FDI System</Badge>
                    <Badge variant="secondary">2D Preview</Badge>
                </div>
            </div>

            <TooltipProvider>
                <div className="grid grid-cols-8 gap-2 p-8 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner">
                    {teeth.slice(0, 16).map((tooth) => (
                        <Tooltip key={tooth.id}>
                            <TooltipTrigger asChild>
                                <div
                                    onClick={() => setSelectedTooth(tooth.id)}
                                    className={cn(
                                        "cursor-pointer transition-all hover:scale-110 aspect-square flex flex-col items-center justify-center border rounded-xl relative bg-white dark:bg-slate-950",
                                        selectedTooth === tooth.id ? "ring-4 ring-indigo-500/20 border-indigo-500 shadow-lg" : "hover:border-indigo-300 border-slate-200 dark:border-slate-800"
                                    )}
                                >
                                    <svg viewBox="0 0 40 40" className="w-full h-full p-2">
                                        <path
                                            d="M10 15 Q 10 5, 20 5 Q 30 5, 30 15 Q 30 35, 20 35 Q 10 35, 10 15"
                                            className={getToothColor(tooth.state)}
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                    <span className="text-[10px] font-bold absolute bottom-1 text-slate-400">{tooth.id}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs font-bold uppercase">{tooth.state}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}

                    <div className="col-span-8 h-8 flex items-center justify-center">
                        <div className="h-[1px] w-full bg-slate-200 dark:bg-slate-800" />
                    </div>

                    {teeth.slice(16, 32).map((tooth) => (
                        <Tooltip key={tooth.id}>
                            <TooltipTrigger asChild>
                                <div
                                    onClick={() => setSelectedTooth(tooth.id)}
                                    className={cn(
                                        "cursor-pointer transition-all hover:scale-110 aspect-square flex flex-col items-center justify-center border rounded-xl relative bg-white dark:bg-slate-950",
                                        selectedTooth === tooth.id ? "ring-4 ring-indigo-500/20 border-indigo-500 shadow-lg" : "hover:border-indigo-300 border-slate-200 dark:border-slate-800"
                                    )}
                                >
                                    <svg viewBox="0 0 40 40" className="w-full h-full p-2 rotate-180">
                                        <path
                                            d="M10 15 Q 10 5, 20 5 Q 30 5, 30 15 Q 30 35, 20 35 Q 10 35, 10 15"
                                            className={getToothColor(tooth.state)}
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                    <span className="text-[10px] font-bold absolute bottom-1 text-slate-400 rotate-180">{tooth.id}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs font-bold uppercase">{tooth.state}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>
        </div>
    );
}
