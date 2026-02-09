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
        <div className="space-y-5 min-h-[600px] pb-20 px-4 lg:px-0">
            {/* 1. Perspective & Intel Layer */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4"
            >
                {/* Operations Summary (Frosty White Glass) */}
                <PanzeCard className="lg:col-span-2 group glass-frost border-white/5 relative overflow-hidden flex flex-col min-h-[220px] md:min-h-[240px] transition-all duration-1000 p-4 shadow-lg backdrop-blur-[24px] rounded-xl bg-card">
                    {/* Champagne Gold & Silver Silk Glows - REDUCED OPACITY */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-background/5 z-0 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_85%_0%,_var(--accent)_0%,_transparent_75%)] opacity-5 pointer-events-none" />

                    <div className="relative z-20 flex flex-col h-full">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 md:mb-14">
                            <div className="flex items-center gap-4 md:gap-6">
                                <Link href="/dashboard">
                                    <Button variant="ghost" className="w-8 h-8 rounded-lg bg-background/40 hover:bg-background/60 p-0 text-foreground hover:text-primary border border-border transition-all duration-700 backdrop-blur-md shadow-sm">
                                        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                                    </Button>
                                </Link>
                                <div>
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <div className="w-8 h-[2px] bg-primary" />
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-muted-foreground">Perspective</span>
                                    </div>
                                    <h1 className="text-xl font-bold tracking-tight text-foreground leading-none">
                                        Operations <span className="opacity-70 font-light">Analysis</span>
                                    </h1>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="glass-frost border-border/10 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-foreground backdrop-blur-md shadow-sm bg-card/30">
                                    {activeFilter} MATRIC
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-auto py-3">
                            {[
                                { label: "Net Yield", value: activeFilter === "Today" ? "12,500" : activeFilter === "This Week" ? "84,000" : "3.4L", icon: Wallet, trend: "+8.2%", positive: true },
                                { label: "Case Load", value: activeFilter === "Today" ? "08" : "156", icon: Users, sub: "Growth Stable", positive: true },
                                { label: "Performance", value: activeFilter === "Today" ? "72%" : "84%", icon: Activity, trend: "Elite", positive: false }
                            ].map((pod, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -4 }}
                                    className="relative group/pod flex flex-col items-center text-center"
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg bg-background/50 border border-border/50 flex items-center justify-center transition-all duration-700 shadow-sm",
                                        pod.positive ? "text-emerald-500 group-hover/pod:bg-emerald-500/10" : "text-blue-500 group-hover/pod:bg-blue-500/10"
                                    )}>
                                        <pod.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-black mb-1.5">{pod.label}</span>
                                    <div className="text-lg md:text-xl font-bold tracking-tight text-foreground mb-1.5">
                                        {pod.value.startsWith('₹') ? pod.value : `₹${pod.value}`}
                                    </div>
                                    {pod.trend ? (
                                        <div className={cn(
                                            "text-[10px] font-black px-6 py-2.5 rounded-full border border-border/50 uppercase tracking-[0.4em] flex items-center gap-2 transition-all duration-500 shadow-sm",
                                            pod.positive ? "bg-emerald-500/5 text-emerald-600 group-hover/pod:bg-emerald-500 group-hover/pod:text-white" : "bg-blue-500/5 text-blue-600 group-hover/pod:bg-blue-500 group-hover/pod:text-white"
                                        )}>
                                            <TrendingUp className="w-4 h-4 opacity-70" /> {pod.trend}
                                        </div>
                                    ) : (
                                        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-90">{pod.sub}</span>
                                    )}
                                    {/* Silk Glow On Hover - REDUCED BLUR & OPACITY */}
                                    <div className={cn(
                                        "absolute -inset-2 rounded-xl opacity-0 group-hover/pod:opacity-100 transition-all duration-700 blur-xl -z-10",
                                        pod.positive ? "bg-emerald-500/[0.03]" : "bg-blue-500/[0.03]"
                                    )} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </PanzeCard>

                {/* Intelligence Layer (Frosty White Glass) */}
                <PanzeCard className="flex flex-col glass-frost border-white/5 rounded-xl relative overflow-hidden group shadow-lg backdrop-blur-[24px] min-h-[220px] bg-card">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                    <div className="p-4 space-y-4 flex-1 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary rounded-xl border border-primary/20 group-hover:scale-105 transition-all duration-700 shadow-lg shadow-primary/5">
                                <ZapIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1.5">
                                    <div className="w-4 h-[1px] bg-primary" />
                                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-bold text-primary">AI Pulse</span>
                                </div>
                                <h3 className="text-base font-semibold tracking-tight text-foreground leading-none">Intelligence</h3>
                            </div>
                        </div>

                        <div className="relative group/insight pt-4">
                            <div className="relative bg-background/40 rounded-xl p-4 border border-border/50 backdrop-blur-md group-hover/insight:bg-background/60 group-hover/insight:border-primary/20 transition-all duration-700 shadow-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/10 group-hover/insight:bg-primary/10 transition-all duration-700">
                                        <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <div className="text-base font-bold tracking-tight text-foreground mb-0.5 uppercase">Growth Index</div>
                                        <div className="text-[9px] text-primary font-black uppercase tracking-widest opacity-100 underline decoration-primary/30 underline-offset-4">Standard Sync</div>
                                    </div>
                                </div>
                                <p className="text-[11px] md:text-[12px] text-muted-foreground font-semibold leading-relaxed italic border-l-2 border-primary/60 pl-6 bg-primary/5 py-4 rounded-r-2xl font-serif">
                                    &quot;Clinical velocity indicators suggest a conversion optimization window. Unified staff performance remains at elite benchmarks.&quot;
                                </p>
                            </div>
                            {/* Ambient Glow - REDUCED BLUR */}
                            <div className="absolute -inset-4 bg-primary/[0.02] rounded-[2rem] opacity-0 group-hover/insight:opacity-100 blur-2xl transition-all duration-1000 -z-10" />
                        </div>
                    </div>

                    <div className="p-6 md:p-8 bg-muted/20 border-t border-border/10">
                        <Button variant="ghost" className="w-full h-12 rounded-[1.5rem] bg-background hover:bg-muted border border-border text-foreground hover:text-primary text-[10px] font-black uppercase tracking-[0.4em] gap-4 transition-all duration-700 shadow-sm">
                            <ScrollText className="w-5 h-5 opacity-100" /> System Registry
                        </Button>
                    </div>
                </PanzeCard>
            </motion.div>

            {/* 2. Analytics Hub (Editorial Arctic Blue) */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
            >
                <div className="relative group">
                    <div className="absolute -inset-2 bg-blue-500/[0.02] rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-1000" />
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
                    <div className="absolute -inset-2 bg-amber-500/[0.02] rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-1000" />
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
            <motion.div variants={itemVariants} className="space-y-5 pb-20">
                <div className="flex items-center gap-12 px-6">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border/20 to-transparent" />
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                        <h2 className="text-[10px] font-black tracking-[0.6em] text-foreground uppercase whitespace-nowrap border-b border-border/50 pb-1">Clinical Operations Hub</h2>
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border/20 to-transparent" />
                </div>
                <div className="glass-frost px-4 py-6 border-white/5 rounded-2xl shadow-lg backdrop-blur-[24px] relative overflow-hidden group transition-all duration-1000 bg-card/50">
                    {/* Background Arctic Surface Glow - REDUCED */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_var(--accent)_0%,_transparent_60%)] opacity-5 pointer-events-none" />
                    <div className="relative z-10">
                        <ClinicManagementDeck />
                    </div>
                </div>
            </motion.div>
        </div >
    );
}
