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
    BarChart3,
    Receipt,
    Wallet,
    UserPlus,
    ScrollText,
    Settings,
    Store,
    Activity,
    LogOut,
    ShieldCheck,
    Grid,
    FlaskConical,
    TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";

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
    const { role, permissions } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const filteredItems = NAV_ITEMS.filter(item =>
        permissions.includes("all") || permissions.includes(item.id)
    );

    const priorityIds = PRIORITY_ITEMS[role] || ["dashboard", "appointments", "clinical", "patients"];
    const topBarItems = filteredItems.filter(item => priorityIds.includes(item.id)).slice(0, 4);
    const moreItems = filteredItems.filter(item => !topBarItems.some(ti => ti.id === item.id));

    return (
        <TooltipProvider>
            {/* Desktop Sidebar (Fixed Left) */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center"
            >
                <div className="glass-neo p-4 flex flex-col gap-4 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border-white/10">
                    <div className="w-12 h-12 bg-gradient-to-tr from-neo-vibrant-blue to-neo-electric-blue rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 rotate-3">
                        <Activity className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex flex-col gap-2">
                        {filteredItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                            const Icon = item.icon;

                            return (
                                <Tooltip key={item.href}>
                                    <TooltipTrigger asChild>
                                        <Link href={item.href}>
                                            <motion.div
                                                whileHover={{ scale: 1.1, x: 5 }}
                                                className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative group",
                                                    isActive
                                                        ? "bg-white/10 text-neo-vibrant-blue shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                                                        : "text-slate-400 hover:text-white"
                                                )}>
                                                <Icon className={cn("w-5 h-5 transition-transform duration-500", isActive && "scale-110")} />
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="sidebar-active"
                                                        className="absolute -left-1 w-1 h-6 bg-neo-vibrant-blue rounded-full shadow-[0_0_15px_rgba(0,122,255,0.8)]"
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="font-bold bg-neo-midnight text-white border-white/10 ml-4 px-4 py-2 rounded-xl">
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>

                    <div className="h-px w-8 bg-white/10 mx-auto my-2" />

                    <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all group">
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>

            {/* Mobile/Tablet Bottom Bar (Wavy Organic Style) */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex lg:hidden w-[90%] max-w-md h-20 glass-neo rounded-[2.5rem] items-center justify-around px-4 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] border-white/10 overflow-visible"
            >
                {/* Active Shape Indicator (Organic Blob) */}
                <div className="absolute inset-x-4 h-full pointer-events-none flex items-center justify-around">
                    {topBarItems.map((item, idx) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                        return isActive && (
                            <motion.div
                                key="blob"
                                layoutId="mobile-blob"
                                className="w-16 h-16 bg-gradient-to-tr from-neo-vibrant-blue to-neo-electric-blue rounded-[2rem] blur-xl opacity-20 absolute"
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
                                    "p-2 rounded-2xl transition-all duration-500",
                                    isActive && "bg-white/10 shadow-[inset_0_1px_10px_rgba(255,255,255,0.1)] scale-110"
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
