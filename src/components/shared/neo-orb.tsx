"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";

interface NEOOrbProps {
    status?: "idle" | "thinking" | "alert" | "listening";
    className?: string;
}

export function NEOOrb({ status = "idle", className }: NEOOrbProps) {
    return (
        <div className={cn("relative flex items-center justify-center w-12 h-12", className)}>
            {/* Outer Glows */}
            <div className={cn(
                "absolute inset-0 rounded-full blur-xl transition-all duration-1000",
                status === "idle" && "bg-indigo-500/20",
                status === "thinking" && "bg-blue-500/40 animate-pulse",
                status === "listening" && "bg-purple-500/40 animate-pulse",
                status === "alert" && "bg-red-500/40 animate-bounce"
            )} />

            {/* Glass Body */}
            <div className={cn(
                "relative w-full h-full rounded-full glass flex items-center justify-center border-white/30 dark:border-white/20 shadow-lg",
                "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-tr before:from-white/20 before:to-transparent",
                "animate-ios-reveal"
            )}>
                <Brain className={cn(
                    "w-6 h-6 transition-colors duration-500",
                    status === "idle" && "text-indigo-600 dark:text-indigo-400",
                    status === "thinking" && "text-blue-500 animate-pulse",
                    status === "listening" && "text-purple-500 animate-pulse",
                    status === "alert" && "text-red-500"
                )} />

                {/* Core Light */}
                <div className={cn(
                    "absolute w-2 h-2 rounded-full",
                    status === "idle" && "bg-indigo-400 blur-[2px]",
                    status === "thinking" && "bg-blue-400 blur-[4px] animate-ping",
                    status === "listening" && "bg-purple-400 blur-[4px] animate-ping",
                    status === "alert" && "bg-red-400 blur-[2px]"
                )} />
            </div>
        </div>
    );
}
