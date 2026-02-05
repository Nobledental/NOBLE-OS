"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutGrid,
    Calendar,
    Users,
    Stethoscope,
    CreditCard,
    Settings,
    FileText,
    MessageSquare,
    Folder,
    HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";

const sidebarItems = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "Schedule", icon: Calendar, href: "/dashboard/appointments" },
    { name: "Patients", icon: Users, href: "/dashboard/patients" },
    { name: "Clinical", icon: Stethoscope, href: "/dashboard/clinical" },
    { name: "Billing", icon: CreditCard, href: "/dashboard/billing" },
    { name: "Reports", icon: FileText, href: "/dashboard/reports" },
    { name: "Messages", icon: MessageSquare, href: "/dashboard/messages" },
    { name: "Files", icon: Folder, href: "/dashboard/files" },
];

const bottomItems = [
    { name: "Help", icon: HelpCircle, href: "/help" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function FloatingSidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex flex-col items-center py-6 h-screen relative z-50 ml-4">
            {/* Main Dock */}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex-1 flex flex-col items-center bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-3 py-6 gap-6 w-[80px]"
            >
                {/* Logo Placeholder */}
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-lg">P</span>
                </div>

                <div className="flex flex-col gap-4 w-full items-center flex-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative group"
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                                    isActive
                                        ? "bg-slate-900 text-white shadow-lg scale-105"
                                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                )}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                {/* Tooltip */}
                                <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    {item.name}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom Items */}
                <div className="flex flex-col gap-4 w-full items-center mt-auto pt-4 border-t border-slate-100">
                    {bottomItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <item.icon className="w-5 h-5" />
                        </Link>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
