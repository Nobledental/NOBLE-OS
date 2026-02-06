"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Appointments", href: "/dashboard/appointments", icon: CalendarDays },
    { label: "Clinical", href: "/dashboard/clinical", icon: Stethoscope },
    { label: "Patients", href: "/dashboard/patients", icon: Users },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Billing", href: "/dashboard/billing", icon: Receipt },
    { label: "Settlement", href: "/dashboard/settlement", icon: Wallet },
    { label: "Specialists", href: "/dashboard/specialists", icon: UserPlus },
    { label: "Tariff", href: "/dashboard/tariff", icon: ScrollText },
    { label: "Marketplace", href: "/dashboard/marketplace", icon: Store },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function FloatingSidebar() {
    const pathname = usePathname();

    return (
        <TooltipProvider>
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4"
            >
                {/* Main Dock */}
                <div className="glass-panze p-3 rounded-full flex flex-col gap-3 shadow-2xl border border-white/40">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mb-2 shadow-lg shadow-indigo-500/30">
                        <Activity className="w-5 h-5 text-white" />
                    </div>

                    {NAV_ITEMS.map((item) => {
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

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-bold bg-red-500 text-white border-none ml-2">
                            Logout
                        </TooltipContent>
                    </Tooltip>
                </div>
            </motion.div>
        </TooltipProvider>
    );
}
