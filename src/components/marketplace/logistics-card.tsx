"use client";

import { Package, MapPin, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogisticsCard() {
    return (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full -ml-8 -mb-8 blur-xl" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-black italic tracking-tight">NOBLE LOGISTICS</h3>
                        <p className="text-blue-100 text-sm font-medium mt-1">
                            Pickup & Drop for Lab Cases
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                </div>

                <div className="space-y-3 bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                        <div className="flex-1">
                            <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Pickup From</p>
                            <p className="text-sm font-semibold truncate">Noble Dental, Anna Nagar</p>
                        </div>
                    </div>
                    <div className="pl-[3px]">
                        <div className="w-[2px] h-4 bg-white/20 ml-0.5" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <div className="flex-1">
                            <p className="text-xs text-white/60 font-black uppercase tracking-widest">Destination Lab</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white/90 italic">Select Lab Partner...</span>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-white/20 text-white">
                                    <MapPin className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-6">
                    <Button className="flex-1 bg-white text-indigo-700 hover:bg-indigo-50 font-black uppercase text-[10px] tracking-widest rounded-xl h-12 shadow-lg group border-none">
                        Book Lab Pickup
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <div className="flex flex-col items-center justify-center min-w-[60px]">
                        <Clock className="w-4 h-4 text-white/60 mb-1" />
                        <span className="text-[10px] font-black text-white/80">~25 MINS</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
