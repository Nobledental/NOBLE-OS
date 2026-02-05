"use client";

import React, { useState, useRef } from "react";
import { RadialMenu } from "@/components/ui/radial-menu";
import { cn } from "@/lib/utils";
import { Scissors, Hammer, Syringe, PenTool } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner or similar toast exists, or I'll just console log/alert

interface ToothData {
    id: number;
    status: "healthy" | "extracted" | "filled" | "rct";
    notes?: string;
}

export function DentalMap() {
    const [teeth, setTeeth] = useState<ToothData[]>(
        Array.from({ length: 32 }, (_, i) => ({ id: i + 1, status: "healthy" }))
    );
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedToothId, setSelectedToothId] = useState<number | null>(null);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleToothClick = (e: React.MouseEvent, id: number) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setMenuPos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
        setSelectedToothId(id);
        setMenuOpen(true);
    };

    const updateToothStatus = (status: ToothData["status"]) => {
        if (selectedToothId === null) return;

        setTeeth(prev => prev.map(t =>
            t.id === selectedToothId ? { ...t, status } : t
        ));
        setMenuOpen(false);
        // toast.success(`Tooth #${selectedToothId} marked as ${status}`);
    };

    const actions = [
        {
            id: "extract",
            label: "Extract",
            icon: <Scissors className="w-5 h-5" />,
            onClick: () => updateToothStatus("extracted"),
            color: "bg-red-500"
        },
        {
            id: "rct",
            label: "RCT",
            icon: <Hammer className="w-5 h-5" />,
            onClick: () => updateToothStatus("rct"),
            color: "bg-amber-500"
        },
        {
            id: "fill",
            label: "Restoration",
            icon: <PenTool className="w-5 h-5" />,
            onClick: () => updateToothStatus("filled"),
            color: "bg-blue-500"
        },
        {
            id: "injection",
            label: "Anesthesia",
            icon: <Syringe className="w-5 h-5" />,
            onClick: () => console.log("Anesthesia"),
            color: "bg-emerald-500"
        },
    ];

    // Simple Arches Layout
    const upperArch = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    const lowerArch = [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17];

    return (
        <div className="relative w-full h-full min-h-[500px] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-xl overflow-hidden" ref={containerRef}>

            <RadialMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                actions={actions}
                position={menuPos}
            />

            <div className="flex flex-col gap-12">
                {/* Upper Arch */}
                <div className="flex gap-2 justify-center">
                    {upperArch.map(id => {
                        const tooth = teeth.find(t => t.id === id);
                        return (
                            <Tooth
                                key={id}
                                id={id}
                                status={tooth?.status || "healthy"}
                                onClick={(e) => handleToothClick(e, id)}
                            />
                        );
                    })}
                </div>

                {/* Lower Arch */}
                <div className="flex gap-2 justify-center">
                    {lowerArch.map(id => {
                        const tooth = teeth.find(t => t.id === id);
                        return (
                            <Tooth
                                key={id}
                                id={id}
                                status={tooth?.status || "healthy"}
                                onClick={(e) => handleToothClick(e, id)}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="absolute bottom-4 left-4 text-xs text-slate-400">
                <p>Click on a tooth to simulate "Zero-Type" Charting</p>
            </div>
        </div>
    );
}

function Tooth({ id, status, onClick }: { id: number, status: string, onClick: (e: React.MouseEvent) => void }) {
    const colors = {
        healthy: "bg-slate-100 hover:bg-slate-200 text-slate-700",
        extracted: "bg-red-900/20 border-red-500 text-red-500 line-through opacity-50",
        filled: "bg-blue-100 border-blue-500 text-blue-700",
        rct: "bg-amber-100 border-amber-500 text-amber-700",
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-10 h-14 rounded-md border-2 border-transparent transition-all duration-200 flex items-center justify-center font-bold text-sm shadow-sm",
                colors[status as keyof typeof colors]
            )}
        >
            {id}
        </button>
    );
}
