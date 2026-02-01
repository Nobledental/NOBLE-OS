"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    gradient?: boolean;
    intensity?: "low" | "medium" | "high";
}

export function GlassCard({
    children,
    className,
    gradient = false,
    intensity = "medium",
    ...props
}: GlassCardProps) {
    const intensities = {
        low: "backdrop-blur-md bg-white/20 dark:bg-slate-900/10",
        medium: "backdrop-blur-xl bg-white/40 dark:bg-slate-900/30",
        high: "backdrop-blur-2xl bg-white/60 dark:bg-slate-900/50",
    };

    return (
        <div
            className={cn(
                "rounded-[24px] border border-white/20 dark:border-white/10 shadow-xl overflow-hidden",
                intensities[intensity],
                gradient && "bg-gradient-to-br from-white/40 to-white/10 dark:from-slate-900/40 dark:to-slate-900/10",
                "shadow-[0_20px_50px_rgba(0,0,0,0.1)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
