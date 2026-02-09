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
    ArrowLeft
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
        href: "/dashboard/appointments"
    },
    {
        title: "Scheduling",
        subtitle: "Hours & Sessions",
        icon: Calendar,
        chip: "Time",
        accent: "text-blue-400",
        glow: "blue-400",
        category: "Operations",
        href: "/dashboard/settings/scheduling"
    },
    {
        title: "Departments",
        subtitle: "Clinical Units",
        icon: Stethoscope,
        chip: "Structure",
        accent: "text-blue-400",
        glow: "blue-500",
        category: "Operations",
        href: "/dashboard/clinical"
    },
    {
        title: "Dental Chairs",
        subtitle: "Chair Utilization",
        icon: Armchair,
        chip: "Assets",
        accent: "text-blue-400",
        glow: "blue-400",
        category: "Operations",
        href: "/dashboard/admin/chairs"
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
        href: "/dashboard/tariff"
    },
    {
        title: "Specialists",
        subtitle: "Settlement Ledger",
        icon: Briefcase,
        chip: "Finance",
        accent: "text-amber-200",
        glow: "amber-500",
        category: "Finance",
        href: "/dashboard/settlement"
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

export function ClinicManagementDeck() {
    const [activeAction, setActiveAction] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            {/* Premium Uniform Grid - Mobile Optimized */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-12">
                {MANAGEMENT_FEATURES.map((feature, i) => {
                    const CardContent = (
                        <motion.div
                            whileHover={{ y: -8, scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="h-full cursor-pointer relative group"
                            onClick={() => feature.action && !feature.locked && setActiveAction(feature.action)}
                        >
                            {/* Silk Edge Ambient Glow (Performance Reactive) */}
                            <div className={cn(
                                "absolute -inset-[2px] rounded-[1.8rem] opacity-0 group-hover:opacity-100 blur-[2px] transition-all duration-1000 -z-10",
                                feature.category === 'Finance' ? "bg-amber-500/20" :
                                    feature.category === 'Growth' ? "bg-emerald-500/20" :
                                        "bg-[#0A84FF]/20"
                            )} />
                            <div className={cn(
                                "absolute -inset-6 rounded-[3rem] opacity-0 group-hover:opacity-100 blur-[60px] transition-all duration-1000 -z-10",
                                feature.category === 'Finance' ? "bg-amber-500/5" :
                                    feature.category === 'Growth' ? "bg-emerald-500/5" :
                                        "bg-[#0A84FF]/5"
                            )} />

                            {/* Medizinisch Dark Glass Layer */}
                            <div className="glass-frost rounded-[1.8rem] overflow-hidden relative p-5 h-full flex flex-col min-h-[180px] mb-0 border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transition-all duration-1000 group-hover:border-white/15 group-hover:bg-white/[0.04]">
                                {/* Editorial Header Section */}
                                <div className="flex justify-between items-start relative z-10 mb-8">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10 transition-all duration-700 shadow-inner",
                                        feature.accent || "text-white/30",
                                        `group-hover:scale-110 group-hover:bg-indigo-500/30 group-hover:text-white`
                                    )}>
                                        <feature.icon className="w-4 h-4 md:w-5 md:h-5 opacity-70 group-hover:opacity-100" />
                                    </div>

                                    <div className="flex flex-col items-end gap-1.5 opacity-60">
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">{feature.category}</span>
                                        {feature.locked ? (
                                            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                                                <Lock className="w-2.5 h-2.5" />
                                            </div>
                                        ) : feature.badge && (
                                            <div className="bg-indigo-600 border border-indigo-500 text-[8px] uppercase font-black tracking-[0.3em] px-3 py-1 rounded-full text-white shadow-xl shadow-indigo-600/20">
                                                {feature.badge}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Typography Unified Content */}
                                <div className="mt-auto relative z-10 flex flex-col gap-1">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]" />
                                        <span className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500">{feature.chip}</span>
                                    </div>
                                    <h3 className="text-[16px] font-bold tracking-tight text-white mb-0.5">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[13px] text-slate-400 font-medium">
                                        {feature.subtitle}
                                    </p>

                                    {/* Medical Mini-Chart Indicator (Refined) */}
                                    <div className="mt-6 flex items-end gap-1 h-6 opacity-30 group-hover:opacity-100 transition-all duration-1000">
                                        {[0.3, 0.5, 0.3, 0.8, 0.4, 0.6, 0.3].map((h, idx) => (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    "w-[3px] rounded-full",
                                                    idx === 3 ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]" : "bg-white/20"
                                                )}
                                                style={{ height: `${h * 100}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Premium Silk Trail Animation */}
                                {!feature.locked && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/5 to-transparent overflow-hidden">
                                        <motion.div
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '100%' }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            className={cn(
                                                "w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.1)]",
                                            )}
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
                    <div className="w-full h-full bg-white glass-white rounded-3xl md:rounded-[3rem] overflow-y-auto relative animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setActiveAction(null)}
                            className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 md:p-3 bg-slate-900/5 hover:bg-slate-900/10 rounded-full text-slate-400 transition-all"
                        >
                            <X className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        <div className="p-6 md:p-12">
                            {/* Inner Back Button for Dialog Context */}
                            <Button
                                variant="ghost"
                                onClick={() => setActiveAction(null)}
                                className="mb-8 text-slate-400 hover:text-slate-900 gap-2 px-0 hover:bg-transparent font-bold uppercase tracking-widest text-[10px]"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                            </Button>

                            {activeAction === "STAFF" && <StaffSettings />}
                            {activeAction === "BILLING" && <BillingSettings />}
                            {activeAction === "INTEGRATIONS" && <UniversalBridgeHub />}
                            {activeAction === "IDENTITY" && <ClinicBrandingSettings onSave={() => setActiveAction(null)} />}
                            {activeAction === "INVENTORY" && <InventoryHub />}
                            {activeAction === "STERILIZATION" && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <SterilizationHub />
                                </div>
                            )}

                            {/* Fallback */}
                            {["WORKFLOW"].includes(activeAction!) && (
                                <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-10">
                                    <div className="relative">
                                        <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-3xl" />
                                        <div className="w-24 h-24 md:w-28 md:h-28 bg-white/[0.03] border border-white/5 rounded-[2rem] flex items-center justify-center text-blue-400/40 relative z-10">
                                            <Settings2 className="w-10 h-10 md:w-12 md:h-12" />
                                        </div>
                                    </div>
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                            <span className="text-[10px] font-bold tracking-[0.6em] text-white uppercase">Core Logic Layer</span>
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-semibold text-white tracking-tight italic">Workflow <span className="text-white font-light border-b border-white/20">Optimization</span></h3>
                                        <p className="text-white text-[11px] font-semibold max-w-xs mx-auto uppercase tracking-widest leading-relaxed">
                                            Clinical engine calibration in progress. System architectural sync scheduled for next deployment cycle.
                                        </p>
                                    </div>
                                    <Button variant="ghost" className="h-14 px-8 rounded-2xl border border-white/30 bg-white/10 text-white hover:bg-white/20 text-[10px] font-bold uppercase tracking-widest transition-all duration-700">
                                        View Documentation
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div >
                </DialogContent>
            </Dialog>
        </div >
    );
}
