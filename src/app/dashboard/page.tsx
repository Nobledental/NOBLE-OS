"use client";

import { useState } from "react";
import { LayoutGrid, Armchair } from "lucide-react";
import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { RoleSwitcher } from "@/components/shared/role-switcher";
import { useAuth } from "@/lib/auth-context";
import { AdminDashboardView } from "@/components/dashboard/admin-view";
import { DoctorDashboardView } from "@/components/dashboard/doctor-view";
import { ReceptionistDashboardView } from "@/components/dashboard/receptionist-view";
import { AssistantDashboardView } from "@/components/dashboard/assistant-view";
import { VerifiedBadge } from "@/components/ui/verified-badge";

// Enhanced NEO Orb with Layered Rings
const NEOOrb = ({ status, className }: { status: string, className?: string }) => (
    <div className={cn("relative w-10 h-10 flex items-center justify-center", className)}>
        {/* Layered Bouncing Rings */}
        <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-blue-400/30"
        />
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1 rounded-full border border-dashed border-purple-500/20"
        />
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#0A84FF] to-[#5AC8FA] animate-pulse shadow-[0_0_15px_rgba(10,132,255,0.5)] z-10" />
    </div>
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
    const { user } = useAuth();
    const role = user?.role || "DOCTOR";
    const filters = ['Today', 'This Week', 'This Month', 'Reports'];

    // Map role to view component
    const renderRoleView = (isTreatmentMode = false) => {
        switch (role) {
            case "DOCTOR":
            case "CONSULTANT":
                return <DoctorDashboardView startInCockpit={isTreatmentMode} />;
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
                    <VerifiedBadge className="mb-3 w-fit" />
                    <h2 className="text-[18px] text-[#0A84FF] font-semibold tracking-[0.05em] mb-1">
                        {viewMode === 'overview' ? `Logged in as ${role}` : 'Active Treatment Focus'}
                    </h2>
                    <h1 className="text-4xl md:text-[56px] font-bold text-white tracking-[-0.04em] leading-[1.1]">
                        {viewMode === 'overview' ? <>Practice <span>Overview</span></> : 'Patient Session'}
                    </h1>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center space-x-1 glass-frost p-1 rounded-full border-white/5 shadow-2xl">
                        <Button
                            variant="ghost"
                            onClick={() => setViewMode('overview')}
                            className={cn(
                                "rounded-full px-6 py-2 gap-2 transition-all h-10",
                                viewMode === 'overview' ? "bg-white text-black shadow-xl scale-105" : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Overview</span>
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setViewMode('treatment')}
                            className={cn(
                                "rounded-full px-6 py-2 gap-2 transition-all h-10",
                                viewMode === 'treatment' ? "bg-white text-black shadow-xl scale-105" : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Armchair className="w-4 h-4" />
                            <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Treatment</span>
                        </Button>
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            className="px-3 flex items-center justify-center cursor-pointer"
                        >
                            <NEOOrb status="thinking" className="scale-90" />
                        </motion.div>
                    </div>
                    <div className="w-px h-6 bg-white/10 mx-1 hidden md:block" />
                    <RoleSwitcher />
                </div>
            </div>

            {/* Filters (Visible in Overview Mode) */}
            {viewMode === 'overview' && (
                <div className="flex items-center gap-4 flex-wrap animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                    <div className="flex items-center glass-frost rounded-full p-1 border-white/5 shadow-2xl">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500",
                                    activeFilter === filter
                                        ? "bg-white text-black shadow-xl scale-105"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={role + viewMode}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    {renderRoleView(viewMode === 'treatment')}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
