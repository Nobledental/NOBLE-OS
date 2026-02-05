"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, Users, ArrowUpRight, TrendingUp, Calendar, CreditCard, LayoutGrid, Armchair, Stethoscope } from "lucide-react";
import { ActiveQueue } from "@/components/dashboard/active-queue";
import { PermissionGuard } from "@/components/security/permission-guard";
import { ChiefPulse } from "@/components/dashboard/chief-pulse";
import { GlassCard } from "@/components/ui/glass-card";
import { SmartGauge } from "@/components/ui/smart-gauge";
import { NEOOrb } from "@/components/shared/neo-orb";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { PatientHUD } from "@/components/clinical/patient-hud";
import { DentalMap } from "@/components/clinical/dental-map";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardPage() {
    const [viewMode, setViewMode] = useState<'morning' | 'active_chair'>('morning');

    return (
        <div className="flex-1 space-y-6 animate-ios-reveal relative min-h-screen pb-20">
            {/* Header / Command Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight text-ios-gradient">
                        {viewMode === 'morning' ? 'Command Center' : 'Active Chair Mode'}
                    </h2>
                    <p className="text-muted-foreground">
                        {viewMode === 'morning'
                            ? 'Good Morning, Dr. Dhivakaran. Performance looks optimal.'
                            : 'Patient in Chair: John Doe (ID: #PT-8832)'}
                    </p>
                </div>

                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20">
                    <Button
                        variant={viewMode === 'morning' ? 'secondary' : 'ghost'}
                        onClick={() => setViewMode('morning')}
                        className="rounded-full px-4 gap-2 transition-all"
                    >
                        <LayoutGrid className="w-4 h-4" />
                        <span className="hidden md:inline">Morning View</span>
                    </Button>
                    <Button
                        variant={viewMode === 'active_chair' ? 'secondary' : 'ghost'}
                        onClick={() => setViewMode('active_chair')}
                        className="rounded-full px-4 gap-2 transition-all"
                    >
                        <Armchair className="w-4 h-4" />
                        <span className="hidden md:inline">Active Chair</span>
                    </Button>
                    <div className="w-px h-6 bg-white/20 mx-1" />
                    <NEOOrb status={viewMode === 'active_chair' ? 'listening' : 'thinking'} className="scale-75" />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'morning' ? (
                    <motion.div
                        key="morning"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Trinity Glass-Bento Grid */}
                        <BentoGrid className="max-w-full">

                            {/* 1. Revenue Block (Large) */}
                            <div className="md:col-span-2 md:row-span-2">
                                <PermissionGuard permission="can_view_revenue" fallback={
                                    <GlassCard className="h-full flex items-center justify-center border-dashed border-2">
                                        <p className="text-muted-foreground italic">Financial intelligence restricted</p>
                                    </GlassCard>
                                }>
                                    <GlassCard className="h-full p-8 relative group overflow-hidden flex flex-col justify-between" gradient>
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <TrendingUp className="w-64 h-64 -mr-12 -mt-12" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-100 px-2 py-1 rounded-md">Real-time Revenue</span>
                                            </div>
                                            <h3 className="text-6xl font-black tracking-tighter text-slate-800 dark:text-white mt-4">₹45,231<span className="text-3xl text-muted-foreground font-medium">.89</span></h3>
                                            <div className="flex items-center gap-2 mt-4 text-emerald-600 font-bold bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                                                <ArrowUpRight className="w-4 h-4" />
                                                <span>+24.8%</span>
                                                <span className="text-muted-foreground font-normal text-sm">vs last week</span>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex items-end gap-2 h-32 w-full">
                                            {[40, 65, 45, 90, 55, 80, 45, 100, 70, 85, 60, 95, 75, 50, 80].map((h, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 bg-slate-900/10 dark:bg-slate-100/20 rounded-t-sm hover:bg-emerald-500 transition-all duration-300 cursor-pointer group-hover:h-[var(--h)]"
                                                    style={{ height: `${h}%` } as any}
                                                />
                                            ))}
                                        </div>
                                    </GlassCard>
                                </PermissionGuard>
                            </div>

                            {/* 2. Active Queue (Side) */}
                            <div className="md:col-span-1 md:row-span-2">
                                <GlassCard className="h-full p-0 overflow-hidden flex flex-col">
                                    <div className="p-6 border-b border-white/10 bg-white/40 backdrop-blur-md">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Users className="w-4 h-4 text-blue-500" />
                                            Active Queue
                                        </h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4">
                                        <ActiveQueue />
                                    </div>
                                </GlassCard>
                            </div>

                            {/* 3. Clinical Perf (Small) */}
                            <BentoGridItem
                                title="Clinical Precision"
                                description="Based on 45 procedures"
                                header={<SmartGauge value={98} label="98%" color="#10b981" />}
                                icon={<Activity className="h-4 w-4 text-neutral-500" />}
                                className="md:col-span-1"
                            />

                            {/* 4. Patient Trust (Small) */}
                            <BentoGridItem
                                title="Patient Trust Score"
                                description="Elite Tier (Top 1%)"
                                header={<SmartGauge value={92} label="9.2" subLabel="/10" color="#6366f1" />}
                                icon={<Users className="h-4 w-4 text-neutral-500" />}
                                className="md:col-span-1"
                            />

                            {/* 5. Quick Actions (Small) */}
                            <BentoGridItem
                                title="Quick Invoice"
                                description="Create bill for walk-in"
                                header={
                                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-100/20 items-center justify-center">
                                        <CreditCard className="w-10 h-10 text-rose-500" />
                                    </div>
                                }
                                icon={<CreditCard className="h-4 w-4 text-neutral-500" />}
                                className="md:col-span-1 cursor-pointer hover:border-rose-500/30"
                            />

                        </BentoGrid>

                        {/* Leaderboard (Bottom) */}
                        <div className="mt-6">
                            <PermissionGuard permission="can_manage_staff">
                                <ChiefPulse />
                            </PermissionGuard>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="active_chair"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col h-[calc(100vh-12rem)] space-y-4"
                    >
                        {/* Contextual HUD */}
                        <PatientHUD
                            patientName="John Doe"
                            patientId="#PT-8832"
                            vitals={{ bp: "142/90", hr: 88, spo2: 98, temp: 98.6 }}
                            risks={["High BP Alert", "Penicillin Allergy"]}
                        />

                        <div className="flex-1 h-full min-h-[500px]">
                            <DentalMap />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
