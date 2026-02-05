"use client";

import { useState } from "react";
import { Search, LayoutGrid, Armchair, Mic } from "lucide-react";
import { ActiveQueue } from "@/components/dashboard/active-queue";
import { ProjectsOverview } from "@/components/dashboard/projects-overview";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { PatientTracker } from "@/components/dashboard/patient-tracker";
import { PanzeCard } from "@/components/ui/panze-card";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock NEO Orb (Placeholder for the previous AI component)
const NEOOrb = ({ status, className }: { status: string, className?: string }) => (
    <div className={cn("w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse shadow-lg", className)} />
);

export default function DashboardPage() {
    const [viewMode, setViewMode] = useState<'morning' | 'active_chair'>('morning');
    const [activeFilter, setActiveFilter] = useState('This Month');
    const filters = ['Today', 'This Week', 'This Month', 'Reports'];

    return (
        <div className="flex-1 space-y-8 animate-in fade-in duration-500 pb-20 relative">

            {/* Header Area with View Toggle */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-slate-500 text-sm mb-1 font-medium">
                        {viewMode === 'morning' ? 'Good Morning, Dr. Dhivakaran.' : 'Active Chair Mode'}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight font-display">
                        {viewMode === 'morning' ? 'Project Dashboard' : 'Patient Session'}
                    </h1>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    {/* View Mode Toggle (Restored Feature) */}
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
                                viewMode === 'active_chair' ? "bg-swiggy-orange text-white shadow-md hover:bg-orange-600" : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            <Armchair className="w-4 h-4" />
                            <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Chair</span>
                        </Button>
                        <div className="w-px h-6 bg-slate-200 mx-1" />
                        <div className="px-2 flex items-center justify-center cursor-pointer">
                            <NEOOrb status="thinking" className="scale-75" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters (Visible in Morning Mode) */}
            {viewMode === 'morning' && (
                <div className="flex items-center gap-4 flex-wrap">
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[800px]"
                    >
                        {/* Left Column: My Tasks (Active Queue) */}
                        <div className="lg:col-span-3 h-full">
                            <ActiveQueue />
                        </div>

                        {/* Right Area: Main Dashboard Grid */}
                        <div className="lg:col-span-9 flex flex-col gap-6 h-full">

                            {/* Top Row: Tracker & Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ProjectsOverview />
                                <PatientTracker />
                            </div>

                            {/* Middle Row: Revenue */}
                            <div className="h-[300px]">
                                <RevenueChart />
                            </div>

                            {/* Bottom Row: Restored Bento Features */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Invoice Overview (Restored) */}
                                <PanzeCard className="md:col-span-2 h-[200px] flex flex-col justify-center relative overflow-hidden group p-8">
                                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Search className="w-32 h-32" />
                                    </div>
                                    <h3 className="text-xl font-medium text-slate-900 mb-2">Invoice Intelligence</h3>
                                    <div className="flex gap-8">
                                        <div>
                                            <span className="block text-slate-400 text-xs uppercase font-bold">Collected</span>
                                            <span className="text-2xl font-bold text-slate-900">₹4.2L</span>
                                        </div>
                                        <div>
                                            <span className="block text-slate-400 text-xs uppercase font-bold">Outstanding</span>
                                            <span className="text-2xl font-bold text-red-500">₹12k</span>
                                        </div>
                                    </div>
                                </PanzeCard>

                                {/* Quick Action (Restored) */}
                                <PanzeCard className="h-[200px] flex flex-col items-center justify-center gap-4 p-6 bg-slate-900 text-white">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                        <Mic className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-center text-sm font-medium text-slate-300">
                                        "Hey NEO, add patient John Doe for a Root Canal at 5 PM."
                                    </p>
                                </PanzeCard>
                            </div>
                        </div>
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
