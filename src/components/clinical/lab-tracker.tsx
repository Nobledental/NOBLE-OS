"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    Truck,
    CheckCircle2,
    AlertTriangle,
    RotateCcw,
    Clock,
    MapPin,
    Stethoscope,
    Microscope,
    Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PanzeCard } from "@/components/ui/panze-card";

// Order Stages (Domino's / DentCare Hybrid)
const STAGES = [
    { id: "ordered", label: "Order Placed", icon: Stethoscope, color: "text-blue-500", bg: "bg-blue-500" },
    { id: "pickup", label: "Impression Picked Up", icon: Truck, color: "text-orange-500", bg: "bg-orange-500" },
    { id: "in_lab", label: "In Lab (Processing)", icon: Microscope, color: "text-purple-500", bg: "bg-purple-500" },
    { id: "shipped", label: "Out for Delivery", icon: MapPin, color: "text-indigo-500", bg: "bg-indigo-500" },
    { id: "received", label: "Received at Clinic", icon: Box, color: "text-teal-500", bg: "bg-teal-500" },
    { id: "qc_check", label: "Quality Check Passed", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500" },
];

interface LabTrackerProps {
    patientName?: string;
    labName?: string;
    workType?: string; // e.g., "Zirconia Crown"
    initialStage?: number;
}

export function LabTracker({
    patientName = "Suresh Kumar",
    labName = "DentCare Lab",
    workType = "PFM Crown (Unit 26)",
    initialStage = 1
}: LabTrackerProps) {
    const [currentStage, setCurrentStage] = useState(initialStage);
    const [isRework, setIsRework] = useState(false);
    const [history, setHistory] = useState([
        { stage: "Order Placed", time: "Feb 06, 09:30 AM", user: "Dr. Dhiva" }
    ]);

    // Clinic-Side Control: Advance the tracker manually
    const advanceStage = () => {
        if (currentStage < STAGES.length - 1) {
            const nextStage = STAGES[currentStage + 1];
            setCurrentStage(prev => prev + 1);
            setHistory(prev => [...prev, {
                stage: nextStage.label,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                user: "Reception"
            }]);
            toast.success(`Marked as ${nextStage.label}`);
        }
    };

    // Rework Logic: Reset to "In Lab"
    const triggerRework = () => {
        setIsRework(true);
        setCurrentStage(2); // Reset to "In Lab"
        setHistory(prev => [...prev, {
            stage: "Sent for Rework",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            user: "Doctor"
        }]);
        toast.warning("Order marked for Rework");
    };

    return (
        <PanzeCard className="w-full relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {isRework ? "REWORK CASE" : "ACTIVE ORDER"}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">#LAB-9928</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{workType}</h3>
                    <p className="text-sm text-slate-500 font-medium">Patient: {patientName} • Lab: {labName}</p>
                </div>

                {/* Rework Button (Only visible if item is received/QC) */}
                {currentStage >= 4 && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={triggerRework}
                        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Mark Rework
                    </Button>
                )}
            </div>

            {/* Domino's Style Pulse Tracker */}
            <div className="relative mb-8">
                {/* Connecting Line */}
                <div className="absolute top-[22px] left-0 w-full h-[3px] bg-slate-100 -z-10 rounded-full" />
                <div
                    className="absolute top-[22px] left-0 h-[3px] transition-all duration-700 ease-out z-0 rounded-full bg-gradient-to-r from-blue-500 to-green-400"
                    style={{ width: `${(currentStage / (STAGES.length - 1)) * 100}%` }}
                />

                <div className="flex justify-between items-start w-full">
                    {STAGES.map((stage, index) => {
                        const isActive = index <= currentStage;
                        const isCurrent = index === currentStage;
                        const Icon = stage.icon;

                        return (
                            <div key={stage.id} className="flex flex-col items-center gap-2 group cursor-pointer relative">
                                {/* Node */}
                                <motion.div
                                    className={cn(
                                        "w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all bg-white z-10 shadow-sm",
                                        isActive ? `border-${stage.color.split('-')[1]}-500 text-slate-900` : "border-slate-100 text-slate-300",
                                        isCurrent && `scale-110 shadow-lg ring-4 ring-${stage.color.split('-')[1]}-100`
                                    )}
                                    initial={false}
                                    animate={isActive ? { scale: isCurrent ? 1.1 : 1 } : { scale: 0.9 }}
                                >
                                    <Icon className={cn("w-5 h-5", isActive ? stage.color : "text-slate-300")} />
                                </motion.div>

                                {/* Label (Visible for Active/Next) */}
                                <div className={cn(
                                    "absolute top-14 w-32 text-center transition-all duration-300",
                                    isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                                )}>
                                    <p className={cn("text-xs font-bold", isActive ? "text-slate-800" : "text-slate-400")}>{stage.label}</p>
                                    {isCurrent && <p className="text-[10px] text-green-600 font-bold animate-pulse">In Progress</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Bar (Clinic Controls) */}
            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between mt-12">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border shadow-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-700">Latest Update</p>
                        <p className="text-xs text-slate-500">
                            {history[history.length - 1]?.stage} • {history[history.length - 1]?.time}
                        </p>
                    </div>
                </div>

                {currentStage < STAGES.length - 1 ? (
                    <Button
                        onClick={advanceStage}
                        className="bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200"
                    >
                        Mark as {STAGES[currentStage + 1].label.split(' ')[0]}
                        <span className="opacity-50 ml-1">→</span>
                    </Button>
                ) : (
                    <Button className="bg-green-600 hover:bg-green-700 text-white pointer-events-none">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Case Completed
                    </Button>
                )}
            </div>
        </PanzeCard>
    );
}
