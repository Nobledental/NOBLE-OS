"use client";

import { ArrowLeft, Zap, Ambulance, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FastAidPage() {
    return (
        <div className="bg-slate-900 min-h-screen text-white pb-24">
            <div className="p-4 flex items-center gap-4">
                <Link href="/dashboard/marketplace">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Link>
                <h1 className="font-extrabold text-xl">Fast Aid</h1>
            </div>

            <div className="p-6 flex flex-col items-center mt-8 text-center">
                <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(239,68,68,0.5)] mb-8">
                    <Zap className="w-16 h-16 text-white" fill="currentColor" />
                </div>

                <h2 className="text-3xl font-extrabold mb-2">Emergency Assistance</h2>
                <p className="text-slate-400 mb-8 max-w-xs">
                    Connect instantly with the nearest dental emergency unit or ambulance.
                </p>

                <div className="w-full max-w-sm space-y-4">
                    <Button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-xl gap-2 shadow-lg">
                        <Ambulance className="w-6 h-6" />
                        REQUEST AMBULANCE
                    </Button>
                    <Button className="w-full h-14 bg-white text-slate-900 hover:bg-gray-100 font-bold text-lg rounded-xl gap-2 shadow-lg">
                        <Phone className="w-6 h-6" />
                        CALL HELPLINE
                    </Button>
                </div>
            </div>
        </div>
    );
}
