"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    LayoutDashboard,
    Activity,
    Users,
    Calendar,
    Stethoscope,
    CreditCard,
    Box,
    Settings,
    Zap,
    LucideIcon,
    BarChart3,
    ShieldCheck,
    Briefcase,
    TrendingUp
} from "lucide-react";
import { PermissionGuard } from "@/components/security/permission-guard";
import { useAuth } from "@/lib/auth-context";

interface SidebarItem {
    name: string;
    icon: LucideIcon;
    href: string;
    permission?: "can_view_revenue" | "can_edit_inventory" | "can_view_clinical" | "can_manage_staff";
}

const sidebarItems: SidebarItem[] = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Platform OS", icon: Zap, href: "/dashboard/operations", permission: 'can_manage_staff' },
    { name: "Performance Pulse", icon: BarChart3, href: "/dashboard/analytics", permission: 'can_manage_staff' },
    { name: "Live Queue", icon: Activity, href: "/dashboard/queue" },
    { name: "Patients", icon: Users, href: "/dashboard/patients" },
    { name: "Appointments", icon: Calendar, href: "/dashboard/appointments" },
    { name: "Clinical Master", icon: Stethoscope, href: "/dashboard/clinical", permission: 'can_view_clinical' },
    { name: "Billing", icon: CreditCard, href: "/dashboard/billing", permission: 'can_view_revenue' }, // ADDED
    { name: "Marketplace", icon: Box, href: "/dashboard/marketplace" },
    { name: "Pro Evolution", icon: TrendingUp, href: "/dashboard/professional" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings", permission: 'can_manage_staff' },
];

export function AppSidebar() {
    const pathname = usePathname();
    const { user, updatePermissions } = useAuth();

    return (
        <div className="hidden md:flex flex-col h-screen w-64 border-r border-white/5 glass-frost relative overflow-hidden backdrop-blur-[100px]">
            {/* Ambient Shadow Overlay */}
            <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />

            <div className="flex-1 space-y-4 py-4 overflow-y-auto relative z-10">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-black tracking-tighter text-white uppercase italic">
                        HealthFlo
                    </h2>
                    <p className="px-4 text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mb-8">
                        Clinic Manager v2.0
                    </p>
                    <div className="space-y-1 animate-ios-reveal">
                        {sidebarItems.map((item, index) => {
                            const button = (
                                <Button
                                    key={item.href}
                                    variant={pathname === item.href ? "secondary" : "ghost"}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    className={cn(
                                        "w-full justify-start rounded-xl px-4 py-6 transition-all duration-300 font-black uppercase text-[10px] tracking-widest",
                                        pathname === item.href ? "bg-white text-black shadow-xl" : "text-slate-400 hover:text-white hover:bg-white/5"
                                    )}
                                    asChild
                                >
                                    <Link href={item.href}>
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.name}
                                    </Link>
                                </Button>
                            );

                            if (item.permission) {
                                return (
                                    <PermissionGuard key={item.href} permission={item.permission} fallback={null}>
                                        {button}
                                    </PermissionGuard>
                                );
                            }

                            return button;
                        })}
                    </div>
                </div>
            </div>

            {/* Sidebar Footer: Solo Mode Toggle */}
            <div className="p-4 border-t border-white/5 bg-slate-950/20 backdrop-blur-3xl">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 transition-all duration-700">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
                            <Zap className="w-4 h-4 fill-white" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-white uppercase tracking-tighter">Solo Mode</div>
                            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Admin Bypass</div>
                        </div>
                    </div>
                    <Switch
                        checked={user?.permissions?.solo_mode || false}
                        onCheckedChange={(checked) => updatePermissions({ solo_mode: checked })}
                    />
                </div>
            </div>
        </div>
    );
}
