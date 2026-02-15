
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Calendar, User, Phone, Video, MapPin, RefreshCw, Clock, Stethoscope, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSchedulingStore, PROCEDURE_TYPES } from "@/lib/scheduling-store"; // IMPORT STORE
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays } from "date-fns";



export function NewAppointmentDialog() {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const store = useSchedulingStore();

    // Form States
    const [newPatient, setNewPatient] = useState({ firstName: "", lastName: "", phone: "" });
    const [bookingDetails, setBookingDetails] = useState({
        reason: "",
        procedureType: 'consultation',
        doctorId: "any",
        date: format(new Date(), 'yyyy-MM-dd'),
        time: "",
        googleMeet: false,
        locationShare: true
    });
    const [isSyncing, setIsSyncing] = useState(false);

    // Smart Search Logic
    const filteredPatients = store.patients.filter(p => {
        if (searchTerm.length < 2) return false; // Start searching after 2 chars
        const term = searchTerm.toLowerCase();
        return p.name.toLowerCase().includes(term) || p.phone.includes(term);
    });

    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Fetch Slots on Date Change or Procedure Change (duration might affect slots in future)
    useEffect(() => {
        if (open && bookingDetails.date) {
            handleFetchSlots(bookingDetails.date);
        }
    }, [bookingDetails.date, bookingDetails.procedureType, open]);

    const handleFetchSlots = async (date: string) => {
        setIsLoadingSlots(true);
        // Default duration based on selected procedure
        const proc = PROCEDURE_TYPES.find(p => p.id === bookingDetails.procedureType);
        const duration = proc?.duration || 30;

        const slots = await store.fetchAvailableSlots(date, store.activeChairs || 3, duration);
        setAvailableSlots(slots);
        setIsLoadingSlots(false);
    };

    const handleProcedureSelect = (procId: string) => {
        const proc = PROCEDURE_TYPES.find(p => p.id === procId);
        setBookingDetails(prev => ({
            ...prev,
            procedureType: procId,
            reason: prev.reason || proc?.label || "" // Auto-fill reason if empty
        }));
    };

    const handleBookRegistered = async () => {
        if (!selectedPatient || !bookingDetails.time) return;

        setIsSyncing(true);

        // Simulate Backend Call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSyncing(false);

        store.addAppointment({
            patientId: selectedPatient.id,
            doctorId: bookingDetails.doctorId === "any" ? undefined : bookingDetails.doctorId,
            date: bookingDetails.date,
            slot: bookingDetails.time,
            reason: bookingDetails.reason,
            type: bookingDetails.procedureType,
            status: 'confirmed',
            googleMeetLink: bookingDetails.googleMeet ? `https://meet.google.com/abc-defg-hij` : undefined,
            locationLink: bookingDetails.locationShare ? store.clinicDetails?.googleMapsUrl : undefined
        });

        toast.success(`Appointment booked for ${selectedPatient.name}`, {
            description: bookingDetails.googleMeet ? "Google Calendar Invite + WhatsApp Sent" : "Synced to local schedule & WhatsApp Sent"
        });
        setOpen(false);
        // Reset Logic can go here
    };

    const handleRegisterAndBook = async () => {
        if (!newPatient.firstName || !newPatient.phone || !bookingDetails.time) {
            toast.error("Please fill required details & select a slot");
            return;
        }

        setIsSyncing(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSyncing(false);

        const newId = crypto.randomUUID();
        const patientData = {
            id: newId,
            name: `${newPatient.firstName} ${newPatient.lastName}`,
            phone: newPatient.phone,
            isNew: true
        };

        store.addPatient(patientData);

        store.addAppointment({
            patientId: newId,
            doctorId: bookingDetails.doctorId === "any" ? undefined : bookingDetails.doctorId,
            date: bookingDetails.date,
            slot: bookingDetails.time,
            reason: bookingDetails.reason,
            type: bookingDetails.procedureType,
            status: 'confirmed',
            googleMeetLink: bookingDetails.googleMeet ? `https://meet.google.com/abc-defg-hij` : undefined,
            locationLink: bookingDetails.locationShare ? store.clinicDetails?.googleMapsUrl : undefined
        });

        toast.success(`Registered ${patientData.name} & Booked!`);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-xl hover:shadow-2xl rounded-[1.5rem] px-6 h-12 uppercase tracking-widest text-[10px] font-black transition-all duration-300">
                    <Plus className="mr-2 h-4 w-4" />
                    New Appointment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[950px] bg-white text-slate-900 border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden ring-1 ring-slate-100 flex flex-col md:flex-row h-[90vh] md:h-[650px]">

                {/* 1. Left Sidebar: Context & Sync Status */}
                <div className="w-full md:w-[280px] bg-slate-50/80 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col gap-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-serif italic text-slate-900 tracking-tighter mb-2">Book<br />Appointment</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Zero-Friction Scheduling</p>
                    </div>

                    <div className="space-y-3">
                        {/* Live Sync Badge */}
                        <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Sync Status</span>
                                    <span className="text-xs font-bold text-emerald-600">Online</span>
                                </div>
                            </div>
                        </div>

                        {/* Google Meet Toggle */}
                        <div className={cn(
                            "p-3 rounded-2xl border transition-all cursor-pointer",
                            bookingDetails.googleMeet ? "bg-blue-50 border-blue-200" : "bg-white border-slate-100"
                        )} onClick={() => setBookingDetails(prev => ({ ...prev, googleMeet: !prev.googleMeet }))}>
                            <div className="flex items-center justify-between mb-1">
                                <Video className={cn("w-4 h-4", bookingDetails.googleMeet ? "text-blue-600" : "text-slate-400")} />
                                <Switch checked={bookingDetails.googleMeet} onCheckedChange={(c) => setBookingDetails({ ...bookingDetails, googleMeet: c })} />
                            </div>
                            <span className="text-xs font-bold text-slate-700">Google Meet</span>
                        </div>

                        {/* Location Toggle */}
                        <div className={cn(
                            "p-3 rounded-2xl border transition-all cursor-pointer",
                            bookingDetails.locationShare ? "bg-amber-50 border-amber-200" : "bg-white border-slate-100"
                        )} onClick={() => setBookingDetails(prev => ({ ...prev, locationShare: !prev.locationShare }))}>
                            <div className="flex items-center justify-between mb-1">
                                <MapPin className={cn("w-4 h-4", bookingDetails.locationShare ? "text-amber-600" : "text-slate-400")} />
                                <Switch checked={bookingDetails.locationShare} onCheckedChange={(c) => setBookingDetails({ ...bookingDetails, locationShare: c })} />
                            </div>
                            <span className="text-xs font-bold text-slate-700">Share Location</span>
                        </div>
                    </div>
                </div>

                {/* 2. Right Content: The "Zero-Type" Form */}
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
                    <Tabs defaultValue="registered" className="flex-1 flex flex-col">
                        <div className="px-6 pt-6 md:px-8 md:pt-8 pb-4 border-b border-slate-50">
                            <TabsList className="bg-slate-100/80 p-1 rounded-xl w-full md:w-auto h-12">
                                <TabsTrigger value="registered" className="rounded-lg h-10 px-6 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm">Registered Patient</TabsTrigger>
                                <TabsTrigger value="new" className="rounded-lg h-10 px-6 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm">New Patient</TabsTrigger>
                            </TabsList>
                        </div>

                        <ScrollArea className="flex-1 p-6 md:p-8">
                            <TabsContent value="registered" className="mt-0 space-y-8 pb-20">
                                {/* A. Smart Search */}
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">1. Find Patient</Label>
                                    <div className="relative group z-20">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <Input
                                            placeholder="Type 3 letters to search..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="h-14 pl-11 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 transition-all font-medium"
                                        />
                                        {/* Dropdown Results */}
                                        <AnimatePresence>
                                            {searchTerm.length >= 2 && !selectedPatient && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                                    className="absolute top-16 left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 max-h-[200px] overflow-y-auto custom-scrollbar"
                                                >
                                                    {filteredPatients.length === 0 ? (
                                                        <div className="p-4 text-center text-xs text-slate-400">No patients found. Switch to "New Patient" tab.</div>
                                                    ) : (
                                                        filteredPatients.map(p => (
                                                            <div
                                                                key={p.id}
                                                                onClick={() => { setSelectedPatient(p); setSearchTerm(""); }}
                                                                className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                                        {p.name.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold text-slate-700">{p.name}</p>
                                                                        <p className="text-[10px] text-slate-400">{p.phone}</p>
                                                                    </div>
                                                                </div>
                                                                <Plus className="w-4 h-4 text-slate-300" />
                                                            </div>
                                                        ))
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Selected Patient Card */}
                                    {selectedPatient && (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-bold">
                                                    {selectedPatient.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-sm font-bold text-indigo-900">{selectedPatient.name}</h4>
                                                        {(selectedPatient.medicalAlerts?.length || 0) > 0 && (
                                                            <Badge variant="destructive" className="h-4 px-1 text-[9px] uppercase tracking-wide">High Risk</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-indigo-600">{selectedPatient.phone}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(null)} className="hover:bg-indigo-200 text-indigo-600">Change</Button>
                                        </motion.div>
                                    )}
                                </div>

                                {/* B. Procedure Selection (Dropdown) */}
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">2. Select Procedure</Label>
                                    <Select
                                        value={bookingDetails.procedureType}
                                        onValueChange={(val) => handleProcedureSelect(val)}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-slate-700">
                                            <SelectValue placeholder="Select Procedure" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PROCEDURE_TYPES.map(proc => (
                                                <SelectItem key={proc.id} value={proc.id} className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn("w-2 h-2 rounded-full", proc.color.split(' ')[0])} />
                                                        {proc.label}
                                                        <span className="text-slate-400 text-xs ml-1">({proc.duration}m)</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* C. Visual Grid Slots */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">3. Pick a Time</Label>
                                        <Input
                                            type="date"
                                            value={bookingDetails.date}
                                            onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                                            className="w-auto h-8 text-xs bg-transparent border-none focus:ring-0 p-0 font-bold text-right"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 md:grid-cols-5 gap-2 max-h-[160px] overflow-y-auto custom-scrollbar p-1">
                                        {isLoadingSlots ? (
                                            <div className="col-span-4 md:col-span-5 text-center py-6 text-xs text-slate-400 animate-pulse">Scanning availability...</div>
                                        ) : availableSlots.length === 0 ? (
                                            <div className="col-span-4 md:col-span-5 text-center py-6 text-xs text-slate-400">No slots available for this date.</div>
                                        ) : (
                                            availableSlots.map(slot => (
                                                <button
                                                    key={slot.time}
                                                    onClick={() => setBookingDetails({ ...bookingDetails, time: slot.time })}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all relative overflow-hidden",
                                                        bookingDetails.time === slot.time
                                                            ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                                            : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:shadow-sm"
                                                    )}
                                                >
                                                    <span className="text-xs font-bold leading-none">{slot.time}</span>
                                                    {slot.available <= 1 && slot.available > 0 && (
                                                        <span className="text-[8px] text-red-500 font-bold mt-1">Only 1 left</span>
                                                    )}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Confirm Button */}
                                <Button
                                    size="lg"
                                    onClick={handleBookRegistered}
                                    disabled={!selectedPatient || !bookingDetails.time || isSyncing}
                                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-200 mt-4"
                                >
                                    {isSyncing ? "Syncing..." : "Confirm Booking"}
                                </Button>
                            </TabsContent>

                            <TabsContent value="new" className="mt-0 space-y-6 pb-20">
                                {/* New Patient Form - Simplified */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input placeholder="First Name" className="h-12 rounded-xl bg-slate-50 border-slate-100" onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })} />
                                            <Input placeholder="Last Name" className="h-12 rounded-xl bg-slate-50 border-slate-100" onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile</Label>
                                        <Input placeholder="Phone Number" className="h-12 rounded-xl bg-slate-50 border-slate-100" onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })} />
                                    </div>
                                </div>

                                {/* Re-use Procedure and Slot logic here for DRY if refining further, duplicating for speed now */}
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Procedure</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {QUICK_PROCEDURES.map(proc => (
                                            <button
                                                key={proc.id}
                                                onClick={() => handleProcedureSelect(proc.id)}
                                                className={cn(
                                                    "px-3 py-2 rounded-xl border text-xs font-bold transition-all",
                                                    bookingDetails.procedureType === proc.id
                                                        ? cn(proc.color, "shadow-sm")
                                                        : "bg-white border-slate-100 text-slate-500"
                                                )}
                                            >
                                                {proc.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pick Time</Label>
                                    <div className="grid grid-cols-5 gap-2 max-h-[160px] overflow-y-auto p-1">
                                        {/* Same grid logic */}
                                        {availableSlots.map(slot => (
                                            <button
                                                key={slot.time}
                                                onClick={() => setBookingDetails({ ...bookingDetails, time: slot.time })}
                                                className={cn(
                                                    "py-2 px-1 rounded-lg border text-xs font-bold transition-all",
                                                    bookingDetails.time === slot.time
                                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-lg"
                                                        : "bg-white border-slate-100 text-slate-600 hover:border-emerald-200"
                                                )}
                                            >
                                                {slot.time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    onClick={handleRegisterAndBook}
                                    disabled={!newPatient.firstName || !newPatient.phone || !bookingDetails.time || isSyncing}
                                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-200 mt-4"
                                >
                                    {isSyncing ? "Creating..." : "Register & Book"}
                                </Button>
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
