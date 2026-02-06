'use client';

import React, { useState } from 'react';
import {
    ShieldCheck,
    Clock,
    FileText,
    Activity,
    Calendar,
    Heart,
    Download,
    ChevronRight,
    Search,
    BrainCircuit,
    Sparkles,
    UserCircle,
    Bell,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PatientVault() {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'records' | 'recovery'>('all');

    const timeline = [
        { date: 'Oct 20, 2026', title: 'Implant Placement', type: 'Surgery', icon: Activity, color: 'text-red-500', recovery: 'Day 4 of Post-Op' },
        { date: 'Oct 15, 2026', title: 'Surgical Consent Form', type: 'Document', icon: ShieldCheck, color: 'text-blue-500' },
        { date: 'Oct 12, 2026', title: 'Digital X-Ray (CBCT)', type: 'Radiology', icon: FileText, color: 'text-purple-500' },
        { date: 'Oct 08, 2026', title: 'Clinical Examination', type: 'Consult', icon: UserCircle, color: 'text-emerald-500' },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-8">
            <div className="max-w-5xl mx-auto space-y-10">
                {/* Vault Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">
                            <ShieldCheck size={14} /> End-to-End Encryption Active
                        </div>
                        <h1 className="text-4xl font-black tracking-tight italic">Noble Health Vault</h1>
                        <p className="text-slate-400 font-medium mt-2">Welcome back, Karthik. Your clinical timeline is fully synchronized.</p>
                    </div>

                    <div className="relative z-10 flex gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center relative">
                            <Bell className="text-blue-400" />
                            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></div>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                            <UserCircle className="text-white" size={32} />
                        </div>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
                </div>

                {/* Recovery Intelligence (Smart Check-ins) */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30 p-8 shadow-xl">
                    <div className="flex items-start justify-between gap-8 flex-col md:flex-row">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-emerald-500" />
                                <h3 className="font-black italic text-xl dark:text-white uppercase tracking-tighter">Smart Recovery Check-in</h3>
                            </div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                "Day 4 since your implant. How is the swelling on the left side? Typing 'Good' or 'Pain' helps our clinical AI monitor your progress."
                            </p>
                        </div>
                        <div className="flex gap-4 shrink-0">
                            <button className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
                                Feeling Great
                            </button>
                            <button className="px-8 py-3 bg-white dark:bg-white/10 text-slate-900 dark:text-white rounded-xl font-bold text-xs uppercase tracking-widest border border-slate-200 dark:border-white/10">
                                Report Pain
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Category Filter */}
                    <div className="lg:col-span-3 space-y-4">
                        {['all', 'records', 'recovery'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat as any)}
                                className={`w-full p-6 rounded-2xl text-left font-black uppercase tracking-widest text-[10px] transition-all border ${selectedCategory === cat
                                        ? 'bg-slate-900 text-white shadow-xl'
                                        : 'bg-white dark:bg-[#0a0f1d] text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-white/10'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Timeline Feed */}
                    <div className="lg:col-span-9 space-y-8">
                        <div className="relative pl-8 space-y-12 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-100 dark:before:bg-white/5">
                            {timeline.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                                >
                                    {/* Timeline Pin */}
                                    <div className={`absolute left-[-36px] w-4 h-4 rounded-full bg-white dark:bg-[#020617] border-4 border-slate-900 dark:border-white/10 z-10 group-hover:scale-125 transition-transform`}></div>

                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl bg-white dark:bg-[#0a0f1d] shadow-xl border border-slate-100 dark:border-white/5 ${item.color}`}>
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight italic">{item.title}</h4>
                                                {item.recovery && (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest">Active Monitoring</span>
                                                )}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                {item.date} • {item.type}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button className="flex items-center gap-2 p-3 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                            <Download size={18} />
                                        </button>
                                        <button className="p-3 hover:bg-slate-900 hover:text-white dark:hover:bg-blue-600 rounded-xl transition-all text-slate-200 border border-slate-100 dark:border-white/5 shadow-sm">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* More Data Indicator */}
                        <div className="p-10 text-center space-y-4 opacity-50">
                            <Clock className="mx-auto text-slate-300" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Viewing your lifetime health journey</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
