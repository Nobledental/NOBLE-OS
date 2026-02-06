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
    const [viewMode, setViewMode] = useState<'morning' | 'active_chair'>('morning');
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
                return <AdminDashboardView />;
        }
    };

    return (
        <div className="flex-1 space-y-8 pb-20 relative">

            {/* Header Area with View Toggle */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div>
                    <p className="text-slate-500 text-sm mb-1 font-medium italic">
                        {viewMode === 'morning' ? `Logged in as ${role}` : 'Active Chair Mode'}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight font-display">
                        {viewMode === 'morning' ? 'Clinical Overview' : 'Patient Session'}
                    </h1>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
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
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-2 flex items-center justify-center cursor-pointer"
                        >
                            <NEOOrb status="thinking" className="scale-75" />
                        </motion.div>
                    </div>
                    <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block" />
                    <RoleSwitcher />
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
