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
        <div className="flex flex-col h-full bg-white dark:bg-slate-900">
            {/* Header */}
            <div className="p-4 border-b border-indigo-100 dark:border-slate-800 bg-indigo-50/30 dark:bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <FileText className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase text-indigo-950 dark:text-indigo-200 tracking-wide">Tariff Master</h3>
                        <p className="text-[10px] text-slate-500 font-medium">Manage procedure costs</p>
                    </div>
                </div>
                <Link href="/dashboard/tariff">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white dark:hover:bg-slate-800">
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Button>
                </Link>
            </div>

            {/* Controls */}
            <div className="p-3 space-y-3 bg-white dark:bg-slate-900">
                {/* Auto Adjust */}
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="text-xs font-bold text-slate-500 whitespace-nowrap px-1">Bulk Adjust:</div>
                    <Input
                        type="number"
                        placeholder="%"
                        className="h-7 w-16 text-xs bg-white dark:bg-slate-900 border-slate-200 text-center"
                        value={bulkPercentage}
                        onChange={(e) => setBulkPercentage(e.target.value)}
                    />
                    <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 hover:bg-indigo-200 ml-auto"
                        onClick={applyBulkAdjustment}
                    >
                        <RotateCw className="w-3 h-3 mr-1" />
                        Auto-Adjust
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                    <Input
                        placeholder="Search procedures..."
                        className="h-9 pl-8 text-xs bg-slate-50 border-0 focus-visible:ring-1 focus-visible:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <ScrollArea className="flex-1">
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {filteredTariff.slice(0, 5).map((item) => (
                        <div key={item.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-slate-400">#{item.id}</span>
                                <div>
                                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                                        {item.name}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Badge variant="outline" className="text-[9px] h-4 border-slate-200 px-1 text-slate-500">
                                            {item.category}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm font-black text-slate-700 dark:text-slate-300 group-hover:text-emerald-600">
                                ₹{item.cost.toLocaleString()}
                            </div>
                        </div>
                    ))}
                    {filteredTariff.length === 0 && (
                        <div className="p-8 text-center text-xs text-slate-400">
                            No procedures found.
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
