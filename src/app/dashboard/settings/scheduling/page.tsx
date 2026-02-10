"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ClinicSchedulingSettings } from "@/components/settings/clinic-scheduling-settings";
import { useSchedulingStore } from "@/lib/scheduling-store";
import { generateAvailableSlots } from "@/lib/scheduling-engine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SchedulingPage() {
    const config = useSchedulingStore();
    const availableSlots = generateAvailableSlots(config);

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
            {/* Left: Admin Settings Panel */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 border-r border-gray-200">
                <div className="mb-6">
                    <Link href="/dashboard?view=operations">
                        <Button variant="ghost" className="gap-2 text-slate-500 hover:text-slate-900 px-0 hover:bg-transparent">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="font-bold uppercase tracking-wider text-xs">Back to Dashboard</span>
                        </Button>
                    </Link>
                </div>
                <ClinicSchedulingSettings />
            </div>

            {/* Right: Real-time Patient Preview Panel */}
            <div className="w-full lg:w-[400px] bg-white p-6 shadow-xl z-10 flex flex-col border-l border-gray-200">
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Live Patient App Preview</h3>
                    <h2 className="text-xl font-extrabold text-brand-primary">Dr. Book Screen</h2>
                </div>

                <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl p-4 overflow-y-auto relative">
                    {/* Mock Patient UI */}
                    <div className="space-y-6">
                        {/* Clinic Info */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">🏥</div>
                            <h3 className="font-bold text-gray-900">Noble Dental Clinic</h3>
                            <p className="text-xs text-gray-500">Anna Nagar, Chennai</p>

                            {config.bookingMode === 'open_queue' && (
                                <Badge className="mt-2 bg-purple-100 text-purple-700 border-purple-200">
                                    Walk-ins Welcome
                                </Badge>
                            )}
                        </div>

                        {/* Doctor Selection (Conditional) */}
                        {config.showDoctorAvailability ? (
                            <div>
                                <h4 className="font-bold text-sm mb-3">Select Doctor</h4>
                                <div className="space-y-2">
                                    {config.doctors.filter(d => d.isAvailable).map(doc => (
                                        <div key={doc.id} className="flex items-center gap-3 p-2 border rounded-lg hover:border-brand-primary cursor-pointer transition-colors bg-white shadow-sm">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                {doc.name.charAt(4)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-sm">{doc.name}</div>
                                                <div className="text-[10px] text-gray-500">{doc.specialty}</div>
                                            </div>
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                        </div>
                                    ))}
                                    {config.doctors.filter(d => d.isAvailable).length === 0 && (
                                        <p className="text-xs text-red-500 italic">No doctors available currently.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-brand-bg-subtle p-3 rounded-lg text-center">
                                <p className="text-xs font-bold text-brand-text-primary">Fast-Track Queue</p>
                                <p className="text-[10px] text-brand-text-secondary">Next available doctor will cover you.</p>
                            </div>
                        )}

                        {/* Slots Grid */}
                        <div>
                            <h4 className="font-bold text-sm mb-3">Available Slots Today</h4>
                            {config.bookingMode === 'open_queue' ? (
                                <div className="text-center p-8 bg-gray-50 rounded-xl">
                                    <div className="text-2xl mb-2">⌚</div>
                                    <p className="font-bold text-gray-700">Open Queue</p>
                                    <p className="text-xs text-gray-500">Visit anytime between {config.operatingHours.start} - {config.operatingHours.end}</p>
                                    <Button className="mt-4 w-full bg-brand-primary">Join Queue</Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {availableSlots.length > 0 ? availableSlots.map(slot => (
                                        <div
                                            key={slot}
                                            className="py-2 text-xs font-bold text-center border rounded-md hover:bg-brand-primary hover:text-white cursor-pointer transition-colors"
                                        >
                                            {slot}
                                        </div>
                                    )) : (
                                        <div className="col-span-3 text-center py-8 text-gray-400 text-sm">
                                            No slots created based on current rules.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Config Summary (Debug for User) */}
                        <div className="mt-8 pt-4 border-t text-[10px] text-gray-400 font-mono">
                            <div>Mode: {config.bookingMode}</div>
                            <div>Slots: {availableSlots.length} found</div>
                            <div>Hours: {config.operatingHours.start}-{config.operatingHours.end}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
