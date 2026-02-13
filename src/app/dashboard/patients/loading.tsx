'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="flex-1 space-y-6 pb-20">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Search Toolbar */}
            <Card className="rounded-xl overflow-hidden min-h-[500px]">
                <div className="p-4 border-b border-slate-100 flex gap-4">
                    <Skeleton className="h-10 flex-1 max-w-sm rounded-lg" />
                    <Skeleton className="h-10 w-24 rounded-lg" />
                </div>

                {/* Table Skeleton */}
                <div className="p-4 space-y-3">
                    {/* Table Header */}
                    <div className="flex gap-4 pb-3 border-b border-slate-100">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-24 ml-auto" />
                    </div>

                    {/* Table Rows */}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="flex gap-4 py-3 items-center">
                            <Skeleton className="h-5 w-32" />
                            <div className="space-y-1">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-8 w-24 ml-auto rounded-md" />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
