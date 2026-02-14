"use client";

import { motion } from "framer-motion";
import { LayoutGrid, Users, Activity, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
    { icon: LayoutGrid, label: "Home", href: "/dashboard" },
    { icon: Users, label: "Patients", href: "/dashboard/patients" },
    { icon: Activity, label: "Queue", href: "/dashboard/queue" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function MobileBottomDock() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-4 left-0 right-0 z-[60] md:hidden px-2">
            <div className="flex items-center justify-around gap-2 p-2 bg-[#161c26]/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl max-w-2xl mx-auto">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className="flex-1 min-w-0">
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-2xl transition-all duration-300",
                                    isActive
                                        ? "bg-white text-black shadow-lg"
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 transition-all",
                                    isActive && "w-6 h-6"
                                )} />
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-wider truncate w-full text-center",
                                    isActive ? "text-black" : "text-slate-500"
                                )}>
                                    {item.label}
                                </span>
                            </motion.div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
