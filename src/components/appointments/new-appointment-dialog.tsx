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
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" />
                    New Appointment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Book Appointment</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="registered" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="registered">Registered Patient</TabsTrigger>
                        <TabsTrigger value="new">New Patient</TabsTrigger>
                    </TabsList>

                    {/* === Tab 1: Registered === */}
                    <TabsContent value="registered" className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by name or phone..."
                                className="pl-9"
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
                                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedPatient?.id === patient.id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'}`}
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

                        <Button className="w-full bg-indigo-600" disabled={!selectedPatient} onClick={handleBookRegistered}>
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

                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleRegisterAndBook}>
                            Register & Book Appointment
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
