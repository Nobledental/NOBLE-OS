"use client";

import { useSchedulingStore } from "@/lib/scheduling-store";
import { PanzeCard } from "@/components/ui/panze-card";
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
            <PanzeCard className="border-white/10 bg-white/[0.05] glass-neo p-6 transition-all duration-500 hover:shadow-neo-vibrant-blue/10">
                <div className="pb-6 flex items-center justify-between border-b border-white/5 mb-6">
                    <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50 flex items-center gap-3">
                        <UserPlus className="w-4 h-4 text-neo-vibrant-blue" />
                        Assigned to {currentDoctorName}
                    </div>
                    <Badge variant="outline" className="bg-white/5 text-white border-white/10 px-3 py-1 text-[10px] font-black">
                        {myCases.length} ACTIVE
                    </Badge>
                </div>
                <div className="space-y-4">
                    {myCases.length === 0 ? (
                        <p className="text-xs text-white/20 font-medium px-2">No cases specifically assigned to you.</p>
                    ) : (
                        myCases.map(appt => (
                            <div key={appt.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all group">
                                <div>
                                    <div className="font-bold text-sm text-white">{getPatientName(appt.patientId)}</div>
                                    <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">{appt.reason} • {appt.slot}</div>
                                </div>
                                <Button size="sm" className="h-9 px-4 rounded-xl text-xs bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest">
                                    Consult <ArrowRight className="ml-2 w-3 h-3 text-neo-vibrant-blue" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </PanzeCard>

            {/* General Queue */}
            <PanzeCard className="border-white/5 bg-white/[0.02] glass-neo p-6">
                <div className="pb-6 flex items-center justify-between border-b border-white/5 mb-6">
                    <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-3">
                        <Users className="w-4 h-4" />
                        General Clinic Queue
                    </div>
                    <Badge variant="outline" className="bg-white/5 text-white/40 border-white/10 text-[10px] font-black">
                        {generalQueue.length} WAITING
                    </Badge>
                </div>
                <div className="space-y-3">
                    {generalQueue.length === 0 ? (
                        <p className="text-xs text-white/10 font-medium px-2">Clinic queue is empty.</p>
                    ) : (
                        generalQueue.map(appt => (
                            <div key={appt.id} className="bg-white/[0.01] p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-all">
                                <div>
                                    <div className="font-bold text-sm text-white/70">{getPatientName(appt.patientId)}</div>
                                    <div className="text-[10px] text-white/30 font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                                        <Clock className="w-3 h-3" /> {appt.slot} • {appt.reason}
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-9 px-4 rounded-xl text-xs border-white/10 text-white/60 hover:bg-white/10 hover:text-white font-black uppercase tracking-widest"
                                    onClick={() => handleTakeCase(appt.id)}
                                >
                                    Take Case
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </PanzeCard>
        </div>
    );
}
