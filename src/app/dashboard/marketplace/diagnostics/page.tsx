"use client";

import { ArrowLeft, TestTube, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProviderCard } from "@/components/marketplace/provider-card";

export default function DiagnosticsPage() {
    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-40 shadow-sm flex items-center gap-4">
                <Link href="/dashboard/marketplace">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Link>
                <div className="flex-1">
                    <h1 className="font-extrabold text-xl text-brand-text-primary">Diagnostics</h1>
                    <p className="text-xs text-gray-500 font-medium">Lab Tests & Home Collection</p>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Popular Tests Wrapper */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-extrabold text-lg text-brand-text-primary">Popular Health Checks</h3>
                        <span className="text-xs font-bold text-brand-primary flex items-center gap-1">
                            VIEW ALL <ArrowRight className="w-3 h-3" />
                        </span>
                    </div>

                    <div className="space-y-4">
                        {/* Reusing Restaurant Card for Labs which fits the 'Listing' model */}
                        <ProviderCard
                            name="Metropolis Healthcare"
                            specialties={["Blood Test", "Full Body Check", "X-Ray"]}
                            rating={4.8}
                            time="1 HR"
                            distance="3.2 km"
                            offers="40% OFF"
                            imageUrl=""
                        />
                        <ProviderCard
                            name="Apollo Diagnostics"
                            specialties={["Thyroid Profile", "Vitamin D", "Diabetes"]}
                            rating={4.6}
                            time="45 MINS"
                            distance="1.8 km"
                            offers="GET FREE REPORT"
                            imageUrl=""
                        />
                    </div>
                </div>

                {/* Banner */}
                <div className="bg-blue-600 rounded-2xl p-6 text-white text-center shadow-lg transform rotate-1">
                    <TestTube className="w-12 h-12 mx-auto mb-2 opacity-80" />
                    <h3 className="text-2xl font-extrabold">Book Full Body Checkup</h3>
                    <p className="text-blue-100 text-sm mt-1">Starting at ₹499 only</p>
                    <button className="mt-4 bg-white text-blue-600 font-bold py-2 px-6 rounded-full text-xs hover:bg-blue-50 transition-colors">
                        BOOK NOW
                    </button>
                </div>
            </div>
        </div>
    );
}
