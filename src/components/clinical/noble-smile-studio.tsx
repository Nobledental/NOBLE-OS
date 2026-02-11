'use client';

import React, { useState } from 'react';
import {
    Scissors,
    Layers,
    Focus,
    Maximize,
    Sparkles,
    Smile,
    Ruler,
    Palette,
    Layout,
    Save,
    Share2,
    ChevronRight,
    CircleDot,
    Activity,
    ScanFace,
    Wand2,
    Eye,
    Pipette,
    History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for Smile Analysis Logic
type AnalysisMode = 'PROPORTION' | 'SYMMETRY' | 'MOCKUP' | 'GINGIVAL';

export default function NobleSmileStudio() {
    const [mode, setMode] = useState<AnalysisMode>('PROPORTION');
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>('Patient_Frontal_Face.jpg');

    // Extracted Logics: Simulation Data
    const [metrics, setMetrics] = useState({
        midlineDeviation: 0.2,
        goldenRatioMatch: 92,
        interpupillaryAlignment: 'OPTIMAL',
        suggestedTeethWidth: '8.5mm'
    });

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans selection:bg-blue-500/30 overflow-hidden">
            <div className="max-w-[1700px] mx-auto h-[calc(100vh-100px)] flex flex-col gap-8">

                {/* 1. TOP NAV: Studio Management */}
                <div className="flex items-center justify-between bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-2xl relative overflow-hidden group">
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-500/20">
                            <Sparkles className="text-white animate-pulse" size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-[0.3em] mb-1">
                                <ScanFace size={14} /> AI Aesthetic Engine
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Noble Smile Studio</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="flex bg-slate-100 p-2 rounded-[2rem] border border-slate-200">
                            {(['PROPORTION', 'SYMMETRY', 'MOCKUP'] as AnalysisMode[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className={`px-8 py-3 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all ${mode === m ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3 ml-4">
                            <button className="p-4 bg-slate-900 text-white rounded-2xl hover:scale-110 transition-all border border-black/20"><Save size={20} /></button>
                            <button className="p-4 bg-indigo-600 text-white rounded-2xl hover:scale-110 transition-all shadow-xl shadow-indigo-500/20"><Share2 size={20} /></button>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none"></div>
                </div>

                {/* 2. STUDIO WORKSPACE */}
                <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">

                    {/* LEFT PANEL: Extracted Tools */}
                    <div className="col-span-3 space-y-8 overflow-y-auto pr-4 custom-scrollbar">

                        {/* ANALYSIS WIDGET: The "Brain" of the Studio */}
                        <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-2xl relative overflow-hidden group">
                            <h2 className="text-xl font-black uppercase tracking-tighter mb-8">Clinical Analytics</h2>

                            <div className="space-y-8">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group-hover:border-indigo-400 transition-all">
                                    <div className="text-3xl font-black tracking-tighter text-indigo-600">{metrics.goldenRatioMatch}%</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Golden Ratio Sync</div>
                                    <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${metrics.goldenRatioMatch}%` }} className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></motion.div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { label: 'Midline Shift', value: '0.2mm L', status: 'Optimal', color: 'emerald' },
                                        { label: 'Incisal Egde', value: 'Suggest +1.5mm', status: 'Warning', color: 'amber' },
                                        { label: 'Gingival Zenith', value: 'Symmetric', status: 'Optimal', color: 'emerald' },
                                    ].map((stat, i) => (
                                        <div key={stat.label} className="flex items-center justify-between">
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</div>
                                                <div className="text-sm font-black">{stat.value}</div>
                                            </div>
                                            <div className={`px-3 py-1 bg-${stat.color}-500/10 text-${stat.color}-500 rounded-lg text-[8px] font-black uppercase tracking-widest`}>
                                                {stat.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full py-5 bg-indigo-600/10 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-indigo-600/20">
                                    Recalculate AI Biometrics
                                </button>
                            </div>
                        </div>

                        {/* TOOLBOX: Physical Logic Controls */}
                        <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                            <h3 className="text-lg font-black uppercase tracking-tighter mb-8">Smile Components</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: Smile, label: 'Tooth Library' },
                                    { icon: Palette, label: 'Shade (VITA)' },
                                    { icon: Ruler, label: 'Proportion Tool' },
                                    { icon: Scissors, label: 'Gum Contour' },
                                    { icon: Layers, label: 'Scan Overlay' },
                                    { icon: Focus, label: 'Face Align' },
                                ].map((tool, i) => (
                                    <button key={i} className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-[2rem] hover:bg-white/10 transition-all border border-white/5 group">
                                        <tool.icon className="text-slate-400 group-hover:text-indigo-400 transition-colors" size={24} />
                                        <span className="text-[8px] font-black uppercase tracking-widest leading-none text-slate-400 group-hover:text-white">{tool.label}</span>
                                    </button>
                                ))}
                            </div>
                            <Wand2 className="absolute top-[-20px] right-[-20px] opacity-[0.03] scale-[4] rotate-12" />
                        </div>
                    </div>

                    {/* CENTER: THE CANVAS (Clinical View) */}
                    <div className="col-span-6 bg-black rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden group">

                        {/* THE SIMULATION VIEWPORT */}
                        <div className="absolute inset-0 flex items-center justify-center p-12">
                            <div className="relative w-full h-full max-h-[800px] flex items-center justify-center bg-slate-900/50 rounded-[3rem] border border-white/5 overflow-hidden">

                                {/* MOCK PATIENT IMAGE (The Base) */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000">
                                    <ScanFace className="text-slate-700 w-1/2 h-1/2" />
                                </div>

                                {/* ANALYSIS OVERLAYS (The "Extracted Logic" Visualized) */}
                                {mode === 'PROPORTION' && (
                                    <AnimatePresence>
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 p-20 flex flex-col items-center justify-center">
                                            {/* GOLDEN PROPORTION GRID */}
                                            <div className="w-full h-full border-x-2 border-indigo-500/50 flex relative">
                                                <div className="flex-1 border-r border-indigo-500/20 flex flex-col justify-center items-center">
                                                    <div className="text-[10px] font-black text-indigo-400 absolute top-[-30px] uppercase">1.6</div>
                                                </div>
                                                <div className="flex-[1.6] border-r border-indigo-500/40 flex flex-col justify-center items-center group/center">
                                                    <div className="text-[10px] font-black text-indigo-500 absolute top-[-30px] uppercase">Central Incisor (1.0)</div>
                                                    <div className="w-2 h-full bg-indigo-500/20 animate-pulse"></div> {/* MIDLINE */}
                                                </div>
                                                <div className="flex-1 border-r border-indigo-500/20 flex flex-col justify-center items-center">
                                                    <div className="text-[10px] font-black text-indigo-400 absolute top-[-30px] uppercase">1.6</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                )}

                                {mode === 'MOCKUP' && (
                                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 flex gap-1">
                                        {[1, 2, 3, 4].map((t) => (
                                            <div key={t} className="w-16 h-28 bg-white/90 rounded-b-[2rem] shadow-[0_10px_30px_rgba(255,255,255,0.2)] border-x border-slate-200 flex items-center justify-center group/tooth hover:scale-105 transition-all cursor-move">
                                                <Pipette className="opacity-0 group-hover/tooth:opacity-100 text-indigo-500" size={12} />
                                            </div>
                                        ))}
                                    </motion.div>
                                )}

                                {/* FLOATING CAMERA CONTROLS */}
                                <div className="absolute top-10 right-10 flex flex-col gap-4">
                                    <button className="p-4 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all border border-white/10 text-white"><Maximize size={20} /></button>
                                    <button className="p-4 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all border border-white/10 text-white"><Eye size={20} /></button>
                                    <button className="p-4 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all border border-white/10 text-white"><History size={20} /></button>
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM HUD: Contextual Stats */}
                        <div className="absolute bottom-10 left-10 right-10 p-10 bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 flex items-center justify-between">
                            <div className="flex gap-12">
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Analysis Vector</div>
                                    <div className="text-xl font-black tracking-tighter text-white">INTERPUPILLARY <br /> ALIGNMENT</div>
                                </div>
                                <div className="h-full w-px bg-white/10"></div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Simulated Result</div>
                                    <div className="text-xl font-black tracking-tighter text-emerald-400 uppercase">Synchronized</div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-8 py-5 bg-white/10 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 flex items-center gap-2">
                                    <Sparkles size={14} className="text-indigo-400" /> Generate Success Card
                                </button>
                                <button className="px-10 py-5 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-110 transition-all shadow-2xl shadow-indigo-500/40 border border-white/20">
                                    Apply Virtual Mockup
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: ECOSYSTEM SYNC */}
                    <div className="col-span-3 space-y-8 overflow-y-auto pr-4 custom-scrollbar">
                        <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-2xl">
                            <h2 className="text-xl font-black uppercase tracking-tighter mb-8">Collaborative Blueprint</h2>
                            <div className="space-y-6">
                                {[
                                    { doc: 'Dr. Sarah (Prosthodontist)', note: 'Increase incisal dominance by 1mm for better lip support.', time: '2h ago' },
                                    { doc: 'S.V. Lab', note: 'Shade B1 confirmed. Ready for milling.', time: '5h ago' },
                                ].map((comment, i) => (
                                    <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">{comment.doc}</div>
                                        <p className="text-xs font-medium text-slate-500 leading-relaxed">{comment.note}</p>
                                        <span className="text-[9px] text-slate-400 mt-4 block uppercase font-bold">{comment.time}</span>
                                        <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <CircleDot className="text-indigo-600 animate-pulse" size={14} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all">
                                Request Lab Review
                            </button>
                        </div>

                        {/* BRIDGE SYNC STATUS */}
                        <div className="p-10 bg-indigo-600 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <Activity className="text-white mb-6" size={32} />
                                <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Universal Bridge</h3>
                                <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Linked to TRIOS 5 Cloud</div>
                                <div className="mt-8 flex items-center justify-between">
                                    <div className="text-3xl font-black tracking-tighter">14ms</div>
                                    <ChevronRight className="group-hover:translate-x-4 transition-transform" />
                                </div>
                            </div>
                            <Layout className="absolute bottom-[-30px] right-[-30px] opacity-10 scale-[4] rotate-[-15deg]" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Sub-components as icons/helpers (simplified for the demo)
function Heart({ className, size }: { className?: string, size?: number }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>;
}
