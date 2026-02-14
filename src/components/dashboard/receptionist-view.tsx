"use client";

import { motion } from "framer-motion";
import { ActiveQueue } from "./active-queue";
import { RevenueChart } from "./revenue-chart";
import { QuickBookingWidget } from "./quick-booking-widget";
import { PanzeCard } from "@/components/ui/panze-card";
import { Receipt, Calendar, Users, Wallet } from "lucide-react";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
};

export function ReceptionistDashboardView() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
            {/* Appointment & Flow Focus */}
            <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <PanzeCard className="p-4 flex flex-col items-center justify-center text-center gap-1 border-t-4 border-green-500">
                        <Users className="w-6 h-6 text-green-500" />
                        <span className="text-xl font-bold">24</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Booked</span>
                    </PanzeCard>
                    <PanzeCard className="p-4 flex flex-col items-center justify-center text-center gap-1 border-t-4 border-blue-500">
                        <Calendar className="w-6 h-6 text-blue-500" />
                        <span className="text-xl font-bold">18</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Arrived</span>
                    </PanzeCard>
                    <PanzeCard className="p-4 flex flex-col items-center justify-center text-center gap-1 border-t-4 border-orange-500">
                        <Receipt className="w-6 h-6 text-orange-500" />
                        <span className="text-xl font-bold">5</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Bills Pending</span>
                    </PanzeCard>
                    <PanzeCard className="p-4 flex flex-col items-center justify-center text-center gap-1 border-t-4 border-purple-500">
                        <Wallet className="w-6 h-6 text-purple-500" />
                        <span className="text-xl font-bold">₹12k</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Daily Cash</span>
                    </PanzeCard>
                </div>

                {/* Quick Booking Widget */}
                <QuickBookingWidget />

                <ActiveQueue />
            </motion.div>

            {/* Billing & Settlement Updates */}
            <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
                <RevenueChart />

                <PanzeCard className="p-6 bg-slate-900 text-white">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                        <Receipt className="w-5 h-5" />
                        Pending Settlements
                    </h4>
                    <div className="space-y-4">
                        {[
                            { name: "John Doe", amount: "₹2,500", time: "10 mins ago" },
                            { name: "Alice Smith", amount: "₹4,200", time: "25 mins ago" },
                        ].map((bill, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-white/10 pb-2">
                                <div>
                                    <div className="text-sm font-medium">{bill.name}</div>
                                    <div className="text-[10px] text-slate-400">{bill.time}</div>
                                </div>
                                <div className="font-bold text-green-400">{bill.amount}</div>
                            </div>
                        ))}
                    </div>
                </PanzeCard>
            </motion.div>
        </div>
    );
}
