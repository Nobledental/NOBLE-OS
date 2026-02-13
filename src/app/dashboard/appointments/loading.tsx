'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-6">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Search Bar Skeleton */}
            <Skeleton className="h-10 w-full max-w-md rounded-xl" />

            {/* Date Strip Skeleton */}
            <div className="flex gap-2 overflow-hidden">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <Skeleton key={i} className="h-14 w-14 rounded-2xl shrink-0" />
                ))}
            </div>

            {/* Filter Chips Skeleton */}
            <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 w-24 rounded-full" />
                ))}
            </div>

            {/* Appointment Cards Skeleton */}
            <div className="space-y-4 max-w-3xl mx-auto">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-5 rounded-3xl">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-8 w-32 rounded-lg" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <div className="flex gap-4">
                                <Skeleton className="h-14 w-14 rounded-2xl" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-4 w-64" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-20 rounded-lg" />
                                        <Skeleton className="h-8 w-24 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
