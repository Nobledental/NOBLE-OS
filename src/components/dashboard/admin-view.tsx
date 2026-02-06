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
import { Mic, Search, ShieldCheck, Zap as ZapIcon, ScrollText, Wallet, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TARIFF_MASTER_DATA } from "@/lib/data/tariff-data";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
};

export function AdminDashboardView() {
    const [priceSearch, setPriceSearch] = useState("");
    const filteredPrices = TARIFF_MASTER_DATA.filter(p =>
        p.name.toLowerCase().includes(priceSearch.toLowerCase())
    ).slice(0, 3);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[800px]">
            {/* Top Row: Revenue & Highlights */}
            <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SplineChart
                        className="md:col-span-2"
                        title="Revenue Trend"
                        data={[
                            { name: 'Mon', value: 4000 },
                            { name: 'Tue', value: 3000 },
                            { name: 'Wed', value: 2000 },
                            { name: 'Thu', value: 2780 },
                            { name: 'Fri', value: 1890 },
                            { name: 'Sat', value: 2390 },
                            { name: 'Sun', value: 3490 },
                        ]}
                    />

                    {/* Quick Price Check Widget */}
                    <PanzeCard className="h-full flex flex-col gap-4 bg-indigo-50/50 border-indigo-100">
                        <div className="flex items-center gap-2">
                            <ScrollText className="w-4 h-4 text-indigo-600" />
                            <h4 className="text-xs font-black uppercase text-slate-500 italic">Quick Price Check</h4>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                            <Input
                                placeholder="Search procedure..."
                                className="pl-8 h-9 text-xs bg-white/80 border-indigo-100 focus:ring-indigo-500"
                                value={priceSearch}
                                onChange={(e) => setPriceSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 space-y-2 overflow-y-auto max-h-[120px] scrollbar-hide">
                            {priceSearch && filteredPrices.map(p => (
                                <div key={p.id} className="flex justify-between items-center p-2 rounded-xl bg-white border border-indigo-50">
                                    <span className="text-[10px] font-bold text-slate-700 truncate max-w-[100px]">{p.name}</span>
                                    <span className="text-[10px] font-black text-indigo-600">₹{p.cost}</span>
                                </div>
                            ))}
                            {!priceSearch && (
                                <div className="text-[9px] text-slate-400 italic text-center py-4">
                                    Type to search procedures...
                                </div>
                            )}
                        </div>
                    </PanzeCard>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <PanzeCard className="flex flex-col justify-between h-[180px]">
                        <h4 className="text-slate-500 font-bold text-xs uppercase">Total Patients</h4>
                        <div className="text-4xl font-black text-slate-900">1,284</div>
                        <div className="text-green-500 text-sm font-bold flex items-center">
                            +12% <span className="text-slate-400 ml-1 font-normal">vs last month</span>
                        </div>
                    </PanzeCard>
                    <PanzeCard className="flex flex-col justify-between h-[180px]">
                        <h4 className="text-slate-500 font-bold text-xs uppercase">Appointments</h4>
                        <div className="text-4xl font-black text-slate-900">42</div>
                        <div className="text-blue-500 text-sm font-bold flex items-center">
                            8 <span className="text-slate-400 ml-1 font-normal">slots remaining</span>
                        </div>
                    </PanzeCard>
                </div>
            </motion.div>

            {/* Right Area: Department Breakdown & Pulse */}
            <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
                <div className="mb-2">
                    <ChiefPulse />
                </div>

                {/* Attendance Pulse Widget */}
                <PanzeCard className="p-6 bg-white dark:bg-slate-900 border-none shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-indigo-500" />
                            <h4 className="text-xs font-black uppercase text-slate-500 italic">Attendance Pulse</h4>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] font-black uppercase tracking-widest px-2">8/10 IN</Badge>
                    </div>
                    <div className="flex -space-x-2 overflow-hidden mb-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-100 overflow-hidden relative">
                                <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
                                <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-900 text-white text-[8px] font-black ring-2 ring-white">+3</div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium italic">Dr. Arjun, Sarah, Priya, and 5 others are currently on floor.</p>
                </PanzeCard>

                <DonutChart
                    title="Department Load"
                    totalLabel="Total Cases"
                    totalValue="86"
                    data={[
                        { name: 'General', value: 35, color: '#3b82f6' },
                        { name: 'Ortho', value: 25, color: '#8b5cf6' },
                        { name: 'Surgery', value: 15, color: '#ec4899' },
                        { name: 'Pedo', value: 11, color: '#14b8a6' },
                    ]}
                />

                <div className="flex-1">
                    <ProjectsOverview />
                </div>
            </motion.div>

            {/* Bottom Row: Active Queue & Actions */}
            <motion.div variants={itemVariants} className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                    <ActiveQueue />
                </div>

                <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* Revenue Ritual / EOD Settlement Mini-Widget */}
                    <PanzeCard className="bg-emerald-50 border-emerald-100 flex flex-col gap-4 p-6 h-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                <h4 className="text-sm font-black uppercase text-slate-700 italic tracking-tighter">Revenue Ritual</h4>
                            </div>
                            <Badge className="bg-amber-100 text-amber-600 border-amber-200 text-[9px] font-black uppercase tracking-widest px-2">Pending Close</Badge>
                        </div>
                        <div className="flex-1 flex flex-col justify-center gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-500 uppercase">Verification Progress</span>
                                <span className="text-[11px] font-black text-emerald-600">85%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
                                    className="bg-emerald-500 h-full"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 italic">2 transactions pending digital confirmation.</p>
                        </div>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 font-bold text-xs gap-2">
                            <Wallet className="w-4 h-4" /> Go to Settlement
                        </Button>
                    </PanzeCard>

                    <div className="h-full">
                        <PatientTracker />
                    </div>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-6">
                    <PanzeCard className="h-full bg-slate-900 text-white flex flex-col items-center justify-center text-center p-6 shadow-xl shadow-slate-900/20">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 animate-pulse">
                            <Mic className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-lg font-medium text-slate-200 italic">
                            "Hey NEO, add patient Suresh for a Root Canal."
                        </p>
                    </PanzeCard>
                </div>
            </motion.div>
        </div>
    );
}
