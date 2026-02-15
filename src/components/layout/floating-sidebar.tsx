"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    CalendarDays,
    Stethoscope,
    Users,
    Receipt,
    Settings,
    Store,
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
    { label: "Sterilization", href: "/dashboard/sterilization", icon: ShieldCheck, id: "sterilization" },
    { label: "Marketplace", href: "/dashboard/marketplace", icon: Store, id: "marketplace" },
    { label: "Settings", href: "/dashboard/settings", icon: Settings, id: "settings" },
];

const PRIORITY_ITEMS: Record<string, string[]> = {
    ADMIN: ["dashboard", "appointments", "clinical", "patients", "billing", "staff", "marketplace", "settings", "sterilization"],
    DOCTOR: ["appointments", "clinical", "patients"],
    CONSULTANT: ["appointments", "clinical", "patients"],
    RECEPTIONIST: ["appointments", "patients", "billing"],
    ASSISTANT: ["sterilization", "settings"],
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

    const priorityIds = PRIORITY_ITEMS[user?.role || ""] || ["dashboard", "appointments", "clinical", "patients"];
    const sortedItems = [
        ...filteredItems.filter(item => priorityIds.includes(item.id)),
        ...filteredItems.filter(item => !priorityIds.includes(item.id))
    ];

    return (
        <TooltipProvider>
            {/* ═══ Desktop Dock — Bento-Glass, No Bounce ═══ */}
            <div
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden lg:flex flex-row flex-wrap items-center justify-center gap-1.5 p-3 bg-white/95 backdrop-blur-xl shadow-lg border border-slate-200/60 rounded-[2rem] max-w-[90vw] transition-colors"
            >
                <div className="flex flex-row flex-wrap items-center justify-center gap-1.5 px-1">
                    {/* Status Indicator (replaces NEO Orb) */}
                    <div className="shrink-0 px-1">
                        <div className="w-2 h-2 rounded-full bg-clinical-progress" />
                    </div>

                    <div className="flex flex-row flex-wrap items-center justify-center gap-1">
                        {sortedItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Tooltip key={item.id}>
                                    <TooltipTrigger asChild>
                                        <Link href={item.href}>
                                            <div
                                                className={cn(
                                                    "relative w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-200",
                                                    isActive
                                                        ? "bg-clinical-action text-white shadow-md"
                                                        : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                                )}
                                            >
                                                <Icon className="w-5 h-5" />
                                                {isActive && (
                                                    <div className="absolute -bottom-1.5 w-4 h-1 bg-clinical-action rounded-full" />
                                                )}
                                            </div>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="bg-white/95 backdrop-blur-xl border-slate-200 text-[9px] font-bold uppercase tracking-widest text-slate-700 px-3 py-1.5 mb-2">
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>

                    <div className="w-px h-6 bg-slate-200 mx-1.5 shrink-0" />

                    <button
                        onClick={logout}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors duration-200 shrink-0"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* ═══ Mobile/Tablet Bottom Bar — Glove-Ready 48px ═══ */}
            <div className="fixed bottom-4 left-0 right-0 z-50 flex lg:hidden px-2">
                <div className="w-full max-w-2xl mx-auto">
                    <div className="flex items-center justify-around gap-1 p-2 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-lg border border-slate-200/60">
                        {sortedItems.slice(0, 4).map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                            const Icon = item.icon;

                            return (
                                <Link key={item.href} href={item.href} className="flex-1">
                                    <div className={cn(
                                        "flex flex-col items-center justify-center gap-1 min-h-[48px] px-2 rounded-xl transition-colors duration-200",
                                        isActive ? "bg-clinical-action text-white shadow-md" : "text-slate-400 hover:bg-slate-50"
                                    )}>
                                        <Icon className="w-5 h-5" />
                                        <span className={cn(
                                            "text-[8px] font-bold uppercase tracking-wider truncate w-full text-center",
                                            isActive ? "text-white" : "text-slate-500"
                                        )}>
                                            {item.label}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}

                        {/* More Menu */}
                        {sortedItems.length > 4 && (
                            <div className="flex-1">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className={cn(
                                        "w-full flex flex-col items-center justify-center gap-1 min-h-[48px] px-2 rounded-xl transition-colors duration-200",
                                        isMenuOpen ? "bg-slate-100 text-slate-700" : "text-slate-400 hover:bg-slate-50"
                                    )}
                                >
                                    <Grid className="w-5 h-5" />
                                    <span className="text-[8px] font-bold uppercase tracking-wider">More</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══ Mobile More Menu Overlay ═══ */}
            {isMenuOpen && (
                <>
                    <div
                        onClick={() => setIsMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 lg:hidden"
                    />
                    <div className="fixed bottom-24 left-4 right-4 z-50 lg:hidden">
                        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-4 shadow-xl border border-slate-200/60">
                            <div className="grid grid-cols-4 gap-4">
                                {sortedItems.slice(4).map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;

                                    return (
                                        <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                                                    isActive ? "bg-clinical-action text-white" : "bg-slate-50 text-slate-500"
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
                    </div>
                </>
            )}
        </TooltipProvider>
    );
}
