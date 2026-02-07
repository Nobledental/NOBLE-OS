"use client";

import React, { useState } from "react";
import {
    TrendingUp,
    Users,
    ShieldCheck,
    Zap,
    Wallet,
    Building2,
    ArrowLeft,
    Settings,
    FileText,
    PieChart,
    Briefcase,
    ScrollText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HRStaffDirectory } from "@/components/clinical/hr-staff-directory";
import RecruitmentCommandCenter from "./recruitment-command-center";
import { cn } from "@/lib/utils";

import SettlementPage from "@/app/dashboard/settlement/page";
import TariffPage from "@/app/dashboard/tariff/page";
import ConsultantLedgerPanel from "@/components/collaboration/consultant-ledger";

export default function OperationsHub() {
    const [activeTab, setActiveTab] = useState("settlement");

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white italic uppercase">Operations Hub</h1>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Unified Command Center</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-100 font-black uppercase text-[9px] tracking-widest px-3 py-1">
                            System Healthy
                        </Badge>
                        <Button variant="outline" className="rounded-2xl border-2 font-bold gap-2">
                            <Settings size={16} /> Config
                        </Button>
                    </div>
                </motion.div>

                {/* Main Navigation Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-100 shadow-xl inline-flex h-auto w-full justify-start overflow-x-auto scrollbar-hide">
                        <TabsTrigger
                            value="settlement"
                            className="rounded-2xl px-8 py-4 gap-3 data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all font-black uppercase text-[10px] tracking-widest whitespace-nowrap"
                        >
                            <Wallet size={16} /> EOD Settlement
                        </TabsTrigger>
                        <TabsTrigger
                            value="tariff"
                            className="rounded-2xl px-8 py-4 gap-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all font-black uppercase text-[10px] tracking-widest whitespace-nowrap"
                        >
                            <ScrollText size={16} /> Tariff Master
                        </TabsTrigger>
                        <TabsTrigger
                            value="ledger"
                            className="rounded-2xl px-8 py-4 gap-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all font-black uppercase text-[10px] tracking-widest whitespace-nowrap"
                        >
                            <PieChart size={16} /> Specialist Ledger
                        </TabsTrigger>
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <TabsContent value="settlement" className="mt-0 outline-none">
                                <PanzeCard className="p-0 overflow-hidden border-none shadow-2xl">
                                    <SettlementPage />
                                </PanzeCard>
                            </TabsContent>

                            <TabsContent value="tariff" className="mt-0 outline-none">
                                <PanzeCard className="p-8 border-none shadow-2xl bg-white dark:bg-slate-900">
                                    <TariffPage />
                                </PanzeCard>
                            </TabsContent>


                            <TabsContent value="ledger" className="mt-0 outline-none">
                                <PanzeCard className="p-8 border-none shadow-2xl bg-white dark:bg-slate-900">
                                    <ConsultantLedgerPanel isAdmin={true} />
                                </PanzeCard>
                            </TabsContent>
                        </motion.div>
                    </AnimatePresence>
                </Tabs>
            </div>
        </div>
    );
}

function ModuleToggleCard({ title, description, icon, status }: { title: string, description: string, icon: React.ReactNode, status: string }) {
    return (
        <PanzeCard className="p-8 space-y-6 hover:shadow-2xl transition-all border-slate-100 group">
            <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-[1.5rem] bg-slate-50 flex items-center justify-center group-hover:bg-white transition-all shadow-inner">
                    {icon}
                </div>
                <Badge className={cn(
                    "font-black text-[8px] tracking-[0.2em] px-3",
                    status === "ACTIVE" ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                )}>
                    {status}
                </Badge>
            </div>
            <div className="space-y-2">
                <h4 className="text-xl font-black italic tracking-tighter uppercase">{title}</h4>
                <p className="text-xs font-medium text-slate-400 italic leading-relaxed">{description}</p>
            </div>
            <Button className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest hover:bg-black">
                {status === "ACTIVE" ? "Disable Module" : "Enable Module"}
            </Button>
        </PanzeCard>
    );
}
