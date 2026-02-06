"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PanzeCard } from "@/components/ui/panze-card";
import { cn } from "@/lib/utils";

interface SplineChartProps {
    data: { name: string; value: number }[];
    title: string;
    color?: string; // Hex color
    className?: string;
}

export function SplineChart({ data, title, color = "#6366f1", className }: SplineChartProps) {
    return (
        <PanzeCard className={cn("h-[300px] flex flex-col w-full", className)}>
            <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-100" />
                    <div className="w-3 h-3 rounded-full bg-slate-100" />
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                            }}
                            cursor={{ stroke: color, strokeWidth: 2, strokeDasharray: "5 5" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#gradient-${title})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </PanzeCard>
    );
}
