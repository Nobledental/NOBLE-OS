"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog";
import { useSchedulingStore, PROCEDURE_TYPES } from "@/lib/scheduling-store";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
    Calendar as CalendarIcon, CheckCircle2, Clock, AlertCircle, ChevronLeft, ChevronRight,
    Search, User, MoreHorizontal, Phone, CalendarClock, X, Bell, ShieldCheck, FileText, Receipt, Eye, EyeOff, Plus, Check, MessageCircle, Mic, Sparkles
} from "lucide-react";

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function AppointmentsHub() {
    const store = useSchedulingStore();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'waiting' | 'done'>('all');
    const [searchQuery, setSearchQuery] = useState("");
    const [rescheduleData, setRescheduleData] = useState<{ open: boolean, apptId: string | null }>({ open: false, apptId: null });
    const [showRevenue, setShowRevenue] = useState(false); // Privacy Mode

    // --- Date Logic ---
    const weekStart = startOfWeek(selectedDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(selectedDate) });

    // --- Filter Logic ---
    const selectedDateString = format(selectedDate, "yyyy-MM-dd");
    const todaysAppointments = store.appointments
        .filter(appt => appt.date === selectedDateString)
        .sort((a, b) => a.slot.localeCompare(b.slot));

    const filteredAppointments = todaysAppointments.filter(appt => {
        // Search Filter
        if (searchQuery) {
            const patient = store.patients.find(p => p.id === appt.patientId);
            const query = searchQuery.toLowerCase();
            return patient?.name.toLowerCase().includes(query) || patient?.phone.includes(query);
        }
        // Category Filter
        if (filter === 'all') return true;
        if (filter === 'waiting') return appt.status === 'arrived';
        if (filter === 'done') return appt.status === 'completed';
        if (filter === 'upcoming') return !appt.status || appt.status === 'confirmed';
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
                {/* Row 1: Title, Search, New Appt */}
                <div className="flex flex-col gap-4 px-4 py-4 md:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <span className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center text-xs">NO</span>
                                Appointments
                            </h1>
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mt-1 pl-1">
                                {format(selectedDate, "MMMM do, yyyy")}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Daily Goal Widget (Privacy Mode) */}
                            <div className="hidden md:flex flex-col items-end mr-4 group cursor-pointer" onClick={() => setShowRevenue(!showRevenue)}>
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Daily Revenue</span>
                                    {showRevenue ? <EyeOff className="w-3 h-3 text-slate-300" /> : <Eye className="w-3 h-3 text-slate-300" />}
                                </div>
                                <span className={cn(
                                    "text-sm font-black transition-all",
                                    showRevenue ? "text-emerald-600" : "text-slate-200 bg-slate-100 rounded px-1 filter blur-[2px]"
                                )}>
                                    {showRevenue ? `₹${(12450).toLocaleString()}` : "₹12,450"}
                                </span>
                            </div>
                            <NewAppointmentDialog />
                        </div>
                    </div>

                    {/* Search Bar (Integrated) */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search patient by name or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 bg-slate-50 border-slate-200 rounded-xl focus:bg-white transition-all text-xs font-medium"
                        />
                    </div>
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
                            onClick={() => { setFilter(f.id as any); setSearchQuery(""); }}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap flex items-center gap-2",
                                filter === f.id && !searchQuery
                                    ? "bg-slate-900 border-slate-900 text-white shadow-md"
                                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                            )}
                        >
                            {f.label}
                            {f.count > 0 && (
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-full text-[9px]",
                                    filter === f.id && !searchQuery ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
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
                                    <Search className="w-10 h-10 text-indigo-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">No Appointments Found</h3>
                                <p className="text-slate-500 text-sm max-w-xs mt-2">
                                    {searchQuery
                                        ? `No results for "${searchQuery}"`
                                        : filter === 'all'
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
                onOpenChange={(open: boolean) => setRescheduleData(prev => ({ ...prev, open }))}
                apptId={rescheduleData.apptId}
                store={store}
            />
        </div>
    );
}

// --- NEW CARD COMPONENT (Super App Style) ---
function SuperAppCard({ appt, store, onReschedule }: { appt: any, store: any, onReschedule: (id: string) => void }) {
    const { user } = useAuth();
    const patient = store.patients.find((p: any) => p.id === appt.patientId);
    const doctor = store.doctors.find((d: any) => d.id === appt.doctorId);
    const procedure = PROCEDURE_TYPES.find(p => p.id === appt.type);

    // RBAC: Only doctors and owners can start consultations
    const canStartConsultation = user?.role === 'DOCTOR' || user?.role === 'OWNER';

    // Status Logic
    const isOngoing = appt.status === 'ongoing';
    const isArrived = appt.status === 'arrived';
    const isCompleted = appt.status === 'completed';
    const isUpcoming = !appt.status || appt.status === 'confirmed';

    // Mock Data for "Advanced" Feel
    const isNewPatient = Math.random() > 0.7; // Keep mock for now
    const hasBalance = Math.random() > 0.8; // Keep mock for now
    const isFamily = appt.isFamily; // Real Data coming from Booking Flow
    const balanceAmount = 1500;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2 }}
            className={cn(
                "bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group relative",
                isFamily && "border-l-4 border-l-blue-400"
            )}
        >
            {isFamily && (
                <div className="absolute top-0 left-0 bg-blue-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-br-lg z-10">
                    FAMILY
                </div>
            )}
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

                {/* Advanced Actions Menu */}
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600" onClick={() => toast.info("Voice note recording simulated")}>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Phone className="w-3.5 h-3.5" /> {/* Using Phone icon as placeholder for Mic if unavailable, usually Mic is avail */}
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[300px] p-0 overflow-hidden rounded-2xl">
                            <div className="flex flex-col p-2 bg-white">
                                <Button variant="ghost" className="justify-start gap-3 h-12 text-slate-600 font-medium" onClick={() => onReschedule(appt.id)}>
                                    <CalendarClock className="w-4 h-4" /> Reschedule
                                </Button>
                                <Button variant="ghost" className="justify-start gap-3 h-12 text-indigo-600 font-medium bg-indigo-50/50 my-1" onClick={() => toast.success("Scanning Waitlist for Replacement...")}>
                                    <Sparkles className="w-4 h-4" /> Find Replacement (Gap Smoother)
                                </Button>
                                <Button variant="ghost" className="justify-start gap-3 h-12 text-amber-600 font-medium bg-amber-50/50" onClick={() => store.updateAppointmentStatus(appt.id, 'no-show')}>
                                    <AlertCircle className="w-4 h-4" /> Mark as No-Show
                                </Button>
                                <Button variant="ghost" className="justify-start gap-3 h-12 text-red-600 font-medium hover:bg-red-50" onClick={() => store.updateAppointmentStatus(appt.id, 'canceled')}>
                                    <X className="w-4 h-4" /> Cancel Appointment
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* 2. Body: Patient & Details */}
            <div className="p-5 flex gap-4 relative">
                {/* Context Badges (Absolute) */}
                <div className="absolute top-4 right-5 flex flex-col gap-1 items-end pointer-events-none">
                    {isNewPatient && <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">New Patient</span>}
                    {hasBalance && <span className="text-[9px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">Due: ₹{balanceAmount}</span>}
                </div>

                {/* Patient Avatar (Initials) */}
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 shadow-inner",
                    isOngoing ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
                )}>
                    {patient?.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0 pr-16"> {/* PR for badges */}
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
                        <a href={`tel:${patient?.phone}`} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <Phone className="w-3 h-3" /> Call
                        </a>
                        <a
                            href={`https://wa.me/${patient?.phone?.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-600 transition-colors bg-slate-50 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-slate-100"
                        >
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

                    {/* Start Consultation - Only shown to doctors/owners */}
                    {isArrived && canStartConsultation && (
                        <Button
                            className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg transition-all flex items-center justify-center gap-2 bg-clinical-action hover:bg-indigo-600 text-white shadow-indigo-200"
                            onClick={() => {
                                store.updateAppointmentStatus(appt.id, 'ongoing');
                            }}
                        >
                            <span>Start Consultation</span>
                            <ChevronRight className="w-4 h-4 opacity-70" />
                        </Button>
                    )}

                    {/* Info message for non-doctors when patient has arrived */}
                    {isArrived && !canStartConsultation && (
                        <div className="w-full p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-blue-700">
                                <span className="font-semibold block">Waiting for doctor</span>
                                <p className="text-blue-600 mt-0.5">Patient is ready. Doctor will start consultation.</p>
                            </div>
                        </div>
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

// --- Helper Components ---

function StatRow({ icon: Icon, color, label, value, total }: any) {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    const colors: any = {
        emerald: "bg-emerald-500 text-emerald-600",
        amber: "bg-amber-500 text-amber-600",
        indigo: "bg-indigo-500 text-indigo-600",
        slate: "bg-slate-500 text-slate-600",
    };

    return (
        <div className="group">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className={cn("w-9 h-9 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 duration-300 bg-white border border-slate-100")}>
                        <Icon className={cn("w-4 h-4 opacity-60", colors[color].split(" ")[1])} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-700 transition-colors">{label}</span>
                </div>
                <span className="text-2xl font-serif italic text-slate-900">{value}</span>
            </div>
            {/* Tiny Bar */}
            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn("h-full rounded-full opacity-60", colors[color].split(" ")[0])}
                />
            </div>
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

    const toggleExtrasDialog = (open: boolean) => {
        if (!apptId || !date || !slot) return;
        store.rescheduleAppointment(apptId, date, slot);
        toast.success("Appointment Rescheduled");
        onOpenChange(false);
    };

    const handleConfirm = () => {
        if (!apptId || !date || !slot) return;
        store.rescheduleAppointment(apptId, date, slot);
        toast.success("Appointment Rescheduled");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="surface-modal border-none p-6 text-slate-900 sm:max-w-[425px]">
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
