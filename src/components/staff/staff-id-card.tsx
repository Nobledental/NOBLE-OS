"use client";

import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Printer, X } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface StaffIdCardProps {
    staff: any;
    onClose: () => void;
}

export function StaffIdCard({ staff, onClose }: StaffIdCardProps) {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `ID_CARD_${staff.id}`,
    });

    // Determine colors based on role
    const getTheme = (role: string) => {
        if (role?.includes("Doctor") || role?.includes("Consultant")) return { from: "from-sky-500", to: "to-sky-700", border: "border-sky-500", text: "text-sky-700", bg: "bg-sky-50" };
        if (role?.includes("Nurse")) return { from: "from-pink-500", to: "to-pink-700", border: "border-pink-500", text: "text-pink-700", bg: "bg-pink-50" };
        if (role?.includes("Admin")) return { from: "from-slate-700", to: "to-slate-900", border: "border-slate-700", text: "text-slate-700", bg: "bg-slate-50" };
        return { from: "from-indigo-500", to: "to-indigo-700", border: "border-indigo-500", text: "text-indigo-700", bg: "bg-indigo-50" };
    };

    const theme = getTheme(staff.role);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
                {/* Close Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                    onClick={onClose}
                >
                    <X className="w-5 h-5" />
                </Button>

                {/* Printable Area */}
                <div ref={componentRef} className="print:m-0 print:p-0 print:w-full print:h-full">
                    <div className="w-[320px] mx-auto bg-white overflow-hidden shadow-xl rounded-2xl print:shadow-none print:w-full print:rounded-none user-select-none">
                        {/* Header */}
                        <div className={`h-32 bg-gradient-to-br ${theme.from} ${theme.to} relative flex flex-col items-center justify-center text-white`}>
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <div className="z-10 flex flex-col items-center">
                                {/* Logo Placeholder */}
                                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center mb-2">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold tracking-widest uppercase">NOBLE DENTAL</h2>
                                <p className="text-[10px] uppercase tracking-[0.2em] opacity-80 mt-1">Official Identity Card</p>
                            </div>
                        </div>

                        {/* Photo Overlap */}
                        <div className="relative -mt-12 flex justify-center mb-4">
                            <div className={`p-1 bg-white rounded-full`}>
                                <Avatar className={`w-28 h-28 border-4 ${theme.border}`}>
                                    <AvatarImage src={staff.image} />
                                    <AvatarFallback className="text-2xl font-bold bg-slate-100">{staff.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="text-center px-6 pb-8">
                            <h1 className="text-2xl font-bold text-slate-800 mb-1">{staff.name}</h1>

                            <div className={`inline-block px-3 py-1 rounded-full ${theme.bg} ${theme.text} text-xs font-bold uppercase tracking-wider mb-6`}>
                                {staff.role}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-left border-t border-slate-100 pt-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ID Number</p>
                                    <p className="text-sm font-bold text-slate-700">{staff.id}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Blood Group</p>
                                    <p className="text-sm font-bold text-slate-700">O+ <span className="text-[10px] font-normal text-slate-400">(Verified)</span></p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Department</p>
                                    <p className="text-sm font-bold text-slate-700">{staff.dept}</p>
                                </div>
                            </div>

                            {/* Verification Footer (QR) */}
                            <div className="mt-8 flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <div className="text-left">
                                    <p className="text-[10px] text-slate-400">Card Validity</p>
                                    <p className="text-xs font-bold text-slate-700">Dec 2026</p>
                                </div>
                                {/* Placeholder QR Code */}
                                <div className="bg-white p-1 rounded border border-slate-200">
                                    <div className="w-10 h-10 bg-slate-900" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center print:hidden">
                    <p className="text-xs text-slate-500">Ready to print (CR-80 Standard)</p>
                    <Button onClick={() => handlePrint()} className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                        <Printer className="w-4 h-4" />
                        Print ID Card
                    </Button>
                </div>
            </div>
        </div>
    );
}
