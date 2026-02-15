'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Camera,
    User,
    AlertTriangle,
    Activity,
    Clock,
    Phone,
    FileText,
    TrendingUp,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from '@/components/ui/dialog';
import { IntraOralCamera } from './intra-oral-camera';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    const [showDossier, setShowDossier] = useState(false);

    return (
        <Card className="rounded-[2.5rem] border-slate-100/50 shadow-sm bg-white overflow-hidden transition-all hover:shadow-md mb-6">
            <div className="px-6 py-4 flex items-center justify-between gap-6">

                {/* 1. Compact Identity & Avatar */}
                <div className="flex items-center gap-4 shrink-0">
                    <div className="relative group cursor-pointer" onClick={() => setIsCameraOpen(true)}>
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm group-hover:border-indigo-200 transition-all">
                            <User className="w-8 h-8 text-slate-300" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                            <Camera className="w-3 h-3 text-slate-400" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 border-b-2 border-transparent hover:border-slate-900 transition-all cursor-pointer">
                                {patientName}
                            </h2>
                            <Badge className="bg-slate-100 text-slate-500 font-bold text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md border-none">
                                {uhid}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest flex items-center gap-1">
                                <Clock className="w-3 h-3 text-indigo-500" /> Since Oct 2024
                            </p>

                            {/* Medical Alerts (Mini) */}
                            {alerts.length > 0 && (
                                <div className="flex gap-1">
                                    {alerts.map(a => (
                                        <div key={a} className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title={a} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Vitals HUD (Slim Bar) */}
                <div className="hidden lg:flex items-center gap-2 bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100">
                    <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <Activity className="w-4 h-4 text-indigo-500" />
                        <div className="flex flex-col leading-none">
                            <span className="text-[8px] font-black uppercase text-indigo-300 tracking-wider">BP</span>
                            <span className="text-sm font-black text-slate-700">{vitals.bp}</span>
                        </div>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <div className="flex flex-col leading-none">
                            <span className="text-[8px] font-black uppercase text-emerald-300 tracking-wider">Sugar</span>
                            <span className="text-sm font-black text-slate-700">{vitals.sugar}</span>
                        </div>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center text-[9px] font-bold text-orange-600">8</div>
                        <div className="flex flex-col leading-none">
                            <span className="text-[8px] font-black uppercase text-slate-300 tracking-wider">Pain</span>
                            <span className="text-xs font-black text-slate-700">Severe</span>
                        </div>
                    </div>
                </div>

                {/* 3. Actions & Dossier Toggle */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDossier(!showDossier)}
                        className={cn(
                            "h-10 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2",
                            showDossier ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                        )}
                    >
                        {showDossier ? "Close Dossier" : "Open Dossier"}
                        <ChevronDown className={cn("w-3 h-3 transition-transform", showDossier && "rotate-180")} />
                    </Button>

                    <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                        <DialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="hidden">Open Cam</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-5xl h-[700px] rounded-[3.5rem] p-0 overflow-hidden border-none shadow-3xl bg-black">
                            <IntraOralCamera patientId={patientId} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* 4. Patient Dossier Sub-Tab (Collapsible) */}
            {showDossier && (
                <div className="bg-slate-50 border-t border-slate-100 p-6 animate-in slide-in-from-top-4 fade-in duration-200">
                    <div className="grid grid-cols-4 gap-6">
                        {/* Financials */}
                        <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Revenue Contribution</h4>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                <span className="text-2xl font-black text-slate-900">₹45,200</span>
                            </div>
                        </div>

                        {/* Visits */}
                        <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total Visits</h4>
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-500" />
                                <span className="text-2xl font-black text-slate-900">12</span>
                            </div>
                        </div>

                        {/* Alerts Expanded */}
                        <div className="col-span-2 p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1">Medical Alerts</h4>
                            <div className="flex flex-wrap gap-2">
                                {alerts.map(alert => (
                                    <Badge key={alert} className="h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 px-3 font-bold text-[10px] uppercase">
                                        <AlertTriangle className="w-3 h-3 mr-1.5" />
                                        {alert}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
