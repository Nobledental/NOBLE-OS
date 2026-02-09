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
                <PanzeCard className="bg-slate-50 p-4 flex items-center justify-between border-slate-200 rounded-xl">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Total SKU</p>
                        <h3 className="text-2xl font-bold text-slate-900">142</h3>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Boxes className="w-5 h-5" />
                    </div>
                </PanzeCard>
                <PanzeCard className="bg-slate-50 p-4 flex items-center justify-between border-slate-200 rounded-xl">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Critical Low</p>
                        <h3 className="text-2xl font-bold text-red-600">08</h3>
                    </div>
                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                </PanzeCard>
                <PanzeCard className="bg-slate-50 p-4 flex items-center justify-between border-slate-200 rounded-xl">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Pending Orders</p>
                        <h3 className="text-2xl font-bold text-amber-600">03</h3>
                    </div>
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5" />
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
                        <div key={i} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm group hover:border-blue-500/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <Package className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">{item.name}</h4>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Standard Inventory • {item.unit}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-12">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Current Stock</p>
                                    <span className={`text-lg font-bold ${item.status === 'Critical' ? 'text-red-600' : item.status === 'Low Stock' ? 'text-amber-500' : 'text-emerald-600'}`}>
                                        {item.stock} {item.unit}
                                    </span>
                                </div>
                                <Button variant="ghost" size="icon" className="text-slate-200 hover:text-blue-500 rounded-xl">
                                    <ArrowUpRight className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Button className="w-full h-16 bg-slate-900 text-white rounded-[2rem] font-bold uppercase tracking-[0.4em] text-[10px] gap-4">
                Open Full Inventory Ledger
            </Button>
        </div>
    );
}
