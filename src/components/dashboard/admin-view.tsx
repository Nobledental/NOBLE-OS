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
                {/* Main Operations Summary */}
                <PanzeCard className="lg:col-span-2 group bg-[#05060f] border-white/5 text-white relative overflow-hidden flex flex-col min-h-[360px] transition-all duration-700 p-10 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                    {/* Background Visual Detail */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{ backgroundImage: 'linear-gradient(45deg, #ffffff 12.5%, transparent 12.5%, transparent 50%, #ffffff 50%, #ffffff 62.5%, transparent 62.5%, transparent 100%)', backgroundSize: '4px 4px' }} />
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-neo-vibrant-blue/10 blur-[100px] rounded-full group-hover:bg-neo-vibrant-blue/20 transition-all duration-700" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-6">
                                <Link href="/dashboard">
                                    <Button variant="ghost" className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 p-0 text-white/50 hover:text-white border border-white/10 transition-all duration-500">
                                        <ArrowLeft className="w-6 h-6" />
                                    </Button>
                                </Link>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-8 h-[1px] bg-neo-vibrant-blue/40" />
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-neo-vibrant-blue leading-none">Management Dashboard</span>
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tighter text-white">
                                        Operations <span className="text-white/40">Summary</span>
                                    </h2>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="bg-white/5 border border-white/10 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 backdrop-blur-md">
                                    {activeFilter} Review
                                </div>
                            </div>
                        </div>

                        {/* Professional KPI Pods */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-auto px-2">
                            <div className="relative group/pod">
                                <div className="absolute -inset-2 bg-gradient-to-br from-neo-vibrant-blue/20 to-transparent rounded-3xl opacity-0 group-hover/pod:opacity-100 transition-opacity duration-500 blur-xl" />
                                <div className="relative bg-white/5 border border-white/10 px-8 py-6 rounded-[2.5rem] transition-all duration-500 hover:bg-white/10 hover:border-white/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Wallet className="w-4 h-4 text-neo-vibrant-blue" />
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-black">Net Revenue</span>
                                    </div>
                                    <div className="text-4xl font-black tracking-tighter text-white tabular-nums mb-2">
                                        ₹{activeFilter === "Today" ? "12,500" : activeFilter === "This Week" ? "84,000" : "3.4L"}
                                    </div>
                                    <div className="text-[10px] text-neo-emerald font-black flex items-center gap-1.5 uppercase tracking-widest bg-neo-emerald/10 w-fit px-2 py-0.5 rounded-full">
                                        <TrendingUp className="w-3 h-3" /> +8.2%
                                    </div>
                                </div>
                            </div>

                            <div className="relative group/pod">
                                <div className="absolute -inset-2 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover/pod:opacity-100 transition-opacity duration-500 blur-xl" />
                                <div className="relative bg-white/5 border border-white/10 px-8 py-6 rounded-[2.5rem] transition-all duration-500 hover:bg-white/10 hover:border-white/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Users className="w-4 h-4 text-white/50" />
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-black">Patients</span>
                                    </div>
                                    <div className="text-4xl font-black tracking-tighter text-white tabular-nums mb-2">
                                        {activeFilter === "Today" ? "08" : activeFilter === "This Week" ? "42" : "156"}
                                    </div>
                                    <div className="text-[11px] text-white/20 font-bold">
                                        {activeFilter === "Today" ? "3 Arrivals Pending" : "Flow Patterns Stable"}
                                    </div>
                                </div>
                            </div>

                            <div className="relative group/pod">
                                <div className="absolute -inset-2 bg-gradient-to-br from-neo-vibrant-blue/20 to-transparent rounded-3xl opacity-0 group-hover/pod:opacity-100 transition-opacity duration-500 blur-xl" />
                                <div className="relative bg-white/5 border border-white/10 px-8 py-6 rounded-[2.5rem] transition-all duration-500 hover:bg-white/10 hover:border-white/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Activity className="w-4 h-4 text-neo-vibrant-blue" />
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-black">Utilization</span>
                                    </div>
                                    <div className="text-4xl font-black tracking-tighter text-white tabular-nums mb-2">
                                        {activeFilter === "Today" ? "72%" : "84%"}
                                    </div>
                                    <div className="text-[10px] text-neo-vibrant-blue font-black uppercase tracking-widest">
                                        Peak Performance
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </PanzeCard>

                {/* Intelligence Core (Editorial Style) */}
                <PanzeCard className="flex flex-col bg-[#0a0b14] border-white/5 rounded-[4rem] relative overflow-hidden group shadow-2xl p-0">
                    <div className="p-8 space-y-8 flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-neo-vibrant-blue rounded-2xl border border-white/10 group-hover:bg-neo-vibrant-blue group-hover:text-white group-hover:shadow-[0_0_30px_rgba(0,122,255,0.4)] transition-all duration-500">
                                    <ZapIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase text-white/40 tracking-[0.4em]">Intelligence Core</h3>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-neo-vibrant-blue animate-pulse shadow-[0_0_10px_#007AFF]" />
                        </div>

                        <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-neo-emerald/10 rounded-2xl text-neo-emerald border border-neo-emerald/20">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-base font-black tracking-tight text-white mb-0.5">Growth Analysis</div>
                                    <div className="text-[10px] text-neo-emerald font-black uppercase tracking-widest">Positive Trajectory</div>
                                </div>
                            </div>
                            <p className="text-[12px] text-white/40 font-medium leading-[1.6] italic">
                                "Our current {activeFilter.toLowerCase()} audit indicates a 12% rise in operational velocity. Clinical throughput is optimized across all nodes."
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 border-t border-white/10">
                        <Button variant="ghost" className="w-full h-14 rounded-3xl border-dashed border border-white/10 text-white/30 hover:text-white hover:bg-white/10 hover:border-white/20 text-[10px] font-black uppercase tracking-widest gap-3 transition-all duration-500">
                            <ScrollText className="w-4 h-4" /> System Registry
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
