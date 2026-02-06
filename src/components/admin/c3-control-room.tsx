'use client';

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Zap,
    Activity,
    ShieldCheck,
    Trophy,
    Package,
    Users,
    Timer,
    AlertTriangle,
    ArrowUpRight,
    Search,
    ChevronRight,
    CircleDot,
    Command,
    Globe,
    Cpu,
    Boxes,
    BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for C3 Unified Intelligence
type ModuleStatus = 'OPTIMAL' | 'WARNING' | 'CRITICAL';

interface C3Lead {
    id: string;
    name: string;
    stage: 'WAITING' | 'CONSULT' | 'SURGERY' | 'RECOVERY';
    waitTime: number;
    risk: 'LOW' | 'MED' | 'HIGH';
}

export default function C3ControlRoom() {
    const [activeSection, setActiveSection] = useState<'logistics' | 'clinical' | 'performance'>('logistics');

    // Simulated C3 Fusion State
    const [intelligence, setIntelligence] = useState({
        throughput: 94,
        aeoScore: 88,
        atr: 92,
        stockHealth: 72,
        anomalies: 2
    });

    const leads: C3Lead[] = [
        { id: '1', name: "Anand S.", stage: 'WAITING', waitTime: 42, risk: 'HIGH' },
        { id: '2', name: "Priya V.", stage: 'CONSULT', waitTime: 12, risk: 'LOW' },
        { id: '3', name: "Rahul K.", stage: 'SURGERY', waitTime: 5, risk: 'MED' },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-white p-6 font-sans selection:bg-blue-500/30">
            <div className="max-w-[1600px] mx-auto space-y-8">

                {/* 1. TOP COMMAND BAR: The "Brain" Health */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 bg-white dark:bg-[#0a0f1d] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                                <Cpu size={14} className="animate-pulse" /> Neural Core Active
                            </div>
                            <h1 className="text-3xl font-black italic tracking-tighter">C3 Control Room</h1>
                            <p className="text-xs font-medium text-slate-400 mt-1 italic">Fusing Logistics, Clinical, and Brand Intelligence.</p>
                        </div>
                        <div className="relative z-10 text-right">
                            <div className="text-4xl font-black italic tracking-tighter text-blue-600 dark:text-blue-400">98.2%</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Sync</div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                    </div>

                    {[
                        { label: 'Patient App (Flutter)', status: 'Connected', icon: Globe, color: 'text-emerald-500' },
                        { label: 'Body (Next.js)', status: 'Active', icon: LayoutDashboard, color: 'text-blue-500' },
                    ].map((app, i) => (
                        <div key={i} className="bg-white dark:bg-[#0a0f1d] p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-xl flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-slate-50 dark:bg-white/5 ${app.color}`}>
                                <app.icon size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-black italic">{app.label}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{app.status}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. MAIN FUSION GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT: Live Logistics Layer (Swiggy Logic) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-[#0a0f1d] p-8 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl relative">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Zap className="text-amber-500" size={20} />
                                    <h2 className="text-lg font-black italic uppercase tracking-tighter">Lead Command</h2>
                                </div>
                                <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-600 rounded-lg text-[10px] font-black uppercase">Live Flow</div>
                            </div>

                            <div className="space-y-4">
                                {leads.map((lead) => (
                                    <motion.div
                                        key={lead.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-blue-400 transition-all cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-black italic text-sm group-hover:text-blue-500 transition-colors">{lead.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{lead.stage}</div>
                                            </div>
                                            <div className={`text-[10px] font-black ${lead.waitTime > 30 ? 'text-red-500' : 'text-slate-500'}`}>
                                                {lead.waitTime}m
                                            </div>
                                        </div>
                                        {lead.risk === 'HIGH' && (
                                            <div className="mt-3 py-2 px-3 bg-red-500/10 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <AlertTriangle size={12} /> Bottleneck: Surgical Readiness Pending
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            <button className="w-full mt-8 py-4 bg-slate-900 dark:bg-white/10 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all">
                                Orchestrate Queue
                            </button>
                        </div>

                        {/* PREDICTIVE INSIGHT: The "Moat" */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden relative group">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4 relative z-10">C3 Predictive</h3>
                            <div className="space-y-4 relative z-10">
                                <p className="text-xs font-medium text-slate-400 italic leading-relaxed">
                                    "Stock for 'Implant Case #44' is CRITICAL. Recommend rescheduling 11:30 AM slot to avoid clinician downtime."
                                </p>
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="text-2xl font-black text-amber-500 italic">Restock Hub</div>
                                    <ArrowUpRight className="text-slate-500" />
                                </div>
                            </div>
                            <Boxes className="absolute bottom-[-30px] right-[-30px] opacity-10 scale-150 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-1000" size={180} />
                        </div>
                    </div>

                    {/* CENTER: Clinical Depth (Practo/Eka Logic) */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white dark:bg-[#0a0f1d] p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl h-full flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Surgical Lifecycle</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Clinical Orchestration</p>
                                </div>
                                <Activity className="text-red-500 animate-pulse" />
                            </div>

                            <div className="grid grid-cols-2 gap-6 flex-1">
                                {[
                                    { label: 'Surgical Readiness', value: '88%', icon: ShieldCheck, color: 'emerald' },
                                    { label: 'Patient Retention', value: '94%', icon: Heart, color: 'pink' },
                                    { label: 'Recovery Health', value: 'High', icon: Zap, color: 'blue' },
                                    { label: 'EMR Fact Density', value: '92%', icon: BarChart3, color: 'purple' },
                                ].map((clinical, i) => (
                                    <div key={i} className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 hover:scale-105 transition-all">
                                        <clinical.icon className={`text-${clinical.color}-500 mb-3`} size={24} />
                                        <div className="text-2xl font-black italic tracking-tighter">{clinical.value}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{clinical.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 p-6 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[2rem] flex flex-col justify-center gap-4 text-center">
                                <div className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">Live Case Tracking</div>
                                <div className="flex justify-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-500">
                                        <Timer size={20} />
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-300">
                                        <Search size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Performance Layer (Zomato/Ranking Logic) */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10 flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black italic uppercase tracking-tighter">Ranking Intelligence</h3>
                                <Trophy className="text-amber-400" />
                            </div>

                            <div className="space-y-8 relative z-10">
                                <div>
                                    <div className="text-5xl font-black italic tracking-tighter">92 <span className="text-xl">ATR</span></div>
                                    <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Appointment Throughput</div>
                                </div>
                                <div className="pt-6 border-t border-white/10 space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-blue-100">
                                        <span>Conversion Goal</span>
                                        <span>95%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: intelligence.atr + '%' }} className="h-full bg-amber-400"></motion.div>
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                                    Boost Discovery
                                </button>
                            </div>
                            <Command className="absolute top-[-20px] right-[-20px] opacity-10 scale-150 rotate-[20deg]" size={150} />
                        </div>

                        <div className="bg-white dark:bg-[#0a0f1d] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl">
                            <h4 className="font-black italic text-lg uppercase tracking-tighter mb-6 dark:text-white">Insta-Stock Hub</h4>
                            <div className="space-y-6">
                                {[
                                    { item: 'Alginate', stock: 12, status: 'CRITICAL', color: 'text-red-500' },
                                    { item: 'Anesthesia', stock: 85, status: 'OPTIMAL', color: 'text-emerald-500' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Package className="text-slate-300" size={16} />
                                            <div>
                                                <div className="text-sm font-black italic dark:text-white">{item.item}</div>
                                                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.stock} Units</div>
                                            </div>
                                        </div>
                                        <div className={`text-[8px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* 3. ECOSYSTEM FOOTER: Cross-App Connectivity */}
                <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-white dark:bg-[#0a0f1d] rounded-2xl shadow-lg border border-slate-100 dark:border-white/5">
                            <Activity className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter dark:text-white">Unified Telemetry</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Syncing Pulse across Next.js, Flutter & Brain API</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <span className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-blue-500/10 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-blue-500/20 shadow-sm">
                            <CircleDot size={12} fill="currentColor" className="animate-pulse" /> Brain API: Latency 14ms
                        </span>
                        <span className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-emerald-500/10 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-emerald-500/20 shadow-sm">
                            <Users size={12} fill="currentColor" /> Patient Sync: 420 Live
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components as icons/helpers
function Heart({ className, size }: { className?: string, size?: number }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>;
}
