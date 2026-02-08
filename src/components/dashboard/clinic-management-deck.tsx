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

interface ManagementFeature {
    title: string;
    subtitle: string;
    icon: any;
    chip: string;
    accent: string;
    bg: string;
    href?: string;
    action?: string;
    badge?: string;
    locked?: boolean;
}

const MANAGEMENT_FEATURES: ManagementFeature[] = [
    {
        title: "Clinical Queue",
        subtitle: "Live Patient Flow",
        icon: Activity,
        chip: "Queue",
        accent: "text-white",
        bg: "bg-white/10",
        href: "/dashboard/appointments"
    },
    {
        title: "Scheduling",
        subtitle: "Clinic Hours & Slots",
        icon: Calendar,
        chip: "Time",
        accent: "text-white",
        bg: "bg-white/10",
        href: "/dashboard/settings/scheduling"
    },
    {
        title: "Departments",
        subtitle: "Units & Groups",
        icon: Stethoscope,
        chip: "Structure",
        accent: "text-white",
        bg: "bg-white/10",
        href: "/dashboard/clinical"
    },
    {
        title: "Dental Chairs",
        subtitle: "Operatory Management",
        icon: Armchair,
        chip: "Assets",
        accent: "text-white",
        bg: "bg-white/10",
        href: "/dashboard/admin/chairs"
    },
    {
        title: "Tariff Master",
        subtitle: "Clinical Cost Matrix",
        icon: Receipt,
        chip: "Price",
        accent: "text-white",
        bg: "bg-white/10",
        href: "/dashboard/tariff"
    },
    {
        title: "Specialists",
        subtitle: "Ledger & Settlements",
        icon: Briefcase,
        chip: "Finance",
        accent: "text-white",
        bg: "bg-white/10",
        href: "/dashboard/settlement"
    },
    {
        title: "Clinic Identity",
        subtitle: "Branding & Socials",
        icon: Building2,
        chip: "Brand",
        accent: "text-white",
        bg: "bg-white/10",
        action: "IDENTITY",
        badge: "New"
    },
    {
        title: "Staff Access",
        subtitle: "Roles & Permissions",
        icon: Users,
        chip: "Security",
        accent: "text-white",
        bg: "bg-white/10",
        action: "STAFF"
    },
    {
        title: "Integration Hub",
        subtitle: "Scanners & Cloud",
        icon: Cpu,
        chip: "Cloud",
        accent: "text-white",
        bg: "bg-white/10",
        action: "INTEGRATIONS"
    },
    {
        title: "Billing & Account",
        subtitle: "UPI & Gateway",
        icon: CreditCard,
        chip: "Gateway",
        accent: "text-white",
        bg: "bg-white/10",
        action: "BILLING"
    },
    {
        title: "Workflow Config",
        subtitle: "Access Controls",
        icon: ShieldCheck,
        chip: "Workflow",
        accent: "text-white",
        bg: "bg-white/10",
        action: "WORKFLOW"
    },
    {
        title: "Inventory",
        subtitle: "Stocks & Supplies",
        icon: Package,
        chip: "Storage",
        accent: "text-white",
        bg: "bg-white/10",
        action: "INVENTORY",
        locked: true
    }
];

export function ClinicManagementDeck() {
    const [activeAction, setActiveAction] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            {/* Wrapping Grid (Rows not Columns, No Scroll) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5 auto-rows-min pb-20">
                {MANAGEMENT_FEATURES.map((feature, i) => {
                    const CardContent = (
                        <motion.div
                            whileHover={{ y: -8, scale: 1.04 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            className="h-full cursor-pointer relative group"
                            onClick={() => feature.action && !feature.locked && setActiveAction(feature.action)}
                        >
                            {/* Vision Pro Multi-Color Aura Glow */}
                            <div className="absolute -inset-[2px] bg-white/10 rounded-[2.2rem] opacity-0 group-hover:opacity-100 blur-md transition-all duration-700 -z-10" />
                            <div className="absolute -inset-4 bg-[radial-gradient(circle_at_center,_#007AFF_0%,_#A78BFA_40%,_#00CFFF_70%,_transparent_100%)] rounded-[3rem] opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-1000 -z-10" />

                            {/* High-Fidelity Glass Card */}
                            <div className="bg-slate-950/40 backdrop-blur-2xl rounded-[2.2rem] overflow-hidden relative p-7 h-full flex flex-col min-h-[185px] border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:border-white/20 group-hover:bg-slate-900/60">
                                {/* Glossy Reflection */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                {/* Header Section */}
                                <div className="flex justify-between items-start relative z-10 mb-8">
                                    <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-black group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-500">
                                        <feature.icon className="w-5 h-5" />
                                    </div>
                                    {feature.locked ? (
                                        <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                                            <Lock className="w-3 h-3" />
                                        </div>
                                    ) : feature.badge && (
                                        <div className="bg-cyan-400/10 border border-cyan-400/20 text-[8px] uppercase font-black tracking-[0.2em] px-3 py-1 rounded-full text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                            {feature.badge}
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="mt-auto relative z-10">
                                    <h3 className="text-[22px] font-black tracking-tight text-white mb-1.5 leading-none transition-transform duration-500 group-hover:translate-x-1">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[11px] text-white/40 font-medium leading-tight group-hover:text-white/60 transition-all duration-500 group-hover:translate-x-1">
                                        {feature.subtitle}
                                    </p>
                                </div>

                                {/* Vision Pro Interactive Indicator */}
                                {!feature.locked && (
                                    <div className="absolute bottom-5 left-7 right-7 h-[2px] bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '0%' }}
                                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                            className="w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
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
