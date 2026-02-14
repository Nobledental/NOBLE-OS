"use client";

import { TreatmentSelector } from "@/components/billing/treatment-selector";
import { InvoiceGenerator } from "@/components/billing/invoice-generator";
import { PanzeCard } from "@/components/ui/panze-card";
import { ScrollText, Search, CreditCard, Receipt, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TARIFF_MASTER_DATA } from "@/lib/data/tariff-data";
import { useState } from "react";
import { motion } from "framer-motion";

export default function BillingPage() {
    const [priceSearch, setPriceSearch] = useState("");
    const filteredPrices = TARIFF_MASTER_DATA.filter(p =>
        p.name.toLowerCase().includes(priceSearch.toLowerCase())
    ).slice(0, 5);

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-32 flex-shrink-0">
                <PanzeCard className="bg-indigo-600 text-white flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium opacity-80 uppercase tracking-widest">Today's Revenue</p>
                            <h3 className="text-2xl font-black mt-1">₹0</h3>
                        </div>
                        <div className="p-2 bg-white/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-indigo-100" />
                        </div>
                    </div>
                    <div className="text-[10px] bg-white/10 px-2 py-1 rounded inline-self-start w-fit">
                        No transactions yet
                    </div>
                </PanzeCard>

                {/* Quick Price Check Widget (Migrated) */}
                <PanzeCard className="md:col-span-2 flex flex-col gap-3 bg-indigo-50/50 border-indigo-100">
                    <div className="flex items-center gap-2">
                        <ScrollText className="w-4 h-4 text-indigo-600" />
                        <h4 className="text-xs font-black uppercase text-slate-500 italic">Quick Price Check</h4>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            placeholder="Search procedure cost..."
                            className="pl-8 h-9 text-xs bg-white/80 border-indigo-100 focus:ring-indigo-500"
                            value={priceSearch}
                            onChange={(e) => setPriceSearch(e.target.value)}
                        />
                    </div>
                    {priceSearch && (
                        <div className="absolute top-[80%] left-4 right-4 bg-white shadow-xl rounded-xl border border-indigo-100 z-50 p-2 space-y-1">
                            {filteredPrices.map(p => (
                                <div key={p.id} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                                    <span className="text-xs font-bold text-slate-700">{p.name}</span>
                                    <span className="text-xs font-black text-indigo-600">₹{p.cost}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </PanzeCard>

                <PanzeCard className="flex flex-col justify-center items-center gap-2 border-dashed bg-slate-50/50">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Invoices</p>
                    <span className="text-xl font-black text-slate-900">0</span>
                </PanzeCard>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex gap-6 min-h-0">
                {/* Left Pane: Treatment Menu & Tariff Master */}
                <div className="flex-1 min-w-0 flex flex-col overflow-y-auto pr-2">
                    <TreatmentSelector />
                </div>

                {/* Right Pane: Live Invoice & Fintech Logic */}
                <div className="w-[450px] flex-shrink-0 flex flex-col bg-white dark:bg-slate-900 border rounded-xl shadow-lg overflow-hidden h-full">
                    <InvoiceGenerator />
                </div>
            </div>
        </div>
    );
}
