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
            {/* 1. Professional Operations Analytics Banner */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.12 } }
                }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* Main Operations Summary (Vision Pro Glass) */}
                <PanzeCard className="lg:col-span-2 group bg-slate-950/40 backdrop-blur-3xl border border-white/10 text-white relative overflow-hidden flex flex-col min-h-[380px] transition-all duration-700 p-10 rounded-[4rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)]">
                    {/* Animated Mesh Gradient Background (Vision Pro Style) */}
                    <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 90, 180, 270, 0],
                                x: ['-10%', '10%', '-10%'],
                                y: ['-10%', '10%', '-10%']
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_#007AFF_0%,_#A78BFA_30%,_#00CFFF_60%,_transparent_100%)] blur-[120px]"
                        />
                    </div>

                    {/* Glossy Reflection Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-0 pointer-events-none" />

                    {/* Border Beam (Animated Light Edge) */}
                    <div className="absolute inset-0 rounded-[4rem] border-[1.5px] border-transparent [mask-image:linear-gradient(white,white),linear-gradient(white,white)] [mask-clip:padding-box,border-box] [mask-composite:intersect] group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-purple-500 group-hover:to-cyan-400 transition-colors duration-1000 z-10" />

                    <div className="relative z-20 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-6">
                                <Link href="/dashboard">
                                    <Button variant="ghost" className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 p-0 text-white/50 hover:text-white border border-white/10 transition-all duration-500 backdrop-blur-md">
                                        <ArrowLeft className="w-6 h-6" />
                                    </Button>
                                </Link>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <motion.div
                                            animate={{ width: [0, 40, 32] }}
                                            className="h-[1.5px] bg-gradient-to-r from-cyan-400 to-purple-500"
                                        />
                                        <span className="text-[10px] uppercase tracking-[0.5em] font-black text-cyan-400/80 leading-none">Management Core</span>
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tighter text-white">
                                        Operations <span className="text-white/30 italic">Perspective</span>
                                    </h2>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="bg-white/10 border border-white/20 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/80 backdrop-blur-xl shadow-xl">
                                    {activeFilter} REVIEW
                                </div>
                            </div>
                        </div>

                        {/* Glossy KPI Pods (Vision Pro Style) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-auto px-2 pb-2">
                            {[
                                { label: "Net Revenue", value: activeFilter === "Today" ? "12,500" : activeFilter === "This Week" ? "84,000" : "3.4L", icon: Wallet, color: "cyan-400", trend: "+8.2%" },
                                { label: "Total Patients", value: activeFilter === "Today" ? "08" : "156", icon: Users, color: "purple-400", sub: "Growth Steady" },
                                { label: "Utilization", value: activeFilter === "Today" ? "72%" : "84%", icon: Activity, color: "indigo-400", trend: "Peak" }
                            ].map((pod, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -8, scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                    className="relative group/pod"
                                >
                                    <div className={`absolute -inset-4 bg-${pod.color}/20 rounded-[2.5rem] opacity-0 group-hover/pod:opacity-100 transition-opacity duration-700 blur-2xl`} />
                                    <div className="relative bg-white/5 backdrop-blur-md border border-white/10 px-8 py-7 rounded-[2.5rem] transition-all duration-500 group-hover/pod:bg-white/10 group-hover/pod:border-white/20 flex flex-col items-center text-center">
                                        <div className={`w-10 h-10 rounded-2xl bg-${pod.color}/10 border border-${pod.color}/20 flex items-center justify-center text-${pod.color} mb-4 group-hover/pod:scale-110 transition-transform duration-500`}>
                                            <pod.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black mb-1">{pod.label}</span>
                                        <div className="text-3xl font-black tracking-tighter text-white tabular-nums mb-3 group-hover/pod:scale-105 transition-transform duration-500">
                                            {pod.value.startsWith('₹') ? pod.value : `₹${pod.value}`}
                                        </div>
                                        {pod.trend ? (
                                            <div className="text-[9px] text-cyan-400 font-black px-3 py-1 rounded-full bg-cyan-400/10 uppercase tracking-widest flex items-center gap-1.5">
                                                <TrendingUp className="w-3 h-3" /> {pod.trend}
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{pod.sub}</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </PanzeCard>

                {/* Intelligence Core (Vision Pro Glass) */}
                <PanzeCard className="flex flex-col bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[4rem] relative overflow-hidden group shadow-2xl p-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                    <div className="p-8 space-y-10 flex-1 relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <motion.div
                                    whileHover={{ rotate: 180 }}
                                    className="w-14 h-14 bg-white/5 flex items-center justify-center text-cyan-400 rounded-[1.5rem] border border-white/10 group-hover:bg-cyan-400 group-hover:text-black transition-all duration-700 shadow-xl"
                                >
                                    <ZapIcon className="w-7 h-7" />
                                </motion.div>
                                <div>
                                    <h3 className="text-[11px] font-black uppercase text-white/40 tracking-[0.5em] mb-1">Intelligence</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Active Pulse</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative group/insight">
                            <div className="absolute -inset-4 bg-purple-500/10 rounded-[3rem] opacity-0 group-hover/insight:opacity-100 blur-2xl transition-all duration-700" />
                            <div className="relative bg-white/5 rounded-[2.8rem] p-8 border border-white/10 backdrop-blur-md group-hover/insight:bg-white/10 transition-all duration-500">
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-400/20 group-hover/insight:border-purple-400 transition-colors duration-500">
                                        <BarChart3 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-black tracking-tight text-white leading-none mb-1">Growth Index</div>
                                        <div className="text-[9px] text-purple-400 font-black uppercase tracking-[0.2em]">Audit Successful</div>
                                    </div>
                                </div>
                                <p className="text-[11px] text-white/50 font-medium leading-[1.8] italic px-2">
                                    "Our behavioral analysis suggests a 14% increase in high-value case conversions. Operationally, staff velocity is consistent with peak benchmarks."
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white/5 border-t border-white/10 relative z-10">
                        <Button variant="ghost" className="w-full h-14 rounded-[2rem] bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] gap-3 transition-all duration-500 shadow-lg">
                            <ScrollText className="w-4.5 h-4.5" /> Registry Insights
                        </Button>
                    </div>
                </PanzeCard>
            </motion.div>

            {/* 2. Analytics Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SplineChart
                        title="PRACTICE REVENUE ANALYSIS"
                        color="#007AFF"
                        data={
                            activeFilter === "Today" ? [
                                { name: '8am', value: 400 },
                                { name: '10am', value: 1200 },
                                { name: '12pm', value: 3000 },
                                { name: '2pm', value: 1800 },
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
                            { name: 'Collected', value: 70, color: '#007AFF' },
                            { name: 'Outstanding', value: 20, color: '#FF6B6B' },
                            { name: 'Leakage', value: 10, color: '#A78BFA' },
                        ]}
                    />
                </div>
            </motion.div>

            {/* 3. Clinical Operations Center */}
            <motion.div variants={itemVariants} className="space-y-10 pb-32">
                <div className="flex items-center gap-6 p-4">
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    <h2 className="text-[12px] font-black tracking-[0.5em] text-slate-400 uppercase whitespace-nowrap">Clinical Operations Center</h2>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>
                <div className="glass-white px-6 py-10 border-white/40 bg-white/60 rounded-[4rem] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.05)]">
                    <ClinicManagementDeck />
                </div>
            </motion.div>
        </div>
    );
}
