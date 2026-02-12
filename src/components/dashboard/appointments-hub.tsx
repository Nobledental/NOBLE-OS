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
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'waiting' | 'done'>('all');
    const [rescheduleData, setRescheduleData] = useState<{ open: boolean, apptId: string | null }>({ open: false, apptId: null });

    // --- Date Logic ---
    const weekStart = startOfWeek(selectedDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(selectedDate) });

    // --- Filter Logic ---
    const selectedDateString = format(selectedDate, "yyyy-MM-dd");
    const todaysAppointments = store.appointments
        .filter(appt => appt.date === selectedDateString)
        .sort((a, b) => a.slot.localeCompare(b.slot));

    const filteredAppointments = todaysAppointments.filter(appt => {
        if (filter === 'all') return true;
        if (filter === 'waiting') return appt.status === 'arrived';
        if (filter === 'done') return appt.status === 'completed';
        if (filter === 'upcoming') return !appt.status || appt.status === 'confirmed' || appt.status === 'pending';
        return true;
    });

    // Counts for Badges
    const counts = {
        all: todaysAppointments.length,
        upcoming: todaysAppointments.filter(a => !a.status || a.status === 'confirmed').length,
        waiting: todaysAppointments.filter(a => a.status === 'arrived').length,
        done: todaysAppointments.filter(a => a.status === 'completed').length,
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
            {/* --- TOP HEADER (Sticky) --- */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
                {/* Row 1: Title & New Appt */}
                <div className="flex items-center justify-between px-4 py-4 md:px-6">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <span className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center text-xs">NO</span>
                                Appointments
                            </h1>
                        </div>
                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mt-1 pl-1">
                            {format(selectedDate, "MMMM do, yyyy")}
                        </p>
                    </div>
                    <NewAppointmentDialog />
                </div>

                {/* Row 2: Date Strip (Horizontal Scroll) */}
                <div className="flex overflow-x-auto gap-2 px-4 pb-4 md:px-6 custom-scrollbar scrollbar-hide snap-x">
                    {weekDays.map((day, i) => {
                        const isSelected = isSameDay(day, selectedDate);
                        const isTodayDate = isToday(day);
                        return (
                            <button
                                key={i}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    "flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-2xl border transition-all snap-start shrink-0",
                                    isSelected
                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105"
                                        : isTodayDate
                                            ? "bg-white border-indigo-100 text-indigo-600"
                                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                )}
                            >
                                <span className="text-[9px] font-bold uppercase tracking-wider">{format(day, "EEE")}</span>
                                <span className={cn("text-lg font-bold leading-none mt-0.5", isSelected && "font-serif italic")}>{format(day, "d")}</span>
                            </button>
                        );
                    })}
                    <div className="w-4 shrink-0" /> {/* Spacer */}
                </div>

                {/* Row 3: Filter Chips */}
                <div className="flex items-center gap-2 px-4 pb-4 md:px-6 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'all', label: 'All', count: counts.all },
                        { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
                        { id: 'waiting', label: 'In Queue', count: counts.waiting },
                        { id: 'done', label: 'Done', count: counts.done },
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id as any)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap flex items-center gap-2",
                                filter === f.id
                                    ? "bg-slate-900 border-slate-900 text-white shadow-md"
                                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                            )}
                        >
                            {f.label}
                            {f.count > 0 && (
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-full text-[9px]",
                                    filter === f.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                                )}>
                                    {f.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- MAIN FEED CONTENT --- */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 p-4 md:p-6 pb-24">
                <div className="max-w-3xl mx-auto space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredAppointments.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-20 text-center"
                            >
                                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                                    <CalendarIcon className="w-10 h-10 text-indigo-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">No Appointments</h3>
                                <p className="text-slate-500 text-sm max-w-xs mt-2">
                                    {filter === 'all'
                                        ? "You don't have any appointments scheduled for this day."
                                        : `No appointments found in the '${filter}' category.`}
                                </p>
                            </motion.div>
                        ) : (
                            filteredAppointments.map((appt) => (
                                <SuperAppCard
                                    key={appt.id}
                                    appt={appt}
                                    store={store}
                                    onReschedule={(id) => setRescheduleData({ open: true, apptId: id })}
                                />
                            ))
                        )}
                    </AnimatePresence>
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

// --- NEW CARD COMPONENT (Super App Style) ---
function SuperAppCard({ appt, store, onReschedule }: { appt: any, store: any, onReschedule: (id: string) => void }) {
    const patient = store.patients.find((p: any) => p.id === appt.patientId);
    const doctor = store.doctors.find((d: any) => d.id === appt.doctorId);
    const procedure = PROCEDURE_TYPES.find(p => p.id === appt.type);

    // Status Logic
    const isOngoing = appt.status === 'ongoing';
    const isArrived = appt.status === 'arrived';
    const isCompleted = appt.status === 'completed';
    const isUpcoming = !appt.status || appt.status === 'confirmed';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group"
        >
            {/* 1. Header: Time & Status */}
            <div className={cn(
                "px-5 py-3 flex items-center justify-between border-b border-slate-50",
                isOngoing ? "bg-indigo-50/50" : isArrived ? "bg-amber-50/50" : isCompleted ? "bg-emerald-50/50" : "bg-white"
            )}>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-900 rounded-lg text-white">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs font-bold tracking-wide">{appt.slot}</span>
                    </div>
                    {isOngoing && <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none shadow-none uppercase text-[9px] tracking-wider">In Progress</Badge>}
                    {isArrived && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none shadow-none uppercase text-[9px] tracking-wider">Waiting</Badge>}
                    {isCompleted && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none shadow-none uppercase text-[9px] tracking-wider">Done</Badge>}
                </div>

                {/* Context Menu or Quick Action */}
                {!isCompleted && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600" onClick={() => onReschedule(appt.id)}>
                        <CalendarClock className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* 2. Body: Patient & Details */}
            <div className="p-5 flex gap-4">
                {/* Patient Avatar (Initials) */}
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 shadow-inner",
                    isOngoing ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
                )}>
                    {patient?.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 truncate leading-tight mb-1">{patient?.name || "Unknown Patient"}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-3">
                        <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 truncate max-w-[120px]">
                            {procedure?.label || appt.type || 'Consultation'}
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1 opacity-70">
                            <User className="w-3 h-3" />
                            <span className="truncate max-w-[100px]">{doctor?.name.split(' ')[1] || 'Doctor'}</span>
                        </div>
                    </div>

                    {/* Patient Phone / Contact Actions */}
                    <div className="flex items-center gap-3">
                        <a href={`tel:${patient?.phone}`} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg">
                            <Phone className="w-3 h-3" /> Call
                        </a>
                        <a href="#" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-600 transition-colors bg-slate-50 hover:bg-emerald-50 px-3 py-1.5 rounded-lg">
                            <span className="w-3 h-3 rounded-full bg-current opacity-50" /> WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* 3. Footer: Main Action (Big Button) */}
            {!isCompleted && (
                <div className="px-5 pb-5">
                    {isUpcoming && (
                        <Button
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2"
                            onClick={() => store.updateAppointmentStatus(appt.id, 'arrived')}
                        >
                            <span>Mark Arrived</span>
                            <ChevronRight className="w-4 h-4 opacity-70" />
                        </Button>
                    )}
                    {isArrived && (
                        <Button
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2"
                            onClick={() => store.updateAppointmentStatus(appt.id, 'ongoing')}
                        >
                            <span>Start Consultation</span>
                            <ChevronRight className="w-4 h-4 opacity-70" />
                        </Button>
                    )}
                    {isOngoing && (
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                            onClick={() => store.updateAppointmentStatus(appt.id, 'completed')}
                        >
                            <span>Finish Appointment</span>
                            <CheckCircle2 className="w-4 h-4 opacity-70" />
                        </Button>
                    )}
                </div>
            )}

            {/* Completed State Footer */}
            {isCompleted && (
                <div className="px-5 pb-5 pt-0">
                    <div className="w-full bg-emerald-50 text-emerald-700 h-10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        <CheckCircle2 className="w-4 h-4" /> Completed
                    </div>
                </div>
            )}
        </motion.div>
    );
}

// --- Kanban Components (Premium Polish) ---

function KanbanColumn({ title, color, headerColor, appointments, store, onReschedule }: any) {
    return (
        <div className={cn(
            "flex flex-col rounded-[2rem] border h-full transition-all duration-500 hover:shadow-xl flex-shrink-0 snap-center min-w-[85vw] md:min-w-0 md:flex-1 group/col",
            color, "backdrop-blur-md bg-opacity-40 border-white/20"
        )}>
            <div className="p-5 border-b border-white/20 flex items-center justify-between shrink-0 sticky top-0 bg-white/10 backdrop-blur-md z-10 rounded-t-[2rem]">
                <h4 className={cn("text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2.5", headerColor)}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" /> {title}
                </h4>
                <span className="text-[10px] font-bold bg-white/40 backdrop-blur-sm px-2.5 py-1 rounded-full text-slate-600 shadow-sm">{appointments.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 custom-scrollbar scrollbar-hide">
                {appointments.map((appt: any) => (
                    <AppointmentCard key={appt.id} appt={appt} store={store} onReschedule={onReschedule} isBoard />
                ))}
                {appointments.length === 0 && (
                    <div className="h-40 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-white/30 rounded-3xl opacity-50 group-hover/col:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center mb-2">
                            <MoreHorizontal className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Empty</span>
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
        <div className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50/80 border border-emerald-100 px-2 py-0.5 rounded-lg flex items-center gap-1.5 shadow-sm animate-pulse">
            <Clock className="w-3 h-3" />
            {elapsed}
        </div>
    );
}

// --- Updated Sub Components ---

function StatRow({ icon: Icon, color, label, value, total }: any) {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    // --- End of SuperAppCard ---


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
