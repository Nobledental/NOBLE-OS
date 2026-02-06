"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, FileText, AlertTriangle, ArrowRight, CheckCircle2, History, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DENTAL_CONSENT_TEMPLATES, ConsentTemplate, ConsentRecord } from '@/types/clinical';
import { SignaturePad } from '@/components/shared/signature-pad';

export const SurgicalConsentVault: React.FC<{
    patientId: string;
    onConsentSigned?: (record: ConsentRecord) => void;
}> = ({ patientId, onConsentSigned }) => {
    const [selectedTemplate, setSelectedTemplate] = useState<ConsentTemplate | null>(null);
    const [isSigning, setIsSigning] = useState(false);
    const [patientSign, setPatientSign] = useState('');
    const [doctorSign, setDoctorSign] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTemplates = DENTAL_CONSENT_TEMPLATES.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSign = () => {
        if (!selectedTemplate || !patientSign || !doctorSign) return;

        const newRecord: ConsentRecord = {
            id: Math.random().toString(36).substr(2, 9),
            patientId,
            templateId: selectedTemplate.id,
            patientSignature: patientSign,
            doctorSignature: doctorSign,
            timestamp: new Date().toISOString(),
            status: 'signed'
        };

        onConsentSigned?.(newRecord);
        setIsSigning(false);
        setSelectedTemplate(null);
        setPatientSign('');
        setDoctorSign('');
    };

    return (
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-indigo-600 px-8 py-10 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black italic tracking-tighter">Surgical Consent Vault</h2>
                        <p className="text-indigo-100/70 text-sm font-medium">Procedural risk disclosure and digital signatures.</p>
                    </div>
                    <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
            </div>

            <div className="p-8">
                <AnimatePresence mode="wait">
                    {!selectedTemplate ? (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search procedural templates (Extraction, RCT, Implant...)"
                                    className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none font-bold transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredTemplates.map(template => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template)}
                                        className="p-8 bg-white border border-slate-100 rounded-[2.5rem] text-left hover:border-indigo-300 hover:shadow-xl transition-all group relative overflow-hidden"
                                    >
                                        <div className="relative z-10 space-y-4">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black italic tracking-tighter text-slate-900">{template.title}</h3>
                                                <p className="text-sm text-slate-400 font-medium leading-relaxed mt-1">{template.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 opacity-0 group-hover:opacity-100 transition-all">
                                                Open Template <ArrowRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="template"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <button
                                onClick={() => setSelectedTemplate(null)}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2"
                            >
                                ← Back to Vault
                            </button>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Left Side: Terms */}
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black italic tracking-tighter text-slate-900">{selectedTemplate.title}</h3>
                                        <div className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-amber-100 flex items-center gap-2">
                                            <AlertTriangle className="w-3 h-3" /> Potential Surgical Risks
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Alternatives Considered</h4>
                                            <ul className="space-y-2">
                                                {selectedTemplate.alternatives.map((alt, i) => (
                                                    <li key={i} className="text-sm font-medium text-slate-600 flex items-start gap-2">
                                                        <span className="w-1 h-4 bg-slate-200 rounded-full mt-0.5" /> {alt}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100 space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-rose-900 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-rose-500" /> Declared Risks</h4>
                                            <ul className="space-y-2">
                                                {selectedTemplate.risks.map((risk, i) => (
                                                    <li key={i} className="text-sm font-medium text-rose-800 flex items-start gap-2">
                                                        <span className="w-1 h-4 bg-rose-200 rounded-full mt-0.5" /> {risk}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                                        <p className="text-sm font-bold text-indigo-900 leading-relaxed italic">
                                            &quot;{selectedTemplate.acknowledgement}&quot;
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side: Signatures */}
                                <div className="space-y-8 bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100">
                                    <SignaturePad
                                        label="Patient Signature"
                                        onSave={setPatientSign}
                                    />
                                    <SignaturePad
                                        label="Doctor Signature"
                                        onSave={setDoctorSign}
                                    />

                                    <button
                                        disabled={!patientSign || !doctorSign}
                                        onClick={handleSign}
                                        className={cn(
                                            "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all transform active:scale-95 shadow-xl flex items-center justify-center gap-2",
                                            (patientSign && doctorSign)
                                                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30"
                                                : "bg-slate-200 text-slate-400 grayscale cursor-not-allowed"
                                        )}
                                    >
                                        <ShieldCheck className="w-4 h-4" /> Finalize & Commit Consent
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer / History Toggle */}
            <div className="border-t border-slate-100 px-8 py-6 bg-slate-50/30 flex justify-between items-center">
                <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest">
                    <History className="w-4 h-4" /> View Signature Audit Trail
                </button>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    Encrypted & Time-stamped (ABDM Compliant)
                </div>
            </div>
        </div>
    );
};
