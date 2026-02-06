"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Thermometer,
    Droplet,
    Clock,
    Camera,
    CheckCircle2,
    AlertCircle,
    Play,
    Square,
    User,
    Search,
    History,
    FileCheck,
    ChevronRight,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

interface SterilizationBatch {
    id: string;
    assistantName: string;
    startTime: string;
    endTime?: string;
    date: string;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'FAILED';
    room: string;
    equipmentCount: number;
    evidenceUrl?: string;
    approver?: string;
    autoclaveReading?: string;
}

export default function SterilizationHub() {
    const { role } = useAuth();
    const [batches, setBatches] = useState<SterilizationBatch[]>([
        {
            id: "ST-2026-042",
            assistantName: "Arun K.",
            startTime: "08:15 AM",
            endTime: "09:30 AM",
            date: "Feb 06, 2026",
            status: "APPROVED",
            room: "Steril-Bay A",
            equipmentCount: 24,
            evidenceUrl: "/mock/sticker.jpg",
            approver: "Dr. Dhivakaran",
            autoclaveReading: "134°C / 2.1 bar"
        },
        {
            id: "ST-2026-043",
            assistantName: "Sarah M.",
            startTime: "09:45 AM",
            date: "Feb 06, 2026",
            status: "IN_PROGRESS",
            room: "Steril-Bay B",
            equipmentCount: 12,
        }
    ]);

    const handleStartCycle = () => {
        const newBatch: SterilizationBatch = {
            id: `ST-2026-0${batches.length + 42}`,
            assistantName: "Arun K.",
            startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: "IN_PROGRESS",
            room: "Steril-Bay A",
            equipmentCount: 18,
        };
        setBatches([newBatch, ...batches]);
        toast.info("Sterilization Started", {
            description: "Cycle IN time registered successfully."
        });
    };

    const handleEndCycle = (id: string) => {
        setBatches(batches.map(b => b.id === id ? {
            ...b,
            status: 'COMPLETED',
            endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } : b));
        toast.success("Cycle Completed", {
            description: "Cycle OUT time registered. Awaiting Admin approval."
        });
    };

    const handleApprove = (id: string) => {
        setBatches(batches.map(b => b.id === id ? {
            ...b,
            status: 'APPROVED',
            approver: 'Dr. Dhivakaran',
            autoclaveReading: "134.2°C / 2.15 bar"
        } : b));
        toast.success("Batch Approved", {
            description: "Equipments are now ready for surgery."
        });
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-slate-400 text-sm mb-1 font-bold uppercase tracking-[0.2em]">Clinical Operations</p>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Armamentarium <span className="text-indigo-600">Sterilization</span></h1>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-14 px-6 rounded-2xl gap-2 font-bold border-slate-200">
                        <History className="w-5 h-5 text-slate-400" /> Logs
                    </Button>
                    {(role === 'ADMIN' || role === 'ASSISTANT') && (
                        <Button
                            onClick={handleStartCycle}
                            className="h-14 px-8 rounded-2xl bg-indigo-600 text-white font-black shadow-lg shadow-indigo-200 gap-2"
                        >
                            <Zap className="w-5 h-5 fill-white" /> NEW STERILIZATION
                        </Button>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Active Cycles", val: batches.filter(b => b.status === 'IN_PROGRESS').length, icon: Play, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "Pending Approval", val: batches.filter(b => b.status === 'COMPLETED').length, icon: FileCheck, color: "text-orange-500", bg: "bg-orange-50" },
                    { label: "Ready Stock", val: 142, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
                    { label: "Alerts", val: 0, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
                ].map((stat, i) => (
                    <PanzeCard key={i} className="flex flex-col justify-between py-6">
                        <div className="flex justify-between items-start">
                            <div className={cn("p-2 rounded-xl", stat.bg)}>
                                <stat.icon className={cn("w-5 h-5", stat.color)} />
                            </div>
                            <Badge variant="secondary" className="bg-slate-50 text-[10px] font-bold text-slate-400">TODAY</Badge>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-black text-slate-900">{stat.val}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
                        </div>
                    </PanzeCard>
                ))}
            </div>

            {/* Batch List */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-xs">
                    <History className="w-4 h-4" /> Live Sterilization Feed
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                        {batches.map((batch) => (
                            <motion.div
                                key={batch.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <PanzeCard className="overflow-hidden p-0 border-0 shadow-sm hover:shadow-xl transition-all duration-500 group">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Status Sidebar */}
                                        <div className={cn(
                                            "w-2 md:w-3",
                                            batch.status === 'IN_PROGRESS' ? "bg-blue-500 animate-pulse" :
                                                batch.status === 'COMPLETED' ? "bg-orange-500" :
                                                    batch.status === 'APPROVED' ? "bg-green-500" : "bg-red-500"
                                        )} />

                                        {/* Content */}
                                        <div className="flex-1 p-6 flex flex-col md:flex-row items-center gap-8">
                                            {/* ID & Assistant */}
                                            <div className="w-full md:w-48">
                                                <div className="text-xs font-black text-indigo-600 mb-1">{batch.id}</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <div className="font-bold text-slate-900">{batch.assistantName}</div>
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 leading-none">{batch.room}</div>
                                            </div>

                                            {/* Timeline */}
                                            <div className="flex-1 flex items-center gap-6 w-full">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                                        <span>Cycle Progress</span>
                                                        <span>{batch.status.replace('_', ' ')}</span>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: batch.status === 'IN_PROGRESS' ? "45%" : batch.status === 'COMPLETED' ? "100%" : "100%" }}
                                                            className={cn(
                                                                "h-full",
                                                                batch.status === 'IN_PROGRESS' ? "bg-blue-500" :
                                                                    batch.status === 'COMPLETED' ? "bg-orange-500" : "bg-green-500"
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between text-[11px] font-black text-slate-900">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3 text-slate-400" /> {batch.startTime}
                                                        </div>
                                                        {batch.endTime ? (
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3 text-slate-400" /> {batch.endTime}
                                                            </div>
                                                        ) : (
                                                            <div className="text-slate-300">EST. {batch.startTime.split(':')[0]}:45 AM</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Specs */}
                                            <div className="flex gap-6 w-full md:w-auto border-l border-slate-100 pl-8">
                                                <div className="text-center">
                                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Items</div>
                                                    <div className="text-xl font-black text-slate-900">{batch.equipmentCount}</div>
                                                </div>
                                                {batch.autoclaveReading && (
                                                    <div className="text-center">
                                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Reading</div>
                                                        <div className="text-sm font-black text-slate-900">{batch.autoclaveReading}</div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-row md:flex-col gap-2 w-full md:w-48">
                                                {batch.status === 'IN_PROGRESS' && (role === 'ADMIN' || role === 'ASSISTANT') && (
                                                    <Button
                                                        onClick={() => handleEndCycle(batch.id)}
                                                        className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold gap-2"
                                                    >
                                                        <Square className="w-4 h-4 fill-white" /> MARK OUT
                                                    </Button>
                                                )}
                                                {batch.status === 'COMPLETED' && (role === 'ADMIN' || role === 'DOCTOR') && (
                                                    <div className="flex gap-2 w-full">
                                                        <Button
                                                            variant="outline"
                                                            className="flex-1 h-12 rounded-xl border-slate-200"
                                                        >
                                                            <Camera className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleApprove(batch.id)}
                                                            className="flex-[2] bg-indigo-600 text-white rounded-xl h-12 font-black gap-2"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" /> APPROVE
                                                        </Button>
                                                    </div>
                                                )}
                                                {batch.status === 'APPROVED' && (
                                                    <div className="flex items-center justify-end w-full gap-2 text-green-600 font-bold text-sm">
                                                        <ShieldCheck className="w-5 h-5" /> Authorized by {batch.approver?.split(' ')[1]}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </PanzeCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Documentation Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <PanzeCard title="Sterilization Standards">
                    <div className="space-y-4">
                        {[
                            { step: "Pre-soaking", desc: "Chemical disinfection for 15 mins", check: true },
                            { step: "Ultrasonic Cleaning", desc: "For delicate instruments", check: true },
                            { step: "Autoclave (Type B)", desc: "134°C for 5 minutes (Pouched)", check: true },
                            { step: "Visual Verification", desc: "Check for indicator strip color change", check: false },
                        ].map((std, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 italic">
                                <div>
                                    <div className="text-sm font-black text-slate-900">{std.step}</div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{std.desc}</div>
                                </div>
                                <div className={cn(
                                    "p-1.5 rounded-full",
                                    std.check ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-400"
                                )}>
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </PanzeCard>

                <PanzeCard title="Audit Logs">
                    <div className="h-[265px] flex flex-col items-center justify-center text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-[32px]">
                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                            <History className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-sm font-bold">Comprehensive Logs</p>
                        <p className="text-xs">Daily reports are being generated automatically.</p>
                        <Button variant="ghost" className="mt-4 text-indigo-600 font-bold rounded-xl h-10">Export PDF Report</Button>
                    </div>
                </PanzeCard>
            </div>
        </div>
    );
}

// Sub-component for Icon imports that might be used elsewhere
function ShieldCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
