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
        <div className="space-y-10 max-w-6xl mx-auto p-4 md:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                            <ShieldCheck className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter text-slate-800 italic">Sterilization Hub</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Armamentarium Safety Center</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="h-20 bg-white rounded-3xl border border-slate-100 shadow-sm px-6 flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Cycles</p>
                            <p className="text-2xl font-black italic text-amber-500">{activeCycles}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                            <Flame className="w-5 h-5 text-amber-500" />
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsCreating(true)}
                        className="h-20 px-8 rounded-3xl bg-slate-900 text-white font-black italic uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 gap-3"
                    >
                        <Plus className="w-6 h-6" />
                        New Cycle
                    </Button>
                </div>
            </div>

            {/* Active Monitoring */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Current Batches</h3>
                        <Badge variant="outline" className="rounded-full px-3 text-[8px] font-black uppercase tracking-widest bg-slate-50 border-slate-200">
                            Real-time Sync
                        </Badge>
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
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="group"
                                    >
                                        <Card className="rounded-[2.5rem] border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/5 transition-all p-8 border-b-4 border-b-slate-100">
                                            <div className="flex flex-col md:flex-row gap-8">
                                                <div className="flex-1 space-y-6">
                                                    <div className="flex items-start justify-between">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <Badge className={cn("rounded-lg px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white border-none", Config.color)}>
                                                                    {Config.label}
                                                                </Badge>
                                                                <span className="text-[10px] font-bold text-slate-300">#{batch.id}</span>
                                                            </div>
                                                            <h4 className="text-xl font-black text-slate-800 italic mt-2">{batch.name}</h4>
                                                        </div>
                                                        <div className={cn(
                                                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                                                            batch.status === 'PROCESSING' ? "bg-amber-50 animate-pulse" : "bg-slate-50"
                                                        )}>
                                                            <Icon className={cn("w-6 h-6", Config.color.replace('bg-', 'text-'))} />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {batch.kits.map((kit, i) => (
                                                            <div key={i} className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{kit}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Machine</p>
                                                            <p className="text-[10px] font-bold text-slate-600 tracking-tight">{batch.machineId}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Started At</p>
                                                            <p className="text-[10px] font-bold text-slate-600 tracking-tight">
                                                                {batch.startTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '--:--'}
                                                            </p>
                                                        </div>
                                                        {batch.temperature && (
                                                            <div className="space-y-1">
                                                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Temp / Pressure</p>
                                                                <p className="text-[10px] font-bold text-slate-600 tracking-tight">{batch.temperature}°C / {batch.pressure} bar</p>
                                                            </div>
                                                        )}
                                                        {batch.verifiedBy && (
                                                            <div className="space-y-1">
                                                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Verified By</p>
                                                                <p className="text-[10px] font-bold text-slate-600 tracking-tight">{batch.verifiedBy}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="w-full md:w-48 flex md:flex-col justify-center items-center gap-4">
                                                    {batch.status === 'PROCESSING' && (
                                                        <Button
                                                            onClick={() => finishCycle(batch.id)}
                                                            className="w-full h-14 rounded-2xl bg-amber-500 text-white font-black uppercase tracking-widest text-[9px] hover:bg-amber-600"
                                                        >
                                                            Finish Cycle
                                                        </Button>
                                                    )}
                                                    {batch.status === 'COMPLETED' && (
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedBatch(batch);
                                                                setIsVerifying(true);
                                                            }}
                                                            className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-[9px] hover:bg-indigo-700"
                                                        >
                                                            Verify Logs
                                                        </Button>
                                                    )}
                                                    {batch.status === 'APPROVED' && (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                                                <Check className="w-6 h-6 text-emerald-600" />
                                                            </div>
                                                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Validated</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <Card className="p-8 rounded-[3rem] bg-indigo-900 text-white shadow-2xl shadow-indigo-200">
                        <div className="space-y-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-indigo-300" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-2xl font-black italic tracking-tighter">Compliance Score</h4>
                                <p className="text-sm font-bold text-indigo-300/60 leading-relaxed">
                                    Your sterilization protocols are 98.4% compliant with NABH standards this month.
                                </p>
                            </div>
                            <div className="h-px w-full bg-white/10" />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Monthly Cycles</p>
                                    <p className="text-xl font-black italic">142</p>
                                </div>
                                <div className="text-right space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Failed Loads</p>
                                    <p className="text-xl font-black italic text-rose-400">02</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sterility Guidelines</h4>
                        <div className="space-y-4">
                            {[
                                "B-Class Autoclave: 134°C for 5 mins",
                                "Maintain Indicator Strip Logs Daily",
                                "Weekly Biological Spore Test required",
                                "Instruments must be dry before storage"
                            ].map((rule, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-5 h-5 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-600 leading-tight">{rule}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
            <Dialog open={isVerifying} onOpenChange={setIsVerifying}>
                <DialogContent className="sm:max-w-[420px] rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-indigo-600 p-8 text-white relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <h3 className="text-2xl font-black italic tracking-tighter">Cycle Verification</h3>
                        <p className="text-sm font-bold opacity-60 mt-1 uppercase tracking-widest">Batch #{selectedBatch?.id}</p>
                    </div>

                    <div className="p-8 space-y-8 bg-white">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Temp: {temp}°C</Label>
                                <span className="text-[10px] font-black text-indigo-600">Goal: 134°C</span>
                            </div>
                            <Slider
                                value={[temp]}
                                onValueChange={([v]) => setTemp(v)}
                                min={100}
                                max={150}
                                step={1}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pressure: {pressure} bar</Label>
                                <span className="text-[10px] font-black text-indigo-600">Goal: 2.1 bar</span>
                            </div>
                            <Slider
                                value={[pressure]}
                                onValueChange={([v]) => setPressure(Math.round(v * 10) / 10)}
                                min={0}
                                max={4}
                                step={0.1}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div className="space-y-0.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-800">Indicator Tape</Label>
                                <p className="text-[9px] font-bold text-slate-400">Color changed to Black?</p>
                            </div>
                            <Switch checked={indicatorPassed} onCheckedChange={setIndicatorPassed} />
                        </div>

                        <Button
                            onClick={handleVerifyBatch}
                            className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black tracking-widest uppercase text-[10px] hover:bg-black"
                        >
                            Authorize Batch
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
