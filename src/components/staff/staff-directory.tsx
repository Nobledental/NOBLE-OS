"use client";

import { useState } from "react";
import { PanzeCard } from "@/components/ui/panze-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    Phone,
    Mail,
    MapPin,
    QrCode,
    IdCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock Data (will be replaced with real data later)
const MOCK_STAFF = [
    {
        id: "STF-001",
        name: "Dr. Sarah Wilson",
        role: "Consultant",
        dept: "Orthodontics",
        phone: "+91 98765 43210",
        email: "sarah.w@noble.com",
        status: "Active",
        image: "https://i.pravatar.cc/150?u=STF001",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100"
    },
    {
        id: "STF-002",
        name: "Sr. Emily Davis",
        role: "Head Nurse",
        dept: "General",
        phone: "+91 98765 12345",
        email: "emily.d@noble.com",
        status: "Active",
        image: "https://i.pravatar.cc/150?u=STF002",
        color: "text-pink-600",
        bg: "bg-pink-50",
        border: "border-pink-100"
    },
    {
        id: "STF-003",
        name: "Mr. Raj Patel",
        role: "Admin",
        dept: "Operations",
        phone: "+91 98765 67890",
        email: "raj.p@noble.com",
        status: "On Leave",
        image: "https://i.pravatar.cc/150?u=STF003",
        color: "text-slate-600",
        bg: "bg-slate-50",
        border: "border-slate-100"
    },
    {
        id: "STF-004",
        name: "Dr. James Carter",
        role: "Duty Doctor",
        dept: "General",
        phone: "+91 98765 54321",
        email: "james.c@noble.com",
        status: "Active",
        image: "https://i.pravatar.cc/150?u=STF004",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100"
    }
];

interface StaffDirectoryProps {
    onAddStaff: () => void;
    onViewId: (staff: any) => void;
}

export function StaffDirectory({ onAddStaff, onViewId }: StaffDirectoryProps) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const filteredStaff = MOCK_STAFF.filter(staff =>
        (filter === "All" || staff.role.includes(filter)) &&
        (staff.name.toLowerCase().includes(search.toLowerCase()) ||
            staff.id.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* Editorial Header / Toolbar */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-slate-950/40 backdrop-blur-[40px] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-2xl">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                        placeholder="Search personnel..."
                        className="pl-12 h-14 border-white/10 bg-white/[0.05] text-white placeholder:text-white/40 rounded-2xl focus:bg-white/[0.08] transition-all duration-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Button variant="ghost" className="h-14 px-8 rounded-2xl bg-white/[0.05] border border-white/10 text-white/60 hover:text-white hover:bg-white/10 gap-3 transition-all duration-700">
                        <Filter className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Filters</span>
                    </Button>
                    <Button onClick={onAddStaff} className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 gap-3 shadow-[0_0_40px_rgba(255,255,255,0.02)] transition-all duration-700">
                        <Plus className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Onboard Staff</span>
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredStaff.map((staff) => (
                        <motion.div
                            key={staff.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                        >
                            <PanzeCard className="relative overflow-hidden group bg-slate-950/40 backdrop-blur-[60px] border border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 min-h-[420px] flex flex-col transition-all duration-1000 hover:border-white/20 hover:bg-black/40 shadow-2xl">
                                {/* Silk Glow Effects */}
                                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_85%_0%,_rgba(59,130,246,0.03)_0%,_transparent_75%)] pointer-events-none" />

                                <div className="flex justify-between items-start mb-10 relative z-10">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-[1px] bg-blue-500/60" />
                                            <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/60">{staff.dept}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{staff.role}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-white/10 hover:text-white/40 hover:bg-white/5 rounded-xl transition-all">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex flex-col items-center text-center mb-10 relative z-10">
                                    <div className="relative mb-6">
                                        <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                        <Avatar className="w-24 h-24 md:w-28 md:h-28 border border-white/20 shadow-2xl relative z-10">
                                            <AvatarImage src={staff.image} />
                                            <AvatarFallback className="bg-white/10 text-white/60">{staff.name.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-4 border-slate-950 z-20 ${staff.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]'}`} />
                                    </div>
                                    <h3 className="font-semibold text-2xl text-white tracking-tight mb-2">{staff.name}</h3>
                                    <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[9px] font-bold text-white/60 uppercase tracking-[0.3em]">
                                        {staff.id}
                                    </div>
                                </div>

                                <div className="mt-auto space-y-3 relative z-10">
                                    <div className="flex items-center justify-between text-[11px] text-white/70 font-medium p-4 rounded-2xl bg-white/[0.05] border border-white/10 group-hover:border-white/20 transition-all duration-700">
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-3.5 h-3.5 opacity-60" />
                                            <span>{staff.phone}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-white/70 font-medium p-4 rounded-2xl bg-white/[0.05] border border-white/10 group-hover:border-white/20 transition-all duration-700">
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-3.5 h-3.5 opacity-60" />
                                            <span className="truncate">{staff.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    className="w-full h-14 mt-8 rounded-2xl bg-blue-500/[0.03] hover:bg-blue-500/[0.08] text-blue-400/60 hover:text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em] gap-3 border border-blue-500/10 transition-all duration-700"
                                    onClick={() => onViewId(staff)}
                                >
                                    <IdCard className="w-4 h-4" />
                                    Access Identity
                                </Button>
                            </PanzeCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
