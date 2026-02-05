import { GlassCard } from "@/components/ui/glass-card";
import { AlertTriangle, Clock, Activity, Heart, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientHUDProps {
    patientName: string;
    patientId: string;
    vitals: {
        bp: string;
        hr: number;
        spo2: number;
        temp: number;
    };
    risks: string[];
}

export function PatientHUD({ patientName, patientId, vitals, risks }: PatientHUDProps) {
    return (
        <div className="w-full space-y-4">
            {/* Top Alert Bar (Contextual) */}
            {risks.length > 0 && (
                <div className="flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
                    {risks.map((risk, i) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-sm font-semibold backdrop-blur-md">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{risk}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Main HUD Strip */}
            <GlassCard className="p-4 flex items-center justify-between" intensity="high">
                {/* Patient Info */}
                <div className="flex items-center gap-4 pl-2">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg font-bold">
                        {patientName.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">{patientName}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{patientId}</p>
                    </div>
                </div>

                {/* Vitals Grid */}
                <div className="flex items-center gap-6 px-4 border-l border-r border-white/10 mx-4">
                    <div className="text-center group cursor-pointer">
                        <div className="flex items-center gap-1 justify-center text-slate-500 text-xs uppercase tracking-wider mb-1 group-hover:text-rose-500 transition-colors">
                            <Heart className="w-3 h-3" /> BPM
                        </div>
                        <div className="text-2xl font-black font-mono flex items-baseline gap-1">
                            {vitals.hr} <span className="text-base font-normal text-muted-foreground">bpm</span>
                        </div>
                    </div>

                    <div className="text-center group cursor-pointer">
                        <div className="flex items-center gap-1 justify-center text-slate-500 text-xs uppercase tracking-wider mb-1 group-hover:text-cyan-500 transition-colors">
                            <Activity className="w-3 h-3" /> BP
                        </div>
                        <div className="text-2xl font-black font-mono flex items-baseline gap-1 text-cyan-600 dark:text-cyan-400">
                            {vitals.bp}
                        </div>
                    </div>

                    <div className="text-center group cursor-pointer">
                        <div className="flex items-center gap-1 justify-center text-slate-500 text-xs uppercase tracking-wider mb-1 group-hover:text-emerald-500 transition-colors">
                            <Thermometer className="w-3 h-3" /> SpO2
                        </div>
                        <div className="text-2xl font-black font-mono flex items-baseline gap-1 text-emerald-600 dark:text-emerald-400">
                            {vitals.spo2}%
                        </div>
                    </div>
                </div>

                {/* Timeline Scrubber (Placeholder) */}
                <div className="flex-1 flex flex-col justify-center px-4">
                    <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-2">
                        <span>Past Visits</span>
                        <span className="text-blue-500">Live</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative group cursor-pointer">
                        <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-indigo-500/20 to-indigo-500" />
                        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-white rounded-full shadow-lg -translate-y-1/2 -translate-x-1/2 group-hover:scale-125 transition-transform" />
                    </div>
                </div>

                {/* Timer */}
                <div className="pl-4 border-l border-white/10 flex items-center gap-2 text-slate-400 font-mono text-sm">
                    <Clock className="w-4 h-4" />
                    12:04
                </div>
            </GlassCard>
        </div>
    );
}
