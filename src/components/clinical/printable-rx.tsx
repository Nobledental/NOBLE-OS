"use client";

import React from 'react';
import { ToothState, FDI_PERMANENT_TEETH } from '@/types/clinical';
import { cn } from '@/lib/utils';

interface PrintableRxProps {
    patientName: string;
    patientAge?: string;
    patientGender?: string;
    date: string;
    toothData?: Record<string, ToothState>;
    prescriptions: Array<{
        drug: string;
        dosage: string;
        duration: string;
        instructions?: string;
    }>;
    clinicalNotes?: {
        subjective?: string;
        assessment?: string;
        advice?: string;
    };
    clinicInfo?: {
        name: string;
        address: string;
        phone: string;
        logo?: string;
    };
}

const SmallTooth: React.FC<{ state: ToothState }> = ({ state }) => {
    const { status, surfaces } = state;
    const isDecayed = status === 'decayed';
    const isRestored = status === 'restored';
    const isMissing = status === 'missing';
    const isRCT = status === 'rct';

    if (isMissing) return <div className="w-4 h-4 border border-dashed border-slate-300 rounded-sm opacity-30" />;

    return (
        <svg viewBox="0 0 100 100" className="w-4 h-4">
            <rect x="5" y="5" width="90" height="90" rx="10" className="fill-white stroke-slate-400 stroke-[4px]" />
            {surfaces.b && <path d="M 10 10 L 90 10 L 65 35 L 35 35 Z" className={cn(isDecayed ? "fill-red-500" : "fill-indigo-500")} />}
            {surfaces.l && <path d="M 10 90 L 90 90 L 65 65 L 35 65 Z" className={cn(isDecayed ? "fill-red-500" : "fill-indigo-500")} />}
            {surfaces.m && <path d="M 10 10 L 10 90 L 35 65 L 35 35 Z" className={cn(isDecayed ? "fill-red-500" : "fill-indigo-500")} />}
            {surfaces.d && <path d="M 90 10 L 90 90 L 65 65 L 65 35 Z" className={cn(isDecayed ? "fill-red-500" : "fill-indigo-500")} />}
            {surfaces.o && <rect x="35" y="35" width="30" height="30" className={cn(isDecayed ? "fill-red-500" : "fill-indigo-500")} />}
            {isRCT && <line x1="50" y1="10" x2="50" y2="90" className="stroke-red-600 stroke-[8px]" />}
        </svg>
    );
};

export const PrintableRx = React.forwardRef<HTMLDivElement, PrintableRxProps>((props, ref) => {
    const { patientName, patientAge, patientGender, date, toothData = {}, prescriptions, clinicalNotes, clinicInfo } = props;

    const renderQuadrant = (ids: string[]) => (
        <div className="flex gap-1">
            {ids.map(id => (
                <div key={id} className="flex flex-col items-center gap-0.5">
                    <span className="text-[6px] font-bold text-slate-400">{id}</span>
                    <SmallTooth state={toothData[id] || { id, surfaces: { m: false, d: false, o: false, b: false, l: false }, status: 'healthy' }} />
                </div>
            ))}
        </div>
    );

    return (
        <div ref={ref} className="bg-white p-12 text-slate-900 w-[794px] min-h-[1123px] font-sans print:p-8">
            {/* Header / Branding */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900">{clinicInfo?.name || "Noble Dental Care"}</h1>
                    <p className="text-xs font-bold text-slate-500 max-w-sm leading-relaxed uppercase tracking-widest">
                        {clinicInfo?.address || "123 Healthcare Blvd, Bangalore, KA 560001"}
                    </p>
                    <p className="text-xs font-black text-slate-900">Phone: {clinicInfo?.phone || "+91 98765 43210"}</p>
                </div>
                <div className="text-right space-y-1">
                    <div className="inline-block px-4 py-2 bg-slate-100 text-slate-900 border border-slate-200 text-xs font-black uppercase tracking-widest rounded-lg">Prescription</div>
                    <p className="text-xs font-bold text-slate-500 mt-2">Date: {date}</p>
                </div>
            </div>

            {/* Patient Info */}
            <div className="grid grid-cols-3 gap-8 py-4 border-b border-slate-100 mb-8">
                <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Name</span>
                    <p className="font-bold text-lg">{patientName}</p>
                </div>
                <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age / Gender</span>
                    <p className="font-bold text-lg">{patientAge || "28"}Y / {patientGender || "Male"}</p>
                </div>
                <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient ID</span>
                    <p className="font-mono font-bold text-lg">NF-{patientName.slice(0, 3).toUpperCase()}-001</p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-12 gap-12">
                {/* Left Column: Diagnostics & Chart */}
                <div className="col-span-4 space-y-8">
                    {/* Clinical Summary */}
                    {(clinicalNotes?.subjective || clinicalNotes?.assessment) && (
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-indigo-600 pl-3">Clinical Summary</h4>
                            <div className="space-y-3">
                                {clinicalNotes.subjective && (
                                    <div>
                                        <span className="text-[8px] font-black text-slate-400 uppercase">Subjective</span>
                                        <p className="text-sm font-medium leading-relaxed">{clinicalNotes.subjective}</p>
                                    </div>
                                )}
                                {clinicalNotes.assessment && (
                                    <div>
                                        <span className="text-[8px] font-black text-slate-400 uppercase">Diagnosis</span>
                                        <p className="text-sm font-bold leading-relaxed text-indigo-900">{clinicalNotes.assessment}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tooth Chart Visual */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-indigo-600 pl-3">Dental Charting (FDI)</h4>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 flex flex-col items-center">
                            {/* Upper */}
                            <div className="flex gap-4">
                                {renderQuadrant(FDI_PERMANENT_TEETH.UR)}
                                {renderQuadrant(FDI_PERMANENT_TEETH.UL)}
                            </div>
                            {/* Lower */}
                            <div className="flex gap-4">
                                {renderQuadrant(FDI_PERMANENT_TEETH.LR)}
                                {renderQuadrant(FDI_PERMANENT_TEETH.LL)}
                            </div>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> <span className="text-[8px] font-bold text-slate-400 uppercase">Caries</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> <span className="text-[8px] font-bold text-slate-400 uppercase">Restored</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-0.5 bg-red-600" /> <span className="text-[8px] font-bold text-slate-400 uppercase">RCT</span></div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Medications & Plan */}
                <div className="col-span-8 space-y-12">
                    {/* Medications */}
                    <div className="space-y-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-serif font-black text-indigo-600">Rx</span>
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Medications</h4>
                        </div>
                        <div className="space-y-6">
                            {prescriptions.length > 0 ? prescriptions.map((p, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="text-sm font-black text-slate-300">0{i + 1}</div>
                                    <div className="space-y-1 flex-1">
                                        <p className="font-black text-lg text-slate-900">{p.drug}</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dosage: {p.dosage}</p>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration: {p.duration}</p>
                                        </div>
                                        {p.instructions && <p className="text-xs font-bold text-slate-700 bg-slate-50/50 p-2 rounded-lg border border-slate-100 mt-2">{p.instructions}</p>}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-400">No medications prescribed.</p>
                            )}
                        </div>
                    </div>

                    {/* Post-Op Advice */}
                    {clinicalNotes?.advice && (
                        <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 space-y-4">
                            <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">Post-Procedure Instructions</h4>
                            <p className="text-sm font-bold text-amber-900 leading-relaxed">&quot;{clinicalNotes.advice}&quot;</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end border-t border-slate-100 pt-8">
                <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Document Hash</p>
                    <p className="text-[8px] font-mono text-slate-300">sha256:d8e8f8f8...8f8f8f8</p>
                </div>
                <div className="text-right">
                    <div className="w-32 h-16 border-b border-slate-300 mb-2 invisible print:visible" />
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Authorized Signature</p>
                    <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Reg No: KDC/2024/001</p>
                </div>
            </div>
        </div>
    );
});

PrintableRx.displayName = 'PrintableRx';
