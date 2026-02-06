"use client";

import { motion } from "framer-motion";
import { ActiveQueue } from "./active-queue";
import { ProjectsOverview } from "./projects-overview";
import { RevenueChart } from "./revenue-chart";
import { PatientTracker } from "./patient-tracker";
import { ChiefPulse } from "./chief-pulse";
import { SplineChart } from "@/components/ui/charts/spline-chart";
import { DonutChart } from "@/components/ui/charts/donut-chart";
import { PanzeCard } from "@/components/ui/panze-card";
import { Mic } from "lucide-react";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
};

export function AdminDashboardView() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[800px]">
            {/* Top Row: Revenue & Highlights */}
            <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">
                <SplineChart
                    title="Revenue Trend"
                    data={[
                        { name: 'Mon', value: 4000 },
                        { name: 'Tue', value: 3000 },
                        { name: 'Wed', value: 2000 },
                        { name: 'Thu', value: 2780 },
                        { name: 'Fri', value: 1890 },
                        { name: 'Sat', value: 2390 },
                        { name: 'Sun', value: 3490 },
                    ]}
                />

                <div className="grid grid-cols-2 gap-6">
                    <PanzeCard className="flex flex-col justify-between h-[180px]">
                        <h4 className="text-slate-500 font-bold text-xs uppercase">Total Patients</h4>
                        <div className="text-4xl font-black text-slate-900">1,284</div>
                        <div className="text-green-500 text-sm font-bold flex items-center">
                            +12% <span className="text-slate-400 ml-1 font-normal">vs last month</span>
                        </div>
                    </PanzeCard>
                    <PanzeCard className="flex flex-col justify-between h-[180px]">
                        <h4 className="text-slate-500 font-bold text-xs uppercase">Appointments</h4>
                        <div className="text-4xl font-black text-slate-900">42</div>
                        <div className="text-blue-500 text-sm font-bold flex items-center">
                            8 <span className="text-slate-400 ml-1 font-normal">slots remaining</span>
                        </div>
                    </PanzeCard>
                </div>
            </motion.div>

            {/* Right Area: Department Breakdown */}
            <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
                <div className="mb-2">
                    <ChiefPulse />
                </div>

                <DonutChart
                    title="Department Load"
                    totalLabel="Total Cases"
                    totalValue="86"
                    data={[
                        { name: 'General', value: 35, color: '#3b82f6' },
                        { name: 'Ortho', value: 25, color: '#8b5cf6' },
                        { name: 'Surgery', value: 15, color: '#ec4899' },
                        { name: 'Pedo', value: 11, color: '#14b8a6' },
                    ]}
                />

                <div className="flex-1">
                    <ProjectsOverview />
                </div>
            </motion.div>

            {/* Bottom Row: Active Queue & Actions */}
            <motion.div variants={itemVariants} className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ActiveQueue />
                </div>

                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="h-full">
                        <PatientTracker />
                    </div>

                    <PanzeCard className="h-full bg-slate-900 text-white flex flex-col items-center justify-center text-center p-6 shadow-xl shadow-slate-900/20">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 animate-pulse">
                            <Mic className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-lg font-medium text-slate-200">
                            "Hey NEO, add patient Suresh for a Root Canal."
                        </p>
                    </PanzeCard>
                </div>
            </motion.div>
        </div>
    );
}
