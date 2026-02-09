"use client";

import { motion } from "framer-motion";

export function BackgroundParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Frosty Overlay (Vision Screen) */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[100px] z-10" />

            <motion.div
                animate={{
                    x: [0, 150, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.4, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-teal-400/20 rounded-full blur-[150px] z-0"
            />
            <motion.div
                animate={{
                    x: [0, -120, 0],
                    y: [0, 180, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 35,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-1/2 -right-40 w-[700px] h-[700px] bg-cyan-400/15 rounded-full blur-[120px] z-0"
            />
            <motion.div
                animate={{
                    x: [0, 80, 0],
                    y: [0, -100, 0],
                    scale: [1, 1.5, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute bottom-0 left-1/4 w-[900px] h-[900px] bg-emerald-300/10 rounded-full blur-[180px] z-0"
            />
        </div>
    );
}
