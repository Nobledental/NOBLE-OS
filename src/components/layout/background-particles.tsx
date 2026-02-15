"use client";

/**
 * Noble White — Clean Static Background
 * No animated blobs, vignettes, or scanner lines.
 * Subtle grid texture on a clean white surface.
 */
export function BackgroundParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-slate-50 transition-colors duration-300">
            {/* Subtle Grid Texture (Clinical Precision) */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />
            {/* Very subtle warm glow at top — clinical ambient light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[30vh] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.03)_0%,transparent_70%)]" />
        </div>
    );
}
