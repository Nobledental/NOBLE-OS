"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Check } from "lucide-react";

interface GestureSliderProps {
    label: string;
    onConfirm: () => void;
    className?: string;
    successLabel?: string;
}

export function GestureSlider({
    label,
    onConfirm,
    className,
    successLabel = "Confirmed",
}: GestureSliderProps) {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [trackWidth, setTrackWidth] = useState(0);
    const [thumbX, setThumbX] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    useEffect(() => {
        if (trackRef.current) {
            setTrackWidth(trackRef.current.offsetWidth);
        }
    }, []);

    const handleStart = () => {
        if (isConfirmed) return;
        isDragging.current = true;
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging.current || isConfirmed) return;

        const track = trackRef.current;
        if (!track) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const rect = track.getBoundingClientRect();
        let x = clientX - rect.left - 24; // 24 is half thumb width

        const maxX = trackWidth - 64; // 64 is thumb width + padding
        x = Math.max(0, Math.min(x, maxX));

        setThumbX(x);

        if (x >= maxX * 0.95) {
            handleConfirm();
        }
    };

    const handleEnd = () => {
        if (isConfirmed) return;
        isDragging.current = false;
        if (thumbX < (trackWidth - 64) * 0.95) {
            setThumbX(0);
        }
    };

    const handleConfirm = () => {
        setIsConfirmed(true);
        isDragging.current = false;
        setThumbX(trackWidth - 64);
        onConfirm();
    };

    return (
        <div
            ref={trackRef}
            className={cn(
                "relative h-16 w-full glass rounded-full p-2 flex items-center overflow-hidden transition-all duration-500",
                isConfirmed ? "bg-emerald-500/20 border-emerald-500/50" : "bg-slate-100/50 dark:bg-slate-900/50",
                className
            )}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
        >
            <div
                className="absolute inset-x-0 text-center pointer-events-none select-none"
                style={{ opacity: 1 - thumbX / (trackWidth - 64) }}
            >
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
                    {label}
                </span>
            </div>

            <div
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                style={{ transform: `translateX(${thumbX}px)` }}
                className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors duration-300 shadow-lg relative z-10",
                    isConfirmed ? "bg-emerald-500 text-white" : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                )}
            >
                {isConfirmed ? (
                    <Check className="w-6 h-6 animate-ios-reveal" />
                ) : (
                    <ChevronRight className="w-6 h-6" />
                )}
            </div>

            {isConfirmed && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest animate-ios-reveal">
                        {successLabel}
                    </span>
                </div>
            )}
        </div>
    );
}
