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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] md:hidden w-[95vw] max-w-md">
            <div className="flex items-center justify-center gap-1 p-1 bg-[#161c26]/80 backdrop-blur-2xl border border-white/5 rounded-full shadow-2xl">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className="flex-1">
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    "flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-all duration-300",
                                    isActive
                                        ? "bg-white text-black shadow-lg"
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        className="text-[10px] font-black uppercase tracking-widest hidden sm:inline-block"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </motion.div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
