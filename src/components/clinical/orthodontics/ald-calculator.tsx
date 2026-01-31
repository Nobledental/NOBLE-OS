'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator, Info } from 'lucide-react';
import { toast } from 'sonner';
import { ALDCalculation, ToothMeasurement } from '@/types/orthodontic.types';
import { BOLTON_STANDARDS } from '@/utils/cephalometric-calculations';
import { determineTreatmentRecommendation } from '@/types/orthodontic.types';

interface ALDCalculatorProps {
    onCalculationComplete?: (calculation: ALDCalculation) => void;
}

export default function ALDCalculator({ onCalculationComplete }: ALDCalculatorProps) {
    const [upperTeeth, setUpperTeeth] = useState<ToothMeasurement[]>(
        [11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26, 27].map(num => ({
            toothNumber: num,
            mesiodistalWidth: BOLTON_STANDARDS[num] || 0
        }))
    );

    const [lowerTeeth, setLowerTeeth] = useState<ToothMeasurement[]>(
        [31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 47].map(num => ({
            toothNumber: num,
            mesiodistalWidth: BOLTON_STANDARDS[num] || 0
        }))
    );

    const [upperArchAvailable, setUpperArchAvailable] = useState<number>(0);
    const [lowerArchAvailable, setLowerArchAvailable] = useState<number>(0);
    const [calculation, setCalculation] = useState<ALDCalculation | null>(null);

    const updateToothWidth = (arch: 'upper' | 'lower', toothNumber: number, value: string) => {
        const width = parseFloat(value) || 0;

        if (arch === 'upper') {
            setUpperTeeth(prev =>
                prev.map(t => t.toothNumber === toothNumber ? { ...t, mesiodistalWidth: width } : t)
            );
        } else {
            setLowerTeeth(prev =>
                prev.map(t => t.toothNumber === toothNumber ? { ...t, mesiodistalWidth: width } : t)
            );
        }
    };

    const calculateALD = () => {
        const upperRequired = upperTeeth.reduce((sum, t) => sum + t.mesiodistalWidth, 0);
        const lowerRequired = lowerTeeth.reduce((sum, t) => sum + t.mesiodistalWidth, 0);

        const upperDiscrepancy = upperArchAvailable - upperRequired;
        const lowerDiscrepancy = lowerArchAvailable - lowerRequired;

        // Use the more severe discrepancy for recommendation
        const worstDiscrepancy = Math.min(upperDiscrepancy, lowerDiscrepancy);

        const result: ALDCalculation = {
            upperArchRequired: Math.round(upperRequired * 10) / 10,
            upperArchAvailable: upperArchAvailable,
            lowerArchRequired: Math.round(lowerRequired * 10) / 10,
            lowerArchAvailable: lowerArchAvailable,
            upperDiscrepancy: Math.round(upperDiscrepancy * 10) / 10,
            lowerDiscrepancy: Math.round(lowerDiscrepancy * 10) / 10,
            recommendation: determineTreatmentRecommendation(worstDiscrepancy)
        };

        setCalculation(result);
        onCalculationComplete?.(result);
        toast.success('ALD calculated successfully');
    };

    const resetToDefaults = () => {
        setUpperTeeth(prev => prev.map(t => ({ ...t, mesiodistalWidth: BOLTON_STANDARDS[t.toothNumber] || 0 })));
        setLowerTeeth(prev => prev.map(t => ({ ...t, mesiodistalWidth: BOLTON_STANDARDS[t.toothNumber] || 0 })));
        toast.info('Reset to Bolton standards');
    };

    const renderToothInput = (tooth: ToothMeasurement, arch: 'upper' | 'lower') => (
        <div key={tooth.toothNumber} className="flex items-center gap-2">
            <div className="w-10 text-sm font-medium text-center">
                {tooth.toothNumber}
            </div>
            <Input
                type="number"
                step="0.1"
                value={tooth.mesiodistalWidth || ''}
                onChange={(e) => updateToothWidth(arch, tooth.toothNumber, e.target.value)}
                className="text-sm text-right"
                placeholder="0.0"
            />
            <span className="text-xs text-muted-foreground">mm</span>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Arch Length Discrepancy Calculator</h3>
                <Button onClick={resetToDefaults} variant="outline" size="sm">
                    Reset to Bolton Standards
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upper Arch */}
                <Card className="p-4">
                    <h4 className="font-medium text-sm mb-3">Upper Arch (Maxillary)</h4>

                    <div className="space-y-2 mb-4">
                        <label className="text-xs font-medium">Mesiodistal Widths</label>
                        <div className="grid grid-cols-2 gap-2">
                            {upperTeeth.map(tooth => renderToothInput(tooth, 'upper'))}
                        </div>
                    </div>

                    <div className="pt-3 border-t">
                        <label className="text-xs font-medium block mb-2">Arch Perimeter Available</label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                step="0.5"
                                value={upperArchAvailable || ''}
                                onChange={(e) => setUpperArchAvailable(parseFloat(e.target.value) || 0)}
                                placeholder="Measured from model"
                                className="text-sm"
                            />
                            <span className="text-xs text-muted-foreground">mm</span>
                        </div>
                    </div>
                </Card>

                {/* Lower Arch */}
                <Card className="p-4">
                    <h4 className="font-medium text-sm mb-3">Lower Arch (Mandibular)</h4>

                    <div className="space-y-2 mb-4">
                        <label className="text-xs font-medium">Mesiodistal Widths</label>
                        <div className="grid grid-cols-2 gap-2">
                            {lowerTeeth.map(tooth => renderToothInput(tooth, 'lower'))}
                        </div>
                    </div>

                    <div className="pt-3 border-t">
                        <label className="text-xs font-medium block mb-2">Arch Perimeter Available</label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                step="0.5"
                                value={lowerArchAvailable || ''}
                                onChange={(e) => setLowerArchAvailable(parseFloat(e.target.value) || 0)}
                                placeholder="Measured from model"
                                className="text-sm"
                            />
                            <span className="text-xs text-muted-foreground">mm</span>
                        </div>
                    </div>
                </Card>
            </div>

            <Button onClick={calculateALD} className="w-full" size="lg">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Discrepancy
            </Button>

            {/* Results */}
            {calculation && (
                <Card className="p-6">
                    <h4 className="font-semibold mb-4">Analysis Results</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Upper Arch Results */}
                        <div className="space-y-3">
                            <h5 className="text-sm font-medium text-muted-foreground">Upper Arch</h5>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm">Space Required:</span>
                                    <span className="font-medium">{calculation.upperArchRequired} mm</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Space Available:</span>
                                    <span className="font-medium">{calculation.upperArchAvailable} mm</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                    <span className="text-sm font-medium">Discrepancy:</span>
                                    <Badge variant={calculation.upperDiscrepancy < -4 ? 'destructive' : calculation.upperDiscrepancy < 0 ? 'secondary' : 'default'}>
                                        {calculation.upperDiscrepancy > 0 ? '+' : ''}{calculation.upperDiscrepancy} mm
                                    </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {calculation.upperDiscrepancy < 0 ? `${Math.abs(calculation.upperDiscrepancy)} mm crowding` : `${calculation.upperDiscrepancy} mm spacing`}
                                </div>
                            </div>
                        </div>

                        {/* Lower Arch Results */}
                        <div className="space-y-3">
                            <h5 className="text-sm font-medium text-muted-foreground">Lower Arch</h5>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm">Space Required:</span>
                                    <span className="font-medium">{calculation.lowerArchRequired} mm</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Space Available:</span>
                                    <span className="font-medium">{calculation.lowerArchAvailable} mm</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                    <span className="text-sm font-medium">Discrepancy:</span>
                                    <Badge variant={calculation.lowerDiscrepancy < -4 ? 'destructive' : calculation.lowerDiscrepancy < 0 ? 'secondary' : 'default'}>
                                        {calculation.lowerDiscrepancy > 0 ? '+' : ''}{calculation.lowerDiscrepancy} mm
                                    </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {calculation.lowerDiscrepancy < 0 ? `${Math.abs(calculation.lowerDiscrepancy)} mm crowding` : `${calculation.lowerDiscrepancy} mm spacing`}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Treatment Recommendation */}
                    <div className="mt-6 pt-6 border-t">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                                <h5 className="font-medium mb-2">Treatment Recommendation</h5>
                                <Badge className="mb-2">{calculation.recommendation}</Badge>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    {calculation.recommendation === 'Extraction' && (
                                        <>
                                            <p>• Severe crowding ({">"} 4mm) detected</p>
                                            <p>• Consider extraction of premolars</p>
                                            <p>• Orthodontic space closure required</p>
                                        </>
                                    )}
                                    {calculation.recommendation === 'Expansion' && (
                                        <>
                                            <p>• Moderate crowding (2-4mm) detected</p>
                                            <p>• Consider arch expansion treatment</p>
                                            <p>• Rapid/slow palatal expander may be indicated</p>
                                        </>
                                    )}
                                    {calculation.recommendation === 'IPR' && (
                                        <>
                                            <p>• Mild crowding ({"<"} 2mm) detected</p>
                                            <p>• Interproximal reduction (IPR) may resolve</p>
                                            <p>• Non-extraction treatment preferred</p>
                                        </>
                                    )}
                                    {calculation.recommendation === 'None' && (
                                        <>
                                            <p>• Adequate space available</p>
                                            <p>• Non-extraction treatment indicated</p>
                                            <p>• Consider maintaining existing spacing</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
