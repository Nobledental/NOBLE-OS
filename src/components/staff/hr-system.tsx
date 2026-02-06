"use client";

import { useState } from "react";
import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, FileText, CreditCard, Landmark, GraduationCap, Award, ChevronRight, Plus, Download, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IDCardGenerator } from "./id-card-generator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface StaffData {
    id: string;
    name: string;
    role: string;
    aadhaar: string;
    pan: string;
    bankAccount: string;
    education: { degree: string, year: string, institution: string }[];
    employeeId: string;
    photoUrl?: string;
}

export function StaffHRModule() {
    const [step, setStep] = useState(1);
    const [showIDCard, setShowIDCard] = useState(false);
    const [staffData, setStaffData] = useState<StaffData>({
        id: "new",
        name: "",
        role: "DOCTOR",
        aadhaar: "",
        pan: "",
        bankAccount: "",
        education: [{ degree: "", year: "", institution: "" }],
        employeeId: `NB-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`,
    });

    const handleOnboard = () => {
        toast.success("Staff Onboarded!", {
            description: `Employee ID ${staffData.employeeId} has been successfully created and registered.`
        });
        setShowIDCard(true);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Onboarding Form */}
            <div className="lg:col-span-12">
                <AnimatePresence mode="wait">
                    {!showIDCard ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <PanzeCard className="max-w-4xl mx-auto">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Staff Onboarding</h2>
                                        <p className="text-slate-500 text-sm">Follow the 3-step KYC & documentation process.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {[1, 2, 3].map(s => (
                                            <div key={s} className={cn(
                                                "w-10 h-2 rounded-full transition-all duration-500",
                                                step >= s ? "bg-indigo-600" : "bg-slate-100"
                                            )} />
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {step === 1 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                                                <Input
                                                    placeholder="Dr. John Doe"
                                                    value={staffData.name}
                                                    onChange={(e) => setStaffData({ ...staffData, name: e.target.value })}
                                                    className="h-14 rounded-2xl bg-slate-50 border-slate-100 px-6 font-medium focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Designation</label>
                                                <select
                                                    className="w-full h-14 rounded-2xl bg-slate-50 border-slate-100 px-6 font-medium focus:ring-indigo-500 outline-none"
                                                    value={staffData.role}
                                                    onChange={(e) => setStaffData({ ...staffData, role: e.target.value })}
                                                >
                                                    <option>DOCTOR</option>
                                                    <option>RECEPTIONIST</option>
                                                    <option>ASSISTANT</option>
                                                    <option>CONSULTANT</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                                                    <CreditCard className="w-4 h-4" /> KYC Verification
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Input placeholder="Aadhaar Number (12 Digits)" className="h-14 rounded-2xl" value={staffData.aadhaar} onChange={e => setStaffData({ ...staffData, aadhaar: e.target.value })} />
                                                    <Input placeholder="PAN Number" className="h-14 rounded-2xl" value={staffData.pan} onChange={e => setStaffData({ ...staffData, pan: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                                                <Landmark className="w-4 h-4" /> Bank Account Details
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input placeholder="Account Number" className="h-14 rounded-2xl" value={staffData.bankAccount} onChange={e => setStaffData({ ...staffData, bankAccount: e.target.value })} />
                                                <Input placeholder="IFSC Code" className="h-14 rounded-2xl" />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input placeholder="Bank Name" className="h-14 rounded-2xl" />
                                                <Input placeholder="Branch Name" className="h-14 rounded-2xl" />
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                                                    <GraduationCap className="w-4 h-4" /> Educational Documents
                                                </div>
                                                <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 h-8 px-2">
                                                    <Plus className="w-4 h-4 mr-1" /> Add Degree
                                                </Button>
                                            </div>
                                            {staffData.education.map((edu, i) => (
                                                <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 rounded-2xl bg-white shadow-sm">
                                                            <Award className="w-6 h-6 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">BDS / MDS (Orthodontics)</p>
                                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">AIIMS Delhi • 2021</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" className="rounded-xl border-slate-200">
                                                            <Eye className="w-4 h-4 mr-2" /> View
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="rounded-xl border-slate-200">
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center">
                                                <FileText className="w-10 h-10 text-slate-300 mb-2" />
                                                <p className="text-sm font-bold text-slate-500">Drag & Drop PG Certificate</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">PDF, JPG up to 10MB</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                                        <Button
                                            variant="ghost"
                                            onClick={() => step > 1 ? setStep(step - 1) : null}
                                            disabled={step === 1}
                                            className="h-14 px-8 rounded-2xl text-slate-500 font-bold"
                                        >
                                            Back
                                        </Button>
                                        {step < 3 ? (
                                            <Button
                                                onClick={() => setStep(step + 1)}
                                                className="h-14 px-10 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-bold"
                                            >
                                                Continue <ChevronRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleOnboard}
                                                className="h-14 px-10 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 font-black shadow-lg shadow-indigo-200"
                                            >
                                                GENERATE EMPLOYEE PASS
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </PanzeCard>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idcard"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center justify-center"
                        >
                            <IDCardGenerator
                                name={staffData.name || "Dr. Dhivakaran"}
                                role={staffData.role}
                                employeeId={staffData.employeeId}
                                clinicName="NOBLE DENTAL"
                            />
                            <div className="flex gap-4 mt-8">
                                <Button onClick={() => setShowIDCard(false)} variant="outline" className="h-14 px-8 rounded-2xl font-bold">
                                    Edit Registration
                                </Button>
                                <Button className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-bold">
                                    Print Physical Card
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
