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
        <div className="flex flex-col h-full bg-transparent">
            {/* Header */}
            <div className="p-6 border-b border-white/20 bg-white/40 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-neo-electric-blue/10 rounded-xl border border-neo-electric-blue/20">
                        <Briefcase className="w-5 h-5 text-neo-electric-blue" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif italic tracking-tighter text-slate-900">Specialist Ledger</h3>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Financial Node Tracking</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="h-8 w-24 text-[10px] border-slate-200 bg-white/40 focus:ring-1 focus:ring-neo-vibrant-blue font-black uppercase tracking-wider text-slate-600 rounded-lg">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-white border-slate-200">
                            <SelectItem value="today" className="text-[10px] font-bold">TODAY</SelectItem>
                            <SelectItem value="week" className="text-[10px] font-bold">THIS WEEK</SelectItem>
                            <SelectItem value="month" className="text-[10px] font-bold">THIS MONTH</SelectItem>
                        </SelectContent>
                    </Select>
                    <Link href="/dashboard/settlement">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-900/5 transition-all">
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="p-6 grid grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-white/40 border border-white/60 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gross Revenue</span>
                    <div className="text-2xl font-black text-slate-900 mt-2 tracking-tighter">
                        ₹{mockStats.gross.toLocaleString()}
                    </div>
                </div>
                <div className="p-5 rounded-3xl bg-neo-emerald/5 border border-neo-emerald/20 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                    <span className="text-[9px] font-black text-neo-emerald uppercase tracking-widest">Payable</span>
                    <div className="text-2xl font-black text-neo-emerald mt-2 tracking-tighter">
                        ₹{mockStats.payable.toLocaleString()}
                    </div>
                </div>
                <div className="p-5 rounded-3xl bg-neo-vibrant-blue/5 border border-neo-vibrant-blue/20 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                    <span className="text-[9px] font-black text-neo-vibrant-blue uppercase tracking-widest">Commission</span>
                    <div className="text-2xl font-black text-neo-vibrant-blue mt-2 tracking-tighter">
                        ₹{mockStats.commission.toLocaleString()}
                    </div>
                </div>
                <div className="p-5 rounded-3xl bg-white/40 border border-white/60 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Procedures</span>
                    <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">{mockStats.completed}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">/ {mockStats.total}</span>
                    </div>
                </div>
            </div>

            {/* EOD Settlement Footer */}
            <div className="mt-auto px-6 pb-6">
                <div className="p-6 rounded-[2.5rem] bg-white/60 border border-white/80 shadow-lg relative overflow-hidden group/footer">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent pointer-events-none" />
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-600">
                            <Lock className="w-5 h-5 shadow-sm" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-[10px] font-black uppercase text-amber-900 tracking-[0.2em] mb-1">
                                EOD Consultant Payouts
                            </h4>
                            <div className="h-px w-full bg-amber-200/40 my-3" />
                            <div className="flex items-center justify-between w-full">
                                <span className="text-[10px] font-bold text-amber-700/60 uppercase tracking-widest">Total Active Payable:</span>
                                <span className="text-xl font-black text-amber-600">₹0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
