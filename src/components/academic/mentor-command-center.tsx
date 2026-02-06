'use client';

import React, { useState } from 'react';
import {
    Users,
    BookOpen,
    FileText,
    Video,
    MessageSquare,
    DollarSign,
    Award,
    Plus,
    Send,
    Clock,
    CheckCircle2,
    TrendingUp,
    Calendar,
    Settings,
    MoreVertical,
    Share2,
    Zap,
    Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MentorCommandCenter() {
    const [activeTab, setActiveTab] = useState<'BATCHES' | 'EXAMS' | 'NOTES' | 'EARNINGS'>('BATCHES');

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-8 font-sans selection:bg-indigo-500/30">
            <div className="max-w-[1400px] mx-auto space-y-10">

                {/* 1. TUTOR PROFILE HEADER: THE EDUCATOR HUB */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white dark:bg-[#0a0f1d] p-12 rounded-[4.5rem] border border-slate-200 dark:border-white/5 shadow-3xl relative overflow-hidden group">
                    <div className="flex items-center gap-10 relative z-10">
                        <div className="relative">
                            <div className="w-32 h-32 bg-slate-900 rounded-[3rem] flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform">
                                <Users size={48} className="text-slate-400" />
                                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent"></div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-2xl border-2 border-white dark:border-slate-800 shadow-xl">
                                <Award size={16} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
                                    Dr. Ramya MDS
                                </h1>
                                <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/30">
                                    Elite Tutor
                                </span>
                            </div>
                            <div className="flex items-center gap-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">
                                <span>Periodontology Specialist</span>
                                <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                                <span>Verified Hub Author</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 relative z-10">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Net Revenue</div>
                        <div className="text-5xl font-black italic tracking-tighter text-emerald-600 leading-none">$14,240.00</div>
                        <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors">
                            Withdraw to Clinic Wallet <TrendingUp size={12} />
                        </button>
                    </div>

                    <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                        <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full"></div>
                    </div>
                </div>

                {/* 2. TABBED NAVIGATION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white dark:bg-[#0a0f1d] p-8 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl">
                            <h3 className="text-[10px] font-black italic uppercase tracking-[0.2em] mb-8 text-slate-400">Teaching Toolkit</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: Users, label: 'Manage Batches', id: 'BATCHES' },
                                    { icon: FileText, label: 'Conduct Exams', id: 'EXAMS' },
                                    { icon: BookOpen, label: 'Daily Notes feed', id: 'NOTES' },
                                    { icon: DollarSign, label: 'Profit/Loss', id: 'EARNINGS' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`w-full p-6 rounded-[2.5rem] border transition-all text-left flex items-center gap-5 group ${activeTab === tab.id
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl scale-[1.05]'
                                                : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-500 hover:border-indigo-500/30'
                                            }`}
                                    >
                                        <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'group-hover:text-indigo-500'} />
                                        <span className="text-[10px] font-black uppercase tracking-tight">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <Zap className="mb-4 text-amber-500 animate-pulse" size={24} />
                                <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Cohort Pulse</h3>
                                <p className="text-[10px] font-medium opacity-80 leading-relaxed uppercase tracking-widest italic">
                                    428 Total active students across 4 Intensive Batches.
                                </p>
                            </div>
                            <TrendingUp className="absolute bottom-[-20px] left-[-20px] opacity-10 scale-[4] rotate-12" />
                        </div>
                    </div>

                    {/* 3. MAIN WORKSPACE */}
                    <div className="lg:col-span-9 bg-white dark:bg-[#0a0f1d] p-12 rounded-[4.5rem] border border-slate-200 dark:border-white/5 shadow-2xl relative">

                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase dark:text-white flex items-center gap-4">
                                {activeTab === 'BATCHES' && <Users className="text-indigo-600" />}
                                {activeTab === 'EXAMS' && <FileText className="text-rose-600" />}
                                {activeTab === 'NOTES' && <BookOpen className="text-emerald-600" />}
                                {activeTab === 'EARNINGS' && <DollarSign className="text-amber-600" />}
                                {activeTab} MANAGER
                            </h2>
                            <button className="px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-[9px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all">
                                <Plus size={14} /> Create {activeTab.slice(0, -1)}
                            </button>
                        </div>

                        {/* RENDER CONTENT BASED ON TAB */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                {activeTab === 'BATCHES' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {[
                                            { name: 'NEET-MDS PERIO 2026', type: 'Intensive', students: 142, price: 49, revenue: 6958 },
                                            { name: 'CLINICAL FLAP BOOTCAMP', type: 'Hands-on Sync', students: 48, price: 99, revenue: 4752 },
                                        ].map((batch, i) => (
                                            <div key={i} className="p-8 bg-slate-50 dark:bg-white/5 rounded-[3.5rem] border border-slate-100 dark:border-white/5 relative group hover:border-indigo-500/30 transition-all">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-2">{batch.type}</div>
                                                        <h4 className="text-xl font-black italic tracking-tighter dark:text-white uppercase">{batch.name}</h4>
                                                    </div>
                                                    <div className="bg-white dark:bg-white/10 p-3 rounded-2xl border border-slate-100 dark:border-white/10">
                                                        <Users size={16} className="text-slate-400" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/5">
                                                    <div>
                                                        <div className="text-2xl font-black italic text-slate-900 dark:text-white">${batch.revenue}</div>
                                                        <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Total Revenue</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-black italic text-slate-900 dark:text-white">{batch.students}</div>
                                                        <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Students Joined</div>
                                                    </div>
                                                </div>
                                                <div className="mt-8 flex gap-3">
                                                    <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest">Enter Classroom</button>
                                                    <button className="p-4 bg-white dark:bg-white/10 text-slate-400 rounded-2xl hover:text-indigo-600 transition-colors"><Settings size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'NOTES' && (
                                    <div className="space-y-6">
                                        <div className="p-10 bg-indigo-600/5 border border-indigo-600/20 rounded-[3rem] mb-10 flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white"><Send size={24} /></div>
                                                <div>
                                                    <h3 className="text-xl font-black italic tracking-tighter uppercase dark:text-white">Broadcast Daily Note</h3>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Sends to 428 active subscribers instantly</p>
                                                </div>
                                            </div>
                                            <button className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[9px] uppercase tracking-widest shadow-xl">New Broadcast</button>
                                        </div>

                                        {[
                                            { title: 'Anatomy of the Gingival Sulcus', sent: '2h ago', opens: '82%', hearts: 124 },
                                            { title: 'Grossman Chapter 4 Quick Summary', sent: 'Yesterday', opens: '94%', hearts: 312 },
                                        ].map((note, i) => (
                                            <div key={i} className="p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5 flex items-center justify-between group">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-slate-400"><FileText size={18} /></div>
                                                    <div>
                                                        <div className="text-xs font-black italic tracking-tighter dark:text-white uppercase">{note.title}</div>
                                                        <div className="text-[9px] text-slate-400 font-medium uppercase tracking-widest mt-1">Sent {note.sent} · {note.opens} Open Rate</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-center">
                                                        <div className="text-sm font-black italic text-indigo-600">{note.hearts}</div>
                                                        <div className="text-[8px] font-black text-slate-400 uppercase">HEARTS</div>
                                                    </div>
                                                    <button className="p-4 bg-slate-50 dark:bg-white/10 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all"><Share2 size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* 4. FINANCIAL TELEMETRY */}
                <div className="bg-gradient-to-r from-emerald-600/10 to-transparent p-12 rounded-[4.5rem] border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-10">
                        <div className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-3xl shadow-emerald-500/40">
                            <DollarSign className="text-white" size={40} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">Escrow Settlement</h3>
                            <p className="text-xs font-medium text-slate-500 italic mt-1 leading-relaxed max-w-xl">
                                "Student payments are escrowed for **48 hours post-broadcast** to ensure content satisfaction. <br />
                                Next settlement: Feb 8, 2026. <span className="text-emerald-600 font-bold">$4,210.00 PENDING.</span>"
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

