"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Calendar, User, Phone } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSchedulingStore } from "@/lib/scheduling-store"; // IMPORT STORE
import { toast } from "sonner";

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
        time: ""
    });

    const filteredPatients = store.patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm)
    );

    const handleBookRegistered = () => {
        if (!selectedPatient) return;

        store.addAppointment({
            patientId: selectedPatient.id,
            doctorId: bookingDetails.doctorId === "any" ? undefined : bookingDetails.doctorId,
            date: bookingDetails.date, // Valid ISO date string expected
            slot: bookingDetails.time,
            reason: bookingDetails.reason,
            type: 'consultation'
        });

        toast.success(`Appointment booked for ${selectedPatient.name}`);
        setOpen(false);
    };

    const handleRegisterAndBook = () => {
        if (!newPatient.firstName || !newPatient.phone) {
            toast.error("Please fill required details");
            return;
        }

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
            type: 'new'
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
            <DialogContent className="sm:max-w-[800px] bg-white text-slate-900 border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                <div className="bg-slate-50/50 p-8 border-b border-slate-100">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-serif italic text-slate-900 tracking-tighter">Book Appointment</DialogTitle>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Schedule a consultation or procedure.</p>
                    </DialogHeader>
                </div>
                <div className="p-8">

                    <Tabs defaultValue="registered" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100/50 p-1 rounded-2xl h-14">
                            <TabsTrigger value="registered" className="rounded-xl h-12 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md transition-all">Registered Patient</TabsTrigger>
                            <TabsTrigger value="new" className="rounded-xl h-12 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md transition-all">New Patient</TabsTrigger>
                        </TabsList>

                        {/* === Tab 1: Registered === */}
                        <TabsContent value="registered" className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by name or phone..."
                                    className="pl-10 h-14 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-700"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <ScrollArea className="h-[150px] border rounded-md p-2">
                                {filteredPatients.length === 0 ? (
                                    <p className="text-xs text-center text-gray-400 py-4">No patients found.</p>
                                ) : (
                                    filteredPatients.map(patient => (
                                        <div
                                            key={patient.id}
                                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${selectedPatient?.id === patient.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'}`}
                                            onClick={() => setSelectedPatient(patient)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                                                    {patient.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{patient.name}</p>
                                                    <p className="text-xs text-gray-500">{patient.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </ScrollArea>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input type="date" onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Time Slot</Label>
                                    <Input type="time" onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Doctor Preference</Label>
                                <Select onValueChange={(v) => setBookingDetails({ ...bookingDetails, doctorId: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="First Available (Any Doctor)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">First Available (Any Doctor)</SelectItem>
                                        {store.doctors.filter(d => d.isAvailable).map(doc => (
                                            <SelectItem key={doc.id} value={doc.id}>{doc.name} ({doc.specialty})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Reason</Label>
                                <Input placeholder="e.g. Toothache" onChange={(e) => setBookingDetails({ ...bookingDetails, reason: e.target.value })} />
                            </div>

                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 rounded-2xl font-bold uppercase tracking-widest shadow-lg hover:shadow-indigo-500/20 transition-all text-xs" disabled={!selectedPatient} onClick={handleBookRegistered}>
                                Confirm Booking
                            </Button>
                        </TabsContent>

                        {/* === Tab 2: New Patient === */}
                        <TabsContent value="new" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input placeholder="John" onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input placeholder="Doe" onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input placeholder="98765 00000" onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input type="date" onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Time Slot</Label>
                                    <Input type="time" onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Doctor Preference</Label>
                                <Select onValueChange={(v) => setBookingDetails({ ...bookingDetails, doctorId: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="First Available (Any Doctor)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">First Available (Any Doctor)</SelectItem>
                                        {store.doctors.filter(d => d.isAvailable).map(doc => (
                                            <SelectItem key={doc.id} value={doc.id}>{doc.name} ({doc.specialty})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Reason</Label>
                                <Input placeholder="e.g. Toothache" onChange={(e) => setBookingDetails({ ...bookingDetails, reason: e.target.value })} />
                            </div>

                            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-14 rounded-2xl font-bold uppercase tracking-widest shadow-lg hover:shadow-emerald-500/20 transition-all text-xs" onClick={handleRegisterAndBook}>
                                Register & Book Appointment
                            </Button>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
