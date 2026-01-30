"use client";

import { Tooth } from "./tooth";

export function DentalMap() {
    // Coordinates generator (Simplified Arch Curve)
    const getCoords = (index: number, total: number) => {
        const width = 600;
        const height = 200;
        const x = (index / total) * width + 50;
        // Simple quadratic curve offset
        const mid = total / 2;
        const dist = Math.abs(index - mid);
        const y = Math.pow(dist, 2) * 1.5 + 20;

        return { x, y: height - y };
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border p-8 select-none">
            {/* SVG Viewport */}
            <svg viewBox="0 0 700 500" className="w-full max-w-[800px] h-auto">
                {/* Upper Arch (1-16) */}
                <g id="upper-arch">
                    {Array.from({ length: 16 }).map((_, i) => {
                        const toothId = 18 - (i + 1); // 1-16 right to left logic adjusted usually 1-16 is right to left for patient
                        // Universal: 1 (Upper Right 3rd Molar) -> 16 (Upper Left 3rd Molar)
                        // Let's stick to standard 1-16 left-to-right on screen (Right-to-left in mouth)
                        const id = i + 1;
                        const { x, y } = getCoords(i, 16);
                        return <Tooth key={id} id={id} x={x} y={y} />;
                    })}
                </g>

                {/* Lower Arch (32-17) */}
                <g id="lower-arch" transform="translate(0, 250)">
                    {Array.from({ length: 16 }).map((_, i) => {
                        const id = 32 - i; // 32..17
                        const { x, y } = getCoords(i, 16);
                        return <Tooth key={id} id={id} x={x} y={y} isLower />;
                    })}
                </g>
            </svg>

            <div className="text-xs text-muted-foreground mt-4">
                Click to Select • Ctrl+Click for Multi-Select
            </div>
        </div>
    );
}
