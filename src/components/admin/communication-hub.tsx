'use client';

import { useState } from 'react';
import {
    Phone,
    PhoneMissed,
    PhoneIncoming,
    MessageSquare,
    Clock,
    Users,
    AlertTriangle,
    ArrowRight,
    BarChart2,
    History,
    Globe,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function CommunicationHub() {
    const [filter, setFilter] = useState<'all' | 'missed' | 'pending'>('all');

    // Simulated Lead Data State
    const [leads, setLeads] = useState([
        { id: 1, name: "Arun Kumar", time: "2 mins ago", type: "Missed Call", status: "Critical", urgent: true },
        { id: 2, name: "Priya S.", time: "15 mins ago", type: "WhatsApp Inq", status: "Pending", urgent: false },
        { id: 3, name: "Deepak R.", time: "1 hour ago", type: "Website Lead", status: "Contacted", urgent: false },
        { id: 4, name: "Meena K.", time: "3 hours ago", type: "Incoming Call", status: "Missed", urgent: true },
    ]);

    const handleRecover = (id: number, name: string) => {
        setLeads(prev => prev.map(lead =>
            lead.id === id ? { ...lead, status: 'Recovered', urgent: false } : lead
        ));
        toast.success(`Lead Recovered: ${name}`, {
            description: "Patient notified via WhatsApp template."
        });
    };

    const stats = [
        { label: 'Avg Response Time', value: '4.2m', icon: Clock, color: 'text-blue-600' },
        { label: 'Missed Leads', value: leads.filter(l => l.status === 'Critical' || l.status === 'Missed').length.toString(), icon: PhoneMissed, color: 'text-red-500' },
        { label: 'Active Channels', value: '4', icon: PhoneIncoming, color: 'text-emerald-500' },
        { label: 'Conversion Rate', value: '62%', icon: BarChart2, color: 'text-purple-600' },
    ];

    const filteredLeads = leads.filter(lead => {
        if (filter === 'all') return true;
        if (filter === 'missed') return lead.status === 'Missed' || lead.status === 'Critical';
        if (filter === 'pending') return lead.status === 'Pending';
        return true;
    });

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                            <History size={14} className="animate-spin-slow" /> Communication Intelligence
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">Lead Command</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Real-time response tracking and lead recovery engine.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white p-1 rounded-2xl border border-slate-200 flex gap-1 shadow-xl">
                            {['all', 'missed', 'pending'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f as any)}
                                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center gap-6 group">
                            <div className={`p-4 rounded-2xl bg-slate-50 ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Live Lead Queue */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h3 className="font-black uppercase tracking-tighter text-xl text-slate-900">Active Lead Queue</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority tracking for clinic reception</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-50">
                                <AnimatePresence mode="popLayout">
                                    {filteredLeads.map((lead) => (
                                        <motion.div
                                            key={lead.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className={`p-4 rounded-2xl ${lead.urgent ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-400'
                                                    } ${lead.status === 'Recovered' ? 'bg-emerald-50 text-emerald-600' : ''}`}>
                                                    {lead.status === 'Recovered' ? <CheckCircle2 size={20} /> : (lead.type.includes('Call') ? <Phone size={20} /> : <MessageSquare size={20} />)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h4 className={`font-black text-lg ${lead.status === 'Recovered' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{lead.name}</h4>
                                                        {lead.urgent && (
                                                            <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-lg text-[8px] font-black uppercase tracking-widest">Critical Response</span>
                                                        )}
                                                        {lead.status === 'Recovered' && (
                                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest">Recovered</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                        <span>{lead.type}</span>
                                                        <span>•</span>
                                                        <span>{lead.time}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                {lead.status !== 'Recovered' && (
                                                    <button
                                                        onClick={() => handleRecover(lead.id, lead.name)}
                                                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg hover:shadow-slate-500/20"
                                                    >
                                                        Recover Lead
                                                    </button>
                                                )}
                                                <button className="p-3 hover:bg-slate-100 rounded-xl text-slate-300 transition-colors">
                                                    <ArrowRight size={20} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {filteredLeads.length === 0 && (
                                        <div className="p-12 text-center text-slate-400 font-medium">
                                            No leads found in this category.
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Channel Intelligence Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-6 relative z-10">Receptionist Efficiency</h3>
                            <div className="space-y-6 relative z-10">
                                {[
                                    { label: 'Response Rate', value: 88, color: 'bg-emerald-500' },
                                    { label: 'Call Pick-up Rate', value: 94, color: 'bg-blue-500' },
                                    { label: 'Follow-up Health', value: 72, color: 'bg-amber-500' },
                                ].map((stat, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                                            <span>{stat.label}</span>
                                            <span>{stat.value}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stat.value}%` }}
                                                className={`h-full ${stat.color}`}
                                            ></motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10 pt-10 border-t border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Lead Sources</p>
                                <div className="flex gap-4">
                                    <Globe className="opacity-40" />
                                    <PhoneIncoming className="opacity-40" />
                                    <Users className="opacity-40" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                            <div className="flex items-center gap-3 mb-6">
                                <AlertTriangle className="text-amber-500" />
                                <h3 className="font-black text-lg text-slate-900 uppercase tracking-tighter">Communication Alerts</h3>
                            </div>
                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                                <p className="text-xs font-bold text-amber-700 leading-relaxed">
                                    "Lead #4 (Meena K.) has been missed twice today. Consider prioritizing this lead in the next 10 minutes to maintain clinical authority."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
