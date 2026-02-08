"use client";

import { useState } from "react";
import { TARIFF_MASTER_DATA, TariffItem } from "@/lib/data/tariff-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCw, ChevronRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export function TariffWidget() {
    const [tariff, setTariff] = useState<TariffItem[]>(TARIFF_MASTER_DATA);
    const [searchTerm, setSearchTerm] = useState("");
    const [bulkPercentage, setBulkPercentage] = useState("");

    const filteredTariff = tariff.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const applyBulkAdjustment = () => {
        const percent = parseFloat(bulkPercentage);
        if (isNaN(percent) || percent === 0) return;

        if (window.confirm(`Auto-adjust all visible prices by ${percent}%?`)) {
            setTariff(prev => prev.map(item => ({
                ...item,
                cost: Math.round(item.cost * (1 + percent / 100))
            })));
            setBulkPercentage("");
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Header */}
            <div className="p-6 border-b border-white/20 bg-white/40 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-neo-vibrant-blue/10 rounded-xl border border-neo-vibrant-blue/20">
                        <FileText className="w-5 h-5 text-neo-vibrant-blue" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif italic tracking-tighter text-slate-900">Tariff Master</h3>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Clinical Cost Matrix</p>
                    </div>
                </div>
                <Link href="/dashboard/tariff">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-900/5 transition-all">
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                    </Button>
                </Link>
            </div>

            {/* Controls */}
            <div className="p-5 space-y-4 bg-white/20 backdrop-blur-sm">
                {/* Auto Adjust */}
                <div className="flex items-center gap-3 p-3 bg-white/40 rounded-2xl border border-white/60 shadow-sm">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Bulk ADJUST:</div>
                    <Input
                        type="number"
                        placeholder="%"
                        className="h-8 w-16 text-xs bg-white/80 border-slate-200 text-center rounded-lg shadow-inner"
                        value={bulkPercentage}
                        onChange={(e) => setBulkPercentage(e.target.value)}
                    />
                    <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 text-[9px] font-black uppercase tracking-widest bg-neo-vibrant-blue text-white hover:bg-neo-electric-blue ml-auto shadow-lg shadow-neo-vibrant-blue/20 px-4 rounded-lg"
                        onClick={applyBulkAdjustment}
                    >
                        <RotateCw className="w-3 h-3 mr-1.5" />
                        AUTO-SCALE
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search clinical procedures..."
                        className="h-11 pl-11 text-xs bg-white/60 border-white/40 focus-visible:ring-1 focus-visible:ring-neo-vibrant-blue rounded-xl shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <ScrollArea className="flex-1">
                <div className="divide-y divide-white/20">
                    {filteredTariff.slice(0, 5).map((item) => (
                        <div key={item.id} className="p-5 hover:bg-white/40 transition-all flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-mono text-slate-400 opacity-60">#{item.id}</span>
                                <div>
                                    <div className="text-sm font-serif italic text-slate-800 group-hover:text-neo-vibrant-blue transition-colors">
                                        {item.name}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-[8px] h-4 border-slate-200 px-2 text-slate-500 font-bold uppercase tracking-widest">
                                            {item.category}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="text-base font-black text-slate-900 group-hover:text-neo-vibrant-blue transition-all">
                                ₹{item.cost.toLocaleString()}
                            </div>
                        </div>
                    ))}
                    {filteredTariff.length === 0 && (
                        <div className="p-12 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">No nodes identified</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
