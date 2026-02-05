"use client";

import { ArrowLeft, Search, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const categories = [
    { name: "Pain Relief", color: "bg-red-50" },
    { name: "Dental Care", color: "bg-blue-50" },
    { name: "First Aid", color: "bg-green-50" },
    { name: "Supplements", color: "bg-purple-50" },
    { name: "Devices", color: "bg-orange-50" },
];

const products = [
    { name: "Colgate Plax", price: "₹120", time: "10 mins", image: "🧴" },
    { name: "Sensodyne", price: "₹180", time: "15 mins", image: "tubes" },
    { name: "Oral-B Floss", price: "₹250", time: "12 mins", image: "🧵" },
    { name: "Listerine", price: "₹110", time: "8 mins", image: "🍾" },
    { name: "Pain Killer", price: "₹50", time: "10 mins", image: "💊" },
    { name: "Thermometer", price: "₹300", time: "25 mins", image: "🌡️" },
];

export default function PharmacyPage() {
    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-40 shadow-sm flex items-center gap-4">
                <Link href="/dashboard/marketplace">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Link>
                <div className="flex-1">
                    <h1 className="font-extrabold text-xl text-brand-text-primary">Pharmacy</h1>
                    <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Delivery in 10-20 mins
                    </p>
                </div>
                <Search className="w-6 h-6 text-gray-700" />
            </div>

            {/* Categories */}
            <div className="py-6 bg-white mb-4">
                <h3 className="px-4 text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">
                    Shop By Category
                </h3>
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex w-max space-x-4 px-4 pb-4">
                        {categories.map((cat, i) => (
                            <div key={i} className={`w-24 h-32 rounded-xl ${cat.color} flex flex-col items-center justify-center gap-2 border border-gray-100`}>
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    💊
                                </div>
                                <span className="text-xs font-bold text-gray-700 text-center px-1 break-words whitespace-normal">
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="hidden" />
                </ScrollArea>
            </div>

            {/* Product Grid */}
            <div className="px-4">
                <h3 className="text-lg font-extrabold text-brand-text-primary mb-4">Best Sellers</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((item, i) => (
                        <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex flex-col relative">
                            <div className="h-32 bg-gray-50 rounded-lg mb-3 flex items-center justify-center text-4xl">
                                {item.image}
                            </div>
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-[4px] text-[10px] font-bold text-gray-600 border border-gray-100 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {item.time}
                            </div>
                            <h4 className="font-bold text-sm text-gray-700 mb-1 line-clamp-2">{item.name}</h4>
                            <div className="mt-auto flex items-center justify-between">
                                <span className="font-bold text-sm text-gray-900">{item.price}</span>
                                <div className="w-8 h-8 rounded-lg border border-red-100 bg-white text-red-500 flex items-center justify-center font-bold shadow-sm">
                                    <Plus className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
