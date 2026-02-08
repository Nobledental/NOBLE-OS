"use client";

import { motion } from "framer-motion";
import { Plus, MoreVertical, Folder, Clock, Calendar, Search, Users } from "lucide-react";
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
    sentiment = "Flow is optimizing, 3 new registrations verified."
}: OperationsSummaryGlassProps) {
    return (
        <div className="relative w-full max-w-5xl mx-auto p-8 rounded-[4rem] bg-slate-50/50 backdrop-blur-2xl border border-white/80 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Background Decorative Glows */}
            <div className="absolute -inset-0 overflow-hidden rounded-[4rem] pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-400/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-20 -right-40 w-80 h-80 bg-blue-400/20 blur-[120px] rounded-full animate-pulse delay-700" />
                <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-400/20 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Top Actions & Clock */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex gap-4 items-center">
                        {/* Utilization Pill */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/80 backdrop-blur-md border border-white px-8 py-6 rounded-[2.5rem] flex items-center gap-4 shadow-sm"
                        >
                            <div className="text-3xl font-black text-slate-900 tracking-tighter">{utilization} <span className="text-slate-400 font-bold tracking-normal text-xl">util</span></div>
                            <div className="flex flex-col text-slate-300">
                                <span className="h-2 leading-none">▲</span>
                                <span className="h-2 leading-none">▼</span>
                            </div>
                        </motion.div>

                        {/* Book a Call Button */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 p-[1px] rounded-[2.5rem] shadow-lg shadow-purple-500/20"
                        >
                            <button className="w-full h-full bg-white/10 backdrop-blur-md rounded-[2.5rem] py-6 text-white font-bold text-lg">
                                Book a Call
                            </button>
                        </motion.div>
                    </div>

                    {/* Large Clock Mosaic */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative h-[300px] rounded-[3.5rem] overflow-hidden bg-gradient-to-br from-orange-200/40 via-pink-200/40 to-blue-200/40 border border-white"
                    >
                        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                        <div className="relative p-10 h-full flex flex-col justify-between">
                            <div className="text-7xl font-black tracking-tighter text-white drop-shadow-sm flex items-baseline gap-2">
                                9:41 <span className="text-2xl font-bold uppercase tracking-widest opacity-80">AM</span>
                            </div>

                            <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-xl max-w-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-orange-500">☀️</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{activeFilter} Insight</span>
                                </div>
                                <p className="text-slate-900 font-medium leading-tight">
                                    {sentiment} <span className="opacity-60 italic">Go carpe diem :)</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Column 2: Profile & Files */}
                <div className="space-y-6">
                    {/* Profile Square */}
                    <div className="flex justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-24 h-24 bg-white border border-white rounded-[2rem] flex items-center justify-center shadow-xl p-2"
                        >
                            <Avatar className="w-full h-full rounded-[1.5rem]">
                                <AvatarImage src="https://ui-avatars.com/api/?name=Admin&background=05060f&color=fff" />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                        </motion.div>
                    </div>

                    {/* Happy Stats Square */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/90 backdrop-blur-md border border-white rounded-[3.5rem] p-8 shadow-xl min-h-[300px] flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <motion.div
                                whileHover={{ rotate: -10 }}
                                className="w-16 h-16 bg-gradient-to-br from-indigo-500/80 to-purple-600/80 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30"
                            >
                                <Users className="w-8 h-8 fill-white/20" />
                            </motion.div>
                            <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                <MoreVertical className="w-5 h-5 text-slate-300" />
                            </button>
                        </div>
                        <div className="mt-auto">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Patients Treated</span>
                            <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mt-1 mb-4">{patients}</h3>
                            <div className="flex gap-4 border-t border-slate-50 pt-4 overflow-x-auto no-scrollbar">
                                {[
                                    { icon: Folder, count: 88, color: "text-blue-500" },
                                    { icon: Calendar, count: 24, color: "text-pink-500" },
                                    { icon: Clock, count: 9, color: "text-purple-500" },
                                    { icon: Search, count: 89, color: "text-orange-500" }
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center gap-1.5 shrink-0">
                                        <stat.icon className={`w-3.5 h-3.5 ${stat.color} opacity-40`} />
                                        <span className="text-xs font-black text-slate-400">{stat.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Row */}
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Plus Square */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white border border-white rounded-[2.5rem] flex items-center justify-center shadow-lg min-h-[140px] group cursor-pointer"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl group-hover:bg-pink-500/20 transition-colors" />
                            <Plus className="w-10 h-10 text-slate-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-indigo-400 group-hover:to-pink-400 relative z-10" />
                        </div>
                    </motion.div>

                    {/* Revenue Pill */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="md:col-span-3 bg-white/90 backdrop-blur-md border border-white rounded-[2.5rem] p-8 shadow-xl flex items-center gap-6"
                    >
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 shrink-0">
                            ₹
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Net Revenue ({activeFilter})</span>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter mt-1">
                                {revenue}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
