"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, DollarSign, Users, ArrowUpRight, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">Download Report</Button>
                    <Button>Start Duty</Button>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 h-full">

                {/* Zone 1: Revenue Snapshot (Takes up 4 cols) */}
                <Card className="col-span-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium text-slate-200">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">₹45,231.89</div>
                        <p className="text-xs text-slate-400 mt-1">
                            +20.1% from last month
                        </p>
                        <div className="h-[80px] mt-4 flex items-end space-x-2">
                            {/* Visual Mockup for Chart */}
                            {[40, 60, 55, 80, 45, 90, 100].map((h, i) => (
                                <div key={i} className="bg-emerald-500/80 w-8 rounded-t-sm hover:bg-emerald-400 transition-colors cursor-pointer" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Zone 2: Live Queue (Takes up 3 cols) */}
                <Card className="col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Live Queue Status
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 mt-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">{i}</div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">Walk-in Patient</p>
                                            <p className="text-xs text-muted-foreground">General Checkup</p>
                                        </div>
                                    </div>
                                    <div className="text-xs font-mono text-slate-500 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" /> 12m
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-xs text-muted-foreground">View Full Queue</Button>
                    </CardContent>
                </Card>

                {/* Zone 3: Quick Stats (Row 2) */}
                <Card className="col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Patients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12</div>
                        <p className="text-xs text-muted-foreground">+2 since last hour</p>
                    </CardContent>
                </Card>

                <Card className="col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Procedures</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">In Chair: 2 | Recovery: 1</p>
                    </CardContent>
                </Card>

                {/* Zone 4: Quick Action (Large button) */}
                <Card className="col-span-3 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 flex items-center justify-center cursor-pointer hover:bg-indigo-100 transition-colors group">
                    <div className="text-center">
                        <div className="h-12 w-12 bg-indigo-600 rounded-full text-white mx-auto flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform">
                            <ArrowUpRight className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">Quick Invoice</h3>
                        <p className="text-xs text-indigo-600 dark:text-indigo-300">Create bill without appointment</p>
                    </div>
                </Card>

            </div>
        </div>
    );
}
