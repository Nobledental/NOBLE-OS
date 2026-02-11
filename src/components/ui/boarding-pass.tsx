"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, Clock, MapPin, QrCode, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Doctor } from '@/lib/scheduling-store';

interface BoardingPassProps {
    patientName: string;
    doctor: Doctor;
    date: string;
    time: string;
    procedure: string;
    appointmentId: string;
    clinicName: string;
    clinicLocation: string;
    status: 'draft' | 'issued';
}

export const BoardingPass: React.FC<BoardingPassProps> = ({
    patientName,
    doctor,
    date,
    time,
    procedure,
    appointmentId,
    clinicName,
    clinicLocation,
    status
}) => {
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        if (status === 'issued') {
            const timer = setTimeout(() => setIsRevealed(true), 500);
            return () => clearTimeout(timer);
        }
    }, [status]);

    return (
        <div className="w-full max-w-md mx-auto perspective-1000">
            <motion.div
                initial={false}
                animate={isRevealed ? "revealed" : "hidden"}
                variants={{
                    hidden: { rotateX: 0 },
                    revealed: { rotateX: 0 } // Potential for flip animation if desired
                }}
                className={cn(
                    "relative overflow-hidden rounded-3xl transition-all duration-1000 ease-in-out shadow-2xl",
                    isRevealed ? "bg-black text-white" : "bg-white text-black border border-slate-200"
                )}
            >
                {/* Holographic Header (Visible only when revealed) */}
                <AnimatePresence>
                    {isRevealed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5 }}
                            className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                {/* Top Section: Clinic & Info */}
                <div className="relative z-10 p-6 border-b border-dashed border-current/20">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-50 mb-1">Clinic</p>
                            <h3 className="font-black text-lg tracking-tight uppercase">{clinicName}</h3>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-50 mb-1">Type</p>
                            <span className={cn(
                                "inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm",
                                isRevealed ? "bg-white text-black" : "bg-black text-white"
                            )}>
                                Premium Care
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-50 mb-1">Patient</p>
                            <p className="font-bold text-xl truncate">{patientName}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-50 mb-1">Specialist</p>
                            <p className="font-bold text-lg truncate">{doctor.name}</p>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Visit Details */}
                <div className="relative z-10 p-6 relative">
                    {/* Cutout Notches */}
                    <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-[#f8fafc] -translate-x-1/2 -translate-y-1/2 shadow-inner" />
                    <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-[#f8fafc] translate-x-1/2 -translate-y-1/2 shadow-inner" />

                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <p className="text-3xl font-black tracking-tighter">{time}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Time</p>
                        </div>

                        <div className="flex-1 px-4 flex flex-col items-center">
                            <ShieldCheck className={cn("w-6 h-6 mb-2 transition-colors duration-500", isRevealed ? "text-indigo-400" : "text-slate-300")} />
                            <div className="w-full h-0.5 bg-current/10 relative">
                                <div className={cn("absolute inset-0 bg-current/30 w-1/2 transition-all duration-1000", isRevealed ? "w-full" : "w-1/2")} />
                            </div>
                            <p className="text-[9px] font-black tracking-widest mt-2 uppercase text-center">{procedure}</p>
                        </div>

                        <div className="text-right">
                            <p className="text-3xl font-black tracking-tighter">{date.split('-').slice(1).join('/')}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Date</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-current/5 p-4 rounded-2xl">
                        <MapPin className="w-5 h-5 opacity-50" />
                        <div>
                            <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-50">Suite (Location)</p>
                            <p className="text-xs font-bold leading-tight">{clinicLocation}</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Barcode */}
                <div className="relative z-10 p-6 pt-0">
                    <div className="w-full bg-white p-4 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex-1 h-12 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Code_39_barcode.svg/1200px-Code_39_barcode.svg.png')] bg-cover bg-center opacity-80 mix-blend-multiply" />
                        <div className="text-right">
                            <p className="text-[9px] font-bold text-black uppercase tracking-widest">REF NO.</p>
                            <p className="text-sm font-black text-black font-mono">{appointmentId.slice(0, 8).toUpperCase()}</p>
                        </div>
                    </div>

                    {isRevealed && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex justify-center mt-6"
                        >
                            <span className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-bold uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4" /> Appointment Confirmed
                            </span>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
