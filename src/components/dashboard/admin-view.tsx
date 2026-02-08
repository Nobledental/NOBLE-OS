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
import { Mic, Search, ShieldCheck, Zap as ZapIcon, ScrollText, Wallet, Activity, Briefcase, ArrowUpRight } from "lucide-react";
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

export function AdminDashboardView() {
    return (
        <div className="space-y-12 min-h-[800px] pb-32 px-4 lg:px-0">
            {/* 1. Admin Header & Quick Stats (Apple Refined Style) */}
            <div className="flex flex-col mb-4">
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">Practice Overview</h2>
                <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] mt-1 ml-1">Logged in as ADMIN</p>
            </div>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.12 } }
                }}
                className="grid grid-cols-1 md:grid-cols-4 gap-10"
            >
                <PanzeCard className="md:col-span-2 group glass-white border-white/40 bg-white/60 text-slate-900 relative overflow-hidden flex flex-col justify-between min-h-[280px] transition-all duration-700">
                    <div className="relative z-10 p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-neo-vibrant-blue/10 flex items-center justify-center border border-neo-vibrant-blue/20">
                                <ShieldCheck className="w-4 h-4 text-neo-vibrant-blue" />
                            </div>
                            <span className="text-[11px] uppercase tracking-[0.4em] font-black text-neo-vibrant-blue/60">CORE COMMAND SERVER</span>
                        </div>
                        <h2 className="text-5xl font-bold tracking-tight mb-2 text-slate-900 leading-none">
                            Operational <span className="uppercase text-neo-vibrant-blue/80">Flux</span>
                        </h2>
                    </div>

                    <div className="relative z-10 flex gap-8 p-4">
                        <div className="glass-white flex-1 px-8 py-6 border-white/20 bg-white/40 flex flex-col justify-center shadow-lg">
                            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-2 font-black">Revenue Velocity</div>
                            <div className="text-4xl font-black tracking-tighter text-slate-900">₹ 42,500</div>
                            <div className="text-[10px] text-neo-emerald font-bold mt-2 flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" /> +12.5% VITALITY
                            </div>
                        </div>
                        <div className="glass-white flex-1 px-8 py-6 border-white/20 bg-white/40 flex flex-col justify-center shadow-lg">
                            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-2 font-black">Node Capacity</div>
                            <div className="text-4xl font-black tracking-tighter text-slate-900">12<span className="text-slate-300">/15</span></div>
                            <div className="text-[10px] text-neo-lavender font-bold mt-2">3 SLOTS SYNCHED</div>
                        </div>
                    </div>

                    {/* Decorative Elements - Dynamic Aura */}
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-neo-vibrant-blue/10 blur-[120px] rounded-full group-hover:bg-neo-vibrant-blue/20 transition-all duration-1000" />
                    <ZapIcon className="absolute right-8 top-8 w-16 h-16 text-slate-200/20 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                </PanzeCard>

                <PanzeCard className="flex flex-col justify-between p-10 min-h-[280px] glass-white border-white/40 bg-white/60 rounded-[3rem] animate-float relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-neo-emerald/20 to-transparent border border-neo-emerald/20 flex items-center justify-center text-neo-emerald shadow-2xl shadow-neo-emerald/10">
                            <Activity className="w-8 h-8" />
                        </div>
                        <div className="text-right">
                            <div className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] mb-2">SYSTEM PULSE</div>
                            <Badge variant="outline" className="bg-neo-emerald/10 text-neo-emerald border-neo-emerald/20 px-3 py-1 text-[10px] font-black uppercase">STEADY</Badge>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Biometric Load</span>
                            <span className="text-neo-emerald">85%</span>
                        </div>
                        <div className="w-full bg-slate-100/50 h-3 rounded-full overflow-hidden border border-slate-200 p-0.5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "85%" }}
                                transition={{ duration: 1.5, ease: [0.32, 0.72, 0, 1] }}
                                className="bg-gradient-to-r from-neo-emerald via-emerald-400 to-neo-emerald h-full rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                            />
                        </div>
                    </div>
                </PanzeCard>

                <PanzeCard className="flex flex-col justify-between p-10 min-h-[280px] glass-white border-white/40 bg-white/60 rounded-[3rem] hover:bg-white/80 transition-all duration-500 relative overflow-hidden">
                    <div className="space-y-2">
                        <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em] mb-6">NEO SYNAPSE</h3>
                        <Button variant="outline" className="w-full justify-between px-8 h-20 rounded-[2rem] border-slate-200 bg-white/50 text-slate-900 hover:bg-white group transition-all duration-700">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-neo-vibrant-blue/10 text-neo-vibrant-blue flex items-center justify-center group-hover:scale-110 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(0,122,255,0.1)]">
                                    <Mic className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-black tracking-tight">Active Matrix</div>
                                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Listening...</div>
                                </div>
                            </div>
                            <div className="w-3 h-3 rounded-full bg-neo-vibrant-blue animate-pulse shadow-[0_0_10px_var(--neo-vibrant-blue)]" />
                        </Button>
                    </div>
                    <p className="text-[11px] text-slate-400 font-black mt-4 tracking-tight">"Protocol: Initialize Daily Summary"</p>
                </PanzeCard>
            </motion.div>

            {/* 2. Main Analytics Grid (Neo-Trinity Bento) */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <PanzeCard className="lg:col-span-2 p-0 overflow-hidden flex flex-col glass-white border-white/40 bg-white/60 rounded-[3.5rem] transition-all duration-700">
                    <div className="p-10 border-b border-white/20 flex items-center justify-between bg-white/40">
                        <div>
                            <h3 className="text-[11px] font-black text-slate-800 tracking-[0.4em] uppercase mb-2">FINANCIAL REVENUE VELOCITY</h3>
                            <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">Proprietary Node Analysis Layer</p>
                        </div>
                        <div className="flex gap-4">
                            <Badge variant="secondary" className="rounded-2xl px-6 py-2 bg-neo-vibrant-blue text-white border-neo-vibrant-blue/20 hover:scale-105 transition-all text-[10px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(0,122,255,0.2)]">WEEKLY OPS</Badge>
                            <Badge variant="outline" className="rounded-2xl px-6 py-2 text-slate-400 border-slate-200 hover:bg-slate-50 transition-all text-[10px] font-black uppercase tracking-widest">MONTHLY NODE</Badge>
                        </div>
                    </div>
                    <div className="flex-1 p-10 bg-gradient-to-b from-transparent to-white/40">
                        <SplineChart
                            title=""
                            data={[
                                { name: 'Mon', value: 4000 },
                                { name: 'Tue', value: 3000 },
                                { name: 'Wed', value: 5000 },
                                { name: 'Thu', value: 2780 },
                                { name: 'Fri', value: 1890 },
                                { name: 'Sat', value: 6390 },
                                { name: 'Sun', value: 3490 },
                            ]}
                            className="h-full w-full"
                        />
                    </div>
                </PanzeCard>

                <PanzeCard className="flex flex-col p-10 glass-white border-white/40 bg-white/60 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
                    <div className="mb-12">
                        <h3 className="text-[11px] font-black text-slate-800 tracking-[0.4em] uppercase mb-2">NEO LOAD DISTRIBUTION</h3>
                        <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">Cross-Department Synergetic Matrix</p>
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
                        {/* Center decoration */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-40 h-40 bg-neo-vibrant-blue/5 blur-[60px] rounded-full" />
                        </div>
                    </div>
                </PanzeCard>
            </motion.div>

            {/* 3. Operations & Queue (Refined Layout) */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Live Queue (Premium Glass) */}
                <div className="space-y-8">
                    <ActiveQueue />
                </div>

                {/* Column 2 & 3: Clinic Management Deck (Neo-Integrated) */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="flex items-center gap-6 p-4">
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                        <h2 className="text-[12px] font-black tracking-[0.5em] text-slate-400 uppercase whitespace-nowrap">Core Synergetic Deck</h2>
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
