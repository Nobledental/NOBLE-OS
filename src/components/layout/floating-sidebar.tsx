"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
    LayoutDashboard,
    CalendarDays,
    Stethoscope,
    Users,
    Receipt,
    Settings,
    Store,
    Activity,
    LogOut,
    ShieldCheck,
    Grid,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, id: "dashboard" },
    { label: "Appointments", href: "/dashboard/appointments", icon: CalendarDays, id: "appointments" },
    { label: "Clinical", href: "/dashboard/clinical", icon: Stethoscope, id: "clinical" },
    { label: "Patients", href: "/dashboard/patients", icon: Users, id: "patients" },
    { label: "Billing", href: "/dashboard/billing", icon: Receipt, id: "billing" },
    { label: "Staff & HR", href: "/dashboard/staff", icon: Users, id: "staff" },
    { label: "Sterilization", icon: ShieldCheck, id: "sterilization", href: "/dashboard/sterilization" },
    { label: "Marketplace", href: "/dashboard/marketplace", icon: Store, id: "marketplace" },
    { label: "Settings", href: "/dashboard/settings", icon: Settings, id: "settings" },
];

const PRIORITY_ITEMS: Record<string, string[]> = {
    ADMIN: ["dashboard", "appointments", "clinical", "patients", "billing", "staff", "marketplace", "settings", "sterilization"],
    DOCTOR: ["appointments", "clinical", "patients", "dashboard"],
    RECEPTIONIST: ["appointments", "patients", "billing", "dashboard"],
    ASSISTANT: ["sterilization", "settings", "dashboard"],
};

export function FloatingSidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const permissions = user?.modulePermissions || [];
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // RBAC-enforced navigation filtering
    const filteredItems = NAV_ITEMS.filter(item => {
        if (item.id === 'dashboard') return true;
        if (permissions.includes('all')) return true;
        return permissions.includes(item.id);
    });

    const priorityIds = PRIORITY_ITEMS[user?.role || ""] || ["dashboard", "appointments", "clinical"];

    const sortedItems = [
        ...filteredItems.filter(item => priorityIds.includes(item.id)),
        ...filteredItems.filter(item => !priorityIds.includes(item.id))
    ];

    return (
        <TooltipProvider>
            {/* Desktop Dock - Using Noble Glass Tokens */}
            <motion.div
                initial={{ y: 100, x: "-50%", opacity: 0 }}
                animate={{ y: 0, x: "-50%", opacity: 1 }}
                className={cn(
                    "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden lg:flex",
                    "flex-row items-center gap-2 p-2.5",
                    "noble-glass rounded-[2.5rem] transition-all duration-700 hover:border-white/20"
                )}
            >
                <div className="flex items-center gap-1.5 px-1">
                    {/* Brand Orb - Replaced hardcoded blue with semantic action */}
                    <div className="group relative shrink-0">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-clinical-action to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-clinical-action/20 group-hover:scale-110 transition-all duration-500 cursor-pointer">
                            <Activity className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {sortedItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Tooltip key={item.id}>
                                    <TooltipTrigger asChild>
                                        <Link href={item.href}>
                                            <motion.div
                                                whileHover={{ y: -6, scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className={cn(
                                                    "relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                                                    isActive
                                                        ? "bg-white/10 text-white shadow-inner"
                                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                                )}
                                            >
                                                <Icon className={cn("w-5.5 h-5.5 transition-colors", isActive ? "text-clinical-progress" : "")} />

                                                {isActive && (
                                                    <motion.div
                                                        layoutId="sidebar-active-indicator"
                                                        className="absolute -bottom-1 w-1.5 h-1.5 bg-clinical-progress rounded-full"
                                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="noble-glass border-white/20 text-[10px] font-btn uppercase tracking-tighter px-3 py-1.5 mb-4">
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-2" />

                    <button
                        onClick={logout}
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-destructive/20 hover:text-destructive transition-all duration-300"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>

            {/* Mobile/Tablet Bottom Bar - Implementation of "Dock Safe Area" */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-0 left-0 right-0 z-[60] flex lg:hidden px-4 pb-[env(safe-area-inset-bottom,1rem)] mb-4"
            >
                <div className="w-full max-w-lg mx-auto noble-glass p-2 shadow-2xl">
                    <div className="flex items-center justify-around">
                        {sortedItems.slice(0, 4).map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link key={item.href} href={item.href} className="flex-1">
                                    <div className={cn(
                                        "flex flex-col items-center gap-1 py-2 px-1 rounded-2xl transition-all",
                                        isActive ? "text-clinical-progress bg-white/5" : "text-slate-400"
                                    )}>
                                        <Icon className={cn("transition-all", isActive ? "w-6 h-6" : "w-5 h-5")} />
                                        <span className="text-[9px] font-label uppercase tracking-widest">{item.label.slice(0, 5)}</span>
                                    </div>
                                </Link>
                            );
                        })}

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={cn(
                                "flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-2xl transition-all",
                                isMenuOpen ? "text-clinical-action bg-white/5" : "text-slate-400"
                            )}
                        >
                            <Grid className="w-5 h-5" />
                            <span className="text-[9px] font-label uppercase tracking-widest">More</span>
                        </button>
                    </div>

                    {/* Menu Popup - Refactored to Noble Glass High */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute bottom-24 left-0 right-0 mx-4 p-4 noble-glass bg-black/40 border-white/20 shadow-2xl overflow-hidden"
                            >
                                <div className="grid grid-cols-3 gap-3">
                                    {sortedItems.slice(4).map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                            >
                                                <Icon className="w-5 h-5 text-slate-300" />
                                                <span className="text-[8px] font-label text-white uppercase text-center">{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </TooltipProvider>
    );
}
