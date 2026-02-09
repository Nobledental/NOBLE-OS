"use client";

import { motion } from "framer-motion";
import { PanzeCard } from "@/components/ui/panze-card";
import { Badge } from "@/components/ui/badge";
import { User, QrCode, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface IDCardProps {
    name: string;
    role: string;
    employeeId: string;
    photoUrl?: string;
    clinicName: string;
}

export function IDCardGenerator({ name, role, employeeId, photoUrl, clinicName }: IDCardProps) {
    return (
        <div className="flex flex-col items-center gap-6 p-4">
            <motion.div
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative w-[320px] h-[500px]"
            >
                {/* ID Card Front */}
                <PanzeCard className="w-full h-full p-0 overflow-hidden bg-slate-900 border-0 shadow-2xl flex flex-col">
                    {/* Header Design */}
                    <div className="h-32 bg-gradient-to-br from-indigo-600 to-purple-700 relative flex flex-col items-center justify-center pt-4">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <ShieldCheck className="w-20 h-20 text-white" />
                        </div>
                        <h2 className="text-white font-black tracking-tighter text-xl uppercase">{clinicName}</h2>
                        <span className="text-indigo-100 text-[10px] uppercase font-bold tracking-widest opacity-80">Official Staff Identity</span>
                    </div>

                    {/* Photo Area */}
                    <div className="flex-1 flex flex-col items-center -mt-12 px-6">
                        <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-slate-100 shadow-xl mb-6 relative">
                            {photoUrl ? (
                                <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-12 h-12 text-slate-400" />
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white" />
                        </div>

                        <div className="text-center space-y-2 mb-8">
                            <h3 className="text-2xl font-black text-white leading-tight">{name}</h3>
                            <Badge className="bg-white/10 text-indigo-300 border-white/20 hover:bg-white/20 px-4 py-1">
                                {role}
                            </Badge>
                        </div>

                        <div className="w-full space-y-4 pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 uppercase font-bold tracking-widest">Employee ID</span>
                                <span className="text-white font-mono font-bold">{employeeId}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 uppercase font-bold tracking-widest">Valid Thru</span>
                                <span className="text-white font-bold">DEC 2028</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer / QR */}
                    <div className="h-24 bg-white m-3 rounded-2xl p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Digital Pass</div>
                            <div className="text-xs text-slate-900 font-bold">Authorized Access</div>
                        </div>
                        <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center p-1 border border-slate-100">
                            <QrCode className="w-full h-full text-slate-900" />
                        </div>
                    </div>
                </PanzeCard>
            </motion.div>

            <p className="text-xs text-slate-400 max-w-[200px] text-center">
                NFC-enabled secure digital card. Tap to verify.
            </p>
        </div>
    );
}
