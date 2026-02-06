"use client";

import { motion } from "framer-motion";
import { ActiveQueue } from "./active-queue";
import { PatientTracker } from "./patient-tracker";
import { PanzeCard } from "@/components/ui/panze-card";
import { Stethoscope, ClipboardList, Clock, UserCheck } from "lucide-react";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
};

export function DoctorDashboardView() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
            {/* Main Clinical Focus */}
            <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">
                <ActiveQueue />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PanzeCard className="p-4 flex flex-col items-center justify-center text-center gap-2 border-l-4 border-blue-500">
                        <Stethoscope className="w-8 h-8 text-blue-500" />
                        <span className="text-2xl font-bold">12</span>
                        <span className="text-xs text-slate-500 font-bold uppercase">Cases Today</span>
                    </PanzeCard>
                    <PanzeCard className="p-4 flex flex-col items-center justify-center text-center gap-2 border-l-4 border-indigo-500">
                        <UserCheck className="w-8 h-8 text-indigo-500" />
                        <span className="text-2xl font-bold">8</span>
                        <span className="text-xs text-slate-500 font-bold uppercase">Completed</span>
                    </PanzeCard>
                    <PanzeCard className="p-4 flex flex-col items-center justify-center text-center gap-2 border-l-4 border-orange-500">
                        <Clock className="w-8 h-8 text-orange-500" />
                        <span className="text-2xl font-bold">45m</span>
                        <span className="text-xs text-slate-500 font-bold uppercase">Avg Session</span>
                    </PanzeCard>
                </div>
            </motion.div>

            {/* Sidebar / Detailed Info */}
            <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
                <PatientTracker />

                <PanzeCard className="p-6 bg-indigo-600 text-white shadow-xl shadow-indigo-200">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                        <ClipboardList className="w-5 h-5" />
                        Pending Approvals
                    </h4>
                    <ul className="space-y-3">
                        <li className="text-sm bg-white/10 p-2 rounded-lg border border-white/10 flex justify-between items-center">
                            <span>Lab Report - Suresh</span>
                            <span className="text-[10px] bg-red-500 px-1.5 py-0.5 rounded uppercase font-bold">Urgent</span>
                        </li>
                        <li className="text-sm bg-white/10 p-2 rounded-lg border border-white/10 flex justify-between items-center">
                            <span>X-Ray - Priya</span>
                            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded uppercase font-bold">Pending</span>
                        </li>
                    </ul>
                </PanzeCard>
            </motion.div>
        </div>
    );
}
