"use client";

import { Star, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ClinicCardProps {
    name: string;
    specialties: string[];
    rating: number;
    time: string;
    distance: string;
    discount?: string;
    imageUrl?: string;
}

export function SwiggyRestaurantCard({
    name,
    specialties,
    rating,
    time,
    distance,
    discount = "50% OFF UPTO ₹100",
    imageUrl
}: ClinicCardProps) {
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

            {/* Content Body */}
            <div className="p-3">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-swiggy-text text-lg line-clamp-1">{name}</h3>
                    <div className="flex items-center gap-1 bg-swiggy-green text-white px-1.5 py-0.5 rounded-[6px] shadow-sm">
                        <span className="font-bold text-xs">{rating}</span>
                        <Star className="w-2.5 h-2.5 fill-current" />
                    </div>
                </div>

                <div className="flex flex-col gap-0.5">
                    <p className="text-swiggy-text-secondary text-sm truncate font-medium">
                        {specialties.join(", ")}
                    </p>
                    <p className="text-swiggy-text-secondary text-xs truncate">
                        {distance} away
                    </p>
                </div>

                <div className="mt-3 pt-3 border-t border-dashed border-gray-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-swiggy-green" />
                    <span className="text-xs font-bold text-swiggy-text-secondary uppercase">
                        {time}
                    </span>
                </div>
            </div>
        </div>
    );
}
