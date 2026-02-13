
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
        <Card className="rounded-[2.5rem] border-slate-100 shadow-xl bg-white overflow-hidden group">
            <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Photo/Media Selection */}
                    <div className="relative group/photo">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-slate-50 shadow-inner group-hover:shadow-lg transition-all duration-500">
                            <User className="w-12 h-12 text-slate-300" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                                    <DialogTrigger asChild>
                                        <button className="p-2 bg-white rounded-full hover:scale-110 transition-transform">
                                            <Camera className="w-4 h-4 text-slate-900" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[900px] h-[600px] rounded-[3rem] p-0 overflow-hidden border-none">
                                        <IntraOralCamera patientId={patientId} />
                                    </DialogContent>
                                </Dialog>
                                <button className="p-2 bg-white rounded-full hover:scale-110 transition-transform">
                                    <Upload className="w-4 h-4 text-slate-900" />
                                </button>
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-2xl shadow-lg border-4 border-white">
                            < TrendingUp className="w-3 h-3" />
                        </div>
                    </div>

                    {/* Patient Context */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
                                    {patientName}
                                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-indigo-100 text-indigo-500">
                                        {uhid}
                                    </Badge>
                                </h2>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Last Visit: Oct 24, 2025
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="rounded-2xl w-12 h-12 border-slate-100 text-slate-400 hover:text-indigo-600">
                                    <Phone className="w-5 h-5" />
                                </Button>
                                <Button className="bg-slate-900 hover:bg-slate-800 h-12 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest">
                                    Full Chart
                                </Button>
                            </div>
                        </div>

                        {/* Vitals Quick-Strip */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="px-4 py-2 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex items-center gap-3">
                                <Activity className="w-4 h-4 text-indigo-500" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase text-indigo-400">Blood Pressure</span>
                                    <span className="text-xs font-black text-indigo-700">{vitals.bp}</span>
                                </div>
                            </div>
                            <div className="px-4 py-2 bg-rose-50/50 rounded-2xl border border-rose-100/50 flex items-center gap-3">
                                <Activity className="w-4 h-4 text-rose-500" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase text-rose-400">Sugar Level</span>
                                    <span className="text-xs font-black text-rose-700">{vitals.sugar}</span>
                                </div>
                            </div>
                        </div>

                        {/* Clinical Alerts */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {alerts.map(alert => (
                                <Badge key={alert} className="h-8 rounded-xl bg-orange-100/80 text-orange-700 border-none px-4 flex items-center gap-2 font-black text-[10px] uppercase tracking-wide">
                                    <AlertTriangle className="w-3 bl h-3" />
                                    {alert}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="bg-slate-50 p-4 px-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <FileText className="w-3 h-3" /> 12 Visits
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <TrendingUp className="w-3 h-3" /> Lifetime Value: ₹45,200
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase text-slate-300 mr-2">Quick Actions</span>
                    <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                        <Upload className="w-4 h-4 text-slate-400" />
                    </button>
                </div>
            </div>
        </Card>
    );
}
