'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Cigarette, AlertTriangle, TrendingUp, Heart } from 'lucide-react';
import { calculateSmokingIndex, SmokingIndexResult } from '@/types/chronology.types';

interface SmokingIndexPanelProps {
    onComplete?: (result: SmokingIndexResult) => void;
}

export default function SmokingIndexPanel({ onComplete }: SmokingIndexPanelProps) {
    const [cigarettesPerDay, setCigarettesPerDay] = useState(0);
    const [yearsOfSmoking, setYearsOfSmoking] = useState(0);
    const [result, setResult] = useState<SmokingIndexResult | null>(null);

    const handleCalculate = () => {
        const siResult = calculateSmokingIndex(cigarettesPerDay, yearsOfSmoking);
        setResult(siResult);
        onComplete?.(siResult);

        if (siResult.smokingIndex >= 200) {
            toast.warning(`Smoking Index: ${siResult.smokingIndex} - HIGH RISK`, { duration: 5000 });
        } else {
            toast.success(`Smoking Index: ${siResult.smokingIndex}`);
        }
    };

    const getRiskColor = (level: SmokingIndexResult['riskLevel']) => {
        switch (level) {
            case 'Low': return 'bg-green-500';
            case 'Moderate': return 'bg-yellow-500';
            case 'High': return 'bg-orange-500';
            case 'Very High': return 'bg-red-600';
        }
    };

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Cigarette className="w-5 h-5" />
                        Smoking Index Calculator
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        SI = Cigarettes/Day × Years of Smoking
                    </p>
                </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Cigarettes per Day
                    </label>
                    <div className="flex items-center gap-4">
                        <Slider
                            value={[cigarettesPerDay]}
                            onValueChange={([v]) => setCigarettesPerDay(v)}
                            max={60}
                            step={1}
                            className="flex-1"
                        />
                        <Input
                            type="number"
                            value={cigarettesPerDay}
                            onChange={(e) => setCigarettesPerDay(parseInt(e.target.value) || 0)}
                            className="w-20"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Years of Smoking
                    </label>
                    <div className="flex items-center gap-4">
                        <Slider
                            value={[yearsOfSmoking]}
                            onValueChange={([v]) => setYearsOfSmoking(v)}
                            max={50}
                            step={1}
                            className="flex-1"
                        />
                        <Input
                            type="number"
                            value={yearsOfSmoking}
                            onChange={(e) => setYearsOfSmoking(parseInt(e.target.value) || 0)}
                            className="w-20"
                        />
                    </div>
                </div>
            </div>

            {/* Live Preview */}
            <div className="flex items-center justify-between mb-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                    <div className="text-3xl font-bold">
                        {cigarettesPerDay * yearsOfSmoking}
                    </div>
                    <div className="text-sm text-muted-foreground">Smoking Index</div>
                </div>
                <div className="flex gap-2">
                    <div className={`px-3 py-1 rounded text-sm font-medium ${cigarettesPerDay * yearsOfSmoking < 100 ? 'bg-green-100 text-green-800' :
                            cigarettesPerDay * yearsOfSmoking < 200 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                        }`}>
                        {cigarettesPerDay * yearsOfSmoking >= 200 ? '⚠️ HIGH RISK' :
                            cigarettesPerDay * yearsOfSmoking >= 100 ? '⚡ Elevated' : '✓ Acceptable'}
                    </div>
                </div>
                <Button onClick={handleCalculate}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Calculate Risk
                </Button>
            </div>

            {/* Results */}
            {result && (
                <div className={`p-4 rounded-lg border ${result.riskLevel === 'Very High' ? 'bg-red-50 dark:bg-red-950/20 border-red-300' :
                        result.riskLevel === 'High' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-300' :
                            result.riskLevel === 'Moderate' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300' :
                                'bg-green-50 dark:bg-green-950/20 border-green-300'
                    }`}>
                    <div className="flex items-center gap-3 mb-3">
                        <Badge className={`${getRiskColor(result.riskLevel)} text-white text-lg px-4 py-1`}>
                            SI: {result.smokingIndex}
                        </Badge>
                        <Badge variant="outline" className="text-lg">
                            {result.riskLevel} Risk
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 rounded bg-background/50">
                            <div className="font-medium mb-1 flex items-center gap-2">
                                <Heart className="w-4 h-4 text-red-500" />
                                Periodontal Risk
                            </div>
                            <p className="text-muted-foreground">{result.perioRisk}</p>
                        </div>
                        <div className="p-3 rounded bg-background/50">
                            <div className="font-medium mb-1 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                Oral Cancer Risk
                            </div>
                            <p className="text-muted-foreground">{result.oralCancerRisk}</p>
                        </div>
                    </div>

                    {result.smokingIndex >= 200 && (
                        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-300">
                            <div className="flex items-center gap-2 font-medium text-red-800 dark:text-red-200">
                                <AlertTriangle className="w-5 h-5" />
                                IMMEDIATE ACTION REQUIRED
                            </div>
                            <ul className="mt-2 text-sm text-red-700 dark:text-red-300 space-y-1">
                                <li>• Refer to Tobacco Cessation Program</li>
                                <li>• Comprehensive oral cancer screening</li>
                                <li>• Aggressive periodontal therapy</li>
                                <li>• 3-month recall interval mandatory</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Reference Guide */}
            <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded bg-green-100 dark:bg-green-950/30 text-center">
                    <div className="font-bold">SI &lt; 100</div>
                    <div className="text-muted-foreground">Low Risk</div>
                </div>
                <div className="p-2 rounded bg-yellow-100 dark:bg-yellow-950/30 text-center">
                    <div className="font-bold">SI 100-199</div>
                    <div className="text-muted-foreground">Moderate</div>
                </div>
                <div className="p-2 rounded bg-orange-100 dark:bg-orange-950/30 text-center">
                    <div className="font-bold">SI 200-400</div>
                    <div className="text-muted-foreground">High Risk</div>
                </div>
                <div className="p-2 rounded bg-red-100 dark:bg-red-950/30 text-center">
                    <div className="font-bold">SI &gt; 400</div>
                    <div className="text-muted-foreground">Very High</div>
                </div>
            </div>
        </Card>
    );
}
