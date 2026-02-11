"use client";

import { useState } from "react";
import { PanzeCard } from "@/components/ui/panze-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Armchair,
    Activity,
    Clock,
    Wand2,
    MoreVertical,
    Plus,
    Search,
    AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock Data for Dental Chairs
const MOCK_CHAIRS = [
    {
        id: "C-101",
        name: "Surgical Suite A",
        status: "ACTIVE",
        operator: "Dr. Dhivakaran",
        patient: "Divya Sharma",
        procedure: "Root Canal Treatment",
        startTime: "10:30 AM",
        duration: "45m",
        efficiency: 92,
        maintenanceDue: "2024-12-15"
    },
    {
        id: "C-102",
        name: "Hygiene Bay 1",
        status: "AVAILABLE",
        operator: "-",
        patient: "-",
        procedure: "-",
        startTime: "-",
        duration: "-",
        efficiency: 88,
        maintenanceDue: "2024-11-20"
    },
    {
        id: "C-103",
        name: "Ortho Station",
        status: "MAINTENANCE",
        operator: "Tech. Sarah",
        patient: "-",
        procedure: "Hydraulic Calibration",
        startTime: "09:00 AM",
        duration: "2h",
        efficiency: 74,
        maintenanceDue: "OVERDUE"
    },
    {
        id: "C-104",
        name: "Pediatric Unit",
        status: "ACTIVE",
        operator: "Dr. Anjali",
        patient: "Rohan K.",
        procedure: "Cavity Filling",
        startTime: "11:15 AM",
        duration: "30m",
        efficiency: 95,
        maintenanceDue: "2025-01-10"
    }
];

export function ChairManagementHub() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="space-y-8 p-1">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-serif italic text-slate-900">Dental Asset Registry</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                        Real-time Utilization & Maintenance Status
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Find chair or operator..."
                            className="pl-9 h-10 w-[250px] bg-slate-50 border-slate-200 rounded-xl text-xs uppercase tracking-wider font-semibold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6 h-10 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/20">
                        <Plus className="w-3.5 h-3.5 mr-2" /> Add Chair
                    </Button>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Asset Value", value: "₹45.2L", icon: Armchair, color: "text-slate-600" },
                    { label: "Active Utilization", value: "75%", icon: Activity, color: "text-emerald-500" },
                    { label: "Avg. Turnaround", value: "12m", icon: Clock, color: "text-blue-500" },
                    { label: "Predictive Mntc.", value: "1 Alert", icon: AlertCircle, color: "text-amber-500" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100", stat.color)}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chairs Grid */}
            <div className="grid grid-cols-1 gap-4">
                {MOCK_CHAIRS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((chair) => (
                    <motion.div
                        key={chair.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -2 }}
                        className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Icon / Avatar */}
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-inner",
                                chair.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" :
                                    chair.status === "MAINTENANCE" ? "bg-amber-50 text-amber-600" :
                                        "bg-slate-50 text-slate-400"
                            )}>
                                <Armchair className="w-8 h-8" />
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 min-w-[200px]">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-slate-900">{chair.name}</h3>
                                    <Badge variant="outline" className={cn(
                                        "text-[9px] px-2 py-0.5 font-black uppercase tracking-wider border-0",
                                        chair.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                                            chair.status === "MAINTENANCE" ? "bg-amber-100 text-amber-700" :
                                                "bg-slate-100 text-slate-600"
                                    )}>
                                        {chair.status}
                                    </Badge>
                                </div>
                                <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                                    ID: <span className="font-mono text-slate-400">{chair.id}</span>
                                    {chair.status === "ACTIVE" && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span>{chair.operator}</span>
                                        </>
                                    )}
                                </p>
                            </div>

                            {/* Active Procedure Context */}
                            {chair.status === "ACTIVE" && (
                                <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-500 border border-slate-100 shadow-sm">
                                        <Wand2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Procedure</p>
                                        <p className="text-xs font-semibold text-slate-900">{chair.procedure}</p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{chair.startTime}</p>
                                        <p className="text-xs font-mono text-emerald-600">Running: {chair.duration}</p>
                                    </div>
                                </div>
                            )}

                            {/* Maintenance Context */}
                            {chair.status === "MAINTENANCE" && (
                                <div className="flex-1 bg-amber-50/50 rounded-xl p-3 border border-amber-100 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-500" />
                                    <div>
                                        <p className="text-[10px] font-bold text-amber-700/60 uppercase tracking-wider">Issue Detected</p>
                                        <p className="text-xs font-semibold text-amber-900">{chair.procedure}</p>
                                    </div>
                                </div>
                            )}

                            {/* Efficiency Score */}
                            <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between gap-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Efficiency</span>
                                <span className={cn(
                                    "text-2xl font-serif italic",
                                    chair.efficiency > 90 ? "text-emerald-600" :
                                        chair.efficiency > 80 ? "text-blue-600" : "text-amber-600"
                                )}>
                                    {chair.efficiency}%
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar for Active */}
                        {chair.status === "ACTIVE" && (
                            <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 w-[65%]" />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
