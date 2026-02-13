'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="flex-1 space-y-8 p-4 lg:p-10">
            {/* Header Skeleton */}
            <div className="space-y-2 max-w-7xl mx-auto">
                <Skeleton className="h-16 w-96" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
                {/* Sidebar Metrics */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-6 rounded-[2.5rem]">
                        <Skeleton className="h-32 w-full" />
                    </Card>
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-6 rounded-[2.5rem]">
                            <Skeleton className="h-20 w-full" />
                        </Card>
                        <Card className="p-6 rounded-[2.5rem]">
                            <Skeleton className="h-20 w-full" />
                        </Card>
                    </div>
                    <Card className="p-8 rounded-[3rem]">
                        <Skeleton className="h-48 w-full" />
                    </Card>
                </div>

                {/* Main Case Feed */}
                <div className="lg:col-span-8">
                    <Card className="p-8 lg:p-12 rounded-[3.5rem] min-h-[600px]">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-8 w-24 rounded-full" />
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
