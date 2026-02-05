"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Clock, MapPin, User, Stethoscope, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
    { id: 'waiting', label: 'Waiting Room', icon: User, time: '10:30 AM' },
    { id: 'vitals', label: 'Vitals & History', icon: Clock, time: '10:45 AM' },
    { id: 'chair', label: 'Dental Chair', icon: Stethoscope, time: '11:00 AM' },
    { id: 'billing', label: 'Billing', icon: Banknote, time: '11:45 AM' },
];

export function PatientTracker() {
    const [currentStepIndex, setCurrentStepIndex] = useState(1);
    const [isAutoMode, setIsAutoMode] = useState(false);

    // Automation Logic: Auto-advance every 3 seconds if active
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAutoMode) {
            interval = setInterval(() => {
                setCurrentStepIndex((prev) => {
                    if (prev < steps.length - 1) return prev + 1;
                    setIsAutoMode(false); // Stop when done
                    return prev;
                });
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isAutoMode]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
            {/* Header (Patient Track Header) */}
            <div className="flex justify-between items-start mb-8 z-10 relative">
                <div>
                    <h3 className="text-xl font-extrabold text-brand-text-primary tracking-tighter">
                        Tracking Patient
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">Order #MED-2938 | John Doe</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAutoMode(!isAutoMode)}
                        className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold transition-colors border",
                            isAutoMode
                                ? "bg-green-100 text-green-700 border-green-200 animate-pulse"
                                : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                        )}
                    >
                        {isAutoMode ? "🤖 AUTO-PILOT ON" : "🤖 ENABLE AUTO"}
                    </button>
                    <div className="bg-brand-bg-subtle px-3 py-1 rounded-full text-xs font-bold text-gray-500">
                        ETA: 15 MINS
                    </div>
                </div>
            </div>

            {/* Map-like Background Pattern (Abstract) */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
                <MapPin className="w-full h-full text-gray-300 transform rotate-12" />
            </div>

            {/* Vertical Tracker (Timeline Style) */}
            <div className="relative pl-4 space-y-8">
                {/* Connecting Line */}
                <div className="absolute left-[27px] top-2 bottom-4 w-0.5 bg-gray-200" />
                <div
                    className="absolute left-[27px] top-2 w-0.5 bg-brand-primary transition-all duration-1000 ease-out"
                    style={{ height: `${(currentStepIndex / (steps.length - 1)) * 80}%` }}
                />

                {steps.map((step, i) => {
                    const isCompleted = i < currentStepIndex;
                    const isActive = i === currentStepIndex;

                    return (
                        <div
                            key={step.id}
                            onClick={() => {
                                setIsAutoMode(false); // Human interference stops automation
                                setCurrentStepIndex(i);
                            }}
                            className="relative z-10 flex items-center gap-4 group cursor-pointer"
                        >
                            {/* Icon Indicator */}
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white transition-all duration-300",
                                isCompleted ? "border-brand-primary bg-brand-primary text-white" :
                                    isActive ? "border-brand-primary animate-pulse" : "border-gray-300 text-gray-300"
                            )}>
                                {isCompleted ? <Check className="w-3 h-3" /> :
                                    isActive ? <div className="w-2 h-2 bg-brand-primary rounded-full" /> :
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />}
                            </div>

                            {/* Content Card */}
                            <motion.div
                                initial={false}
                                animate={{ scale: isActive ? 1.05 : 1, opacity: i > currentStepIndex ? 0.5 : 1 }}
                                className={cn(
                                    "flex-1 p-3 rounded-xl border flex items-center justify-between transition-colors",
                                    isActive ? "bg-white border-brand-primary shadow-md" : "bg-gray-50 border-transparent hover:bg-gray-100"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-full",
                                        isActive ? "bg-orange-100 text-brand-primary" : "bg-white text-gray-400"
                                    )}>
                                        <step.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className={cn(
                                            "font-bold text-sm",
                                            isActive ? "text-brand-text-primary" : "text-gray-500"
                                        )}>
                                            {step.label}
                                        </h4>
                                        <p className="text-[10px] text-gray-400 font-medium">
                                            {step.time}
                                        </p>
                                    </div>
                                </div>

                                {isActive && (
                                    <span className="text-[10px] font-bold text-brand-primary bg-orange-50 px-2 py-1 rounded-md uppercase">
                                        Current
                                    </span>
                                )}
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
