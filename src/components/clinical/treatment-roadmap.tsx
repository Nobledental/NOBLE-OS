
'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle2,
    Circle,
    Clock,
    Calendar,
    CreditCard,
    ArrowRight,
    Stethoscope,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TreatmentStep {
    id: string;
    procedure: string;
    status: 'completed' | 'ongoing' | 'planned';
    date?: string;
    cost?: string;
    notes?: string;
}

export function TreatmentRoadmap() {
    const treatments: TreatmentStep[] = [
        { id: '1', procedure: 'Scaling & Oral Prophylaxis', status: 'completed', date: 'Oct 10, 2025', cost: '₹1,500' },
        { id: '2', procedure: 'Laser Gingivectomy (Upper Arch)', status: 'completed', date: 'Oct 15, 2025', cost: '₹8,500' },
        { id: '3', procedure: 'RCT - Tooth #16', status: 'ongoing', date: 'Oct 24, 2025', cost: '₹6,000', notes: 'Obturation pending' },
        { id: '4', procedure: 'Zirconia Crown - Tooth #16', status: 'planned', cost: '₹12,000' },
        { id: '5', procedure: 'Implant Placement - Tooth #36', status: 'planned', cost: '₹35,000' },
    ];

    return (
        <div className="space-y-10 animate-ios-reveal">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900">Treatment Roadmap</h2>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">Surgical Sequence • Financial Oversight</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 h-12 rounded-2xl px-8 text-xs font-black uppercase tracking-widest gap-2">
                    <Zap className="w-4 h-4" /> Add New Phase
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Timeline Flow */}
                <div className="lg:col-span-2 space-y-4">
                    {treatments.map((step, index) => (
                        <div key={step.id} className="relative group">
                            {index !== treatments.length - 1 && (
                                <div className="absolute left-[27px] top-14 bottom-0 w-0.5 bg-slate-100 group-last:hidden" />
                            )}

                            <Card className={cn(
                                "rounded-[2.5rem] p-6 border-slate-100 transition-all duration-500",
                                step.status === 'ongoing' ? "ring-2 ring-indigo-500 bg-indigo-50/20 shadow-xl shadow-indigo-100" : "bg-white hover:shadow-lg"
                            )}>
                                <div className="flex items-start gap-6">
                                    <div className={cn(
                                        "w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm",
                                        step.status === 'completed' ? "bg-emerald-500 text-white" :
                                            step.status === 'ongoing' ? "bg-indigo-600 text-white animate-pulse" :
                                                "bg-slate-100 text-slate-400"
                                    )}>
                                        {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> :
                                            step.status === 'ongoing' ? <Stethoscope className="w-6 h-6" /> :
                                                <Circle className="w-6 h-6" />}
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xl font-black text-slate-900 tracking-tight">{step.procedure}</h4>
                                            <Badge className={cn(
                                                "rounded-full px-4 h-7 text-[9px] font-black tracking-widest uppercase",
                                                step.status === 'completed' ? "bg-emerald-100 text-emerald-700" :
                                                    step.status === 'ongoing' ? "bg-indigo-100 text-indigo-700" :
                                                        "bg-slate-100 text-slate-500"
                                            )}>
                                                {step.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-6 mt-2">
                                            <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <Calendar className="w-3 h-3" /> {step.date || 'TBD'}
                                            </span>
                                            <span className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                                                <CreditCard className="w-3 h-3" /> {step.cost}
                                            </span>
                                        </div>
                                        {step.notes && (
                                            <p className="text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-xl mt-4 border border-slate-100">
                                                Note: {step.notes}
                                            </p>
                                        )}
                                    </div>

                                    <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-5 h-5 text-slate-400" />
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* Financial/Summary Sidebar */}
                <div className="space-y-6">
                    <Card className="rounded-[3rem] p-8 border-slate-100 shadow-xl bg-slate-900 text-white space-y-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Treatment Value</p>
                            <h3 className="text-5xl font-black tracking-tighter mt-2 group-hover:scale-105 transition-transform">₹63,000</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-bold">Completed</span>
                                <span className="font-black text-emerald-400">₹10,000</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-bold">Remaining</span>
                                <span className="font-black text-indigo-400">₹53,000</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: '15.8%' }} />
                            </div>
                        </div>

                        <Button className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                            Generate Quote (PDF)
                        </Button>
                    </Card>

                    <Card className="rounded-[3rem] p-8 border-slate-100 shadow-xl bg-white space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500" /> Next Appointment
                        </h4>
                        <div className="space-y-2">
                            <p className="text-2xl font-black text-slate-900">Tomorrow, 11:30 AM</p>
                            <p className="text-xs font-bold text-slate-500">RCT Stage 2 - Cleaning & Shaping</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
