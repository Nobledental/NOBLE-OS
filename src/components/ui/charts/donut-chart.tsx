"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PanzeCard } from "@/components/ui/panze-card";

interface DonutChartProps {
    data: { name: string; value: number; color: string }[];
    title: string;
    totalLabel?: string;
    totalValue?: string;
}

export function DonutChart({ data, title, totalLabel, totalValue }: DonutChartProps) {
    return (
        <PanzeCard className="h-[400px] flex flex-col relative w-full bg-slate-950/20 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl transition-all duration-700 hover:border-white/10">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mb-1">Financials</h3>
            <h2 className="text-xl font-semibold tracking-tight text-white mb-8">{title}</h2>

            <div className="flex-1 w-full min-h-0 relative group">
                {/* Subtle White Glow on Hover */}
                <div className="absolute inset-0 bg-white/[0.02] rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-1000 p-20" />

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="45%"
                            innerRadius={70}
                            outerRadius={95}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                            ))}
                        </Pie>
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
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Content */}
                {(totalLabel || totalValue) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-[-5%]">
                        <span className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em] mb-1">{totalLabel}</span>
                        <span className="text-3xl font-bold tracking-tight text-white">{totalValue}</span>
                    </div>
                )}
            </div>

            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-6 mt-4">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full border border-white/10 shadow-lg" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.name}</span>
                    </div>
                ))}
            </div>
        </PanzeCard>
    );
}
