"use client";

import { CircularCategory } from "@/components/marketplace/circular-category";
import { SwiggyRestaurantCard } from "@/components/marketplace/swiggy-restaurant-card";
import { MapPin, ChevronDown, User, Search, Percent } from "lucide-react";

export default function MarketplacePage() {
    return (
        <div className="bg-swiggy-bg min-h-screen">
            {/* Swiggy Header */}
            <div className="bg-white p-4 sticky top-0 z-40 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 cursor-pointer max-w-[70%]">
                        <MapPin className="w-6 h-6 text-swiggy-orange" fill="currentColor" />
                        <div>
                            <div className="flex items-center gap-1">
                                <h2 className="font-extrabold text-swiggy-text text-base">Home</h2>
                                <ChevronDown className="w-4 h-4 text-swiggy-text-secondary" />
                            </div>
                            <p className="text-xs text-swiggy-text-secondary truncate">
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
                        className="w-full bg-gray-100/80 border-none rounded-xl py-3 pl-4 pr-10 text-sm font-medium text-swiggy-text placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
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

                {/* 2. Banner Carousel (Mock) */}
                <div className="flex gap-4 overflow-x-auto px-4 py-4 hide-scrollbar">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="min-w-[300px] h-[160px] rounded-2xl bg-gradient-to-r from-swiggy-orange to-orange-400 relative p-4 flex flex-col justify-center text-white shrink-0 shadow-lg">
                            <h3 className="font-extrabold text-2xl w-2/3">FREE DENTAL CHECKUP</h3>
                            <button className="mt-3 bg-white text-swiggy-orange font-bold text-xs py-2 px-4 rounded-full w-fit">
                                BOOK NOW
                            </button>
                            <div className="absolute right-0 bottom-0 opacity-20">
                                <Percent className="w-32 h-32 -rotate-12" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. Filter Bar */}
                <div className="px-4 flex gap-3 overflow-x-auto hide-scrollbar">
                    {["Filter", "Sort By", "Fast Delivery", "Rated 4.0+"].map((f, i) => (
                        <button key={f} className="px-3 py-1.5 rounded-full border border-gray-300 bg-white text-xs font-bold text-swiggy-text-secondary whitespace-nowrap">
                            {f}
                        </button>
                    ))}
                </div>

                {/* 4. Restaurant Grid */}
                <div className="bg-white pt-6 rounded-t-3xl min-h-[500px]">
                    <div className="flex items-center gap-2 px-4 mb-6">
                        <div className="w-1 h-6 bg-swiggy-orange rounded-full" />
                        <h3 className="font-extrabold text-swiggy-text text-lg tracking-tight">
                            Clinics with Great Offers
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SwiggyRestaurantCard
                                key={i}
                                name={["Clove Dental", "Apollo White", "Partha Dental", "Smiles Care"][i % 4]}
                                specialties={["Root Canal", "Implants", "Orthodontics", "Cosmetic"]}
                                rating={4.5}
                                time={`${25 + i * 5} MINS`}
                                distance="2.5 km"
                                imageUrl="" /* Placeholder logic in component */
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
