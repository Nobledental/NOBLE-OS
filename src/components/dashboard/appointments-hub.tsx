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

    // Mobile Tab State (Upcoming, Queue, Ongoing, Completed)
    const [activeMobileTab, setActiveMobileTab] = useState<'upcoming' | 'queue' | 'ongoing' | 'completed'>('upcoming');

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
        arrived: todaysAppointments.filter(a => a.status === 'arrived'), // Queue
        ongoing: todaysAppointments.filter(a => a.status === 'ongoing'),
        completed: todaysAppointments.filter(a => a.status === 'completed'),
        canceled: todaysAppointments.filter(a => a.status === 'canceled'),
    };

    const stats = {
        confirmed: buckets.upcoming.length,
        pending: buckets.arrived.length,
        completed: buckets.completed.length
    };

    return (
        <div className="flex-1 space-y-4 md:space-y-8 h-full flex flex-col pb-24 md:pb-0"> {/* Mobile PB increased */}
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between shrink-0 gap-6">
                <div>
                    <h2 className="text-4xl md:text-6xl font-serif italic tracking-tighter text-slate-900 drop-shadow-sm">Appointments</h2>
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-slate-600 mt-2 ml-1">
                        {format(selectedDate, "EEEE, MMMM do, yyyy")}
                    </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                    {/* Helper Day Nav for Mobile */}
                    <div className="flex md:hidden items-center bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600" onClick={() => setSelectedDate(d => addDays(d, -1))}><ChevronLeft className="w-5 h-5" /></Button>
                        <span className="text-xs font-black uppercase tracking-widest w-24 text-center text-slate-900">{format(selectedDate, "MMM d")}</span>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600" onClick={() => setSelectedDate(d => addDays(d, 1))}><ChevronRight className="w-5 h-5" /></Button>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Desktop View Toggle */}
                        <div className="hidden md:flex bg-slate-100/50 backdrop-blur-sm p-1.5 rounded-2xl gap-1 border border-slate-200/50">
                            {['list', 'board'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode as any)}
                                    className="relative px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors z-10"
                                >
                                    {viewMode === mode && (
                                        <motion.div
                                            layoutId="viewModeTab"
                                            className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-slate-100 z-[-1]"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className={cn("transition-colors duration-300", viewMode === mode ? "text-slate-900" : "text-slate-400 hover:text-slate-600")}>
                                        {mode}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <NewAppointmentDialog />
                    </div>
                </div>
            </div>

            {/* Mobile Tab Bar (Floating) - Only Visible on Mobile */}
            <div className="md:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-hide snap-x">
                {[
                    { id: 'upcoming', label: 'Upcoming', count: buckets.upcoming.length },
                    { id: 'queue', label: 'In Queue', count: buckets.arrived.length },
                    { id: 'ongoing', label: 'Ongoing', count: buckets.ongoing.length },
                    { id: 'completed', label: 'Done', count: buckets.completed.length }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveMobileTab(tab.id as any)}
                        className={cn(
                            "flex-shrink-0 px-5 py-3 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all snap-start",
                            activeMobileTab === tab.id
                                ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20 scale-100"
                                : "bg-white text-slate-400 border-slate-100 scale-95 opacity-80"
                        )}
                    >
                        {tab.label} <span className={cn("ml-2 px-1.5 py-0.5 rounded-md text-[9px]", activeMobileTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500")}>{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-col md:grid md:grid-cols-12 gap-6 lg:gap-8 flex-1 min-h-0">

                {/* Right Column (Queue) - Shows FIRST on Mobile */}
                <div className="order-1 md:order-2 md:col-span-9 flex flex-col h-full min-h-0 bg-white/60 md:bg-white/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/60 md:border-white/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden relative">

                    <AnimatePresence mode="wait">
                        {/* Mobile: Show Single Column based on Tab */}
                        {/* Desktop: Show List or Board based on ViewMode */}

                        {(viewMode === 'list' && window.innerWidth >= 768) ? (
                            <motion.div
                                key="list-desktop"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar scrollbar-hide"
                            >
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-2">Master List</h3>
                                {todaysAppointments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                        <Search className="w-8 h-8 mb-4 opacity-50" />
                                        <p className="text-xs font-bold uppercase tracking-widest">No appointments today</p>
                                    </div>
                                ) : todaysAppointments.map(appt => (
                                    <AppointmentCard key={appt.id} appt={appt} store={store} onReschedule={(id) => setRescheduleData({ open: true, apptId: id })} />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="board-view"
                                className="flex-1 h-full flex flex-col md:flex-row md:overflow-x-auto md:p-8 custom-scrollbar scrollbar-hide"
                            >
                                {/* Mobile: Conditional Rendering of Columns */}
                                <div className="md:hidden flex-1 p-4 h-full overflow-y-auto scrollbar-hide">
                                    <AnimatePresence mode="wait">
                                        {activeMobileTab === 'upcoming' && (
                                            <motion.div key="upcoming" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full">
                                                <KanbanColumn
                                                    title="Upcoming"
                                                    color="bg-transparent border-none"
                                                    headerColor="text-slate-600"
                                                    appointments={buckets.upcoming}
                                                    store={store}
                                                    onReschedule={(id) => setRescheduleData({ open: true, apptId: id })}
                                                />
                                            </motion.div>
                                        )}
                                        {activeMobileTab === 'queue' && (
                                            <motion.div key="queue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full">
                                                <KanbanColumn
                                                    title="In Queue"
                                                    color="bg-transparent border-none"
                                                    headerColor="text-amber-600"
                                                    appointments={buckets.arrived}
                                                    store={store}
                                                    onReschedule={(id) => setRescheduleData({ open: true, apptId: id })}
                                                />
                                            </motion.div>
                                        )}
                                        {activeMobileTab === 'ongoing' && (
                                            <motion.div key="ongoing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full">
                                                <KanbanColumn
                                                    title="Ongoing"
                                                    color="bg-transparent border-none"
                                                    headerColor="text-indigo-600"
                                                    appointments={buckets.ongoing}
                                                    store={store}
                                                    onReschedule={(id) => setRescheduleData({ open: true, apptId: id })}
                                                />
                                            </motion.div>
                                        )}
                                        {activeMobileTab === 'completed' && (
                                            <motion.div key="completed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full">
                                                <KanbanColumn
                                                    title="Completed"
                                                    color="bg-transparent border-none"
                                                    headerColor="text-emerald-600"
                                                    appointments={buckets.completed}
                                                    store={store}
                                                    onReschedule={(id) => setRescheduleData({ open: true, apptId: id })}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Desktop: All Columns Side-by-Side */}
                                <div className="hidden md:flex gap-8 h-full min-w-[1000px]">
                                    <KanbanColumn
                                        title="Upcoming"
                                        color="bg-slate-50/50 border-slate-100"
                                        headerColor="text-slate-500"
                                        appointments={buckets.upcoming}
                                        store={store}
                                        onReschedule={(id) => setRescheduleData({ open: true, apptId: id })}
                                    />
                                    <KanbanColumn
                                        title="In Queue"
                                        color="bg-amber-50/50 border-amber-100"
                                        headerColor="text-amber-500"
                                        appointments={buckets.arrived}
                                        store={store}
                                        onReschedule={(id) => setRescheduleData({ open: true, apptId: id })}
                                    />
                                    <KanbanColumn
                                        title="Ongoing"
                                        color="bg-indigo-50/50 border-indigo-100"
                                        headerColor="text-indigo-500"
                                        appointments={buckets.ongoing}
                                        store={store}
                                        onReschedule={(id) => setRescheduleData({ open: true, apptId: id })}
                                    />
                                    <KanbanColumn
                                        title="Completed"
                                        color="bg-emerald-50/50 border-emerald-100"
                                        headerColor="text-emerald-500"
                                        appointments={buckets.completed}
                                        store={store}
                                        onReschedule={(id) => setRescheduleData({ open: true, apptId: id })}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Left Column (Calendar & Info) - Shows LAST on Mobile */}
                <div className="order-2 md:order-1 md:col-span-3 flex flex-col gap-6 lg:gap-8">
                    {/* Mini Calendar Widget - Improved Visibility */}
                    <PanzeCard className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-6 overflow-hidden relative hidden md:block group hover:shadow-2xl transition-all duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Calendar</h3>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-slate-100 text-slate-500" onClick={() => setSelectedDate(d => addDays(d, -1))}>
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-slate-100 text-slate-500" onClick={() => setSelectedDate(new Date())}>
                                    <CalendarIcon className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-slate-100 text-slate-500" onClick={() => setSelectedDate(d => addDays(d, 1))}>
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Week Strip */}
                        <div className="grid grid-cols-7 gap-1 mb-3">
                            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                <div key={i} className="text-[9px] font-bold text-center text-slate-400 uppercase tracking-wider">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
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
                                            isSelected ? "bg-slate-900 text-white shadow-xl shadow-slate-900/30 scale-110" :
                                                isTodayDate ? "bg-indigo-600 text-white border border-indigo-600" : "hover:bg-slate-100 text-slate-600"
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
                    <PanzeCard className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-6 flex-1 hidden md:block">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Patient Flow</h3>
                        <div className="space-y-6">
                            <StatRow icon={CalendarIcon} color="slate" label="Upcoming" value={stats.confirmed} total={todaysAppointments.length} />
                            <StatRow icon={User} color="amber" label="In Clinic" value={buckets.arrived.length + buckets.ongoing.length} total={todaysAppointments.length} />
                            <StatRow icon={CheckCircle2} color="emerald" label="Completed" value={buckets.completed.length} total={todaysAppointments.length} />
                        </div>

                        {/* Location Sharer tucked at bottom */}
                        <div className="mt-10 pt-8 border-t border-slate-100">
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


function AppointmentCard({ appt, store, onReschedule, isBoard }: { appt: any, store: any, onReschedule: (id: string) => void, isBoard?: boolean }) {
    const patient = store.patients.find((p: any) => p.id === appt.patientId);
    const doctor = store.doctors.find((d: any) => d.id === appt.doctorId);

    // Dynamic Style Lookup
    const procedure = PROCEDURE_TYPES.find(p => p.id === appt.type);
    const label = procedure ? procedure.label : (appt.type || 'Appointment');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            whileHover={{ y: -4, scale: 1.01, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
            className={cn(
                "group relative bg-white rounded-[1.5rem] p-4 transition-all duration-500",
                isBoard ? "flex flex-col gap-4 shadow-[0_5px_15px_-5px_rgba(0,0,0,0.05)] border border-transparent hover:border-indigo-100/50"
                    : "flex items-center justify-between shadow-sm border border-slate-50 hover:border-slate-100"
            )}
        >
            <div className="flex items-start gap-4 w-full">
                {/* Time Slot */}
                <div className={cn(
                    "flex flex-col items-center justify-center rounded-2xl transition-colors shrink-0 font-serif italic",
                    isBoard ? "w-12 h-12 bg-slate-50/80 text-slate-900" : "w-14 h-14 bg-slate-50 text-slate-700"
                )}>
                    <span className={cn(isBoard ? "text-xs font-bold" : "text-sm font-bold")}>{appt.slot}</span>
                </div>

                {/* Patient Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                            {patient?.name || "Unknown"}
                        </h4>
                        {appt.status === 'ongoing' && appt.startedAt && <LiveTimer startTime={appt.startedAt} />}
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium truncate flex items-center gap-2">
                        <span className="uppercase tracking-wider opacity-70">{label}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>{doctor?.name || "Unassigned"}</span>
                    </p>

                    {/* Action Bar (Board Mode) */}
                    {isBoard && (
                        <div className="flex gap-2 mt-4">
                            {/* ACTION BUTTONS - Polished */}
                            {(!appt.status || appt.status === 'confirmed' || appt.status === 'pending') && (
                                <Button size="sm" onClick={() => store.updateAppointmentStatus(appt.id, 'arrived')}
                                    className="h-9 flex-1 text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100/50 rounded-xl shadow-sm hover:shadow-md transition-all">
                                    Check In
                                </Button>
                            )}
                            {appt.status === 'arrived' && (
                                <Button size="sm" onClick={() => store.updateAppointmentStatus(appt.id, 'ongoing')}
                                    className="h-9 flex-1 text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all">
                                    Start Case
                                </Button>
                            )}
                            {appt.status === 'ongoing' && (
                                <Button size="sm" onClick={() => store.updateAppointmentStatus(appt.id, 'completed')}
                                    className="h-9 flex-1 text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800 border border-transparent rounded-xl shadow-lg hover:shadow-xl transition-all">
                                    Finish
                                </Button>
                            )}
                            {appt.status === 'completed' && (
                                <div className="flex-1 flex items-center justify-center gap-2 h-9 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Done</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* List Mode Actions */}
            {!isBoard && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button onClick={() => onReschedule(appt.id)} variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0 text-slate-300 hover:text-amber-600 hover:bg-amber-50">
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
