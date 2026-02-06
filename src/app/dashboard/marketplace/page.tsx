"use client";

import { CircularCategory } from "@/components/marketplace/circular-category";
import { ProviderCard } from "@/components/marketplace/provider-card";
import { LogisticsCard } from "@/components/marketplace/logistics-card";
import { HeroSpotlight } from "@/components/marketplace/hero-spotlight";
import { MapPin, ChevronDown, User, Search, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function MarketplacePage() {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-50 min-h-screen font-sans"
        >
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-40 shadow-sm border-b border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="rounded-full hover:bg-slate-100"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Button>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <MapPin className="w-5 h-5 text-brand-primary" fill="currentColor" />
                            <div>
                                <div className="flex items-center gap-1">
                                    <h2 className="font-black text-slate-900 text-sm italic tracking-tight">Main Clinic</h2>
                                    <ChevronDown className="w-3 h-3 text-slate-400" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 truncate max-w-[150px] uppercase tracking-widest">
                                    Anna Nagar, Chennai
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center shadow-sm">
                        <User className="w-5 h-5 text-indigo-600" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search for 'Braces' or 'Smile Design'..."
                        className="w-full bg-slate-100/80 border border-transparent rounded-2xl py-4 pl-12 pr-10 text-xs font-black uppercase tracking-widest text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-100 transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
            </div>

            {/* Content Feed */}
            <div className="space-y-6 pb-20">

                {/* 1. What's on your mind? */}
                <div className="bg-white pb-4 border-b border-slate-50">
                    <CircularCategory />
                </div>

                {/* 2. Spotlight & Logistics Section */}
                <div className="px-5 space-y-8">
                    {/* Hero Banner */}
                    <HeroSpotlight
                        title="DENTAL IMPLANTS"
                        description="Swiss-grade implants with lifetime warranty."
                        imageGradient="from-indigo-600 to-violet-600"
                    />

                    {/* Logistics */}
                    <LogisticsCard />
                </div>

                {/* 3. Filter Bar */}
                <div className="px-5 flex gap-3 overflow-x-auto hide-scrollbar">
                    {["Verified", "Sort By", "Quick Consult", "Top Rated 4.5+"].map((f, i) => (
                        <button key={f} className="px-4 py-2 rounded-full border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap hover:border-indigo-500/30 hover:text-indigo-600 transition-all shadow-sm">
                            {f}
                        </button>
                    ))}
                </div>

                {/* 4. Provider Grid */}
                <div className="bg-white pt-8 rounded-t-[3rem] shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.05)] min-h-[500px] border-t border-slate-100">
                    <div className="flex items-center gap-3 px-6 mb-8">
                        <div className="w-1.5 h-7 bg-indigo-600 rounded-full" />
                        <h3 className="font-black text-slate-900 text-2xl italic tracking-tighter">
                            Premium Clinical Partners
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <ProviderCard
                                key={i}
                                name={["Clove Dental", "Apollo White", "Partha Dental", "Smiles Care"][i % 4]}
                                specialties={["Root Canal", "Implants", "Orthodontics", "Cosmetic"]}
                                rating={4.5}
                                time="Avg Wait: 15 MINS"
                                distance="2.5 km"
                                imageUrl=""
                            />
                        ))}
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
