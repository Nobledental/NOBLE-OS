'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import {
    SmileArc, LipLine, NegativeSpace, analyzeSmile, SmileAnalysis
} from '@/types/clinical-indices.types';

interface SmileStudioProps {
    onAnalysisComplete?: (analysis: SmileAnalysis) => void;
}

export default function SmileStudio({ onAnalysisComplete }: SmileStudioProps) {
    const [params, setParams] = useState({
        smileArc: 'Parallel' as SmileArc,
        lipLine: 'Average' as LipLine,
        negativeSpace: 'Minimal' as NegativeSpace,
        midlineDeviation: false,
        cantedMidline: false,
        gingivalDisplay: 'Normal' as 'Excessive' | 'Normal' | 'None',
        toothProportions: 'Ideal' as 'Ideal' | 'Narrow' | 'Wide',
        colorMatch: 'Harmonious' as 'Harmonious' | 'Discrepancy'
    });

    const analysis = useMemo(() => analyzeSmile(params), [params]);

    const handleComplete = () => {
        onAnalysisComplete?.(analysis);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getScoreGradient = (score: number) => {
        if (score >= 80) return 'from-green-500 to-emerald-500';
        if (score >= 60) return 'from-yellow-500 to-amber-500';
        return 'from-red-500 to-orange-500';
    };

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Smile Studio™ Analyzer
                </h3>
                <Button onClick={handleComplete} size="sm" variant="outline">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Analysis
                </Button>
            </div>

            {/* Score Display */}
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">SMILE SCORE</div>
                    <div className={`text-5xl font-bold ${getScoreColor(analysis.smileScore)}`}>
                        {analysis.smileScore}%
                    </div>
                    <div className="mt-2 w-full h-3 bg-muted rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.smileScore)} transition-all duration-500`}
                            style={{ width: `${analysis.smileScore}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* 8-Component Checklist */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Smile Arc */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">Smile Arc</label>
                    <Select
                        value={params.smileArc}
                        onValueChange={(v: SmileArc) => setParams({ ...params, smileArc: v })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Parallel">✓ Parallel (Ideal)</SelectItem>
                            <SelectItem value="Flat">Flat</SelectItem>
                            <SelectItem value="Reverse">Reverse</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Lip Line */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">Lip Line</label>
                    <Select
                        value={params.lipLine}
                        onValueChange={(v: LipLine) => setParams({ ...params, lipLine: v })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Average">✓ Average (Ideal)</SelectItem>
                            <SelectItem value="High">High (Gummy)</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Buccal Corridors */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">Negative Space (Corridors)</label>
                    <Select
                        value={params.negativeSpace}
                        onValueChange={(v: NegativeSpace) => setParams({ ...params, negativeSpace: v })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Minimal">✓ Minimal (Ideal)</SelectItem>
                            <SelectItem value="Absent">Absent</SelectItem>
                            <SelectItem value="Excessive">Excessive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Gingival Display */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">Gingival Display</label>
                    <Select
                        value={params.gingivalDisplay}
                        onValueChange={(v: 'Excessive' | 'Normal' | 'None') => setParams({ ...params, gingivalDisplay: v })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Normal">✓ Normal (2-3mm)</SelectItem>
                            <SelectItem value="Excessive">Excessive (Gummy)</SelectItem>
                            <SelectItem value="None">None</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Tooth Proportions */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">Tooth Proportions</label>
                    <Select
                        value={params.toothProportions}
                        onValueChange={(v: 'Ideal' | 'Narrow' | 'Wide') => setParams({ ...params, toothProportions: v })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Ideal">✓ Ideal (Golden Ratio)</SelectItem>
                            <SelectItem value="Narrow">Narrow</SelectItem>
                            <SelectItem value="Wide">Wide</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Color Match */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">Color Harmony</label>
                    <Select
                        value={params.colorMatch}
                        onValueChange={(v: 'Harmonious' | 'Discrepancy') => setParams({ ...params, colorMatch: v })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Harmonious">✓ Harmonious</SelectItem>
                            <SelectItem value="Discrepancy">Discrepancy</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Midline */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">Dental Midline</label>
                    <div className="flex gap-2">
                        <Button
                            variant={params.midlineDeviation ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={() => setParams({ ...params, midlineDeviation: !params.midlineDeviation })}
                            className="flex-1"
                        >
                            {params.midlineDeviation ? 'Deviated' : '✓ Centered'}
                        </Button>
                    </div>
                </div>

                {/* Canted Midline */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">Midline Cant</label>
                    <div className="flex gap-2">
                        <Button
                            variant={params.cantedMidline ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={() => setParams({ ...params, cantedMidline: !params.cantedMidline })}
                            className="flex-1"
                        >
                            {params.cantedMidline ? 'Canted' : '✓ Straight'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Treatment Recommendations
                    </h4>
                    <ul className="space-y-1">
                        {analysis.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {analysis.recommendations.length === 0 && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Optimal Smile Esthetics!</span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Patient has ideal smile components. Consider maintenance and whitening.
                    </p>
                </div>
            )}
        </Card>
    );
}
