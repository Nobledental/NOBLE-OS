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

    // RBAC-enforced navigation filtering
    const filteredItems = NAV_ITEMS.filter(item => {
        if (item.id === 'dashboard') return true; // Dashboard always visible
        if (permissions.includes('all')) return true; // OWNER/ADMIN see everything
        return permissions.includes(item.id);
    });

    // Ensure priority items appear first
    const priorityIds = PRIORITY_ITEMS[user?.role || ""] || ["dashboard", "appointments", "clinical", "patients"];

    // Sort items: priority items first, then others
    const sortedItems = [
        ...filteredItems.filter(item => priorityIds.includes(item.id)),
        ...filteredItems.filter(item => !priorityIds.includes(item.id))
    ];

    return (
        <TooltipProvider>
            {/* Desktop Dock (Apple Organic Bottom Dock) - Hidden on Mobile/Tablet */}
            <motion.div
                initial={{ y: 100, x: "-50%", opacity: 0 }}
                animate={{ y: 0, x: "-50%", opacity: 1 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden lg:flex flex-row flex-wrap items-center justify-center gap-2 p-3 bg-white/60 backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-200 rounded-[2.5rem] transition-all duration-700 hover:border-slate-300 max-w-[90vw]"
            >
                <div className="flex flex-row flex-wrap items-center justify-center gap-2 px-2">
                    <div className="group relative shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neo-vibrant-blue to-neo-electric-blue flex items-center justify-center text-white shadow-xl shadow-neo-vibrant-blue/20 group-hover:scale-105 transition-all duration-700 cursor-pointer">
                            <Activity className="w-5 h-5 drop-shadow-md" />
                        </div>
                    </div>

                    <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                        {sortedItems.map((item) => {
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
                                        <div className="space-y-0.5">
                                            <div>{item.label}</div>
                                            {item.id === 'clinical' && (
                                                <div className="text-[8px] font-normal normal-case tracking-normal text-slate-600 mt-1">
                                                    Requires clinical access
                                                </div>
                                            )}
                                            {item.id === 'staff' && (
                                                <div className="text-[8px] font-normal normal-case tracking-normal text-slate-600 mt-1">
                                                    Requires staff management permission
                                                </div>
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>

                    <div className="w-px h-6 bg-slate-200 mx-2 shrink-0" />

                    <button
                        onClick={logout}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all duration-500 group shrink-0"
                    >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </motion.div>

            {/* Mobile/Tablet Bottom Bar - 4 Items + More Menu */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-4 left-0 right-0 z-50 flex lg:hidden px-2"
            >
                <div className="w-full max-w-2xl mx-auto">
                    <div className="flex items-center justify-around gap-1 p-2 bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200/50">
                        {/* First 4 Priority Items */}
                        {sortedItems.slice(0, 4).map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                            const Icon = item.icon;

                            return (
                                <Link key={item.href} href={item.href} className="flex-1">
                                    <div className={cn(
                                        "flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl transition-all duration-300",
                                        isActive ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100"
                                    )}>
                                        <Icon className={cn(
                                            "transition-all",
                                            isActive ? "w-6 h-6" : "w-5 h-5"
                                        )} />
                                        <span className={cn(
                                            "text-[8px] font-bold uppercase tracking-wider truncate w-full text-center",
                                            isActive ? "text-white" : "text-slate-600"
                                        )}>
                                            {item.label}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}

                        {/* More Menu Trigger (If > 4 items) */}
                        {sortedItems.length > 4 && (
                            <div className="flex-1">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className={cn(
                                        "w-full flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl transition-all duration-300",
                                        isMenuOpen ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    <Grid className="w-5 h-5" />
                                    <span className="text-[8px] font-bold uppercase tracking-wider">More</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Mobile/Tablet More Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            className="fixed bottom-24 left-4 right-4 z-50 lg:hidden"
                        >
                            <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] p-4 shadow-2xl border border-white/40">
                                <div className="grid grid-cols-4 gap-4">
                                    {sortedItems.slice(4).map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href;

                                        return (
                                            <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm",
                                                        isActive ? "bg-slate-900 text-white" : "bg-white text-slate-500"
                                                    )}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight text-center leading-tight">
                                                        {item.label}
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}

                                    <button
                                        onClick={logout}
                                        className="flex flex-col items-center justify-center gap-2"
                                    >
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-50 text-red-500 transition-all shadow-sm border border-red-100">
                                            <LogOut className="w-5 h-5" />
                                        </div>
                                        <span className="text-[9px] font-bold text-red-600 uppercase tracking-tight text-center leading-tight">
                                            Logout
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </TooltipProvider>
    );
}
