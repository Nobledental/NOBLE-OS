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
        <PanzeCard className={cn("h-[400px] flex flex-col w-full bg-slate-950/20 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl transition-all duration-700 hover:border-white/10", className)}>
            <div className="mb-8 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mb-1">Analytics</h3>
                    <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
                </div>
                <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9, fontWeight: "600", letterSpacing: "0.1em" }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                                backdropFilter: "blur(20px)",
                                borderRadius: "16px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                                color: "#fff"
                            }}
                            itemStyle={{ color: "#fff", fontSize: "12px", fontWeight: "600" }}
                            cursor={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 1 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill={`url(#gradient-${title})`}
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </PanzeCard>
    );
}
