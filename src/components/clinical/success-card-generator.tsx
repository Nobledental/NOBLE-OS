"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Star,
    Share2,
    Download,
    CheckCircle2,
    Sparkles,
    Camera,
    Activity,
    Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SuccessCardProps {
    patientName: string;
    procedure: string;
    doctorName: string;
    clinicName: string;
}

export function SuccessCardGenerator({
    patientName,
    procedure,
    doctorName,
    clinicName
}: SuccessCardProps) {
    const [theme, setTheme] = useState<'midnight' | 'emerald' | 'sunset'>('midnight');
    const cardRef = useRef<HTMLDivElement>(null);

    const themes = {
        midnight: "bg-slate-900 text-white",
        emerald: "bg-emerald-900 text-white",
        sunset: "bg-indigo-900 text-white",
    };

    const accents = {
        midnight: "text-indigo-400",
        emerald: "text-emerald-400",
        sunset: "text-rose-400",
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Milestone Generator</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branded Success Cards</p>
                    </div>
                </div>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                    {(['midnight', 'emerald', 'sunset'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTheme(t)}
                            className={cn(
                                "w-6 h-6 rounded-full border-2 border-white transition-all",
                                t === 'midnight' ? "bg-slate-900" : t === 'emerald' ? "bg-emerald-600" : "bg-indigo-600",
                                theme === t && "scale-125 shadow-lg"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* The Card to be exported */}
            <div ref={cardRef} className="relative group">
                <motion.div
                    layout
                    className={cn(
                        "aspect-[4/5] w-full max-w-sm mx-auto rounded-[3rem] p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl transition-colors duration-700",
                        themes[theme]
                    )}
                >
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-3xl" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-black text-xs uppercase tracking-[0.2em] opacity-60">{clinicName}</h4>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Clinical Milestone</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 space-y-4">
                            <h2 className="text-4xl font-black tracking-tighter leading-[0.9]">
                                Treatment <br />
                                <span className={accents[theme]}>Success.</span>
                            </h2>
                            <p className="text-sm font-bold text-white/50 leading-relaxed max-w-[200px]">
                                We are proud to announce the successful completion of clinical care for {patientName}.
                            </p>
                        </div>

                        <div className="mt-auto space-y-6">
                            <div className="h-px w-full bg-white/10" />
                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Procedure</p>
                                    <p className="text-lg font-black tracking-tight">{procedure}</p>
                                </div>
                                <div className="text-right space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 ml-auto">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Physician-In-Charge</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.1em]">{doctorName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button className="h-14 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all flex gap-3">
                    <Download className="w-4 h-4" />
                    Save Image
                </Button>
                <Button className="h-14 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl flex gap-3">
                    <Share2 className="w-4 h-4" />
                    Share Story
                </Button>
            </div>
        </div>
    );
}
