'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
    Calculator, Sparkles, AlertTriangle, Info
} from 'lucide-react';
import {
    OHIScore,
    OHI_INDEX_TEETH,
    calculateOHIS,
    OHISResult
} from '@/types/chronology.types';

interface OHISPanelProps {
    onComplete?: (result: OHISResult) => void;
}

const SCORE_DESCRIPTIONS: Record<OHIScore, { debris: string; calculus: string; color: string }> = {
    0: { debris: 'No debris/stain', calculus: 'No calculus', color: 'bg-green-500' },
    1: { debris: '<1/3 covered', calculus: 'Supragingival <1/3', color: 'bg-yellow-400' },
    2: { debris: '1/3 to 2/3 covered', calculus: 'Supragingival 1/3-2/3', color: 'bg-orange-500' },
    3: { debris: '>2/3 covered', calculus: 'Band of calculus >1mm', color: 'bg-red-500' }
};

const TOOTH_LABELS: Record<number, string> = {
    16: 'UR6 (Buccal)',
    11: 'UR1 (Labial)',
    26: 'UL6 (Buccal)',
    36: 'LL6 (Lingual)',
    31: 'LL1 (Labial)',
    46: 'LR6 (Lingual)'
};

export default function OHISPanel({ onComplete }: OHISPanelProps) {
    const [debrisScores, setDebrisScores] = useState<Record<number, OHIScore>>(
        Object.fromEntries(OHI_INDEX_TEETH.debris.map(t => [t, 0 as OHIScore]))
    );
    const [calculusScores, setCalculusScores] = useState<Record<number, OHIScore>>(
        Object.fromEntries(OHI_INDEX_TEETH.calculus.map(t => [t, 0 as OHIScore]))
    );
    const [result, setResult] = useState<OHISResult | null>(null);

    const handleCalculate = () => {
        const ohisResult = calculateOHIS(debrisScores, calculusScores);
        setResult(ohisResult);
        onComplete?.(ohisResult);
        toast.success(`OHI-S: ${ohisResult.ohisTotal} (${ohisResult.interpretation})`);
    };

    const ScoreButton = ({
        value,
        current,
        onChange,
        type
    }: {
        value: OHIScore;
        current: OHIScore;
        onChange: (v: OHIScore) => void;
        type: 'debris' | 'calculus';
    }) => (
        <button
            onClick={() => onChange(value)}
            title={type === 'debris' ? SCORE_DESCRIPTIONS[value].debris : SCORE_DESCRIPTIONS[value].calculus}
            className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${current === value
                    ? `${SCORE_DESCRIPTIONS[value].color} text-white ring-2 ring-offset-1 ring-blue-500`
                    : 'bg-muted hover:bg-muted/80'
                }`}
        >
            {value}
        </button>
    );

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        OHI-S (Simplified Oral Hygiene Index)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Greene & Vermillion • 6 Index Teeth
                    </p>
                </div>
                <Button onClick={handleCalculate}>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate
                </Button>
            </div>

            {/* Score Legend */}
            <div className="grid grid-cols-4 gap-2 mb-4 text-xs p-3 bg-muted/50 rounded-lg">
                {([0, 1, 2, 3] as OHIScore[]).map(score => (
                    <div key={score} className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded ${SCORE_DESCRIPTIONS[score].color} flex items-center justify-center text-white font-bold`}>
                            {score}
                        </span>
                        <span className="text-muted-foreground truncate">{SCORE_DESCRIPTIONS[score].debris}</span>
                    </div>
                ))}
            </div>

            {/* Scoring Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2 px-2">Index Tooth</th>
                            <th className="text-center py-2">Debris (DI-S)</th>
                            <th className="text-center py-2">Calculus (CI-S)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {OHI_INDEX_TEETH.debris.map(tooth => (
                            <tr key={tooth} className="border-b hover:bg-muted/30">
                                <td className="py-3 px-2">
                                    <div className="font-medium">#{tooth}</div>
                                    <div className="text-xs text-muted-foreground">{TOOTH_LABELS[tooth]}</div>
                                </td>
                                <td className="py-3">
                                    <div className="flex justify-center gap-1">
                                        {([0, 1, 2, 3] as OHIScore[]).map(score => (
                                            <ScoreButton
                                                key={score}
                                                value={score}
                                                current={debrisScores[tooth]}
                                                onChange={(v) => setDebrisScores({ ...debrisScores, [tooth]: v })}
                                                type="debris"
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="py-3">
                                    <div className="flex justify-center gap-1">
                                        {([0, 1, 2, 3] as OHIScore[]).map(score => (
                                            <ScoreButton
                                                key={score}
                                                value={score}
                                                current={calculusScores[tooth]}
                                                onChange={(v) => setCalculusScores({ ...calculusScores, [tooth]: v })}
                                                type="calculus"
                                            />
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Results */}
            {result && (
                <div className={`mt-4 p-4 rounded-lg border ${result.interpretation === 'Poor'
                        ? 'bg-red-50 dark:bg-red-950/20 border-red-200'
                        : result.interpretation === 'Fair'
                            ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200'
                            : 'bg-green-50 dark:bg-green-950/20 border-green-200'
                    }`}>
                    <div className="grid grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{result.debrisIndex}</div>
                            <div className="text-xs text-muted-foreground">DI-S</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{result.calculusIndex}</div>
                            <div className="text-xs text-muted-foreground">CI-S</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{result.ohisTotal}</div>
                            <div className="text-xs text-muted-foreground">OHI-S</div>
                        </div>
                        <div className="text-center">
                            <Badge variant={
                                result.interpretation === 'Good' ? 'default' :
                                    result.interpretation === 'Fair' ? 'secondary' : 'destructive'
                            } className="text-lg px-3 py-1">
                                {result.interpretation}
                            </Badge>
                        </div>
                    </div>
                    <p className="text-sm">
                        <strong>Recommendation:</strong> {result.recommendation}
                    </p>
                </div>
            )}

            {/* Reference */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 text-blue-500" />
                    <div>
                        <strong>OHI-S Interpretation:</strong>
                        <ul className="mt-1 space-y-1 text-muted-foreground">
                            <li>• 0.0 - 1.2 = Good oral hygiene</li>
                            <li>• 1.3 - 3.0 = Fair oral hygiene</li>
                            <li>• 3.1 - 6.0 = Poor oral hygiene</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Card>
    );
}
