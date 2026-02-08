"use client";

import { motion } from "framer-motion";
import { ActiveQueue } from "./active-queue";
import { ProjectsOverview } from "./projects-overview";
import { RevenueChart } from "./revenue-chart";
import { PatientTracker } from "./patient-tracker";
import { ChiefPulse } from "./chief-pulse";
import { SplineChart } from "@/components/ui/charts/spline-chart";
import { DonutChart } from "@/components/ui/charts/donut-chart";
import { PanzeCard } from "@/components/ui/panze-card";
import { BarChart3, Search, LayoutDashboard, Zap as ZapIcon, ScrollText, Wallet, Activity, Briefcase, ArrowUpRight, TrendingUp, Users, Calendar } from "lucide-react";
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
                <PanzeCard className="lg:col-span-2 group glass-white border-white/40 bg-white/60 text-slate-900 relative overflow-hidden flex flex-col min-h-[320px] transition-all duration-700 p-8">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-neo-vibrant-blue/10 flex items-center justify-center border border-neo-vibrant-blue/20">
                                    <LayoutDashboard className="w-5 h-5 text-neo-vibrant-blue" />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 leading-none">Management Dashboard</span>
                                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
                                        Operations <span className="text-neo-vibrant-blue">Summary</span>
                                    </h2>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge variant="outline" className="bg-white/50 border-slate-200 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    {activeFilter} Review
                                </Badge>
                            </div>
                        </div>

                        {/* Professional KPI Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-auto">
                            <div className="glass-white px-6 py-5 border-white/20 bg-white/40 shadow-sm rounded-2xl transition-all hover:bg-white/60">
                                <div className="flex items-center gap-2 mb-2">
                                    <Wallet className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black">Net Revenue</span>
                                </div>
                                <div className="text-3xl font-black tracking-tighter text-slate-900 tabular-nums">
                                    ₹{activeFilter === "Today" ? "12,500" : activeFilter === "This Week" ? "84,000" : "342,500"}
                                </div>
                                <div className="text-[10px] text-neo-emerald font-bold mt-2 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> +8.2% vs prev
                                </div>
                            </div>

                            <div className="glass-white px-6 py-5 border-white/20 bg-white/40 shadow-sm rounded-2xl transition-all hover:bg-white/60">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black">Patients Treated</span>
                                </div>
                                <div className="text-3xl font-black tracking-tighter text-slate-900 tabular-nums">
                                    {activeFilter === "Today" ? "08" : activeFilter === "This Week" ? "42" : "156"}
                                </div>
                                <div className="text-[10px] text-slate-400 font-bold mt-2">
                                    {activeFilter === "Today" ? "3 Arrivals Pending" : activeFilter === "This Week" ? "12 New Registered" : "Flow Steady"}
                                </div>
                            </div>

                            <div className="glass-white px-6 py-5 border-white/20 bg-white/40 shadow-sm rounded-2xl transition-all hover:bg-white/60">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black">Clinical Utilization</span>
                                </div>
                                <div className="text-3xl font-black tracking-tighter text-slate-900 tabular-nums">
                                    {activeFilter === "Today" ? "72%" : activeFilter === "This Week" ? "78%" : "84%"}
                                </div>
                                <div className="text-[10px] text-neo-vibrant-blue font-bold mt-2">
                                    Optimized Flow
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Background Detail */}
                    <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-neo-vibrant-blue/5 blur-[80px] rounded-full" />
                </PanzeCard>

                {/* Intelligence Core (Streamlined) */}
                <PanzeCard className="flex flex-col justify-between p-8 glass-white border-white/40 bg-white/60 rounded-[3.5rem] relative overflow-hidden group">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-900 text-white rounded-lg group-hover:bg-neo-vibrant-blue transition-colors duration-500">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Intelligence Core</h3>
                        </div>

                        <div className="bg-white/60 rounded-3xl p-6 border border-white/80 shadow-inner">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-neo-vibrant-blue/10 rounded-2xl text-neo-vibrant-blue border border-neo-vibrant-blue/20">
                                    <Activity className="w-5 h-5 animate-pulse" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold tracking-tight">System Status</div>
                                    <div className="text-[9px] text-neo-emerald font-black uppercase tracking-widest">Global Optima</div>
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                                "Analyzing clinical trends for {activeFilter.toLowerCase()}. Efficiency remains in the 80th percentile..."
                            </p>
                        </div>
                    </div>

                    <Button variant="ghost" className="w-full mt-6 h-12 rounded-2xl border-dashed border-2 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-widest gap-2">
                        <ScrollText className="w-3.5 h-3.5" /> Clinical Log Archive
                    </Button>
                </PanzeCard>
            </motion.div>

            {/* 2. Analytics Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <PanzeCard className="lg:col-span-2 p-0 overflow-hidden flex flex-col glass-white border-white/40 bg-white/60 rounded-[3.5rem] transition-all duration-700">
                    <div className="p-10 border-b border-white/20 flex items-center justify-between bg-white/40">
                        <div>
                            <h3 className="text-[11px] font-black text-slate-800 tracking-[0.4em] uppercase mb-2">PRACTICE REVENUE ANALYSIS</h3>
                            <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">High-Performance Financial Tracking</p>
                        </div>
                        <div className="flex gap-4 tabular-nums">
                            <Badge variant="secondary" className="rounded-2xl px-6 py-2 bg-neo-vibrant-blue text-white border-neo-vibrant-blue/20 hover:scale-105 transition-all text-[10px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(0,122,255,0.2)]">
                                {activeFilter} OPS
                            </Badge>
                        </div>
                    </div>
                    <div className="flex-1 p-10 bg-gradient-to-b from-transparent to-white/40">
                        <SplineChart
                            title=""
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
                            className="h-full w-full"
                        />
                    </div>
                </PanzeCard>

                <PanzeCard className="flex flex-col p-10 glass-white border-white/40 bg-white/60 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
                    <div className="mb-12">
                        <h3 className="text-[11px] font-black text-slate-800 tracking-[0.4em] uppercase mb-2">CASE LOAD DISTRIBUTION</h3>
                        <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">Departmental Allocation Analysis</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center relative scale-110">
                        <DonutChart
                            title=""
                            totalLabel="VITAL"
                            totalValue="86%"
                            data={[
                                { name: 'General', value: 35, color: '#007AFF' },
                                { name: 'Ortho', value: 25, color: '#A78BFA' },
                                { name: 'Surgery', value: 15, color: '#FF6B6B' },
                                { name: 'Pedo', value: 11, color: '#059669' },
                            ]}
                        />
                    </div>
                </PanzeCard>
            </motion.div>

            {/* 3. Clinical Operations Center */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32">
                <div className="space-y-8">
                    <ActiveQueue />
                </div>

                <div className="lg:col-span-2 space-y-10">
                    <div className="flex items-center gap-6 p-4">
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                        <h2 className="text-[12px] font-black tracking-[0.5em] text-slate-400 uppercase whitespace-nowrap">Clinical Operations Center</h2>
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    </div>
                    <div className="glass-white px-2 py-6 border-white/40 bg-white/60 rounded-[4rem] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.05)]">
                        <ClinicManagementDeck />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
