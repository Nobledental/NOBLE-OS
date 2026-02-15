"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { ToothState, FDI_PERMANENT_TEETH } from '@/types/clinical';
import { Check, AlertCircle, X } from 'lucide-react';

interface GeneralizedToothChartProps {
    data: Record<string, ToothState>;
    selectedTooth: string | null;
    onToothClick: (toothId: string) => void;
    onStatusChange: (toothId: string, status: ToothState['status']) => void;
}

const SimpleTooth: React.FC<{
    id: string;
    state: ToothState;
    isSelected: boolean;
    onClick: () => void;
}> = ({ id, state, isSelected, onClick }) => {
    const { status } = state;

    let statusColor = "bg-white border-slate-200";
    let statusIcon = null;

    switch (status) {
        case 'decayed':
            statusColor = "bg-red-50 border-red-200 text-red-600";
            statusIcon = <AlertCircle className="w-3 h-3" />;
            break;
        case 'restored':
            statusColor = "bg-indigo-50 border-indigo-200 text-indigo-600";
            statusIcon = <Check className="w-3 h-3" />;
            break;
        case 'missing':
            statusColor = "bg-slate-100 border-slate-200 text-slate-400 opacity-50";
            statusIcon = <X className="w-3 h-3" />;
            break;
        case 'rct':
            statusColor = "bg-emerald-50 border-emerald-200 text-emerald-600";
            statusIcon = <div className="text-[8px] font-bold">RCT</div>;
            break;
        default: // healthy
            statusColor = "bg-white border-slate-200 hover:border-indigo-300";
            break;
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-10 h-12 rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-all duration-200 relative",
                statusColor,
                isSelected ? "ring-2 ring-indigo-500 ring-offset-2 border-indigo-500 z-10 scale-110 shadow-md" : "hover:scale-105"
            )}
        >
            <span className={cn("text-[10px] font-bold", status === 'decayed' ? "text-red-600" : "text-slate-500")}>
                {id}
            </span>
            {statusIcon}
        </button>
    );
};

export const GeneralizedToothChart: React.FC<GeneralizedToothChartProps> = ({
    data,
    selectedTooth,
    onToothClick,
}) => {
    // Helper to get tooth state or default
    const getTooth = (id: string) => data[id] || { id, surfaces: { m: false, o: false, d: false, b: false, l: false }, status: 'healthy', notes: '' };

    const renderQuadrant = (ids: string[], label: string) => (
        <div className="flex gap-2 p-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200/60">
            {/* <span className="text-[9px] uppercase tracking-widest text-slate-400 rotate-180 writing-mode-vertical">{label}</span> */}
            <div className="grid grid-cols-8 gap-2">
                {ids.map(id => (
                    <SimpleTooth
                        key={id}
                        id={id}
                        state={getTooth(id)}
                        isSelected={selectedTooth === id}
                        onClick={() => onToothClick(id)}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-center gap-8">
                {/* Upper Arch */}
                <div className="flex gap-4">
                    {renderQuadrant(FDI_PERMANENT_TEETH.UR, "UR")}
                    <div className="w-[1px] bg-slate-200" />
                    {renderQuadrant(FDI_PERMANENT_TEETH.UL, "UL")}
                </div>
            </div>

            <div className="flex items-center justify-center gap-4">
                <div className="h-[1px] bg-slate-200 w-32" />
                <span className="text-[10px] uppercase font-black text-slate-300 tracking-[0.2em]">Midline</span>
                <div className="h-[1px] bg-slate-200 w-32" />
            </div>

            <div className="flex justify-center gap-8">
                {/* Lower Arch */}
                <div className="flex gap-4">
                    {renderQuadrant(FDI_PERMANENT_TEETH.LR, "LR")}
                    <div className="w-[1px] bg-slate-200" />
                    {renderQuadrant(FDI_PERMANENT_TEETH.LL, "LL")}
                </div>
            </div>
        </div>
    );
};
