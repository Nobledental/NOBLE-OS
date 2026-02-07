"use client";

import { useState } from "react";
import { useSchedulingStore, BreakInterval } from "@/lib/scheduling-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"; // Assuming you have this or standard checkbox
import { Trash2, Plus, Clock, Users, CalendarCheck, Zap, Armchair } from "lucide-react";
import { cn } from "@/lib/utils";

export function ClinicSchedulingSettings() {
    const store = useSchedulingStore();

    // Local state for new break input
    const [newBreak, setNewBreak] = useState<Partial<BreakInterval>>({ start: "", end: "", label: "" });

    const handleAddBreak = () => {
        if (newBreak.start && newBreak.end && newBreak.label) {
            store.addBreak(newBreak as any);
            setNewBreak({ start: "", end: "", label: "" });
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-brand-primary" />
                    Appointment & Scheduling Rules
                </h3>
                <p className="text-sm text-gray-500">Configure how patients book appointments and how the system handles them.</p>
            </div>

            {/* 1. Operating Hours & Breaks */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <h4 className="font-semibold text-gray-800">Clinic Timings</h4>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Operating Hours */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700 block">Operating Hours (Daily)</label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="time"
                                value={store.operatingHours.start}
                                onChange={(e) => store.setOperatingHours(e.target.value, store.operatingHours.end)}
                                className="w-32"
                            />
                            <span className="text-gray-400">to</span>
                            <Input
                                type="time"
                                value={store.operatingHours.end}
                                onChange={(e) => store.setOperatingHours(store.operatingHours.start, e.target.value)}
                                className="w-32"
                            />
                        </div>
                        <p className="text-xs text-gray-400">Standard hours for availability generation.</p>
                    </div>

                    {/* Breaks */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700 block">Break Hours (Lunch, etc.)</label>
                        <div className="space-y-2">
                            {store.breaks.map((b) => (
                                <div key={b.id} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-md">
                                    <span className="font-medium text-gray-700 w-24">{b.start} - {b.end}</span>
                                    <span className="text-gray-500 flex-1">{b.label}</span>
                                    <button onClick={() => store.removeBreak(b.id)} className="text-red-400 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Break */}
                        <div className="flex gap-2 items-end">
                            <div className="flex-1 space-y-1">
                                <label className="text-xs text-gray-400">Start</label>
                                <Input type="time" value={newBreak.start} onChange={e => setNewBreak({ ...newBreak, start: e.target.value })} className="h-8 text-xs" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <label className="text-xs text-gray-400">End</label>
                                <Input type="time" value={newBreak.end} onChange={e => setNewBreak({ ...newBreak, end: e.target.value })} className="h-8 text-xs" />
                            </div>
                            <div className="flex-[2] space-y-1">
                                <label className="text-xs text-gray-400">Label</label>
                                <Input type="text" placeholder="e.g. Lunch" value={newBreak.label} onChange={e => setNewBreak({ ...newBreak, label: e.target.value })} className="h-8 text-xs" />
                            </div>
                            <Button size="sm" variant="outline" onClick={handleAddBreak} className="h-8">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Booking Mode Configuration */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-gray-400" />
                    <h4 className="font-semibold text-gray-800">Booking Automation Mode</h4>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <div
                        onClick={() => store.setBookingMode('auto')}
                        className={cn(
                            "cursor-pointer border rounded-lg p-4 transition-all hover:bg-brand-bg-subtle",
                            store.bookingMode === 'auto' ? "border-brand-primary bg-orange-50 ring-1 ring-brand-primary" : "border-gray-200"
                        )}
                    >
                        <div className="font-bold text-gray-900 mb-1">🤖 Auto-Accept</div>
                        <p className="text-xs text-gray-500">System automatically confirms bookings if slot is free. Best for high volume.</p>
                    </div>

                    <div
                        onClick={() => store.setBookingMode('manual')}
                        className={cn(
                            "cursor-pointer border rounded-lg p-4 transition-all hover:bg-brand-bg-subtle",
                            store.bookingMode === 'manual' ? "border-brand-primary bg-orange-50 ring-1 ring-brand-primary" : "border-gray-200"
                        )}
                    >
                        <div className="font-bold text-gray-900 mb-1">🛡️ Manual Approval</div>
                        <p className="text-xs text-gray-500">Admin must approve every request. Control over schedule.</p>
                    </div>

                    <div
                        onClick={() => store.setBookingMode('open_queue')}
                        className={cn(
                            "cursor-pointer border rounded-lg p-4 transition-all hover:bg-brand-bg-subtle",
                            store.bookingMode === 'open_queue' ? "border-brand-primary bg-orange-50 ring-1 ring-brand-primary" : "border-gray-200"
                        )}
                    >
                        <div className="font-bold text-gray-900 mb-1">🏥 Open Queue</div>
                        <p className="text-xs text-gray-500">Accept all bookings (Walk-in style). Times are estimates only.</p>
                    </div>
                </div>
            </div>

            {/* 3. Chair Capacity (NEW) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Armchair className="w-5 h-5 text-gray-400" />
                    <h4 className="font-semibold text-gray-800">Chair Capacity Configuration</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Total Operational Chairs</label>
                            <Input
                                type="number"
                                placeholder="e.g. 5"
                                className="w-full"
                            // In a real app, bind to store state
                            />
                            <p className="text-xs text-gray-400">Total physical chairs installed in the clinic.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-brand-primary block">Consultation Ready (Active)</label>
                            <Input
                                type="number"
                                placeholder="e.g. 3"
                                className="w-full border-brand-primary ring-1 ring-brand-primary/20"
                            // In a real app, bind to store state
                            />
                            <p className="text-xs text-gray-400">
                                This number controls the <b>Automated Booking System</b>.
                                <br />If set to <b>3</b>, the system will allow 3 simultaneous appointments.
                            </p>
                        </div>
                    </div>

                    {/* Utilization Gauge Mock */}
                    <div className="bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3 border border-dashed border-slate-200">
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200" />
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="351.86" strokeDashoffset="140" className="text-brand-primary" />
                            </svg>
                            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-slate-900">60%</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Yield</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 max-w-[200px]">
                            You are utilizing <b>3 out of 5</b> chairs. Increasing active chairs will open more slots.
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Doctor Availability & Visibility */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <h4 className="font-semibold text-gray-800">Doctor Availability</h4>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Show Doctors to Patients</span>
                        <Switch
                            checked={store.showDoctorAvailability}
                            onCheckedChange={store.toggleAvailabilityVisibility}
                        />
                    </div>
                </div>

                {store.showDoctorAvailability && (
                    <div className="space-y-3 pl-7 border-l-2 border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Toggle specific doctor availability (e.g. if on leave)</p>
                        {store.doctors.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-gray-800">{doc.name}</span>
                                    <span className="text-xs text-gray-500">{doc.specialty}</span>
                                </div>
                                <Switch
                                    checked={doc.isAvailable}
                                    onCheckedChange={() => store.toggleDoctorAvailability(doc.id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {!store.showDoctorAvailability && (
                    <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-md">
                        Patients will simply book a slot with the clinic, not a specific doctor.
                        The Admin will assign a doctor upon arrival.
                    </div>
                )}
            </div>
        </div>
    );
}
