"use client";

import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import {
    Calendar as CalendarIcon,
    Plus,
    Clock,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog";
import { LiveLocationSharer } from "@/components/communication/live-location-sharer";

export default function AppointmentsPage() {
    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl lg:text-5xl font-serif italic tracking-tighter text-white">Appointments</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">Manage schedule and patient bookings.</p>
                </div>
                <NewAppointmentDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PanzeCard className="md:col-span-2 glass-neo border-white/5 bg-white/[0.01] p-0 flex flex-col min-h-[500px] overflow-hidden">
                    <div className="p-8 border-b border-white/5">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Daily Schedule</h3>
                    </div>
                    <div className="flex-1 flex items-center justify-center relative">
                        <div className="text-center space-y-4 relative z-10">
                            <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 flex items-center justify-center mx-auto border border-white/10 shadow-2xl">
                                <CalendarIcon className="w-10 h-10 text-white/20" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/20 italic">Calendar view coming soon...</p>
                        </div>
                        {/* Decorative Aura */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent blur-3xl" />
                    </div>
                </PanzeCard>

                <div className="space-y-6">
                    <PanzeCard className="glass-neo border-white/5 bg-white/[0.01] p-8">
                        <div className="mb-8">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Quick Stats</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-white/60">Confirmed</span>
                                </div>
                                <span className="text-2xl font-serif italic text-white">18</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-white/60">Pending</span>
                                </div>
                                <span className="text-2xl font-serif italic text-white">5</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-500">
                                        <AlertCircle className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-white/60">Canceled</span>
                                </div>
                                <span className="text-2xl font-serif italic text-white">2</span>
                            </div>
                        </div>
                    </PanzeCard>

                    <LiveLocationSharer />
                </div>
            </div>
        </div>
    );
}
