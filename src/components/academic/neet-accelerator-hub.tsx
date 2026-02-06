'use client';

import React, { useState } from 'react';
import {
    Zap,
    BookOpen,
    Target,
    Trophy,
    Timer,
    CheckCircle2,
    XCircle,
    ChevronRight,
    BarChart3,
    HelpCircle,
    Brain,
    Lock,
    Search,
    Video,
    FileQuestion,
    GraduationCap,
    Clock,
    Medal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NEETAcceleratorHub() {
    const [activeSection, setActiveSection] = useState<'SPRINT' | 'RESOURCES' | 'RANK'>('SPRINT');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const questions = [
        {
            q: "Which specific nerve is most at risk during a Grade III Furcation treatment in Mandibular 1st Molars?",
            options: ["Inferior Alveolar", "Lingual Nerve", "Mylohyoid", "Mental Nerve"],
            correct: 0,
            textbookRef: "Grossman's Endodontics, Page 242"
        },
        {
            q: "The 'Golden Proportion' in aesthetic dentistry suggests a ratio of ______ between the central and lateral incisors.",
            options: ["1:1.618", "1:1", "1.618:1", "0.618:1"],
            correct: 2,
            textbookRef: "Carranza's Clinical Periodontology, Page 582"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-8 font-sans selection:bg-indigo-500/30">
            <div className="max-w-[1400px] mx-auto space-y-10">

                {/* 1. ACADEMIC HEADER */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white dark:bg-[#0a0f1d] p-12 rounded-[4.5rem] border border-slate-200 dark:border-white/5 shadow-3xl relative overflow-hidden group">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3 text-rose-500 font-black text-[10px] uppercase tracking-[0.4em]">
                            <BookOpen size={16} className="animate-pulse" /> Noble Entrance Module
                        </div>
                        <h1 className="text-5xl font-black italic tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
                            Academic <br /> Accelerator
                        </h1>
                        <p className="text-sm font-medium text-slate-400 italic max-w-md">
                            Proprietary NEET-MDS training engine. Transforming your daily clinical recordings into high-yield exam preparation.
                        </p>
                    </div>

                    <div className="flex gap-6 relative z-10">
                        <div className="p-10 bg-rose-600 rounded-[3rem] text-white shadow-2xl shadow-rose-500/30 text-center flex flex-col items-center">
                            <Trophy size={32} className="mb-4" />
                            <div className="text-3xl font-black italic tracking-tighter">1,240</div>
                            <div className="text-[9px] font-black uppercase tracking-widest opacity-80">Noble Points</div>
                        </div>
                        <div className="p-10 bg-slate-900 rounded-[3rem] text-white border border-white/10 text-center flex flex-col items-center">
                            <Target size={32} className="mb-4 text-emerald-400" />
                            <div className="text-3xl font-black italic tracking-tighter">88%</div>
                            <div className="text-[9px] font-black uppercase tracking-widest opacity-80">Accuracy Rate</div>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                        <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-rose-500/5 blur-[120px] rounded-full"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* 2. SIDEBAR COMMANDS */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white dark:bg-[#0a0f1d] p-8 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl">
                            <h3 className="text-[10px] font-black italic uppercase tracking-[0.2em] mb-8 text-slate-400">Training Segments</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: Zap, label: 'Daily MCQ Sprint', id: 'SPRINT' },
                                    { icon: Brain, label: 'AI Flashcards', id: 'RESOURCES' },
                                    { icon: Medal, label: 'Global Ranking', id: 'RANK' },
                                    { icon: GraduationCap, label: 'Exam Simulator', id: 'SIM' },
                                ].map((seg) => (
                                    <button
                                        key={seg.id}
                                        onClick={() => setActiveSection(seg.id as any)}
                                        className={`w-full p-6 rounded-[2rem] border transition-all text-left flex items-center gap-5 group ${activeSection === seg.id
                                            ? 'bg-rose-600 border-rose-600 text-white shadow-2xl scale-[1.05]'
                                            : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-500 hover:border-rose-500/30'
                                            }`}
                                    >
                                        <seg.icon size={20} className={activeSection === seg.id ? 'text-white' : 'group-hover:text-rose-500'} />
                                        <span className="text-[10px] font-black uppercase tracking-tight">{seg.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* TEXTBOOK INDEX STATUS */}
                        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                            <h3 className="text-[10px] font-black italic uppercase tracking-[0.2em] mb-6 text-rose-500 flex items-center gap-2">
                                <Lock size={12} /> GraphRAG Engine V2
                            </h3>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span className="text-slate-400">INDEXED BOOKS</span>
                                    <span>24/50</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[48%] bg-rose-500"></div>
                                </div>
                                <p className="text-[9px] text-slate-500 italic mt-4 uppercase tracking-widest leading-relaxed">
                                    Questions are automatically synthesized from verified sources like **Carranza** & **Grossman**.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. MAIN TRAINING VIEWPORT */}
                    <div className="lg:col-span-9 bg-white dark:bg-[#0a0f1d] p-12 rounded-[4.5rem] border border-slate-200 dark:border-white/5 shadow-2xl min-h-[600px] flex flex-col">

                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-rose-600/10 rounded-2xl flex items-center justify-center text-rose-600"><Timer size={24} /></div>
                                <div>
                                    <h2 className="text-2xl font-black italic tracking-tighter uppercase dark:text-white">Daily 10-Sprint</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Difficulty: High-Yield</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Q: {currentQuestionIndex + 1} / {questions.length}</div>
                                <div className="h-8 w-px bg-slate-100 dark:bg-white/5"></div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">Streak: 12🔥</div>
                            </div>
                        </div>

                        {/* QUESTION INTERFACE */}
                        <div className="flex-1 space-y-12">
                            <div className="p-10 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-slate-100 dark:border-white/5 relative group">
                                <HelpCircle className="absolute top-8 right-8 text-rose-500/20" size={40} />
                                <p className="text-xl font-black italic tracking-tight text-slate-900 dark:text-white leading-[1.4] max-w-2xl">
                                    "{questions[currentQuestionIndex].q}"
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {questions[currentQuestionIndex].options.map((opt, i) => (
                                    <button
                                        key={i}
                                        className="p-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] text-left hover:border-rose-500 hover:bg-rose-500/5 transition-all group flex items-start gap-4"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{opt}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* NAVIGATION FOOER */}
                        <div className="mt-12 pt-10 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 group cursor-pointer hover:text-rose-500 transition-colors">
                                <BookOpen size={16} /> Source: {questions[currentQuestionIndex].textbookRef}
                            </div>
                            <div className="flex gap-4">
                                <button className="px-8 py-5 bg-slate-100 dark:bg-white/10 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:bg-slate-900 transition-all">
                                    Skip Question
                                </button>
                                <button
                                    onClick={() => setCurrentQuestionIndex((prev) => (prev + 1) % questions.length)}
                                    className="px-10 py-5 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-rose-500/30 hover:scale-105 transition-all flex items-center gap-3"
                                >
                                    Submit & Next <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. CLINICAL MENTORSHIP SIGN-OFF (Shadowing Log) */}
                <div className="bg-gradient-to-r from-blue-600/10 to-transparent p-12 rounded-[4.5rem] border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
                    <div className="relative z-10 flex items-center gap-10">
                        <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-3xl shadow-blue-500/40">
                            <CheckCircle2 className="text-white" size={40} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">Shadowing Sign-Off</h3>
                            <p className="text-[11px] font-medium text-slate-500 italic mt-1 leading-relaxed max-w-xl uppercase tracking-widest">
                                Senior verified signatures for clinical competency. <br />
                                <span className="text-blue-600 font-black">4 PENDING SIGN-OFFS FROM DR. SARAH (PROSTHODONTICS).</span>
                            </p>
                        </div>
                    </div>
                    <button className="relative z-10 px-10 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-500/40 hover:scale-110 transition-all">
                        Request OTP Verification
                    </button>
                    <Target className="absolute top-[-30px] right-20 opacity-[0.03] scale-[5] rotate-45" />
                </div>

            </div>
        </div>
    );
}

