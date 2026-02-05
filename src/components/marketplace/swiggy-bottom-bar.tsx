"use client";

import { cn } from "@/lib/utils";
import { Utensils, ShoppingBag, Stethoscope, Zap, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SwiggyBottomBar() {
    const pathname = usePathname();

    const navItems = [
        {
            name: "Swiggy",
            label: "Clinics",
            icon: Utensils,
            href: "/dashboard/marketplace",
            activeColor: "text-swiggy-orange"
        },
        {
            name: "Instamart",
            label: "Pharmacy",
            icon: ShoppingBag,
            href: "/dashboard/marketplace/pharmacy",
            activeColor: "text-swiggy-orange"
        },
        {
            name: "Dineout",
            label: "Diagnostics",
            icon: Stethoscope,
            href: "/dashboard/marketplace/diagnostics",
            activeColor: "text-swiggy-orange"
        },
        {
            name: "Genie",
            label: "Fast Aid",
            icon: Zap, // Lightning for fast aid
            href: "/dashboard/marketplace/fast-aid",
            activeColor: "text-blue-500" // Genie is usually blue/purple
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white h-20 border-t border-gray-200 flex items-center justify-around px-4 z-50 rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:hidden">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex flex-col items-center gap-1 w-16"
                    >
                        <div className={cn(
                            "transition-colors duration-200",
                            isActive ? item.activeColor : "text-gray-400"
                        )}>
                            <item.icon
                                className={cn("w-6 h-6", isActive && "fill-current")}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                        </div>
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            isActive ? item.activeColor : "text-gray-400"
                        )}>
                            {item.name}
                        </span>
                        {/* Sub-label for HealthFlo Context */}
                        <span className="text-[8px] text-gray-300 -mt-1 scale-75 origin-top">
                            ({item.label})
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
