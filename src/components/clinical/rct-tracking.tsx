'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Save, Package, Bell } from 'lucide-react';
import { toast } from 'sonner';
import SittingManager from './sitting-manager';
import { EndodonticSitting, EndodonticMetadata } from '@/types/endodontic.types';

interface RCTTrackingProps {
    patientId: string;
    dentalRecordId?: string;
}

export default function RCTTrackingModule({ patientId, dentalRecordId }: RCTTrackingProps) {
    const [toothNumber, setToothNumber] = useState<number>(16);
    const [cavityClass, setCavityClass] = useState<string>('I');
    const [sittings, setSittings] = useState<EndodonticSitting[]>([]);
    const [obturated, setObturated] = useState<boolean>(false);
    const [obturationDate, setObturationDate] = useState<string>('');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!toothNumber || sittings.length === 0) {
            toast.error('Please add at least one sitting with canal measurements');
            return;
        }

        const metadata: EndodonticMetadata = {
            toothNumber,
            cavityClass,
            sittings,
            obturated,
            obturationDate: obturated ? obturationDate : undefined,
            postEndoNotificationScheduled: obturated
        };

        setSaving(true);

        try {
            const response = await fetch('/api/clinical/rct/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dentalRecordId,
                    patientId,
                    metadata
                })
            });

            if (!response.ok) throw new Error('Failed to save RCT data');

            const result = await response.json();

            // Trigger inventory deduction if obturation is completed
            if (obturated && result.clinicalNoteId) {
                await handleInventoryDeduction(result.clinicalNoteId);
            }

            // Schedule post-endo notification
            if (obturated) {
                await schedulePostEndoNotification();
            }

            toast.success('RCT data saved successfully!');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save RCT data');
        } finally {
            setSaving(false);
        }
    };

    const handleInventoryDeduction = async (clinicalNoteId: string) => {
        try {
            // Get master cone size from last sitting
            const lastSitting = sittings[sittings.length - 1];
            const masterConeSize = lastSitting.canals[0]?.masterCone || '25';

            const response = await fetch('/api/inventory/deduct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: [
                        { itemName: 'Gutta Percha Point', quantity: 1, size: masterConeSize },
                        { itemName: 'Sealer', quantity: 0.5, unit: 'ml' },
                        { itemName: 'Paper Point', quantity: 1 }
                    ],
                    reason: 'OBTURATION_COMPLETED',
                    patientId,
                    toothNumber,
                    clinicalNoteId
                })
            });

            if (response.ok) {
                toast.success('Inventory updated automatically', {
                    icon: <Package className="w-4 h-4" />
                });
            }
        } catch (error) {
            console.error('Inventory deduction error:', error);
            // Don't fail the main save if inventory fails
        }
    };

    const schedulePostEndoNotification = async () => {
        try {
            const response = await fetch('/api/notifications/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    message: `How is tooth #${toothNumber} feeling? Minimal discomfort is normal. Remember to avoid chewing hard foods until your crown is placed.`,
                    delayHours: 24,
                    type: 'POST_ENDO_REMINDER',
                    metadata: { toothNumber }
                })
            });

            if (response.ok) {
                toast.success('24-hour reminder scheduled for patient', {
                    icon: <Bell className="w-4 h-4" />
                });
            }
        } catch (error) {
            console.error('Notification scheduling error:', error);
        }
    };

    const completedSittings = sittings.filter(s => s.completed).length;

    return (
        <div className="space-y-4">
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold">Endodontic Protocol Tracker</h3>
                    <Badge variant="outline" className="ml-auto">
                        {completedSittings}/{sittings.length} Sittings Complete
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-sm font-medium block mb-2">Tooth Number *</label>
                        <Input
                            type="number"
                            min="11"
                            max="48"
                            value={toothNumber}
                            onChange={(e) => setToothNumber(parseInt(e.target.value))}
                            placeholder="16"
                            className="text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-2">Cavity Classification</label>
                        <select
                            value={cavityClass}
                            onChange={(e) => setCavityClass(e.target.value)}
                            className="w-full px-3 py-2 border rounded text-sm"
                        >
                            <option value="I">Class I</option>
                            <option value="II">Class II</option>
                            <option value="III">Class III</option>
                            <option value="IV">Class IV</option>
                            <option value="V">Class V</option>
                            <option value="VI">Class VI</option>
                        </select>
                    </div>
                </div>

                {/* Obturation Status */}
                <Card className="p-4 bg-muted/30">
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="obturated"
                            checked={obturated}
                            onCheckedChange={(checked) => setObturated(checked as boolean)}
                        />
                        <div className="flex-1">
                            <label
                                htmlFor="obturated"
                                className="font-medium text-sm cursor-pointer"
                            >
                                Mark as Obturated (Completed)
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">
                                This will automatically deduct inventory and schedule a 24-hour patient reminder
                            </p>

                            {obturated && (
                                <div className="mt-3">
                                    <label className="text-xs font-medium block mb-1">Obturation Date</label>
                                    <Input
                                        type="date"
                                        value={obturationDate}
                                        onChange={(e) => setObturationDate(e.target.value)}
                                        className="text-sm max-w-xs"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </Card>

            {/* Sitting Manager with Canal Grid */}
            <SittingManager
                toothNumber={toothNumber}
                initialSittings={sittings}
                onSittingsSave={setSittings}
            />

            {/* Save Button */}
            <div className="flex justify-end gap-3">
                <Button onClick={handleSave} disabled={saving} size="lg">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save RCT Record'}
                </Button>
            </div>

            {/* Audit Ready Notice */}
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 p-4 rounded-lg text-sm">
                <p className="font-medium text-purple-900 dark:text-purple-200">🏆 Audit-Ready Documentation</p>
                <p className="text-purple-700 dark:text-purple-300 mt-1">
                    All canal measurements (WL, MAF, Master Cone) are digitally tracked per sitting. This provides complete clinical audit trail for insurance claims and legal compliance.
                </p>
            </div>
        </div>
    );
}
