'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Calculator, TrendingUp } from 'lucide-react';
import {
    PlaquScore, GingivalScore, calculateHygieneIndices, HygieneIndexResult
} from '@/types/clinical-indices.types';

interface HygieneIndexPanelProps {
    onComplete?: (result: HygieneIndexResult) => void;
}

const TOOTH_POSITIONS = [
    // Upper right to upper left
    16, 12, 24, 26,
    // Lower left to lower right  
    36, 32, 44, 46
];

const SCORE_LABELS: Record<number, { label: string; color: string }> = {
    0: { label: '0 - None', color: 'bg-green-500' },
    1: { label: '1 - Mild', color: 'bg-yellow-400' },
    2: { label: '2 - Moderate', color: 'bg-orange-500' },
    3: { label: '3 - Severe', color: 'bg-red-500' }
};

export default function HygieneIndexPanel({ onComplete }: HygieneIndexPanelProps) {
    const [plaqueScores, setPlaqueScores] = useState<Record<number, PlaquScore>>(
        Object.fromEntries(TOOTH_POSITIONS.map(t => [t, 0 as PlaquScore]))
    );
    const [gingivalScores, setGingivalScores] = useState<Record<number, GingivalScore>>(
        Object.fromEntries(TOOTH_POSITIONS.map(t => [t, 0 as GingivalScore]))
    );
    const [result, setResult] = useState<HygieneIndexResult | null>(null);

    const handleCalculate = () => {
        const pScores = Object.values(plaqueScores) as PlaquScore[];
        const gScores = Object.values(gingivalScores) as GingivalScore[];

        const hygieneResult = calculateHygieneIndices(pScores, gScores);
        setResult(hygieneResult);
        onComplete?.(hygieneResult);
        toast.success(`FMPS: ${hygieneResult.fullMouthPlaquePercent}%`);
    };

    const ScoreButton = ({
        value,
        current,
        onChange,
        type
    }: {
        value: number;
        current: number;
        onChange: (v: number) => void;
        type: 'plaque' | 'gingival';
    }) => (
        <button
            onClick={() => onChange(value)}
            className={`w-7 h-7 rounded text-xs font-bold transition-all ${current === value
                    ? `${SCORE_LABELS[value].color} text-white ring-2 ring-offset-1 ring-blue-500`
                    : 'bg-muted hover:bg-muted/80'
                }`}
        >
            {value}
        </button>
    );

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Plaque & Gingival Index (Löe & Silness)
                </h3>
                <Button onClick={handleCalculate} size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Calculate
                </Button>
            </div>

            {/* Score Legend */}
            <div className="flex gap-3 mb-4 text-xs">
                {Object.entries(SCORE_LABELS).map(([score, info]) => (
                    <div key={score} className="flex items-center gap-1">
                        <span className={`w-4 h-4 rounded ${info.color}`} />
                        <span className="text-muted-foreground">{info.label}</span>
                    </div>
                ))}
            </div>

            {/* Scoring Grid */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2">Tooth</th>
                            <th className="text-center py-2">Plaque Index (PI)</th>
                            <th className="text-center py-2">Gingival Index (GI)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TOOTH_POSITIONS.map(tooth => (
                            <tr key={tooth} className="border-b">
                                <td className="py-2 font-medium">#{tooth}</td>
                                <td className="py-2">
                                    <div className="flex justify-center gap-1">
                                        {([0, 1, 2, 3] as PlaquScore[]).map(score => (
                                            <ScoreButton
                                                key={score}
                                                value={score}
                                                current={plaqueScores[tooth]}
                                                onChange={(v) => setPlaqueScores({ ...plaqueScores, [tooth]: v as PlaquScore })}
                                                type="plaque"
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="py-2">
                                    <div className="flex justify-center gap-1">
                                        {([0, 1, 2, 3] as GingivalScore[]).map(score => (
                                            <ScoreButton
                                                key={score}
                                                value={score}
                                                current={gingivalScores[tooth]}
                                                onChange={(v) => setGingivalScores({ ...gingivalScores, [tooth]: v as GingivalScore })}
                                                type="gingival"
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
                <div className={`mt-4 p-4 rounded-lg border ${result.fullMouthPlaquePercent > 50
                        ? 'bg-red-50 dark:bg-red-950/20 border-red-200'
                        : result.fullMouthPlaquePercent > 25
                            ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200'
                            : 'bg-green-50 dark:bg-green-950/20 border-green-200'
                    }`}>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{result.plaqueIndex}</div>
                            <div className="text-xs text-muted-foreground">Plaque Index</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{result.gingivalIndex}</div>
                            <div className="text-xs text-muted-foreground">Gingival Index</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{result.fullMouthPlaquePercent}%</div>
                            <div className="text-xs text-muted-foreground">FMPS</div>
                        </div>
                    </div>
                    <div className="text-sm">
                        <p><strong>Assessment:</strong> {result.assessment}</p>
                        <p className="mt-1"><strong>Recommendation:</strong> {result.recommendation}</p>
                    </div>
                </div>
            )}
        </Card>
    );
}
