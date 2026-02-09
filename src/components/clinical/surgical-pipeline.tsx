'use client';

import React, { useState } from 'react';
import {
    Activity,
    Stethoscope,
    ShieldAlert,
    CreditCard,
    Calendar,
    Heart,
    CheckCircle2,
    ClipboardList,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    Timer,
    Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Stage = 'CONSULTATION' | 'CLEARANCE' | 'CONSENT' | 'SURGERY' | 'RECOVERY';

export default function SurgicalPipeline() {
    const [selectedPatient, setSelectedPatient] = useState<number | null>(1);

    const pipelineStages: { id: Stage; label: string; icon: any; color: string }[] = [
        { id: 'CONSULTATION', label: 'Consult', icon: Stethoscope, color: 'text-blue-500' },
        { id: 'CLEARANCE', label: 'Finances', icon: CreditCard, color: 'text-purple-500' },
        { id: 'CONSENT', label: 'Consent', icon: ShieldAlert, color: 'text-amber-500' },
        { id: 'SURGERY', label: 'Action', icon: Activity, color: 'text-red-500' },
        { id: 'RECOVERY', label: 'Recovery', icon: Heart, color: 'text-emerald-500' },
    ];

    const patients = [
        { id: 1, name: "Karthik Raja", procedure: "All-on-4 Implants", stage: 'CLEARANCE', progress: 40, risk: 'Moderate' },
        { id: 2, name: "Sarah Khan", procedure: "Wisdom Tooth Ext", stage: 'SURGERY', progress: 80, risk: 'Low' },
        { id: 3, name: "Suresh P.", procedure: "Bone Grafting", stage: 'RECOVERY', progress: 95, risk: 'Completed' },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                            <Activity size={14} className="animate-pulse" /> Precision Healthcare
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Surgical Pipeline</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Orchestrating high-value clinical lifecycles with surgical precision.</p>
                    </div>

                    <button className="px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-blue-500/10">
                        <Plus size={18} /> New Surgical Case
                    </button>
                </div>

                {/* Pipeline Tracker Visualization */}
                <div className="bg-white dark:bg-[#0a0f1d] p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center relative z-10">
                        {pipelineStages.map((stage, i) => (
                            <React.Fragment key={stage.id}>
                                <div className="flex flex-col items-center gap-4 relative group">
                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all ${selectedPatient && patients.find(p => p.id === selectedPatient)?.stage === stage.id
                                        ? 'bg-slate-900 text-white scale-110 shadow-2xl ring-4 ring-slate-100 dark:ring-white/5'
                                        : 'bg-slate-50 dark:bg-white/5 text-slate-400 opacity-50'
                                        }`}>
                                        <stage.icon size={28} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stage.label}</span>

                                    {/* Tooltip Simulation */}
                                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-lg text-[8px] font-black text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                        Readiness Check Required
                                    </div>
                                </div>
                                {i < pipelineStages.length - 1 && (
                                    <div className="flex-1 h-0.5 bg-slate-100 dark:bg-white/5 mx-4 mt-[-1.5rem]"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Patient Multi-Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Active Cases Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-[#0a0f1d] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-black uppercase tracking-tighter text-xl dark:text-white">Active Cases</h3>
                                <Filter size={18} className="text-slate-300" />
                            </div>
                            <div className="space-y-4">
                                {patients.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedPatient(p.id)}
                                        className={`w-full p-6 rounded-[2rem] text-left transition-all border ${selectedPatient === p.id
                                            ? 'bg-slate-50 dark:bg-white/5 border-blue-100 dark:border-blue-900/30'
                                            : 'border-transparent hover:bg-slate-50 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-black text-slate-900 dark:text-white">{p.name}</h4>
                                            <ArrowUpRight size={14} className="opacity-30" />
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{p.procedure}</div>
                                        <div className="h-1 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600" style={{ width: `${p.progress}%` }}></div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Surgical Readiness Dashboard */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {selectedPatient ? (
                                <motion.div
                                    key={selectedPatient}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-[#0a0f1d] p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-10"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-3xl font-black tracking-tighter dark:text-white">
                                                    {patients.find(p => p.id === selectedPatient)?.name}
                                                </h2>
                                                <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                    Stage: {patients.find(p => p.id === selectedPatient)?.stage}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-400">Scheduled: Oct 24, 2026 • Lead Surgeon: Dr. Dhivakaran</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-slate-900 dark:text-white">65%</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Readiness Score</div>
                                        </div>
                                    </div>

                                    {/* Actionable Checklists */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <ClipboardList size={14} /> Pre-Op Requirements
                                            </h4>
                                            {[
                                                { label: 'Blood Profile (Complete)', done: true },
                                                { label: 'Surgical Consent Signed', done: true },
                                                { label: 'Anesthesia Clearance', done: false },
                                                { label: 'Radiology (CBCT) Review', done: true },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.label}</span>
                                                    {item.done ? <CheckCircle2 className="text-emerald-500" size={18} /> : <Timer className="text-slate-300" size={18} />}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-between overflow-hidden relative group">
                                            <div className="relative z-10">
                                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Financial Health</h4>
                                                <div className="text-3xl font-black mb-2">Clearance Pending</div>
                                                <p className="text-xs font-medium text-slate-400">"Patient insurance approved for 70%. Remaining payment scheduled for admission date."</p>
                                            </div>
                                            <button className="relative z-10 mt-8 w-full py-4 bg-blue-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                                Proceed to Checkout <ChevronRight size={14} />
                                            </button>
                                            <CreditCard className="absolute bottom-[-20px] right-[-20px] opacity-10 group-hover:scale-110 transition-transform" size={120} />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex items-center justify-center p-20 text-slate-200">
                                    Select a case to view operative details.
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
