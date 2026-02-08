"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PanzeCard } from "@/components/ui/panze-card";
import { Settings2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    const router = useRouter();

    useEffect(() => {
        // Automatically redirect to the more powerful Admin Dashboard
        const timer = setTimeout(() => {
            router.push("/dashboard");
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
            <PanzeCard className="max-w-md w-full p-12 text-center space-y-8 glass-white border-white/40">
                <div className="w-20 h-20 bg-neo-vibrant-blue/10 text-neo-vibrant-blue rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Settings2 className="w-10 h-10" />
                </div>

                <div className="space-y-3">
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 italic">Settings are Moving.</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        We've consolidated all clinic controls directly into the **Admin Dashboard** for a more unified management experience.
                    </p>
                </div>

                <div className="pt-4">
                    <Button
                        onClick={() => router.push("/dashboard")}
                        className="w-full bg-slate-900 text-white rounded-2xl py-6 font-black uppercase tracking-widest hover:bg-slate-800 group"
                    >
                        Go to Dashboard
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    Redirecting in 3 seconds...
                </p>
            </PanzeCard>
        </div>
    );
}
