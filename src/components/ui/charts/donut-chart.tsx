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
        <PanzeCard className="h-[300px] flex flex-col relative w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>

            <div className="flex-1 w-full min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                            }}
                            itemStyle={{ color: "#1e293b", fontWeight: "bold" }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Content */}
                {(totalLabel || totalValue) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-sm text-slate-400 font-medium">{totalLabel}</span>
                        <span className="text-2xl font-black text-slate-800">{totalValue}</span>
                    </div>
                )}
            </div>

            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-2">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-bold text-slate-600">{item.name}</span>
                    </div>
                ))}
            </div>
        </PanzeCard>
    );
}
