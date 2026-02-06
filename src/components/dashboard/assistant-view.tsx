"use client";

import { motion } from "framer-motion";
import { ActiveQueue } from "./active-queue";
import { PanzeCard } from "@/components/ui/panze-card";
import { Hammer, Package, Clock, ShieldCheck } from "lucide-react";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
};

export function AssistantDashboardView() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
            {/* Prep & Support Focus */}
            <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">
                <PanzeCard className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center text-center gap-4 border-none shadow-2xl">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                        <Hammer className="w-10 h-10 text-brand-primary" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Chair 01 Preparation</h3>
                        <p className="text-slate-400 text-sm max-w-sm mx-auto">Upcoming: Root Canal for Suresh. Please ensure sterilization pack C4 is ready.</p>
                    </div>
                    <div className="flex gap-4 mt-2">
                        <div className="flex flex-col items-center p-3 bg-white/5 rounded-2xl min-w-[100px]">
                            <Clock className="w-5 h-5 text-orange-400 mb-1" />
                            <span className="text-xs font-bold">15 Mins</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-white/5 rounded-2xl min-w-[100px]">
                            <ShieldCheck className="w-5 h-5 text-green-400 mb-1" />
                            <span className="text-xs font-bold">Sterilized</span>
                        </div>
                    </div>
                </PanzeCard>

                <ActiveQueue />
            </motion.div>

            {/* Inventory & Marketplace Focus */}
            <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
                <PanzeCard className="p-6">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-indigo-500" />
                        Inventory Alerts
                    </h4>
                    <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-red-900">Gloves (Medium)</div>
                                <div className="text-[10px] text-red-600">Only 2 boxes left</div>
                            </div>
                            <button className="text-[10px] bg-red-600 text-white px-2 py-1 rounded-full font-bold">ORDER</button>
                        </div>
                        <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-orange-900">Surgical Tips</div>
                                <div className="text-[10px] text-orange-600">Restock due in 2 days</div>
                            </div>
                        </div>
                    </div>
                </PanzeCard>

                {/* Visual Placeholder for Marketplace integration */}
                <PanzeCard className="p-6 h-full flex flex-col items-center justify-center text-center gap-4 border-dashed border-2 border-slate-200 bg-slate-50">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Package className="w-6 h-6 text-slate-300" />
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-400">Restock Hub</h5>
                        <p className="text-[10px] text-slate-400">Connect to marketplace vendors</p>
                    </div>
                </PanzeCard>
            </motion.div>
        </div>
    );
}
