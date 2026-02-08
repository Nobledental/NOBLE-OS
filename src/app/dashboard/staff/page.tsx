"use client";

import { useState } from "react";
import { StaffDirectory } from "@/components/staff/staff-directory";
import { AddStaffSheet } from "@/components/staff/add-staff-sheet";
import { StaffIdCard } from "@/components/staff/staff-id-card";
import { Users } from "lucide-react";

export default function StaffPage() {
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
    const [selectedIdCard, setSelectedIdCard] = useState<any>(null);

    return (
        <div className="space-y-12 pb-32">
            {/* Editorial Dark Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                    <span className="text-[10px] font-bold tracking-[0.6em] text-white/20 uppercase">Personnel Command</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white flex items-center gap-6">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.8rem] bg-white/[0.03] border border-white/5 flex items-center justify-center text-blue-400/40 group-hover:bg-blue-500 group-hover:text-black transition-all duration-700 shadow-inner">
                        <Users className="w-7 h-7 md:w-8 md:h-8" />
                    </div>
                    Staff <span className="text-white/10 font-light translate-x-1">Management</span>
                </h1>
            </div>

            {/* Main Directory */}
            <StaffDirectory
                onAddStaff={() => setIsAddSheetOpen(true)}
                onViewId={(staff) => setSelectedIdCard(staff)}
            />

            {/* Components */}
            <AddStaffSheet
                open={isAddSheetOpen}
                onOpenChange={setIsAddSheetOpen}
            />

            {selectedIdCard && (
                <StaffIdCard
                    staff={selectedIdCard}
                    onClose={() => setSelectedIdCard(null)}
                />
            )}
        </div>
    );
}
