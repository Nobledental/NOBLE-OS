"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Zap, Repeat, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const mockSparkData = [
    { v: 10 }, { v: 15 }, { v: 8 }, { v: 12 }, { v: 20 }, { v: 14 }, { v: 18 }
];

interface VelocityStatsProps {
    data?: {
        avgWaitTime: number;
        avgBillingVelocity: number;
        turnoverRate: string;
    };
}

export function VelocityStats({ data }: VelocityStatsProps) {
    const stats = [
        {
            title: "Avg Patient Wait",
            value: `${data?.avgWaitTime || 14}m`,
            desc: "-2.4m from last week",
            icon: Clock,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            trend: "up"
        },
        {
            title: "Billing Velocity",
            value: `${data?.avgBillingVelocity || 8}m`,
            desc: "+1.2m slower today",
            icon: Zap,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            trend: "down"
        },
        {
            title: "Chair Turnover",
            value: data?.turnoverRate || "4.2/hr",
            desc: "Optimal Efficiency",
            icon: Repeat,
            color: "text-indigo-600",
            bg: "bg-indigo-50 dark:bg-indigo-900/20",
            trend: "up"
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat, i) => (
                <Card key={i} className="overflow-hidden border-none shadow-sm bg-white dark:bg-slate-950">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <div className="text-3xl font-black tracking-tight">{stat.value}</div>
                                <div className="flex items-center gap-1 mt-1">
                                    {stat.trend === "up" ? (
                                        <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                                    )}
                                    <span className="text-[10px] font-medium text-muted-foreground">{stat.desc}</span>
                                </div>
                            </div>
                            <div className="h-[40px] w-[80px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={mockSparkData}>
                                        <Line
                                            type="monotone"
                                            dataKey="v"
                                            stroke={stat.trend === "up" ? "#10b981" : "#f59e0b"}
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
