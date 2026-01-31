'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smile, Save } from 'lucide-react';
import { toast } from 'sonner';

interface CephalometricProps {
    patientId: string;
}

export default function CephalometricModule({ patientId }: CephalometricProps) {
    const [sna, setSna] = useState<string>('');
    const [snb, setSnb] = useState<string>('');
    const [anb, setAnb] = useState<string>('');
    const [facialAngle, setFacialAngle] = useState<string>('');
    const [profileType, setProfileType] = useState<string>('');

    const calculateANB = () => {
        if (sna && snb) {
            const anbValue = (parseFloat(sna) - parseFloat(snb)).toFixed(1);
            setAnb(anbValue);
        }
    };

    const determineProfileType = () => {
        if (!anb) return '';
        const anbValue = parseFloat(anb);
        if (anbValue < 2) return 'CONCAVE (Class III tendency)';
        if (anbValue > 4) return 'CONVEX (Class II tendency)';
        return 'STRAIGHT (Class I normal)';
    };

    const saveCephalometricData = async () => {
        const response = await fetch('/api/clinical/ortho/cephalometric', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dentalRecordId: 'current-dental-record-id',
                data: {
                    sna: parseFloat(sna),
                    snb: parseFloat(snb),
                    anb: parseFloat(anb),
                    facialAngle: parseFloat(facialAngle),
                    profileType,
                    doctorId: 'current-doctor-id'
                }
            })
        });

        if (response.ok) {
            toast.success('Cephalometric data saved successfully');
        } else {
            toast.error('Failed to save data');
        }
    };

    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
                <Smile className="w-5 h-5 text-pink-500" />
                <h3 className="text-lg font-semibold">Cephalometric Analysis</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>SNA (Maxillary Position)</Label>
                    <Input
                        type="number"
                        step="0.5"
                        value={sna}
                        onChange={(e) => setSna(e.target.value)}
                        onBlur={calculateANB}
                        placeholder="Normal: 82°"
                    />
                    <span className="text-xs text-muted-foreground">Normal: 82° ± 3.5°</span>
                </div>

                <div className="space-y-2">
                    <Label>SNB (Mandibular Position)</Label>
                    <Input
                        type="number"
                        step="0.5"
                        value={snb}
                        onChange={(e) => setSnb(e.target.value)}
                        onBlur={calculateANB}
                        placeholder="Normal: 80°"
                    />
                    <span className="text-xs text-muted-foreground">Normal: 80° ± 3°</span>
                </div>

                <div className="space-y-2">
                    <Label>ANB (Skeletal Relationship)</Label>
                    <Input
                        type="number"
                        step="0.5"
                        value={anb}
                        onChange={(e) => setAnb(e.target.value)}
                        placeholder="Auto-calculated"
                        disabled
                        className="bg-muted"
                    />
                    <span className="text-xs text-muted-foreground">Normal: 2-4°</span>
                </div>

                <div className="space-y-2">
                    <Label>Facial Angle</Label>
                    <Input
                        type="number"
                        step="0.5"
                        value={facialAngle}
                        onChange={(e) => setFacialAngle(e.target.value)}
                        placeholder="Normal: 90°"
                    />
                    <span className="text-xs text-muted-foreground">Normal: 87-93°</span>
                </div>

                <div className="space-y-2 col-span-2">
                    <Label>Profile Type</Label>
                    <Select value={profileType} onValueChange={setProfileType}>
                        <SelectTrigger>
                            <SelectValue placeholder={determineProfileType() || "Select Profile Type"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="STRAIGHT">Straight (Class I Normal)</SelectItem>
                            <SelectItem value="CONVEX">Convex (Class II Tendency)</SelectItem>
                            <SelectItem value="CONCAVE">Concave (Class III Tendency)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {anb && (
                <div className="bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 p-3 rounded-lg">
                    <div className="text-sm font-medium text-pink-900 dark:text-pink-200">Profile Assessment</div>
                    <div className="text-xs text-pink-700 dark:text-pink-300 mt-1">
                        {determineProfileType()}
                    </div>
                </div>
            )}

            <div className="bg-muted/50 p-3 rounded-lg text-xs space-y-2">
                <div className="font-medium">Cephalometric Norms</div>
                <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                    <li>ANB 0-2°: Class III skeletal pattern</li>
                    <li>ANB 2-4°: Class I skeletal pattern (ideal)</li>
                    <li>ANB &gt;4°: Class II skeletal pattern</li>
                </ul>
            </div>

            <Button onClick={saveCephalometricData} className="w-full" disabled={!sna || !snb}>
                <Save className="w-4 h-4 mr-2" />
                Save Cephalometric Analysis
            </Button>
        </Card>
    );
}
