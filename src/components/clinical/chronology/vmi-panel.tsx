'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Ruler, Calculator, AlertTriangle } from 'lucide-react';
import { VMI_INDEX_TEETH, calculateVMI, VMIResult } from '@/types/chronology.types';

interface VMIPanelProps {
    onComplete?: (result: VMIResult) => void;
}

const TOOTH_LABELS: Record<number, string> = {
    31: 'LL Central (Lingual)',
    32: 'LL Lateral (Lingual)',
    41: 'LR Central (Lingual)',
    42: 'LR Lateral (Lingual)'
};

export default function VMIPanel({ onComplete }: VMIPanelProps) {
    const [measurements, setMeasurements] = useState<Record<number, number>>(
        Object.fromEntries(VMI_INDEX_TEETH.map(t => [t, 0]))
    );
    const [result, setResult] = useState<VMIResult | null>(null);

    const handleCalculate = () => {
        const vmiResult = calculateVMI(measurements);
        setResult(vmiResult);
        onComplete?.(vmiResult);
        toast.success(`VMI Total: ${vmiResult.totalScore}mm (${vmiResult.severity})`);
    };

    const getSeverityColor = (severity: VMIResult['severity']) => {
        switch (severity) {
            case 'Minimal': return 'bg-green-500';
            case 'Mild': return 'bg-yellow-500';
            case 'Moderate': return 'bg-orange-500';
            case 'Heavy': return 'bg-red-500';
        }
    };

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Ruler className="w-5 h-5 text-amber-500" />
                        VMI (Volpe-Manhold Index)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Lower Lingual Calculus • Smoker Pattern Detection
                    </p>
                </div>
                <Button onClick={handleCalculate}>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate
                </Button>
            </div>

            {/* Measurement Instructions */}
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-sm">
                <strong>Measurement Protocol:</strong>
                <p className="text-muted-foreground mt-1">
                    1. Measure vertical height of supragingival calculus (mm) on lingual surface<br />
                    2. Use 3 measurements per tooth: mesial, middle, distal<br />
                    3. Enter the sum for each tooth below
                </p>
            </div>

            {/* Measurement Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {VMI_INDEX_TEETH.map(tooth => (
                    <div key={tooth} className="p-3 bg-muted/50 rounded-lg">
                        <label className="text-sm font-medium mb-2 block">
                            #{tooth} - {TOOTH_LABELS[tooth]}
                        </label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                step="0.5"
                                min="0"
                                max="9"
                                value={measurements[tooth]}
                                onChange={(e) => setMeasurements({
                                    ...measurements,
                                    [tooth]: parseFloat(e.target.value) || 0
                                })}
                                className="text-center"
                            />
                            <span className="text-sm text-muted-foreground">mm</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Live Total */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg mb-4">
                <span className="font-medium">Total VMI Score:</span>
                <span className="text-2xl font-bold">
                    {Object.values(measurements).reduce((a, b) => a + b, 0).toFixed(1)} mm
                </span>
            </div>

            {/* Results */}
            {result && (
                <div className={`p-4 rounded-lg border ${result.severity === 'Heavy' ? 'bg-red-50 dark:bg-red-950/20 border-red-200' :
                        result.severity === 'Moderate' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200' :
                            result.severity === 'Mild' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200' :
                                'bg-green-50 dark:bg-green-950/20 border-green-200'
                    }`}>
                    <div className="flex items-center gap-3 mb-3">
                        <Badge className={`${getSeverityColor(result.severity)} text-white text-lg px-4 py-1`}>
                            VMI: {result.totalScore}mm
                        </Badge>
                        <Badge variant="outline" className="text-lg">
                            {result.severity} Calculus
                        </Badge>
                    </div>

                    <p className="text-sm mb-2">
                        <strong>Recommendation:</strong> {result.recommendation}
                    </p>

                    {result.severity === 'Heavy' && (
                        <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 rounded flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 mt-0.5 text-red-600" />
                            <div className="text-sm text-red-700 dark:text-red-300">
                                <strong>Clinical Alert:</strong> Heavy lingual calculus is characteristic of long-term tobacco users.
                                Cross-reference with Smoking Index for risk stratification.
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Reference Guide */}
            <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded bg-green-100 dark:bg-green-950/30 text-center">
                    <div className="font-bold">0-1 mm</div>
                    <div className="text-muted-foreground">Minimal</div>
                </div>
                <div className="p-2 rounded bg-yellow-100 dark:bg-yellow-950/30 text-center">
                    <div className="font-bold">1-3 mm</div>
                    <div className="text-muted-foreground">Mild</div>
                </div>
                <div className="p-2 rounded bg-orange-100 dark:bg-orange-950/30 text-center">
                    <div className="font-bold">3-6 mm</div>
                    <div className="text-muted-foreground">Moderate</div>
                </div>
                <div className="p-2 rounded bg-red-100 dark:bg-red-950/30 text-center">
                    <div className="font-bold">&gt;6 mm</div>
                    <div className="text-muted-foreground">Heavy</div>
                </div>
            </div>
        </Card>
    );
}
