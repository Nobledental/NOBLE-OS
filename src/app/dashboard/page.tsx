"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ActiveQueue } from "@/components/dashboard/active-queue";
import { ProjectsOverview } from "@/components/dashboard/projects-overview";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { PanzeCard } from "@/components/ui/panze-card";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    // Current Active Tab
    const [activeFilter, setActiveFilter] = useState('This Month');
    const filters = ['Today', 'This Week', 'This Month', 'Reports'];

    return (
        <div className="flex-1 space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-slate-500 text-sm mb-1 font-medium">Manage and track your projects</p>
                    <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight font-display">
                        Project Dashboard
                    </h1>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    {/* Date Filters */}
                    <div className="flex items-center bg-white rounded-full p-1.5 shadow-sm border border-slate-100">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={cn(
                                    "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                                    activeFilter === filter
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Search Mock */}
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search Task..."
                            className="pl-10 pr-4 py-3 rounded-full bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 w-[240px] shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[800px]">

                {/* Left Column: My Tasks (Active Queue) */}
                <div className="lg:col-span-3 h-full">
                    <ActiveQueue />
                </div>

                {/* Right Area */}
                <div className="lg:col-span-9 flex flex-col gap-6 h-full">

                    {/* Top Row: Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-[400px]">
                        <ProjectsOverview />
                        <RevenueChart />
                    </div>

                    {/* Bottom Row: Invoice Overview */}
                    <div className="h-[280px]">
                        <PanzeCard className="h-full flex flex-col justify-center items-center text-center relative overflow-hidden group">

                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Search className="w-32 h-32" />
                            </div>

                            <div className="max-w-md w-full z-10">
                                <div className="flex justify-between items-end mb-4">
                                    <h3 className="text-xl font-medium text-slate-900">Invoice Overview</h3>
                                    <button className="text-xs font-bold bg-purple-100 text-purple-700 px-3 py-1 rounded-full uppercase tracking-wider">
                                        Fintech
                                    </button>
                                </div>

                                <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden w-full">
                                    <div className="absolute top-0 left-0 h-full bg-purple-500 w-[65%]" />
                                    <div className="absolute top-0 left-[65%] h-full bg-orange-400 w-[15%]" />
                                </div>

                                <div className="flex justify-between w-full mt-4 text-sm font-medium">
                                    <div className="text-left">
                                        <span className="block text-slate-400 text-xs">Collected</span>
                                        <span className="text-slate-900">₹45,231</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-slate-400 text-xs">Overdue</span>
                                        <span className="text-red-500">5 | ₹12,000</span>
                                    </div>
                                </div>
                            </div>
                        </PanzeCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
