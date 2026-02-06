'use client';

import React, { useState } from 'react';
import {
    Briefcase,
    Search,
    MapPin,
    Filter,
    UserCheck,
    TrendingUp,
    Award,
    ArrowRightCircle,
    Clock,
    ShieldCheck,
    Star,
    Zap,
    Users,
    ChevronDown,
    Building2,
    TicketPercent
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecruitmentCommandCenter() {
    const [viewMode, setViewMode] = useState<'DISCOVER' | 'MY_POSTS' | 'VOUCHERS'>('DISCOVER');
    const [searchRadius, setSearchRadius] = useState(15);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-8 font-sans selection:bg-indigo-500/30">
            <div className="max-w-[1400px] mx-auto space-y-10">

                {/* 1. RECRUITMENT HUB HEADER */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white dark:bg-[#0a0f1d] p-12 rounded-[4.5rem] border border-slate-200 dark:border-white/5 shadow-3xl relative overflow-hidden group">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3 text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em]">
                            <Building2 size={16} className="animate-spin-slow" /> HFLO Recruitment Hub
                        </div>
                        <h1 className="text-5xl font-black italic tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
                            Smart Clinical <br /> Talent Sourcing
                        </h1>
                        <p className="text-sm font-medium text-slate-400 italic max-w-md">
                            Locate verified dentists and students based on real-world clinical scores, not just resumes.
                        </p>
                    </div>

                    <div className="flex gap-6 relative z-10">
                        <div className="p-10 bg-indigo-600 rounded-[3rem] text-white shadow-2xl shadow-indigo-500/30 text-center flex flex-col items-center">
                            <Users size={32} className="mb-4" />
                            <div className="text-3xl font-black italic tracking-tighter">142</div>
                            <div className="text-[9px] font-black uppercase tracking-widest opacity-80">Active Candidates</div>
                        </div>
                        <div className="p-10 bg-slate-900 rounded-[3rem] text-white border border-white/10 text-center flex flex-col items-center">
                            <TicketPercent size={32} className="mb-4 text-amber-400" />
                            <div className="text-3xl font-black italic tracking-tighter">03</div>
                            <div className="text-[9px] font-black uppercase tracking-widest opacity-80">Hiring Vouchers</div>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                        <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full"></div>
                    </div>
                </div>

                {/* 2. SEARCH & FILTER DASHBOARD */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    <div className="lg:col-span-12">
                        <div className="bg-white dark:bg-[#0a0f1d] p-8 rounded-[3.5rem] border border-slate-200 dark:border-white/5 shadow-2xl flex flex-wrap items-center justify-between gap-8">
                            <div className="flex-1 min-w-[300px] relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="SEARCH BY SKILL (E.G. MOLAR ENDO, FLAP DESIGN...)"
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-slate-400" size={18} />
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Radius: <span className="text-indigo-600">{searchRadius} KM</span></div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={searchRadius}
                                        onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                                        className="w-32 accent-indigo-600"
                                    />
                                </div>
                                <div className="h-10 w-px bg-slate-100 dark:bg-white/10 mx-2"></div>
                                <button className="px-8 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all">
                                    <Filter size={14} /> Advanced Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 3. CANDIDATE FEED */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between px-6">
                            <h3 className="text-xl font-black italic tracking-tighter uppercase dark:text-white flex items-center gap-3">
                                <UserCheck className="text-indigo-600" /> Top-Scoring Candidates
                            </h3>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-indigo-600 transition-all">SORT BY: REAL-WORLD SCORE <ChevronDown size={12} className="inline ml-1" /></div>
                        </div>

                        <div className="space-y-6">
                            {[
                                { name: 'Dr. Sarah K.', role: 'General Dentist', exp: '2 YRS', skill: 92, efficiency: 88, status: 'Looking for Work', distance: '4.2 KM', tags: ['Endo Expert', 'High Precision'] },
                                { name: 'BDS Student #441', role: 'Intern (BDS)', exp: 'N/A', skill: 85, efficiency: 94, status: 'Part-time Shadowing', distance: '1.8 KM', tags: ['Academic Top 1%', 'Prosthetics'] },
                                { name: 'Dr. Rahul V.', role: 'Oral Surgeon', exp: '5 YRS', skill: 96, efficiency: 91, status: 'Full-time', distance: '12 KM', tags: ['Implant Specialist'] },
                            ].map((candidate, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="p-10 bg-white dark:bg-[#0a0f1d] rounded-[3.5rem] border border-slate-200 dark:border-white/5 shadow-xl relative overflow-hidden group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                                        <div className="flex items-center gap-8">
                                            <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-3xl border-2 border-slate-50 dark:border-white/5 flex items-center justify-center relative shadow-inner">
                                                <Users className="text-slate-300" size={32} />
                                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800">
                                                    <Star size={14} fill="currentColor" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-4 mb-2">
                                                    <h4 className="text-2xl font-black italic tracking-tighter uppercase dark:text-white">{candidate.name}</h4>
                                                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-full">{candidate.status}</span>
                                                </div>
                                                <div className="flex gap-4 mb-6">
                                                    {candidate.tags.map((tag, j) => (
                                                        <span key={j} className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-md">{tag}</span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                    <div className="flex items-center gap-2"><MapPin size={12} className="text-indigo-500" /> {candidate.distance}</div>
                                                    <div className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                                    <div className="flex items-center gap-2"><Clock size={12} className="text-amber-500" /> EXP: {candidate.exp}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                                    <div className="text-xl font-black italic tracking-tighter text-indigo-600">{candidate.skill}%</div>
                                                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Hand-Skill</div>
                                                </div>
                                                <div className="text-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                                    <div className="text-xl font-black italic tracking-tighter text-emerald-600">{candidate.efficiency}%</div>
                                                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Efficiency</div>
                                                </div>
                                            </div>
                                            <button className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-500/30 hover:scale-105 transition-all flex items-center justify-center gap-3">
                                                Unlock Full Clinical Record <ArrowRightCircle size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-20 bg-indigo-600 rounded-r-full"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* 4. RECRUITMENT LOGS & ANALYTICS */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white dark:bg-[#0a0f1d] p-10 rounded-[4rem] border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                            <h3 className="text-sm font-black italic uppercase tracking-widest mb-8 dark:text-white">Active Postings</h3>
                            <div className="space-y-6">
                                {[
                                    { title: 'Associate Dentist', candidates: 12, status: 'Urgent' },
                                    { title: 'BDS Intern (Shadowing)', candidates: 48, status: 'Open' },
                                ].map((post, i) => (
                                    <div key={i} className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 group hover:border-indigo-500/30 transition-all cursor-pointer">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-xs font-black italic tracking-tighter dark:text-white uppercase">{post.title}</div>
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${post.status === 'Urgent' ? 'text-rose-500 bg-rose-500/10' : 'text-emerald-500 bg-emerald-500/10'} px-2 py-0.5 rounded-full`}>{post.status}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <Users size={12} /> {post.candidates} Registered Applicants
                                        </div>
                                        <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full w-[45%] bg-indigo-600"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full py-5 bg-slate-900 dark:bg-white/10 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest mt-8 border border-white/5 flex items-center justify-center gap-3">
                                Post New Vacancy <Zap size={14} className="text-amber-500" />
                            </button>
                        </div>

                        {/* HIRING VOUCHER SYSTEM */}
                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-10 rounded-[4rem] text-white shadow-3xl shadow-amber-500/20 relative overflow-hidden group">
                            <div className="relative z-10">
                                <TicketPercent className="mb-6" size={40} />
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4 leading-none">Hiring <br /> Vouchers</h3>
                                <p className="text-[11px] font-medium opacity-80 leading-relaxed uppercase tracking-widest italic mb-10">
                                    Hire a candidate through Noble OS and unlock **1 Month of Free Teleconsult Listings**.
                                </p>
                                <button className="w-full py-5 bg-white text-indigo-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                                    View available Rewards
                                </button>
                            </div>
                            <Award className="absolute bottom-[-30px] left-[-30px] opacity-10 scale-[5] -rotate-12" />
                        </div>
                    </div>
                </div>

                {/* 5. VERIFICATION PROTOCOL */}
                <div className="bg-gradient-to-r from-emerald-600/10 to-transparent p-12 rounded-[4.5rem] border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-10">
                        <div className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-3xl shadow-emerald-500/40">
                            <ShieldCheck className="text-white" size={40} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">Verified Clinical Data</h3>
                            <p className="text-xs font-medium text-slate-500 italic mt-1 leading-relaxed max-w-xl">
                                "Recruitment Hub logic utilizes **Double-Blind Clinical Verification**. <br />
                                Hand-Skill scores are recalculated every 24 hours based on new Case Sign-offs and NEET mock scores."
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
