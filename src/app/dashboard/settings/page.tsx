"use client";

import { useState } from "react";
import { BridgeHub } from "@/components/settings/bridge-hub";
import { BillingSettings } from "@/components/settings/billing-settings";
import { StaffSettings } from "@/components/settings/staff-settings"; // Added
import { PanzeCard } from "@/components/ui/panze-card";
import { User, Shield, Bell, Cloud, Laptop, HelpCircle, CreditCard, Users } from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("Integrations");

    const menuItems = [
        { label: "Profile", icon: User },
        { label: "Security", icon: Shield },
        { label: "Staff Access", icon: Users }, // Added
        { label: "Integrations", icon: Cloud },
        { label: "Billing", icon: CreditCard },
        { label: "Devices", icon: Laptop },
        { label: "Notifications", icon: Bell },
        { label: "Help Center", icon: HelpCircle },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold font-display text-slate-900">Clinic Settings</h2>
                <p className="text-slate-500">Manage staff access, billing, and profile.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => setActiveTab(item.label)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-colors ${activeTab === item.label ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="md:col-span-3 space-y-6">
                    {activeTab === "Integrations" && (
                        <PanzeCard>
                            <BridgeHub />
                        </PanzeCard>
                    )}

                    {activeTab === "Billing" && (
                        <BillingSettings />
                    )}

                    {activeTab === "Staff Access" && (
                        <StaffSettings />
                    )}

                    {/* Placeholders for other tabs */}
                    {!["Integrations", "Billing", "Staff Access"].includes(activeTab) && (
                        <PanzeCard className="p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Laptop className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Coming Soon</h3>
                            <p className="text-slate-500">This settings module is under development.</p>
                        </PanzeCard>
                    )}
                </div>
            </div>
        </div>
    );
}
