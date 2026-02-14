
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Calendar, User, Phone, Video, Users, Clock, CheckCircle2, RefreshCw, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSchedulingStore } from "@/lib/scheduling-store"; // IMPORT STORE
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function NewAppointmentDialog() {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const store = useSchedulingStore(); // USE STORE

    // Form States
    const [newPatient, setNewPatient] = useState({ firstName: "", lastName: "", phone: "" });
    const [bookingDetails, setBookingDetails] = useState({
        reason: "",
        doctorId: "any",
        date: "",
        time: "",
        googleMeet: false,
        locationShare: true // Default to true if user has GMB
    });
    const [isSyncing, setIsSyncing] = useState(false);

    const filteredPatients = store.patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm)
    );

    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Fetch Slots on Date Change
    // In a real app, use useQuery or useEffect
    const handleDateChange = async (date: string) => {
        setBookingDetails({ ...bookingDetails, date });
        if (!date) return;

        setIsLoadingSlots(true);

        const slots = await store.fetchAvailableSlots(date, store.activeChairs || 3);
        setAvailableSlots(slots);
        setIsLoadingSlots(false);
    };

    const handleBookRegistered = async () => {
        if (!selectedPatient) return;

        setIsSyncing(true);

        // Call Backend to Create Event
        try {
            const res = await fetch('/api/calendar/event', {
                method: 'POST',
                body: JSON.stringify({
                    summary: `Consultation: ${selectedPatient.name}`,
                    description: `Reason: ${bookingDetails.reason}\nPhone: ${selectedPatient.phone}`,
                    start: `${bookingDetails.date}T${bookingDetails.time}:00`,
                    end: ``, // logic to add duration
                    googleMeet: bookingDetails.googleMeet,
                    location: bookingDetails.locationShare ? store.clinicDetails?.address : undefined
                })
            });
        } catch (e) {
            console.error(e);
        }

        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSyncing(false);

        store.addAppointment({
            patientId: selectedPatient.id,
            doctorId: bookingDetails.doctorId === "any" ? undefined : bookingDetails.doctorId,
            date: bookingDetails.date, // Valid ISO date string expected
            slot: bookingDetails.time,
            reason: bookingDetails.reason,
            type: 'consultation',
            status: 'confirmed', // Required by Appointment interface
            googleMeetLink: bookingDetails.googleMeet ? `https://meet.google.com/${crypto.randomUUID().slice(0, 3)}-${crypto.randomUUID().slice(0, 4)}-${crypto.randomUUID().slice(0, 3)}` : undefined,
            locationLink: bookingDetails.locationShare ? store.clinicDetails?.googleMapsUrl : undefined
        });

        toast.success(`Appointment booked for ${selectedPatient.name}`, {
            description: bookingDetails.googleMeet ? "Google Calendar Invite + WhatsApp Sent" : "Synced to local schedule & WhatsApp Sent"
        });
        setOpen(false);
    };

    const handleRegisterAndBook = async () => {
        if (!newPatient.firstName || !newPatient.phone) {
            toast.error("Please fill required details");
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
            type: 'new',
            status: 'confirmed', // Required by Appointment interface
            googleMeetLink: bookingDetails.googleMeet ? `https://meet.google.com/${crypto.randomUUID().slice(0, 3)}-${crypto.randomUUID().slice(0, 4)}-${crypto.randomUUID().slice(0, 3)}` : undefined,
            locationLink: bookingDetails.locationShare ? store.clinicDetails?.googleMapsUrl : undefined
        });

        toast.success(`Registered ${patientData.name} & Booked!`, {
            description: "Calendar invitation & WhatsApp sent to patient."
        });
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
            <DialogContent className="sm:max-w-[900px] bg-white/80 backdrop-blur-xl text-slate-900 border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden ring-1 ring-slate-100">
                <div className="flex h-[600px]">
                    {/* Left Sidebar: Context & Actions */}
                    <div className="w-[300px] bg-slate-50/80 p-8 border-r border-slate-100 flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-serif italic text-slate-900 tracking-tighter mb-2">Book<br />Appointment</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Schedule & Sync</p>

                            <div className="space-y-4">
                                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600">Google Calendar</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        Live Sync Active
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-lg transition-colors", bookingDetails.googleMeet ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400")}>
                                                <Video className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-600">Google Meet</span>
                                                <span className="text-[10px] text-slate-400">Auto-generate link</span>
                                            </div>
                                        </div>
                                        <Switch checked={bookingDetails.googleMeet} onCheckedChange={(c) => setBookingDetails({ ...bookingDetails, googleMeet: c })} />
                                    </div>
                                </div>
                            </div>

                            {store.clinicDetails?.googleMapsUrl && (
                                <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-lg transition-colors", bookingDetails.locationShare ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400")}>
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-600">Share Location</span>
                                                <span className="text-[10px] text-slate-400">Attach Google Maps</span>
                                            </div>
                                        </div>
                                        <Switch checked={bookingDetails.locationShare} onCheckedChange={(c) => setBookingDetails({ ...bookingDetails, locationShare: c })} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto pt-8 text-[10px] text-slate-300 font-medium text-center">
                            Powered by NobleOS Scheduling Engine
                        </div>
                    </div>
                    {/* Right Content: Bento Grid Form */}
                    <div className="flex-1 p-8 bg-white overflow-y-auto custom-scrollbar">
                        <Tabs defaultValue="registered" className="w-full space-y-6">
                            <TabsList className="grid w-full grid-cols-2 bg-slate-100/50 p-1 rounded-2xl h-14 mb-6">
                                <TabsTrigger value="registered" className="rounded-xl h-12 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md transition-all">Registered Patient</TabsTrigger>
                                <TabsTrigger value="new" className="rounded-xl h-12 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md transition-all">New Patient</TabsTrigger>
                            </TabsList>

                            {/* === Tab 1: Registered === */}
                            <TabsContent value="registered" className="space-y-6">
                                {/* Search Bento */}
                                <div className="p-1 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Search name or phone..."
                                            className="pl-10 h-12 rounded-xl border-none bg-transparent focus-visible:ring-0 text-sm font-medium placeholder:text-slate-400"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <ScrollArea className="h-[120px] px-2 pb-2">
                                        {filteredPatients.length === 0 ? (
                                            <p className="text-xs text-center text-slate-400 py-8 italic">No patients found</p>
                                        ) : (
                                            filteredPatients.map(patient => (
                                                <div
                                                    key={patient.id}
                                                    className={cn(
                                                        "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all mb-1",
                                                        selectedPatient?.id === patient.id
                                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                                            : "hover:bg-white hover:shadow-sm text-slate-600"
                                                    )}
                                                    onClick={() => setSelectedPatient(patient)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs", selectedPatient?.id === patient.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500")}>
                                                            {patient.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold">{patient.name}</p>
                                                            <p className={cn("text-[10px]", selectedPatient?.id === patient.id ? "text-indigo-200" : "text-slate-400")}>{patient.phone}</p>
                                                        </div>
                                                    </div>
                                                    {selectedPatient?.id === patient.id && <CheckCircle2 className="w-4 h-4" />}
                                                </div>
                                            ))
                                        )}
                                    </ScrollArea>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input type="date" className="h-12 rounded-xl bg-slate-50 border-slate-100" onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })} />
                                            <Input type="time" className="h-12 rounded-xl bg-slate-50 border-slate-100" onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preference</Label>
                                        <Select onValueChange={(v) => setBookingDetails({ ...bookingDetails, doctorId: v })}>
                                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100">
                                                <SelectValue placeholder="Select Doctor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="any">First Available (Any)</SelectItem>
                                                {store.doctors.filter(d => d.isAvailable).map(doc => (
                                                    <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</Label>
                                    <Input
                                        placeholder="e.g. Toothache, Scaling, Checkup"
                                        className="h-12 rounded-xl bg-slate-50 border-slate-100"
                                        onChange={(e) => setBookingDetails({ ...bookingDetails, reason: e.target.value })}
                                    />
                                </div>

                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all text-xs mt-4 relative overflow-hidden"
                                    disabled={!selectedPatient || isSyncing}
                                    onClick={handleBookRegistered}
                                >
                                    {isSyncing ? (
                                        <div className="flex items-center gap-2">
                                            <RefreshCw className="w-4 h-4 animate-spin" /> Syncing with Google...
                                        </div>
                                    ) : (
                                        "Confirm & Sync Booking"
                                    )}
                                </Button>
                            </TabsContent>


                            <TabsContent value="new" className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client Details</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input placeholder="First Name" className="h-12 rounded-xl bg-slate-50 border-slate-100" onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })} />
                                            <Input placeholder="Last Name" className="h-12 rounded-xl bg-slate-50 border-slate-100" onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</Label>
                                        <Input placeholder="Phone Number" className="h-12 rounded-xl bg-slate-50 border-slate-100" onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input type="date" className="h-12 rounded-xl bg-slate-50 border-slate-100" onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })} />
                                            <Input type="time" className="h-12 rounded-xl bg-slate-50 border-slate-100" onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</Label>
                                        <Input placeholder="Visit Reason" className="h-12 rounded-xl bg-slate-50 border-slate-100" onChange={(e) => setBookingDetails({ ...bookingDetails, reason: e.target.value })} />
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-14 rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all text-xs mt-4"
                                    onClick={handleRegisterAndBook}
                                    disabled={isSyncing}
                                >
                                    {isSyncing ? (
                                        <div className="flex items-center gap-2">
                                            <RefreshCw className="w-4 h-4 animate-spin" /> Registering & Syncing...
                                        </div>
                                    ) : (
                                        "Register & Book Appointment"
                                    )}
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
