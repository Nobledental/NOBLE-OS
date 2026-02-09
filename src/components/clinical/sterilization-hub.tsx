"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ShieldCheck,
    Flame,
    Clock,
    CheckCircle2,
    Layers,
    AlertTriangle,
    Plus,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { PanzeCard } from "@/components/ui/panze-card";

export type SterilizationStatus = 'COLLECTING' | 'PROCESSING' | 'COMPLETED' | 'APPROVED' | 'FAILED';

export interface SterilizationBatch {
    id: string;
    name: string;
    machineId: string;
    status: SterilizationStatus;
    kits: string[];
    startTime?: Date;
    endTime?: Date;
    temperature?: number;
    pressure?: number;
    verifiedBy?: string;
}

const MOCK_BATCHES: SterilizationBatch[] = [
    {
        id: "STER-001",
        name: "Morning Surgery Load",
        machineId: "AUTOCLAVE-01",
        status: "APPROVED",
        kits: ["Surgery Kit A", "Extraction Set 1", "Implant Tools"],
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
        temperature: 134,
        pressure: 2.1,
        verifiedBy: "Asst. Priya"
    },
    {
        id: "STER-002",
        name: "Routine Examination Sets",
        machineId: "AUTOCLAVE-01",
        status: "PROCESSING",
        kits: ["Diag-1", "Diag-2", "Diag-3", "Diag-4", "Diag-5"],
        startTime: new Date(Date.now() - 15 * 60 * 1000),
    }
];

export function SterilizationHub() {
    const [batches, setBatches] = useState<SterilizationBatch[]>(MOCK_BATCHES);
    const [selectedBatch, setSelectedBatch] = useState<SterilizationBatch | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Verification Form State
    const [temp, setTemp] = useState(134);
    const [pressure, setPressure] = useState(2.1);
    const [indicatorPassed, setIndicatorPassed] = useState(true);

    const finishCycle = (batchId: string) => {
        setBatches(batches.map(b =>
            b.id === batchId ? { ...b, status: 'COMPLETED', endTime: new Date() } : b
        ));
        toast.info("Cycle completed. Awaiting verification.");
    };

    const handleVerifyBatch = () => {
        if (!selectedBatch) return;

        setBatches(batches.map(b =>
            b.id === selectedBatch.id ? {
                ...b,
                status: indicatorPassed ? 'APPROVED' : 'FAILED',
                temperature: temp,
                pressure: pressure,
                verifiedBy: 'Logged In User'
            } : b
        ));

        if (indicatorPassed) {
            toast.success("Batch approved and ready for use.");
        } else {
            toast.error("Batch failed verification. Do not use instruments.");
        }

        setIsVerifying(false);
        setSelectedBatch(null);
    };

    const statusConfig: Record<SterilizationStatus, { color: string, label: string, icon: any }> = {
        COLLECTING: { color: "bg-slate-500", label: "Collecting", icon: Layers },
        PROCESSING: { color: "bg-amber-500", label: "Sterilizing", icon: Flame },
        COMPLETED: { color: "bg-blue-500", label: "Verifying", icon: Clock },
        APPROVED: { color: "bg-emerald-500", label: "Ready / Sterile", icon: ShieldCheck },
        FAILED: { color: "bg-rose-500", label: "Failed", icon: AlertTriangle },
    };

    const activeCycles = batches.filter(b => b.status === 'PROCESSING').length;
    const pendingApprovals = batches.filter(b => b.status === 'COMPLETED').length;

    return (
        <div className="space-y-12 pb-32">
            {/* Editorial Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                    <span className="text-[10px] font-bold tracking-[0.6em] text-slate-600 uppercase border-b border-slate-200">Armamentarium Safety</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 flex items-center gap-6">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.8rem] bg-slate-100 border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm">
                            <ShieldCheck className="w-7 h-7 md:w-8 md:h-8" />
                        </div>
                        Sterilization <span className="text-slate-500 font-light translate-x-1 underline underline-offset-8 decoration-slate-200">Center</span>
                    </h1>

                    <div className="flex gap-4">
                        <div className="h-16 px-6 bg-slate-100 border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm">
                            <div className="text-right">
                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Cycles</p>
                                <p className="text-xl font-bold text-amber-600 tracking-tight">{activeCycles}</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                <Flame className="w-4 h-4 text-amber-600/60" />
                            </div>
                        </div>
                        <Button
                            onClick={() => setIsCreating(true)}
                            className="h-16 px-8 rounded-2xl bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 gap-3 transition-all duration-700 shadow-sm"
                        >
                            <Plus className="w-4 h-4 text-emerald-600" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">New Cycle</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-[1px] bg-slate-300" />
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">Current Monitoring</h3>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                            Real-time Sync
                        </div>
                    </div>

                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {batches.map((batch) => {
                                const Config = statusConfig[batch.status];
                                const Icon = Config.icon;

                                return (
                                    <motion.div
                                        key={batch.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="group"
                                    >
                                        <PanzeCard className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 transition-all duration-1000 hover:border-slate-700 shadow-2xl">
                                            {/* Silk Glow */}
                                            <div className={cn(
                                                "absolute top-0 right-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
                                                batch.status === 'PROCESSING' ? "bg-[radial-gradient(circle_at_85%_0%,_rgba(245,158,11,0.05)_0%,_transparent_75%)]" :
                                                    batch.status === 'APPROVED' ? "bg-[radial-gradient(circle_at_85%_0%,_rgba(16,185,129,0.05)_0%,_transparent_75%)]" :
                                                        "bg-[radial-gradient(circle_at_85%_0%,_rgba(59,130,246,0.05)_0%,_transparent_75%)]"
                                            )} />

                                            <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                                <div className="flex-1 space-y-8">
                                                    <div className="flex items-start justify-between">
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]", Config.color)} />
                                                                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white">{Config.label}</span>
                                                                <span className="text-[9px] font-bold text-white/80 tracking-widest border-l border-white/20 pl-2">#{batch.id}</span>
                                                            </div>
                                                            <h4 className="text-2xl font-semibold text-white tracking-tight">{batch.name}</h4>
                                                        </div>
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border border-white/20 bg-white/10 shadow-lg",
                                                            batch.status === 'PROCESSING' && "animate-pulse border-amber-500/60 shadow-amber-500/20"
                                                        )}>
                                                            <Icon className={cn("w-5 h-5", batch.status === 'PROCESSING' ? "text-amber-400" : "text-white")} />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {batch.kits.map((kit, i) => (
                                                            <div key={i} className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 flex items-center gap-3 group/kit">
                                                                <div className="w-1 h-1 rounded-full bg-white group-hover/kit:bg-white transition-colors" />
                                                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">{kit}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-4 border-t border-white/5">
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-bold text-white uppercase tracking-[0.2em] opacity-80">Equipment</p>
                                                            <p className="text-[10px] font-black text-white tracking-tight uppercase">{batch.machineId}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-bold text-white uppercase tracking-[0.2em] opacity-80">Start Time</p>
                                                            <p className="text-[10px] font-black text-white tracking-tight">
                                                                {batch.startTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '--:--'}
                                                            </p>
                                                        </div>
                                                        {batch.temperature && (
                                                            <div className="space-y-1">
                                                                <p className="text-[8px] font-bold text-white uppercase tracking-[0.2em] opacity-80">Vitals</p>
                                                                <p className="text-[10px] font-black text-white tracking-tight">{batch.temperature}°C • {batch.pressure} bar</p>
                                                            </div>
                                                        )}
                                                        {batch.verifiedBy && (
                                                            <div className="space-y-1">
                                                                <p className="text-[8px] font-bold text-white uppercase tracking-[0.2em] opacity-80">Verifier</p>
                                                                <p className="text-[10px] font-black text-white tracking-tight uppercase">{batch.verifiedBy}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="w-full md:w-56 flex md:flex-col justify-center items-center gap-4">
                                                    {batch.status === 'PROCESSING' && (
                                                        <Button
                                                            onClick={() => finishCycle(batch.id)}
                                                            className="w-full h-14 rounded-2xl bg-amber-500/10 text-amber-500/80 border border-amber-500/20 hover:bg-amber-500/20 font-bold uppercase tracking-widest text-[9px] transition-all"
                                                        >
                                                            Terminate Cycle
                                                        </Button>
                                                    )}
                                                    {batch.status === 'COMPLETED' && (
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedBatch(batch);
                                                                setIsVerifying(true);
                                                            }}
                                                            className="w-full h-14 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 font-bold uppercase tracking-widest text-[9px] transition-all"
                                                        >
                                                            Validate Safety
                                                        </Button>
                                                    )}
                                                    {batch.status === 'APPROVED' && (
                                                        <div className="flex flex-col items-center gap-4">
                                                            <div className="flex flex-col items-center gap-4">
                                                                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                                                    <Check className="w-6 h-6 text-emerald-400" />
                                                                </div>
                                                                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.4em] underline decoration-emerald-500/20 underline-offset-4">Safe for Clinical Use</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </PanzeCard>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <PanzeCard className="p-10 rounded-[3rem] bg-slate-900 border border-slate-800 shadow-2xl">
                        <div className="space-y-8">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                <ShieldCheck className="w-7 h-7 text-indigo-400/60" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-2xl font-bold text-white tracking-tight">Compliance Score</h4>
                                <p className="text-xs font-semibold text-white leading-relaxed uppercase tracking-widest opacity-90">
                                    Armamentarium protocols are 98.4% compliant with NABH standards.
                                </p>
                            </div>
                            <div className="h-px w-full bg-white/5" />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">Cycles Processed</p>
                                    <p className="text-3xl font-black text-white tracking-tighter">142</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">Safety Alerts</p>
                                    <p className="text-3xl font-black text-rose-500 tracking-tighter">02</p>
                                </div>
                            </div>
                        </div>
                    </PanzeCard>

                    <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-white/10" />
                            <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Protocol Guidelines</h4>
                        </div>
                        <div className="space-y-6">
                            {[
                                "B-Class Autoclave: 134°C (5 mins)",
                                "Daily Indicator Tape Validation",
                                "Weekly Spore Test Documentation",
                                "Dry Storage protocol mandatory"
                            ].map((rule, i) => (
                                <div key={i} className="flex gap-4 group/rule">
                                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/40 group-hover/rule:bg-emerald-500/30 transition-colors shadow-lg">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    </div>
                                    <span className="text-[11px] font-bold text-white uppercase tracking-widest leading-relaxed">{rule}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
            <Dialog open={isVerifying} onOpenChange={setIsVerifying}>
                <DialogContent className="sm:max-w-[480px] rounded-[3rem] p-0 overflow-hidden border border-white/10 bg-slate-950 shadow-2xl">
                    <div className="bg-blue-600 p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl opacity-50" />
                        <div className="relative z-10 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white">Manual Override</span>
                            <h3 className="text-3xl font-bold tracking-tight text-white mb-2">Cycle Validation</h3>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest border-t border-white/20 pt-2 inline-block">Batch Registry #{selectedBatch?.id}</p>
                        </div>
                    </div>

                    <div className="p-10 space-y-10 bg-slate-950">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <Label className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">Terminal Temp: {temp}°C</Label>
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Target 134°C</span>
                            </div>
                            <Slider
                                value={[temp]}
                                onValueChange={([v]) => setTemp(v)}
                                min={100}
                                max={150}
                                step={1}
                                className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-blue-500"
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <Label className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">Atmospheric Pressure: {pressure} bar</Label>
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Target 2.1 bar</span>
                            </div>
                            <Slider
                                value={[pressure]}
                                onValueChange={([v]) => setPressure(Math.round(v * 10) / 10)}
                                min={0}
                                max={4}
                                step={0.1}
                                className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center justify-between p-6 bg-white/10 rounded-[2rem] border border-white/20 shadow-xl">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-white">Visual Indicator</Label>
                                <p className="text-[9px] font-bold text-white/60 uppercase tracking-tighter">Has the chemical tape transformed?</p>
                            </div>
                            <Switch checked={indicatorPassed} onCheckedChange={setIndicatorPassed} className="data-[state=checked]:bg-emerald-500 scale-125" />
                        </div>

                        <Button
                            onClick={handleVerifyBatch}
                            className="w-full h-16 rounded-[2rem] bg-white text-slate-950 font-bold tracking-[0.4em] uppercase text-[10px] hover:bg-white/90 shadow-xl transition-all"
                        >
                            Authorize Batch Release
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
