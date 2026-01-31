'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, FileText, CheckCircle2, Clock } from 'lucide-react';
import { EndodonticSitting, ProcedureType, Canal } from '@/types/endodontic.types';
import CanalGrid from './canal-grid';

interface SittingManagerProps {
    toothNumber: number;
    initialSittings?: EndodonticSitting[];
    onSittingsSave: (sittings: EndodonticSitting[]) => void;
}

const PROCEDURE_OPTIONS: { value: ProcedureType; label: string }[] = [
    { value: 'ACCESS_BMP', label: 'Access Opening & Biomechanical Preparation' },
    { value: 'DRESSING_CHANGE', label: 'Intracanal Dressing Change' },
    { value: 'OBTURATION', label: 'Obturation (Final Filling)' },
    { value: 'RECALL', label: 'Recall / Follow-up' }
];

export default function SittingManager({ toothNumber, initialSittings = [], onSittingsSave }: SittingManagerProps) {
    const [sittings, setSittings] = useState<EndodonticSitting[]>(
        initialSittings.length > 0 ? initialSittings : [createEmptySitting(1)]
    );
    const [activeSitting, setActiveSitting] = useState<number>(sittings.length);

    function createEmptySitting(sittingNumber: number, previousCanals?: Canal[]): EndodonticSitting {
        return {
            sittingNumber,
            date: new Date().toISOString().split('T')[0],
            procedure: sittingNumber === 1 ? 'ACCESS_BMP' : 'DRESSING_CHANGE',
            canals: previousCanals || [],
            notes: '',
            completed: false
        };
    }

    const getCurrentSitting = (): EndodonticSitting => {
        return sittings.find(s => s.sittingNumber === activeSitting) || sittings[0];
    };

    const updateCurrentSitting = (updates: Partial<EndodonticSitting>) => {
        const updated = sittings.map(sitting =>
            sitting.sittingNumber === activeSitting
                ? { ...sitting, ...updates }
                : sitting
        );
        setSittings(updated);
        onSittingsSave(updated);
    };

    const addNewSitting = () => {
        const lastSitting = sittings[sittings.length - 1];

        // Auto-populate canals from previous sitting (with WL and MAF data)
        const canalsFromPrevious: Canal[] = lastSitting.canals.map(canal => ({
            ...canal,
            id: `canal-${Date.now()}-${canal.name}` // New ID for React keys
        }));

        const newSitting = createEmptySitting(sittings.length + 1, canalsFromPrevious);
        const updated = [...sittings, newSitting];
        setSittings(updated);
        setActiveSitting(newSitting.sittingNumber);
        onSittingsSave(updated);
    };

    const markSittingComplete = () => {
        updateCurrentSitting({ completed: true });
    };

    const currentSitting = getCurrentSitting();
    const allCanalsComplete = currentSitting.canals.every(c =>
        c.workingLength > 0 && c.maf && c.masterCone
    );

    return (
        <div className="space-y-4">
            {/* Sitting Tabs */}
            <Tabs value={`sitting-${activeSitting}`} onValueChange={(val) => setActiveSitting(parseInt(val.split('-')[1]))}>
                <div className="flex items-center justify-between mb-4">
                    <TabsList>
                        {sittings.map(sitting => (
                            <TabsTrigger
                                key={sitting.sittingNumber}
                                value={`sitting-${sitting.sittingNumber}`}
                                className="relative"
                            >
                                <div className="flex items-center gap-2">
                                    {sitting.completed ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <Clock className="w-4 h-4" />
                                    )}
                                    <span>Sitting {sitting.sittingNumber}</span>
                                </div>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <Button onClick={addNewSitting} variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Add New Sitting
                    </Button>
                </div>

                {sittings.map(sitting => (
                    <TabsContent key={sitting.sittingNumber} value={`sitting-${sitting.sittingNumber}`}>
                        <div className="space-y-4">
                            {/* Sitting Header */}
                            <Card className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium block mb-2">Date</label>
                                        <input
                                            type="date"
                                            value={sitting.date}
                                            onChange={(e) => updateCurrentSitting({ date: e.target.value })}
                                            className="w-full px-3 py-2 border rounded text-sm"
                                            disabled={sitting.completed}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium block mb-2">Procedure Type</label>
                                        <select
                                            value={sitting.procedure}
                                            onChange={(e) => updateCurrentSitting({ procedure: e.target.value as ProcedureType })}
                                            className="w-full px-3 py-2 border rounded text-sm"
                                            disabled={sitting.completed}
                                        >
                                            {PROCEDURE_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-end">
                                        {sitting.completed ? (
                                            <Badge className="bg-green-500 h-fit">
                                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                                Completed
                                            </Badge>
                                        ) : (
                                            <Button
                                                onClick={markSittingComplete}
                                                disabled={!allCanalsComplete}
                                                size="sm"
                                                className="w-full"
                                            >
                                                Mark as Complete
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            {/* Auto-populated notice for subsequent sittings */}
                            {sitting.sittingNumber > 1 && sitting.canals.length > 0 && (
                                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3 rounded-lg text-sm">
                                    <div className="flex items-start gap-2">
                                        <FileText className="w-4 h-4 text-blue-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-blue-900 dark:text-blue-200">
                                                Auto-populated from Sitting {sitting.sittingNumber - 1}
                                            </p>
                                            <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                                                Canal measurements (WL, MAF) have been carried forward. You can modify if needed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Canal Grid */}
                            <CanalGrid
                                toothNumber={toothNumber}
                                initialCanals={sitting.canals}
                                onCanalsChange={(canals) => updateCurrentSitting({ canals })}
                            />

                            {/* Clinical Notes */}
                            <Card className="p-4">
                                <label className="text-sm font-medium block mb-2">Clinical Notes</label>
                                <Textarea
                                    value={sitting.notes || ''}
                                    onChange={(e) => updateCurrentSitting({ notes: e.target.value })}
                                    placeholder="Add notes about irrigation protocol, medicament used, patient response, etc."
                                    rows={4}
                                    disabled={sitting.completed}
                                    className="text-sm"
                                />
                            </Card>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Treatment Timeline */}
            <Card className="p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Treatment Timeline
                </h4>
                <div className="space-y-2">
                    {sittings.map((sitting, index) => (
                        <div key={sitting.sittingNumber} className="flex items-center gap-3 text-sm">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${sitting.completed ? 'bg-green-500 text-white' : 'bg-muted'
                                }`}>
                                {sitting.sittingNumber}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">
                                    {PROCEDURE_OPTIONS.find(p => p.value === sitting.procedure)?.label}
                                </p>
                                <p className="text-xs text-muted-foreground">{sitting.date}</p>
                            </div>
                            {sitting.completed && (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
