"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Info, Baby, User, Users } from "lucide-react";

// --- Types ---

export type ToothState = "HEALTHY" | "RCT" | "CROWN" | "IMPLANT" | "DECAY" | "MISSING" | "EXTRACTED";
export type DentitionMode = "ADULT" | "CHILD" | "MIXED";

export interface ToothData {
    id: number; // FDI Number (e.g., 11, 51)
    state: ToothState;
    notes?: string;
}

interface UniversalToothChartProps {
    mode?: DentitionMode;
    initialTeeth?: ToothData[];
    onToothClick?: (toothId: number) => void;
    readOnly?: boolean;
    className?: string;
}

// --- FDI Data ---

// Permanent Teeth (Quadrants 1-4)
const PERMANENT_TEETH = [
    // Upper Right (Q1) - 18 to 11
    18, 17, 16, 15, 14, 13, 12, 11,
    // Upper Left (Q2) - 21 to 28
    21, 22, 23, 24, 25, 26, 27, 28,
    // Lower Right (Q4) - 48 to 41 (displayed bottom left in chart usually, but logically Q4)
    48, 47, 46, 45, 44, 43, 42, 41,
    // Lower Left (Q3) - 31 to 38
    31, 32, 33, 34, 35, 36, 37, 38
];

// Deciduous Teeth (Quadrants 5-8)
const DECIDUOUS_TEETH = [
    // Upper Right (Q5) - 55 to 51
    55, 54, 53, 52, 51,
    // Upper Left (Q6) - 61 to 65
    61, 62, 63, 64, 65,
    // Lower Right (Q8) - 85 to 81
    85, 84, 83, 82, 81,
    // Lower Left (Q7) - 71 to 75
    71, 72, 73, 74, 75
];

// SVG Paths (Simplified Generic Molar/Incisor shapes for visualization)
// We use a generic path and rotate/scale it for simplicity in this universal component
const TOOTH_PATH = "M10 15 Q 10 5, 20 5 Q 30 5, 30 15 Q 30 35, 20 35 Q 10 35, 10 15";
const ROOT_PATH = "M12 35 L 12 50 L 20 45 L 28 50 L 28 35"; // Simple root structure

// --- Components ---

export function UniversalToothChart({
    mode = "ADULT",
    initialTeeth,
    onToothClick,
    readOnly = false,
    className
}: UniversalToothChartProps) {
    const [currentMode, setCurrentMode] = useState<DentitionMode>(mode);
    const [teeth, setTeeth] = useState<ToothData[]>([]);
    const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

    // Initialize Teeth Data
    useEffect(() => {
        const allFDI = [...PERMANENT_TEETH, ...DECIDUOUS_TEETH];
        if (initialTeeth) {
            setTeeth(initialTeeth);
        } else {
            setTeeth(allFDI.map(id => ({ id, state: "HEALTHY" })));
        }
    }, [initialTeeth]);

    // Handle Click
    const handleToothClick = (id: number) => {
        if (readOnly) return;
        setSelectedTooth(id);
        onToothClick?.(id);
    };

    // Update State (Internal Helper)
    const updateToothState = (id: number, state: ToothState) => {
        setTeeth(prev => prev.map(t => t.id === id ? { ...t, state } : t));
    };

    // Visual Helpers
    const getToothColor = (state: ToothState) => {
        switch (state) {
            case "RCT": return { fill: "#fbbf24", stroke: "#b45309" }; // Amber
            case "CROWN": return { fill: "#d97706", stroke: "#78350f" }; // Orange
            case "IMPLANT": return { fill: "#475569", stroke: "#1e293b" }; // Slate
            case "DECAY": return { fill: "#ef4444", stroke: "#991b1b" }; // Red
            case "MISSING": return { fill: "#f1f5f9", stroke: "#cbd5e1", opacity: 0.3 }; // Ghost
            case "EXTRACTED": return { fill: "#000000", stroke: "#000000", opacity: 0.8 }; // Black/Gone
            default: return { fill: "#ffffff", stroke: "#cbd5e1" }; // White/Healthy
        }
    };

    // Render a Single Tooth
    const renderTooth = (id: number, isDeciduous: boolean) => {
        const tooth = teeth.find(t => t.id === id) || { id, state: "HEALTHY" };
        const style = getToothColor(tooth.state as ToothState);
        const isSelected = selectedTooth === id;

        // Positioning logic for visual arch (Optional: In a real app, strict SVG coordinates per tooth are better)
        // Here we render them in a grid/flex layout for simplicity but styled as an arch

        return (
            <Tooltip key={id}>
                <TooltipTrigger asChild>
                    <div
                        onClick={() => handleToothClick(id)}
                        className={cn(
                            "relative flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group",
                            isSelected ? "scale-110 z-10" : "hover:scale-105",
                            isDeciduous ? "w-8 h-8" : "w-10 h-10"
                        )}
                    >
                        {/* Tooth SVG */}
                        <svg viewBox="0 0 40 60" className="w-full h-full drop-shadow-sm">
                            <g transform={id >= 30 && id <= 48 || id >= 70 && id <= 85 ? "scale(1, -1) translate(0, -60)" : ""}>
                                {/* Root */}
                                <path d={ROOT_PATH} fill={style.fill} stroke={style.stroke} strokeWidth="1.5" className="opacity-80" />
                                {/* Crown */}
                                <path d={TOOTH_PATH} fill={style.fill} stroke={style.stroke} strokeWidth="1.5" />

                                {/* Visual Markers */}
                                {tooth.state === "RCT" && <path d="M20 10 L 20 45" stroke="white" strokeWidth="2" strokeDasharray="2 2" />}
                                {tooth.state === "IMPLANT" && <rect x="15" y="25" width="10" height="25" fill="#334155" />}
                                {tooth.state === "MISSING" && <line x1="10" y1="10" x2="30" y2="35" stroke="#94a3b8" strokeWidth="2" />}
                            </g>
                        </svg>

                        {/* FDI Number */}
                        <span className={cn(
                            "absolute text-[8px] font-bold text-slate-400 group-hover:text-indigo-600",
                            id >= 30 && id <= 48 || id >= 70 && id <= 85 ? "-bottom-4" : "-top-4" // Simple logic for number placement
                        )}>
                            {id}
                        </span>

                        {/* Selection Ring */}
                        {isSelected && (
                            <div className="absolute inset-0 rounded-full ring-2 ring-indigo-500 ring-offset-2 animate-pulse" />
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="font-bold text-xs">{isDeciduous ? "Deciduous" : "Permanent"} #{id}</p>
                    <p className="text-[10px] uppercase text-slate-500">{tooth.state}</p>
                </TooltipContent>
            </Tooltip>
        );
    };

    return (
        <div className={cn("p-6 bg-white rounded-[2rem] border border-slate-200 shadow-xl", className)}>
            {/* Header / Controls */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" />
                        Dental Chart
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                        FDI Notation • {currentMode} Dentition
                    </p>
                </div>

                {!readOnly && (
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {(["ADULT", "MIXED", "CHILD"] as DentitionMode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => setCurrentMode(m)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                                    currentMode === m ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                {m === "ADULT" && <User className="w-3 h-3 inline mr-1" />}
                                {m === "CHILD" && <Baby className="w-3 h-3 inline mr-1" />}
                                {m === "MIXED" && <Users className="w-3 h-3 inline mr-1" />}
                                {m}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <TooltipProvider>
                <div className="space-y-12">
                    {/* ADULT / MIXED ARCH */}
                    {(currentMode === "ADULT" || currentMode === "MIXED") && (
                        <div className="space-y-2">
                            {/* Upper Permanent (18-11, 21-28) */}
                            <div className="flex justify-center gap-1">
                                {PERMANENT_TEETH.slice(0, 8).map(id => renderTooth(id, false))}
                                <div className="w-6 border-r border-slate-200 mx-2" /> {/* Midline */}
                                {PERMANENT_TEETH.slice(8, 16).map(id => renderTooth(id, false))}
                            </div>

                            {/* Lower Permanent (48-41, 31-38) */}
                            <div className="flex justify-center gap-1 pt-4">
                                {PERMANENT_TEETH.slice(16, 24).map(id => renderTooth(id, false))}
                                <div className="w-6 border-r border-slate-200 mx-2" /> {/* Midline */}
                                {PERMANENT_TEETH.slice(24, 32).map(id => renderTooth(id, false))}
                            </div>
                        </div>
                    )}

                    {/* CHILD / MIXED ARCH */}
                    {(currentMode === "CHILD" || currentMode === "MIXED") && (
                        <div className="relative">
                            {currentMode === "MIXED" && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest text-slate-300 bg-slate-50 px-2 py-0.5 rounded-full">
                                    Deciduous
                                </div>
                            )}

                            <div className="bg-slate-50/50 p-4 rounded-3xl border border-dashed border-slate-200">
                                {/* Upper Deciduous (55-51, 61-65) */}
                                <div className="flex justify-center gap-2">
                                    {DECIDUOUS_TEETH.slice(0, 5).map(id => renderTooth(id, true))}
                                    <div className="w-4 border-r border-slate-200 mx-1" />
                                    {DECIDUOUS_TEETH.slice(5, 10).map(id => renderTooth(id, true))}
                                </div>

                                {/* Lower Deciduous (85-81, 71-75) */}
                                <div className="flex justify-center gap-2 pt-4">
                                    {DECIDUOUS_TEETH.slice(10, 15).map(id => renderTooth(id, true))}
                                    <div className="w-4 border-r border-slate-200 mx-1" />
                                    {DECIDUOUS_TEETH.slice(15, 20).map(id => renderTooth(id, true))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </TooltipProvider>

            {/* Selected Tooth Actions */}
            {selectedTooth && !readOnly && (
                <div className="mt-8 pt-6 border-t border-slate-100 animate-in slide-in-from-bottom-2 fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-slate-700">Tooth #{selectedTooth} Action</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateToothState(selectedTooth, "HEALTHY")}
                            className="text-slate-400 hover:text-slate-600 text-xs"
                        >
                            Reset
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <button
                            onClick={() => updateToothState(selectedTooth, "DECAY")}
                            className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 border border-red-100 hover:shadow-md transition-all"
                        >
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-xs font-bold uppercase">Decay</span>
                        </button>
                        <button
                            onClick={() => updateToothState(selectedTooth, "RCT")}
                            className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 hover:shadow-md transition-all"
                        >
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <span className="text-xs font-bold uppercase">RCT</span>
                        </button>
                        <button
                            onClick={() => updateToothState(selectedTooth, "CROWN")}
                            className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 text-orange-700 border border-orange-100 hover:shadow-md transition-all"
                        >
                            <div className="w-3 h-3 rounded-full bg-orange-500" />
                            <span className="text-xs font-bold uppercase">Crown</span>
                        </button>
                        <button
                            onClick={() => updateToothState(selectedTooth, "IMPLANT")}
                            className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 hover:shadow-md transition-all"
                        >
                            <div className="w-3 h-3 rounded-full bg-slate-800" />
                            <span className="text-xs font-bold uppercase">Implant</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
