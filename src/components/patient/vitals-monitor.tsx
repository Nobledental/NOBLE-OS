"use client";

import { motion } from "framer-motion";
import { Activity, Heart, Droplets, Thermometer, Wind, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface VitalsMonitorProps {
    className?: string;
}

export function VitalsMonitor({ className }: VitalsMonitorProps) {
    // Mock Data (In production, fetch from Wearable API or Patient Record)
    const vitals = [
        {
            label: "Heart Rate",
            value: "72",
            unit: "BPM",
            icon: Heart,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
            trend: "+2%",
            status: "Normal",
            animation: { scale: [1, 1.1, 1] }
        },
        {
            label: "Blood Pressure",
            value: "120/80",
            unit: "mmHg",
            icon: Activity,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            trend: "Stable",
            status: "Optimal",
            animation: { opacity: [0.5, 1, 0.5] }
        },
        {
            label: "Blood Oxygen",
            value: "98",
            unit: "%",
            icon: Wind,
            color: "text-cyan-500",
            bg: "bg-cyan-500/10",
            trend: "Stable",
            status: "Excellent",
            animation: { rotate: [0, 360] }
        },
    ];

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
            {vitals.map((vital, i) => (
                <motion.div
                    key={i}
                    className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/10 p-6 flex flex-col justify-between group hover:border-white/20 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={cn("p-3 rounded-2xl", vital.bg)}>
                            <vital.icon
                                size={24}
                                className={cn(vital.color)}
                            />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                            <TrendingUp size={12} />
                            {vital.trend}
                        </div>
                    </div>

                    <div>
                        <div className="text-white/50 text-sm font-medium uppercase tracking-wider mb-1">
                            {vital.label}
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-bold text-white tracking-tighter">
                                {vital.value}
                            </h3>
                            <span className="text-sm text-white/40 font-medium">
                                {vital.unit}
                            </span>
                        </div>
                    </div>

                    {/* Simple Sparkline / Decoration */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/20 transition-all" />

                    {/* Pulse Effect for Heart Rate */}
                    {vital.label === "Heart Rate" && (
                        <motion.div
                            className="absolute top-6 right-6 w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        />
                    )}
                </motion.div>
            ))}
        </div>
    );
}
