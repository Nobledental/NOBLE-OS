"use client"

import React from "react"
import { cn } from "@/lib/utils"
import {
    Thermometer,
    Activity,
    Droplets,
    Wind,
    AlertCircle,
    Zap,
    HeartPulse
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

interface VitalCardProps {
    label: string
    value: string | number
    unit: string
    icon: React.ElementType
    status?: "normal" | "warning" | "risk"
    trend?: "up" | "down" | "stable"
}

function VitalCard({ label, value, unit, icon: Icon, status = "normal" }: VitalCardProps) {
    return (
        <div className={cn(
            "flex flex-col min-w-[120px] transition-all duration-500 group",
            status === "risk" && "relative"
        )}>
            <div className="flex items-center gap-2 mb-1">
                <Icon className={cn(
                    "h-3 w-3",
                    status === "risk" ? "text-rose-500 animate-pulse" : status === "warning" ? "text-amber-500" : "text-slate-400"
                )} />
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black leading-none">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className={cn(
                    "text-xl font-black tracking-tight transition-colors",
                    status === "risk" ? "text-rose-600" : "text-slate-900"
                )}>{value}</span>
                <span className="text-[10px] text-muted-foreground font-bold">{unit}</span>
            </div>

            {status === "risk" && (
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
        </div>
    )
}

export interface VitalsData {
    temp?: number;
    bp?: string;
    hr?: number;
    spo2?: number;
    rr?: number;
}

export function VitalsHUD({ data }: { data?: VitalsData }) {
    // Default values if no data provided
    const vitals = {
        temp: data?.temp || 98.6,
        bp_sys: parseInt(data?.bp?.split('/')[0] || "120"),
        bp_dia: parseInt(data?.bp?.split('/')[1] || "80"),
        hr: data?.hr || 72,
        spo2: data?.spo2 || 98,
        rr: data?.rr || 16
    }

    const getBPStatus = () => {
        if (vitals.bp_sys > 160 || vitals.bp_dia > 100) return "risk"
        if (vitals.bp_sys > 140 || vitals.bp_dia > 90) return "warning"
        return "normal"
    }

    const getSPO2Status = () => {
        if (vitals.spo2 < 93) return "risk"
        if (vitals.spo2 < 95) return "warning"
        return "normal"
    }

    return (
        <GlassCard className="mx-4 my-2 px-6 py-4 flex items-center justify-between animate-ios-reveal border-white/20 shadow-lg" intensity="low">
            <div className="flex items-center gap-4 border-r border-white/10 pr-6 mr-6">
                <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl group hover:scale-110 transition-transform">
                    <HeartPulse className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                    <h2 className="text-xs font-black uppercase tracking-widest text-ios-gradient">Live Vitals</h2>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] text-muted-foreground font-bold tracking-tighter">Active Telemetry</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-center gap-10 overflow-x-auto no-scrollbar">
                <VitalCard
                    label="TEMP"
                    value={vitals.temp}
                    unit="°F"
                    icon={Thermometer}
                />
                <VitalCard
                    label="SYS/DIA"
                    value={`${vitals.bp_sys}/${vitals.bp_dia}`}
                    unit="MMHG"
                    icon={Activity}
                    status={getBPStatus()}
                />
                <VitalCard
                    label="HEART RATE"
                    value={vitals.hr}
                    unit="BPM"
                    icon={Droplets}
                />
                <VitalCard
                    label="OXYGEN"
                    value={vitals.spo2}
                    unit="%"
                    icon={Wind}
                    status={getSPO2Status()}
                />
                <VitalCard
                    label="RESP. RATE"
                    value={vitals.rr}
                    unit="B/M"
                    icon={Activity}
                />
            </div>

            <div className="hidden lg:flex items-center gap-2 pl-6 border-l border-white/10 ml-6">
                <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-tight">Patient Safety</p>
                    <p className="text-xs font-bold text-slate-700">Monitor Active</p>
                </div>
                <AlertCircle className="w-4 h-4 text-emerald-500" />
            </div>
        </GlassCard>
    )
}
