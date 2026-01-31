"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, TrendingUp } from "lucide-react";

const staffVelo = [
    { name: "Dr. Sarah Miller", role: "Doctor", avgTime: "12m", score: 98, trend: "up", avatar: "SM" },
    { name: "Rahul Sharma", role: "Reception", avgTime: "4m", score: 95, trend: "up", avatar: "RS" },
    { name: "Priya Das", role: "Doctor", avgTime: "18m", score: 88, trend: "down", avatar: "PD" },
    { name: "Anil Kapoor", role: "Billing", avgTime: "5m", score: 92, trend: "up", avatar: "AK" },
];

export function StaffLeaderboard() {
    return (
        <Card className="h-full border-none shadow-sm bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-bold">Staff Velocity View</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Operational efficiency ranking</p>
                </div>
                <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200 dark:border-amber-800 flex gap-1">
                    <Trophy className="h-3 w-3" /> Star Performer: Sarah
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {staffVelo.map((staff, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-default">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="h-10 w-10 border-2 border-slate-50 dark:border-slate-900">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.name}`} />
                                        <AvatarFallback>{staff.avatar}</AvatarFallback>
                                    </Avatar>
                                    {i === 0 && (
                                        <div className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-0.5 border-2 border-white dark:border-slate-950">
                                            <Star className="h-2 w-2 text-white fill-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-bold group-hover:text-indigo-600 transition-colors">
                                        {staff.name}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-medium tracking-tighter">
                                        {staff.role} • Avg. {staff.avgTime}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="text-sm font-black">{staff.score}%</div>
                                <div className={`flex items-center gap-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${staff.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                    <TrendingUp className={`h-2 w-2 ${staff.trend === 'down' ? 'rotate-180' : ''}`} />
                                    {staff.trend === 'up' ? 'FASTER' : 'LAGGING'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
