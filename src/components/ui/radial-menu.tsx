"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

interface RadialAction {
    id: string;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    color?: string; // tailwind color class e.g., "bg-red-500"
}

interface RadialMenuProps {
    isOpen: boolean;
    onClose: () => void;
    actions: RadialAction[];
    position?: { x: number; y: number }; // Absolute position
}

export function RadialMenu({ isOpen, onClose, actions, position }: RadialMenuProps) {
    const radius = 80; // Distance of items from center

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="absolute z-50 pointer-events-none"
                    style={{
                        left: position?.x || "50%",
                        top: position?.y || "50%",
                        transform: "translate(-50%, -50%)"
                    }}
                >
                    {/* Backdrop for click-away (optional, but good for UX) */}
                    <div
                        className="fixed inset-0 pointer-events-auto"
                        onClick={onClose}
                    />

                    {/* Menu Items */}
                    <div className="relative w-0 h-0 pointer-events-auto">
                        {actions.map((action, index) => {
                            const angle = (360 / actions.length) * index - 90; // Start from top
                            const radian = (angle * Math.PI) / 180;
                            const x = Math.cos(radian) * radius;
                            const y = Math.sin(radian) * radius;

                            return (
                                <motion.button
                                    key={action.id}
                                    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                                    animate={{ x, y, opacity: 1, scale: 1 }}
                                    exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20,
                                        delay: index * 0.05
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick();
                                        onClose();
                                    }}
                                    className={cn(
                                        "absolute w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white/20 hover:scale-110 transition-transform",
                                        action.color || "bg-indigo-500"
                                    )}
                                    title={action.label}
                                >
                                    {action.icon}
                                </motion.button>
                            );
                        })}

                        {/* Center Close Button */}
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xl border border-white/20 hover:bg-red-500 transition-colors"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
