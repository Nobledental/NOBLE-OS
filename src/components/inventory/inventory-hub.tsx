"use client";

import { useState } from "react";
import { PanzeCard } from "@/components/ui/panze-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Package,
    AlertTriangle,
    TrendingDown,
    ShoppingCart,
    History,
    Search,
    ArrowUpRight,
    Boxes
} from "lucide-react";
import { motion } from "framer-motion";

const MOCK_INVENTORY = [
    { name: "Surgical Masks (3-Ply)", stock: 450, min: 200, unit: "Boxes", status: "Healthy" },
    { name: "Latex Gloves (Medium)", stock: 85, min: 100, unit: "Boxes", status: "Low Stock" },
    { name: "Dental Bond", stock: 12, min: 10, unit: "Vials", status: "Healthy" },
    { name: "X-Ray Films (Standard)", stock: 5, min: 20, unit: "Packs", status: "Critical" },
];

export function InventoryHub() {
    return (
        <div className="space-y-10">
            {/* Intel Layer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PanzeCard className="bg-white p-6 flex items-center justify-between border-slate-100 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 group">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total SKU</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">142</h3>
                    </div>
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Boxes className="w-6 h-6" />
                    </div>
                </PanzeCard>
                <PanzeCard className="bg-white p-6 flex items-center justify-between border-slate-100 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 group">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Critical Low</p>
                        <h3 className="text-3xl font-black text-red-600 tracking-tight">08</h3>
                    </div>
                    <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                </PanzeCard>
                <PanzeCard className="bg-white p-6 flex items-center justify-between border-slate-100 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 group">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Pending Orders</p>
                        <h3 className="text-3xl font-black text-amber-500 tracking-tight">03</h3>
                    </div>
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShoppingCart className="w-6 h-6" />
                    </div>
                </PanzeCard>
            </div>

            {/* List Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3 tracking-tighter uppercase">
                        Stock Registry
                    </h2>
                    <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-blue-600 gap-2">
                        <History className="w-4 h-4" /> Usage Logs
                    </Button>
                </div>

                <div className="space-y-3">
                    {MOCK_INVENTORY.map((item, i) => (
                        <div key={i} className="flex items-center justify-between bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/0 to-blue-50/0 group-hover:via-blue-50/30 transition-all duration-500" />
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <Package className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">{item.name}</h4>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Standard Inventory • {item.unit}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-12 relative z-10">
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Stock</p>
                                    <span className={`text-xl font-black tracking-tight ${item.status === 'Critical' ? 'text-red-600' : item.status === 'Low Stock' ? 'text-amber-500' : 'text-emerald-600'}`}>
                                        {item.stock} <span className="text-sm font-bold opacity-60 ml-0.5">{item.unit}</span>
                                    </span>
                                </div>
                                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl w-12 h-12">
                                    <ArrowUpRight className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Button className="w-full h-16 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] gap-4 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                Open Full Inventory Ledger
            </Button>
        </div>
    );
}
