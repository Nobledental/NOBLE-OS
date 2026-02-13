
'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    History,
    Heart,
    ShieldCheck,
    Dna,
    Beer,
    Cigarette,
    AlertCircle,
    Clipboard,
    ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function MedicalHistoryDetails({ onBack }: { onBack?: () => void }) {
    return (
        <div className="space-y-10 animate-ios-reveal pb-20">
            {/* Header with Navigation */}
            <div className="flex items-center gap-6">
                {onBack && (
                    <Button variant="ghost" className="rounded-2xl w-12 h-12 p-0 bg-slate-100/50 hover:bg-slate-200" onClick={onBack}>
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Button>
                )}
                <div>
                    <h2 className="text-5xl font-serif italic tracking-tighter text-slate-900">Life-Log Analysis</h2>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Deep Diagnostics • Clinical Background</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* 1. LifeStyle & Personal History */}
                <div className="xl:col-span-1 space-y-6">
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
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Tobacco Consumption</p>
                                        <p className="text-xl font-bold">5 Bidi/Day • 10 Years</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                        <Beer className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Alcohol</p>
                                        <p className="text-xl font-bold">Occasional (Socially)</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                        <AlertCircle className="w-6 h-6 text-rose-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Bruxism / Clenching</p>
                                        <p className="text-xl font-bold text-rose-300">Active History</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[3rem] p-8 border-slate-100 shadow-xl bg-white space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <History className="w-4 h-4 text-indigo-500" /> Past Dental History
                        </h4>
                        <div className="space-y-4">
                            {[
                                "Extraction (2022) - Lower Left",
                                "RCT (2021) - Upper Right Molar",
                                "Scaling & Polishing (Last 6 Months)"
                            ].map((item, i) => (
                                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-700">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* 2. Medical & Family History Matrix */}
                <div className="xl:col-span-2 space-y-10">
                    <section className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
                            <Heart className="w-6 h-6 text-rose-500" /> Systemic Medical Conditions
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: "Diabetes Mellitus", status: "POSITIVE", value: "Type II • Controlled", color: "bg-amber-100 text-amber-700" },
                                { label: "Hypertension", status: "POSITIVE", value: "150/90 • Irregular Meds", color: "bg-rose-100 text-rose-700" },
                                { label: "Thyroid Disorder", status: "NEGATIVE", value: "N/A", color: "bg-slate-50 text-slate-400" },
                                { label: "Bleeding Disorder", status: "NEGATIVE", value: "N/A", color: "bg-slate-50 text-slate-400" },
                                { label: "Drug Allergy", status: "POSITIVE", value: "Sulpha Drugs", color: "bg-rose-600 text-white" }
                            ].map((item) => (
                                <div key={item.label} className={cn(
                                    "p-6 rounded-[2.5rem] flex items-center justify-between border-2 transition-all hover:scale-[1.02]",
                                    item.status === 'POSITIVE' ? "border-slate-100 bg-white" : "border-transparent bg-slate-50/50"
                                )}>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                                        <p className="text-lg font-black mt-1 text-slate-900">{item.value}</p>
                                    </div>
                                    <Badge className={cn("rounded-full px-4 h-8 uppercase text-[9px] font-black tracking-widest h-8", item.color)}>
                                        {item.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
                            <Dna className="w-6 h-6 text-indigo-500" /> Genetic Risk Matrix
                        </h3>
                        <div className="bg-indigo-50/30 rounded-[3rem] p-10 border border-indigo-100/50">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {['Diabetes', 'CAD', 'Hypothetical Risk', 'Asthma'].map(risk => (
                                    <div key={risk} className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-white border-4 border-indigo-100 flex items-center justify-center">
                                            <ShieldCheck className="w-8 h-8 text-indigo-500" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">{risk}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
