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
                        className={`cursor-pointer transition-all duration-700 group flex flex-col items-start gap-4 border-white/40 bg-white/60 hover:bg-white/80 glass-white h-full relative ${feature.component ? "p-0 overflow-hidden" : "p-8"}`}
                    >
                        {feature.component ? (
                            feature.component
                        ) : (
                            <>
                                {feature.locked && (
                                    <div className="absolute top-4 right-4">
                                        <Lock className="w-4 h-4 text-slate-300" />
                                    </div>
                                )}
                                <div className="w-full flex justify-between items-start">
                                    <div className={`w-14 h-14 rounded-2xl bg-slate-900/5 flex items-center justify-center text-slate-900 border border-slate-200 transition-all duration-500 group-hover:scale-105 group-hover:bg-neo-vibrant-blue group-hover:text-white group-hover:border-neo-vibrant-blue`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    {feature.badge && (
                                        <Badge className="bg-neo-emerald/10 text-neo-emerald hover:bg-neo-emerald/20 border-neo-emerald/20 text-[10px] uppercase font-black tracking-widest px-3 py-1">
                                            {feature.badge}
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-1 mt-2">
                                    <h3 className="font-serif italic tracking-tighter text-2xl text-slate-900 group-hover:text-neo-vibrant-blue transition-colors duration-500">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                                        {feature.subtitle}
                                    </p>
                                </div>

                                <div className="w-full mt-auto pt-6 flex items-center justify-between">
                                    <Badge variant="outline" className={`border-slate-200 bg-white/50 text-slate-500 font-bold uppercase tracking-widest text-[9px] px-3 py-1`}>
                                        {feature.chip}
                                    </Badge>
                                    {!feature.locked && (
                                        <div className="w-10 h-10 rounded-full bg-slate-900/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-neo-vibrant-blue hover:text-white">
                                            <ChevronRight className="w-5 h-5" />
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
