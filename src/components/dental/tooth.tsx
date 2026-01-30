"use client";

import { useChairStore, ToothStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

interface ToothProps {
    id: number;
    x: number;
    y: number;
    label?: string;
    isLower?: boolean; // Flipped for lower arch
}

export function Tooth({ id, x, y, label, isLower }: ToothProps) {
    const { selectedTeeth, selectTooth, teeth } = useChairStore();
    const isSelected = selectedTeeth.includes(id);
    const status = teeth[id]?.status || 'healthy';

    // SVG Paths (Simplified Generic Molar for MVP Demo)
    // In production, we would map specific paths for Incisors, Canines, Molars

    const crownPath = "M10 2 Q 20 0, 30 2 L 35 15 Q 20 20, 5 15 Z";
    const rootPath = "M5 15 L 10 40 Q 20 45, 30 40 L 35 15";
    const nervePath = "M15 20 L 15 35 M 25 20 L 25 35"; // Inner canals

    // Status Colors
    const getFill = (s: ToothStatus) => {
        switch (s) {
            case 'decay': return 'fill-amber-400';
            case 'filled': return 'fill-slate-400';
            case 'rct': return 'fill-transparent stroke-red-500 stroke-2';
            case 'crown': return 'fill-yellow-100 stroke-yellow-500';
            case 'missing': return 'opacity-20';
            default: return 'fill-white';
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        // Cmd/Ctrl click for multi-select
        selectTooth(id, e.ctrlKey || e.metaKey);
    };

    return (
        <g
            transform={`translate(${x}, ${y}) ${isLower ? 'scale(1, -1) translate(0, -50)' : ''}`}
            onClick={handleClick}
            className={cn(
                "cursor-pointer transition-all hover:scale-105 active:scale-95 group",
                isSelected && "filter drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
            )}
        >
            {/* Root Layer */}
            <path
                d={rootPath}
                className={cn("stroke-slate-300 fill-slate-100 group-hover:stroke-slate-400", isSelected && "stroke-blue-400")}
                strokeWidth="1.5"
            />

            {/* Nerve Layer (Only visible in X-Ray mode or RCT) */}
            {(status === 'rct' || status === 'healthy') && (
                <path d={nervePath} className="stroke-rose-300 fill-none opacity-50" strokeWidth="1" />
            )}

            {/* Crown Layer */}
            <path
                d={crownPath}
                className={cn(
                    "stroke-slate-300 group-hover:stroke-slate-400",
                    getFill(status),
                    isSelected && "stroke-blue-500 stroke-[2px]"
                )}
                strokeWidth="1.5"
            />

            {/* Label */}
            <text
                x="20"
                y="-10"
                className={cn(
                    "text-[10px] fill-slate-400 select-none",
                    isLower && "scale-y-[-1] translate-y-[-20]"
                )}
                textAnchor="middle"
            >
                {id}
            </text>

            {/* RCT Visualization (Red Canals) */}
            {status === 'rct' && (
                <path d={nervePath} className="stroke-red-600 fill-none" strokeWidth="2" />
            )}
        </g>
    );
}
