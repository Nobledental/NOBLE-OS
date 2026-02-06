"use client";

import { Card } from "@/components/ui/card";
import { QrCode, ShieldCheck, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AbhaCardProps {
    name: string;
    abhaNumber: string;
    abhaAddress: string;
    dob: string;
    gender: string;
}

export function AbhaCard({
    name = "Dhivakaran",
    abhaNumber = "91-8976-4532-12",
    abhaAddress = "dhiva@abha",
    dob = "12-05-1995",
    gender = "Male"
}: Partial<AbhaCardProps>) {

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    return (
        <div className="relative group perspective-1000">
            {/* Main Card Container with visual depth */}
            <div className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden transition-transform duration-500 hover:rotate-y-3 hover:scale-[1.02] shadow-2xl">

                {/* Gradient Background (Official Orange/Blue Theme) */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-400 to-blue-600" />

                {/* Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />

                {/* Decorative Patterns */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-900/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                {/* Content */}
                <div className="relative h-full p-5 flex flex-col justify-between text-white">

                    {/* Header: Logos */}
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5" />
                                ABHA
                            </h2>
                            <span className="text-[10px] font-medium opacity-90 tracking-wider">Ayushman Bharat Health Account</span>
                        </div>
                        {/* Simulated Emblem */}
                        <div className="w-8 h-10 border-2 border-white/30 rounded-sm flex items-center justify-center bg-white/10">
                            <span className="text-[8px] font-bold text-center leading-none">GOV<br />IN</span>
                        </div>
                    </div>

                    {/* Middle: Profile & QR */}
                    <div className="flex items-center gap-4 mt-2">
                        {/* Profile Pic Placeholder */}
                        <div className="w-16 h-16 rounded-lg bg-slate-200 border-2 border-white/50 shadow-inner flex items-center justify-center overflow-hidden shrink-0">
                            <span className="text-2xl">👨‍🦰</span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg leading-tight truncate">{name}</h3>
                            <div className="flex items-center gap-3 mt-1 text-xs opacity-90 font-mono">
                                <span>{dob}</span>
                                <span className="w-1 h-1 rounded-full bg-white/50" />
                                <span>{gender}</span>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="bg-white p-2 rounded-lg shadow-lg shrink-0">
                            <QrCode className="w-12 h-12 text-slate-900" />
                        </div>
                    </div>

                    {/* Footer: ID & Address */}
                    <div className="mt-auto pt-4 space-y-2">
                        <div className="flex items-center justify-between bg-black/20 rounded-lg p-2 backdrop-blur-md border border-white/10">
                            <div>
                                <p className="text-[9px] uppercase tracking-widest opacity-70">ABHA Number</p>
                                <p className="font-mono font-bold tracking-widest text-sm shadow-black drop-shadow-sm">{abhaNumber}</p>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 hover:bg-white/20 text-white"
                                onClick={() => copyToClipboard(abhaNumber, "ABHA Number")}
                            >
                                <Copy className="w-3 h-3" />
                            </Button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="bg-blue-900/40 px-3 py-1 rounded-full border border-blue-400/30">
                                <span className="text-[10px] opacity-80 mr-2">PHR Address:</span>
                                <span className="font-bold text-xs font-mono">{abhaAddress}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reflection Effect */}
            <div className="absolute -bottom-4 left-4 right-4 h-4 bg-black/20 blur-xl rounded-[100%]" />
        </div>
    );
}
