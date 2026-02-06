"use client";

import { useState } from "react";
import { Search, LayoutGrid, Armchair, Mic } from "lucide-react";
import { ActiveQueue } from "@/components/dashboard/active-queue";
import { ProjectsOverview } from "@/components/dashboard/projects-overview";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { PatientTracker } from "@/components/dashboard/patient-tracker";
import { PanzeCard } from "@/components/ui/panze-card";
import { DonutChart } from "@/components/ui/charts/donut-chart";
import { SplineChart } from "@/components/ui/charts/spline-chart";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChiefPulse } from "@/components/dashboard/chief-pulse"; // Added

// Mock NEO Orb (Placeholder for the previous AI component)
const NEOOrb = ({ status, className }: { status: string, className?: string }) => (
    <div className={cn("w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse shadow-lg", className)} />
);

// Staggered Animation Variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
    const [viewMode, setViewMode] = useState<'morning' | 'active_chair'>('morning');
    const [activeFilter, setActiveFilter] = useState('This Month');
    const filters = ['Today', 'This Week', 'This Month', 'Reports'];

    return (
        <div className="flex-1 space-y-8 pb-20 relative">

            {/* Header Area with View Toggle */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div>
                    <p className="text-slate-500 text-sm mb-1 font-medium">
                        {viewMode === 'morning' ? 'Good Morning, Dr. Dhivakaran.' : 'Active Chair Mode'}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight font-display">
                        {viewMode === 'morning' ? 'Project Dashboard' : 'Patient Session'}
                    </h1>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    {/* View Mode Toggle */}
                    <div className="flex items-center space-x-1 bg-white p-1 rounded-full shadow-sm border border-slate-200">
                        <Button
                            variant="ghost"
                            onClick={() => setViewMode('morning')}
                            className={cn(
                                "rounded-full px-4 py-2 gap-2 transition-all h-10",
                                viewMode === 'morning' ? "bg-slate-900 text-white shadow-md hover:bg-slate-800" : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Morning</span>
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setViewMode('active_chair')}
                            className={cn(
                                "rounded-full px-4 py-2 gap-2 transition-all h-10",
                                viewMode === 'active_chair' ? "bg-brand-primary text-white shadow-md hover:bg-orange-600" : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            <Armchair className="w-4 h-4" />
                            <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Chair</span>
                        </Button>
                        <div className="w-px h-6 bg-slate-200 mx-1" />
                        <div className="px-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                            <NEOOrb status="thinking" className="scale-75" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters (Visible in Morning Mode) */}
            {viewMode === 'morning' && (
                <div className="flex items-center gap-4 flex-wrap animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                    <div className="flex items-center bg-white rounded-full p-1.5 shadow-sm border border-slate-100">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={cn(
                                    "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                                    activeFilter === filter
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {viewMode === 'morning' ? (
                    <motion.div
                        key="morning"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[800px]"
                    >
                        {/* Top Row: Revenue & Highlights */}
                        <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">
                            {/* Revenue Spline Chart */}
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
                            {/* Restored: Chief Pulse (Staff Activity) */}
                            <div className="mb-2">
                                <ChiefPulse />
                            </div>

                            <DonutChart
                                title="Department Load"
                                totalLabel="Total Cases"
                                totalValue="86"
                                data={[
                                    { name: 'General', value: 35, color: '#3b82f6' }, // Blue
                                    { name: 'Ortho', value: 25, color: '#8b5cf6' },   // Purple
                                    { name: 'Surgery', value: 15, color: '#ec4899' }, // Pink
                                    { name: 'Pedo', value: 11, color: '#14b8a6' },   // Teal
                                ]}
                            />

                            {/* Active Projects Preview */}
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
                                {/* Restored: Patient Tracker (Quick View) */}
                                {/* Restored: Patient Tracker (Quick View) */}
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
                    </motion.div>
                ) : (
                    <motion.div
                        key="active_chair"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="min-h-[600px] flex items-center justify-center"
                    >
                        <PanzeCard className="w-full max-w-2xl h-[400px] flex items-center justify-center">
                            <div className="text-center">
                                <Armchair className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900">Active Chair Mode</h3>
                                <p className="text-slate-500">Focus view for clinical procedures.</p>
                            </div>
                        </PanzeCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
