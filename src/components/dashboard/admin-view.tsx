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
                {/* Main Operations Summary (Obsidian Glass) */}
                <PanzeCard className="lg:col-span-2 group bg-black/40 backdrop-blur-[40px] border border-white/5 text-white relative overflow-hidden flex flex-col min-h-[380px] transition-all duration-700 p-10 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
                    {/* Professional High-Fidelity Glass Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-white/[0.01] z-0 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_0%,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none" />

                    {/* Smooth Subtle Gloss Overlay */}
                    <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />

                    <div className="relative z-20 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-6">
                                <Link href="/dashboard">
                                    <Button variant="ghost" className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 p-0 text-white/50 hover:text-white border border-white/10 transition-all duration-500 backdrop-blur-3xl">
                                        <ArrowLeft className="w-6 h-6" />
                                    </Button>
                                </Link>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-6 h-[1.5px] bg-white/20" />
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 leading-none">Management Core</span>
                                    </div>
                                    <h2 className="text-4xl font-semibold tracking-tight text-white">
                                        Operations <span className="text-white/20 font-medium">Perspective</span>
                                    </h2>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 backdrop-blur-3xl shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                                    {activeFilter} REVIEW
                                </div>
                            </div>
                        </div>

                        {/* Professional KPI Pods (Pure White Design) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-auto px-2 pb-2">
                            {[
                                { label: "Net Revenue", value: activeFilter === "Today" ? "12,500" : activeFilter === "This Week" ? "84,000" : "3.4L", icon: Wallet, trend: "+8.2%" },
                                { label: "Total Patients", value: activeFilter === "Today" ? "08" : "156", icon: Users, sub: "Growth Steady" },
                                { label: "Utilization", value: activeFilter === "Today" ? "72%" : "84%", icon: Activity, trend: "Peak" }
                            ].map((pod, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="relative group/pod"
                                >
                                    {/* Pure White Hover Glow Effect */}
                                    <div className="absolute -inset-4 bg-white/[0.04] rounded-[3rem] opacity-0 group-hover/pod:opacity-100 transition-all duration-700 blur-2xl" />

                                    <div className="relative bg-white/[0.02] backdrop-blur-3xl border border-white/5 px-8 py-8 rounded-[2.8rem] transition-all duration-500 group-hover/pod:bg-white/[0.05] group-hover/pod:border-white/20 flex flex-col items-center text-center">
                                        {/* Icon Container with Inner Glow */}
                                        <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 mb-5 group-hover/pod:text-white transition-all duration-500 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]">
                                            <pod.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold mb-1.5">{pod.label}</span>
                                        <div className="text-3xl font-bold tracking-tight text-white mb-4">
                                            {pod.value.startsWith('₹') ? pod.value : `₹${pod.value}`}
                                        </div>
                                        {pod.trend ? (
                                            <div className="text-[10px] text-white/50 font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-widest flex items-center gap-1.5 group-hover/pod:bg-white/10 group-hover/pod:text-white transition-all">
                                                <TrendingUp className="w-3.5 h-3.5 opacity-50" /> {pod.trend}
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

                {/* Intelligence Core (Obsidian Glass) */}
                <PanzeCard className="flex flex-col bg-slate-950/20 backdrop-blur-[40px] border border-white/5 rounded-[4rem] relative overflow-hidden group shadow-2xl p-0 transition-all duration-700">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                    <div className="p-10 space-y-12 flex-1 relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-white/5 flex items-center justify-center text-white/40 rounded-[1.5rem] border border-white/10 group-hover:bg-white group-hover:text-black group-hover:scale-105 transition-all duration-700 shadow-xl">
                                    <ZapIcon className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-[11px] font-bold uppercase text-white/30 tracking-[0.4em] mb-1">Intelligence</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Pulse</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative group/insight">
                            {/* Pure White Hover Glow */}
                            <div className="absolute -inset-4 bg-white/[0.04] rounded-[3rem] opacity-0 group-hover/insight:opacity-100 blur-2xl transition-all duration-700" />

                            <div className="relative bg-white/[0.01] rounded-[2.8rem] p-8 border border-white/5 backdrop-blur-3xl group-hover/insight:bg-white/5 group-hover/insight:border-white/20 transition-all duration-500 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/30 border border-white/10 group-hover/insight:text-white transition-all duration-500">
                                        <BarChart3 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold tracking-tight text-white leading-none mb-1">Practice Velocity</div>
                                        <div className="text-[10px] text-white/30 font-bold uppercase tracking-[0.15em]">Registry Updated</div>
                                    </div>
                                </div>
                                <p className="text-[11px] text-white/40 font-medium leading-[1.8] italic px-2">
                                    "Our behavioral analysis suggests a consistent increase in high-value case conversions. Operationally, staff velocity remains at peak benchmarks."
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white/[0.02] border-t border-white/5 relative z-10">
                        <Button variant="ghost" className="w-full h-14 rounded-[2rem] bg-white/5 hover:bg-white/10 border border-white/10 text-white/30 hover:text-white text-[10px] font-bold uppercase tracking-[0.3em] gap-3 transition-all duration-500">
                            <ScrollText className="w-4.5 h-4.5 opacity-50" /> System Registry
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
