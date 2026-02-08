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
import { Mic, Search, ShieldCheck, Zap as ZapIcon, ScrollText, Wallet, Activity, Briefcase } from "lucide-react";
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
        <div className="space-y-10 min-h-[800px] pb-24 px-4 lg:px-0">
            {/* 1. Admin Header & Quick Stats (Neo-Trinity Style) */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="grid grid-cols-1 md:grid-cols-4 gap-8"
            >
                <PanzeCard className="md:col-span-2 bg-gradient-to-br from-[#0A1128] via-[#001D3D] to-black text-white border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] rounded-[3rem]">
                    <div className="relative z-10 p-2">
                        <div className="flex items-center gap-2 mb-2 opacity-60">
                            <ShieldCheck className="w-4 h-4 text-neo-vibrant-blue" />
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Secure Terminal</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
                            Command <span className="text-neo-vibrant-blue italic text-2xl font-light ml-2">Center</span>
                        </h2>
                    </div>

                    <div className="relative z-10 flex gap-6 mt-4 p-2">
                        <div className="glass-neo px-6 py-4 flex-1 border-white/5 bg-white/[0.02]">
                            <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1 font-black">Gross Revenue</div>
                            <div className="text-3xl font-black tracking-tighter">₹ 42,500</div>
                            <div className="text-[9px] text-neo-emerald font-bold mt-1">+12.5% vs yesterday</div>
                        </div>
                        <div className="glass-neo px-6 py-4 flex-1 border-white/5 bg-white/[0.02]">
                            <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1 font-black">Capacity</div>
                            <div className="text-3xl font-black tracking-tighter">12<span className="text-white/20">/15</span></div>
                            <div className="text-[9px] text-neo-lavender font-bold mt-1">3 slots available</div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-neo-vibrant-blue/10 blur-[100px] rounded-full" />
                    <ZapIcon className="absolute right-6 top-6 w-12 h-12 text-white/5 rotate-12" />
                </PanzeCard>

                <PanzeCard className="flex flex-col justify-between p-8 min-h-[220px] glass-neo border-white/5 bg-white/[0.01] rounded-[3rem]">
                    <div className="flex items-start justify-between">
                        <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-neo-emerald/20 to-transparent border border-neo-emerald/20 flex items-center justify-center text-neo-emerald shadow-lg shadow-emerald-500/10">
                            <Activity className="w-7 h-7" />
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Clinic Pulse</div>
                            <Badge variant="outline" className="bg-neo-emerald/10 text-neo-emerald border-neo-emerald/20 px-2 py-0 text-[9px] font-bold">OPTIMAL</Badge>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                            <span>Efficiency</span>
                            <span>85%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "85%" }}
                                transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
                                className="bg-gradient-to-r from-neo-emerald to-emerald-400 h-full rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            />
                        </div>
                    </div>
                </PanzeCard>

                <PanzeCard className="flex flex-col justify-between p-8 min-h-[220px] glass-neo border-white/5 bg-white/[0.01] rounded-[3rem]">
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4">NEO Intelligence</h3>
                        <Button variant="outline" className="w-full justify-between px-6 h-16 rounded-2xl border-white/5 bg-white/[0.02] text-slate-300 hover:text-white hover:bg-white/5 group transition-all duration-500">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-neo-vibrant-blue/10 text-neo-vibrant-blue flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                    <Mic className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold tracking-tight">Voice Action</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-neo-vibrant-blue animate-pulse" />
                        </Button>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium italic mt-2">Try: "Summarize today's revenue"</p>
                </PanzeCard>
            </motion.div>

            {/* 2. Main Analytics Grid (Neo-Trinity Bento) */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <PanzeCard className="lg:col-span-2 p-0 overflow-hidden flex flex-col glass-neo border-white/5 bg-white/[0.01] rounded-[3rem] min-h-[450px]">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <div>
                            <h3 className="font-black text-white tracking-widest uppercase text-xs">Financial Ecosystem</h3>
                            <p className="text-[10px] text-slate-500 font-medium mt-1">Real-time revenue stream analysis</p>
                        </div>
                        <div className="flex gap-3">
                            <Badge variant="secondary" className="rounded-xl px-4 py-1.5 bg-white/5 text-white border-white/10 hover:bg-white/10 transition-colors">Weekly</Badge>
                            <Badge variant="outline" className="rounded-xl px-4 py-1.5 text-slate-500 border-white/5">Monthly</Badge>
                        </div>
                    </div>
                    <div className="flex-1 p-6">
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

                <PanzeCard className="flex flex-col p-8 glass-neo border-white/5 bg-white/[0.01] rounded-[3rem] min-h-[450px]">
                    <div className="mb-10">
                        <h3 className="font-black text-white tracking-widest uppercase text-xs">Department Distribution</h3>
                        <p className="text-[10px] text-slate-500 font-medium mt-1">Load balance across specialties</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center relative">
                        <DonutChart
                            title=""
                            totalLabel="Active"
                            totalValue="86"
                            data={[
                                { name: 'General', value: 35, color: '#007AFF' },
                                { name: 'Ortho', value: 25, color: '#A78BFA' },
                                { name: 'Surgery', value: 15, color: '#FF6B6B' },
                                { name: 'Pedo', value: 11, color: '#059669' },
                            ]}
                        />
                        {/* Center decoration */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-32 h-32 bg-neo-vibrant-blue/5 blur-[40px] rounded-full" />
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
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                        <h2 className="text-[10px] font-black italic tracking-[0.3em] text-white/30 uppercase">Operational Architecture</h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                    </div>
                    <div className="glass-neo p-2 border-white/5 bg-white/[0.01] rounded-[3.5rem]">
                        <ClinicManagementDeck />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
