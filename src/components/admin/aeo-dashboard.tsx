'use client';

import React, { useState } from 'react';
import {
    Zap,
    ShieldCheck,
    Globe,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Search,
    BrainCircuit,
    ArrowUpRight,
    Users,
    Sparkles,
    BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
const doctors = [
    { id: '1', name: 'Dr. Dhivakaran', specialty: 'Implantologist', image: '/docs/doc1.jpg', rating: 4.9 },
    { id: '2', name: 'Dr. Sarah K.', specialty: 'Pediatric Dentist', image: '/docs/doc2.jpg', rating: 4.8 },
    { id: '3', name: 'Dr. Rahul V.', specialty: 'Oral Surgeon', image: '/docs/doc3.jpg', rating: 4.7 }
];

export default function AEODashboard() {
    const [selectedMetric, setSelectedMetric] = useState<'authority' | 'trust' | 'readiness'>('authority');

    // Simulated AEO Data
    const overallScore = 88;
    const insightMessage = "Dr. Dhivakaran's profile is driving 40% of organic 'Implantologist' traffic. Update Dr. Sarah's certifications to boost 'Pediatric' authority.";

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                            <BrainCircuit size={14} className="animate-pulse" /> AI Engine Optimization
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">AEO Authority Index</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage clinical SEEAT (Search, Experience, Expertise, Authoritativeness, Trustworthiness).</p>
                    </div>

                    <div className="bg-white dark:bg-[#0a0f1d] p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 flex gap-1 shadow-2xl shadow-indigo-500/10">
                        {['authority', 'trust', 'readiness'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedMetric(tab as any)}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedMetric === tab
                                    ? 'bg-white text-slate-900 shadow-lg border border-slate-200'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Top Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20 group">
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-blue-100 font-bold text-xs uppercase tracking-widest mb-1">Clinic Authority Score</h3>
                                <div className="text-6xl font-black">{overallScore}<span className="text-2xl opacity-50 underline">/100</span></div>
                            </div>
                            <div className="flex items-center gap-4 mt-8">
                                <div className="flex -space-x-3">
                                    {doctors.slice(0, 4).map((d, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-500 bg-blue-100 overflow-hidden relative">
                                            <img src={d.image} alt="" className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs font-bold text-blue-100">Across {doctors.length} faculty members</p>
                            </div>
                        </div>
                        {/* Decorative Chart Background */}
                        <div className="absolute right-0 bottom-0 opacity-10 scale-150">
                            <TrendingUp size={200} />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0a0f1d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl w-fit">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900">96%</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Metadata Health</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between relative overflow-hidden group border border-slate-100">
                        <div className="p-3 bg-slate-100 text-slate-900 rounded-2xl w-fit">
                            <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-3xl font-black text-slate-900">4.2k</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">AEO Impressions</div>
                        </div>
                        <div className="absolute top-0 right-0 p-4">
                            <ArrowUpRight className="text-emerald-400" />
                        </div>
                    </div>
                </div>

                {/* Insights & Real-time Graph */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Insights Hub */}
                    <div className="lg:col-span-1 bg-white dark:bg-[#0a0f1d] rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl p-8 space-y-8">
                        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                            <Zap className="text-blue-600" />
                            <h3 className="font-black uppercase tracking-tighter text-lg text-slate-900">AEO Tactical Insights</h3>
                        </div>

                        <div className="space-y-4">
                            {[
                                { type: 'success', msg: "Google Gemini successfully extracted 'Implantology' expertise from clinic metadata.", icon: CheckCircle2, color: 'text-emerald-500' },
                                { type: 'warning', msg: insightMessage, icon: AlertCircle, color: 'text-amber-500' },
                                { type: 'info', msg: "Search volume for 'Aligners' increased by 15%. New landing page recommended.", icon: TrendingUp, color: 'text-blue-500' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <item.icon size={20} className={`${item.color} shrink-0`} />
                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{item.msg}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Member Authority Leaderboard */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#0a0f1d] rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                            <div>
                                <h3 className="font-black uppercase tracking-tighter text-xl text-slate-900">Faculty Trust Leaderboard</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authority scores based on SEEAT metrics</p>
                            </div>
                            <button className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 hover:opacity-75 tracking-widest">
                                <Search size={14} /> Global View
                            </button>
                        </div>

                        <div className="p-0 overflow-y-auto max-h-[400px]">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 border-b border-slate-50 dark:border-white/5">
                                        <th className="px-8 py-5">Expert</th>
                                        <th className="px-8 py-5">AEO Visibility</th>
                                        <th className="px-8 py-5">Trust Score</th>
                                        <th className="px-8 py-5 text-right">Trend</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                                    {doctors.map((doc) => (
                                        <tr key={doc.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 dark:border-white/10 shrink-0 relative shadow-sm">
                                                        <img src={doc.image} alt="" className="object-cover" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-sm">{doc.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doc.specialty}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.random() * 40 + 60}%` }}
                                                            className="h-full bg-blue-500"
                                                        ></motion.div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-blue-600">High</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 font-bold text-slate-900 dark:text-slate-300">
                                                {doc.rating || 4.9}<span className="text-amber-500">★</span>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 text-emerald-500 font-black text-[10px]">
                                                    <TrendingUp size={12} /> +12%
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
