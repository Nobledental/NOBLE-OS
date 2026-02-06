"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Fingerprint, TrendingUp, CalendarCheck } from "lucide-react";
import { StaffHRModule } from "@/components/staff/hr-system";
import { AttendanceHub } from "@/components/staff/attendance-hub";
import { PerformanceScorecard } from "@/components/staff/performance-scorecard";
import { PanzeCard } from "@/components/ui/panze-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function StaffManagementPage() {
    const [activeTab, setActiveTab] = useState("directory");

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-slate-500 text-sm mb-1 font-medium italic">Human Resources Management</p>
                    <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight font-display">Staff Studio</h1>
                </div>
            </div>

            <Tabs defaultValue="directory" className="w-full" onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
                    <TabsList className="bg-white p-1 rounded-full border border-slate-200 shadow-sm h-14">
                        <TabsTrigger
                            value="directory"
                            className="rounded-full px-6 py-2.5 data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2 h-11"
                        >
                            <Users className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Directory</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="onboarding"
                            className="rounded-full px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white gap-2 h-11"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Onboarding</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="attendance"
                            className="rounded-full px-6 py-2.5 data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2 h-11"
                        >
                            <Fingerprint className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Attendance</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="performance"
                            className="rounded-full px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white gap-2 h-11"
                        >
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Performance</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="leave"
                            className="rounded-full px-6 py-2.5 data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2 h-11"
                        >
                            <CalendarCheck className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Leave</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="mt-6">
                    <TabsContent value="directory" className="animate-in fade-in slide-in-from-bottom-4">
                        <PanzeCard>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100 italic">
                                            <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest text-slate-400">Staff Member</th>
                                            <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest text-slate-400">Designation</th>
                                            <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest text-slate-400">Join Date</th>
                                            <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest text-slate-400">Status</th>
                                            <th className="text-right py-4 px-4 text-xs font-bold uppercase tracking-widest text-slate-400">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {[
                                            { name: "Dr. Dhivakaran", role: "CHIEF DENTIST", date: "Jan 12, 2024", status: "Active" },
                                            { name: "Sarah Miller", role: "RECEPTIONIST", date: "Feb 01, 2024", status: "In Clinic" },
                                            { name: "Arun Kumar", role: "SENIOR ASSISTANT", date: "Dec 15, 2023", status: "On Break" },
                                        ].map((staff, i) => (
                                            <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="py-5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs">
                                                            {staff.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <span className="font-bold text-slate-900">{staff.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-4">
                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 text-[10px] font-bold">
                                                        {staff.role}
                                                    </Badge>
                                                </td>
                                                <td className="py-5 px-4 text-sm font-medium text-slate-500">{staff.date}</td>
                                                <td className="py-5 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn(
                                                            "w-1.5 h-1.5 rounded-full",
                                                            staff.status === 'Active' ? "bg-green-500" :
                                                                staff.status === 'In Clinic' ? "bg-indigo-500 animate-pulse" : "bg-orange-500"
                                                        )} />
                                                        <span className="text-xs font-bold text-slate-700">{staff.status}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-4 text-right">
                                                    <Button variant="ghost" size="sm" className="rounded-xl font-bold text-slate-400 hover:text-indigo-600">
                                                        Profile
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </PanzeCard>
                    </TabsContent>

                    <TabsContent value="onboarding" className="animate-in fade-in slide-in-from-bottom-4">
                        <StaffHRModule />
                    </TabsContent>

                    <TabsContent value="attendance" className="animate-in fade-in slide-in-from-bottom-4">
                        <AttendanceHub />
                    </TabsContent>

                    <TabsContent value="performance" className="animate-in fade-in slide-in-from-bottom-4">
                        <PerformanceScorecard />
                    </TabsContent>

                    <TabsContent value="leave" className="animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
                            <CalendarCheck className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900">Leave Portal</h3>
                            <p className="text-slate-500">Automated leave requests and approval flow.</p>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

