"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

interface VitalsChartProps {
    data: any[]
}

export function VitalsChart({ data }: VitalsChartProps) {
    if (!data || data.length === 0) return (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-lg">
            Insufficient data for vitals trend
        </div>
    )

    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis
                        dataKey="date"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm text-[10px]">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex flex-col">
                                                <span className="uppercase text-muted-foreground">BP</span>
                                                <span className="font-bold text-indigo-600">{payload[0].value}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="uppercase text-muted-foreground">Pulse</span>
                                                <span className="font-bold text-green-600">{payload[1].value}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="bp"
                        stroke="#4f46e5"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="pulse"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
