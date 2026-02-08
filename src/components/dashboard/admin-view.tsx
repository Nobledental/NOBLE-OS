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
                {/* Main Operations Summary (Obsidian & Sapphire) */}
                <PanzeCard className="lg:col-span-2 group bg-black/40 backdrop-blur-[40px] border border-white/5 text-white relative overflow-hidden flex flex-col min-h-[380px] md:min-h-[420px] transition-all duration-700 p-6 md:p-10 rounded-[3rem] md:rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
                    {/* Sapphire & Silver Glass Reflections */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/[0.03] via-transparent to-white/[0.01] z-0 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_0%,_rgba(59,130,246,0.05)_0%,_transparent_70%)] pointer-events-none" />

                    <div className="relative z-20 flex flex-col h-full">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 md:mb-12">
                            <div className="flex items-center gap-4 md:gap-6">
                                <Link href="/dashboard">
                                    <Button variant="ghost" className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 p-0 text-white/50 hover:text-white border border-white/10 transition-all duration-500 backdrop-blur-3xl">
                                        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                                    </Button>
                                </Link>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-5 md:w-6 h-[1.5px] bg-blue-500/40" />
                                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 leading-none">Management Core</span>
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-white">
                                        Operations <span className="text-blue-400/20 font-medium">Perspective</span>
                                    </h2>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 backdrop-blur-3xl shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                                    {activeFilter} REVIEW
                                </div>
                            </div>
                        </div>

                        {/* Responsive KPI Pods (Sapphire Accents) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-auto px-1 pb-1">
                            {[
                                { label: "Net Revenue", value: activeFilter === "Today" ? "12,500" : activeFilter === "This Week" ? "84,000" : "3.4L", icon: Wallet, color: "blue-500", trend: "+8.2%" },
                                { label: "Total Patients", value: activeFilter === "Today" ? "08" : "156", icon: Users, color: "slate-400", sub: "Growth Steady" },
                                { label: "Utilization", value: activeFilter === "Today" ? "72%" : "84%", icon: Activity, color: "blue-400", trend: "Peak" }
                            ].map((pod, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="relative group/pod"
                                >
                                    {/* Sapphire Hover Glow */}
                                    <div className={`absolute -inset-4 bg-${pod.color || 'white'}/[0.05] rounded-[2.5rem] md:rounded-[3rem] opacity-0 group-hover/pod:opacity-100 transition-all duration-700 blur-2xl`} />

                                    <div className="relative bg-white/[0.02] backdrop-blur-3xl border border-white/5 px-6 md:px-8 py-6 md:py-8 rounded-[2.5rem] md:rounded-[2.8rem] transition-all duration-500 group-hover/pod:bg-white/[0.05] group-hover/pod:border-white/20 flex flex-col items-center text-center">
                                        <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 mb-4 md:mb-5 group-hover/pod:text-blue-400 transition-all duration-500 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]">
                                            <pod.icon className="w-4 h-4 md:w-5 md:h-5" />
                                        </div>
                                        <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold mb-1 md:mb-1.5">{pod.label}</span>
                                        <div className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3 md:mb-4">
                                            {pod.value.startsWith('₹') ? pod.value : `₹${pod.value}`}
                                        </div>
                                        {pod.trend ? (
                                            <div className="text-[9px] md:text-[10px] text-blue-400/80 font-bold px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 uppercase tracking-widest flex items-center gap-1.5 group-hover/pod:bg-blue-500/10 group-hover/pod:text-blue-400 transition-all">
                                                <TrendingUp className="w-3 md:w-3.5 h-3 md:h-3.5 opacity-50" /> {pod.trend}
                                            </div>
                                        ) : (
                                            <span className="text-[9px] md:text-[10px] text-white/20 font-bold uppercase tracking-widest">{pod.sub}</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </PanzeCard>

                {/* Intelligence Core (Obsidian & Sapphire) */}
                <PanzeCard className="flex flex-col bg-slate-950/20 backdrop-blur-[40px] border border-white/5 rounded-[3rem] md:rounded-[4rem] relative overflow-hidden group shadow-2xl p-0 transition-all duration-700 min-h-[380px]">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] to-transparent pointer-events-none" />
                    <div className="p-8 md:p-10 space-y-8 md:space-y-12 flex-1 relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 md:gap-5">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 flex items-center justify-center text-blue-400/60 rounded-xl md:rounded-[1.5rem] border border-white/10 group-hover:bg-blue-500 group-hover:text-white group-hover:scale-105 transition-all duration-700 shadow-xl">
                                    <ZapIcon className="w-6 h-6 md:w-7 md:h-7" />
                                </div>
                                <div>
                                    <h3 className="text-[10px] md:text-[11px] font-bold uppercase text-white/30 tracking-[0.4em] mb-1">Intelligence</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                                        <span className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Pulse</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative group/insight">
                            <div className="absolute -inset-4 bg-blue-500/[0.04] rounded-[3rem] opacity-0 group-hover/insight:opacity-100 blur-2xl transition-all duration-700" />

                            <div className="relative bg-white/[0.01] rounded-[2.5rem] md:rounded-[2.8rem] p-6 md:p-8 border border-white/5 backdrop-blur-3xl group-hover/insight:bg-white/5 group-hover/insight:border-white/20 transition-all duration-500 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                                <div className="flex items-center gap-4 md:gap-5 mb-5 md:mb-6">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-400/40 border border-white/10 group-hover/insight:text-blue-400 transition-all duration-500">
                                        <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <div className="text-base md:text-lg font-semibold tracking-tight text-white leading-none mb-1">Practice Velocity</div>
                                        <div className="text-[9px] md:text-[10px] text-white/30 font-bold uppercase tracking-[0.15em]">Registry Updated</div>
                                    </div>
                                </div>
                                <p className="text-[10px] md:text-[11px] text-white/40 font-medium leading-[1.8] italic px-1 md:px-2">
                                    "Behavioral analysis suggests consistent increase in conversion rates. Staff velocity remains at elite benchmarks."
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 md:p-6 bg-white/[0.02] border-t border-white/5 relative z-10">
                        <Button variant="ghost" className="w-full h-12 md:h-14 rounded-xl md:rounded-[2rem] bg-white/5 hover:bg-white/10 border border-white/10 text-white/30 hover:text-white text-[10px] font-bold uppercase tracking-[0.3em] gap-3 transition-all duration-500">
                            <ScrollText className="w-4 h-4 md:w-4.5 md:h-4.5 opacity-50" /> System Registry
                        </Button>
                    </div>
                </PanzeCard>
            </motion.div>

            {/* 2. Analytics Hub (Sapphire Accents) */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8"
            >
                <div>
                    <SplineChart
                        title="REVENUE ANALYSIS"
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

                <div>
                    <DonutChart
                        title="FINANCIAL HEALTH HUB"
                        totalLabel="COLLECTED"
                        totalValue="₹2.4L"
                        data={[
                            { name: 'Collected', value: 70, color: '#3b82f6' },
                            { name: 'Outstanding', value: 20, color: '#f87171' },
                            { name: 'Leakage', value: 10, color: '#94a3b8' },
                        ]}
                    />
                </div>
            </motion.div>

            {/* 3. Clinical Operations Center */}
            <motion.div variants={itemVariants} className="space-y-12 pb-32">
                <div className="flex items-center gap-8 px-6">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <h2 className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase whitespace-nowrap">Clinical Operations Center</h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
                <div className="bg-slate-950/10 backdrop-blur-3xl px-12 py-16 border border-white/5 rounded-[5rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                    {/* Background Surface Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.02)_0%,_transparent_50%)] pointer-events-none" />
                    <ClinicManagementDeck />
                </div>
            </motion.div>
        </div>
    );
}
