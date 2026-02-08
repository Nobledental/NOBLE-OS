"use client";

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
    Briefcase
} from "lucide-react";
import { motion } from "framer-motion";

import { TariffWidget } from "./widgets/tariff-widget";
import { LedgerWidget } from "./widgets/ledger-widget";

interface ManagementFeature {
    title: string;
    subtitle: string;
    icon: any;
    chip: string;
    accent: string;
    bg: string;
    href: string;
    badge?: string;
    component?: React.ReactNode;
    colSpan?: string;
    locked?: boolean;
}

const MANAGEMENT_FEATURES: ManagementFeature[] = [
    {
        title: "Hospital Profile",
        subtitle: "Name, address, contact, branding",
        icon: Building2,
        chip: "General",
        accent: "text-white",
        bg: "bg-white/10",
        href: "/dashboard/settings",
        badge: "Recommended"
    },
    {
        title: "Departments & Units",
        subtitle: "Endo, Ortho, Surgery, Pedo, Radio",
        icon: Stethoscope,
        chip: "Departments",
        accent: "text-white",
        bg: "bg-white/10",
        href: "/dashboard/clinical"
    },
    {
        title: "Tariffs & Packages",
        subtitle: "Consultation, procedures, room rents",
        icon: Receipt,
        chip: "Billing",
        accent: "text-white",
        bg: "bg-white/10",
        href: "/dashboard/tariff",
        component: <div className="h-full w-full -m-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)]"><TariffWidget /></div>,
        colSpan: "row-span-2"
    },
    {
        title: "Dental Chairs",
        subtitle: "Operatory management, chair allocation",
        icon: Armchair,
        chip: "Chairs",
        accent: "text-white",
        bg: "bg-white/10",
        href: "/dashboard/admin/chairs"
    },
    {
        title: "Specialist Ledger",
        subtitle: "Track payables & settlements",
        icon: Briefcase,
        chip: "Finance",
        accent: "text-white",
        bg: "bg-white/10",
        href: "/dashboard/settlement",
        component: <div className="h-full w-full -m-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)]"><LedgerWidget /></div>,
        colSpan: "row-span-2"
    },
    {
        title: "Module Access",
        subtitle: "Enable/Disable specific dashboards",
        icon: Settings2,
        chip: "Workflow",
        accent: "text-white",
        bg: "bg-white/10",
        href: "/dashboard/settings"
    }
];

export function ClinicManagementDeck() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
            {MANAGEMENT_FEATURES.map((feature, i) => {
                const CardContent = (
                    <PanzeCard
                        className={`cursor-pointer transition-all duration-700 group flex flex-col items-start gap-4 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] glass-neo h-full relative ${feature.component ? "p-0 overflow-hidden" : "p-6"}`}
                    >
                        {feature.component ? (
                            feature.component
                        ) : (
                            <>
                                {feature.locked && (
                                    <div className="absolute top-4 right-4">
                                        <Lock className="w-4 h-4 text-slate-400" />
                                    </div>
                                )}
                                <div className="w-full flex justify-between items-start">
                                    <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center ${feature.accent}`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    {feature.badge && (
                                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">
                                            {feature.badge}
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-black italic tracking-tighter text-lg text-white group-hover:text-neo-vibrant-blue transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                                        {feature.subtitle}
                                    </p>
                                </div>

                                <div className="w-full mt-auto pt-4 flex items-center justify-between">
                                    <Badge variant="outline" className={`border-0 ${feature.bg} ${feature.accent} font-bold`}>
                                        {feature.chip}
                                    </Badge>
                                    {!feature.locked && (
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </PanzeCard>
                );

                if (feature.component) {
                    return (
                        <div key={i} className={feature.colSpan || ""}>
                            {CardContent}
                        </div>
                    );
                }

                return (
                    <Link key={i} href={feature.locked ? "#" : feature.href} className={`${feature.locked ? "cursor-not-allowed opacity-60" : ""} ${feature.colSpan || ""}`}>
                        {CardContent}
                    </Link>
                );
            })}
        </div>
    );
}
