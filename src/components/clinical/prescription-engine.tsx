'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Syringe, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

const commonDrugs = [
    { name: 'Amoxicillin 500mg', dosage: '1-0-1', duration: '5 days', category: 'Antibiotic' },
    { name: 'Metronidazole 400mg', dosage: '1-1-1', duration: '5 days', category: 'Antibiotic' },
    { name: 'Ibuprofen 400mg', dosage: '1-1-1', duration: '3 days', category: 'Analgesic' },
    { name: 'Paracetamol 500mg', dosage: '1-1-1', duration: '3 days', category: 'Analgesic' },
    { name: 'Chlorhexidine Mouthwash', dosage: 'Twice daily', duration: '7 days', category: 'Antiseptic' },
    { name: 'Pantoprazole 40mg', dosage: '1-0-0', duration: '5 days', category: 'Antacid' }
];

interface Prescription {
    drug: string;
    dosage: string;
    duration: string;
    instructions?: string;
}

export default function PrescriptionEngine({ patientId }: { patientId?: string }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [selectedDrug, setSelectedDrug] = useState<any>(null);

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

    const savePrescription = async () => {
        // Save to backend
        toast.success('Prescription saved successfully');
    };

    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
                <Syringe className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Prescription Engine</h3>
            </div>

            {/* Drug Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search drugs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Search Results */}
            {searchTerm && (
                <div className="border rounded-lg max-h-60 overflow-y-auto">
                    {filteredDrugs.length === 0 ? (
                        <div className="text-center text-muted-foreground py-4">No drugs found</div>
                    ) : (
                        filteredDrugs.map((drug, index) => (
                            <div
                                key={index}
                                className="p-3 hover:bg-muted cursor-pointer border-b last:border-0 flex items-center justify-between"
                                onClick={() => addToPrescription(drug)}
                            >
                                <div>
                                    <div className="font-medium">{drug.name}</div>
                                    <div className="text-xs text-muted-foreground">{drug.category} • {drug.dosage}</div>
                                </div>
                                <Plus className="w-4 h-4 text-muted-foreground" />
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Current Prescription */}
            {prescriptions.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                    <h4 className="font-medium">Current Prescription</h4>
                    {prescriptions.map((prescription, index) => (
                        <div key={index} className="bg-muted/50 p-3 rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{prescription.drug}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removePrescription(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <Label className="text-xs">Dosage</Label>
                                    <p className="text-muted-foreground">{prescription.dosage}</p>
                                </div>
                                <div>
                                    <Label className="text-xs">Duration</Label>
                                    <p className="text-muted-foreground">{prescription.duration}</p>
                                </div>
                            </div>
                            <Input
                                placeholder="Special instructions (optional)"
                                value={prescription.instructions}
                                onChange={(e) => {
                                    const updated = [...prescriptions];
                                    updated[index].instructions = e.target.value;
                                    setPrescriptions(updated);
                                }}
                                className="text-sm"
                            />
                        </div>
                    ))}
                    <Button onClick={savePrescription} className="w-full">
                        Save & Print Prescription
                    </Button>
                </div>
            )}
        </Card>
    );
}
