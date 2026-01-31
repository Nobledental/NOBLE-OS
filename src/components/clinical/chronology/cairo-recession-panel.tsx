'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Trash2, Scissors } from 'lucide-react';
import {
    CairoRT,
    CairoRecessionResult,
    classifyCairoRecession,
    getCairoRecessionDetails
} from '@/types/chronology.types';

interface RecessionEntry {
    id: string;
    toothNumber: number;
    hasInterdentalLoss: boolean;
    extendsToMGJ: boolean;
    result: CairoRecessionResult;
}

interface CairoRecessionPanelProps {
    onComplete?: (entries: RecessionEntry[]) => void;
}

const RT_COLORS: Record<CairoRT, string> = {
    'RT1': 'bg-green-500',
    'RT2': 'bg-yellow-500',
    'RT3': 'bg-red-500'
};

export default function CairoRecessionPanel({ onComplete }: CairoRecessionPanelProps) {
    const [entries, setEntries] = useState<RecessionEntry[]>([]);
    const [newEntry, setNewEntry] = useState({
        toothNumber: '' as number | '',
        hasInterdentalLoss: false,
        extendsToMGJ: false
    });

    const handleAdd = () => {
        if (!newEntry.toothNumber) {
            toast.error('Please enter a tooth number');
            return;
        }

        const classification = classifyCairoRecession(
            newEntry.hasInterdentalLoss,
            newEntry.extendsToMGJ
        );
        const result = getCairoRecessionDetails(newEntry.toothNumber, classification);

        const entry: RecessionEntry = {
            id: `rec-${Date.now()}`,
            toothNumber: newEntry.toothNumber,
            hasInterdentalLoss: newEntry.hasInterdentalLoss,
            extendsToMGJ: newEntry.extendsToMGJ,
            result
        };

        const updated = [...entries, entry];
        setEntries(updated);
        onComplete?.(updated);

        setNewEntry({ toothNumber: '', hasInterdentalLoss: false, extendsToMGJ: false });
        toast.success(`Classified as Cairo ${classification}`);
    };

    const handleRemove = (id: string) => {
        const updated = entries.filter(e => e.id !== id);
        setEntries(updated);
        onComplete?.(updated);
    };

    // Count by classification
    const counts = entries.reduce((acc, e) => {
        acc[e.result.classification] = (acc[e.result.classification] || 0) + 1;
        return acc;
    }, {} as Record<CairoRT, number>);

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Scissors className="w-5 h-5 text-pink-500" />
                        Cairo Recession Classification
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Replaces Miller's Classification (2018 Update)
                    </p>
                </div>
                {Object.entries(counts).length > 0 && (
                    <div className="flex gap-1">
                        {Object.entries(counts).map(([rt, count]) => (
                            <Badge key={rt} className={RT_COLORS[rt as CairoRT]}>
                                {rt}: {count}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Entry */}
            <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
                <div>
                    <label className="text-xs font-medium mb-1 block">Tooth #</label>
                    <Input
                        type="number"
                        placeholder="e.g. 31"
                        value={newEntry.toothNumber}
                        onChange={(e) => setNewEntry({ ...newEntry, toothNumber: e.target.value ? parseInt(e.target.value) : '' })}
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-2 text-sm">
                        <Switch
                            checked={newEntry.hasInterdentalLoss}
                            onCheckedChange={(c) => setNewEntry({ ...newEntry, hasInterdentalLoss: c })}
                        />
                        Interproximal CAL Loss
                    </label>
                </div>
                <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-2 text-sm">
                        <Switch
                            checked={newEntry.extendsToMGJ}
                            onCheckedChange={(c) => setNewEntry({ ...newEntry, extendsToMGJ: c })}
                            disabled={!newEntry.hasInterdentalLoss}
                        />
                        Extends to MGJ
                    </label>
                </div>
                <div className="flex items-end">
                    <Button onClick={handleAdd} className="w-full">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                    </Button>
                </div>
            </div>

            {/* Classification Guide */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                <div className="p-2 rounded bg-green-100 dark:bg-green-950/30">
                    <div className="font-bold flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-green-500" /> RT1
                    </div>
                    <div className="text-muted-foreground">No interproximal CAL loss</div>
                    <div className="text-green-700 dark:text-green-300">100% coverage possible</div>
                </div>
                <div className="p-2 rounded bg-yellow-100 dark:bg-yellow-950/30">
                    <div className="font-bold flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-yellow-500" /> RT2
                    </div>
                    <div className="text-muted-foreground">Interproximal CAL ≤ buccal</div>
                    <div className="text-yellow-700 dark:text-yellow-300">Partial coverage expected</div>
                </div>
                <div className="p-2 rounded bg-red-100 dark:bg-red-950/30">
                    <div className="font-bold flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-red-500" /> RT3
                    </div>
                    <div className="text-muted-foreground">Interproximal CAL &gt; buccal</div>
                    <div className="text-red-700 dark:text-red-300">Limited prognosis</div>
                </div>
            </div>

            {/* Recorded Recessions */}
            {entries.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                    <Scissors className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No recession sites recorded</p>
                    <p className="text-sm">Add gingival recession findings above</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {entries.map(entry => (
                        <div
                            key={entry.id}
                            className="p-3 rounded-lg bg-muted/50 border"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">Tooth #{entry.toothNumber}</Badge>
                                    <Badge className={RT_COLORS[entry.result.classification]}>
                                        Cairo {entry.result.classification}
                                    </Badge>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemove(entry.id)}
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                            <div className="text-sm space-y-1">
                                <p>{entry.result.description}</p>
                                <p className="text-muted-foreground">
                                    <strong>Prognosis:</strong> {entry.result.prognosis}
                                </p>
                                <p className="text-blue-600 dark:text-blue-400">
                                    → {entry.result.suggestedTreatment}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
