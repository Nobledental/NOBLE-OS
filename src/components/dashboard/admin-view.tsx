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
        <div className="space-y-6 min-h-[800px] pb-20">
            {/* 1. Admin Header & Quick Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <PanzeCard className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-900 text-white border-none relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black italic tracking-tighter mb-1">Admin Command</h2>
                        <p className="text-indigo-200 text-xs font-medium">Noble Dental Clinic • Main Branch</p>
                    </div>
                    <div className="relative z-10 flex gap-4 mt-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex-1">
                            <div className="text-[10px] uppercase tracking-widest text-indigo-200 mb-1">Daily Revenue</div>
                            <div className="text-2xl font-black">₹ 42,500</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex-1">
                            <div className="text-[10px] uppercase tracking-widest text-indigo-200 mb-1">Active Staff</div>
                            <div className="text-2xl font-black">12/15</div>
                        </div>
                    </div>
                    <ZapIcon className="absolute right-0 top-0 w-32 h-32 text-white/5 -mr-4 -mt-4 rotate-12" />
                </PanzeCard>

                <PanzeCard className="flex flex-col justify-center gap-4 min-h-[160px]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase text-slate-400">Clinical Pulse</div>
                            <div className="text-sm font-bold text-slate-700">All Systems Normal</div>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 w-[85%] h-full rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] font-medium text-slate-400">
                        <span>OPD Load</span>
                        <span>85% Capacity</span>
                    </div>
                </PanzeCard>

                <PanzeCard className="flex flex-col justify-center gap-2 min-h-[160px]">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Voice Actions</h3>
                    <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 group">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Mic className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold">"Add Appointment"</span>
                    </Button>
                    <p className="text-[10px] text-center text-slate-300 italic">Press Alt + V to activate</p>
                </PanzeCard>
            </motion.div>

            {/* 2. Main Analytics Grid (Bento Style) */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                <PanzeCard className="lg:col-span-2 p-0 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-700">Financial Overview</h3>
                        <div className="flex gap-2">
                            <Badge variant="secondary" className="rounded-lg">Weekly</Badge>
                            <Badge variant="outline" className="rounded-lg">Monthly</Badge>
                        </div>
                    </div>
                    <div className="flex-1 p-4 min-h-0">
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

                <PanzeCard className="flex flex-col p-6">
                    <h3 className="font-bold text-slate-700 mb-6">Department Load</h3>
                    <div className="flex-1 flex items-center justify-center">
                        <DonutChart
                            title=""
                            totalLabel="Total"
                            totalValue="86"
                            data={[
                                { name: 'General', value: 35, color: '#3b82f6' },
                                { name: 'Ortho', value: 25, color: '#8b5cf6' },
                                { name: 'Surgery', value: 15, color: '#ec4899' },
                                { name: 'Pedo', value: 11, color: '#14b8a6' },
                            ]}
                        />
                    </div>
                </PanzeCard>
            </motion.div>

            {/* 3. Operations & Queue (3 Columns) */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
                {/* Column 1: Live Queue */}
                <div className="space-y-6 lg:h-full">
                    <ActiveQueue />
                </div>

                {/* Column 2: Operations Deck (Tabs styled as cards) */}
                <div className="grid grid-rows-2 gap-6 h-full">
                    <PanzeCard className="p-0 overflow-hidden border-none shadow-sm flex flex-col h-full bg-white dark:bg-slate-900 group relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                            <ScrollText className="w-12 h-12 text-indigo-900" />
                        </div>
                        <div className="p-4 bg-indigo-50/50 border-b border-indigo-100 flex items-center gap-2">
                            <ScrollText className="w-4 h-4 text-indigo-600" />
                            <span className="text-xs font-black uppercase text-indigo-900 tracking-widest">Tariff Master</span>
                        </div>
                        <div className="flex-1 overflow-auto p-2">
                            <TariffPage />
                        </div>
                    </PanzeCard>

                    <PanzeCard className="p-0 overflow-hidden border-none shadow-sm flex flex-col h-full bg-white dark:bg-slate-900">
                        <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-black uppercase text-emerald-900 tracking-widest">EOD Settlement</span>
                        </div>
                        <div className="flex-1 overflow-auto p-2">
                            <SettlementPage />
                        </div>
                    </PanzeCard>
                </div>

                {/* Column 3: Ledger & Specialist */}
                <div className="h-full">
                    <PanzeCard className="h-full p-0 overflow-hidden border-none shadow-sm flex flex-col bg-white dark:bg-slate-900">
                        <div className="p-4 bg-purple-50/50 border-b border-purple-100 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-black uppercase text-purple-900 tracking-widest">Specialist Ledger</span>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            <ConsultantLedgerPanel isAdmin={true} />
                        </div>
                    </PanzeCard>
                </div>
            </motion.div>

            {/* 4. Clinic Management Deck (Reference Features) *NEW* */}
            <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black italic tracking-tight text-slate-400 uppercase">Clinic Configuration</h2>
                    <Badge variant="outline" className="border-indigo-100 text-indigo-400">Admin Only</Badge>
                </div>
                <ClinicManagementDeck />
            </motion.div>
        </div>
    );
}
