"use client";

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { ToothState, ToothSurface, FDI_PERMANENT_TEETH, INITIAL_TOOTH_STATE } from '@/types/clinical';

interface ToothProps {
    state: ToothState;
    onSurfaceClick: (toothId: string, surface: keyof ToothSurface) => void;
    onStatusChange: (toothId: string, status: ToothState['status']) => void;
    size?: number;
}

const Tooth: React.FC<ToothProps> = ({ state, onSurfaceClick, size = 40 }) => {
    const { id, surfaces, status } = state;

    // SVG Paths for a stylized tooth with 5 surfaces
    // Centered at 50, 50 in a 100x100 viewBox
    const s = 100;
    const padding = 10;
    const inner = 30; // occlusal size

    const getSurfaceColor = (surface: keyof ToothSurface) => {
        if (surfaces[surface]) return status === 'decayed' ? 'fill-red-500' : 'fill-indigo-500';
        return 'fill-slate-100 hover:fill-slate-200';
    };

    if (status === 'missing') {
        return (
            <div style={{ width: size, height: size }} className="flex items-center justify-center opacity-20 relative group">
                <span className="text-[10px] font-black absolute top-0">{id}</span>
                <div className="w-full h-[1px] bg-slate-400 rotate-45 absolute" />
                <div className="w-full h-[1px] bg-slate-400 -rotate-45 absolute" />
            </div>
        );
    }

    return (
        <div style={{ width: size, height: size }} className="relative flex flex-col items-center group cursor-pointer">
            <span className="text-[8px] font-black text-slate-400 mb-0.5 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">{id}</span>
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm overflow-visible">
                {/* Tooth Outline */}
                <rect x="5" y="5" width="90" height="90" rx="15" className="fill-white stroke-slate-200 stroke-[2px]" />

                {/* Buccal (Top) */}
                <path
                    d="M 10 10 L 90 10 L 65 35 L 35 35 Z"
                    className={cn("transition-all duration-200 stroke-white stroke-[2px]", getSurfaceColor('b'))}
                    onClick={() => onSurfaceClick(id, 'b')}
                />
                {/* Lingual (Bottom) */}
                <path
                    d="M 10 90 L 90 90 L 65 65 L 35 65 Z"
                    className={cn("transition-all duration-200 stroke-white stroke-[2px]", getSurfaceColor('l'))}
                    onClick={() => onSurfaceClick(id, 'l')}
                />
                {/* Mesial (Left/Right depending on quadrant - simplified to Left for now) */}
                <path
                    d="M 10 10 L 10 90 L 35 65 L 35 35 Z"
                    className={cn("transition-all duration-200 stroke-white stroke-[2px]", getSurfaceColor('m'))}
                    onClick={() => onSurfaceClick(id, 'm')}
                />
                {/* Distal (Right) */}
                <path
                    d="M 90 10 L 90 90 L 65 65 L 65 35 Z"
                    className={cn("transition-all duration-200 stroke-white stroke-[2px]", getSurfaceColor('d'))}
                    onClick={() => onSurfaceClick(id, 'd')}
                />
                {/* Occlusal (Center) */}
                <rect
                    x="35" y="35" width="30" height="30"
                    className={cn("transition-all duration-200 stroke-white stroke-[2px]", getSurfaceColor('o'))}
                    onClick={() => onSurfaceClick(id, 'o')}
                />

                {/* RCT Indicator */}
                {status === 'rct' && (
                    <line x1="50" y1="15" x2="50" y2="85" className="stroke-red-600 stroke-[4px] stroke-round opacity-80 pointer-events-none" />
                )}
            </svg>
        </div>
    );
};

export const AdultToothChart: React.FC<{
    data: Record<string, ToothState>;
    onChange: (data: Record<string, ToothState>) => void;
}> = ({ data, onChange }) => {

    const toggleSurface = (toothId: string, surface: keyof ToothSurface) => {
        const tooth = data[toothId] || INITIAL_TOOTH_STATE(toothId);
        const newState = {
            ...data,
            [toothId]: {
                ...tooth,
                surfaces: {
                    ...tooth.surfaces,
                    [surface]: !tooth.surfaces[surface]
                },
                // If any surface is selected, set status to decayed if it was healthy
                status: tooth.status === 'healthy' ? 'decayed' : tooth.status
            }
        };
        onChange(newState);
    };

    const updateStatus = (toothId: string, status: ToothState['status']) => {
        const tooth = data[toothId] || INITIAL_TOOTH_STATE(toothId);
        onChange({
            ...data,
            [toothId]: { ...tooth, status }
        });
    };

    const renderQuadrant = (ids: string[], className: string) => (
        <div className={cn("grid grid-cols-8 gap-2", className)}>
            {ids.map(id => (
                <Tooth
                    key={id}
                    state={data[id] || INITIAL_TOOTH_STATE(id)}
                    onSurfaceClick={toggleSurface}
                    onStatusChange={updateStatus}
                    size={52}
                />
            ))}
        </div>
    );

    return (
        <div className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 space-y-8 overflow-x-auto">
            {/* Upper Arch */}
            <div className="flex gap-12 justify-center min-w-[800px]">
                {renderQuadrant(FDI_PERMANENT_TEETH.UR, "justify-items-end")}
                <div className="w-[1px] bg-slate-200 my-4" />
                {renderQuadrant(FDI_PERMANENT_TEETH.UL, "justify-items-start")}
            </div>

            {/* Midline Divider */}
            <div className="h-[1px] bg-indigo-100/50 w-full relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black text-indigo-300 uppercase tracking-widest">Midline</div>
            </div>

            {/* Lower Arch */}
            <div className="flex gap-12 justify-center min-w-[800px]">
                {renderQuadrant(FDI_PERMANENT_TEETH.LR, "justify-items-end")}
                <div className="w-[1px] bg-slate-200 my-4" />
                {renderQuadrant(FDI_PERMANENT_TEETH.LL, "justify-items-start")}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-6 justify-center pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 group">
                    <div className="w-3 h-3 bg-red-500 rounded-full group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Caries</span>
                </div>
                <div className="flex items-center gap-2 group">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Restored</span>
                </div>
                <div className="flex items-center gap-2 group">
                    <div className="w-3 h-3 border-2 border-slate-300 rounded-full group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Healthy</span>
                </div>
                <div className="flex items-center gap-2 group">
                    <div className="w-3 h-0.5 bg-red-600 group-hover:scale-x-125 transition-transform" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RCT Done</span>
                </div>
            </div>
        </div>
    );
};
