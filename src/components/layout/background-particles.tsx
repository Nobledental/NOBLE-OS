"use client";

import { motion } from "framer-motion";

export function BackgroundParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#0f1115]">
            {/* Subtle Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

            {/* Ambient Top Glow - Darkened */}
            <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-black via-slate-950/20 to-transparent" />

            {/* Medizinisch Floor Mist / Bottom Glow - Final Intensification */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[180%] h-[60vh] bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.06)_35%,transparent_70%)] blur-[120px]" />
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-white/25 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]" />

            {/* Room Framing (Final Depth) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

            {/* Subtle Deep Particles */}
            <motion.div
                animate={{
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px]"
            />
            <motion.div
                animate={{
                    opacity: [0.05, 0.1, 0.05],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"
            />
        </div>
    );
}
