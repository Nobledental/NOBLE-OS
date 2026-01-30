"use client";

import { TreatmentSelector } from "@/components/billing/treatment-selector";
import { InvoiceGenerator } from "@/components/billing/invoice-generator";

export default function BillingPage() {
    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6">
            {/* Left Pane: Treatment Menu & Tariff Master */}
            <div className="flex-1 min-w-0 flex flex-col">
                <TreatmentSelector />
            </div>

            {/* Right Pane: Live Invoice & Fintech Logic */}
            <div className="w-[450px] flex-shrink-0 flex flex-col bg-white dark:bg-slate-900 border rounded-xl shadow-lg overflow-hidden">
                <InvoiceGenerator />
            </div>
        </div>
    );
}
