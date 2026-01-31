"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, User, Eye, Pill, CreditCard } from "lucide-react";

const MOCK_PULSE = [
    { id: 1, staff: "Sarah", role: "Receptionist", action: "Processing Bill", patient: "Rahul K.", icon: CreditCard, color: "text-emerald-500 bg-emerald-50" },
    { id: 2, staff: "Dr. Arjun", role: "Associate", action: "Viewing Case Sheet", patient: "Sarah M.", icon: Eye, color: "text-indigo-500 bg-indigo-50" },
    { id: 3, staff: "Priya", role: "Assistant", action: "Updating Vitals", patient: "Mike D.", icon: Pill, color: "text-amber-500 bg-amber-50" },
];

export function ChiefPulse() {
    return (
        <Card className="col-span-3 border-none shadow-sm bg-slate-50/50 dark:bg-slate-950/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                    Chief's Pulse
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {MOCK_PULSE.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold">{item.staff}</div>
                                    <div className="text-[10px] text-muted-foreground">{item.role}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Action</div>
                                <div className="text-[11px] font-medium flex items-center gap-1 justify-end">
                                    {item.action}
                                    <span className="text-indigo-600">@{item.patient}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px]">
                    <span className="text-muted-foreground">3 Staff Active Now</span>
                    <Badge variant="outline" className="text-[8px] bg-emerald-50 text-emerald-600 border-emerald-100">Live Sync</Badge>
                </div>
            </CardContent>
        </Card>
    );
}
