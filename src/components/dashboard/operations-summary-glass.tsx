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
    sentiment = "Analysis shows practice growth holding strong."
}: OperationsSummaryGlassProps) {
    return (
        <div className="relative w-full max-w-5xl mx-auto p-8 rounded-[4rem] bg-slate-50/50 backdrop-blur-2xl border border-white/80 shadow-[0_40px_1000px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Background Decorative Glows */}
            <div className="absolute -inset-0 overflow-hidden rounded-[4rem] pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-20 -right-40 w-80 h-80 bg-purple-400/20 blur-[120px] rounded-full animate-pulse delay-700" />
                <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-400/30 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 space-y-8">
                {/* Header Title Layer (Restored Content) */}
                <div className="flex justify-between items-end px-4">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 leading-none">Management Dashboard</span>
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 mt-2">
                            Operations <span className="text-blue-600">Summary</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                    {/* TOP ROW */}
                    <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                        {/* Utilization Pill */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/90 backdrop-blur-md border border-white px-8 py-5 rounded-[2.5rem] flex items-center justify-between shadow-sm"
                        >
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Utilization</span>
                                <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none mt-1">{utilization}</div>
                            </div>
                            <Activity className="w-5 h-5 text-blue-500 opacity-20" />
                        </motion.div>

                        {/* Action Primary Button */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 p-[1px] rounded-[2.5rem] shadow-xl shadow-blue-500/10"
                        >
                            <button className="w-full h-full bg-slate-900 rounded-[2.5rem] py-5 text-white font-black text-sm uppercase tracking-widest">
                                Clinical Log Archive
                            </button>
                        </motion.div>

                        {/* User Profile (Restored Content Layout) */}
                        <div className="flex justify-end gap-4 items-center">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase text-slate-900">Dr. Admin</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-right">{activeFilter} VIEW</span>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-14 h-14 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center shadow-lg p-0.5"
                            >
                                <Avatar className="w-full h-full rounded-[1.2rem]">
                                    <AvatarImage src="https://ui-avatars.com/api/?name=Admin&background=020617&color=fff" />
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                            </motion.div>
                        </div>
                    </div>

                    {/* MIDDLE ROW */}
                    <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Clock + Intelligence Quote */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="md:col-span-2 relative h-[300px] rounded-[3.5rem] overflow-hidden bg-white border border-white shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50" />
                            <div className="relative p-10 h-full flex flex-col justify-between">
                                <div className="text-[7.5rem] font-black tracking-tighter text-slate-900 leading-none">
                                    9:41 <span className="text-3xl font-black uppercase tracking-[0.2em] text-slate-400">AM</span>
                                </div>

                                {/* Floating Intelligence Box */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white/95 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-2xl max-w-sm"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Intelligence Core</span>
                                    </div>
                                    <p className="text-slate-900 font-bold text-sm leading-tight italic">
                                        "{sentiment}"
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Total Patients Treated Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white border border-white rounded-[3.5rem] p-10 shadow-xl flex flex-col justify-between group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Users className="w-7 h-7" />
                                </div>
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Floor Activity</span>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-2">Total Patients</h3>
                                <div className="text-6xl font-black text-slate-900 tracking-tighter mt-4">{patients}</div>
                                <div className="flex gap-4 mt-6 opacity-40">
                                    <div className="flex items-center gap-1.5">
                                        <Activity className="w-3.5 h-3.5 text-blue-500" />
                                        <span className="text-[10px] font-black uppercase">Active Flow</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* BOTTOM ROW */}
                    <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Growth Catalyst Box */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/90 border border-white rounded-[2.5rem] p-8 flex flex-col justify-center shadow-lg"
                        >
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Growth Catalyst</span>
                            <div className="text-2xl font-black text-slate-900 tracking-tighter leading-none">3:1</div>
                            <div className="text-[10px] font-bold text-emerald-600 uppercase mt-2">New vs Return</div>
                        </motion.div>

                        {/* Net Revenue Pill */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="md:col-span-3 bg-white/95 backdrop-blur-xl border border-white rounded-[3rem] p-10 shadow-xl flex items-center justify-between"
                        >
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shadow-inner">
                                    <Wallet className="w-8 h-8" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Total Net Revenue</span>
                                    <div className="text-5xl font-black text-slate-900 tracking-tighter mt-1">{revenue}</div>
                                </div>
                            </div>
                            <div className="hidden lg:flex flex-col items-end">
                                <div className="flex items-center gap-2 text-emerald-600">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase">+8.2%</span>
                                </div>
                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">vs previous {activeFilter.toLowerCase()}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
