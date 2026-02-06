'use client';

import React, { useState } from 'react';
import {
    Package,
    Zap,
    TrendingDown,
    AlertCircle,
    CheckCircle2,
    ShoppingCart,
    History,
    BarChart3,
    ArrowUpRight,
    Search,
    Filter,
    Activity,
    Box,
    Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SKU {
    id: string;
    name: string;
    category: string;
    stock: number;
    threshold: number;
    velocity: number; // units used per day
    daysLeft: number;
    status: 'OPTIMAL' | 'LOW' | 'CRITICAL';
}

const INITIAL_SKUS: SKU[] = [
    { id: '1', name: "Alginate (Fast Set)", category: "Consumables", stock: 12, threshold: 20, velocity: 4.2, daysLeft: 2, status: 'CRITICAL' },
    { id: '2', name: "Local Anesthesia (2%)", category: "Medications", stock: 85, threshold: 50, velocity: 12.5, daysLeft: 6, status: 'OPTIMAL' },
    { id: '3', name: "Nitrile Gloves (M)", category: "PPE", stock: 210, threshold: 100, velocity: 35, daysLeft: 3, status: 'LOW' },
    { id: '4', name: "Impression Trays (L)", category: "Consumables", stock: 18, threshold: 10, velocity: 1.2, daysLeft: 15, status: 'OPTIMAL' },
];

export default function InstaPharmacyHub() {
    const [skus, setSkus] = useState<SKU[]>(INITIAL_SKUS);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-[#0a0f1d] p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-4">
                            <Box size={14} className="animate-pulse" /> Quick-Commerce Inventory
                        </div>
                        <h1 className="text-4xl font-black tracking-tight italic text-slate-900 dark:text-white">Insta-Pharmacy Hub</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Hyper-efficient material tracking with dark-store SKU velocity logic.</p>
                    </div>

                    <div className="relative z-10 flex gap-4">
                        <button className="px-8 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/10 flex items-center gap-3">
                            <ShoppingCart size={18} /> Restock All Lows
                        </button>
                    </div>
                </div>

                {/* SKU Tracker Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Inventory Insights Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6 relative z-10">Stock Velocity</h3>
                            <div className="space-y-6 relative z-10">
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black uppercase text-slate-400">Restock Efficiency</span>
                                        <span className="text-emerald-400 text-xs font-black">+22%</span>
                                    </div>
                                    <div className="text-3xl font-black italic">JIT Active</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                        <span>Consumable Burn rate</span>
                                        <span>84%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="h-full bg-blue-500"></motion.div>
                                    </div>
                                </div>
                            </div>
                            <Activity className="absolute bottom-[-20px] right-[-20px] opacity-10 group-hover:scale-110 transition-transform" size={120} />
                        </div>

                        <div className="bg-white dark:bg-[#0a0f1d] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <Truck className="text-blue-600" />
                                <h3 className="font-black italic text-lg uppercase tracking-tighter dark:text-white">Live Intake</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { msg: "Delivery arriving in 15 mins (MedPlus)", time: "Now" },
                                    { msg: "Batch #4421 quality verified", time: "2h ago" },
                                ].map((log, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex justify-between items-center">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{log.msg}</p>
                                        <span className="text-[8px] font-black text-blue-600">{log.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SKU Leaderboard */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-[#0a0f1d] rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden">
                            <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex justify-between items-center">
                                <div>
                                    <h3 className="font-black italic uppercase tracking-tighter text-xl dark:text-white">Material SKU Tracking</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time stock velocity monitoring</p>
                                </div>
                                <Search className="text-slate-300" size={20} />
                            </div>

                            <div className="p-0">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 border-b border-slate-50 dark:border-white/5">
                                            <th className="px-8 py-5">Material SKU</th>
                                            <th className="px-8 py-5">Live Stock</th>
                                            <th className="px-8 py-5">Burn Velocity</th>
                                            <th className="px-8 py-5 text-right">Health</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                                        {skus.map((sku) => (
                                            <tr key={sku.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div>
                                                        <div className="font-black text-slate-900 dark:text-white text-sm italic">{sku.name}</div>
                                                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{sku.category}</div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 font-black text-slate-900 dark:text-white">
                                                    {sku.stock} <span className="text-[10px] text-slate-400 font-bold uppercase">Units</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <TrendingDown size={14} className="text-amber-500" />
                                                        <span className="text-[10px] font-black text-slate-600 dark:text-slate-400">{sku.velocity}/day</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${sku.status === 'CRITICAL' ? 'bg-red-100 text-red-600' :
                                                                sku.status === 'LOW' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                                                            }`}>
                                                            {sku.daysLeft} Days Left
                                                        </span>
                                                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">Restock Predicted</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-900 rounded-[2rem] flex items-center justify-between text-white border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                    <Zap size={20} className="text-yellow-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-black italic">Auto-Procurement Suggestion</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Powered by Blinkit Logic</div>
                                </div>
                            </div>
                            <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                                Approve 4 Restocks
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
