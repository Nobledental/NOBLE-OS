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
        <PanzeCard className="h-[350px] md:h-[400px] flex flex-col relative w-full bg-slate-950/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl transition-all duration-700 hover:border-blue-500/10">
            <div className="flex items-center gap-3 mb-1">
                <div className="w-5 md:w-6 h-[1.5px] bg-blue-500/40" />
                <h3 className="text-[9px] md:text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Financials</h3>
            </div>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-white mb-6 md:mb-8">{title}</h2>

            <div className="flex-1 w-full min-h-0 relative group">
                <div className="absolute inset-0 bg-blue-400/[0.01] rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-1000 p-20" />

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="45%"
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={10}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(0, 0, 0, 0.9)",
                                backdropFilter: "blur(25px)",
                                borderRadius: "20px",
                                border: "1px solid rgba(59,130,246,0.1)",
                                boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                                color: "#fff",
                                padding: "10px 14px"
                            }}
                            itemStyle={{ color: "#fff", fontSize: "11px", fontWeight: "600" }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {(totalLabel || totalValue) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-[-5%] md:translate-y-[-5%]">
                        <span className="text-[8px] md:text-[9px] text-white/20 font-bold uppercase tracking-[0.2em] mb-1">{totalLabel}</span>
                        <span className="text-2xl md:text-3xl font-bold tracking-tight text-white">{totalValue}</span>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border border-white/10 shadow-lg" style={{ backgroundColor: item.color }} />
                        <span className="text-[8px] md:text-[9px] font-bold text-white/30 uppercase tracking-widest">{item.name}</span>
                    </div>
                ))}
            </div>
        </PanzeCard>
    );
}
