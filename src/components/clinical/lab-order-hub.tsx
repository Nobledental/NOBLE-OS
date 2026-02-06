"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FlaskConical,
    Clock,
    CheckCircle2,
    ChevronRight,
    ArrowUpRight,
    Truck,
    Calendar,
    Search,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export type LabOrderStatus = 'SENT' | 'IN_PROGRESS' | 'RECEIVED' | 'TRIAL_DONE' | 'FINAL_CEMENTED' | 'REJECTED';

export interface LabOrder {
    id: string;
    patientName: string;
    doctorName: string;
    labName: string;
    workType: string;
    teeth: string[];
    shade?: string;
    status: LabOrderStatus;
    sentDate: Date;
    expectedDate: Date;
    cost?: number;
}

const MOCK_LAB_ORDERS: LabOrder[] = [
    {
        id: "LAB-001",
        patientName: "Aditi Rao",
        doctorName: "Dr. Dhivakaran",
        labName: "DentCare Premium",
        workType: "Zirconia Crown",
        teeth: ["46"],
        shade: "A2",
        status: "RECEIVED",
        sentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expectedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        cost: 4500
    },
    {
        id: "LAB-002",
        patientName: "Rahul Sharma",
        doctorName: "Dr. Dhivakaran",
        labName: "FineDent Labs",
        workType: "PFM Bridge",
        teeth: ["14", "15", "16"],
        status: "SENT",
        sentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        expectedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        cost: 3600
    }
];

export function LabOrderHub() {
    const [orders, setOrders] = useState<LabOrder[]>(MOCK_LAB_ORDERS);
    const [filter, setFilter] = useState<LabOrderStatus | 'ALL'>('ALL');

    const statusConfig: Record<LabOrderStatus, { color: string, icon: any }> = {
        SENT: { color: "bg-blue-500", icon: ArrowUpRight },
        IN_PROGRESS: { color: "bg-amber-500", icon: Clock },
        RECEIVED: { color: "bg-emerald-500", icon: Truck },
        TRIAL_DONE: { color: "bg-indigo-500", icon: FlaskConical },
        FINAL_CEMENTED: { color: "bg-slate-900", icon: CheckCircle2 },
        REJECTED: { color: "bg-rose-500", icon: Filter },
    };

    const filteredOrders = orders.filter(o => filter === 'ALL' || o.status === filter);

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                        <FlaskConical className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-800 italic">Lab Order Tracker</h2>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Digital Prosthetic Logistics</p>
                    </div>
                </div>
                <div className="flex gap-2 bg-slate-100/50 p-1.5 rounded-2xl">
                    {['ALL', 'SENT', 'RECEIVED', 'FINAL_CEMENTED'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === f ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredOrders.map((order) => {
                        const Config = statusConfig[order.status];
                        return (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <Card className="rounded-[2.5rem] border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all border-b-4 border-b-slate-100">
                                    <div className="p-6 space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <Badge className={cn("rounded-lg px-2 text-[8px] font-black uppercase tracking-[0.15em] border-none text-white", Config.color)}>
                                                    {order.status.replace('_', ' ')}
                                                </Badge>
                                                <h3 className="text-lg font-black text-slate-800 leading-tight mt-2">{order.workType}</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Teeth: {order.teeth.join(', ')}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                                <Config.icon className="w-5 h-5 text-slate-400" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                                    <Search className="w-4 h-4 text-indigo-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Patient</p>
                                                    <p className="text-xs font-bold text-slate-700">{order.patientName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                                    <FlaskConical className="w-4 h-4 text-emerald-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lab</p>
                                                    <p className="text-xs font-bold text-slate-700">{order.labName}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Due: {order.expectedDate.toLocaleDateString()}</span>
                                            </div>
                                            <Button variant="ghost" className="h-8 rounded-lg px-3 text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">
                                                Update Status <ChevronRight className="w-3 h-3 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
