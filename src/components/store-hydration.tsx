"use client";

import { useEffect } from "react";
import { useSchedulingStore } from "@/lib/scheduling-store";

export function StoreHydration() {
    useEffect(() => {
        // 1. Initial Hydration
        useSchedulingStore.persist.rehydrate();

        // 2. Listen for cross-tab updates
        const handleStorage = (event: StorageEvent) => {
            if (event.key === useSchedulingStore.persist.getOptions().name) {
                useSchedulingStore.persist.rehydrate();
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return null;
}
