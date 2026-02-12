"use client";

import { useEffect, useState } from "react";
import { useSchedulingStore } from "@/lib/scheduling-store";

export function StoreHydration() {
    useEffect(() => {
        // Manually trigger hydration on client mount
        useSchedulingStore.persist.rehydrate();
    }, []);

    return null;
}
