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
    ChevronRight,
    Calendar,
    Package,
    Microscope,
    Share2,
    Sparkles,
    Box
} from "lucide-react";
import { useAuth, HasPermission } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, id: "dashboard" },
    { label: "Appointments", href: "/dashboard/appointments", icon: CalendarDays, id: "appointments" },
    { label: "Clinical", href: "/dashboard/clinical", icon: Stethoscope, id: "clinical" },
    { label: "Patients", href: "/dashboard/patients", icon: Users, id: "patients" },
    { label: "Billing", href: "/dashboard/billing", icon: Receipt, id: "billing" },
    { label: "Staff & HR", href: "/dashboard/staff", icon: Users, id: "staff" },
    { label: "Sterilization", href: "/dashboard/sterilization", icon: ShieldCheck, id: "sterilization" }, // SEPARATED
    { label: "Marketplace", href: "/dashboard/marketplace", icon: Store, id: "marketplace" },
    { label: "Settings", href: "/dashboard/settings", icon: Settings, id: "settings" },
];

const PRIORITY_ITEMS: Record<string, string[]> = {
    ADMIN: ["dashboard", "appointments", "clinical", "patients", "billing", "staff", "marketplace", "settings", "sterilization"],
    DOCTOR: ["appointments", "clinical", "patients"],
    CONSULTANT: ["appointments", "clinical", "patients"],
    RECEPTIONIST: ["appointments", "patients", "billing"],
    ASSISTANT: ["sterilization", "settings"], // Assuming "Assistant Page" implies Sterilization/Settings
};

export function FloatingSidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const permissions = user?.modulePermissions || [];
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Force show all items for maximum visibility as requested by user
    const filteredItems = NAV_ITEMS;

    const priorityIds = PRIORITY_ITEMS[user?.role || ""] || ["dashboard", "appointments", "clinical", "patients"];
    const topBarItems = filteredItems.filter(item => priorityIds.includes(item.id)).slice(0, 4);
    const moreItems = filteredItems.filter(item => !topBarItems.some(ti => ti.id === item.id));

    return (
        <TooltipProvider>
            {/* Desktop Dock (Apple Organic Bottom Dock) */}
            <motion.div
                initial={{ y: 100, x: "-50%", opacity: 0 }}
                animate={{ y: 0, x: "-50%", opacity: 1 }}
                className="fixed bottom-8 left-1/2 z-50 hidden lg:flex flex-row items-center gap-2 p-2 bg-white/60 backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-200 rounded-[2.5rem] transition-all duration-700 hover:border-slate-300"
            >
                <div className="flex flex-row items-center h-full px-2 gap-2">
                    <div className="group relative shrink-0 mr-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neo-vibrant-blue to-neo-electric-blue flex items-center justify-center text-white shadow-xl shadow-neo-vibrant-blue/20 group-hover:scale-105 transition-all duration-700 cursor-pointer">
                            <Activity className="w-5 h-5 drop-shadow-md" />
                        </div>
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        {filteredItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Tooltip key={item.id}>
                                    <TooltipTrigger asChild>
                                        <Link href={item.href}>
                                            <motion.div
                                                whileHover={{ scale: 1.15, y: -4 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={cn(
                                                    "relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                                                    isActive
                                                        ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                                )}
                                            >
                                                <Icon className={cn(
                                                    "w-5 h-5 transition-all duration-500",
                                                    isActive ? "scale-105" : ""
                                                )} />

                                                {isActive && (
                                                    <motion.div
                                                        layoutId="sidebar-active"
                                                        className="absolute -bottom-1.5 w-4 h-1 bg-neo-vibrant-blue rounded-full"
                                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="glass-white border-white/40 text-[9px] font-black uppercase tracking-widest text-slate-900 px-3 py-1.5 mb-2">
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>

                    <div className="w-px h-6 bg-slate-200 mx-2 shrink-0" />

                    <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all duration-500 group shrink-0">
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </motion.div>

            {/* Mobile/Tablet Bottom Bar (Wavy Apple Style) */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex lg:hidden w-[95%] max-w-lg h-24 bg-white/80 backdrop-blur-2xl rounded-[3.5rem] items-center justify-around px-6 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border border-slate-200/50 overflow-visible"
            >
                {/* Active Shape Indicator (Organic Blob) */}
                <div className="absolute inset-x-4 h-full pointer-events-none flex items-center justify-around">
                    {topBarItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                        return isActive && (
                            <motion.div
                                key="blob"
                                layoutId="mobile-blob"
                                className="w-20 h-20 bg-gradient-to-tr from-neo-vibrant-blue to-neo-electric-blue rounded-[2.5rem] blur-2xl opacity-30 absolute"
                            />
                        );
                    })}
                </div>

                {topBarItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href} className="flex-1 z-10">
                            <div className={cn(
                                "flex flex-col items-center justify-center gap-1.5 transition-all duration-500 py-3 rounded-[2rem] mx-1",
                                isActive ? "text-white" : "text-slate-500"
                            )}>
                                <div className={cn(
                                    "p-2.5 rounded-2xl transition-all duration-500",
                                    isActive && "bg-slate-900 text-white shadow-lg scale-110"
                                )}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest transition-opacity duration-500",
                                    isActive ? "opacity-100" : "opacity-0"
                                )}>
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}

                {/* More Menu for Mobile */}
                <div className="flex-1 relative z-10">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={cn(
                            "w-full flex flex-col items-center justify-center gap-1.5 transition-all duration-500 py-3 rounded-[2rem] mx-1",
                            isMenuOpen ? "text-white" : "text-slate-500"
                        )}
                    >
                        <div className={cn("p-2 rounded-2xl transition-all", isMenuOpen && "bg-white/10 rotate-90")}>
                            <Grid className="w-6 h-6" />
                        </div>
                    </button>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="absolute bottom-24 right-0 w-80 glass-neo shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border-white/10 p-8 origin-bottom-right"
                            >
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    {moreItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={cn(
                                                    "flex flex-col items-center gap-3 p-5 rounded-[2rem] transition-all duration-500",
                                                    isActive ? "bg-white/10 text-neo-vibrant-blue shadow-inner" : "bg-black/20 hover:bg-black/40 text-slate-400"
                                                )}
                                            >
                                                <Icon className="w-6 h-6" />
                                                <span className="text-[10px] font-bold text-center leading-tight uppercase tracking-widest">{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                                <button className="w-full flex items-center justify-center gap-4 p-5 rounded-[2rem] bg-red-500/10 text-red-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-red-500/20 transition-all border border-red-500/10">
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </TooltipProvider>
    );
}
