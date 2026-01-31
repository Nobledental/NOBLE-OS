'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Scissors, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { SurgeryRecord, SurgeryProcedure, SutureMaterial } from '@/types/periodontal.types';

interface GumSurgeryModuleProps {
    patientId: string;
    initialSurgeries?: SurgeryRecord[];
    onSurgeriesChange?: (surgeries: SurgeryRecord[]) => void;
}

const PROCEDURES: { value: SurgeryProcedure; label: string; description: string }[] = [
    { value: 'SRP', label: 'Scaling & Root Planing', description: 'Deep cleaning below gumline' },
    { value: 'GINGIVECTOMY', label: 'Gingivectomy', description: 'Removal of diseased gum tissue' },
    { value: 'FLAP', label: 'Flap Surgery', description: 'Periodontal flap for pocket reduction' },
    { value: 'MUCOGINGIVAL_GRAFT', label: 'Mucogingival Graft', description: 'Soft tissue grafting for recession' },
    { value: 'BONE_GRAFT', label: 'Bone Graft', description: 'Regenerative bone grafting' },
    { value: 'GTR', label: 'Guided Tissue Regeneration', description: 'GTR with membrane' }
];

const SUTURE_MATERIALS: SutureMaterial[] = ['3-0 Silk', '4-0 Vicryl', '5-0 Vicryl', '4-0 Chromic', '5-0 Prolene'];

export default function GumSurgeryModule({
    patientId,
    initialSurgeries = [],
    onSurgeriesChange
}: GumSurgeryModuleProps) {
    const [surgeries, setSurgeries] = useState<SurgeryRecord[]>(initialSurgeries);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newSurgery, setNewSurgery] = useState<Partial<SurgeryRecord>>({
        procedure: 'SRP',
        date: new Date().toISOString().split('T')[0],
        teethInvolved: [],
        notes: ''
    });
    const [teethInput, setTeethInput] = useState('');

    const addSurgery = () => {
        if (!newSurgery.date || !newSurgery.procedure) {
            toast.error('Please fill in date and procedure');
            return;
        }

        // Parse teeth from input (e.g., "16, 17, 18" or "16-18")
        const teethNumbers: number[] = [];
        teethInput.split(',').forEach(part => {
            const trimmed = part.trim();
            if (trimmed.includes('-')) {
                const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
                for (let i = start; i <= end; i++) teethNumbers.push(i);
            } else {
                const num = parseInt(trimmed);
                if (!isNaN(num)) teethNumbers.push(num);
            }
        });

        const surgery: SurgeryRecord = {
            id: `surgery-${Date.now()}`,
            date: newSurgery.date!,
            procedure: newSurgery.procedure as SurgeryProcedure,
            teethInvolved: teethNumbers,
            quadrant: newSurgery.quadrant,
            sutureMaterial: newSurgery.sutureMaterial,
            sutureRemovalDate: newSurgery.sutureRemovalDate,
            notes: newSurgery.notes || '',
            complications: newSurgery.complications
        };

        const updated = [...surgeries, surgery].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setSurgeries(updated);
        onSurgeriesChange?.(updated);

        // Reset form
        setNewSurgery({
            procedure: 'SRP',
            date: new Date().toISOString().split('T')[0],
            teethInvolved: [],
            notes: ''
        });
        setTeethInput('');
        setShowAddForm(false);

        toast.success('Surgery record added');
    };

    const deleteSurgery = (id: string) => {
        const updated = surgeries.filter(s => s.id !== id);
        setSurgeries(updated);
        onSurgeriesChange?.(updated);
        toast.info('Surgery record removed');
    };

    const needsSutureRemoval = surgeries.filter(s =>
        s.sutureMaterial &&
        s.sutureRemovalDate &&
        new Date(s.sutureRemovalDate) > new Date() &&
        new Date(s.sutureRemovalDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Gum Surgery Module</h3>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Log Surgery
                </Button>
            </div>

            {/* Suture Removal Reminders */}
            {needsSutureRemoval.length > 0 && (
                <Card className="p-3 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 mb-2">
                        <Scissors className="w-4 h-4" />
                        <span className="font-medium">Upcoming Suture Removals</span>
                    </div>
                    {needsSutureRemoval.map(s => (
                        <div key={s.id} className="text-sm flex items-center justify-between">
                            <span>{PROCEDURES.find(p => p.value === s.procedure)?.label} - Teeth: {s.teethInvolved.join(', ')}</span>
                            <Badge>{s.sutureRemovalDate}</Badge>
                        </div>
                    ))}
                </Card>
            )}

            {/* Add Surgery Form */}
            {showAddForm && (
                <Card className="p-4">
                    <h4 className="font-medium mb-3">New Surgery Record</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium block mb-1">Date</label>
                            <Input
                                type="date"
                                value={newSurgery.date}
                                onChange={(e) => setNewSurgery({ ...newSurgery, date: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium block mb-1">Procedure</label>
                            <select
                                value={newSurgery.procedure}
                                onChange={(e) => setNewSurgery({ ...newSurgery, procedure: e.target.value as SurgeryProcedure })}
                                className="w-full px-3 py-2 border rounded text-sm"
                            >
                                {PROCEDURES.map(p => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium block mb-1">Teeth Involved</label>
                            <Input
                                value={teethInput}
                                onChange={(e) => setTeethInput(e.target.value)}
                                placeholder="e.g., 16, 17, 18 or 16-18"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium block mb-1">Quadrant</label>
                            <select
                                value={newSurgery.quadrant || ''}
                                onChange={(e) => setNewSurgery({ ...newSurgery, quadrant: e.target.value as any })}
                                className="w-full px-3 py-2 border rounded text-sm"
                            >
                                <option value="">Select quadrant</option>
                                <option value="UR">Upper Right</option>
                                <option value="UL">Upper Left</option>
                                <option value="LR">Lower Right</option>
                                <option value="LL">Lower Left</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium block mb-1">Suture Material</label>
                            <select
                                value={newSurgery.sutureMaterial || ''}
                                onChange={(e) => setNewSurgery({ ...newSurgery, sutureMaterial: e.target.value as SutureMaterial })}
                                className="w-full px-3 py-2 border rounded text-sm"
                            >
                                <option value="">None / N/A</option>
                                {SUTURE_MATERIALS.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium block mb-1">Suture Removal Date</label>
                            <Input
                                type="date"
                                value={newSurgery.sutureRemovalDate || ''}
                                onChange={(e) => setNewSurgery({ ...newSurgery, sutureRemovalDate: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs font-medium block mb-1">Operative Notes</label>
                            <Textarea
                                value={newSurgery.notes}
                                onChange={(e) => setNewSurgery({ ...newSurgery, notes: e.target.value })}
                                placeholder="Document procedure details, anesthesia used, flap design, etc."
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Button onClick={addSurgery}>Add Surgery Record</Button>
                        <Button onClick={() => setShowAddForm(false)} variant="outline">Cancel</Button>
                    </div>
                </Card>
            )}

            {/* Surgery History */}
            <Card className="p-4">
                <h4 className="font-medium mb-3">Surgery History</h4>
                {surgeries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        <Scissors className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No surgeries recorded yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {surgeries.map(surgery => (
                            <div key={surgery.id} className="p-3 bg-muted/50 rounded">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Badge>{PROCEDURES.find(p => p.value === surgery.procedure)?.label}</Badge>
                                            <span className="text-sm text-muted-foreground">{surgery.date}</span>
                                        </div>
                                        <div className="text-sm mt-1">
                                            <span className="font-medium">Teeth:</span> {surgery.teethInvolved.join(', ') || 'N/A'}
                                            {surgery.quadrant && <span className="ml-2">({surgery.quadrant})</span>}
                                        </div>
                                        {surgery.sutureMaterial && (
                                            <div className="text-sm text-muted-foreground">
                                                Sutures: {surgery.sutureMaterial}
                                                {surgery.sutureRemovalDate && ` (Remove: ${surgery.sutureRemovalDate})`}
                                            </div>
                                        )}
                                        {surgery.notes && (
                                            <p className="text-sm mt-2">{surgery.notes}</p>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => deleteSurgery(surgery.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
