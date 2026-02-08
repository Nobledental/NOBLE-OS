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
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Users className="w-6 h-6" />
                    </div>
                    Staff Management
                </h1>
                <p className="text-slate-500 font-medium ml-14">
                    Manage clinic staff, onboarding, and generate official ID cards.
                </p>
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
