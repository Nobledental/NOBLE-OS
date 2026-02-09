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
        <PanzeCard className="h-[350px] md:h-[400px] flex flex-col relative w-full glass-frost border-white/40 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] backdrop-blur-[40px] p-6 md:p-10 shadow-2xl transition-all duration-700 hover:border-blue-500/20">
            <div className="flex items-center gap-3 mb-1">
                <div className="w-5 md:w-6 h-[1.5px] bg-blue-500/60" />
                <h3 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Financials</h3>
            </div>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900 mb-6 md:mb-8">{title}</h2>

            <div className="flex-1 w-full min-h-0 relative group">
                <div className="absolute inset-0 bg-blue-400/[0.01] rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-1000 p-20" />

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="45%"
                            innerRadius={65}
                            outerRadius={90}
                            paddingAngle={12}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.7} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(0, 0, 0, 0.95)",
                                backdropFilter: "blur(40px)",
                                borderRadius: "24px",
                                border: "1px solid rgba(255,255,255,0.05)",
                                boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
                                color: "#fff",
                                padding: "12px 16px"
                            }}
                            itemStyle={{ color: "#fff", fontSize: "10px", fontWeight: "700", textTransform: "uppercase" }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {(totalLabel || totalValue) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-[-5%]">
                        <span className="text-[7px] md:text-[8px] text-slate-400 font-bold uppercase tracking-[0.4em] mb-2">{totalLabel}</span>
                        <span className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">{totalValue}</span>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-6">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ring-4 ring-slate-100/50" style={{ backgroundColor: item.color }} />
                        <span className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">{item.name}</span>
                    </div>
                ))}
            </div>
        </PanzeCard>
    );
}
