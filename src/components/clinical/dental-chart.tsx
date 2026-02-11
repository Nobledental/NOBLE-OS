"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type ToothState = "HEALTHY" | "RCT" | "CROWN" | "IMPLANT" | "DECAY"

interface ToothData {
    id: number
    state: ToothState
    note?: string
}

const INITIAL_TEETH: ToothData[] = Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    state: "HEALTHY",
}))

export function DentalChart() {
    const [teeth, setTeeth] = useState<ToothData[]>(INITIAL_TEETH)
    const [selectedTooth, setSelectedTooth] = useState<number | null>(null)

    // Inventory-EMR Handshake Logic
    const triggerHandshake = (procedure: ToothState) => {
        // 1. Mock Stock Deduction (Master Blueprint)
        console.log(`[INVENTORY] Triggered deduction for: ${procedure} Kit`);

        // 2. Mock Billing Update (Master Blueprint - Auto-Bundling)
        const costs: Record<string, number> = {
            "RCT": 4500,
            "CROWN": 8000,
            "IMPLANT": 25000,
            "DECAY": 1200
        };

        const cost = costs[procedure] || 0;
        const gst = Math.round(cost * 0.12); // Standard 12% GST (Master Blueprint)

        console.log(`[BILLING] Added to Treatment Plan: ${procedure} - Base: ₹${cost}, GST: ₹${gst}`);
    }

    const updateTooth = (id: number, state: ToothState) => {
        setTeeth(prev => prev.map(t => t.id === id ? { ...t, state } : t))
        if (state !== "HEALTHY") {
            triggerHandshake(state);
        }
    }

    const getToothColor = (state: ToothState) => {
        switch (state) {
            case "RCT": return "fill-amber-400 stroke-amber-600"
            case "CROWN": return "fill-yellow-600 stroke-yellow-700"
            case "IMPLANT": return "fill-slate-600 stroke-slate-800"
            case "DECAY": return "fill-red-500 stroke-red-700"
            default: return "fill-white stroke-slate-300"
        }
    }

    return (
        <div className="p-6 bg-white rounded-xl border shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold">Interactive Dental Mapper</h3>
                    <p className="text-xs text-muted-foreground">Click a tooth to view/edit clinical state</p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="text-[10px] bg-slate-50">FDI System</Badge>
                    <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200">2D View</Badge>
                </div>
            </div>

            <TooltipProvider>
                <div className="grid grid-cols-8 gap-1 mb-8 max-w-2xl mx-auto">
                    {/* Upper Arch */}
                    {teeth.slice(0, 16).map((tooth) => (
                        <Tooltip key={tooth.id}>
                            <TooltipTrigger asChild>
                                <div
                                    onClick={() => setSelectedTooth(tooth.id)}
                                    className={cn(
                                        "cursor-pointer transition-all hover:scale-110 aspect-square flex flex-col items-center justify-center border rounded-md relative",
                                        selectedTooth === tooth.id ? "ring-2 ring-indigo-500 border-transparent shadow-md" : "hover:border-indigo-300"
                                    )}
                                >
                                    <svg viewBox="0 0 40 40" className="w-full h-full p-2">
                                        <path
                                            d="M10 15 Q 10 5, 20 5 Q 30 5, 30 15 Q 30 35, 20 35 Q 10 35, 10 15"
                                            className={getToothColor(tooth.state)}
                                            strokeWidth="1.5"
                                        />
                                        {/* Visual Indicators for states */}
                                        {tooth.state === "RCT" && <circle cx="20" cy="20" r="4" fill="white" opacity="0.5" />}
                                        {tooth.state === "IMPLANT" && <path d="M15 10 L 25 10 M 20 10 L 20 30" stroke="white" strokeWidth="2" />}
                                    </svg>
                                    <span className="text-[8px] font-bold absolute bottom-0.5 text-slate-400">{tooth.id}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs font-bold">Tooth {tooth.id}</p>
                                <p className="text-[10px] opacity-80 uppercase">{tooth.state}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}

                    {/* Separation */}
                    <div className="col-span-8 h-4" />

                    {/* Lower Arch */}
                    {teeth.slice(16, 32).map((tooth) => (
                        <Tooltip key={tooth.id}>
                            <TooltipTrigger asChild>
                                <div
                                    onClick={() => setSelectedTooth(tooth.id)}
                                    className={cn(
                                        "cursor-pointer transition-all hover:scale-110 aspect-square flex flex-col items-center justify-center border rounded-md relative",
                                        selectedTooth === tooth.id ? "ring-2 ring-indigo-500 border-transparent shadow-md" : "hover:border-indigo-300"
                                    )}
                                >
                                    <svg viewBox="0 0 40 40" className="w-full h-full p-2 rotate-180">
                                        <path
                                            d="M10 15 Q 10 5, 20 5 Q 30 5, 30 15 Q 30 35, 20 35 Q 10 35, 10 15"
                                            className={getToothColor(tooth.state)}
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                    <span className="text-[8px] font-bold absolute bottom-0.5 text-slate-400 rotate-180">{tooth.id}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs font-bold">Tooth {tooth.id}</p>
                                <p className="text-[10px] opacity-80 uppercase">{tooth.state}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>

            {/* Selected Tooth Controls */}
            {selectedTooth && (
                <div className="mt-6 pt-6 border-t animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold flex items-center">
                            Target: <span className="text-indigo-600 ml-1">Tooth {selectedTooth}</span>
                        </h4>
                        <div className="flex gap-2">
                            <button
                                onClick={() => updateTooth(selectedTooth, "HEALTHY")}
                                className="px-2 py-1 text-[10px] bg-slate-100 rounded hover:bg-slate-200"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {(["DECAY", "RCT", "CROWN", "IMPLANT"] as ToothState[]).map((state) => (
                            <button
                                key={state}
                                onClick={() => updateTooth(selectedTooth, state)}
                                className={cn(
                                    "p-3 rounded-lg border text-left transition-all",
                                    teeth.find(t => t.id === selectedTooth)?.state === state
                                        ? "bg-indigo-600 text-white border-transparent ring-2 ring-indigo-200"
                                        : "hover:bg-slate-50"
                                )}
                            >
                                <div className="font-bold text-xs">{state}</div>
                                <div className="text-[10px] opacity-70">Mark as clinical {state.toLowerCase()}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="mt-8 flex items-center gap-4 text-[10px] border-t pt-4 text-slate-500">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" /> Decay
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" /> RCT
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-600" /> Crown
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Implant
                </div>
            </div>
        </div>
    )
}
