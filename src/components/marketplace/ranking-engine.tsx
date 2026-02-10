'use client';

import React, { useState } from 'react';
import {
    Trophy,
    Star,
    TrendingUp,
    Zap,
    ShieldCheck,
    Clock,
    MapPin,
    Search,
    Filter,
    ArrowUpRight,
    MousePointer2,
    CalendarCheck2,
    BarChart3,
    Medal
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ClinicRanking {
    id: string;
    name: string;
    atr: number; // Appointment-Through-Rate (%)
    avgWait: number; // Avg wait time (mins)
    rating: number;
    impressions: number;
    status: 'High Authority' | 'Rising Star' | 'Frictionless';
    badges: string[];
}

const RANKINGS: ClinicRanking[] = [
    { id: '1', name: "Noble Dental Care (Main)", atr: 92, avgWait: 8, rating: 4.9, impressions: 4200, status: 'High Authority', badges: ['Priority Clinic', 'Zero Wait'] },
    { id: '2', name: "Noble Smile Studio", atr: 78, avgWait: 22, rating: 4.7, impressions: 2100, status: 'Rising Star', badges: ['Specialist Hub'] },
    { id: '3', name: "Advanced Aesthetics", atr: 88, avgWait: 12, rating: 4.8, impressions: 3400, status: 'Frictionless', badges: ['AEO Optimized'] },
];

export default function RankingEngine() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-8">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-[3rem] p-10 border border-amber-100 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-[0.2em] mb-4">
                            <Trophy size={14} className="animate-bounce" /> Marketplace Intelligence
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">Gold Ranking Engine</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Powering discovery through real-world clinical performance metrics.</p>
                    </div>

                    <div className="relative z-10 bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-amber-200/50 shadow-lg">
                        <div className="flex items-center gap-4">
                            <BarChart3 className="text-amber-500" />
                            <div>
                                <div className="text-2xl font-black text-slate-900">ATR-Aware</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Ranking Logic</div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute right-[-40px] top-[-40px] opacity-[0.05] text-amber-900">
                        <Medal size={240} className="rotate-[15deg]" />
                    </div>
                </div>

                {/* Ranking Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Metrics Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                            <h3 className="font-black uppercase tracking-tighter text-xl mb-6 dark:text-white">Ranking Core</h3>
                            <div className="space-y-6">
                                {[
                                    { label: 'Conversion (ATR)', value: '88%', desc: 'Search to Booking ratio', icon: MousePointer2, color: 'text-blue-500' },
                                    { label: 'Wait Index', value: 'Low', desc: 'Avg wait < 15 mins', icon: Clock, color: 'text-emerald-500' },
                                    { label: 'Review Integrity', value: 'High', desc: 'Verified social proof', icon: ShieldCheck, color: 'text-purple-500' },
                                ].map((stat, i) => (
                                    <div key={i} className="flex gap-4 group/item">
                                        <div className={`p-3 rounded-xl bg-slate-50 ${stat.color} shrink-0 group-hover/item:scale-110 transition-transform`}>
                                            <stat.icon size={20} />
                                        </div>
                                        <div>
                                            <div className="text-lg font-black dark:text-white">{stat.value}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                            <p className="text-[9px] text-slate-500 mt-1">{stat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-4 relative z-10">Gold Priority</h3>
                            <p className="text-xs font-medium text-amber-100 relative z-10 leading-relaxed">
                                "Clinics with ATR &gt; 85% are automatically granted the 'Priority Clinic' badge, boosting visibility by 2.4x."
                            </p>
                            <button className="mt-8 px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all relative z-10">
                                View Algorithm
                            </button>
                            <Trophy className="absolute bottom-[-20px] right-[-20px] opacity-10 group-hover:scale-110 transition-transform" size={120} />
                        </div>
                    </div>

                    {/* Rankings Leaderboard */}
                    <div className="lg:col-span-2 space-y-6">
                        {RANKINGS.map((clinic, idx) => (
                            <motion.div
                                key={clinic.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-amber-400 transition-all hover:shadow-2xl duration-500"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-2xl text-slate-300 group-hover:text-amber-500 transition-colors">
                                        #{idx + 1}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-xl font-black text-slate-900 dark:text-white">{clinic.name}</h4>
                                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-[8px] font-black uppercase tracking-widest">{clinic.status}</span>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            {clinic.badges.map(b => (
                                                <span key={b} className="p-1 px-3 bg-amber-50 dark:bg-amber-900/10 text-amber-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-amber-100 dark:border-amber-900/20">
                                                    {b}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12 text-right">
                                    <div>
                                        <div className="text-2xl font-black text-slate-900 dark:text-white">{clinic.atr}%</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ATR Score</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-slate-900 dark:text-white">{clinic.rating}★</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sentiment</div>
                                    </div>
                                    <button className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all">
                                        <ArrowUpRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        <div className="p-10 text-center opacity-30">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em]">Ranking refreshed every 24 hours based on real-time fulfillment data</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
