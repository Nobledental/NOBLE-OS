"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Calendar, User, Phone } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const MOCK_PATIENTS = [
    { id: '1', name: 'John Doe', phone: '9876543210' },
    { id: '2', name: 'Jane Smith', phone: '9898989898' },
    { id: '3', name: 'Robert Johnson', phone: '9123456789' },
];

export function NewAppointmentDialog() {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    const filteredPatients = MOCK_PATIENTS.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm)
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" />
                    New Appointment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Book Appointment</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="registered" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="registered">Registered Patient</TabsTrigger>
                        <TabsTrigger value="new">New Patient</TabsTrigger>
                    </TabsList>

                    <TabsContent value="registered" className="space-y-4 py-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by name or phone..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <ScrollArea className="h-[200px] border rounded-md p-2">
                            {filteredPatients.map(patient => (
                                <div
                                    key={patient.id}
                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-indigo-50 ${selectedPatient?.id === patient.id ? 'bg-indigo-50 border border-indigo-200' : ''}`}
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
                                    {selectedPatient?.id === patient.id && (
                                        <div className="text-xs font-bold text-indigo-600">SELECTED</div>
                                    )}
                                </div>
                            ))}
                        </ScrollArea>

                        <div className="space-y-2">
                            <Label>Reason for Visit</Label>
                            <Input placeholder="e.g. Toothache, Cleaning" />
                        </div>

                        <div className="space-y-2">
                            <Label>Date & Time</Label>
                            <Input type="datetime-local" />
                        </div>

                        <Button className="w-full bg-indigo-600" disabled={!selectedPatient}>
                            Book Appointment
                        </Button>
                    </TabsContent>

                    <TabsContent value="new" className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input placeholder="+91 98765 43210" />
                        </div>
                        <div className="space-y-2">
                            <Label>Reason for Visit</Label>
                            <Input placeholder="e.g. Toothache" />
                        </div>
                        <div className="space-y-2">
                            <Label>Date & Time</Label>
                            <Input type="datetime-local" />
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                            Register & Book
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
