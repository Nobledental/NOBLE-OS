"use client";

import { useEffect, useState } from "react";
import { useSchedulingStore } from "@/lib/scheduling-store";
import { BoardingPass } from "@/components/ui/boarding-pass";
import { Button } from "@/components/ui/button";
import { Plane, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function PatientDashboard() {
    const store = useSchedulingStore();
    const [appointments, setAppointments] = useState<any[]>([]);

    useEffect(() => {
        // In a real app, we would filter by the logged-in user's ID.
        // For this demo, we'll show the last few appointments from the store.
        setAppointments(store.appointments.slice(-3).reverse());
    }, [store.appointments]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-black selection:text-white pb-20">
            {/* Header */}
            <header className="bg-black text-white p-6 sticky top-0 z-50">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black font-black text-xl">
                            {(store.clinicDetails?.name || "N")[0]}
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-none">{store.clinicDetails?.name || "Noble Dental"}</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Portal</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-6 space-y-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-black tracking-tight">My Appointments</h2>
                    <p className="text-slate-500 font-medium">Your upcoming appointment schedule.</p>
                </div>

                {appointments.length > 0 ? (
                    <div className="space-y-8">
                        {appointments.map((appt, i) => {
                            const doctor = store.doctors.find(d => d.id === appt.doctorId) || store.doctors[0];
                            const patient = store.patients.find(p => p.id === appt.patientId);

                            return (
                                <motion.div
                                    key={appt.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="mb-2 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            {appt.status === 'confirmed' ? 'Confirmed' : 'Pending Approval'}
                                        </span>
                                    </div>
                                    <BoardingPass
                                        patientName={patient ? patient.name : "Guest Patient"}
                                        doctor={doctor}
                                        date={appt.date}
                                        time={appt.slot}
                                        procedure={appt.reason}
                                        appointmentId={appt.id || "APT-001"}
                                        clinicName={store.clinicDetails?.name || "Noble Dental"}
                                        clinicLocation={store.clinicDetails?.address || "Hyderabad"}
                                        status="issued" // Always show as issued in dashboard
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 opacity-50">
                        <Plane className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-xl font-bold text-slate-400">No Appointments Scheduled</h3>
                        <p className="text-sm text-slate-300">Your upcoming appointments will appear here.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
