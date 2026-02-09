"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Clock,
    ShieldCheck,
    AlertCircle,
    ArrowRightLeft,
    Hand,
    CheckCircle2,
    Calendar,
    Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function SmartPunchSystem() {
    const [status, setStatus] = useState<"OUT" | "IN" | "BREAK">("OUT");
    const [isWithinFence, setIsWithinFence] = useState<boolean | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [logs, setLogs] = useState<{ type: string, time: string, location: string }[]>([]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        // Simulate geofencing check
        const checkLocation = () => {
            const inside = Math.random() > 0.2; // 80% chance of being "inside" for demo
            setIsWithinFence(inside);
        };

        checkLocation();
        return () => clearInterval(timer);
    }, []);

    const handlePunch = (type: "IN" | "OUT" | "BREAK") => {
        if (type === "IN" && !isWithinFence) {
            toast.error("Proximity Error: You must be at the clinic to Punch In.");
            return;
        }

        const newLog = {
            type,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: isWithinFence ? "Clinic (Primary)" : "Remote / Unknown"
        };

        setLogs([newLog, ...logs]);
        setStatus(type);
        toast.success(`${type === 'IN' ? 'Clocked In' : type === 'BREAK' ? 'Break Started' : 'Clocked Out'} successfully.`);
    };

    return (
        <div className="space-y-10 max-w-4xl mx-auto p-4 md:p-8">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200">
                    <div className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        isWithinFence ? "bg-emerald-500" : "bg-rose-500"
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                        {isWithinFence ? "Inside Geofence" : "Outside Clinic Perimeter"}
                    </span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter text-slate-900">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                    {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Punch In */}
                <button
                    disabled={status === "IN"}
                    onClick={() => handlePunch("IN")}
                    className={cn(
                        "relative h-64 rounded-[3rem] transition-all overflow-hidden flex flex-col items-center justify-center gap-6",
                        status === "IN" ? "bg-emerald-500 text-white shadow-2xl shadow-emerald-200" : "bg-white border-2 border-slate-50 hover:border-emerald-500/30 hover:shadow-xl group"
                    )}
                >
                    <div className={cn(
                        "w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all",
                        status === "IN" ? "bg-white/20" : "bg-emerald-50 group-hover:bg-emerald-100/50"
                    )}>
                        <ShieldCheck className={cn("w-10 h-10", status === "IN" ? "text-white" : "text-emerald-500")} />
                    </div>
                    <div className="text-center space-y-1">
                        <h4 className="font-black text-xl uppercase tracking-tighter">Clock In</h4>
                        <p className={cn("text-[9px] font-bold uppercase tracking-widest opacity-60", status === "IN" ? "text-white" : "text-slate-400")}>Start Session</p>
                    </div>
                    {status === "IN" && (
                        <motion.div
                            layoutId="indicator"
                            className="absolute bottom-6 w-2 h-2 rounded-full bg-white animate-pulse"
                        />
                    )}
                </button>

                {/* On Break */}
                <button
                    disabled={status === "OUT" || status === "BREAK"}
                    onClick={() => handlePunch("BREAK")}
                    className={cn(
                        "relative h-64 rounded-[3rem] transition-all overflow-hidden flex flex-col items-center justify-center gap-6",
                        status === "BREAK" ? "bg-amber-500 text-white shadow-2xl shadow-amber-200" : "bg-white border-2 border-slate-50 hover:border-amber-500/30 hover:shadow-xl group"
                    )}
                >
                    <div className={cn(
                        "w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all",
                        status === "BREAK" ? "bg-white/20" : "bg-amber-50 group-hover:bg-amber-100/50"
                    )}>
                        <Clock className={cn("w-10 h-10", status === "BREAK" ? "text-white" : "text-amber-500")} />
                    </div>
                    <div className="text-center space-y-1">
                        <h4 className="font-black text-xl uppercase tracking-tighter">Break</h4>
                        <p className={cn("text-[9px] font-bold uppercase tracking-widest opacity-60", status === "BREAK" ? "text-white" : "text-slate-400")}>Pause Work</p>
                    </div>
                    {status === "BREAK" && (
                        <motion.div
                            layoutId="indicator"
                            className="absolute bottom-6 w-2 h-2 rounded-full bg-white animate-pulse"
                        />
                    )}
                </button>

                {/* Clock Out */}
                <button
                    disabled={status === "OUT"}
                    onClick={() => handlePunch("OUT")}
                    className={cn(
                        "relative h-64 rounded-[3rem] transition-all overflow-hidden flex flex-col items-center justify-center gap-6",
                        "bg-white border-2 border-slate-50 hover:border-slate-900/30 hover:shadow-xl group"
                    )}
                >
                    <div className="w-20 h-20 rounded-[2rem] bg-slate-50 group-hover:bg-slate-100/50 flex items-center justify-center transition-all">
                        <ArrowRightLeft className="w-10 h-10 text-slate-400 group-hover:text-slate-900" />
                    </div>
                    <div className="text-center space-y-1">
                        <h4 className="font-black text-xl uppercase tracking-tighter">Clock Out</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">End Shift</p>
                    </div>
                    {status === "OUT" && (
                        <motion.div
                            layoutId="indicator"
                            className="absolute bottom-6 w-2 h-2 rounded-full bg-slate-300 animate-pulse"
                        />
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Recent Activity */}
                <Card className="lg:col-span-8 p-8 rounded-[3rem] border-slate-100 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Attendance Log</h3>
                        <Badge variant="outline" className="rounded-full text-[8px] font-black uppercase tracking-widest">Today</Badge>
                    </div>

                    <div className="space-y-4">
                        {logs.length > 0 ? logs.map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                                        log.type === 'IN' ? 'bg-emerald-500 text-white' : log.type === 'BREAK' ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'
                                    )}>
                                        {log.type === 'IN' ? <CheckCircle2 className="w-5 h-5" /> : log.type === 'BREAK' ? <Clock className="w-5 h-5" /> : <ArrowRightLeft className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black tracking-tight">{log.type === 'IN' ? 'Clocked In' : log.type === 'BREAK' ? 'Break' : 'Clocked Out'}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-indigo-400" /> {log.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900">{log.time}</p>
                                    <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Verified</p>
                                </div>
                            </div>
                        )) : (
                            <div className="h-32 flex flex-col items-center justify-center text-center opacity-20">
                                <Activity className="w-8 h-8 mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No activity recorded today</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Scorecard */}
                <Card className="lg:col-span-4 p-8 rounded-[3rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-200">
                    <div className="space-y-8">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                            <Activity className="w-8 h-8 text-indigo-100" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-2xl font-black tracking-tighter">Punctuality Score</h4>
                            <p className="text-4xl font-black tracking-tighter">94%</p>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Hours this month</span>
                                <span className="text-sm font-black">164h</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Avg. Punch In</span>
                                <span className="text-sm font-black">09:12 AM</span>
                            </div>
                        </div>
                        <Button className="w-full h-12 rounded-xl bg-white text-indigo-600 font-black uppercase tracking-widest text-[9px] hover:bg-slate-50 gap-2">
                            Full Report <ArrowRightLeft className="w-3 h-3 rotate-45" />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
