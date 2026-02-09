'use client';

import React, { useState } from 'react';
import {
    Share2,
    Lock,
    Eye,
    Link as LinkIcon,
    QrCode,
    Clock,
    Globe,
    Zap,
    Smartphone,
    RotateCcw,
    MousePointer2,
    CheckCircle2,
    Copy,
    ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NobleSharePortal() {
    const [isLinkGenerated, setIsLinkGenerated] = useState(false);
    const [expiry, setExpiry] = useState('24h');

    const shareLink = "https://noble.os/v/ax4421-smilestudio";

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-8 font-sans selection:bg-indigo-500/30">
            <div className="max-w-[1400px] mx-auto space-y-10">

                {/* 1. HERO SECTION: The Zero-App Philosophy */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white dark:bg-[#0a0f1d] p-12 rounded-[4.5rem] border border-slate-200 dark:border-white/5 shadow-3xl relative overflow-hidden group">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3 text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em]">
                            <Globe size={16} className="animate-spin-slow" /> Noble Share Protocol
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
                            Instant 3D <br /> Web Experience
                        </h1>
                        <p className="text-sm font-medium text-slate-400 max-w-md">
                            Zero apps. Zero friction. Send a secure, expiring link to patients or labs for full 3D scan visualization in any mobile browser.
                        </p>
                    </div>

                    {/* MOCK MOBILE PREVIEW */}
                    <div className="relative z-10 w-[300px] h-[600px] bg-slate-950 rounded-[3rem] border-[8px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden scale-90 md:scale-100">
                        {/* Status Bar */}
                        <div className="h-10 w-full flex justify-between items-center px-8 pt-4">
                            <span className="text-[10px] font-bold text-white">9:41</span>
                            <div className="flex gap-1.5 backdrop-blur-md px-3 py-1 bg-white/10 rounded-full">
                                <Smartphone size={10} className="text-white" />
                                <Lock size={10} className="text-emerald-400" />
                            </div>
                        </div>

                        {/* MOBILE WEB CONTENT */}
                        <div className="p-8 flex flex-col h-full bg-gradient-to-b from-slate-900 to-black">
                            <div className="flex items-center justify-between mb-8">
                                <div className="text-[10px] font-black text-indigo-400 tracking-tighter">NOBLE OS / VIEW</div>
                                <div className="text-[8px] text-slate-500 font-bold">Expires in 2h</div>
                            </div>

                            {/* SCAN RENDERER MOCKUP */}
                            <div className="flex-1 bg-black/40 rounded-[2.5rem] border border-white/5 flex items-center justify-center relative group/mobile">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent)]"></div>
                                <RotateCcw className="text-indigo-500/40 animate-spin-slow" size={60} strokeWidth={1} />
                                <div className="absolute bottom-6 flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"><MousePointer2 size={12} /></div>
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 shadow-lg shadow-indigo-500/40 flex items-center justify-center text-white"><RotateCcw size={12} /></div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[12px] font-black text-white uppercase tracking-tighter">Lower Arch Scan</h4>
                                    <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">38.2 MB</span>
                                </div>
                                <p className="text-[9px] text-slate-500 leading-relaxed">
                                    Full digital impression for Bridge restoration. <br /> Lab-ready precision sync.
                                </p>
                                <button className="w-full py-4 bg-white/10 border border-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest mt-4">
                                    Submit Feedback
                                </button>
                            </div>
                        </div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-800 rounded-full"></div>
                    </div>

                    <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full"></div>
                        <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full"></div>
                    </div>
                </div>

                {/* 2. CONTROL PANEL */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    <div className="bg-white dark:bg-[#0a0f1d] p-12 rounded-[4rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-500/20"><LinkIcon size={24} /></div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">Secure Link Logic</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure sharing parameters and permissions</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-3 gap-4">
                                {['1h', '24h', '7 days', 'Forever'].map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setExpiry(time)}
                                        className={`py-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${expiry === time
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl'
                                            : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-300'
                                            }`}
                                    >
                                        <Clock size={12} className="inline mr-2" /> {time}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                    <Lock size={12} /> Security Overlays
                                </label>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Patient Authentication Required', sub: 'OTP will be sent to their mobile' },
                                        { label: 'Disable Measurements', sub: 'Viewer cannot use the ruler tool' },
                                        { label: 'Cloud Watermarking', sub: 'Clinic name embedded in viewport' },
                                    ].map((opt, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5 group hover:border-indigo-500/30 transition-all cursor-pointer">
                                            <div>
                                                <div className="text-[11px] font-black dark:text-white uppercase tracking-tight">{opt.label}</div>
                                                <div className="text-[9px] text-slate-400 font-medium mt-0.5">{opt.sub}</div>
                                            </div>
                                            <div className="w-10 h-6 bg-slate-200 dark:bg-white/10 rounded-full relative p-1 group-hover:bg-indigo-600/20 transition-colors">
                                                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setIsLinkGenerated(true)}
                                className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] transition-all shadow-3xl shadow-indigo-500/30 flex items-center justify-center gap-4"
                            >
                                Generate Secure Portal Link <ArrowUpRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* RESULT CARD */}
                    <AnimatePresence>
                        {isLinkGenerated && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-4xl relative overflow-hidden flex flex-col justify-between"
                            >
                                <div className="space-y-10 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="px-5 py-2 bg-indigo-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-500/40">
                                            <CheckCircle2 size={12} /> Live Sharing Protocol Active
                                        </div>
                                        <QrCode size={32} className="text-white/20" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Shareable URL</div>
                                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                                            <span className="text-sm font-black tracking-tighter text-indigo-400">{shareLink}</span>
                                            <Copy size={18} className="text-slate-500 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] text-center">
                                            <div className="text-3xl font-black tracking-tighter text-white mb-1">0</div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Active Impressions</div>
                                        </div>
                                        <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] text-center">
                                            <div className="text-3xl font-black tracking-tighter text-white mb-1">0</div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Lab Downloads</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-2 group cursor-pointer">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white group-hover:bg-indigo-600 transition-colors"><Zap size={18} /></div>
                                        <div className="text-[10px] font-black uppercase tracking-widest">Noble Cloud Acceleration</div>
                                    </div>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">
                                        Manage Permissions <Settings2 size={14} />
                                    </button>
                                </div>

                                <Globe className="absolute top-[-50px] right-[-50px] opacity-[0.03] scale-[5] rotate-45" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 3. INTER-MODULE TELEMETRY */}
                <div className="bg-gradient-to-r from-indigo-600/10 to-transparent p-10 rounded-[4rem] border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-3xl shadow-indigo-500/40">
                            <Smartphone className="text-white" size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">Mobile-First Infiltration</h3>
                            <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed max-w-xl">
                                "Noble Share links are optimized for **iOS & Android WebGPU**. <br />
                                High-poly STLs (5M+ facets) are decimate-simulated on the fly for 60FPS mobile interaction."
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function Settings2({ className, size }: { className?: string, size?: number }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg>;
}
