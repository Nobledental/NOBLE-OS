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
    Phone,
    CalendarClock,
    X
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
    const [rescheduleData, setRescheduleData] = useState<{ open: boolean, apptId: string | null }>({ open: false, apptId: null });
    const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
    const [showCalendarMobile, setShowCalendarMobile] = useState(false);

    // --- Calendar Logic ---
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // --- Filter Appointments for Selected Date ---
    const selectedDateString = format(selectedDate, "yyyy-MM-dd");

    const todaysAppointments = store.appointments
        .filter(appt => appt.date === selectedDateString)
        .sort((a, b) => a.slot.localeCompare(b.slot));

    // --- Bucket Logic ---
    const buckets = {
        upcoming: todaysAppointments.filter(a => !a.status || a.status === 'confirmed' || a.status === 'pending'),
        arrived: todaysAppointments.filter(a => a.status === 'arrived'),
        ongoing: todaysAppointments.filter(a => a.status === 'ongoing'),
        completed: todaysAppointments.filter(a => a.status === 'completed'),
        canceled: todaysAppointments.filter(a => a.status === 'canceled'),
    };

    const stats = {
        confirmed: buckets.upcoming.length,
        pending: buckets.arrived.length, // Treating Arrived as "Pending Action"
        canceled: buckets.canceled.length
    };

    return (
        <div className="flex-1 space-y-4 md:space-y-6 h-full flex flex-col pb-20 md:pb-0"> {/* Mobile PB for safe area */}
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-4">
                <div>
                    <h2 className="text-3xl md:text-5xl font-serif italic tracking-tighter text-slate-900">Appointments</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1 md:mt-2">
                        {format(selectedDate, "EEEE, MMMM do, yyyy")}
                    </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                    {/* Helper Day Nav for Mobile */}
                    <div className="flex md:hidden items-center bg-white rounded-xl shadow-sm border border-slate-100 p-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedDate(d => addDays(d, -1))}><ChevronLeft className="w-4 h-4" /></Button>
                        <span className="text-xs font-bold w-20 text-center">{format(selectedDate, "MMM d")}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedDate(d => addDays(d, 1))}><ChevronRight className="w-4 h-4" /></Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className={cn("h-8 px-3 rounded-lg text-xs font-bold", viewMode === 'list' ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600")}
                            >
                                List
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('board')}
                                className={cn("h-8 px-3 rounded-lg text-xs font-bold", viewMode === 'board' ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600")}
                            >
                                Board
                            </Button>
                        </div>
                        <NewAppointmentDialog />
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-col md:grid md:grid-cols-12 gap-6 flex-1 min-h-0">

                {/* Right Column (Queue) - Shows FIRST on Mobile */}
                <div className="order-1 md:order-2 md:col-span-9 flex flex-col h-full min-h-0 bg-slate-50/50 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 overflow-hidden relative">

                    {viewMode === 'list' ? (
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar">
                            <h3 className="hidden md:block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Master List</h3>
                            <AnimatePresence mode="popLayout">
                                {todaysAppointments.length === 0 ? <EmptyState /> : todaysAppointments.map(appt => (
                                    <AppointmentCard key={appt.id} appt={appt} store={store} onReschedule={(id) => setRescheduleData({ open: true, apptId: id })} />
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-x-auto p-4 md:p-6 custom-scrollbar snap-x snap-mandatory">
                            <div className="flex gap-4 md:gap-6 h-full min-w-full md:min-w-[1000px]">
                                {/* Column 1: Upcoming (Pastel Blue) */}
                                <KanbanColumn
                                    title="Upcoming / Confirmed"
                                    color="bg-blue-50/50 border-blue-100"
                                    headerColor="text-blue-500"
                                    appointments={buckets.upcoming}
                                    store={store}
                                    onReschedule={(id) => setRescheduleData({ open: true, apptId: id })}
                                />
                                {/* Column 2: In Queue (Pastel Amber) */}
                                <KanbanColumn
                                    title="In Queue / Arrived"
                                    color="bg-amber-50/50 border-amber-100"
                                    headerColor="text-amber-500"
                                    appointments={buckets.arrived}
                                    store={store}
                                    onReschedule={(id) => setRescheduleData({ open: true, apptId: id })}
                                />
                                {/* Column 3: Ongoing (Pastel Green - Live Timer) */}
                                <KanbanColumn
                                    title="Ongoing Procedure"
                                    color="bg-green-50/50 border-green-100"
                                    headerColor="text-green-500"
                                    appointments={buckets.ongoing}
                                    store={store}
                                    onReschedule={(id) => setRescheduleData({ open: true, apptId: id })}
                                />
                                {/* Column 4: Completed (Pastel Slate) */}
                                <KanbanColumn
                                    title="Completed"
                                    color="bg-slate-100/50 border-slate-200"
                                    headerColor="text-slate-500"
                                    appointments={buckets.completed}
                                    store={store}
                                    onReschedule={(id) => setRescheduleData({ open: true, apptId: id })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Left Column (Calendar & Info) - Shows LAST on Mobile */}
                <div className="order-2 md:order-1 md:col-span-3 flex flex-col gap-6">
                    {/* Toggle to show calendar on mobile? For now just stacked at bottom */}

                    {/* Mini Calendar Widget */}
                    <PanzeCard className="bg-white border border-slate-200 shadow-xl rounded-[2.5rem] p-6 overflow-hidden relative hidden md:block">
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
                    <PanzeCard className="bg-white border border-slate-200 shadow-xl rounded-[2.5rem] p-6 flex-1 hidden md:block">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Patient Flow</h3>
                        <div className="space-y-4">
                            <StatRow icon={CalendarIcon} color="emerald" label="Upcoming" value={stats.confirmed} total={todaysAppointments.length} />
                            <StatRow icon={User} color="amber" label="In Clinic" value={buckets.arrived.length + buckets.ongoing.length} total={todaysAppointments.length} />
                            <StatRow icon={CheckCircle2} color="indigo" label="Completed" value={buckets.completed.length} total={todaysAppointments.length} />
                        </div>

                        {/* Location Sharer tucked at bottom */}
                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <LiveLocationSharer />
                        </div>
                    </PanzeCard>
                </div>
            </div>

            <RescheduleDialog
                open={rescheduleData.open}
                onOpenChange={(open) => setRescheduleData(prev => ({ ...prev, open }))}
                apptId={rescheduleData.apptId}
                store={store}
            />
        </div>
    );
}

// --- Kanban Components ---

function KanbanColumn({ title, color, headerColor, appointments, store, onReschedule }: any) {
    return (
        <div className={cn(
            "flex flex-col rounded-[1.5rem] md:rounded-3xl border h-full transition-colors flex-shrink-0 snap-center min-w-[85vw] md:min-w-0 md:flex-1",
            color
        )}>
            <div className="p-4 border-b border-white/50 flex items-center justify-between shrink-0 sticky top-0 bg-inherit/50 backdrop-blur-md z-10 rounded-t-[1.5rem]">
                <h4 className={cn("text-[11px] font-black uppercase tracking-[0.1em] flex items-center gap-2", headerColor)}>
                    <span className="w-2 h-2 rounded-full bg-current opacity-50" /> {title}
                </h4>
                <span className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded-full text-slate-500">{appointments.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {appointments.map((appt: any) => (
                    <AppointmentCard key={appt.id} appt={appt} store={store} onReschedule={onReschedule} isBoard />
                ))}
                {appointments.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-slate-300 border-2 border-dashed border-slate-200/50 rounded-2xl">
                        Empty
                    </div>
                )}
            </div>
        </div>
    )
}


function LiveTimer({ startTime }: { startTime: string }) {
    const [elapsed, setElapsed] = useState("00:00");

    useState(() => {
        const interval = setInterval(() => {
            const start = new Date(startTime).getTime();
            const now = new Date().getTime();
            const diff = Math.max(0, now - start);

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setElapsed(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(interval);
    });

    return (
        <div className="font-mono text-xs md:text-sm font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
            <Clock className="w-3 h-3" />
            {elapsed}
        </div>
    );
}

// --- Updated Sub Components ---

function StatRow({ icon: Icon, color, label, value, total }: any) {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    const colors: any = {
        emerald: "bg-emerald-500 text-emerald-600 border-emerald-500/20 bg-emerald-50",
        amber: "bg-amber-500 text-amber-600 border-amber-500/20 bg-amber-50",
        rose: "bg-rose-500 text-rose-600 border-rose-500/20 bg-rose-50",
        indigo: "bg-indigo-500 text-indigo-600 border-indigo-500/20 bg-indigo-50",
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


function AppointmentCard({ appt, store, onReschedule, isBoard }: { appt: any, store: any, onReschedule: (id: string) => void, isBoard?: boolean }) {
    const patient = store.patients.find((p: any) => p.id === appt.patientId);
    const doctor = store.doctors.find((d: any) => d.id === appt.doctorId);

    // Dynamic Style Lookup
    const procedure = PROCEDURE_TYPES.find(p => p.id === appt.type);
    const label = procedure ? procedure.label : (appt.type || 'Appointment');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
                "group relative bg-white border border-slate-100 rounded-[1.2rem] p-3 md:p-4 hover:shadow-lg hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-300",
                isBoard ? "flex flex-col gap-3" : "flex items-center justify-between"
            )}
        >
            <div className="flex items-start gap-4 w-full">
                {/* Time Slot */}
                <div className={cn(
                    "flex flex-col items-center justify-center rounded-xl bg-slate-50 border border-slate-100 transition-colors shrink-0",
                    isBoard ? "w-10 h-10" : "w-14 h-14"
                )}>
                    <span className={cn("font-black text-slate-900", isBoard ? "text-[10px]" : "text-xs")}>{appt.slot}</span>
                </div>

                {/* Patient Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5 truncate flex items-center justify-between">
                        <span className="truncate">{patient?.name || "Unknown"}</span>
                        {appt.status === 'ongoing' && appt.startedAt && <LiveTimer startTime={appt.startedAt} />}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium truncate mb-1">
                        {label} <span className="text-slate-300">•</span> w/ {doctor?.name || "Unassigned"}
                    </p>

                    {/* Action Bar (Board Mode) */}
                    {isBoard && (
                        <div className="flex gap-1 mt-3">
                            {/* ACTION BUTTONS - Touch Optimized */}
                            {(!appt.status || appt.status === 'confirmed' || appt.status === 'pending') && (
                                <Button size="sm" onClick={() => store.updateAppointmentStatus(appt.id, 'arrived')} className="h-8 text-xs font-bold bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200 w-full rounded-lg">
                                    Check In
                                </Button>
                            )}
                            {appt.status === 'arrived' && (
                                <Button size="sm" onClick={() => store.updateAppointmentStatus(appt.id, 'ongoing')} className="h-8 text-xs font-bold bg-green-50 text-green-600 hover:bg-green-100 border-green-200 w-full animate-pulse rounded-lg">
                                    Start Case
                                </Button>
                            )}
                            {appt.status === 'ongoing' && (
                                <Button size="sm" onClick={() => store.updateAppointmentStatus(appt.id, 'completed')} className="h-8 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 w-full rounded-lg">
                                    Complete
                                </Button>
                            )}
                            {appt.status === 'completed' && (
                                <span className="text-[10px] text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100 w-full text-center block">Done</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* List Mode Actions */}
            {!isBoard && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button onClick={() => onReschedule(appt.id)} variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0 text-slate-400 hover:text-amber-600">
                        <CalendarClock className="w-4 h-4" />
                    </Button>
                </div>
            )}
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

function RescheduleDialog({ open, onOpenChange, apptId, store }: any) {
    const [date, setDate] = useState("");
    const [slot, setSlot] = useState("");
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleDateChange = async (e: any) => {
        const d = e.target.value;
        setDate(d);
        if (!d) return;
        setLoading(true);
        // Simplified fetch for reschedule
        const slots = await store.fetchAvailableSlots(d, store.activeChairs || 3);
        setAvailableSlots(slots);
        setLoading(false);
    };

    const handleConfirm = () => {
        if (!apptId || !date || !slot) return;
        store.rescheduleAppointment(apptId, date, slot);
        toast.success("Appointment Rescheduled");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white rounded-[2rem] shadow-2xl border-none p-6 text-slate-900 sm:max-w-[425px]">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-serif italic">Reschedule Appointment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>New Date</Label>
                        <Input type="date" className="rounded-xl border-slate-200" onChange={handleDateChange} />
                    </div>

                    <div className="space-y-2">
                        <Label>Available Slots</Label>
                        <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-1">
                            {loading ? (
                                <div className="col-span-3 text-center py-4 text-xs text-slate-400">Checking...</div>
                            ) : availableSlots.length === 0 ? (
                                <div className="col-span-3 text-center py-4 text-xs text-slate-400">Select date to see slots</div>
                            ) : (
                                availableSlots.map(s => (
                                    <button
                                        key={s.time}
                                        onClick={() => setSlot(s.time)}
                                        className={cn(
                                            "px-2 py-2 rounded-lg text-xs font-bold border transition-all",
                                            slot === s.time
                                                ? "bg-indigo-600 text-white border-indigo-600"
                                                : "bg-slate-50 text-slate-600 border-slate-100 hover:border-indigo-200"
                                        )}
                                    >
                                        {s.time}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <Button
                        className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-xs mt-4"
                        disabled={!slot || !date}
                        onClick={handleConfirm}
                    >
                        Confirm Reschedule
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
