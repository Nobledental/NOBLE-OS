"use client";

import { motion } from "framer-motion";
import { Check, Clock, MapPin, User, Stethoscope, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
    { id: 'waiting', label: 'Waiting Room', icon: User, time: '10:30 AM' },
    { id: 'vitals', label: 'Vitals & History', icon: Clock, time: '10:45 AM' },
    { id: 'chair', label: 'Dental Chair', icon: Stethoscope, time: '11:00 AM' },
    { id: 'billing', label: 'Billing', icon: Banknote, time: '11:45 AM' },
];

const currentStepIndex = 2; // Active on "Dental Chair"

export function PatientTracker() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
            {/* Header (Swiggy Track Header) */}
            <div className="flex justify-between items-start mb-8 z-10 relative">
                <div>
                    <h3 className="text-xl font-extrabold text-[#3D4152] tracking-tighter">
                        Tracking Patient
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">Order #MED-2938 | John Doe</p>
                </div>
                <div className="bg-swiggy-bg px-3 py-1 rounded-full text-xs font-bold text-gray-500">
                    ETA: 15 MINS
                </div>
            </div>

            {/* Map-like Background Pattern (Abstract) */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
                <MapPin className="w-full h-full text-gray-300 transform rotate-12" />
            </div>

            {/* Vertical Tracker (Swiggy Style) */}
            <div className="relative pl-4 space-y-8">
                {/* Connecting Line */}
                <div className="absolute left-[27px] top-2 bottom-4 w-0.5 bg-gray-200" />
                <div
                    className="absolute left-[27px] top-2 w-0.5 bg-swiggy-orange transition-all duration-1000 ease-out"
                    style={{ height: `${(currentStepIndex / (steps.length - 1)) * 80}%` }}
                />

                {steps.map((step, i) => {
                    const isCompleted = i < currentStepIndex;
                    const isActive = i === currentStepIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex items-center gap-4 group">
                            {/* Icon Indicator */}
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white transition-all duration-300",
                                isCompleted ? "border-swiggy-orange bg-swiggy-orange text-white" :
                                    isActive ? "border-swiggy-orange animate-pulse" : "border-gray-300 text-gray-300"
                            )}>
                                {isCompleted ? <Check className="w-3 h-3" /> :
                                    isActive ? <div className="w-2 h-2 bg-swiggy-orange rounded-full" /> :
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />}
                            </div>

                            {/* Content Card */}
                            <motion.div
                                initial={false}
                                animate={{ scale: isActive ? 1.05 : 1, opacity: i > currentStepIndex ? 0.5 : 1 }}
                                className={cn(
                                    "flex-1 p-3 rounded-xl border flex items-center justify-between transition-colors",
                                    isActive ? "bg-white border-swiggy-orange shadow-md" : "bg-gray-50 border-transparent"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-full",
                                        isActive ? "bg-orange-100 text-swiggy-orange" : "bg-white text-gray-400"
                                    )}>
                                        <step.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className={cn(
                                            "font-bold text-sm",
                                            isActive ? "text-swiggy-text" : "text-gray-500"
                                        )}>
                                            {step.label}
                                        </h4>
                                        <p className="text-[10px] text-gray-400 font-medium">
                                            {step.time}
                                        </p>
                                    </div>
                                </div>

                                {isActive && (
                                    <span className="text-[10px] font-bold text-swiggy-orange bg-orange-50 px-2 py-1 rounded-md uppercase">
                                        Active
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
