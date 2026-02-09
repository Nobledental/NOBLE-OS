"use client";

import { PanzeCard } from "@/components/ui/panze-card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, UserCheck, Star, Clock, FileText, CheckCircle2, ChevronRight, Award } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ACTIVITIES = [
    { id: 1, staff: "Dr. Dhivakaran", action: "Completed Root Canal", time: "10:30 AM", points: 40 },
    { id: 2, staff: "Sarah M.", action: "Settled Bill #8021", time: "11:15 AM", points: 15 },
    { id: 3, staff: "Dr. Dhivakaran", action: "Approved Lab Report", time: "12:00 PM", points: 20 },
    { id: 4, staff: "Arun K.", action: "Sterilized Operatory 2", time: "12:30 PM", points: 10 },
];

export function PerformanceScorecard() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Top Stats */}
            <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PanzeCard className="bg-indigo-600 text-white border-0 shadow-xl shadow-indigo-100">
                        <div className="flex justify-between items-start mb-4">
                            <Star className="w-5 h-5 fill-white" />
                            <Badge className="bg-white/20 text-white border-0">+12%</Badge>
                        </div>
                        <h4 className="text-white/70 text-xs font-bold uppercase tracking-widest">Efficiency</h4>
                        <div className="text-4xl font-black mt-1">94%</div>
                    </PanzeCard>

                    <PanzeCard>
                        <div className="flex justify-between items-start mb-4">
                            <UserCheck className="w-5 h-5 text-green-500" />
                            <Badge variant="outline" className="text-green-600 border-green-100">ON TIME</Badge>
                        </div>
                        <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Attendance</h4>
                        <div className="text-4xl font-black text-slate-900 mt-1">100%</div>
                    </PanzeCard>

                    <PanzeCard>
                        <div className="flex justify-between items-start mb-4">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                        </div>
                        <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Case Load</h4>
                        <div className="text-4xl font-black text-slate-900 mt-1">42</div>
                    </PanzeCard>
                </div>

                <PanzeCard title="Live Activity Feed">
                    <div className="space-y-6">
                        {ACTIVITIES.map((act, i) => (
                            <motion.div
                                key={act.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">{act.action}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            {act.staff} • {act.time}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-xs font-black text-green-500">+{act.points} pts</div>
                                    <ChevronRight className="w-4 h-4 text-slate-200" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </PanzeCard>
            </div>

            {/* Right: Automated Report Card */}
            <div className="lg:col-span-4">
                <PanzeCard className="bg-slate-900 text-white border-0 sticky top-8">
                    <div className="text-center py-6 border-b border-white/10 mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto flex items-center justify-center mb-4 border-4 border-white/10 shadow-2xl">
                            <Award className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-black">Performance Audit</h3>
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mt-1">Feb 2026 Summary</p>
                    </div>

                    <div className="space-y-6 px-2">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
                                <span>Patient Satisfaction</span>
                                <span>4.8 / 5.0</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "96%" }}
                                    className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
                                <span>Documentation Accuracy</span>
                                <span>92%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "92%" }}
                                    className="h-full bg-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
                                <span>Punctuality</span>
                                <span>100%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    className="h-full bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
                        <button className="w-full h-12 rounded-2xl bg-white text-slate-900 font-black text-sm hover:scale-[1.02] transition-transform">
                            GENERATE MONTHLY PDF
                        </button>
                        <button className="w-full h-12 rounded-2xl bg-slate-800 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors">
                            VIEW FULL LOGS
                        </button>
                    </div>
                </PanzeCard>
            </div>
        </div>
    );
}
