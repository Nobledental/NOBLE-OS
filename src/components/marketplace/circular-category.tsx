"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const categories = [
    { name: "Root Canal", image: "🦷" },
    { name: "Braces", image: "😁" },
    { name: "Cleaning", image: "✨" },
    { name: "Implants", image: "🔩" },
    { name: "Whitening", image: "💎" },
    { name: "Crowns", image: "👑" },
    { name: "Kids", image: "🧸" },
    { name: "Aligners", image: "📏" },
];

export function CircularCategory() {
    return (
        <div className="w-full py-6">
            <h3 className="px-4 text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">
                What are you looking for?
            </h3>
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-6 px-4 pb-4">
                    {categories.map((cat, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group">
                            <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-4xl group-active:scale-95 transition-transform overflow-hidden relative">
                                {/* Simulated Image Asset */}
                                <div className={cn(
                                    "absolute inset-0 opacity-10 bg-swiggy-orange" // Placeholder tint
                                )} />
                                <span className="z-10">{cat.image}</span>
                            </div>
                            <span className="text-xs font-bold text-swiggy-text-secondary text-center w-20 truncate">
                                {cat.name}
                            </span>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
        </div>
    );
}
