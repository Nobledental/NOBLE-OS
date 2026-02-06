"use client";

import { Clock, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProviderCardProps {
    name: string;
    specialties: string[];
    rating: number;
    time: string;
    distance: string;
    discount?: string;
    offers?: string;
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
    const displayOffer = discount || offers || "FREE FIRST CONSULT";
    return (
        <div className="bg-white rounded-[2.5rem] overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 cursor-pointer group border border-slate-100/50">
            {/* Image Header */}
            <div className="relative h-[180px] w-full bg-slate-100">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-50/50 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                        <MapPin className="w-12 h-12" />
                        <span className="text-[10px] font-black uppercase mt-2 tracking-widest opacity-40 group-hover:opacity-100">Premium Partner</span>
                    </div>
                )}

                {/* Discount Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent flex items-end px-5 py-4">
                    <span className="text-white font-black text-2xl italic tracking-tighter leading-none uppercase">
                        {displayOffer}
                    </span>
                </div>
            </div>
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className="font-black text-slate-900 text-xl italic tracking-tighter">{name}</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{specialties.join(" • ")}</p>
                    </div>
                    <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] px-2 py-1 rounded-lg">
                        {rating} ★
                    </Badge>
                </div>
                <div className="flex items-center gap-3 pt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Clock className="w-3.5 h-3.5" /> {time}
                    </div>
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> {distance}
                    </div>
                </div>
            </div>
        </div>
    );
}
