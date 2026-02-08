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
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search staff by name or ID..."
                        className="pl-10 border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="gap-2 border-slate-200 text-slate-600">
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filter</span>
                    </Button>
                    <Button onClick={onAddStaff} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20">
                        <Plus className="w-4 h-4" />
                        Add Staff
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
                            <PanzeCard className="relative overflow-hidden group hover:shadow-md transition-all duration-300 border-slate-200">
                                <div className={`absolute top-0 left-0 w-full h-1 ${staff.bg.replace('bg-', 'bg-gradient-to-r from-transparent via-')}`} />

                                <div className="flex justify-between items-start mb-4">
                                    <Badge variant="outline" className={`${staff.bg} ${staff.color} border-0 font-semibold`}>
                                        {staff.role}
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-slate-400 hover:text-slate-600">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex flex-col items-center text-center mb-6">
                                    <div className="relative mb-3">
                                        <Avatar className={`w-20 h-20 border-4 ${staff.border} shadow-sm`}>
                                            <AvatarImage src={staff.image} />
                                            <AvatarFallback>{staff.name.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${staff.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-800">{staff.name}</h3>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{staff.id} • {staff.dept}</p>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <span>{staff.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span className="truncate">{staff.email}</span>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full gap-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                                    onClick={() => onViewId(staff)}
                                >
                                    <IdCard className="w-4 h-4" />
                                    View ID Card
                                </Button>
                            </PanzeCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
