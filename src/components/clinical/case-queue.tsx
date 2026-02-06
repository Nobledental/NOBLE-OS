"use client";

import { useSchedulingStore } from "@/lib/scheduling-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function CaseQueue() {
    const store = useSchedulingStore();

    // Mock Current Doctor Login
    const currentDoctorId = "d1";
    const currentDoctorName = store.doctors.find(d => d.id === currentDoctorId)?.name || "Me";

    // Filter Logic
    // 1. Assigned to Me
    const myCases = store.appointments.filter(a =>
        a.doctorId === currentDoctorId &&
        ['pending', 'confirmed'].includes(a.status)
    );

    // 2. Unassigned / General Pool
    const generalQueue = store.appointments.filter(a =>
        !a.doctorId &&
        ['pending', 'confirmed'].includes(a.status)
    );

    const handleTakeCase = (apptId: string) => {
        store.assignDoctor(apptId, currentDoctorId);
        toast.success("Case assigned to you successfully.");
    };

    const getPatientName = (id: string) => store.patients.find(p => p.id === id)?.name || "Unknown";

    return (
        <div className="space-y-6">
            {/* My Active Queue */}
            <Card className="border-indigo-100 bg-indigo-50/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-indigo-900 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            Assigned to {currentDoctorName}
                        </span>
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">{myCases.length}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {myCases.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No cases specifically assigned to you.</p>
                    ) : (
                        myCases.map(appt => (
                            <div key={appt.id} className="bg-white p-3 rounded-lg border shadow-sm flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-sm">{getPatientName(appt.patientId)}</div>
                                    <div className="text-xs text-muted-foreground">{appt.reason} • {appt.slot}</div>
                                </div>
                                <Button size="sm" className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700">
                                    Start Consult <ArrowRight className="ml-1 w-3 h-3" />
                                </Button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* General Queue */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-slate-700 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            General Clinic Queue
                        </span>
                        <Badge variant="outline">{generalQueue.length}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {generalQueue.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">Clinic queue is empty.</p>
                    ) : (
                        generalQueue.map(appt => (
                            <div key={appt.id} className="bg-slate-50 p-3 rounded-lg border flex items-center justify-between hover:bg-slate-100 transition-colors">
                                <div>
                                    <div className="font-bold text-sm">{getPatientName(appt.patientId)}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {appt.slot} • {appt.reason}
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                                    onClick={() => handleTakeCase(appt.id)}
                                >
                                    Take Case
                                </Button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
