'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    History,
    Heart,
    ShieldCheck,
    Dna,
    Beer,
    Cigarette,
    AlertCircle,
    ArrowLeft
} from 'lucide-react';
import { useCockpitStore } from '@/lib/clinical-cockpit-store';

export function MedicalHistoryDetails({ onBack }: { onBack?: () => void }) {
    const maternity = useCockpitStore(s => s.maternity);

    // Mock Data for Systemic Conditions - In real app, this would come from props or store
    const conditions = [
        { label: "Diabetes Mellitus", status: "POSITIVE", value: "Type II • Controlled" },
        { label: "Hypertension", status: "POSITIVE", value: "150/90 • Irregular" },
        { label: "Thyroid Disorder", status: "NEGATIVE", value: "N/A" },
        { label: "Bleeding Disorder", status: "NEGATIVE", value: "N/A" },
        { label: "Drug Allergy", status: "POSITIVE", value: "Sulpha Drugs" },
        { label: "Epilepsy", status: "NEGATIVE", value: "N/A" },
        { label: "Asthma", status: "NEGATIVE", value: "N/A" },
        { label: "Cardiac Issues", status: "NEGATIVE", value: "N/A" },
        { label: "Hepatitis", status: "NEGATIVE", value: "N/A" },
        { label: "HIV / STD", status: "NEGATIVE", value: "N/A" },
        { label: "Tuberculosis", status: "NEGATIVE", value: "N/A" },
        { label: "Covid-19 History", status: "NEGATIVE", value: "N/A" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    {onBack && (
                        <Button variant="ghost" className="rounded-2xl w-12 h-12 p-0 bg-slate-100/50 hover:bg-slate-200" onClick={onBack}>
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Button>
                    )}
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-serif italic tracking-tighter text-slate-900">Risk Matrix</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Surgical Safety Protocol</p>
                    </div>
                </div>

                {/* Pregnancy Protocol Badge (Linked to Cockpit Store) */}
                {maternity.isPregnant && (
                    <div className="bg-red-50 border border-red-100 px-6 py-3 rounded-2xl flex items-center gap-3 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-red-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Pregnancy Protocol Active</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* 1. LifeStyle & Personal History (Left Column - 4 cols) */}
                <div className="xl:col-span-4 space-y-6">
                    <Card className="rounded-[3rem] p-8 border-slate-100 shadow-xl bg-slate-900 text-white overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 opacity-10">
                            <Beer className="w-40 h-40" />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-white/10 text-white border-white/20 px-3 py-1 font-black text-[9px] tracking-widest uppercase">Personal Habits</Badge>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                        <Cigarette className="w-6 h-6 text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Tobacco</p>
                                        <p className="text-lg font-bold">5 Bidi/Day • 10Y</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                        <Beer className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Alcohol</p>
                                        <p className="text-lg font-bold">Occasional</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[3rem] p-8 border-slate-200 shadow-sm bg-white space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <History className="w-4 h-4 text-indigo-500" /> Past Dental History
                        </h4>
                        <div className="space-y-3">
                            {[
                                "Extraction (2022) - LL6",
                                "RCT (2021) - UR6",
                                "Scaling (6mo ago)"
                            ].map((item, i) => (
                                <div key={i} className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-700">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* 2. Systemic Conditions (Right Column - 8 cols) */}
                <div className="xl:col-span-8 space-y-8">
                    <section className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-8 lg:p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
                                <Heart className="w-6 h-6 text-rose-500" /> Systemic Conditions
                            </h3>
                            <Badge variant="outline" className="border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                12 Parameters Check
                            </Badge>
                        </div>

                        {/* 3-Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {conditions.map((item) => (
                                <div
                                    key={item.label}
                                    className={cn(
                                        "min-h-[64px] rounded-2xl p-4 flex items-center justify-between border transition-all cursor-pointer hover:shadow-md",
                                        item.status === 'POSITIVE'
                                            ? "bg-amber-100 border-amber-200 shadow-sm ring-1 ring-amber-200/50" // Amber for Positive
                                            : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100 hover:text-slate-600" // Muted for Negative
                                    )}
                                >
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-wider",
                                            item.status === 'POSITIVE' ? "text-amber-800" : "text-slate-400"
                                        )}>
                                            {item.label}
                                        </span>
                                        {item.status === 'POSITIVE' && (
                                            <span className="text-xs font-bold text-amber-900 mt-0.5">{item.value}</span>
                                        )}
                                    </div>

                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center border-2",
                                        item.status === 'POSITIVE'
                                            ? "bg-amber-500 border-amber-600 text-white"
                                            : "bg-white border-slate-200 text-slate-300"
                                    )}>
                                        {item.status === 'POSITIVE' ? <AlertCircle className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-indigo-50/30 rounded-[3rem] p-8 border border-indigo-100/50">
                        <h3 className="text-xl font-black tracking-tighter text-slate-900 flex items-center gap-3 mb-6">
                            <Dna className="w-5 h-5 text-indigo-500" /> Genetic Risk Factors
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['Diabetes', 'CAD', 'Hypothetical Risk', 'Asthma'].map(risk => (
                                <div key={risk} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-indigo-100 shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-600">{risk}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
