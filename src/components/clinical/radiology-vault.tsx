"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";
import { Scan, Maximize2, Plus, Pin, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface PinMarker {
    id: string;
    x: number;
    y: number;
    label: string;
    remark: string;
}

export function RadiologyVault({ patientId }: { patientId: string }) {
    const [pins] = useState<PinMarker[]>([
        { id: "1", x: 45, y: 30, label: "26 Molar", remark: "Periapical radiolucency noted. Suggests chronic pulpitis." },
        { id: "2", x: 65, y: 40, label: "27 Distal", remark: "Incipient caries at the enamel-dentin junction." },
    ]);

    return (
        <GlassCard className="bg-slate-950 border-slate-800 p-8 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <Scan className="w-6 h-6 text-indigo-400" />
                        Radiology Vault
                    </h3>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">High-Contrast Diagnostic View</p>
                </div>
                <div className="flex gap-2">
                    <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">HD 2048px</Badge>
                    <Badge className="bg-slate-800 text-slate-400 border-slate-700">DICOM</Badge>
                </div>
            </div>

            <div className="relative aspect-[16/10] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                {/* Mock X-ray Image - Using a placeholder or dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900 opacity-80" />

                {/* Simulated X-ray Texture */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "4px 4px" }} />

                {/* Diagnostic Pins */}
                <TooltipProvider>
                    {pins.map((pin) => (
                        <div
                            key={pin.id}
                            className="absolute z-20 group/pin transition-all hover:scale-125"
                            style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="relative flex items-center justify-center w-8 h-8 cursor-pointer">
                                        <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" />
                                        <div className="relative w-4 h-4 rounded-full bg-indigo-500 border-2 border-white shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center border border-white">
                                            <span className="text-[6px] text-white font-bold">{pin.id}</span>
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="glass-premium border-none p-4 max-w-xs">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-indigo-500 uppercase">{pin.label}</p>
                                        <p className="text-sm font-medium leading-tight">{pin.remark}</p>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    ))}
                </TooltipProvider>

                {/* Toolbar Overlay */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full flex items-center gap-4 border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-white/20" />
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        <Plus className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        <Pin className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-white/20" />
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        <Info className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Remark Panel Placeholder */}
            <div className="mt-8 grid grid-cols-2 gap-4">
                {pins.map((pin) => (
                    <div key={pin.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase">
                            {pin.id}
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-200">{pin.label}</h4>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{pin.remark}</p>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
