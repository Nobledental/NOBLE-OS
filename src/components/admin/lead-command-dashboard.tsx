'use client';

import React, { useState } from 'react';
import {
    LayoutDashboard,
    Clock,
    Activity,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    Search,
    ChevronRight,
    ArrowUpRight,
    Users,
    Zap,
    Timer,
    Stethoscope,
    Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PatientStatus = 'WAITING' | 'VITALS' | 'CONSULT' | 'PROCEDURE' | 'BILLING';

interface PatientOrder {
    id: string;
    name: string;
    procedure: string;
    startTime: string;
    waitTime: number; // in minutes
    status: PatientStatus;
    doctor: string;
    priority: boolean;
}

const INITIAL_QUEUE: PatientOrder[] = [
    { id: '1', name: "Anand S.", procedure: "Implant Consult", startTime: "10:15 AM", waitTime: 42, status: 'WAITING', doctor: "Dr. Dhivakaran", priority: true },
    { id: '2', name: "Priya V.", procedure: "Scaling", startTime: "10:30 AM", waitTime: 12, status: 'VITALS', doctor: "Staff Nurse", priority: false },
    { id: '3', name: "Rahul K.", procedure: "Root Canal", startTime: "10:00 AM", waitTime: 5, status: 'CONSULT', doctor: "Dr. Sarah", priority: false },
    { id: '4', name: "Meena L.", procedure: "Extraction", startTime: "10:45 AM", waitTime: 25, status: 'PROCEDURE', doctor: "Dr. Dhivakaran", priority: true },
    { id: '5', name: "Deepak J.", procedure: "Billing", startTime: "09:45 AM", waitTime: 2, status: 'BILLING', doctor: "Reception", priority: false },
];

export default function LeadCommandDashboard() {
    const [queue, setQueue] = useState<PatientOrder[]>(INITIAL_QUEUE);

    const getColumnPatients = (status: PatientStatus) => queue.filter(p => p.status === status);

    const columns: { id: PatientStatus; label: string; icon: any; color: string }[] = [
        { id: 'WAITING', label: 'Waiting', icon: Clock, color: 'text-amber-500' },
        { id: 'VITALS', label: 'Vitals', icon: Activity, color: 'text-blue-500' },
        { id: 'CONSULT', label: 'Consult', icon: Stethoscope, color: 'text-purple-500' },
        { id: 'PROCEDURE', label: 'Action', icon: Zap, color: 'text-red-500' },
        { id: 'BILLING', label: 'Billing', icon: Receipt, color: 'text-emerald-500' },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-8">
            <div className="max-w-screen-2xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-[#0a0f1d] p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-4">
                            <Zap size={14} className="animate-pulse" /> Logistics Command Engine
                        </div>
                        <h1 className="text-4xl font-black tracking-tight italic text-slate-900 dark:text-white">Lead Command</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Orchestrating patient fulfillment with zero-friction logic.</p>
                    </div>

                    <div className="relative z-10 flex gap-4">
                        <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5">
                            <div className="text-2xl font-black text-slate-900 dark:text-white">14.2m</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Fulfillment</div>
                        </div>
                        <div className="bg-emerald-500 p-6 rounded-[2rem] text-white shadow-xl shadow-emerald-500/20">
                            <div className="text-2xl font-black">94%</div>
                            <div className="text-[10px] font-bold opacity-75 uppercase tracking-widest text-emerald-100">Live Throughput</div>
                        </div>
                    </div>
                </div>

                {/* Live Kanban Board */}
                <div className="flex gap-6 overflow-x-auto pb-10 custom-scrollbar">
                    {columns.map((column) => (
                        <div key={column.id} className="min-w-[320px] flex-1 space-y-6">
                            {/* Column Header */}
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl bg-white dark:bg-[#0a0f1d] shadow-lg border border-slate-100 dark:border-white/5 ${column.color}`}>
                                        <column.icon size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">{column.label}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{getColumnPatients(column.id).length} Active</p>
                                    </div>
                                </div>
                                <MoreVertical size={16} className="text-slate-300" />
                            </div>

                            {/* Column Body */}
                            <div className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {getColumnPatients(column.id).map((patient) => (
                                        <motion.div
                                            key={patient.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="bg-white dark:bg-[#0a0f1d] p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-xl group hover:scale-[1.02] transition-all cursor-grab active:cursor-grabbing"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-black text-lg text-slate-900 dark:text-white italic">{patient.name}</h4>
                                                        {patient.priority && (
                                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{patient.procedure}</p>
                                                </div>
                                                <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all">
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50 dark:border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
                                                        <Users size={12} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-slate-500">{patient.doctor}</span>
                                                </div>
                                                <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${patient.waitTime > 30 ? 'text-red-500' : 'text-slate-400'}`}>
                                                    <Timer size={12} /> {patient.waitTime}m
                                                </div>
                                            </div>

                                            {/* Bottleneck Alert */}
                                            {patient.waitTime > 30 && column.id === 'WAITING' && (
                                                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-center gap-3">
                                                    <AlertCircle size={14} className="text-red-500" />
                                                    <p className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest italic leading-tight">Bottleneck detected: Delayed 12m+</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Empty State Suggestion */}
                                {getColumnPatients(column.id).length === 0 && (
                                    <div className="h-32 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[2rem] flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                                        Fulfillment Ready
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Analytical Footer */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col justify-between overflow-hidden relative group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6">Clinic Speed Index</h3>
                            <div className="flex items-end gap-10">
                                <div className="space-y-2">
                                    <div className="text-5xl font-black italic tracking-tighter">Fast <span className="text-blue-500">Live</span></div>
                                    <p className="text-xs font-medium text-slate-400 tracking-tight leading-relaxed max-w-sm italic">
                                        "Your average fulfillment time is 12% faster than last week. Suggesting opening 1 more hygiene chair for 11:30 AM surge."
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                                    <ArrowUpRight size={24} />
                                    <span className="text-3xl font-black italic">+12%</span>
                                </div>
                            </div>
                        </div>
                        <Activity className="absolute bottom-[-30px] right-[-30px] opacity-10 scale-150 rotate-[-15deg]" size={200} />
                    </div>

                    <div className="bg-white dark:bg-[#0a0f1d] p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl flex flex-col justify-center gap-6">
                        <div className="flex items-center gap-3">
                            <Zap className="text-yellow-500" />
                            <h4 className="font-black italic text-lg uppercase tracking-tighter dark:text-white">Smart Restack</h4>
                        </div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">
                            Move 'Anand S.' to 'Vitals' manually? The nurse station is currently idle.
                        </p>
                        <button className="w-full py-4 bg-slate-900 dark:bg-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all">
                            Optimize Queue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
