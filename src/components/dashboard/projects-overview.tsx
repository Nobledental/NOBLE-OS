"use client";

import { PanzeCard } from "@/components/ui/panze-card";
import { ArrowUpRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
    { name: "In Progress", value: 14, color: "#F97316" }, // Orange
    { name: "Completed", value: 32, color: "#3B82F6" },  // Blue
    { name: "Not Started", value: 54, color: "#E2E8F0" }, // Light Gray
];

export function ProjectsOverview() {
    return (
        <PanzeCard className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-medium text-slate-900">Patient Overview</h3>
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <ArrowUpRight className="w-5 h-5 text-slate-500" />
                </button>
            </div>

            <div className="flex-1 min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <span className="text-4xl font-bold text-slate-900 block">100</span>
                        <span className="text-sm text-slate-500">Total Patients</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium text-slate-600">
                            {item.name}: <span className="text-slate-900">{item.value}</span>
                        </span>
                    </div>
                ))}
            </div>
        </PanzeCard>
    );
}
