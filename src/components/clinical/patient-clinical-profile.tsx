
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Camera,
    Upload,
    User,
    AlertTriangle,
    Activity,
    Clock,
    FileText,
    TrendingUp,
    Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { IntraOralCamera } from './intra-oral-camera';

interface PatientClinicalProfileProps {
    patientId: string;
    patientName: string;
    uhid: string;
    vitals?: {
        bp: string;
        sugar: string;
        pulse: string;
    };
    alerts?: string[];
}

export function PatientClinicalProfile({
    patientId,
    patientName,
    uhid,
    vitals = { bp: "120/80", sugar: "95 mg/dL", pulse: "72 bpm" },
    alerts = ["Penicillin Allergy", "Hypertensive"]
}: PatientClinicalProfileProps) {
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    return (
        <Card className="rounded-[3.5rem] border-slate-100/50 shadow-2xl bg-white overflow-hidden group transition-all hover:shadow-3xl">
            <div className="p-10 lg:p-12">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Photo/Media Selection */}
                    <div className="relative group/photo shrink-0">
                        <div className="w-40 h-40 rounded-[3rem] bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 shadow-inner group-hover:border-indigo-200 transition-all duration-700">
                            <User className="w-16 h-16 text-slate-200" />
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/photo:opacity-100 transition-opacity backdrop-blur-[2px] flex items-center justify-center gap-3">
                                <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                                    <DialogTrigger asChild>
                                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                                            <Camera className="w-4 h-4 text-slate-900" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-5xl h-[700px] rounded-[3.5rem] p-0 overflow-hidden border-none shadow-3xl bg-black">
                                        <IntraOralCamera patientId={patientId} />
                                    </DialogContent>
                                </Dialog>
                                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                                    <Upload className="w-4 h-4 text-slate-900" />
                                </button>
                            </div>
                        </div>
                        <div className="absolute -bottom-3 -right-3 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl border-4 border-white animate-bounce-subtle">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Patient Context */}
                    <div className="flex-1 space-y-8 w-full">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <h2 className="text-5xl lg:text-6xl font-sans font-black tracking-tight text-slate-900">
                                        {patientName}
                                    </h2>
                                    <Badge className="bg-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border-none">
                                        ID: {uhid}
                                    </Badge>
                                </div>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-indigo-500" /> Established Care Since Oct 2024
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" size="icon" className="rounded-2xl w-14 h-14 border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm">
                                    <Phone className="w-5 h-5" />
                                </Button>
                                <Button className="bg-slate-900 hover:bg-slate-800 h-14 px-8 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95">
                                    Open Full Clinical Dossier
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
                            {/* Vitals */}
                            <div className="px-6 py-4 bg-indigo-50/30 rounded-[2rem] border border-indigo-100/30 flex items-center gap-4 transition-all hover:bg-indigo-50">
                                <Activity className="w-5 h-5 text-indigo-500 animate-pulse" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider">BP Protocol</span>
                                    <span className="text-lg font-black text-indigo-900 tracking-tight">{vitals.bp}</span>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-emerald-50/30 rounded-[2rem] border border-emerald-100/30 flex items-center gap-4 transition-all hover:bg-emerald-50">
                                <Activity className="w-5 h-5 text-emerald-500" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">Glucose</span>
                                    <span className="text-lg font-black text-emerald-900 tracking-tight">{vitals.sugar}</span>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-[#fbfcfd] rounded-[2rem] border border-slate-100 flex items-center gap-4">
                                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <span className="text-orange-600 font-black text-xs">8/10</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Current Pain</span>
                                    <span className="text-sm font-black text-slate-900">Severe Unsharp</span>
                                </div>
                            </div>
                        </div>

                        {/* Clinical Alerts */}
                        <div className="flex flex-wrap gap-3">
                            {alerts.map(alert => (
                                <Badge key={alert} className="h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100/50 px-5 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-sm">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    {alert}
                                </Badge>
                            ))}
                            <Badge className="h-10 rounded-2xl bg-slate-900 text-white border-none px-5 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                                <Activity className="w-3.5 h-3.5" />
                                AI-ASSESSMENT: STABLE
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Insight Bar */}
            <div className="bg-slate-50/50 p-6 px-12 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <FileText className="w-4 h-4 text-slate-300" /> <span className="text-slate-900">12</span> Total Visits
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest border-l border-slate-200 pl-10">
                        <TrendingUp className="w-4 h-4 text-emerald-500" /> <span className="text-slate-900">₹45,200</span> Revenue Contribution
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Contextual Workspace</span>
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center font-black text-[10px] text-slate-400 ring-4 ring-slate-50">
                                {i}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}
