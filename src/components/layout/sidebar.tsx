"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    Activity,
    CreditCard,
    Box
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Live Queue", icon: Activity, href: "/dashboard/queue" },
    { name: "Patients", icon: Users, href: "/dashboard/patients" },
    { name: "Appointments", icon: Calendar, href: "/dashboard/appointments" },
    { name: "Billing & Fintech", icon: CreditCard, href: "/dashboard/billing" },
    { name: "Inventory", icon: Box, href: "/dashboard/inventory" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

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
                        {sidebarItems.map((item) => (
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
                        ))}
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
