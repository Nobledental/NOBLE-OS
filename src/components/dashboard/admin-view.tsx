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
        <div className="space-y-12 min-h-[800px] pb-32 px-4 lg:px-0">
            {/* 1. Perspective & Intel Layer */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
            >
                {/* Operations Summary (Editorial Champagne Gold) */}
                <PanzeCard className="lg:col-span-2 group bg-slate-950/40 backdrop-blur-[60px] border border-white/5 text-white relative overflow-hidden flex flex-col min-h-[380px] md:min-h-[420px] transition-all duration-1000 p-6 md:p-10 rounded-[3rem] md:rounded-[4rem] shadow-[0_60px_100px_-30px_rgba(0,0,0,0.9)]">
                    {/* Champagne Gold & Silver Silk Glows */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/[0.04] via-transparent to-white/[0.01] z-0 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_85%_0%,_rgba(251,191,36,0.06)_0%,_transparent_75%)] pointer-events-none" />

                    <div className="relative z-20 flex flex-col h-full">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 md:mb-14">
                            <div className="flex items-center gap-4 md:gap-6">
                                <Link href="/dashboard">
                                    <Button variant="ghost" className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 p-0 text-white hover:text-amber-400 border border-white/10 transition-all duration-700 backdrop-blur-3xl shadow-2xl">
                                        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                                    </Button>
                                </Link>
                                <div>
                                    <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                                        <div className="w-6 md:w-8 h-[1px] bg-amber-400/60 shadow-[0_0_8px_rgba(251,191,36,0.2)]" />
                                        <span className="text-[8px] md:text-[9px] uppercase tracking-[0.5em] font-black text-amber-500/80 leading-none">Financial Perspective</span>
                                    </div>
                                    <h2 className="text-2xl md:text-5xl font-black tracking-tighter text-white leading-tight uppercase italic">
                                        Operations <span className="text-white/20 font-light underline decoration-[#007AFF]/40 underline-offset-8">Analysis</span>
                                    </h2>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-white backdrop-blur-3xl shadow-2xl">
                                    {activeFilter} METRIC
                                </div>
                            </div>
                        </div>

                        {/* Uniform Editorial KPI Grid (Champagne Gold focus) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 mt-auto">
                            {[
                                { label: "Net Yield", value: activeFilter === "Today" ? "12,500" : activeFilter === "This Week" ? "84,000" : "3.4L", icon: Wallet, accent: "amber-400", trend: "+8.2%" },
                                { label: "Case Load", value: activeFilter === "Today" ? "08" : "156", icon: Users, accent: "white", sub: "Growth Stable" },
                                { label: "Performance", value: activeFilter === "Today" ? "72%" : "84%", icon: Activity, accent: "blue-400", trend: "Elite" }
                            ].map((pod, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -8 }}
                                    className="relative group/pod flex flex-col items-center text-center"
                                >
                                    <PanzeCard className="glass-neo p-6 rounded-[2.5rem] w-full h-full flex flex-col items-center">
                                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-5 md:mb-6 group-hover/pod:border-${pod.accent}/60 group-hover/pod:text-${pod.accent} transition-all duration-700 shadow-xl`}>
                                            <pod.icon className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <span className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-white font-black mb-2">{pod.label}</span>
                                        <div className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-4">
                                            {pod.value.startsWith('₹') ? pod.value : `₹${pod.value}`}
                                        </div>
                                        {pod.trend ? (
                                            <div className={`text-[8px] md:text-[9px] font-black px-4 py-1.5 rounded-full bg-white/20 border border-white/30 uppercase tracking-[0.2em] flex items-center gap-2 group-hover/pod:bg-${pod.accent}/20 group-hover/pod:text-${pod.accent} transition-all duration-500 shadow-lg`}>
                                                <TrendingUp className="w-3 h-3 opacity-100" /> {pod.trend}
                                            </div>
                                        ) : (
                                            <span className="text-[9px] text-white font-black uppercase tracking-[0.3em] opacity-90">{pod.sub}</span>
                                        )}
                                        {/* Silk Glow On Hover */}
                                        <div className={`absolute -inset-6 bg-${pod.accent}/[0.03] rounded-[3rem] opacity-0 group-hover/pod:opacity-100 transition-all duration-1000 blur-3xl -z-10`} />
                                    </PanzeCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </PanzeCard>

                {/* Intelligence Layer (Editorial Soft Emerald) */}
                <PanzeCard
                    className="glass-neo relative p-8 md:p-10 rounded-[3rem] h-full flex flex-col justify-between overflow-hidden group"
                >
                    <div className="relative z-10 space-y-10">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500/10 flex items-center justify-center text-emerald-400 rounded-2xl md:rounded-[1.8rem] border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black group-hover:scale-105 transition-all duration-700 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                <ZapIcon className="w-7 h-7 md:w-8 md:h-8" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1.5">
                                    <div className="w-4 h-[1px] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]" />
                                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-black text-emerald-400">AI Pulse</span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white leading-none">Intelligence</h3>
                            </div>
                        </div>

                        <div className="relative group/insight pt-4">
                            <div className="relative glass-neo p-8 md:p-12 border border-white/5 transition-all duration-1000">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-12 h-12 bg-[#007AFF]/20 rounded-2xl flex items-center justify-center text-[#007AFF] border border-[#007AFF]/30 group-hover/insight:scale-110 transition-all duration-700">
                                        <BarChart3 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-black tracking-tight text-white mb-1 uppercase">Growth Index</div>
                                        <div className="text-[10px] text-[#007AFF] font-black uppercase tracking-[0.3em]">Live Clinical Analytics</div>
                                    </div>
                                </div>
                                <p className="text-[12px] md:text-[14px] text-white/90 font-medium leading-relaxed italic border-l-4 border-[#007AFF] pl-8 py-6 bg-white/[0.02] rounded-r-[2rem]">
                                    "Clinical velocity indicators suggest a conversion optimization window. Unified staff performance remains at elite benchmarks."
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-black/20 border-t border-white/5">
                        <Button variant="ghost" className="w-full h-16 rounded-[1.8rem] bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-[11px] font-black uppercase tracking-[0.4em] gap-5 shadow-[0_20px_40px_rgba(0,122,255,0.3)] transition-all duration-700">
                            <ScrollText className="w-5 h-5" /> View System Registry
                        </Button>
                    </div>
                </PanzeCard>
            </motion.div>

            {/* 2. Analytics Hub (Editorial Arctic Blue) */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12"
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
            <motion.div variants={itemVariants} className="space-y-16 pb-32">
                <div className="flex items-center gap-12 px-6">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    <div className="flex flex-col gap-6 md:gap-8 absolute top-[120%] left-0 w-full lg:top-[-100px] lg:left-[calc(100%+80px)] lg:w-[480px]">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-[10px] font-black tracking-[0.6em] text-white uppercase whitespace-nowrap border-b border-white/10 pb-1">Clinical Operations Hub</h2>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                                Real-time clinical throughput & revenue data
                            </p>
                        </div>
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
                <div className="bg-slate-950/20 backdrop-blur-[80px] px-8 md:px-16 py-12 md:py-20 border border-white/5 rounded-[4rem] md:rounded-[6rem] shadow-[0_100px_150px_-50px_rgba(0,0,0,0.6)] relative overflow-hidden group transition-all duration-1000">
                    {/* Background Arctic Surface Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.03)_0%,_transparent_60%)] pointer-events-none" />
                    <div className="relative z-10">
                        <ClinicManagementDeck />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
