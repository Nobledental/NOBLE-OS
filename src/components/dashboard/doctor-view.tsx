"use client";

import { motion } from "framer-motion";
import { ActiveQueue } from "./active-queue";
import { PatientTracker } from "./patient-tracker";
import { PanzeCard } from "@/components/ui/panze-card";
import {
    Stethoscope,
    ClipboardList,
    Clock,
    UserCheck,
    Zap,
    Activity,
    Thermometer,
    HeartPulse
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
};

export function DoctorDashboardView() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-1"
        >
            {/* Main Clinical Focus: Active Chairs */}
            <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Active Clinical Feed</h2>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Procedural Audit Active</p>
                        </div>
                    </div>
                    <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest px-6 h-12 shadow-xl shadow-indigo-100 gap-2">
                        <Zap size={14} className="fill-white" /> Start New Session
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        icon={<Stethoscope className="w-6 h-6 text-blue-600" />}
                        value="12"
                        label="Cases Today"
                        color="bg-blue-50"
                        accent="border-blue-500"
                    />
                    <StatCard
                        icon={<UserCheck className="w-6 h-6 text-emerald-600" />}
                        value="08"
                        label="Completed"
                        color="bg-emerald-50"
                        accent="border-emerald-500"
                    />
                    <StatCard
                        icon={<Clock className="w-6 h-6 text-amber-600" />}
                        value="45m"
                        label="Avg Session"
                        color="bg-amber-50"
                        accent="border-amber-500"
                    />
                    <StatCard
                        icon={<HeartPulse className="w-6 h-6 text-rose-600" />}
                        value="98%"
                        label="Safety Index"
                        color="bg-rose-50"
                        accent="border-rose-500"
                    />
                </div>

                <ActiveQueue />
            </motion.div>

            {/* Sidebar: Clinical Intelligence & Audits */}
            <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-8">
                <PatientTracker />

                <PanzeCard className="p-8 bg-slate-900 text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
                    <div className="relative z-10 space-y-6">
                        <h4 className="font-black tracking-tighter uppercase text-sm flex items-center gap-3">
                            <ClipboardList className="w-5 h-5 text-indigo-400" />
                            NEO Clinical Auditor
                        </h4>

                        <div className="space-y-4">
                            <AuditItem
                                title="Lab Report - Suresh"
                                status="URGENT"
                                sub="Missing Working Length for RCT"
                            />
                            <AuditItem
                                title="X-Ray - Priya"
                                status="PENDING"
                                sub="Quality Check required"
                            />
                        </div>

                        <Button variant="outline" className="w-full h-12 rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-widest">
                            View All Discrepancies
                        </Button>
                    </div>
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full" />
                </PanzeCard>
            </motion.div>
        </motion.div>
    );
}

function StatCard({ icon, value, label, color, accent }: any) {
    return (
        <PanzeCard className={cn("p-6 flex flex-col items-center justify-center text-center gap-3 border-b-4 transition-all hover:translate-y-[-4px]", accent, color)}>
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-1">
                {icon}
            </div>
            <div className="space-y-0.5">
                <span className="text-3xl font-black tracking-tighter text-slate-900">{value}</span>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
        </PanzeCard>
    );
}

function AuditItem({ title, status, sub }: any) {
    return (
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group hover:border-indigo-400/50 transition-all cursor-pointer">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-200">{title}</span>
                <Badge className={cn(
                    "text-[8px] font-black px-2 py-0.5 rounded uppercase",
                    status === 'URGENT' ? "bg-rose-500 text-white" : "bg-indigo-500 text-white"
                )}>
                    {status}
                </Badge>
            </div>
            <p className="text-[10px] font-medium text-slate-400">{sub}</p>
        </div>
    );
}
