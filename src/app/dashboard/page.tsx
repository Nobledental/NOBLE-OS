"use client";

import { Button } from "@/components/ui/button";
import { Activity, Users, ArrowUpRight, TrendingUp, Calendar, CreditCard } from "lucide-react";
import { ActiveQueue } from "@/components/dashboard/active-queue";
import { PermissionGuard } from "@/components/security/permission-guard";
import { ChiefPulse } from "@/components/dashboard/chief-pulse";
import { GlassCard } from "@/components/ui/glass-card";
import { SmartGauge } from "@/components/ui/smart-gauge";
import { NEOOrb } from "@/components/shared/neo-orb";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    return (
        <div className="flex-1 space-y-8 animate-ios-reveal relative">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight text-ios-gradient">Command Center</h2>
                    <p className="text-muted-foreground">Welcome back, Dr. Dhivakaran. Here is your practice pulse.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <NEOOrb status="thinking" className="mr-2 scale-110" />
                    <Button variant="outline" className="rounded-full px-6 glass">Audit Logs</Button>
                    <Button className="rounded-full px-6 bg-slate-900 text-white hover:bg-slate-800 shadow-lg transition-transform active:scale-95">
                        Start Duty
                    </Button>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid gap-6 md:grid-cols-12 lg:grid-cols-12">

                {/* Main: Revenue & Trends (Zone 1) */}
                <PermissionGuard permission="can_view_revenue" fallback={
                    <GlassCard className="md:col-span-8 h-[400px] flex items-center justify-center border-dashed border-2">
                        <p className="text-muted-foreground italic">Financial intelligence restricted</p>
                    </GlassCard>
                }>
                    <GlassCard className="md:col-span-8 p-8 relative group overflow-hidden" gradient>
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Revenue Flow</span>
                                </div>
                                <h3 className="text-5xl font-black tracking-tighter">₹45,231.89</h3>
                                <div className="flex items-center gap-2 mt-2 text-emerald-600 font-bold">
                                    <ArrowUpRight className="w-4 h-4" />
                                    <span>+24.8%</span>
                                    <span className="text-muted-foreground font-normal text-sm">vs last week</span>
                                </div>
                            </div>

                            <div className="mt-8 flex items-end gap-3 h-32">
                                {[40, 65, 45, 90, 55, 80, 45, 100, 70, 85, 60, 95].map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-slate-900 dark:bg-slate-100 rounded-full transition-all duration-500 hover:bg-emerald-500 cursor-pointer"
                                        style={{ height: `${h}%`, transitionDelay: `${i * 30}ms` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                </PermissionGuard>

                {/* Side: Active Queue (Zone 2) */}
                <div className="md:col-span-4 space-y-6">
                    <ActiveQueue />
                </div>

                {/* Sub: Clinical Performance (Zone 3) */}
                <GlassCard className="md:col-span-3 p-6 flex flex-col items-center justify-center gap-4">
                    <SmartGauge
                        value={84}
                        label="84%"
                        subLabel="Hygiene Index"
                        color="#00BFA5"
                    />
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">Clinical Precision</p>
                        <h4 className="font-bold">Excellent</h4>
                    </div>
                </GlassCard>

                <GlassCard className="md:col-span-3 p-6 flex flex-col items-center justify-center gap-4">
                    <SmartGauge
                        value={92}
                        label="92%"
                        subLabel="Patient Trust"
                        color="#6366f1"
                    />
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">Feedback Loop</p>
                        <h4 className="font-bold">Elite Tier</h4>
                    </div>
                </GlassCard>

                {/* Wide: Chief's Pulse / Leaderboard (Zone 4) */}
                <div className="md:col-span-6">
                    <PermissionGuard permission="can_manage_staff">
                        <ChiefPulse />
                    </PermissionGuard>
                </div>

                {/* Bottom Row Mini Tiles */}
                <GlassCard className="md:col-span-4 p-6 flex items-center gap-6 group cursor-pointer hover:bg-white/60 transition-colors">
                    <div className="w-14 h-14 rounded-3xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Calendar className="w-7 h-7 text-amber-600" />
                    </div>
                    <div>
                        <h4 className="font-bold">Appointments</h4>
                        <p className="text-sm text-muted-foreground">18 slots booked today</p>
                    </div>
                </GlassCard>

                <GlassCard className="md:col-span-4 p-6 flex items-center gap-6 group cursor-pointer hover:bg-white/60 transition-colors">
                    <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="font-bold">New Patients</h4>
                        <p className="text-sm text-muted-foreground">12 successful check-ins</p>
                    </div>
                </GlassCard>

                <GlassCard className="md:col-span-4 p-6 flex items-center gap-6 group cursor-pointer hover:bg-white/60 transition-colors">
                    <div className="w-14 h-14 rounded-3xl bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CreditCard className="w-7 h-7 text-rose-600" />
                    </div>
                    <div>
                        <h4 className="font-bold">Quick Invoice</h4>
                        <p className="text-sm text-muted-foreground">Generate direct bill</p>
                    </div>
                </GlassCard>

            </div>
        </div>
    );
}
