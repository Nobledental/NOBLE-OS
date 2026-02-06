"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Baby,
    Calendar,
    Smile,
    ChevronRight,
    TrendingUp,
    Activity,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface EruptionMilestone {
    tooth: string;
    expectedAge: string;
    isErupted: boolean;
    date?: Date;
}

const PRIMARY_TEETH_ERUPTION: EruptionMilestone[] = [
    { tooth: "Lower Central Incisor", expectedAge: "6-10 months", isErupted: false },
    { tooth: "Upper Central Incisor", expectedAge: "8-12 months", isErupted: false },
    { tooth: "Upper Lateral Incisor", expectedAge: "9-13 months", isErupted: false },
    { tooth: "Lower Lateral Incisor", expectedAge: "10-16 months", isErupted: false },
    { tooth: "Upper First Molar", expectedAge: "13-19 months", isErupted: false },
    { tooth: "Lower First Molar", expectedAge: "14-18 months", isErupted: false },
    { tooth: "Upper Canine", expectedAge: "16-22 months", isErupted: false },
    { tooth: "Lower Canine", expectedAge: "17-23 months", isErupted: false },
];

export function DentalGrowthHub() {
    const [milestones, setMilestones] = useState(PRIMARY_TEETH_ERUPTION);

    const toggleMilestone = (idx: number) => {
        const next = [...milestones];
        next[idx].isErupted = !next[idx].isErupted;
        next[idx].date = next[idx].isErupted ? new Date() : undefined;
        setMilestones(next);
    };

    const eruptedCount = milestones.filter(m => m.isErupted).length;
    const progress = (eruptedCount / milestones.length) * 100;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center">
                        <Baby className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Pediatric Growth Hub</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tooth Eruption Timeline</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completion</p>
                    <p className="text-lg font-black text-pink-600 italic">{Math.round(progress)}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Dashboard */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 rounded-[2.5rem] bg-slate-900 text-white shadow-xl shadow-slate-200">
                        <div className="flex flex-col h-full justify-between gap-8">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Development Status</h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black italic">{eruptedCount}</span>
                                    <span className="text-sm font-bold opacity-60">/ {milestones.length} Teeth</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-pink-500"
                                    />
                                </div>
                                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                                    Tracking primary dentition progress according to pediatric averages.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-amber-800">Delayed Eruption?</span>
                            <p className="text-[10px] font-bold text-amber-700 leading-relaxed mt-1">
                                If first tooth doesn't appear by 12 months, suggest a pediatric consult for possible systemic evaluation.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Milestone List */}
                <Card className="lg:col-span-2 p-8 rounded-[3rem] border-slate-100 bg-white">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eruption Registry</h4>
                        <div className="flex gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {milestones.map((m, idx) => (
                            <button
                                key={m.tooth}
                                onClick={() => toggleMilestone(idx)}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl transition-all border group text-left",
                                    m.isErupted
                                        ? "bg-emerald-50 border-emerald-100 shadow-sm"
                                        : "bg-slate-50 border-transparent hover:border-slate-200"
                                )}
                            >
                                <div className="space-y-1">
                                    <h5 className={cn(
                                        "text-xs font-black transition-colors",
                                        m.isErupted ? "text-emerald-900" : "text-slate-700"
                                    )}>{m.tooth}</h5>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Avg: {m.expectedAge}</p>
                                </div>

                                <div className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                                    m.isErupted
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-110"
                                        : "bg-white text-slate-300 group-hover:scale-110"
                                )}>
                                    <Activity className="w-4 h-4" />
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
