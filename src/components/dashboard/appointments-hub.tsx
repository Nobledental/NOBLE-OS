"use client";

import { useState } from "react";
import { PanzeCard } from "@/components/ui/panze-card";
import {
    Calendar as CalendarIcon,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Search,
    User,
    MoreHorizontal,
    Phone
} from "lucide-react";
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog";
import { LiveLocationSharer } from "@/components/communication/live-location-sharer";
import { useSchedulingStore, PROCEDURE_TYPES } from "@/lib/scheduling-store";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AppointmentsHub() {
    const store = useSchedulingStore();
    const [selectedDate, setSelectedDate] = useState(new Date());

    // --- Calendar Logic ---
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // --- Filter Appointments for Selected Date ---
    // Note: Store dates are strings "YYYY-MM-DD". We need to match reliable.
    const selectedDateString = format(selectedDate, "yyyy-MM-dd");

    // Sort logic: Confirmed first, then by time
    const todaysAppointments = store.appointments
        .filter(appt => appt.date === selectedDateString)
        .sort((a, b) => a.slot.localeCompare(b.slot));

    const stats = {
        confirmed: todaysAppointments.filter(a => !a.status || a.status === 'confirmed').length,
        pending: todaysAppointments.filter(a => a.status === 'pending').length,
        canceled: todaysAppointments.filter(a => a.status === 'canceled').length
    };

    return (
        <div className="flex-1 space-y-6 h-full flex flex-col">
            {/* Header Section */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-4xl lg:text-5xl font-serif italic tracking-tighter text-slate-900">Appointments</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">
                        {format(selectedDate, "EEEE, MMMM do, yyyy")}
                    </p>
                </div>
                <NewAppointmentDialog />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">

                {/* Left Column: Calendar & Filters (4 cols) */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    {/* Mini Calendar Widget */}
                    <PanzeCard className="bg-white border border-slate-200 shadow-xl rounded-[2.5rem] p-6 overflow-hidden relative">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Calendar</h3>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-100" onClick={() => setSelectedDate(d => addDays(d, -1))}>
                                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-100" onClick={() => setSelectedDate(new Date())}>
                                    <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-100" onClick={() => setSelectedDate(d => addDays(d, 1))}>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </Button>
                            </div>
                        </div>

                        {/* Week Strip */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                <div key={i} className="text-[9px] font-bold text-center text-slate-300 uppercase">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {weekDays.map((day, i) => {
                                const isSelected = isSameDay(day, selectedDate);
                                const isTodayDate = isToday(day);
                                return (
                                    <motion.button
                                        key={i}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setSelectedDate(day)}
                                        className={cn(
                                            "aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300",
                                            isSelected ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" :
                                                isTodayDate ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "hover:bg-slate-50 text-slate-500"
                                        )}
                                    >
                                        <span className={cn("text-xs font-bold", isSelected && "font-serif italic text-lg")}>
                                            {format(day, "d")}
                                        </span>
                                        {isSelected && <div className="w-1 h-1 rounded-full bg-white mt-1" />}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </PanzeCard>

                    {/* Quick Stats (Vertical Stack) */}
                    <PanzeCard className="bg-white border border-slate-200 shadow-xl rounded-[2.5rem] p-6 flex-1">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Day Pulse</h3>
                        <div className="space-y-4">
                            <StatRow
                                icon={CheckCircle2}
                                color="emerald"
                                label="Confirmed"
                                value={stats.confirmed}
                                total={todaysAppointments.length}
                            />
                            <StatRow
                                icon={Clock}
                                color="amber"
                                label="Pending"
                                value={stats.pending}
                                total={todaysAppointments.length}
                            />
                            <StatRow
                                icon={AlertCircle}
                                color="rose"
                                label="Canceled"
                                value={stats.canceled}
                                total={todaysAppointments.length}
                            />
                        </div>

                        {/* Location Sharer tucked at bottom */}
                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <LiveLocationSharer />
                        </div>
                    </PanzeCard>
                </div>

                {/* Right Column: Appointment Feed (8 cols) */}
                <div className="md:col-span-8 flex flex-col h-full min-h-0">
                    <PanzeCard className="bg-white border border-slate-200 shadow-xl rounded-[2.5rem] p-0 flex flex-col h-full overflow-hidden">
                        {/* Feed Header */}
                        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                                    Queue ({todaysAppointments.length})
                                </h3>
                            </div>
                            <div className="bg-white rounded-full px-3 py-1.5 border border-slate-100 flex items-center gap-2 shadow-sm">
                                <Search className="w-3 h-3 text-slate-400" />
                                <input
                                    placeholder="Filter list..."
                                    className="text-[11px] font-medium text-slate-600 placeholder:text-slate-300 bg-transparent outline-none w-24"
                                />
                            </div>
                        </div>

                        {/* Scrollable Feed */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {todaysAppointments.length === 0 ? (
                                    <EmptyState />
                                ) : (
                                    todaysAppointments.map((appt, i) => (
                                        <AppointmentCard key={appt.id || i} appt={appt} store={store} />
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </PanzeCard>
                </div>
            </div>
        </div>
    );
}

// --- Sub Components ---

function StatRow({ icon: Icon, color, label, value, total }: any) {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    const colors: any = {
        emerald: "bg-emerald-500 text-emerald-600 border-emerald-500/20 bg-emerald-50",
        amber: "bg-amber-500 text-amber-600 border-amber-500/20 bg-amber-50",
        rose: "bg-rose-500 text-rose-600 border-rose-500/20 bg-rose-50",
    };

    return (
        <div className="group">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center border transition-colors", colors[color].replace("bg-", "bg-opacity-10 "))}>
                        <Icon className={cn("w-4 h-4", colors[color].split(" ")[1])} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-800 transition-colors">{label}</span>
                </div>
                <span className="text-xl font-serif italic text-slate-900">{value}</span>
            </div>
            {/* Tiny Bar */}
            <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className={cn("h-full rounded-full", colors[color].split(" ")[0])}
                />
            </div>
        </div>
    );
}


function AppointmentCard({ appt, store }: any) {
    const patient = store.patients.find((p: any) => p.id === appt.patientId);
    const doctor = store.doctors.find((d: any) => d.id === appt.doctorId);

    // Dynamic Style Lookup
    const procedure = PROCEDURE_TYPES.find(p => p.id === appt.type);
    const badgeStyle = procedure ? procedure.color : "bg-slate-50 text-slate-500 border-slate-200";
    const label = procedure ? procedure.label : (appt.type || 'Appointment');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative bg-white border border-slate-100 rounded-[1.5rem] p-4 flex items-center justify-between hover:shadow-lg hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-300"
        >
            <div className="flex items-center gap-4">
                {/* Time Slot */}
                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                    <span className="text-[13px] font-black text-slate-900">{appt.slot}</span>
                </div>

                {/* Patient Info */}
                <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5 flex items-center gap-2">
                        {patient?.name || "Unknown Patient"}
                        {patient?.phone && (
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-1.5 rounded-md flex items-center gap-1">
                                <Phone className="w-2.5 h-2.5" /> {patient.phone}
                            </span>
                        )}
                    </h4>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn(
                            "text-[9px] font-black uppercase tracking-wider px-1.5 py-0 h-4 border",
                            badgeStyle.replace('bg-', 'bg-opacity-20 border-opacity-20 ') // Adjust to be outline-ish
                        )}>
                            {label}
                        </Badge>
                        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">
                            w/ {doctor?.name || "Any Doctor"}
                        </span>
                    </div>
                </div>
            </div>


            {/* Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {(!appt.status || appt.status === 'pending') && (
                    <>
                        <Button
                            onClick={() => store.updateAppointmentStatus(appt.id, 'confirmed')}
                            size="sm"
                            className="h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border border-green-200 text-xs font-bold px-3"
                        >
                            Confirm
                        </Button>
                        <Button
                            onClick={() => store.updateAppointmentStatus(appt.id, 'canceled')}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-full p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Cancel"
                        >
                            <AlertCircle className="w-4 h-4" />
                        </Button>
                    </>
                )}

                {appt.status === 'confirmed' && (
                    <Button
                        onClick={() => store.updateAppointmentStatus(appt.id, 'completed')}
                        size="sm"
                        className="h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-200 text-xs font-bold px-3"
                    >
                        Complete
                    </Button>
                )}

                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0 text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-[300px] text-center p-8 opacity-60">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-4 border border-slate-100">
                <Clock className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-1">No Appointments</h3>
            <p className="text-xs text-slate-400 max-w-[200px]">
                Enjoy the free time or schedule a new patient.
            </p>
        </div>
    );
}
