'use client';

import React, { useState, useEffect } from 'react';
import {
    CloudLightning,
    HardDrive,
    RefreshCcw,
    Box,
    FileUp,
    Search,
    Monitor,
    CheckCircle2,
    AlertCircle,
    Share2,
    Settings,
    MoreHorizontal,
    BoxSelect,
    Cpu,
    Zap,
    MoveUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for Scanner Orchestration
type ScannerType = '3SHAPE_TRIOS' | 'MEDIT' | 'ITERO' | 'DEXIS';
type SyncStatus = 'SYNCING' | 'IDLE' | 'ERROR' | 'PENDING';

interface ScannerDevice {
    id: string;
    name: string;
    type: ScannerType;
    lastSync: string;
    folderPath: string;
    status: SyncStatus;
}

export default function UniversalBridgeHub() {
    const [devices, setDevices] = useState<ScannerDevice[]>([
        { id: '1', name: 'TRIOS 5 - Chair 1', type: '3SHAPE_TRIOS', lastSync: '2 mins ago', folderPath: 'C:/3Shape/Cases', status: 'SYNCING' },
        { id: '2', name: 'Medit i700 - Lab', type: 'MEDIT', lastSync: '1 hour ago', folderPath: 'C:/Medit/Export', status: 'IDLE' },
        { id: '3', name: 'iTero Element - Chair 2', type: 'ITERO', lastSync: 'Yesterday', folderPath: 'D:/Itero/Scans', status: 'ERROR' },
    ]);

    const [activeScan, setActiveScan] = useState<string | null>('Patient: Anand S. | Upper Jaw | STL');

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-8 font-sans selection:bg-blue-500/30">
            <div className="max-w-[1600px] mx-auto space-y-10">

                {/* 1. HERO HEADER: The Universal Teleporter */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white dark:bg-[#0a0f1d] p-12 rounded-[4rem] border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4">
                            <CloudLightning size={16} className="animate-pulse" /> Universal Bridge Hub
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter mb-4 text-slate-900 dark:text-white leading-none">
                            Scanner Orchestration <br /> & Cloud Teleport
                        </h1>
                        <p className="text-sm font-medium text-slate-400 max-w-lg">
                            Fusing 3Shape, Medit, and iTero ecosystems into a single clinical pipeline. Auto-ingesting STLs from local hardware to the Noble Vault.
                        </p>
                    </div>

                    <div className="flex gap-4 relative z-10">
                        <button className="px-8 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/20">
                            Connect New Device
                        </button>
                        <button className="px-8 py-5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/5">
                            Settings
                        </button>
                    </div>

                    <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                    <Cpu className="absolute bottom-[-40px] right-[-40px] opacity-[0.03] scale-[4] rotate-12" />
                </div>

                {/* 2. LIVE DEVICE GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* DEVICE MONITOR */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {devices.map((device) => (
                                <motion.div
                                    key={device.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white dark:bg-[#0a0f1d] p-8 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl relative group overflow-hidden"
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-white/5 ${device.status === 'ERROR' ? 'text-red-500' : 'text-blue-500'}`}>
                                            <HardDrive size={24} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {device.status === 'SYNCING' && <RefreshCcw size={14} className="animate-spin text-blue-500" />}
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${device.status === 'SYNCING' ? 'text-blue-500' :
                                                device.status === 'ERROR' ? 'text-red-500' : 'text-emerald-500'
                                                }`}>
                                                {device.status}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black tracking-tighter mb-2 text-slate-900 dark:text-white uppercase">{device.name}</h3>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{device.type.replace('_', ' ')}</div>

                                    <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span>Local Folder</span>
                                            <span className="text-slate-600 dark:text-slate-300 font-mono">{device.folderPath}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span>Last Sync</span>
                                            <span className="text-slate-600 dark:text-slate-300">{device.lastSync}</span>
                                        </div>
                                    </div>

                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 duration-700"></div>
                                </motion.div>
                            ))}
                        </div>

                        {/* RECENT INGESTIONS */}
                        <div className="bg-white dark:bg-[#0a0f1d] p-10 rounded-[4rem] border border-slate-200 dark:border-white/5 shadow-2xl">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">Frictionless Ingestions</h2>
                                <FileUp className="text-blue-500" />
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-white/5">
                                            <th className="text-left pb-6">Patient</th>
                                            <th className="text-left pb-6">File Type</th>
                                            <th className="text-left pb-6">Source</th>
                                            <th className="text-left pb-6">Time</th>
                                            <th className="text-right pb-6">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {[
                                            { patient: 'Arun Kumar', type: 'STL (Upper)', source: 'TRIOS 5', time: '12:42 PM', status: 'Vaulted', ortho: 'Ready' },
                                            { patient: 'Priya V.', type: 'OBJ (Lower)', source: 'Medit i700', time: '11:15 AM', status: 'Vaulted', ortho: 'In-Queue' },
                                            { patient: 'Rahul S.', type: 'PLY (Full)', source: 'TRIOS 3', time: '09:30 AM', status: 'Processing', ortho: 'Calculating' },
                                        ].map((ingest, i) => (
                                            <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                                                <td className="py-6 text-sm font-black dark:text-white">{ingest.patient}</td>
                                                <td className="py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ingest.type}</td>
                                                <td className="py-6 text-[10px] font-bold text-blue-500 uppercase tracking-widest">{ingest.source}</td>
                                                <td className="py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ingest.time}</td>
                                                <td className="py-6">
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${ingest.status === 'Vaulted' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/20'
                                                            }`}>
                                                            {ingest.status}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <div className={`w-1 h-1 rounded-full ${ingest.ortho === 'Ready' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-300 animate-pulse'}`}></div>
                                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">AI Sim: {ingest.ortho}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* LIVE 3D PREVIEW (Simulation) */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group h-[600px] flex flex-col border border-white/5">
                            <div className="relative z-10 flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black uppercase tracking-tighter">Live Scan Preview</h3>
                                <Box className="text-blue-500 animate-pulse" />
                            </div>

                            {/* 3D VIEWPORT MOCKUP */}
                            <div className="flex-1 bg-black/40 rounded-[2.5rem] border border-white/10 relative overflow-hidden flex items-center justify-center p-12">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent)] flex items-center justify-center">
                                    {/* SIMULATED SCAN SVG */}
                                    <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] opacity-80">
                                        <path d="M40 120C40 164.183 75.8172 200 120 200C164.183 200 200 164.183 200 120C200 75.8172 164.183 40 120 40C75.8172 40 40 75.8172 40 120Z" stroke="#3B82F6" strokeWidth="2" strokeDasharray="10 5" />
                                        <path d="M60 120C60 153.137 86.8629 180 120 180C153.137 180 180 153.137 180 120C180 86.8629 153.137 60 120 60C86.8629 60 60 86.8629 60 120Z" stroke="#3B82F6" strokeWidth="4" />
                                        <circle cx="120" cy="120" r="10" fill="#3B82F6" className="animate-pulse" />
                                        <rect x="115" y="60" width="10" height="30" fill="#3B82F6" opacity="0.5" />
                                        <rect x="115" y="150" width="10" height="30" fill="#3B82F6" opacity="0.5" />
                                    </svg>
                                </div>
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
                                    <div className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all cursor-pointer"><BoxSelect size={18} /></div>
                                    <div className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all cursor-pointer text-blue-400 border border-blue-500/30"><MoveUpRight size={18} /></div>
                                    <div className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all cursor-pointer"><Settings size={18} /></div>
                                </div>
                                <div className="absolute top-10 left-10 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-400">STL Metadata</div>
                                    <div className="text-[9px] text-slate-400 mt-1">Triangles: 4.2M <br /> Accuracy: 4μm</div>
                                </div>
                            </div>

                            <div className="mt-8 relative z-10">
                                <h4 className="text-sm font-black tracking-tighter uppercase mb-2">{activeScan}</h4>
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Linked to Case #4421</div>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors">
                                        Open in Smile Studio <Share2 size={12} />
                                    </button>
                                </div>
                            </div>

                            <Zap className="absolute bottom-[-30px] left-[-30px] opacity-[0.05] scale-[3] rotate-[-15deg]" />
                        </div>
                    </div>

                </div>

                {/* 3. ECOSYSTEM ALERT: Inter-Module Intelligence */}
                <div className="bg-gradient-to-r from-blue-600/10 to-transparent p-10 rounded-[4rem] border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden backdrop-blur-sm">
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/40">
                            <Cpu className="text-white animate-pulse" size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">Predictive Orchestration</h3>
                            <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed max-w-xl">
                                "TRIOS Scan detected for Anand S. (Full Mouth Rehabilitation). <br />
                                Checking **Insta-PharmacyHub** for Implant inventory... <span className="text-emerald-500 font-bold">STOCK READY.</span> <br />
                                Updating **Surgical Pipeline** to 'Ready for Restoration' status automatically."
                            </p>
                        </div>
                    </div>
                    <button className="px-10 py-5 bg-white dark:bg-white/10 text-slate-900 dark:text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl relative z-10 border border-slate-200 dark:border-white/5">
                        Optimize Workflow
                    </button>
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_right,rgba(59,130,246,0.05),transparent)]"></div>
                </div>

            </div>
        </div>
    );
}
