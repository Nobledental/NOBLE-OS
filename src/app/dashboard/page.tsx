"use client";

import { useState } from "react";
import { LayoutGrid, Armchair } from "lucide-react";
import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { RoleSwitcher } from "@/components/shared/role-switcher";
import { useAuth } from "@/hooks/use-auth";
import { AdminDashboardView } from "@/components/dashboard/admin-view";
import { DoctorDashboardView } from "@/components/dashboard/doctor-view";
import { ReceptionistDashboardView } from "@/components/dashboard/receptionist-view";
import { AssistantDashboardView } from "@/components/dashboard/assistant-view";

// Mock NEO Orb 
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

export default function DashboardPage() {
    const [viewMode, setViewMode] = useState<'overview' | 'treatment'>('overview');
    const [activeFilter, setActiveFilter] = useState('This Month');
    const { role } = useAuth();
    const filters = ['Today', 'This Week', 'This Month', 'Reports'];

    // Map role to view component
    const renderRoleView = () => {
        switch (role) {
            case "DOCTOR":
            case "CONSULTANT":
                return <DoctorDashboardView />;
            case "RECEPTIONIST":
                return <ReceptionistDashboardView />;
            case "ASSISTANT":
                return <AssistantDashboardView />;
            case "ADMIN":
            default:
                return <AdminDashboardView activeFilter={activeFilter} />;
        }
    };

    return (
        <div className="flex-1 space-y-8 pb-20 relative">

            {/* Header Area with View Toggle */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div>
                    <p className="text-[#007AFF] text-[10px] mb-2 font-black uppercase tracking-[0.5em] animate-in fade-in slide-in-from-left-4 duration-1000">
                        {viewMode === 'overview' ? `Noble Command • ${role}` : 'Clinical Focus • Active Session'}
                    </p>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter font-display uppercase italic leading-none">
                        {viewMode === 'overview' ? 'Practice Overview' : 'Patient Session'}
                    </h1>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center space-x-1 bg-white/[0.03] p-1.5 rounded-full shadow-2xl border border-white/10 backdrop-blur-3xl">
                        <Button
                            variant="ghost"
                            onClick={() => setViewMode('overview')}
                            className={cn(
                                "rounded-[1.5rem] px-8 py-2 gap-3 transition-all h-12",
                                viewMode === 'overview'
                                    ? "bg-[#007AFF] text-white shadow-[0_10px_30px_rgba(0,122,255,0.4)] hover:bg-[#007AFF]/90"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span className="hidden md:inline text-[11px] font-black uppercase tracking-[0.2em]">Overview</span>
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setViewMode('treatment')}
                            className={cn(
                                "rounded-[1.5rem] px-8 py-2 gap-3 transition-all h-12",
                                viewMode === 'treatment'
                                    ? "bg-[#007AFF] text-white shadow-[0_10px_30px_rgba(0,122,255,0.4)] hover:bg-[#007AFF]/90"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Armchair className="w-4 h-4" />
                            <span className="hidden md:inline text-[11px] font-black uppercase tracking-[0.2em]">Treatment</span>
                        </Button>
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <motion.div
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            className="px-2 flex items-center justify-center cursor-pointer"
                        >
                            <NEOOrb status="thinking" className="scale-75 shadow-[0_0_20px_rgba(167,139,250,0.3)]" />
                        </motion.div>
                    </div>
                    <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block" />
                    <RoleSwitcher />
                </div>
            </div>

            {/* Filters (Visible in Overview Mode) */}
            {viewMode === 'overview' && (
                <div className="flex items-center gap-4 flex-wrap animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                    <div className="flex items-center bg-black/40 backdrop-blur-2xl rounded-full p-1.5 shadow-2xl border border-white/5">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={cn(
                                    "px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700",
                                    activeFilter === filter
                                        ? "bg-white text-black shadow-2xl scale-105"
                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {viewMode === 'overview' ? (
                    <motion.div
                        key={role}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        {renderRoleView()}
                    </motion.div>
                ) : (
                    <motion.div
                        key="treatment"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="min-h-[600px] flex items-center justify-center"
                    >
                        <PanzeCard className="w-full max-w-2xl h-[400px] flex items-center justify-center border-dashed border-white/10 glass-neo">
                            <div className="text-center space-y-8 relative">
                                <div className="w-24 h-24 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse shadow-[0_0_40px_rgba(249,115,22,0.2)]">
                                    <Armchair className="w-12 h-12 text-brand-primary" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-3xl font-black italic tracking-tighter text-white uppercase italic">Treatment Focus Zone</h3>
                                    <p className="text-white/40 max-w-xs mx-auto text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                                        Active surgical context. Select a patient from your clinical queue to initialize the medical digital twin.
                                    </p>
                                </div>
                                <Button
                                    className="bg-white text-slate-950 hover:bg-white/90 rounded-full px-10 h-14 font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all duration-500"
                                    onClick={() => setViewMode('overview')}
                                >
                                    Return to Overview
                                </Button>
                            </div>
                        </PanzeCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
