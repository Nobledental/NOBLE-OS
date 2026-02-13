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
    TrendingUp,
    ChevronDown,
    Building2,
    MapPin
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
    const { user, updateFeaturePermissions, selectClinic } = useAuth();

    return (
        <div className="hidden md:flex flex-col h-screen w-64 border-r border-white/5 glass-frost relative overflow-hidden backdrop-blur-[100px]">
            {/* Ambient Shadow Overlay */}
            <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />

            <div className="flex-1 space-y-4 py-4 overflow-y-auto relative z-10">
                {/* Branch Switcher */}
                <div className="px-6 mb-6">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between group-hover:bg-white/5 p-1 rounded-xl transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white uppercase tracking-tighter truncate max-w-[120px]">
                                        {user?.selectedClinic?.name || "Select Branch"}
                                    </span>
                                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                        <MapPin className="w-2 h-2" />
                                        {user?.selectedClinic?.location || "No location"}
                                    </span>
                                </div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="px-3 py-2">
                    <h2 className="mb-1 px-4 text-base font-black tracking-tighter text-white uppercase">
                        HealthFlo
                    </h2>
                    <p className="px-4 text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] mb-4">
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
                                        "w-full justify-start rounded-lg px-3 py-3 transition-all duration-300 font-black uppercase text-[10px] tracking-widest",
                                        pathname === item.href ? "bg-white text-black shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"
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
                        checked={user?.featurePermissions?.solo_mode || false}
                        onCheckedChange={(checked) => updateFeaturePermissions({ solo_mode: checked })}
                    />
                </div>
            </div>
        </div>
    );
}
