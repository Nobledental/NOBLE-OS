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

    // Items to show directly on the bar (max 4)
    const topBarItems = filteredItems.filter(item => priorityIds.includes(item.id)).slice(0, 4);

    // Rest of items for the "More" menu
    const moreItems = filteredItems.filter(item => !topBarItems.some(ti => ti.id === item.id));

    return (
        <TooltipProvider>
            {/* Desktop Sidebar (Fixed Left) */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-4"
            >
                <div className="glass-panze p-3 rounded-full flex flex-col gap-3 shadow-2xl border border-white/40">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mb-2 shadow-lg shadow-indigo-500/30">
                        <Activity className="w-5 h-5 text-white" />
                    </div>

                    {filteredItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                    <Link href={item.href}>
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative group",
                                            isActive
                                                ? "bg-slate-900 text-white shadow-lg scale-110"
                                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                        )}>
                                            <Icon className="w-5 h-5" />
                                            {isActive && (
                                                <motion.div
                                                    layoutId="sidebar-bubble"
                                                    className="absolute inset-0 border-2 border-white/20 rounded-full"
                                                />
                                            )}
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="font-bold bg-slate-900 text-white border-none ml-2">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}

                    <div className="h-px w-6 bg-slate-200 mx-auto my-1" />

                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>

            {/* Mobile/Tablet Bottom Bar */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex lg:hidden w-[92%] max-w-md h-16 glass-panze rounded-[2rem] items-center justify-around px-2 shadow-2xl border border-white/40"
            >
                {topBarItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href} className="flex-1">
                            <div className={cn(
                                "flex flex-col items-center justify-center gap-1 transition-all duration-300 py-2 rounded-2xl mx-1",
                                isActive ? "text-indigo-600 bg-indigo-50/50" : "text-slate-500 hover:bg-slate-50"
                            )}>
                                <Icon className={cn("w-5 h-5", isActive && "scale-110")} />
                                <span className="text-[9px] font-black uppercase tracking-tighter">{item.label.slice(0, 8)}</span>
                            </div>
                        </Link>
                    );
                })}

                {/* More Menu for Mobile */}
                <div className="flex-1 relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={cn(
                            "w-full flex flex-col items-center justify-center gap-1 transition-all duration-300 py-2 rounded-2xl mx-1",
                            isMenuOpen ? "text-indigo-600 bg-indigo-100/50" : "text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <Grid className="w-5 h-5" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Menu</span>
                    </button>

                    {/* Floating Menu Popover */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="absolute bottom-20 right-0 w-72 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 z-[60] origin-bottom-right"
                            >
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {moreItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={cn(
                                                    "flex flex-col items-center gap-2 p-4 rounded-3xl transition-all",
                                                    isActive ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                                                )}
                                            >
                                                <div className={cn(
                                                    "p-2.5 rounded-2xl",
                                                    isActive ? "bg-indigo-100" : "bg-white shadow-sm"
                                                )}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-black text-center leading-tight uppercase tracking-tight">{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                                <button className="w-full flex items-center justify-center gap-3 p-4 rounded-[1.5rem] bg-red-50 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-colors border border-red-100">
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Backdrop for closing menu */}
                    {isMenuOpen && (
                        <div
                            className="fixed inset-0 z-[55] bg-slate-900/10 backdrop-blur-[2px]"
                            onClick={() => setIsMenuOpen(false)}
                        />
                    )}
                </div>
            </motion.div>
        </TooltipProvider>
    );
}
