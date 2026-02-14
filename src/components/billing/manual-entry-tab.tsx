/**
 * Manual Entry Billing Tab
 * 
 * Traditional tariff selector for manually adding treatments
 * Used when treatments weren't tracked in clinical module
 */

"use client";

import { TreatmentSelector } from "@/components/billing/treatment-selector";

export function ManualEntryTab() {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        Manual Entry
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Add treatments manually from tariff master
                    </p>
                </div>
            </div>

            {/* Tariff Selector (existing component) */}
            <TreatmentSelector />
        </div>
    );
}
