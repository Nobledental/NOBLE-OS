"use client";

import { CircularCategory } from "@/components/marketplace/circular-category";
import { ProviderCard } from "@/components/marketplace/provider-card";
import { LogisticsCard } from "@/components/marketplace/logistics-card";
import { HeroSpotlight } from "@/components/marketplace/hero-spotlight";
import { MapPin, ChevronDown, User, Search } from "lucide-react";

export default function MarketplacePage() {
    return (
        <div className="bg-brand-bg-subtle min-h-screen">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-40 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 cursor-pointer max-w-[70%]">
                        <MapPin className="w-6 h-6 text-brand-primary" fill="currentColor" />
                        <div>
                            <div className="flex items-center gap-1">
                                <h2 className="font-extrabold text-brand-text-primary text-base">Home</h2>
                                <ChevronDown className="w-4 h-4 text-brand-text-secondary" />
                            </div>
                            <p className="text-xs text-brand-text-secondary truncate">
                                Noble Dental, Anna Nagar, Chennai - 600040...
                            </p>
                        </div>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for 'Braces' or 'Smile Design'"
                        className="w-full bg-gray-100/80 border-none rounded-xl py-3 pl-4 pr-10 text-sm font-medium text-brand-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </div>

            {/* Content Feed */}
            <div className="space-y-4 pb-20">

                {/* 1. What's on your mind? */}
                <div className="bg-white pb-2">
                    <CircularCategory />
                </div>

                {/* 2. Spotlight & Logistics Section */}
                <div className="px-4 py-2 space-y-6">
                    {/* Hero Banner */}
                    <HeroSpotlight
                        title="DENTAL IMPLANTS"
                        description="Swiss-grade implants with lifetime warranty starting @ ₹15,000"
                        imageGradient="from-violet-600 to-purple-600"
                    />

                    {/* Logistics */}
                    <LogisticsCard />
                </div>

                {/* 3. Filter Bar */}
                <div className="px-4 flex gap-3 overflow-x-auto hide-scrollbar">
                    {["Filter", "Sort By", "Fast Delivery", "Rated 4.0+"].map((f, i) => (
                        <button key={f} className="px-3 py-1.5 rounded-full border border-gray-300 bg-white text-xs font-bold text-brand-text-secondary whitespace-nowrap">
                            {f}
                        </button>
                    ))}
                </div>

                {/* 4. Provider Grid */}
                <div className="bg-white pt-6 rounded-t-3xl min-h-[500px]">
                    <div className="flex items-center gap-2 px-4 mb-6">
                        <div className="w-1 h-6 bg-brand-primary rounded-full" />
                        <h3 className="font-extrabold text-brand-text-primary text-lg tracking-tight">
                            Clinics with Great Offers
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <ProviderCard
                                key={i}
                                name={["Clove Dental", "Apollo White", "Partha Dental", "Smiles Care"][i % 4]}
                                specialties={["Root Canal", "Implants", "Orthodontics", "Cosmetic"]}
                                rating={4.5}
                                time={`${25 + i * 5} MINS`}
                                distance="2.5 km"
                                imageUrl=""
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
