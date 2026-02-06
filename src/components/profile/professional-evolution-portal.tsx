'use client';

import React, { useState } from 'react';
import {
    User,
    GraduationCap,
    Stethoscope,
    TrendingUp,
    FileText,
    Share2,
    ShieldCheck,
    ShieldOff,
    ArrowRight,
    Award,
    Activity,
    Clock,
    MapPin,
    CheckCircle2,
    Eye,
    Download,
    Star,
    ChevronDown,
    Zap,
    Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for Professional Evolution
type UserRole = 'STUDENT' | 'DOCTOR';
type RegistrationStatus = 'TEMPORARY' | 'PERMANENT';

export default function ProfessionalEvolutionPortal() {
    const [role, setRole] = useState<UserRole>('STUDENT');
    const [status, setStatus] = useState<RegistrationStatus>('TEMPORARY');
    const [regNumber, setRegNumber] = useState('TEMP_2024_08');
    const [isStealth, setIsStealth] = useState(false);
    const [activeTab, setActiveTab] = useState<'PORTFOLIO' | 'CAREER' | 'NETWORK'>('PORTFOLIO');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [prnInput, setPrnInput] = useState('');
    const [isUpgrading, setIsUpgrading] = useState(false);

    const stats = {
        handSkillScore: 88,
        clinicalEfficiency: 92,
        verifiedCases: 142,
        mentorEndorsements: 12
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-8 font-sans selection:bg-rose-500/30">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* 1. PROFESSIONAL HEADER: THE IDENTITY HUB */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white dark:bg-[#0a0f1d] p-10 rounded-[3.5rem] border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="relative">
                            <div className="w-28 h-28 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl relative overflow-hidden group-hover:scale-105 transition-transform">
                                <User size={48} className="text-slate-400" />
                                {role === 'DOCTOR' && (
                                    <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-800">
                                        <ShieldCheck size={14} />
                                    </div>
                                )}
                            </div>
                            {isStealth && (
                                <div className="absolute -top-1 -left-1 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-amber-500/20">
                                    <ShieldOff size={10} /> Stealth
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">
                                    {isStealth ? 'Dr. Anonymous' : 'Dhivakaran G.'}
                                </h1>
                                <button
                                    onClick={() => setIsStealth(!isStealth)}
                                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${isStealth ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                                        }`}
                                >
                                    {isStealth ? 'Stealth ON' : 'Go Stealth'}
                                </button>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                                <span>{role === 'STUDENT' ? 'BDS Final Year' : 'Oral & Maxillofacial Surgeon'}</span>
                                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                                <span className={status === 'PERMANENT' ? 'text-emerald-500' : 'text-amber-500'}>
                                    Reg No: {regNumber} ({status})
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 relative z-10">
                        <button className="px-8 py-5 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 hover:bg-rose-700 transition-all shadow-xl shadow-rose-500/20 flex items-center gap-3">
                            <FileText size={16} /> Export Interactive Resume
                        </button>
                        <button className="p-5 bg-slate-900 dark:bg-white/10 text-white rounded-2xl hover:scale-110 transition-all border border-black/20">
                            <Share2 size={18} />
                        </button>
                    </div>

                    <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-rose-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                </div>

                {/* 2. ROLE SWITCHER (Demo purposes) */}
                {/* 2. ROLE EVOLUTION ENGINE */}
                <div className="flex justify-center gap-6">
                    <div className="bg-slate-100 dark:bg-white/5 p-2 rounded-[2rem] border border-slate-200 dark:border-white/5 inline-flex gap-2">
                        <button
                            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${role === 'STUDENT' ? 'bg-white dark:bg-white/10 text-rose-600 shadow-xl' : 'text-slate-400 opacity-50 cursor-not-allowed'
                                }`}
                        >
                            <GraduationCap size={14} className="inline mr-2" /> Academic Mode
                        </button>
                        <button
                            onClick={() => status === 'PERMANENT' ? setRole('DOCTOR') : setShowUpgradeModal(true)}
                            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${role === 'DOCTOR' ? 'bg-white dark:bg-white/10 text-blue-600 shadow-xl' : status === 'PERMANENT' ? 'text-slate-400' : 'text-amber-500 bg-amber-500/5'
                                }`}
                        >
                            <Stethoscope size={14} className="inline mr-2" />
                            {status === 'PERMANENT' ? 'Clinic Mode' : 'Upgrade to Clinic Mode'}
                        </button>
                    </div>
                </div>

                {/* 2.1 UPGRADE MODAL */}
                <AnimatePresence>
                    {showUpgradeModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white dark:bg-[#0a0f1d] p-12 rounded-[3.5rem] border border-slate-200 dark:border-white/5 shadow-4xl max-w-md w-full relative"
                            >
                                <div className="absolute top-8 right-8 cursor-pointer text-slate-400" onClick={() => setShowUpgradeModal(false)}>
                                    <ChevronDown size={24} className="rotate-180" />
                                </div>
                                <div className="mb-8">
                                    <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center mb-6">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <h2 className="text-3xl font-black italic tracking-tighter uppercase dark:text-white mb-2">Unlock Clinic Mode</h2>
                                    <p className="text-sm text-slate-400 italic font-medium">Enter your Permanent Registration Number to verify your degree and unlock Teleconsult & Live Surgery tools.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dental Council Reg No.</div>
                                        <input
                                            type="text"
                                            value={prnInput}
                                            onChange={(e) => setPrnInput(e.target.value.toUpperCase())}
                                            placeholder="e.g. MA_44129"
                                            className="w-full p-6 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl outline-none font-black italic tracking-tighter text-blue-600 focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <button
                                        disabled={isUpgrading || prnInput.length < 5}
                                        onClick={async () => {
                                            setIsUpgrading(true);
                                            // Simulate Backend Call
                                            setTimeout(() => {
                                                setStatus('PERMANENT');
                                                setRole('DOCTOR');
                                                setRegNumber(prnInput);
                                                setIsUpgrading(false);
                                                setShowUpgradeModal(false);
                                            }, 2000);
                                        }}
                                        className="w-full py-6 bg-blue-600 disabled:bg-slate-300 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center justify-center gap-3"
                                    >
                                        {isUpgrading ? (
                                            <TrendingUp size={16} className="animate-spin" />
                                        ) : (
                                            <>Verify & Evolution <ArrowRight size={14} /></>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-12 gap-8">

                    {/* 3. CLINICAL METRICS (The Scoring Engine) */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        <div className="bg-white dark:bg-[#0a0f1d] p-10 rounded-[3.5rem] border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                            <h2 className="text-xl font-black italic uppercase tracking-tighter mb-10 dark:text-white flex items-center gap-3">
                                <TrendingUp className="text-rose-500" /> Professional Gauges
                            </h2>

                            <div className="space-y-12">
                                {/* HAND SKILL SCORE */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hand-Skill Score</div>
                                        <div className="text-2xl font-black italic text-rose-600 tracking-tighter">{stats.handSkillScore}%</div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${stats.handSkillScore}%` }} className="h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"></motion.div>
                                    </div>
                                    <div className="text-[9px] text-slate-400 italic">Aggregated from verified Endodontic & Restorative cases.</div>
                                </div>

                                {/* CLINICAL EFFICIENCY */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clinical Efficiency</div>
                                        <div className="text-2xl font-black italic text-blue-600 tracking-tighter">{stats.clinicalEfficiency}%</div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${stats.clinicalEfficiency}%` }} className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></motion.div>
                                    </div>
                                    <div className="text-[9px] text-slate-400 italic">Patient satisfaction vs. completion time index.</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-6">
                                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 text-center">
                                        <div className="text-2xl font-black italic text-slate-900 dark:text-white mb-1">{stats.verifiedCases}</div>
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Verified Cases</div>
                                    </div>
                                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 text-center">
                                        <div className="text-2xl font-black italic text-slate-900 dark:text-white mb-1">{stats.mentorEndorsements}</div>
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Endorsements</div>
                                    </div>
                                </div>

                                <button className="w-full py-5 bg-slate-900 dark:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all">
                                    Verify More Skills
                                </button>
                            </div>
                        </div>

                        {/* HIRING / RECRUITMENT STATUS */}
                        <div className={`p-10 rounded-[3.5rem] border shadow-2xl relative overflow-hidden group transition-all duration-500 ${role === 'STUDENT' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white dark:bg-[#0a0f1d] dark:text-white border-slate-200 dark:border-white/5'}`}>
                            <div className="relative z-10">
                                <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4">{role === 'STUDENT' ? 'Placement Pulse' : 'Teleconsult Visibility'}</h3>
                                <p className="text-xs font-medium opacity-80 italic leading-relaxed mb-10">
                                    {role === 'STUDENT'
                                        ? "Your profile is active in the Hiring Network. 4 Clinics within 15km are currently seeking Interns with your Hand-Skill profile."
                                        : "Your profile is listed on the Global Teleconsult Marketplace. Average response time: 24 mins."
                                    }
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 bg-white/20 rounded-full border-2 border-indigo-600 flex items-center justify-center backdrop-blur-md">
                                                <User size={14} />
                                            </div>
                                        ))}
                                    </div>
                                    <button className={`px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all ${role === 'STUDENT' ? 'bg-white text-indigo-600' : 'bg-blue-600 text-white'}`}>
                                        {role === 'STUDENT' ? 'Manage Job Alerts' : 'Marketplace Settings'} <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                            <Briefcase className="absolute bottom-[-20px] left-[-20px] opacity-10 scale-[4] rotate-12" />
                        </div>
                    </div>

                    {/* 4. WORKSPACE: PORTFOLIO & TIMELINE */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">

                        {/* NAVIGATION TABS */}
                        <div className="bg-white dark:bg-[#0a0f1d] p-4 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl flex gap-4">
                            {(['PORTFOLIO', 'CAREER', 'NETWORK'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* TAB CONTENT: THE CASE TIMELINE */}
                        <div className="bg-white dark:bg-[#0a0f1d] p-12 rounded-[4.5rem] border border-slate-200 dark:border-white/5 shadow-2xl relative">
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-2xl font-black italic tracking-tighter uppercase dark:text-white flex items-center gap-3">
                                    <Activity className="text-rose-500" />
                                    {role === 'STUDENT' ? 'Clinical Portfolio' : 'Verified Clinical Record'}
                                </h2>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-full border border-slate-100 dark:border-white/5">
                                    <Eye size={12} /> 1.2k Public Views
                                </div>
                            </div>

                            <div className="space-y-8 relative before:absolute before:left-[17px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100 dark:before:bg-white/5">
                                {[
                                    { title: 'Complex Molar Endo', type: 'Clinical Case', date: '2 days ago', status: 'MENTOR VERIFIED', score: 94, img: true },
                                    { title: 'Class II Composite', type: 'Shadowing Log', date: '1 week ago', status: 'SYSTEM SIGNED', score: 82, img: false },
                                    { title: 'Full Mouth Rehab', type: 'Verified Surgery', date: 'Oct 20, 2026', status: 'DOCTOR CERTIFIED', score: 88, img: true },
                                ].map((caseItem, i) => (
                                    <div key={i} className="pl-12 relative group">
                                        <div className="absolute left-0 top-1 w-9 h-9 bg-white dark:bg-[#0a0f1d] border-4 border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center transition-all group-hover:border-rose-500 group-hover:scale-110 z-10">
                                            <Award size={14} className="text-rose-500" />
                                        </div>

                                        <motion.div
                                            whileHover={{ x: 5 }}
                                            className="p-8 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-slate-100 dark:border-white/5 relative overflow-hidden"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex items-center gap-6">
                                                    {caseItem.img && (
                                                        <div className="w-24 h-24 bg-slate-900 rounded-3xl overflow-hidden relative flex items-center justify-center group-hover:shadow-2xl transition-all">
                                                            <Activity className="text-slate-800 opacity-20" size={40} />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <div className="text-xs font-black italic tracking-tighter dark:text-white uppercase">{caseItem.title}</div>
                                                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded-full">{caseItem.score}% Skill</span>
                                                        </div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{caseItem.type} · {caseItem.date}</div>
                                                        <div className="mt-4 flex items-center gap-2">
                                                            <CheckCircle2 size={12} className="text-emerald-500" />
                                                            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">{caseItem.status}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <button className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-400 hover:text-rose-500 transition-all">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-400 hover:text-blue-500 transition-all">
                                                        <Download size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 flex justify-center">
                                <button className="px-10 py-5 bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all border border-slate-200 dark:border-white/5 flex items-center gap-3">
                                    View Full History <ChevronDown size={14} />
                                </button>
                            </div>
                        </div>

                        {/* ADAPTIVE HUB (ACADEMIC ACCELERATOR PREVIEW) */}
                        <div className="bg-gradient-to-br from-slate-900 to-black p-12 rounded-[4.5rem] border border-white/5 text-white shadow-4xl relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-rose-500 font-black text-[10px] uppercase tracking-[0.4em]">
                                        <Zap size={16} className="animate-pulse" /> Noble Entrance
                                    </div>
                                    <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">NEET-MDS <br /> Accelerator</h2>
                                    <p className="text-sm font-medium text-slate-400 italic max-w-sm">
                                        Transform your clinical cases into academic success. Daily MCQ sprints generated from your clinical data.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-6 bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-md">
                                    <div className="text-center">
                                        <div className="text-4xl font-black italic tracking-tighter text-rose-500">12th</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Global Rank</div>
                                    </div>
                                    <button className="px-10 py-5 bg-rose-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20 hover:scale-105 transition-all">
                                        Start Daily Sprint
                                    </button>
                                </div>
                            </div>
                            <Award className="absolute bottom-[-30px] right-[-30px] opacity-[0.03] scale-[5] rotate-12" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

