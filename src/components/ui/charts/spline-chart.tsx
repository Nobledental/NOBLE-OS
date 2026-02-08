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

export function SplineChart({ data, title, color = "#3b82f6", className }: SplineChartProps) {
    return (
        <PanzeCard className={cn("h-[350px] md:h-[400px] flex flex-col w-full bg-slate-950/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl transition-all duration-700 hover:border-blue-500/10", className)}>
            <div className="flex items-center gap-3 mb-1">
                <div className="w-5 md:w-6 h-[1.5px] bg-blue-500/40" />
                <h3 className="text-[9px] md:text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">{title}</h3>
            </div>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-white mb-6 md:mb-8">Performance <span className="text-blue-400/20">Index</span></h2>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.12} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="0" stroke="rgba(255,255,255,0.01)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 8, fontWeight: "700", letterSpacing: "0.2em" }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 8 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(0, 0, 0, 0.95)",
                                backdropFilter: "blur(40px)",
                                borderRadius: "24px",
                                border: "1px solid rgba(255,255,255,0.05)",
                                boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
                                color: "#fff",
                                padding: "16px 20px"
                            }}
                            itemStyle={{ color: color, fontSize: "10px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em" }}
                            cursor={{ stroke: "rgba(255,255,255,0.05)", strokeWidth: 1 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#gradient-${title})`}
                            animationDuration={2500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </PanzeCard>
    );
}
