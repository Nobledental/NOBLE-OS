"use client";

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    DollarSign, TrendingUp, Calendar, Download,
    Briefcase, ChevronRight, Lock
} from 'lucide-react';
import Link from 'next/link';

// Mock data (simplified for widget)
const mockStats = {
    gross: 65500,
    payable: 39820,
    commission: 25670,
    completed: 3,
    total: 4
};

export function LedgerWidget() {
    const [selectedPeriod, setSelectedPeriod] = useState("today");

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900">
            {/* Header */}
            <div className="p-4 border-b border-purple-100 dark:border-slate-800 bg-purple-50/30 dark:bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <Briefcase className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase text-purple-950 dark:text-purple-200 tracking-wide">Specialist Ledger</h3>
                        <p className="text-[10px] text-slate-500 font-medium">Track payables & settlements</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="h-7 w-20 text-[10px] border-none bg-transparent focus:ring-0 font-bold text-slate-600">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="month">Month</SelectItem>
                        </SelectContent>
                    </Select>
                    <Link href="/dashboard/settlement">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white dark:hover:bg-slate-800">
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="p-4 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
                    <div className="text-lg font-black text-slate-700 dark:text-white mt-1">
                        ₹{mockStats.gross.toLocaleString()}
                    </div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider">Payable</span>
                    <div className="text-lg font-black text-emerald-600 mt-1">
                        ₹{mockStats.payable.toLocaleString()}
                    </div>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-blue-600/70 uppercase tracking-wider">Commission</span>
                    <div className="text-lg font-black text-blue-600 mt-1">
                        ₹{mockStats.commission.toLocaleString()}
                    </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Procedures</span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-black text-slate-700 dark:text-white">{mockStats.completed}</span>
                        <span className="text-xs font-bold text-slate-400">/ {mockStats.total}</span>
                    </div>
                </div>
            </div>

            {/* EOD Settlement Footer */}
            <div className="mt-auto px-4 pb-4">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500">
                    <div className="flex items-start gap-3">
                        <Lock className="w-4 h-4 text-amber-500 mt-0.5" />
                        <div>
                            <h4 className="text-xs font-black uppercase text-amber-900 dark:text-amber-100 tracking-wide mb-1">
                                EOD Consultant Payouts
                            </h4>
                            <div className="h-px w-full bg-amber-200/50 my-2" />
                            <div className="flex items-center justify-between w-full gap-8">
                                <span className="text-[10px] font-bold text-amber-700">Total Payable:</span>
                                <span className="text-lg font-black text-amber-600">₹0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
