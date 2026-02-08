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
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
        subtitle: "Units & Specializations",
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
        subtitle: "UPI & Payment Gateway",
        icon: CreditCard,
        chip: "Gateway",
        accent: "text-white",
        bg: "bg-white/10",
        action: "BILLING"
    },
    {
        title: "Workflow Config",
        subtitle: "Module Access Controls",
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
                {MANAGEMENT_FEATURES.map((feature, i) => {
                    const CardContent = (
                        <motion.div
                            whileHover={{ y: -8, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className="h-full"
                            onClick={() => feature.action && !feature.locked && setActiveAction(feature.action)}
                        >
                            <PanzeCard
                                className="cursor-pointer group flex flex-col items-start gap-4 border-white/40 bg-white/60 hover:bg-white/80 glass-white h-full relative p-8 transition-colors duration-500 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
                            >
                                {feature.locked && (
                                    <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-500">
                                        <Lock className="w-4 h-4 text-slate-300" />
                                    </div>
                                )}
                                <div className="w-full flex justify-between items-start">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900/5 flex items-center justify-center text-slate-900 border border-slate-200 transition-all duration-500 group-hover:bg-neo-vibrant-blue group-hover:text-white group-hover:border-neo-vibrant-blue group-hover:shadow-[0_8px_20px_rgba(0,122,255,0.3)]">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    {feature.badge && (
                                        <Badge className="bg-neo-emerald/10 text-neo-emerald hover:bg-neo-emerald/20 border-neo-emerald/20 text-[10px] uppercase font-black tracking-widest px-3 py-1">
                                            {feature.badge}
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-1 mt-2">
                                    <h3 className="font-bold tracking-tight text-2xl text-slate-900 group-hover:text-neo-vibrant-blue transition-colors duration-500 leading-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                                        {feature.subtitle}
                                    </p>
                                </div>

                                <div className="w-full mt-auto pt-6 flex items-center justify-between">
                                    <Badge variant="outline" className="border-slate-200 bg-white/50 text-slate-500 font-bold uppercase tracking-widest text-[9px] px-3 py-1">
                                        {feature.chip}
                                    </Badge>
                                    {!feature.locked && (
                                        <div className="w-10 h-10 rounded-full bg-neo-vibrant-blue/10 text-neo-vibrant-blue flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-neo-vibrant-blue hover:text-white">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                            </PanzeCard>
                        </motion.div>
                    );

                    if (feature.href && !feature.action) {
                        return (
                            <Link key={i} href={feature.locked ? "#" : feature.href} className={feature.locked ? "cursor-not-allowed opacity-60" : ""}>
                                {CardContent}
                            </Link>
                        );
                    }

                    return (
                        <div key={i} className={feature.locked ? "cursor-not-allowed opacity-60" : ""}>
                            {CardContent}
                        </div>
                    );
                })}
            </div>

            {/* Action Dialogs */}
            <Dialog open={!!activeAction} onOpenChange={(open) => !open && setActiveAction(null)}>
                <DialogContent className="max-w-[70vw] h-[85vh] p-0 rounded-[3rem] overflow-hidden border-none bg-transparent shadow-none">
                    <div className="w-full h-full bg-white glass-white rounded-[3rem] overflow-y-auto relative animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setActiveAction(null)}
                            className="absolute top-8 right-8 z-50 p-3 bg-slate-900/5 hover:bg-slate-900/10 rounded-full text-slate-400 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="p-12">
                            {activeAction === "STAFF" && <StaffSettings />}
                            {activeAction === "BILLING" && <BillingSettings />}
                            {activeAction === "INTEGRATIONS" && <UniversalBridgeHub />}
                            {activeAction === "IDENTITY" && <ClinicBrandingSettings onSave={() => setActiveAction(null)} />}

                            {/* Fallback */}
                            {["WORKFLOW", "INVENTORY"].includes(activeAction!) && (
                                <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                                        <Settings2 className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-bold text-slate-900">Module Optimization</h2>
                                        <p className="text-slate-500">This configuration module is currently being calibrated for your workspace.</p>
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
