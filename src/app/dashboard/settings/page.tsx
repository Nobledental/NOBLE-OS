"use client";

import { BridgeHub } from "@/components/settings/bridge-hub";
import { PanzeCard } from "@/components/ui/panze-card";
import { User, Shield, Bell, Cloud, Laptop, HelpCircle } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold font-display text-slate-900">Clinic Settings</h2>
                <p className="text-slate-500">Manage integrations, devices, and profile.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar Navigation (Mock) */}
                <div className="space-y-2">
                    {[
                        { label: "Profile", icon: User },
                        { label: "Security", icon: Shield },
                        { label: "Integrations", icon: Cloud, active: true },
                        { label: "Devices", icon: Laptop },
                        { label: "Notifications", icon: Bell },
                        { label: "Help Center", icon: HelpCircle },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-colors ${item.active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="md:col-span-3 space-y-6">
                    {/* Bridge Hub Section */}
                    <PanzeCard>
                        <BridgeHub />
                    </PanzeCard>
                </div>
            </div>
        </div>
    );
}
