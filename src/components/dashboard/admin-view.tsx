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

import { OperationsSummaryGlass } from "./operations-summary-glass";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
};

interface AdminDashboardViewProps {
    activeFilter?: string;
}

export function AdminDashboardView({ activeFilter = "This Month" }: AdminDashboardViewProps) {
    return (
        <div className="space-y-12 min-h-[800px] pb-32 px-4 lg:px-0 bg-slate-50/10">
            {/* 1. Soft Glass Operations Summary */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.12 } }
                }}
            >
                <OperationsSummaryGlass activeFilter={activeFilter} />
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
