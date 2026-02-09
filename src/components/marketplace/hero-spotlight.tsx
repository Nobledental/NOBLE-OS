"use client";

import { Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpotlightProps {
    title: string;
    description: string;
    imageGradient: string;
    offerTag?: string;
    ctaText?: string;
}

export function HeroSpotlight({
    title = "SMILE MAKEOVER",
    description = "Get 50% off on all heavy duty zirconia crowns.",
    imageGradient = "from-orange-500 to-red-600",
    offerTag = "LIMITED TIME DEAL",
    ctaText = "BOOK NOW"
}: SpotlightProps) {
    return (
        <div className={`relative w-full h-[220px] rounded-[32px] overflow-hidden bg-gradient-to-r ${imageGradient} shadow-2xl group cursor-pointer`}>
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

            <div className="absolute inset-0 p-8 flex flex-col justify-center text-white z-10">
                {offerTag && (
                    <div className="inline-flex items-center gap-1 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full w-fit mb-4 border border-white/10">
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        <span className="text-[10px] font-bold tracking-widest">{offerTag}</span>
                    </div>
                )}

                <h2 className="text-4xl font-black uppercase leading-none mb-2 drop-shadow-lg max-w-md">
                    {title}
                </h2>
                <p className="text-white/90 font-medium text-sm max-w-sm leading-relaxed mb-6">
                    {description}
                </p>

                <Button className="bg-white text-black hover:bg-white/90 font-extrabold rounded-full px-8 py-6 w-fit text-xs tracking-widest transition-transform group-hover:scale-105 active:scale-95">
                    {ctaText} <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
            </div>

            {/* Shine Effect */}
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine" />
        </div>
    );
}
