'use client';

import React, { useState } from 'react';
import {
    Activity,
    Shapes,
    Palette,
    Layers,
    ChevronDown,
    CheckCircle2,
    DollarSign,
    Zap,
    Beaker,
    Store,
    ArrowRightCircle,
    ClipboardList,
    Settings2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for DME Engine
type LabPremiumLevel = 'STANDARD' | 'PREMIUM' | 'ELITE';

interface MaterialOption {
    id: string;
    label: string;
    price: number;
    description: string;
}

interface LabDME {
    id: string;
    name: string;
    materials: MaterialOption[];
    specializations: string[];
    turnaround: string;
    rating: number;
}

export default function DMETemplateEngine() {
    const [selectedLab, setSelectedLab] = useState<string>('sv-premium');
    const [selectedMaterial, setSelectedMaterial] = useState<string>('zir-full');

    const labs: LabDME[] = [
        {
            id: 'sv-premium',
            name: 'S.V. Dental Lab Premium',
            turnaround: '3 Days',
            rating: 4.9,
            specializations: ['Zirconia', 'IPS e.max', 'Implant Pro'],
            materials: [
                { id: 'zir-full', label: 'Monolith Full Zirconia', price: 120, description: 'High strength, optimal for molars.' },
                { id: 'zir-layer', label: 'Layered Aesthetic Zirconia', price: 180, description: 'Hand-layered porcelain for anterior cases.' },
                { id: 'emax', label: 'IPS e.max CAD', price: 150, description: 'Lithium Disilicate for maximum aesthetics.' },
            ]
        },
        {
            id: 'global-denture',
            name: 'Global Denture Hub',
            turnaround: '5 Days',
            rating: 4.5,
            specializations: ['Digital Dentures', 'Cast Partial'],
            materials: [
                { id: 'den-base', label: 'High-Impact Acrylic', price: 80, description: 'Heat-cured traditional denture base.' },
                { id: 'den-digital', label: '3D Printed BPS Denture', price: 200, description: 'Precision fit, digital workflow.' },
            ]
        }
    ];

    const currentLab = labs.find(l => l.id === selectedLab)!;
    const currentPrice = currentLab.materials.find(m => m.id === selectedMaterial)?.price || 0;

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* 1. COMPONENT HEADER */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white dark:bg-[#0a0f1d] p-10 rounded-[3.5rem] border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mb-4">
                            <Activity size={16} className="animate-pulse" /> DME Template Engine
                        </div>
                        <h1 className="text-3xl font-black italic tracking-tighter mb-4 text-slate-900 dark:text-white uppercase">
                            Dynamic Rx & Material Sync
                        </h1>
                        <p className="text-sm font-medium text-slate-400 italic">
                            Automatically switching Rx forms based on Lab-specific inventories and live price indexes.
                        </p>
                    </div>

                    <div className="relative z-10 bg-emerald-600/10 p-6 rounded-[2.5rem] border border-emerald-600/20 text-center min-w-[200px]">
                        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Est. Lab Cost</div>
                        <div className="text-4xl font-black italic tracking-tighter text-emerald-600">${currentPrice}</div>
                    </div>

                    <div className="absolute top-[-40px] right-[-40px] opacity-[0.03] scale-[3] rotate-[-15deg]">
                        <Shapes size={100} />
                    </div>
                </div>

                {/* 2. LAB SELECTOR */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-[#0a0f1d] p-8 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl">
                            <h3 className="text-sm font-black italic uppercase tracking-widest mb-6 dark:text-white">Connected Labs</h3>
                            <div className="space-y-4">
                                {labs.map((lab) => (
                                    <button
                                        key={lab.id}
                                        onClick={() => {
                                            setSelectedLab(lab.id);
                                            setSelectedMaterial(lab.materials[0].id);
                                        }}
                                        className={`w-full p-6 rounded-[2rem] border transition-all text-left flex items-start gap-4 ${selectedLab === lab.id
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]'
                                            : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className={`p-3 rounded-xl ${selectedLab === lab.id ? 'bg-white/10' : 'bg-slate-50'}`}>
                                            <Store size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black uppercase tracking-tight">{lab.name}</div>
                                            <div className="text-[9px] opacity-60 font-medium mt-1 uppercase tracking-widest italic">{lab.turnaround} · ★ {lab.rating}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-emerald-600 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <Zap className="mb-4 text-emerald-300" size={24} />
                                <h3 className="text-lg font-black italic uppercase tracking-tighter mb-2">Live Price Index</h3>
                                <p className="text-[10px] font-medium opacity-80 leading-relaxed uppercase tracking-widest italic">
                                    Prices are synced in real-time with lab-managed DME catalogs.
                                </p>
                            </div>
                            <DollarSign className="absolute bottom-[-20px] left-[-20px] opacity-10 scale-[4] rotate-12" />
                        </div>
                    </div>

                    {/* 3. DYNAMIC RX FORM */}
                    <div className="lg:col-span-8 bg-white dark:bg-[#0a0f1d] p-12 rounded-[4rem] border border-slate-200 dark:border-white/5 shadow-2xl relative">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase dark:text-white flex items-center gap-3">
                                <ClipboardList className="text-emerald-600" /> Digital Rx Formulation
                            </h2>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full">
                                <Settings2 size={12} /> Adaptive DME Engine V2.1
                            </div>
                        </div>

                        <div className="space-y-10">
                            {/* MATERIAL SELECT (DYNAMIC) */}
                            <div className="space-y-6">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Select Material (Lab Specific)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentLab.materials.map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => setSelectedMaterial(m.id)}
                                            className={`p-6 rounded-[2.5rem] border transition-all text-left relative overflow-hidden group ${selectedMaterial === m.id
                                                ? 'bg-emerald-600/5 border-emerald-600 text-emerald-900 dark:text-emerald-400'
                                                : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-500'
                                                }`}
                                        >
                                            <div className="font-black italic uppercase text-xs mb-1">{m.label}</div>
                                            <div className="text-[9px] font-medium opacity-60 italic">{m.description}</div>
                                            <div className="absolute top-4 right-6 font-black text-[10px] italic">+ ${m.price}</div>
                                            {selectedMaterial === m.id && (
                                                <motion.div layoutId="check" className="absolute bottom-4 right-6 text-emerald-600">
                                                    <CheckCircle2 size={18} />
                                                </motion.div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* SHADE & TRANSPARENCY (LAB SPECIFIC) */}
                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100 dark:border-white/5">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Shade Guide (VITA Classical)</label>
                                    <div className="relative group">
                                        <div className="w-full p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between font-black text-[10px] uppercase cursor-pointer hover:border-emerald-500/50 transition-all">
                                            A1 - EXTRA BRIGHT <ChevronDown size={14} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Transparency</label>
                                    <div className="relative">
                                        <div className="w-full p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between font-black text-[10px] uppercase cursor-pointer hover:border-emerald-500/50 transition-all">
                                            HT (HIGH TRANSLUCENCY) <ChevronDown size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ADDITIONAL FILE ATTACHMENTS */}
                            <div className="flex items-center gap-6 p-6 bg-slate-900 rounded-[2.5rem] text-white">
                                <div className="p-4 bg-white/10 rounded-2xl border border-white/10"><Beaker size={20} className="text-emerald-400" /></div>
                                <div className="flex-1">
                                    <div className="text-xs font-black italic uppercase tracking-tighter">Attach Scan Metadata</div>
                                    <div className="text-[9px] opacity-60 uppercase tracking-widest mt-1">Automatically syncing TRIOS STL + SmileStudio Mockup</div>
                                </div>
                                <CheckCircle2 className="text-emerald-500" />
                            </div>

                            <button className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] transition-all shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-4 group">
                                Submit Clinical Blueprint to Lab <ArrowRightCircle className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4. ECOSYSTEM TELEMETRY */}
                <div className="bg-gradient-to-r from-emerald-600/10 to-transparent p-10 rounded-[3.5rem] border border-emerald-600/20 flex items-center gap-8">
                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center">
                        <Layers className="text-white" size={28} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">DME Cloud Protocol</h4>
                        <p className="text-[10px] font-medium text-slate-500 italic uppercase tracking-widest mt-1">
                            Your "Noble OS" Rx is fully compatible with **3Shape Communicate** and **Medit Link** infrastructure.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
