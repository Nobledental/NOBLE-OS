"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Users, ArrowUpRight } from "lucide-react";
import { ActiveQueue } from "@/components/dashboard/active-queue";
import { PermissionGuard } from "@/components/security/permission-guard";
import { ChiefPulse } from "@/components/dashboard/chief-pulse";

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

                {/* Zone 1: Revenue Snapshot - Guarded */}
                <PermissionGuard permission="can_view_revenue" fallback={
                    <Card className="col-span-4 bg-slate-100 dark:bg-slate-900 border-dashed border-2 flex items-center justify-center">
                        <p className="text-muted-foreground italic">Revenue data restricted</p>
                    </Card>
                }>
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
                </PermissionGuard>

                {/* Zone 2: Live Queue (Always visible to staff) */}
                <div className="col-span-3">
                    <ActiveQueue />
                </div>

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

                <PermissionGuard permission="can_view_clinical">
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
                </PermissionGuard>

                {/* Zone 4: Chief's Pulse - Guarded for Admin/Owner */}
                <PermissionGuard permission="can_manage_staff">
                    <ChiefPulse />
                </PermissionGuard>

                {/* Zone 5: Quick Action - Guarded for Revenue */}
                <PermissionGuard permission="can_view_revenue">
                    <Card className="col-span-4 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 flex items-center justify-between p-6 cursor-pointer hover:bg-indigo-100 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-indigo-600 rounded-full text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <ArrowUpRight className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">Quick Invoice</h3>
                                <p className="text-xs text-indigo-600 dark:text-indigo-300">Create bill without appointment</p>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-indigo-600 group-hover:translate-x-1 transition-transform">Get Started</Button>
                    </Card>
                </PermissionGuard>

            </div>
        </div>
    );
}
