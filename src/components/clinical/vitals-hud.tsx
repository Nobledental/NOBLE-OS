"use client"

import React from "react"
import { cn } from "@/lib/utils"
import {
    Thermometer,
    Activity,
    Droplets,
    Wind,
    AlertCircle,
    Zap
} from "lucide-react"

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
            "flex flex-col p-4 rounded-xl border transition-all animate-in fade-in slide-in-from-top-2",
            status === "risk"
                ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 animate-pulse-slow font-bold"
                : status === "warning"
                    ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                    : "bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800"
        )}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</span>
                <Icon className={cn(
                    "h-4 w-4",
                    status === "risk" ? "text-red-600" : status === "warning" ? "text-amber-600" : "text-slate-400"
                )} />
            </div>
            <div className="flex items-baseline gap-1">
                <span className={cn(
                    "text-xl",
                    status === "risk" ? "text-red-700 dark:text-red-400" : "text-slate-900 dark:text-slate-100"
                )}>{value}</span>
                <span className="text-[10px] text-muted-foreground">{unit}</span>
            </div>
            {status === "risk" && (
                <div className="mt-2 flex items-center gap-1 text-[8px] text-red-600">
                    <AlertCircle className="h-3 w-3" /> CRITICAL LEVEL
                </div>
            )}
        </div>
    )
}

export function VitalsHUD() {
    // Mock Data (In production, this would subscribe to realtime vitals or fetch recent)
    const vitals = {
        temp: 98.6,
        bp_sys: 165, // Risk Level
        bp_dia: 105, // Risk Level
        hr: 78,
        spo2: 94,   // Warning Level
        rr: 18
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
        <div className="w-full bg-slate-50/50 dark:bg-slate-900/50 p-4 border-b">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg ring-4 ring-indigo-100 dark:ring-indigo-900/20">
                        <Zap className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold">Chair-Side Intake</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Live Monitoring Active</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-5 gap-3">
                    <VitalCard
                        label="Temperature"
                        value={vitals.temp}
                        unit="°F"
                        icon={Thermometer}
                    />
                    <VitalCard
                        label="Blood Pressure"
                        value={`${vitals.bp_sys}/${vitals.bp_dia}`}
                        unit="mmHg"
                        icon={Activity}
                        status={getBPStatus()}
                    />
                    <VitalCard
                        label="Heart Rate"
                        value={vitals.hr}
                        unit="BPM"
                        icon={Droplets}
                    />
                    <VitalCard
                        label="Oxygen Level"
                        value={vitals.spo2}
                        unit="%"
                        icon={Wind}
                        status={getSPO2Status()}
                    />
                    <VitalCard
                        label="Resp. Rate"
                        value={vitals.rr}
                        unit="B/m"
                        icon={Activity}
                    />
                </div>
            </div>
        </div>
    )
}
