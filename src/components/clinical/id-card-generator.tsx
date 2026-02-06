"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Download,
    Share2,
    ShieldCheck,
    QrCode,
    Droplets,
    Phone,
    Calendar,
    Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface IDCardData {
    name: string;
    role: string;
    id: string;
    phone: string;
    joiningDate: string;
    bloodGroup: string;
    photoUrl?: string;
}

export function IDCardGenerator({ staff, onDownload }: { staff: IDCardData, onDownload?: () => void }) {
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-black italic tracking-tighter text-slate-800">Digital ID Card</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Official Clinical Identity</p>
            </div>

            {/* The ID Card */}
            <div
                ref={cardRef}
                className="relative w-full aspect-[1/1.58] bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl p-8 text-white group"
            >
                {/* Brand Header */}
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center border-2 border-indigo-400">
                        <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black italic tracking-tighter leading-none">NOBLE DENTAL</h4>
                        <p className="text-[8px] font-bold text-indigo-300 uppercase tracking-widest leading-none mt-1">Premium Care</p>
                    </div>
                </div>

                {/* Photo Area */}
                <div className="mt-10 flex flex-col items-center gap-6 relative z-10">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-50/10 border-4 border-white/10 flex items-center justify-center overflow-hidden backdrop-blur-xl relative">
                        <div className="w-24 h-24 rounded-full bg-indigo-500/20 blur-xl absolute" />
                        <ShieldCheck className="w-14 h-14 text-white/20" />
                    </div>

                    <div className="text-center space-y-1">
                        <h2 className="text-2xl font-black italic tracking-tighter leading-none">{staff.name}</h2>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">{staff.role}</p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 relative z-10 p-6 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-md">
                    <div className="space-y-1">
                        <p className="text-[8px] font-black text-indigo-300/60 uppercase tracking-widest flex items-center gap-1">
                            <QrCode className="w-2 h-2" /> Employee ID
                        </p>
                        <p className="text-[10px] font-black tracking-widest">{staff.id}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] font-black text-indigo-300/60 uppercase tracking-widest flex items-center gap-1">
                            <Droplets className="w-2 h-2" /> Blood Group
                        </p>
                        <p className="text-[10px] font-black">{staff.bloodGroup}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] font-black text-indigo-300/60 uppercase tracking-widest flex items-center gap-1">
                            <Phone className="w-2 h-2" /> Contact
                        </p>
                        <p className="text-[10px] font-black">{staff.phone}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] font-black text-indigo-300/60 uppercase tracking-widest flex items-center gap-1">
                            <Calendar className="w-2 h-2" /> Joined
                        </p>
                        <p className="text-[10px] font-black">{staff.joiningDate}</p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="absolute bottom-10 left-0 right-0 px-8 flex justify-between items-center z-10">
                    <div className="h-10 px-4 rounded-xl bg-emerald-500 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest font-mono">Verified</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <QrCode className="w-6 h-6 text-white/40" />
                    </div>
                </div>

                {/* Design Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full -mr-32 -mt-32 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600 rounded-full -ml-24 -mb-24 blur-3xl opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
            </div>

            <div className="flex gap-4">
                <Button
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl border-slate-100 font-black uppercase tracking-widest text-[10px] gap-2"
                >
                    <Share2 className="w-4 h-4" /> Share
                </Button>
                <Button
                    onClick={onDownload}
                    className="flex-1 h-14 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] gap-2 hover:bg-black"
                >
                    <Download className="w-4 h-4" /> Download
                </Button>
            </div>
        </div>
    );
}
