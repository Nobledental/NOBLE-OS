"use client";

import { useState } from "react";
import Link from "next/link";
import { PanzeCard } from "@/components/ui/panze-card";
import { Badge } from "@/components/ui/badge";
import {
    Building2,
    Stethoscope,
    Armchair,
    Receipt,
    ShieldCheck,
    Settings2,
    ChevronRight,
    Lock,
    Briefcase,
    Activity,
    Users,
    Cpu,
    CreditCard,
    Package,
    Calendar,
    X,
    ArrowLeft,
    ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Settings Components
import { StaffSettings } from "@/components/settings/staff-settings";
import { BillingSettings } from "@/components/settings/billing-settings";
import UniversalBridgeHub from "@/components/clinical/universal-bridge-hub";
import { ClinicBrandingSettings } from "@/components/settings/clinic-branding-settings";
import { InventoryHub } from "@/components/inventory/inventory-hub";
import { SterilizationHub } from "@/components/clinical/sterilization-hub";
import { AppointmentsHub } from "@/components/dashboard/appointments-hub";
import { ClinicSchedulingSettings } from "@/components/settings/clinic-scheduling-settings";
import { ClinicalMasterHub } from "@/components/clinical/clinical-master-hub";
import { TariffMasterHub } from "@/components/finance/tariff-master-hub";
import { SettlementLedgerHub } from "@/components/finance/settlement-ledger-hub";
import { ChairManagementHub } from "@/components/admin/chair-management-hub";
import { cn } from "@/lib/utils";

interface ManagementFeature {
    title: string;
    subtitle: string;
    icon: any;
    chip: string;
    accent: string;
    category: 'Operations' | 'Finance' | 'Growth' | 'Security' | 'Safety';
    glow?: string;
    href?: string;
    action?: string;
    badge?: string;
    locked?: boolean;
}

const MANAGEMENT_FEATURES: ManagementFeature[] = [
    // 1. Operations Workstream (Arctic Blue)
    {
        title: "Patient Queue",
        subtitle: "Live Clinic Flow",
        icon: Activity,
        chip: "Queue",
        accent: "text-blue-400",
        glow: "blue-500",
        category: "Operations",
        action: "QUEUE"
    },
    {
        title: "Scheduling",
        subtitle: "Hours & Sessions",
        icon: Calendar,
        chip: "Time",
        accent: "text-blue-400",
        glow: "blue-400",
        category: "Operations",
        action: "SCHEDULING"
    },
    {
        title: "Departments",
        subtitle: "Clinical Units",
        icon: Stethoscope,
        chip: "Structure",
        accent: "text-blue-400",
        glow: "blue-500",
        category: "Operations",
        action: "DEPARTMENTS"
    },
    {
        title: "Dental Chairs",
        subtitle: "Chair Utilization",
        icon: Armchair,
        chip: "Assets",
        accent: "text-blue-400",
        glow: "blue-400",
        category: "Operations",
        action: "CHAIRS"
    },

    // 2. Finance Workstream (Champagne Gold)
    {
        title: "Tariff Master",
        subtitle: "Cost Architecture",
        icon: Receipt,
        chip: "Price",
        accent: "text-amber-200",
        glow: "amber-500",
        category: "Finance",
        action: "TARIFF"
    },
    {
        title: "Specialists",
        subtitle: "Settlement Ledger",
        icon: Briefcase,
        chip: "Finance",
        accent: "text-amber-200",
        glow: "amber-500",
        category: "Finance",
        action: "SPECIALISTS"
    },
    {
        title: "Billing Hub",
        subtitle: "UPI & Statements",
        icon: CreditCard,
        chip: "Gateway",
        accent: "text-amber-200",
        glow: "amber-500",
        category: "Finance",
        action: "BILLING"
    },

    // 3. Growth & Intelligence (Soft Emerald)
    {
        title: "Clinic Identity",
        subtitle: "Branding & SEO",
        icon: Building2,
        chip: "Brand",
        accent: "text-emerald-400",
        glow: "emerald-500",
        category: "Growth",
        action: "IDENTITY",
        badge: "V2"
    },
    {
        title: "Integration Hub",
        subtitle: "Radiology & Sync",
        icon: Cpu,
        chip: "Cloud",
        accent: "text-emerald-400",
        glow: "emerald-500",
        category: "Growth",
        action: "INTEGRATIONS"
    },

    // 4. Infrastructure & Security (Silver Silk)
    {
        title: "Staff Access",
        subtitle: "Roles & Security",
        icon: Users,
        chip: "Security",
        accent: "text-slate-400",
        glow: "white",
        category: "Security",
        action: "STAFF"
    },
    {
        title: "Workflow Config",
        subtitle: "Global Controls",
        icon: ShieldCheck,
        chip: "Workflow",
        accent: "text-slate-400",
        glow: "white",
        category: "Security",
        action: "WORKFLOW"
    },
    {
        title: "Inventory",
        subtitle: "Supply Chain",
        icon: Package,
        chip: "Storage",
        accent: "text-slate-400",
        glow: "white",
        category: "Security",
        action: "INVENTORY",
        locked: false
    },
    {
        title: "Sterilization",
        subtitle: "Safety Registry",
        icon: ShieldCheck,
        chip: "Safety",
        accent: "text-emerald-400",
        glow: "emerald-500",
        category: "Safety",
        action: "STERILIZATION",
        locked: false
    }
];

// Map actions to full page routes
const ACTION_ROUTES: Record<string, string> = {
    "STERILIZATION": "/dashboard/sterilization",
    "BILLING": "/dashboard/billing",
    "STAFF": "/dashboard/staff", // Updated to point to dedicated staff page
    "QUEUE": "/dashboard/appointments",
    "SCHEDULING": "/dashboard/settings/scheduling",
    "DEPARTMENTS": "/dashboard/clinical",
    "TARIFF": "/dashboard/tariff",
    "SPECIALISTS": "/dashboard/settlement",
    "CHAIRS": "/dashboard/admin/chairs", // Placeholder route
    "WORKFLOW": "/dashboard/admin/workflow", //Placeholder route
};

export function ClinicManagementDeck() {
    const [activeAction, setActiveAction] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            {/* Premium Uniform Grid - Mobile Optimized */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-3 pb-6">
                {MANAGEMENT_FEATURES.map((feature, i) => {
                    const CardContent = (
                        <motion.div
                            whileHover={{ y: -8, scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="h-full cursor-pointer relative group"
                            onClick={() => {
                                // For STAFF, navigate directly to dedicated page
                                if (feature.action === "STAFF" && ACTION_ROUTES["STAFF"]) {
                                    window.location.href = ACTION_ROUTES["STAFF"];
                                } else if (feature.action && !feature.locked) {
                                    setActiveAction(feature.action);
                                }
                            }}
                        >
                            {/* Medizinisch Solid Layer - White Theme */}
                            <div className="bg-white rounded-2xl overflow-hidden relative p-5 h-full flex flex-col min-h-[140px] mb-0 border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group-hover:bg-white">
                                {/* Editorial Header Section */}
                                <div className="flex justify-between items-start relative z-10 mb-5">
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 transition-all duration-700",
                                        feature.accent || "text-slate-400",
                                        `group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white`
                                    )}>
                                        <feature.icon className="w-4 h-4 md:w-5 md:h-5 opacity-70 group-hover:opacity-100" />
                                    </div>

                                    <div className="flex flex-col items-end gap-1.5 opacity-60">
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">{feature.category}</span>
                                        {feature.locked ? (
                                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                                <Lock className="w-2.5 h-2.5" />
                                            </div>
                                        ) : feature.badge && (
                                            <div className="bg-indigo-600 border border-indigo-500 text-[8px] uppercase font-black tracking-[0.3em] px-3 py-1 rounded-full text-white shadow-lg shadow-indigo-500/20">
                                                {feature.badge}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Typography Unified Content */}
                                <div className="mt-auto relative z-10 flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 ring-2 ring-blue-500/20" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{feature.chip}</span>
                                    </div>
                                    <h3 className="text-[16px] font-bold tracking-tight text-slate-900 mb-0.5 group-hover:text-indigo-600 transition-colors duration-500">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                                        {feature.subtitle}
                                    </p>

                                    {/* Medical Mini-Chart Indicator (Refined) */}
                                    <div className="mt-6 flex items-end gap-1 h-6 opacity-40 group-hover:opacity-100 transition-all duration-1000">
                                        {[0.3, 0.5, 0.3, 0.8, 0.4, 0.6, 0.3].map((h, idx) => (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    "w-[3px] rounded-full transition-all duration-500",
                                                    idx === 3 ? "bg-indigo-500" : "bg-slate-200"
                                                )}
                                                style={{ height: `${h * 100}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Premium Silk Trail Animation (Subtle) */}
                                {!feature.locked && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <motion.div
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '100%' }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            className="w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );

                    if (feature.href && !feature.action) {
                        return (
                            <Link key={i} href={feature.locked ? "#" : feature.href} className={feature.locked ? "cursor-not-allowed opacity-40" : ""}>
                                {CardContent}
                            </Link>
                        );
                    }

                    return (
                        <div key={i} className={feature.locked ? "cursor-not-allowed opacity-40" : ""}>
                            {CardContent}
                        </div>
                    );
                })}
            </div>

            {/* Action Dialogs */}
            <Dialog open={!!activeAction} onOpenChange={(open) => !open && setActiveAction(null)}>
                <DialogContent className="max-w-[85vw] md:max-w-[70vw] h-[90vh] md:h-[85vh] p-0 rounded-3xl md:rounded-[3rem] overflow-hidden border-none bg-transparent shadow-none">
                    <div className="w-full h-full bg-white shadow-2xl rounded-3xl md:rounded-[3rem] overflow-y-auto relative animate-in zoom-in-95 duration-300">
                        {/* Header Controls */}
                        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-3">
                            {/* Open in Full Page Button */}
                            {activeAction && ACTION_ROUTES[activeAction] && (
                                <Link href={ACTION_ROUTES[activeAction]}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        Open Full Page
                                    </Button>
                                </Link>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={() => setActiveAction(null)}
                                className="p-2 md:p-3 bg-slate-900/5 hover:bg-slate-900/10 rounded-full text-slate-400 transition-all"
                            >
                                <X className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>

                        <div className="p-6 md:p-12">
                            {/* Inner Back Button for Dialog Context */}
                            <Button
                                variant="ghost"
                                onClick={() => setActiveAction(null)}
                                className="mb-8 text-slate-400 hover:text-slate-900 gap-2 px-0 hover:bg-transparent font-bold uppercase tracking-widest text-[10px]"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                            </Button>

                            {/* Staff now navigates to dedicated page - no dialog needed */}
                            {activeAction === "BILLING" && <BillingSettings />}
                            {activeAction === "INTEGRATIONS" && <UniversalBridgeHub />}
                            {activeAction === "IDENTITY" && <ClinicBrandingSettings onSave={() => setActiveAction(null)} />}
                            {activeAction === "INVENTORY" && <InventoryHub />}
                            {activeAction === "STERILIZATION" && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <SterilizationHub />
                                </div>
                            )}

                            {activeAction === "QUEUE" && <AppointmentsHub />}
                            {activeAction === "SCHEDULING" && <ClinicSchedulingSettings />}
                            {activeAction === "DEPARTMENTS" && <ClinicalMasterHub />}
                            {activeAction === "TARIFF" && <TariffMasterHub />}
                            {activeAction === "SPECIALISTS" && <SettlementLedgerHub />}

                            {activeAction === "CHAIRS" && <ChairManagementHub />}

                            {/* Fallback & Placeholders */}
                            {["WORKFLOW"].includes(activeAction!) && (
                                <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-10">
                                    <div className="relative">
                                        <div className="absolute -inset-10 bg-blue-500/5 rounded-full blur-3xl" />
                                        <div className="w-24 h-24 md:w-28 md:h-28 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center text-blue-500/40 relative z-10 shadow-xl">
                                            <Settings2 className="w-10 h-10 md:w-12 md:h-12" />
                                        </div>
                                    </div>
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                            <span className="text-[10px] font-bold tracking-[0.6em] text-slate-400 uppercase">Core Logic Layer</span>
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
                                            Workflow <span className="text-slate-400 font-light border-b border-slate-200">Optimization</span>
                                        </h3>
                                        <p className="text-slate-500 text-[11px] font-semibold max-w-xs mx-auto uppercase tracking-widest leading-relaxed">
                                            Clinical engine calibration in progress. System architectural sync scheduled for next deployment cycle.
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button variant="ghost" className="h-14 px-8 rounded-2xl border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-widest transition-all duration-700 shadow-lg">
                                            View Documentation
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
