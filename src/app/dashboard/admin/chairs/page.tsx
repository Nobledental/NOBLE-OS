"use client";

import { ChairManagementHub } from "@/components/admin/chair-management-hub";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DentalChairsPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Back Navigation */}
                <Link href="/dashboard">
                    <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent hover:text-slate-900 text-slate-500 font-bold uppercase tracking-widest text-xs">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Button>
                </Link>

                {/* Main Content */}
                <ChairManagementHub />
            </div>
        </div>
    );
}
