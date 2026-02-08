"use client";

import { motion } from "framer-motion";
import { Plus, MoreVertical, Folder, Clock, Calendar, Search, Users, Activity, Wallet, TrendingUp, BarChart3, ScrollText, ArrowLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface OperationsSummaryGlassProps {
    activeFilter: string;
    revenue: string;
    patients: string;
    utilization: string;
    sentiment?: string;
}

export function OperationsSummaryGlass({
    activeFilter,
    revenue,
    patients,
    utilization,
    sentiment = "Analysis of current flow shows practice growth holding strong."
}: OperationsSummaryGlassProps) {
    return (
        <div className="relative w-full max-w-6xl mx-auto p-10 rounded-[4rem] bg-slate-50/50 backdrop-blur-2xl border border-white/80 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Background Decorative Glows */}
            <div className="absolute -inset-0 overflow-hidden rounded-[4rem] pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-20 -right-40 w-80 h-80 bg-purple-400/20 blur-[120px] rounded-full animate-pulse delay-700" />
                <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-400/20 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Column 1 & 2: Header & Main KPIs */}
                <div className="md:col-span-3 space-y-8">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 leading-none">Management Dashboard</span>
                            <h2 className="text-4xl font-bold tracking-tight text-slate-900 mt-2">
                                Operations <span className="text-blue-600">Summary</span>
                            </h2>
                        </div>
                        <Badge variant="outline" className="bg-white/80 border-slate-200 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm">
                            {activeFilter} REVIEW
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Utilization Pill */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white/90 backdrop-blur-md border border-white px-8 py-7 rounded-[2.5rem] flex flex-col justify-between shadow-xl"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Activity className="w-4 h-4 text-blue-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Utilization</span>
                            </div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{utilization}</div>
                            <div className="text-[10px] text-blue-500 font-bold mt-4 uppercase">Clinical Floor Optimized</div>
                        </motion.div>

                        {/* Net Revenue Pill */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-2 bg-gradient-to-br from-white to-slate-50 border border-white px-10 py-7 rounded-[2.5rem] flex flex-col justify-between shadow-xl relative overflow-hidden group"
                        >
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors" />
                            <div className="flex items-center gap-2 mb-4">
                                <Wallet className="w-4 h-4 text-slate-900" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Net Revenue</span>
                            </div>
                            <div className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{revenue}</div>
                            <div className="flex items-center gap-2 mt-4">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[10px] text-emerald-600 font-bold uppercase">+8.2% vs previous period</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Patients Treated (Bento Style Mosaic) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative h-[240px] rounded-[3.5rem] overflow-hidden bg-white border border-white shadow-2xl flex"
                    >
                        <div className="w-1/2 p-10 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Users className="w-4 h-4 text-purple-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Patients Treated</span>
                                </div>
                                <div className="text-6xl font-black tracking-tighter text-slate-900">{patients}</div>
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium">Flow steady across all units</div>
                        </div>
                        <div className="w-1/2 bg-slate-50/50 backdrop-blur-sm border-l border-slate-100 p-10 flex flex-col justify-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-50">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <div className="text-xs font-black text-slate-900 uppercase tracking-tight">Avg Wait Time</div>
                                    <div className="text-xl font-black text-slate-900 tracking-tighter">14 <span className="text-[10px] text-slate-400">MINS</span></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-50">
                                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <div className="text-xs font-black text-slate-900 uppercase tracking-tight">Peak Flow Hour</div>
                                    <div className="text-xl font-black text-slate-900 tracking-tighter">11:30 <span className="text-[10px] text-slate-400">AM</span></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Column 3: Intelligence Core */}
                <div className="flex flex-col gap-8">
                    {/* Profile & Settings (Top Right) */}
                    <div className="flex justify-end items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="w-12 h-12 rounded-2xl bg-white border border-white shadow-sm hover:shadow-md transition-all p-0 text-slate-400">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="w-12 h-12 bg-white border border-white rounded-2xl flex items-center justify-center shadow-sm p-1">
                            <Avatar className="w-full h-full rounded-xl">
                                <AvatarImage src="https://ui-avatars.com/api/?name=Admin&background=05060f&color=fff" />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    {/* Intelligence Core Glass Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="flex-1 bg-white/90 backdrop-blur-md border border-white rounded-[3.5rem] p-8 shadow-2xl flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-900/10">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Intelligence Core</h3>
                        </div>

                        <div className="space-y-8 mt-auto">
                            <div className="bg-slate-50/80 rounded-[2.5rem] p-6 border border-white shadow-inner">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-900">Growth Catalyst</div>
                                        <div className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">3:1 New vs Returning</div>
                                    </div>
                                </div>
                                <p className="text-[12px] text-slate-600 font-medium leading-relaxed italic">
                                    "{sentiment}"
                                </p>
                            </div>

                            <Button variant="ghost" className="w-full h-14 rounded-3xl border-dashed border-2 border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 text-[9px] font-black uppercase tracking-[0.2em] gap-3">
                                <ScrollText className="w-4 h-4" /> Clinical Log Archive <ChevronRight className="w-3 h-3" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
