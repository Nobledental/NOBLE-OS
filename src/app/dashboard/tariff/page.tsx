"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TariffMasterHub } from "@/components/finance/tariff-master-hub";

export default function TariffPage() {
    return (
        <div className="h-full space-y-4">
            <div className="flex items-center">
                <Link href="/dashboard?view=operations">
                    <Button variant="ghost" className="gap-2 text-slate-500 hover:text-slate-900 px-0 hover:bg-transparent">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-bold uppercase tracking-wider text-xs">Back to Dashboard</span>
                    </Button>
                </Link>
            </div>
            <TariffMasterHub />
        </div>
    );
}
