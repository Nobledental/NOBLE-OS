"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeatmapProps {
    data?: number[];
}

export function BottleneckHeatmap({ data }: HeatmapProps) {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const heatmapData = data || [0, 0, 0, 0, 0, 0, 0, 2, 8, 15, 22, 18, 10, 12, 25, 30, 20, 15, 5, 2, 0, 0, 0, 0];

    const getIntensity = (val: number) => {
        if (val === 0) return "bg-slate-50";
        if (val < 5) return "bg-indigo-100 dark:bg-indigo-900/20";
        if (val < 15) return "bg-indigo-300 dark:bg-indigo-800/40";
        if (val < 25) return "bg-indigo-500 dark:bg-indigo-700/60";
        return "bg-indigo-700 dark:bg-indigo-500 animate-pulse-slow";
    };

    return (
        <Card className="h-full border-none shadow-sm bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-bold">Noble Bottleneck Heatmap</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Peak congestion hours (Last 30 days)</p>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${getIntensity(i * 6 - 1)}`} />
                    ))}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-12 gap-1 px-1">
                        <TooltipProvider>
                            {hours.map((h) => (
                                <Tooltip key={h}>
                                    <TooltipTrigger asChild>
                                        <div className={`h-12 rounded-md transition-all cursor-crosshair border border-white/10 ${getIntensity(heatmapData[h])}`} />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="text-[10px] font-bold">
                                            {h % 12 || 12} {h < 12 ? 'AM' : 'PM'}
                                            <div className="text-muted-foreground">{heatmapData[h]} Patients Avg.</div>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </TooltipProvider>
                    </div>
                    <div className="flex justify-between text-[8px] font-bold text-muted-foreground px-2 uppercase tracking-widest">
                        <span>12 AM</span>
                        <span>Midday</span>
                        <span>11 PM</span>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-xs font-bold text-red-700 dark:text-red-400">Revenue Leakage Detected</h4>
                        <p className="text-[10px] text-red-600/80 dark:text-red-400/80 mt-1">
                            In the last 24h, 8 units of &quot;Nano-Hybrid Composite&quot; were used but only 5 were billed. Potential leakage: ₹4,200.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-dashed">
                    <Info className="h-4 w-4 text-slate-400" />
                    <p className="text-[10px] text-slate-500">
                        Leapfrog Strategy: Optimization suggested for 3:00 PM slot due to high consistent congestion.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
