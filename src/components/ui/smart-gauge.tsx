"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SmartGaugeProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label?: string;
    subLabel?: string;
    className?: string;
}

export function SmartGauge({
    value,
    max = 100,
    size = 120,
    strokeWidth = 12,
    color = "#00BFA5", // Default Teal
    label,
    subLabel,
    className,
}: SmartGaugeProps) {
    const percentage = Math.min(Math.max(value / max, 0), 1);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - percentage * circumference;

    return (
        <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-800"
                />
                {/* Progress */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                    style={{
                        filter: `drop-shadow(0 0 6px ${color}44)`,
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {label && <span className="text-xl font-bold tracking-tight">{label}</span>}
                {subLabel && <span className="text-[10px] text-muted-foreground uppercase font-semibold">{subLabel}</span>}
            </div>
        </div>
    );
}
