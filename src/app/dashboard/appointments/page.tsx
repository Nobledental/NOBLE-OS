"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
                    <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
                    <p className="text-muted-foreground">Manage schedule and patient bookings.</p>
                </div>
                <NewAppointmentDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Daily Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[500px] flex items-center justify-center border-2 border-dashed rounded-xl m-4 bg-slate-50 dark:bg-slate-900/50">
                        <div className="text-center space-y-2">
                            <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
                            <p className="text-muted-foreground">Calendar view coming soon...</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-sm">Confirmed</span>
                                </div>
                                <span className="font-bold">18</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    <span className="text-sm">Pending</span>
                                </div>
                                <span className="font-bold">5</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-rose-500" />
                                    <span className="text-sm">Canceled</span>
                                </div>
                                <span className="font-bold">2</span>
                            </div>
                        </CardContent>
                    </Card>

                    <LiveLocationSharer />
                </div>
            </div>
        </div>
    );
}
