'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import {
    Canal,
    CanalName,
    ReferencePoint,
    validateWorkingLength,
    getCanalsForTooth
} from '@/types/endodontic.types';

interface CanalGridProps {
    toothNumber: number;
    initialCanals?: Canal[];
    onCanalsChange: (canals: Canal[]) => void;
}

const CANAL_OPTIONS: CanalName[] = ['MB', 'MB2', 'ML', 'DB', 'DL', 'D', 'M', 'P', 'L', 'B'];
const REFERENCE_POINTS: ReferencePoint[] = [
    'Cusp Tip',
    'Incisal Edge',
    'Buccal Cusp',
    'Palatal Cusp',
    'Mesial Cusp',
    'Distal Cusp'
];

export default function CanalGrid({ toothNumber, initialCanals, onCanalsChange }: CanalGridProps) {
    const [canals, setCanals] = useState<Canal[]>(initialCanals || []);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Auto-populate suggested canals when tooth number changes
    useEffect(() => {
        if (!initialCanals || initialCanals.length === 0) {
            const suggestedCanals = getCanalsForTooth(toothNumber);
            const defaultCanals: Canal[] = suggestedCanals.map((name, index) => ({
                id: `canal-${Date.now()}-${index}`,
                name,
                referencePoint: 'Cusp Tip',
                workingLength: 0,
                maf: '',
                masterCone: ''
            }));
            setCanals(defaultCanals);
        }
    }, [toothNumber, initialCanals]);

    const addCanal = () => {
        const newCanal: Canal = {
            id: `canal-${Date.now()}`,
            name: 'MB',
            referencePoint: 'Cusp Tip',
            workingLength: 0,
            maf: '',
            masterCone: ''
        };
        const updated = [...canals, newCanal];
        setCanals(updated);
        onCanalsChange(updated);
    };

    const removeCanal = (id: string) => {
        const updated = canals.filter(c => c.id !== id);
        setCanals(updated);
        onCanalsChange(updated);
        // Remove error for deleted canal
        const { [id]: _, ...remainingErrors } = errors;
        setErrors(remainingErrors);
    };

    const updateCanal = (id: string, field: keyof Canal, value: any) => {
        const updated = canals.map(canal => {
            if (canal.id === id) {
                const updatedCanal = { ...canal, [field]: value };

                // Validate working length
                if (field === 'workingLength') {
                    const wl = parseFloat(value);
                    const validation = validateWorkingLength(wl);
                    if (!validation.valid) {
                        setErrors(prev => ({ ...prev, [id]: validation.error || '' }));
                    } else {
                        setErrors(prev => {
                            const { [id]: _, ...rest } = prev;
                            return rest;
                        });
                    }
                }

                return updatedCanal;
            }
            return canal;
        });

        setCanals(updated);
        onCanalsChange(updated);
    };

    const isComplete = (canal: Canal): boolean => {
        return (
            canal.workingLength > 0 &&
            canal.maf.trim() !== '' &&
            canal.masterCone.trim() !== '' &&
            !errors[canal.id]
        );
    };

    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Canal Measurements</h3>
                    <p className="text-sm text-muted-foreground">
                        Tooth #{toothNumber} - {canals.length} canal{canals.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Button onClick={addCanal} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Canal
                </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted">
                        <tr>
                            <th className="text-left p-3 text-sm font-medium">Canal</th>
                            <th className="text-left p-3 text-sm font-medium">Reference Point</th>
                            <th className="text-left p-3 text-sm font-medium">WL (mm)</th>
                            <th className="text-left p-3 text-sm font-medium">MAF</th>
                            <th className="text-left p-3 text-sm font-medium">Master Cone</th>
                            <th className="text-center p-3 text-sm font-medium">Status</th>
                            <th className="text-center p-3 text-sm font-medium w-16"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {canals.map((canal) => (
                            <tr key={canal.id} className="border-t">
                                <td className="p-3">
                                    <select
                                        value={canal.name}
                                        onChange={(e) => updateCanal(canal.id, 'name', e.target.value as CanalName)}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    >
                                        {CANAL_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-3">
                                    <select
                                        value={canal.referencePoint}
                                        onChange={(e) => updateCanal(canal.id, 'referencePoint', e.target.value)}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    >
                                        {REFERENCE_POINTS.map(ref => (
                                            <option key={ref} value={ref}>{ref}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-3">
                                    <div className="space-y-1">
                                        <Input
                                            type="number"
                                            step="0.5"
                                            min="15"
                                            max="30"
                                            value={canal.workingLength || ''}
                                            onChange={(e) => updateCanal(canal.id, 'workingLength', e.target.value)}
                                            className={`text-sm ${errors[canal.id] ? 'border-red-500' : ''}`}
                                            placeholder="22.5"
                                        />
                                        {errors[canal.id] && (
                                            <p className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors[canal.id]}
                                            </p>
                                        )}
                                    </div>
                                </td>
                                <td className="p-3">
                                    <Input
                                        type="text"
                                        value={canal.maf}
                                        onChange={(e) => updateCanal(canal.id, 'maf', e.target.value)}
                                        className="text-sm"
                                        placeholder="25/.06"
                                    />
                                </td>
                                <td className="p-3">
                                    <Input
                                        type="text"
                                        value={canal.masterCone}
                                        onChange={(e) => updateCanal(canal.id, 'masterCone', e.target.value)}
                                        className="text-sm"
                                        placeholder="25"
                                    />
                                </td>
                                <td className="p-3 text-center">
                                    {isComplete(canal) ? (
                                        <Badge variant="default" className="bg-green-500">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Complete
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">Pending</Badge>
                                    )}
                                </td>
                                <td className="p-3 text-center">
                                    <Button
                                        onClick={() => removeCanal(canal.id)}
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {canals.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No canals added yet</p>
                    <p className="text-xs mt-1">Click "Add Canal" to start tracking measurements</p>
                </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3 rounded-lg text-xs space-y-1">
                <p className="font-medium text-blue-900 dark:text-blue-200">📏 Measurement Guidelines</p>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 ml-4 list-disc">
                    <li>Working Length must be between 15-30mm</li>
                    <li>MAF format: File size / Taper (e.g., 25/.06)</li>
                    <li>Master Cone should match MAF size (ISO standard)</li>
                    <li>All fields must be completed before saving sitting</li>
                </ul>
            </div>
        </Card>
    );
}
