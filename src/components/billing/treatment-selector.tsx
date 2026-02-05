"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Sparkles, AlertCircle } from "lucide-react";
import { useBillingStore } from "@/lib/billing-store";
import { useState } from "react";

import { TARIFF_MASTER_DATA } from "@/lib/data/tariff-data";

const TARIFF_MASTER = TARIFF_MASTER_DATA;

export function TreatmentSelector() {
    const { addItem } = useBillingStore();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTariff = TARIFF_MASTER.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = (item: typeof TARIFF_MASTER[0]) => {
        addItem({
            name: item.name,
            baseCost: item.cost,
            taxRate: item.tax as any,
            quantity: 1,
            isBundle: item.isBundle,
            bundleItems: item.bundleDetails
        });
    };

    return (
        <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
            <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search procedures (e.g., 'RCT', 'Filling')..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline"><Sparkles className="w-4 h-4 mr-2" /> AI Suggest</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4">
                {filteredTariff.map((item) => (
                    <Card
                        key={item.id}
                        className="cursor-pointer hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group relative overflow-hidden"
                        onClick={() => handleAdd(item)}
                    >
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-semibold uppercase text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                    {item.category}
                                </span>
                                <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
                            </div>
                            <CardTitle className="text-sm font-medium pt-2">{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="flex items-end justify-between">
                                <span className="font-bold text-lg">₹{item.cost.toLocaleString()}</span>
                                {item.tax > 0 && <span className="text-[10px] text-muted-foreground">+{item.tax}% GST</span>}
                            </div>

                            {item.isBundle && (
                                <div className="mt-2 text-xs text-indigo-600 bg-indigo-50 p-2 rounded flex items-start">
                                    <Sparkles className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                    <span>Includes: {item.bundleDetails?.slice(0, 2).join(", ")} + {item.bundleDetails!.length - 2} more</span>
                                </div>
                            )}
                        </CardContent>

                        {/* Active selection feedback could go here */}
                    </Card>
                ))}
            </div>

            {/* Insurance Pre-check Sidebar Mockup (Bottom) */}
            <div className="mt-auto border-t pt-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Insurance Pre-Check: Star Health</h4>
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                            Patient has <b>₹15,000</b> remaining balance.
                            Copay: <b>20%</b> applies to "Cleaning".
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
