'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AlertCircle, Plus, Trash2, CircleDashed } from 'lucide-react';
import { classifyToothWear, ToothWearResult, WearType } from '@/types/clinical-indices.types';

interface ToothWearEntry {
    id: string;
    toothNumber: number;
    location: 'Incisal' | 'Occlusal' | 'Cervical' | 'Facial';
    morphology: 'Flat' | 'Cupped' | 'V-shaped' | 'Wedge' | 'Saucer';
    result: ToothWearResult;
}

interface ToothWearTrackerProps {
    onWearRecorded?: (entries: ToothWearEntry[]) => void;
}

const WEAR_TYPE_COLORS: Record<WearType, string> = {
    'Attrition': 'bg-purple-500',
    'Abrasion': 'bg-blue-500',
    'Erosion': 'bg-orange-500',
    'Abfraction': 'bg-yellow-500'
};

export default function ToothWearTracker({ onWearRecorded }: ToothWearTrackerProps) {
    const [entries, setEntries] = useState<ToothWearEntry[]>([]);
    const [newEntry, setNewEntry] = useState({
        toothNumber: '' as number | '',
        location: '' as 'Incisal' | 'Occlusal' | 'Cervical' | 'Facial' | '',
        morphology: '' as 'Flat' | 'Cupped' | 'V-shaped' | 'Wedge' | 'Saucer' | ''
    });

    const handleAdd = () => {
        if (!newEntry.toothNumber || !newEntry.location || !newEntry.morphology) {
            toast.error('Please fill all fields');
            return;
        }

        const result = classifyToothWear(
            newEntry.location as 'Incisal' | 'Occlusal' | 'Cervical' | 'Facial',
            newEntry.morphology as 'Flat' | 'Cupped' | 'V-shaped' | 'Wedge' | 'Saucer'
        );

        const entry: ToothWearEntry = {
            id: `wear-${Date.now()}`,
            toothNumber: newEntry.toothNumber,
            location: newEntry.location as 'Incisal' | 'Occlusal' | 'Cervical' | 'Facial',
            morphology: newEntry.morphology as 'Flat' | 'Cupped' | 'V-shaped' | 'Wedge' | 'Saucer',
            result
        };

        const updated = [...entries, entry];
        setEntries(updated);
        onWearRecorded?.(updated);

        setNewEntry({ toothNumber: '', location: '', morphology: '' });
        toast.success(`Classified as ${result.type}`);
    };

    const handleRemove = (id: string) => {
        const updated = entries.filter(e => e.id !== id);
        setEntries(updated);
        onWearRecorded?.(updated);
    };

    // Count wear types
    const wearCounts = entries.reduce((acc, e) => {
        acc[e.result.type] = (acc[e.result.type] || 0) + 1;
        return acc;
    }, {} as Record<WearType, number>);

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CircleDashed className="w-5 h-5" />
                    Tooth Wear Tracker
                </h3>
                {Object.entries(wearCounts).length > 0 && (
                    <div className="flex gap-1">
                        {Object.entries(wearCounts).map(([type, count]) => (
                            <Badge key={type} className={WEAR_TYPE_COLORS[type as WearType]}>
                                {type}: {count}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Add New Entry */}
            <div className="grid grid-cols-4 gap-3 mb-4">
                <Input
                    type="number"
                    placeholder="Tooth #"
                    value={newEntry.toothNumber}
                    onChange={(e) => setNewEntry({ ...newEntry, toothNumber: e.target.value ? parseInt(e.target.value) : '' })}
                />
                <Select
                    value={newEntry.location}
                    onValueChange={(v: any) => setNewEntry({ ...newEntry, location: v })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Incisal">Incisal Edge</SelectItem>
                        <SelectItem value="Occlusal">Occlusal Surface</SelectItem>
                        <SelectItem value="Cervical">Cervical Third</SelectItem>
                        <SelectItem value="Facial">Facial Surface</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={newEntry.morphology}
                    onValueChange={(v: any) => setNewEntry({ ...newEntry, morphology: v })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Morphology" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Flat">Flat (wear facets)</SelectItem>
                        <SelectItem value="Cupped">Cupped (scooped)</SelectItem>
                        <SelectItem value="V-shaped">V-shaped (notch)</SelectItem>
                        <SelectItem value="Wedge">Wedge-shaped</SelectItem>
                        <SelectItem value="Saucer">Saucer-shaped</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                </Button>
            </div>

            {/* Wear Entries */}
            {entries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <CircleDashed className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No tooth wear recorded</p>
                    <p className="text-sm">Add wear lesions to classify Attrition, Abrasion, Erosion, or Abfraction</p>
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
                                    <Badge className={WEAR_TYPE_COLORS[entry.result.type]}>
                                        {entry.result.type}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {entry.location} • {entry.morphology}
                                    </span>
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
                                    <strong>Likely Cause:</strong> {entry.result.likelyCause}
                                </p>
                                <p className="text-blue-600 dark:text-blue-400">
                                    → {entry.result.suggestedAction}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Bruxism Warning */}
            {wearCounts['Attrition'] && wearCounts['Attrition'] >= 3 && (
                <div className="mt-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200">
                    <div className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">Bruxism Pattern Detected</span>
                    </div>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                        Multiple attrition sites suggest parafunctional habit. Recommend night guard and sleep study referral.
                    </p>
                </div>
            )}
        </Card>
    );
}
