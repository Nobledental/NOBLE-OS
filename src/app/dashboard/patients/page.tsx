"use client";

import { useState } from "react";
import { MOCK_PATIENT_DB, PatientRecord } from "@/lib/data/patient-db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Filter, FileText, Activity, Clock } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { PatientFileManager } from "@/components/patients/patient-file-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PatientClinicalProfile } from "@/components/clinical/patient-clinical-profile";
import { Card } from "@/components/ui/card";
import { AbhaCard } from "@/components/patient/abha-card";

export default function PatientsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

    const filteredPatients = MOCK_PATIENT_DB.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm) ||
        p.healthFloId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Patient Directory</h2>
                    <p className="text-slate-500">Your clinic's private database & file storage.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <UserPlus className="w-4 h-4 mr-2" /> Register New
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by Name, Phone, or ID..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="gap-2 text-slate-600">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead>HealthFlo ID</TableHead>
                            <TableHead>Patient Name</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Last Visit</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPatients.map((patient) => (
                            <TableRow
                                key={patient.id}
                                className="cursor-pointer hover:bg-slate-50"
                                onClick={() => setSelectedPatient(patient)}
                            >
                                <TableCell className="font-mono text-xs text-slate-500">{patient.healthFloId}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900">{patient.name}</span>
                                        <span className="text-xs text-slate-500">{patient.age}y / {patient.gender}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-600">{patient.phone}</TableCell>
                                <TableCell>{patient.lastVisit}</TableCell>
                                <TableCell>
                                    <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'} className={patient.status === 'Active' ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                                        {patient.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-indigo-600 font-bold text-xs">
                                        OPEN FILE
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Patient File Sheet (Storage View) */}
            <Sheet open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
                <SheetContent className="sm:max-w-xl w-full">
                    {selectedPatient && (
                        <div className="h-full flex flex-col">
                            <SheetHeader className="mb-6">
                                <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                                    {selectedPatient.name}
                                    <Badge variant="outline" className="ml-2 font-mono font-normal text-xs">{selectedPatient.healthFloId}</Badge>
                                </SheetTitle>
                                <SheetDescription>
                                    {selectedPatient.age} years • {selectedPatient.gender} • {selectedPatient.phone}
                                </SheetDescription>
                            </SheetHeader>

                            <Tabs defaultValue="files" className="flex-1 flex flex-col">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="history">History</TabsTrigger>
                                    <TabsTrigger value="files">Storage & Files</TabsTrigger>
                                    <TabsTrigger value="profile">Profile</TabsTrigger>
                                </TabsList>

                                <TabsContent value="files" className="flex-1 mt-4">
                                    <div className="bg-slate-50 rounded-lg p-4 h-full flex flex-col">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                                <FileText className="w-4 h-4" /> Patient Repository
                                            </h4>
                                            <Button size="sm" variant="outline" className="h-8 text-xs">
                                                Upload File
                                            </Button>
                                        </div>
                                        <ScrollArea className="flex-1">
                                            <PatientFileManager files={selectedPatient.files} />
                                        </ScrollArea>
                                    </div>
                                </TabsContent>

                                <TabsContent value="history" className="mt-4">
                                    <ScrollArea className="h-[400px] border rounded-3xl p-6 bg-slate-50/50">
                                        <div className="relative pl-6 border-l-2 border-slate-200 space-y-8">
                                            {selectedPatient.history.map((record, i) => (
                                                <div key={i} className="relative">
                                                    <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-500 shadow-sm" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{record.date}</p>
                                                    <h4 className="text-sm font-black text-slate-900 tracking-tight">{record.treatment}</h4>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Treated by {record.doctor}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent value="profile" className="flex-1 mt-4">
                                    <ScrollArea className="h-full pr-4">
                                        <PatientClinicalProfile
                                            patientId={selectedPatient.id}
                                            patientName={selectedPatient.name}
                                            uhid={selectedPatient.healthFloId}
                                        />
                                        <div className="mt-8 space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Account Intelligence</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Card className="p-4 rounded-3xl border-slate-100 bg-slate-50/50">
                                                    <p className="text-[8px] font-black uppercase text-slate-400">Join Date</p>
                                                    <p className="text-xs font-bold">Jan 12, 2024</p>
                                                </Card>
                                                <Card className="p-4 rounded-3xl border-slate-100 bg-slate-50/50">
                                                    <p className="text-[8px] font-black uppercase text-slate-400">Referral</p>
                                                    <p className="text-xs font-bold text-indigo-600">Google Search</p>
                                                </Card>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
