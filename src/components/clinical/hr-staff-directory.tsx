"use client";

import { useState } from "react";
import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Users,
    UserPlus,
    Contact,
    FileText,
    CreditCard,
    Briefcase,
    Building2,
    Calendar,
    ArrowUpRight,
    Search,
    MapPin,
    Smartphone,
    Mail,
    Plus,
    X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { IDCardGenerator } from "./id-card-generator";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export interface HRStaffProfile {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    employeeId: string;
    joiningDate: string;
    bloodGroup?: string;
    aadhaarNumber?: string;
    panNumber?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    status: "ON_DUTY" | "OFF_DUTY" | "ON_BREAK";
    photoUrl?: string;
}

const MOCK_HR_STAFF: HRStaffProfile[] = [
    {
        id: "1",
        name: "Dr. Dhivakaran",
        role: "Chief Dental Surgeon",
        email: "dhiva@nobledental.com",
        phone: "+91 98765 43210",
        employeeId: "NOBLE-DOCTOR-001",
        joiningDate: "2023-01-15",
        status: "ON_DUTY",
        bloodGroup: "O+",
        aadhaarNumber: "**** **** 4567",
        panNumber: "ABCDE1234F"
    },
    {
        id: "2",
        name: "Sarah Andrews",
        role: "Head Receptionist",
        email: "sarah@nobledental.com",
        phone: "+91 98765 00000",
        employeeId: "NOBLE-STAFF-102",
        joiningDate: "2023-06-01",
        status: "OFF_DUTY",
        bloodGroup: "A+",
        aadhaarNumber: "**** **** 8899"
    }
];

export function HRStaffDirectory() {
    const [staff, setStaff] = useState<HRStaffProfile[]>(MOCK_HR_STAFF);
    const [selectedStaff, setSelectedStaff] = useState<HRStaffProfile | null>(null);
    const [isIdCardOpen, setIsIdCardOpen] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);

    return (
        <div className="space-y-10 max-w-7xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                            <Users className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter text-white italic uppercase">Staff Directory</h2>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Human Resources & Identity</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="relative group flex-1 md:w-64">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <Input
                            className="h-14 pl-12 rounded-2xl bg-white border-slate-100 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold"
                            placeholder="Search staff..."
                        />
                    </div>
                    <Button
                        onClick={() => setIsAddingNew(true)}
                        className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black italic uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 gap-3"
                    >
                        <Plus className="w-5 h-5" />
                        Register Staff
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Staff List */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                            {staff.map((member) => (
                                <motion.div
                                    key={member.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={() => setSelectedStaff(member)}
                                    className={cn(
                                        "group cursor-pointer glass-frost transition-all p-6 overflow-hidden relative shadow-2xl border-white/5",
                                        selectedStaff?.id === member.id
                                            ? "border-blue-500 shadow-xl shadow-blue-500/20 ring-1 ring-blue-500/20"
                                            : "hover:border-white/10"
                                    )}
                                >
                                    <div className="space-y-6 relative z-10">
                                        <div className="flex items-start justify-between">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 flex items-center justify-center border-4 border-white shadow-lg">
                                                <Contact className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <Badge className={cn(
                                                "rounded-lg px-2 text-[8px] font-black uppercase tracking-widest border-none text-white",
                                                member.status === 'ON_DUTY' ? "bg-emerald-500" : "bg-slate-300"
                                            )}>
                                                {member.status.replace('_', ' ')}
                                            </Badge>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black text-white italic uppercase">{member.name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Briefcase className="w-3 h-3" /> {member.role}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                                                    <CreditCard className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{member.employeeId.split('-').pop()}</span>
                                            </div>
                                            <Button variant="ghost" className="rounded-xl h-8 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">
                                                Profile <ArrowUpRight className="w-3 h-3 ml-1" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Background Decor */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50 transition-colors" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Profile Detail Side-view */}
                <div className="lg:col-span-4">
                    <AnimatePresence mode="wait">
                        {selectedStaff ? (
                            <motion.div
                                key={selectedStaff.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8 sticky top-8"
                            >
                                <PanzeCard className="p-8 space-y-8 rounded-[3rem] border-slate-100 shadow-2xl shadow-indigo-500/5">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 flex items-center justify-center border-4 border-white shadow-xl relative mt-4">
                                            <Contact className="w-10 h-10 text-indigo-200" />
                                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-2 border-4 border-white shadow-lg">
                                                <Smartphone className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <h3 className="text-2xl font-black italic tracking-tighter text-slate-900">{selectedStaff.name}</h3>
                                            <Badge variant="outline" className="rounded-full px-4 text-[9px] font-black uppercase tracking-widest border-indigo-100 text-indigo-600 bg-indigo-50/30">
                                                {selectedStaff.role}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all cursor-default">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                    <CreditCard className="w-5 h-5 text-indigo-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Employee ID</p>
                                                    <p className="text-xs font-black text-slate-800 tracking-widest">{selectedStaff.employeeId}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all cursor-default">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                    <Calendar className="w-5 h-5 text-emerald-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Joining Date</p>
                                                    <p className="text-xs font-black text-slate-800">{selectedStaff.joiningDate}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-slate-50">
                                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Credentials & Compliance</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-slate-50 rounded-2xl">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Aadhaar</p>
                                                    <p className="text-[10px] font-black text-slate-600 mt-1">{selectedStaff.aadhaarNumber || 'NOT UPDATED'}</p>
                                                </div>
                                                <div className="p-4 bg-slate-50 rounded-2xl">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">PAN Card</p>
                                                    <p className="text-[10px] font-black text-slate-600 mt-1">{selectedStaff.panNumber || 'NOT UPDATED'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 pt-6">
                                            <Button
                                                onClick={() => setIsIdCardOpen(true)}
                                                className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 shadow-xl shadow-indigo-100 gap-3"
                                            >
                                                <FileText className="w-4 h-4" />
                                                Generate ID Card
                                            </Button>
                                            <Button variant="ghost" className="w-full h-14 rounded-2xl text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50">
                                                Update Documents
                                            </Button>
                                        </div>
                                    </div>
                                </PanzeCard>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-40 grayscale">
                                <Building2 className="w-20 h-20 text-slate-300 animate-pulse" />
                                <div className="space-y-1">
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Profile Viewer</p>
                                    <p className="text-[10px] font-bold text-slate-400">Select a staff member from the directory to view details.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ID Card Modal */}
            <Dialog open={isIdCardOpen} onOpenChange={setIsIdCardOpen}>
                <DialogContent className="max-w-[480px] rounded-[3rem] p-8 overflow-hidden border-none shadow-2xl bg-white">
                    {selectedStaff && (
                        <IDCardGenerator
                            staff={{
                                name: selectedStaff.name,
                                role: selectedStaff.role,
                                id: selectedStaff.employeeId,
                                phone: selectedStaff.phone,
                                joiningDate: selectedStaff.joiningDate,
                                bloodGroup: selectedStaff.bloodGroup || 'N/A'
                            }}
                            onDownload={() => setIsIdCardOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
