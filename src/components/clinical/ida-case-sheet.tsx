
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Stethoscope,
    History,
    User,
    ClipboardCheck,
    Activity,
    Search,
    ShieldAlert,
    Clock,
    Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function IDACaseSheet() {
    return (
        <div className="space-y-12 pb-20">
            {/* 1. CHIEF COMPLAINT (IDA Format) */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
                        <Flame className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Chief Complaint (C/o)</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Reason for Visit</p>
                    </div>
                </div>

                <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white/80 backdrop-blur-md p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">OnSet & Duration</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="Onset (e.g. 2 days)" className="rounded-2xl border-slate-100 bg-slate-50/50" />
                                <Input placeholder="Duration" className="rounded-2xl border-slate-100 bg-slate-50/50" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Progress</Label>
                            <Input placeholder="Progress (Increasing/Decreasing)" className="rounded-2xl border-slate-100 bg-slate-50/50" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Aggravating / Relieving Factors</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input placeholder="Aggravating Factors (e.g. Cold/Hot)" className="rounded-2xl border-slate-100 bg-slate-50/50" />
                                <Input placeholder="Relieved by (e.g. Rest/Meds)" className="rounded-2xl border-slate-100 bg-slate-50/50" />
                            </div>
                        </div>
                    </div>
                </Card>
            </section>

            {/* 2. HISTORY SECTIONS (Medical & Family) */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Past Medical History */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <History className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Past Medical History</h3>
                    </div>

                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: 'dm', label: 'Diabetes Mellitus' },
                                { id: 'htn', label: 'Hypertension / CVD' },
                                { id: 'tb', label: 'TB / Respiratory' },
                                { id: 'ep', label: 'Epilepsy' },
                                { id: 'al', label: 'Allergy / Asthma' },
                                { id: 'bd', label: 'Bleeding Disorders' },
                                { id: 'kd', label: 'Kidney / Liver' },
                                { id: 'med', label: 'Current Meds' },
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{item.label}</span>
                                    <Switch />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Family History */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                            <User className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Family History</h3>
                    </div>

                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {['Diabetes', 'Hypertension', 'Tuberculosis', 'Bleeding Disorder', 'Allergy'].map((item) => (
                                <div key={item} className="flex items-center justify-between p-3 bg-indigo-50/30 rounded-2xl">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{item}</span>
                                    <Switch />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </section>

            {/* 3. EXAMINATION MATRIX (EXTRA & INTRA ORAL) */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <Search className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Clinical Examination Matrix</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Extra Oral */}
                    <Card className="lg:col-span-1 rounded-[2.5rem] border-slate-100 shadow-sm bg-white p-6 space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Extra Oral</Label>
                        <div className="space-y-3">
                            <Input placeholder="Built (Well/Avg/Small)" className="rounded-xl bg-slate-50 border-none" />
                            <Input placeholder="Facial Symmetry" className="rounded-xl bg-slate-50 border-none" />
                            <div className="space-y-1">
                                <Label className="text-[9px] font-bold uppercase text-slate-400 ml-1">TMJ Status</Label>
                                <Input placeholder="Movement/Clicking" className="rounded-xl bg-slate-50 border-none" />
                            </div>
                            <Input placeholder="Lymph Nodes" className="rounded-xl bg-slate-50 border-none" />
                        </div>
                    </Card>

                    {/* Intra Oral */}
                    <Card className="lg:col-span-2 rounded-[2.5rem] border-slate-100 shadow-sm bg-white p-8 space-y-6">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Intra Oral & Soft Tissue</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase text-slate-400">Gingival Status</Label>
                                <Input placeholder="Color / Consistency" className="rounded-xl bg-slate-50 border-none" />
                                <Input placeholder="Contour / Pockets" className="rounded-xl bg-slate-50 border-none" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase text-slate-400">Soft Tissue</Label>
                                <Input placeholder="Tongue (Papilla/Movement)" className="rounded-xl bg-slate-50 border-none" />
                                <Input placeholder="Cheek (Linea Alba/Lesions)" className="rounded-xl bg-slate-50 border-none" />
                                <Input placeholder="Palate / Floor of Mouth" className="rounded-xl bg-slate-50 border-none" />
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* 4. PROVISIONAL DIAGNOSIS & PLAN */}
            <section className="space-y-6">
                <Card className="rounded-[3rem] border-none shadow-2xl bg-slate-900 p-10 text-white">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                            <ClipboardCheck className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold italic tracking-tighter">Provisional Diagnosis & Strategy</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Diagnosis Summary</Label>
                            <Textarea
                                placeholder="Final clinical findings..."
                                className="min-h-[120px] bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 transition-all"
                            />
                        </div>
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Emergency & Planned RX</Label>
                            <Textarea
                                placeholder="Immediate actions vs long-term plan..."
                                className="min-h-[120px] bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 transition-all"
                            />
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    );
}
