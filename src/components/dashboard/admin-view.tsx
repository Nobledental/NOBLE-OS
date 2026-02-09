"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProjectsOverview } from "./projects-overview";
import { RevenueChart } from "./revenue-chart";
import { PatientTracker } from "./patient-tracker";
import { ChiefPulse } from "./chief-pulse";
import { SplineChart } from "@/components/ui/charts/spline-chart";
import { DonutChart } from "@/components/ui/charts/donut-chart";
import { PanzeCard } from "@/components/ui/panze-card";
import { BarChart3, Search, LayoutDashboard, Zap as ZapIcon, ScrollText, Wallet, Activity, Briefcase, ArrowUpRight, TrendingUp, Users, Calendar, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TARIFF_MASTER_DATA } from "@/lib/data/tariff-data";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SettlementPage from "@/app/dashboard/settlement/page";
import TariffPage from "@/app/dashboard/tariff/page";
import ConsultantLedgerPanel from "@/components/collaboration/consultant-ledger";
import { ClinicManagementDeck } from "./clinic-management-deck";
import { cn } from "@/lib/utils";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
};

interface AdminDashboardViewProps {
    activeFilter?: string;
}

export function AdminDashboardView({ activeFilter = "This Month" }: AdminDashboardViewProps) {
    return (
        <div className="space-y-8 min-h-[800px] pb-32 px-4 lg:px-0">
            {/* 1. Perspective & Intel Layer */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Operations Summary (Frosty White Glass) */}
                <PanzeCard className="lg:col-span-2 group glass-frost border-white/5 relative overflow-hidden flex flex-col min-h-[300px] md:min-h-[340px] transition-all duration-1000 p-6 shadow-[0_60px_100px_-30px_rgba(0,0,0,0.08)] backdrop-blur-[60px] saturate-[1.5]">
                    {/* Champagne Gold & Silver Silk Glows */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/[0.04] via-transparent to-white/[0.01] z-0 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_85%_0%,_rgba(251,191,36,0.06)_0%,_transparent_75%)] pointer-events-none" />

                    <div className="relative z-20 flex flex-col h-full">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 md:mb-14">
                            <div className="flex items-center gap-4 md:gap-6">
                                <Link href="/dashboard">
                                    <Button variant="ghost" className="w-10 h-10 rounded-xl bg-white/40 hover:bg-white/60 p-0 text-slate-900 hover:text-amber-600 border border-slate-200 transition-all duration-700 backdrop-blur-3xl shadow-lg">
                                        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                                    </Button>
                                </Link>
                                <div>
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <div className="w-8 h-[2px] bg-indigo-500" />
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400">Perspective</span>
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight text-white leading-none">
                                        Operations <span className="opacity-70 font-light">Analysis</span>
                                    </h1>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="glass-frost border-white/10 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white backdrop-blur-3xl shadow-2xl">
                                    {activeFilter} MATRIC
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-auto py-6">
                            {[
                                { label: "Net Yield", value: activeFilter === "Today" ? "12,500" : activeFilter === "This Week" ? "84,000" : "3.4L", icon: Wallet, trend: "+8.2%", positive: true },
                                { label: "Case Load", value: activeFilter === "Today" ? "08" : "156", icon: Users, sub: "Growth Stable", positive: true },
                                { label: "Performance", value: activeFilter === "Today" ? "72%" : "84%", icon: Activity, trend: "Elite", positive: false }
                            ].map((pod, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -8 }}
                                    className="relative group/pod flex flex-col items-center text-center"
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-700 shadow-xl",
                                        pod.positive ? "text-emerald-400 group-hover/pod:bg-emerald-500/20" : "text-blue-400 group-hover/pod:bg-blue-500/20"
                                    )}>
                                        <pod.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-black mb-1.5">{pod.label}</span>
                                    <div className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
                                        {pod.value.startsWith('₹') ? pod.value : `₹${pod.value}`}
                                    </div>
                                    {pod.trend ? (
                                        <div className={cn(
                                            "text-[10px] font-black px-6 py-2.5 rounded-full border border-white/5 uppercase tracking-[0.4em] flex items-center gap-2 transition-all duration-500 shadow-2xl",
                                            pod.positive ? "bg-emerald-500/10 text-emerald-400 group-hover/pod:bg-emerald-500 group-hover/pod:text-white" : "bg-blue-500/10 text-blue-400 group-hover/pod:bg-blue-500 group-hover/pod:text-white"
                                        )}>
                                            <TrendingUp className="w-4 h-4 opacity-50" /> {pod.trend}
                                        </div>
                                    ) : (
                                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] opacity-90">{pod.sub}</span>
                                    )}
                                    {/* Silk Glow On Hover */}
                                    <div className={cn(
                                        "absolute -inset-4 rounded-3xl opacity-0 group-hover/pod:opacity-100 transition-all duration-1000 blur-3xl -z-10",
                                        pod.positive ? "bg-emerald-500/[0.05]" : "bg-blue-500/[0.05]"
                                    )} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </PanzeCard>

                {/* Intelligence Layer (Frosty White Glass) */}
                <PanzeCard className="flex flex-col glass-frost border-white/5 rounded-[2rem] relative overflow-hidden group shadow-[0_60px_100px_-30px_rgba(0,0,0,0.08)] backdrop-blur-[60px] saturate-[1.5] transition-all duration-1000 min-h-[340px]">
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03] to-transparent pointer-events-none" />
                    <div className="p-6 space-y-8 flex-1 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500 flex items-center justify-center text-white rounded-xl border border-emerald-400 group-hover:scale-105 transition-all duration-700 shadow-lg shadow-emerald-500/20">
                                <ZapIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1.5">
                                    <div className="w-4 h-[1px] bg-emerald-500" />
                                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-bold text-emerald-600">AI Pulse</span>
                                </div>
                                <h3 className="text-xl font-semibold tracking-tight text-white leading-none">Intelligence</h3>
                            </div>
                        </div>

                        <div className="relative group/insight pt-4">
                            <div className="relative bg-white/[0.01] rounded-[1.5rem] p-6 border border-white/5 backdrop-blur-3xl group-hover/insight:bg-white/[0.03] group-hover/insight:border-emerald-500/10 transition-all duration-700 shadow-[inset_0_0_40px_rgba(0,0,0,0.2)]">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover/insight:bg-emerald-100 transition-all duration-700">
                                        <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <div className="text-base font-bold tracking-tight text-white mb-0.5 uppercase">Growth Index</div>
                                        <div className="text-[9px] text-emerald-600 font-black uppercase tracking-widest opacity-100 underline decoration-emerald-200 underline-offset-4">Standard Sync</div>
                                    </div>
                                </div>
                                <p className="text-[11px] md:text-[12px] text-slate-400 font-semibold leading-relaxed italic border-l-2 border-emerald-500/60 pl-6 bg-emerald-500/5 py-4 rounded-r-2xl font-serif">
                                    &quot;Clinical velocity indicators suggest a conversion optimization window. Unified staff performance remains at elite benchmarks.&quot;
                                </p>
                            </div>
                            {/* Emerald Ambient Glow */}
                            <div className="absolute -inset-10 bg-emerald-500/[0.02] rounded-[3rem] opacity-0 group-hover/insight:opacity-100 blur-[60px] transition-all duration-1000 -z-10" />
                        </div>
                    </div>

                    <div className="p-6 md:p-8 bg-white/[0.05] border-t border-white/10">
                        <Button variant="ghost" className="w-full h-12 rounded-[1.5rem] bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 hover:text-emerald-600 text-[10px] font-black uppercase tracking-[0.4em] gap-4 transition-all duration-700 shadow-xl shadow-slate-200/50">
                            <ScrollText className="w-5 h-5 opacity-100" /> System Registry
                        </Button>
                    </div>
                </PanzeCard>
            </motion.div>

            {/* 2. Analytics Hub (Editorial Arctic Blue) */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
            >
                <div className="relative group">
                    <div className="absolute -inset-2 bg-blue-500/[0.02] rounded-[3.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                    <SplineChart
                        title="PEAK PERFORMANCE"
                        color="#3b82f6"
                        data={
                            activeFilter === "Today" ? [
                                { name: '8am', value: 1200 },
                                { name: '10am', value: 2400 },
                                { name: '12pm', value: 1800 },
                                { name: '2pm', value: 3600 },
                                { name: '4pm', value: 4500 },
                            ] : activeFilter === "This Week" ? [
                                { name: 'Mon', value: 14000 },
                                { name: 'Tue', value: 13000 },
                                { name: 'Wed', value: 15000 },
                                { name: 'Thu', value: 12780 },
                                { name: 'Fri', value: 11890 },
                            ] : [
                                { name: 'Week 1', value: 40000 },
                                { name: 'Week 2', value: 30000 },
                                { name: 'Week 3', value: 50000 },
                                { name: 'Week 4', value: 27800 },
                            ]
                        }
                    />
                </div>

                <div className="relative group">
                    <div className="absolute -inset-2 bg-amber-500/[0.02] rounded-[3.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                    <DonutChart
                        title="FINANCIAL PERSPECTIVE"
                        totalLabel="COLLECTED"
                        totalValue="₹2.4L"
                        data={[
                            { name: 'Direct Yield', value: 70, color: '#fcd34d' },
                            { name: 'Pending Flow', value: 20, color: '#94a3b8' },
                            { name: 'System Gap', value: 10, color: '#ef4444' },
                        ]}
                    />
                </div>
            </motion.div>

            {/* 3. Clinical Operations Center (Editorial Arctic Blue) */}
            <motion.div variants={itemVariants} className="space-y-8 pb-32">
                <div className="flex items-center gap-12 px-6">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                        <h2 className="text-[10px] font-black tracking-[0.6em] text-white uppercase whitespace-nowrap border-b border-slate-300 pb-1">Clinical Operations Hub</h2>
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
                <div className="glass-frost px-6 py-10 border-white/40 rounded-[3rem] shadow-[0_100px_150px_-50px_rgba(0,0,0,0.06)] backdrop-blur-[60px] relative overflow-hidden group transition-all duration-1000">
                    {/* Background Arctic Surface Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.03)_0%,_transparent_60%)] pointer-events-none" />
                    <div className="relative z-10">
                        <ClinicManagementDeck />
                    </div>
                </div>
            </motion.div>
        </div >
    );
}
