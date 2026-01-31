"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { VelocityStats } from "@/components/analytics/velocity-stats";
import { StaffLeaderboard } from "@/components/analytics/staff-leaderboard";
import { BottleneckHeatmap } from "@/components/analytics/bottleneck-heatmap";
import { Button } from "@/components/ui/button";
import { Download, Share2, Filter, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsPage() {
    const clinicId = "noble-dental-primary";

    const { data: analytics } = useQuery({
        queryKey: ["velocity-metrics", clinicId],
        queryFn: async () => {
            const res = await api.get(`/clinical/analytics/${clinicId}`);
            return res.data;
        }
    });

    const { data: heatmap } = useQuery({
        queryKey: ["congestion-heatmap", clinicId],
        queryFn: async () => {
            const res = await api.get(`/clinical/heatmap/${clinicId}`);
            return res.data;
        }
    });

    return (
        <div className="flex-1 space-y-6 p-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter">Performance Pulse</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-100 dark:border-indigo-800 flex gap-1 px-1.5 py-0">
                            <Zap className="h-3 w-3" /> Real-time Efficiency Engine
                        </Badge>
                        <p className="text-xs text-muted-foreground">Noble Dental Care Operational Insights</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter className="h-3 w-3" /> Filters
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Share2 className="h-3 w-3" /> Share
                    </Button>
                    <Button size="sm" className="h-8 gap-1 bg-indigo-600">
                        <Download className="h-3 w-3" /> Export PDF
                    </Button>
                </div>
            </div>

            {/* Top Stats Section */}
            <VelocityStats data={analytics} />

            {/* Main Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 h-full">

                {/* Congestion Heatmap */}
                <div className="col-span-4 h-full">
                    <BottleneckHeatmap data={heatmap} />
                </div>

                {/* Staff Leaderboard */}
                <div className="col-span-3 h-full">
                    <StaffLeaderboard />
                </div>

                {/* Additional Insight Card (Full Width) */}
                <div className="col-span-7 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <h3 className="text-2xl font-black">Efficiency Recommendation</h3>
                            <p className="text-indigo-100 text-sm leading-relaxed">
                                Our &quot;Leapfrog&quot; algorithm identifies a consistent bottleneck between **14:00 - 16:00**.
                                Increasing nursing support during this window could improve patient throughput by **14%**.
                            </p>
                        </div>
                        <Button className="bg-white text-indigo-600 hover:bg-slate-50 font-bold px-8 rounded-full">
                            Auto-Configure Roster
                        </Button>
                    </div>
                    {/* Background Graphic Elements */}
                    <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 h-1/2 w-1/4 bg-indigo-400/10 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    );
}
