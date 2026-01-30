"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PermissionGuard } from "@/components/security/permission-guard";

const sidebarItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Live Queue", icon: Activity, href: "/dashboard/queue" },
    { name: "Patients", icon: Users, href: "/dashboard/patients" },
    { name: "Appointments", icon: Calendar, href: "/dashboard/appointments" },
    { name: "Clinical Master", icon: Stethoscope, href: "/dashboard/clinical", permission: 'can_view_clinical' },
    { name: "Billing & Fintech", icon: CreditCard, href: "/dashboard/billing", permission: 'can_view_revenue' },
    { name: "Inventory", icon: Box, href: "/dashboard/inventory", permission: 'can_edit_inventory' },
    { name: "Settings", icon: Settings, href: "/dashboard/settings", permission: 'can_manage_staff' },
] as const;

interface SidebarItem {
    name: string;
    icon: any;
    href: string;
    permission?: "can_view_revenue" | "can_edit_inventory" | "can_view_clinical" | "can_manage_staff";
}

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <div className="pb-12 min-h-screen w-64 border-r bg-slate-50/50 dark:bg-slate-900/50 hidden md:block">
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        HealthFlo
                    </h2>
                    <p className="px-4 text-xs text-muted-foreground mb-4">
                        Clinic Manager v2.0
                    </p>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => {
                            const button = (
                                <Button
                                    key={item.href}
                                    variant={pathname === item.href ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start",
                                        pathname === item.href && "bg-slate-100 dark:bg-slate-800"
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
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Quick Actions
                    </h2>
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start">
                            <span className="mr-2">⌘K</span> Command Palette
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
