"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreatmentSimulatorProps {
    type: 'whitening' | 'veneers' | 'aligners';
    className?: string;
}

export function TreatmentSimulator({ type, className }: TreatmentSimulatorProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    // Image Configuration based on Treatment Type
    const config = {
        whitening: {
            before: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?q=80&w=800&auto=format&fit=crop", // Yellowish teeth (generic smile)
            after: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop", // Bright smile
            label: "Teeth Whitening",
            description: "Experience professional whitening results in just one session."
        },
        veneers: {
            before: "https://plus.unsplash.com/premium_photo-1661766569022-1b7f918ac3f3?q=80&w=800&auto=format&fit=crop", // Imperfect smile
            after: "https://images.unsplash.com/photo-1588776814546-1ffcf4722e12?q=80&w=800&auto=format&fit=crop", // Perfect veneers
            label: "Porcelain Veneers",
            description: "Custom-crafted veneers for a flawless, permanent smile makeover."
        },
        aligners: {
            before: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800&auto=format&fit=crop",
            after: "https://images.unsplash.com/photo-1616391182219-e94d827f83e2?q=80&w=800&auto=format&fit=crop",
            label: "Invisible Aligners",
            description: "Straighten your teeth discreetly with clear aligners."
        }
    };

    const currentConfig = config[type] || config.whitening;

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPosition(percent);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPosition(percent);
    };

    return (
        <div className={cn("w-full max-w-2xl mx-auto space-y-4", className)}>
            <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                    <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm">AI Simulation</span>
                    {currentConfig.label}
                </h3>
                <p className="text-sm text-zinc-400">{currentConfig.description}</p>
            </div>

            <div
                ref={containerRef}
                className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-ew-resize border border-white/10 shadow-2xl select-none"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
            >
                {/* AFTER Image (Background) */}
                <img
                    src={currentConfig.after}
                    alt="After Treatment"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* BEFORE Image (Clipped overlay) */}
                <div
                    className="absolute inset-0 w-full h-full overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <img
                        src={currentConfig.before}
                        alt="Before Treatment"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Before Label */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                        BEFORE
                    </div>
                </div>

                {/* After Label */}
                <div className="absolute top-4 right-4 bg-indigo-500/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                    AFTER
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-black">
                        <MoveHorizontal size={20} />
                    </div>
                </div>
            </div>

            <p className="text-xs text-center text-white/30 italic">
                * Simulated results. Actual results may vary based on individual anatomy.
            </p>
        </div>
    );
}
