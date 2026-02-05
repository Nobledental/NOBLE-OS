"use client";

import { useState } from "react";
import { TARIFF_MASTER_DATA, TariffItem } from "@/lib/data/tariff-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Save, Plus, FileDown } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function TariffPage() {
    const [tariff, setTariff] = useState<TariffItem[]>(TARIFF_MASTER_DATA);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTariff = tariff.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePriceChange = (id: string, newPrice: string) => {
        const cost = parseFloat(newPrice);
        if (isNaN(cost)) return;

        setTariff(prev => prev.map(item =>
            item.id === id ? { ...item, cost } : item
        ));
    };

    const [isBulkAdjustOpen, setIsBulkAdjustOpen] = useState(false);
    const [bulkPercentage, setBulkPercentage] = useState("0");

    const applyBulkAdjustment = () => {
        const percent = parseFloat(bulkPercentage);
        if (isNaN(percent) || percent === 0) return;

        if (window.confirm(`Are you sure you want to increase all prices by ${percent}%?`)) {
            setTariff(prev => prev.map(item => ({
                ...item,
                cost: Math.round(item.cost * (1 + percent / 100))
            })));
            setIsBulkAdjustOpen(false);
            setBulkPercentage("0");
        }
    };

    return (
        <div className="flex-1 space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Tariff Master</h2>
                    <p className="text-slate-500">Manage standard procedure costs and tax rates.</p>
                </div>
                <div className="flex gap-2 items-center">
                    {/* Automation Control: Bulk Adjust */}
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                        <Input
                            type="number"
                            className="w-20 h-8 text-xs"
                            placeholder="%"
                            value={bulkPercentage}
                            onChange={(e) => setBulkPercentage(e.target.value)}
                        />
                        <Button size="sm" variant="ghost" className="h-8 text-xs font-bold text-slate-600" onClick={applyBulkAdjustment}>
                            AUTO-ADJUST
                        </Button>
                    </div>

                    <Button variant="outline">
                        <FileDown className="w-4 h-4 mr-2" /> Export
                    </Button>
                    <Button className="bg-brand-primary hover:bg-orange-600">
                        <Plus className="w-4 h-4 mr-2" /> Add Procedure
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by procedure name or category..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Procedure Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Base Cost (₹)</TableHead>
                            <TableHead className="text-right">Tax (%)</TableHead>
                            <TableHead className="text-right w-[150px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTariff.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-mono text-xs text-slate-500">#{item.id}</TableCell>
                                <TableCell className="font-medium">
                                    {item.name}
                                    {item.isBundle && (
                                        <Badge variant="secondary" className="ml-2 text-[10px] bg-indigo-50 text-indigo-600 border-indigo-100">
                                            BUNDLE
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-slate-600">
                                        {item.category}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Input
                                        type="number"
                                        className="h-8 w-24 ml-auto text-right font-bold"
                                        value={item.cost}
                                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                    />
                                </TableCell>
                                <TableCell className="text-right text-slate-500">
                                    {item.tax > 0 ? `${item.tax}%` : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-brand-primary"
                                        onClick={() => alert(`Saved ${item.name}`)}
                                    >
                                        <Save className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
