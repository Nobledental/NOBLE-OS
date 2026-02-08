'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Syringe, Plus, Search, Printer, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import { ToothState } from '@/types/clinical';
import { PrintableRx } from './printable-rx';
import { useReactToPrint } from 'react-to-print';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const commonDrugs = [
    { name: 'Amoxicillin 500mg', dosage: '1-0-1', duration: '5 days', category: 'Antibiotic' },
    { name: 'Metronidazole 400mg', dosage: '1-1-1', duration: '5 days', category: 'Antibiotic' },
    { name: 'Ibuprofen 400mg', dosage: '1-1-1', duration: '3 days', category: 'Analgesic' },
    { name: 'Paracetamol 500mg', dosage: '1-1-1', duration: '3 days', category: 'Analgesic' },
    { name: 'Chlorhexidine Mouthwash', dosage: 'Twice daily', duration: '7 days', category: 'Antiseptic' },
    { name: 'Zerodol-SP', dosage: '1-0-1', duration: '3 days', category: 'Analgesic' }
];

interface Prescription {
    drug: string;
    dosage: string;
    duration: string;
    instructions?: string;
}

interface PrescriptionEngineProps {
    patientId: string;
    toothData?: Record<string, ToothState>;
    clinicalNotes?: {
        subjective?: string;
        assessment?: string;
        advice?: string;
    };
}

export default function PrescriptionEngine({ patientId, toothData, clinicalNotes }: PrescriptionEngineProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Rx_${patientId}_${new Date().toISOString().split('T')[0]}`,
        onAfterPrint: () => toast.success('Prescription printed successfully'),
    });

    const filteredDrugs = commonDrugs.filter(drug =>
        drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drug.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToPrescription = (drug: any) => {
        const existing = prescriptions.find(p => p.drug === drug.name);
        if (existing) {
            toast.error('Drug already added');
            return;
        }

        setPrescriptions([...prescriptions, {
            drug: drug.name,
            dosage: drug.dosage,
            duration: drug.duration,
            instructions: ''
        }]);
        setSearchTerm('');
        toast.success('Added to prescription');
    };

    const removePrescription = (index: number) => {
        setPrescriptions(prescriptions.filter((_, i) => i !== index));
    };

    return (
        <Card className="h-full bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-slate-900 p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black italic tracking-tighter flex items-center gap-3">
                            <Syringe className="w-6 h-6 text-indigo-400" />
                            Rx Engine
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Smart Medication Builder</p>
                    </div>
                    {prescriptions.length > 0 && (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsPreviewOpen(true)}
                                className="rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px] gap-2 h-10 px-4"
                            >
                                <Eye className="w-4 h-4" /> Preview
                            </Button>
                            <Button
                                size="sm"
                                onClick={handlePrint}
                                className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold uppercase tracking-widest text-[10px] gap-2 h-10 px-4"
                            >
                                <Printer className="w-4 h-4" /> Print Rx
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8 space-y-6 flex-1 overflow-y-auto">
                {/* Drug Search */}
                <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Find Medication</Label>
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Type drug name or category (e.g. Antibiotic)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-14 pr-8 py-6 bg-slate-50 border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-sm transition-all shadow-inner"
                        />
                    </div>
                </div>

                {/* Search Results */}
                {searchTerm && (
                    <div className="border border-slate-100 rounded-[2rem] max-h-60 overflow-y-auto bg-white shadow-lg">
                        {filteredDrugs.length === 0 ? (
                            <div className="text-center text-slate-400 py-8 font-bold italic">No medications matched your search</div>
                        ) : (
                            filteredDrugs.map((drug, index) => (
                                <div
                                    key={index}
                                    className="p-5 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center justify-between transition-colors group"
                                    onClick={() => addToPrescription(drug)}
                                >
                                    <div className="space-y-1">
                                        <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{drug.name}</div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{drug.category} • Default: {drug.dosage}</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Current Prescription */}
                <div className="space-y-4">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Prescribed List ({prescriptions.length})</Label>
                    {prescriptions.length > 0 ? (
                        <div className="space-y-3">
                            {prescriptions.map((prescription, index) => (
                                <div key={index} className="bg-slate-50/50 border border-slate-100 p-6 rounded-[2rem] space-y-4 shadow-sm group hover:border-indigo-200 transition-all">
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-lg italic tracking-tighter text-slate-900 uppercase">{prescription.drug}</span>
                                        <button
                                            onClick={() => removePrescription(index)}
                                            className="text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Dosage</Label>
                                            <Input
                                                value={prescription.dosage}
                                                onChange={(e) => {
                                                    const updated = [...prescriptions];
                                                    updated[index].dosage = e.target.value;
                                                    setPrescriptions(updated);
                                                }}
                                                className="h-10 bg-white border-slate-100 rounded-xl font-bold text-xs"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Duration</Label>
                                            <Input
                                                value={prescription.duration}
                                                onChange={(e) => {
                                                    const updated = [...prescriptions];
                                                    updated[index].duration = e.target.value;
                                                    setPrescriptions(updated);
                                                }}
                                                className="h-10 bg-white border-slate-100 rounded-xl font-bold text-xs"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Special Instructions</Label>
                                        <Input
                                            placeholder="Example: Take after breakfast..."
                                            value={prescription.instructions}
                                            onChange={(e) => {
                                                const updated = [...prescriptions];
                                                updated[index].instructions = e.target.value;
                                                setPrescriptions(updated);
                                            }}
                                            className="h-10 bg-white border-slate-100 rounded-xl font-bold text-xs"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 gap-2">
                            <Syringe className="w-8 h-8 opacity-20" />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Prescription is empty</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden Printable Component */}
            <div className="hidden">
                <PrintableRx
                    ref={componentRef}
                    patientName="Dhivakaran"
                    date={new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    toothData={toothData}
                    prescriptions={prescriptions}
                    clinicalNotes={clinicalNotes}
                />
            </div>

            {/* Preview Modal */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-[850px] p-0 overflow-y-auto max-h-[90vh] bg-slate-900 border-none shadow-none rounded-[3rem]">
                    <div className="transform scale-[0.95] origin-top p-6">
                        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                            <PrintableRx
                                patientName="Dhivakaran"
                                date={new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                toothData={toothData}
                                prescriptions={prescriptions}
                                clinicalNotes={clinicalNotes}
                            />
                            <div className="absolute top-6 right-6 flex gap-2 no-print">
                                <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-xs gap-2">
                                    <Printer className="w-4 h-4" /> Final Print
                                </Button>
                                <Button variant="secondary" onClick={() => setIsPreviewOpen(false)} className="rounded-2xl h-12 w-12 p-0 bg-white/20 hover:bg-white/30 text-white">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

