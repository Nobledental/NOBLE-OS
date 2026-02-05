"use client";

import { Star, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProviderCardProps {
    name: string;
    specialties: string[];
    rating: number;
    time: string;
    distance: string;
    discount?: string; // Renamed from offers to discount to match usage or keep as offers
    offers?: string;   // Keeping both loosely or unifying.
    imageUrl?: string;
}

export function ProviderCard({
    name,
    specialties,
    rating,
    time,
    distance,
    discount,
    offers,
    imageUrl
}: ProviderCardProps) {
    const displayOffer = discount || offers || "50% OFF UPTO ₹100";
    return (
        <div className="bg-white rounded-2xl overflow-hidden hover:scale-[0.98] transition-transform duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer group">
            {/* Image Header */}
            <div className="relative h-[160px] w-full bg-gray-200">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                        <MapPin className="w-12 h-12" />
                    </div>
                )}

                {/* Discount Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/90 to-transparent flex items-end px-3 py-2">
                    <span className="text-white font-extrabold text-[22px] font-sans tracking-tighter leading-none">
                        {discount}
                    </span>
                </div>

                {/* Like Heart */}
                <div className="absolute top-3 right-3">
                    {/* Heart svg would go here */}
                </div>

            </div>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-brand-text-primary text-lg">{name}</h3>
                    <Badge className="bg-brand-success text-white">{rating} ★</Badge>
                </div>
                <p className="text-brand-text-secondary text-sm mt-1">{specialties.join(", ")}</p>
                <div className="flex items-center gap-2 mt-3 text-brand-text-secondary text-xs uppercase font-medium">
                    <Clock className="w-4 h-4" /> {time}
                    <span className="w-1 h-1 bg-brand-text-secondary rounded-full" />
                    <span>{distance}</span>
                </div>
            </div>
        </div>
    );
}
