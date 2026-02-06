"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import { MapPin, Battery, Clock, LogOut, Coffee, Zap, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Clinic Location (Mocked)
const CLINIC_LOC = {
    lat: 12.9716, // Bangalore
    lng: 77.5946,
    radius: 0.5 // km
};

export function AttendanceHub() {
    const [status, setStatus] = useState<'OFFLINE' | 'IN_CLINIC' | 'BREAK' | 'OUT_OF_BOUNDS'>('OFFLINE');
    const [battery, setBattery] = useState<number | null>(null);
    const [heartbeatTime, setHeartbeatTime] = useState<number>(20); // Minutes
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [punchHistory, setPunchHistory] = useState<{ time: string, type: string }[]>([]);

    // Simulate Battery tracking
    useEffect(() => {
        const fetchBattery = async () => {
            if ('getBattery' in navigator) {
                const nav: any = navigator;
                const batt = await nav.getBattery();
                setBattery(Math.round(batt.level * 100));

                // Adjust heartbeat based on power
                if (batt.level < 0.1) {
                    setHeartbeatTime(45); // Relax tracking if < 10%
                    toast.warning("Low Power Mode", {
                        description: "Tracking frequency reduced to save energy."
                    });
                }
            }
        };
        fetchBattery();
    }, []);

    // Heartbeat Logic
    useEffect(() => {
        if (status === 'IN_CLINIC') {
            const interval = setInterval(() => {
                console.log(`[GEO-HEARTBEAT] Reporting at ${new Date().toLocaleTimeString()}...`);
                // In a real app, this would send lat/lng to the server
                checkLocation();
            }, heartbeatTime * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [status, heartbeatTime]);

    const checkLocation = () => {
        if (!navigator.geolocation) {
            setStatus('OFFLINE');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation({ lat: latitude, lng: longitude });
                // Simple distance check mockup
                const dist = Math.sqrt(Math.pow(latitude - CLINIC_LOC.lat, 2) + Math.pow(longitude - CLINIC_LOC.lng, 2));
                if (dist > CLINIC_LOC.radius) {
                    setStatus('OUT_OF_BOUNDS');
                    toast.error("Out of Bounds", {
                        description: "You have moved away from the clinic location. Logged out."
                    });
                }
            },
            () => {
                setStatus('OFFLINE');
                toast.error("Location Required", {
                    description: "Attendance requires active location monitoring."
                });
            }
        );
    };

    const handlePunchIn = () => {
        checkLocation();
        setStatus('IN_CLINIC');
        setPunchHistory([{ time: new Date().toLocaleTimeString(), type: 'IN' }, ...punchHistory]);
        toast.success("Good Morning!", { description: "Punched in successfully." });
    };

    const handlePunchOut = () => {
        setStatus('OFFLINE');
        setPunchHistory([{ time: new Date().toLocaleTimeString(), type: 'OUT' }, ...punchHistory]);
        toast.info("Logged Out", { description: "See you later!" });
    };

    return (
        <div className="space-y-6">
            <PanzeCard className="bg-slate-900 border-0 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <MapPin className="w-40 h-40 scale-150 rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-3 h-3 rounded-full animate-pulse",
                                status === 'IN_CLINIC' ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" :
                                    status === 'OFFLINE' ? "bg-slate-500" : "bg-orange-500"
                            )} />
                            <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                                Current Status: {status.replace('_', ' ')}
                            </span>
                        </div>

                        <h2 className="text-5xl font-black tracking-tight">
                            {status === 'IN_CLINIC' ? "On Duty" : "Offline"}
                        </h2>

                        <div className="flex items-center gap-6 text-slate-400">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">Shift: 09:00 - 18:00</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Battery className={cn("w-4 h-4", battery && battery < 10 ? "text-red-500" : "text-slate-400")} />
                                <span className="text-sm font-medium">{battery}% Energy</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        {status === 'OFFLINE' ? (
                            <Button
                                onClick={handlePunchIn}
                                className="h-16 px-10 rounded-3xl bg-white text-slate-900 hover:bg-slate-50 text-lg font-black"
                            >
                                <Zap className="w-5 h-5 mr-3 fill-indigo-500 text-indigo-500" />
                                PUNCH IN
                            </Button>
                        ) : (
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setStatus(status === 'BREAK' ? 'IN_CLINIC' : 'BREAK')}
                                    className="h-16 flex-1 rounded-3xl bg-slate-800 text-white border-white/10 border hover:bg-slate-700 font-bold"
                                >
                                    <Coffee className="w-5 h-5 mr-2" />
                                    {status === 'BREAK' ? 'END BREAK' : 'BREAK'}
                                </Button>
                                <Button
                                    onClick={handlePunchOut}
                                    variant="destructive"
                                    className="h-16 w-16 rounded-3xl flex items-center justify-center p-0"
                                >
                                    <LogOut className="w-6 h-6" />
                                </Button>
                            </div>
                        )}
                        <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">
                            Syncing: Every {heartbeatTime} Min
                        </p>
                    </div>
                </div>
            </PanzeCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PanzeCard title="Location History">
                    <div className="h-[200px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
                        <UserX className="w-10 h-10 mb-2 opacity-20" />
                        <p className="text-sm">Real-time GPS plotting active</p>
                    </div>
                </PanzeCard>

                <PanzeCard title="Recent Activity">
                    <div className="space-y-4">
                        {punchHistory.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-10 italic">No logs for today yet.</p>
                        )}
                        {punchHistory.map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-xl",
                                        log.type === 'IN' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                    )}>
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Shift {log.type}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Normal Entry</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-slate-900">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </PanzeCard>
            </div>
        </div>
    );
}
