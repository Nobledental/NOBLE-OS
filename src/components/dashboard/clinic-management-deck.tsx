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
import { cn } from "@/lib/utils";

interface ManagementFeature {
    title: string;
    subtitle: string;
    icon: any;
    chip: string;
    accent: string;
    category: 'Operations' | 'Finance' | 'Growth' | 'Security';
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
        locked: true
    }
];

export function ClinicManagementDeck() {
    const [activeAction, setActiveAction] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            {/* Premium Uniform Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-10 pb-20">
                {MANAGEMENT_FEATURES.map((feature, i) => {
                    const CardContent = (
                        <motion.div
                            whileHover={{ y: -8, scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="h-full cursor-pointer relative group"
                            onClick={() => feature.action && !feature.locked && setActiveAction(feature.action)}
                        >
                            {/* Silk Edge Ambient Glow (Workstream Specific) */}
                            <div className={`absolute -inset-[2px] bg-${feature.glow || 'white'}/[0.08] rounded-[2.5rem] opacity-0 group-hover:opacity-100 blur-[2px] transition-all duration-1000 -z-10`} />
                            <div className={`absolute -inset-10 bg-${feature.glow || 'white'}/[0.03] rounded-[4rem] opacity-0 group-hover:opacity-100 blur-[80px] transition-all duration-1000 -z-10`} />

                            {/* UX Architect Obsidian Glass Layer */}
                            <div className="bg-slate-950/40 backdrop-blur-[40px] rounded-[2.2rem] md:rounded-[2.8rem] overflow-hidden relative p-8 md:p-10 h-full flex flex-col min-h-[190px] md:min-h-[220px] border border-white/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] transition-all duration-1000 group-hover:border-white/20 group-hover:bg-black/40">
                                {/* Editorial Header Section */}
                                <div className="flex justify-between items-start relative z-10 mb-10 md:mb-14">
                                    <div className={cn(
                                        "w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-[1.2rem] bg-white/[0.03] flex items-center justify-center border border-white/5 transition-all duration-700",
                                        feature.accent || "text-white/30",
                                        `group-hover:bg-white/[0.08] group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]`
                                    )}>
                                        <feature.icon className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.3em] text-white/10">{feature.category}</span>
                                        {feature.locked ? (
                                            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/10">
                                                <Lock className="w-2.5 h-2.5" />
                                            </div>
                                        ) : feature.badge && (
                                            <div className="bg-white/5 border border-white/5 text-[7px] md:text-[8px] uppercase font-bold tracking-[0.4em] px-3 py-1 rounded-full text-white/20">
                                                {feature.badge}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Typography Unified Content */}
                                <div className="mt-auto relative z-10">
                                    <div className="flex items-center gap-2 mb-2 opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
                                        <div className="w-4 h-[1px] bg-white" />
                                        <span className="text-[7px] font-bold uppercase tracking-widest">{feature.chip}</span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white mb-2 leading-none transition-all duration-700 group-hover:translate-x-1">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[11px] md:text-[12px] text-white/30 font-medium leading-normal group-hover:text-white/60 transition-all duration-700 group-hover:translate-x-1">
                                        {feature.subtitle}
                                    </p>
                                </div>

                                {/* Premium Silk Trail Animation */}
                                {!feature.locked && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/5 to-transparent overflow-hidden">
                                        <motion.div
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '100%' }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            className={cn(
                                                "w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.2)]",
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

                            {/* Fallback */}
                            {["WORKFLOW", "INVENTORY"].includes(activeAction!) && (
                                <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center">
                                        <Settings2 className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
                                    </div>
                                    <div className="space-y-1 px-4">
                                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Module Optimization</h2>
                                        <p className="text-sm md:text-base text-slate-500">This configuration module is currently being calibrated for your workspace.</p>
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
