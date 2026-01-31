'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Eye, EyeOff, Save } from 'lucide-react';

interface HygieneSliderProps {
    initialScore?: number;
    onScoreChange?: (score: number, derivedIndices: DerivedIndices) => void;
    showDetails?: boolean;
}

interface DerivedIndices {
    debrisIndex: number;      // DI-S (0-3)
    calculusIndex: number;    // CI-S (0-3)
    plaqueIndex: number;      // PI Löe-Silness (0-3)
    gingivalIndex: number;    // GI Löe-Silness (0-3)
    ohisTotal: number;        // OHI-S (0-6)
    interpretation: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const HYGIENE_LABELS = [
    { score: 0, label: 'Critical', color: 'bg-red-600' },
    { score: 1, label: 'Very Poor', color: 'bg-red-500' },
    { score: 2, label: 'Poor', color: 'bg-orange-500' },
    { score: 3, label: 'Below Average', color: 'bg-orange-400' },
    { score: 4, label: 'Fair', color: 'bg-yellow-500' },
    { score: 5, label: 'Average', color: 'bg-yellow-400' },
    { score: 6, label: 'Above Average', color: 'bg-lime-400' },
    { score: 7, label: 'Good', color: 'bg-green-400' },
    { score: 8, label: 'Very Good', color: 'bg-green-500' },
    { score: 9, label: 'Excellent', color: 'bg-emerald-500' },
    { score: 10, label: 'Perfect', color: 'bg-emerald-600' }
];

/**
 * Derives clinical indices from a single 0-10 hygiene score
 * This is the "One-Slider" magic - user moves one slider, system populates all indices
 */
function deriveIndicesFromScore(hygieneScore: number): DerivedIndices {
    // Inverse relationship: high hygiene score = low index values
    const normalizedInverse = (10 - hygieneScore) / 10;

    // DI-S: 0-3 scale
    const debrisIndex = Math.round(normalizedInverse * 3 * 10) / 10;

    // CI-S: Slightly lower than debris in good hygiene
    const calculusIndex = Math.round(normalizedInverse * 2.5 * 10) / 10;

    // PI: Plaque follows debris closely
    const plaqueIndex = Math.round(normalizedInverse * 3 * 10) / 10;

    // GI: Gingival health lags behind cleanliness
    const gingivalIndex = Math.round(Math.min(normalizedInverse * 2.5, 3) * 10) / 10;

    // OHI-S = DI-S + CI-S
    const ohisTotal = Math.round((debrisIndex + calculusIndex) * 10) / 10;

    // Interpretation
    let interpretation: DerivedIndices['interpretation'];
    if (ohisTotal <= 1.2) interpretation = 'Excellent';
    else if (ohisTotal <= 2.4) interpretation = 'Good';
    else if (ohisTotal <= 4.2) interpretation = 'Fair';
    else interpretation = 'Poor';

    return {
        debrisIndex,
        calculusIndex,
        plaqueIndex,
        gingivalIndex,
        ohisTotal,
        interpretation
    };
}

export default function HygieneSlider({
    initialScore = 5,
    onScoreChange,
    showDetails: initialShowDetails = false
}: HygieneSliderProps) {
    const [score, setScore] = useState(initialScore);
    const [showDetails, setShowDetails] = useState(initialShowDetails);
    const [derivedIndices, setDerivedIndices] = useState<DerivedIndices>(() =>
        deriveIndicesFromScore(initialScore)
    );

    useEffect(() => {
        const indices = deriveIndicesFromScore(score);
        setDerivedIndices(indices);
        onScoreChange?.(score, indices);
    }, [score, onScoreChange]);

    const currentLabel = HYGIENE_LABELS[score];

    const getTrackColor = () => {
        if (score >= 8) return 'bg-gradient-to-r from-green-400 to-emerald-500';
        if (score >= 6) return 'bg-gradient-to-r from-yellow-400 to-lime-500';
        if (score >= 4) return 'bg-gradient-to-r from-orange-400 to-yellow-500';
        return 'bg-gradient-to-r from-red-500 to-orange-500';
    };

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">Oral Hygiene Score</h3>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showDetails ? 'Hide' : 'Details'}
                    </Button>
                    <Badge className={`${currentLabel.color} text-white text-lg px-3`}>
                        {score}/10
                    </Badge>
                </div>
            </div>

            {/* The One-Slider */}
            <div className="space-y-4">
                <div className="relative pt-2">
                    <Slider
                        value={[score]}
                        onValueChange={([v]) => setScore(v)}
                        min={0}
                        max={10}
                        step={1}
                        className="w-full"
                    />
                    <div className={`absolute top-0 left-0 h-2 rounded-full ${getTrackColor()}`}
                        style={{ width: `${score * 10}%` }} />
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Poor Hygiene</span>
                    <span className="font-medium text-foreground">{currentLabel.label}</span>
                    <span>Excellent</span>
                </div>
            </div>

            {/* Derived Indices (Progressive Disclosure) */}
            {showDetails && (
                <div className="mt-4 pt-4 border-t space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">
                        Auto-Derived Clinical Indices:
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 bg-muted/50 rounded">
                            <div className="text-xs text-muted-foreground">Debris Index (DI-S)</div>
                            <div className="font-bold">{derivedIndices.debrisIndex.toFixed(1)}</div>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                            <div className="text-xs text-muted-foreground">Calculus Index (CI-S)</div>
                            <div className="font-bold">{derivedIndices.calculusIndex.toFixed(1)}</div>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                            <div className="text-xs text-muted-foreground">Plaque Index (PI)</div>
                            <div className="font-bold">{derivedIndices.plaqueIndex.toFixed(1)}</div>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                            <div className="text-xs text-muted-foreground">Gingival Index (GI)</div>
                            <div className="font-bold">{derivedIndices.gingivalIndex.toFixed(1)}</div>
                        </div>
                    </div>

                    <div className={`p-3 rounded-lg text-center ${derivedIndices.interpretation === 'Excellent' ? 'bg-green-100 dark:bg-green-950/30' :
                            derivedIndices.interpretation === 'Good' ? 'bg-lime-100 dark:bg-lime-950/30' :
                                derivedIndices.interpretation === 'Fair' ? 'bg-yellow-100 dark:bg-yellow-950/30' :
                                    'bg-red-100 dark:bg-red-950/30'
                        }`}>
                        <div className="text-sm text-muted-foreground">OHI-S Total</div>
                        <div className="text-2xl font-bold">{derivedIndices.ohisTotal.toFixed(1)}</div>
                        <Badge variant="outline">{derivedIndices.interpretation}</Badge>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                        Moving the slider automatically calculates OHI-S, PI, and GI for the medical record.
                    </p>
                </div>
            )}
        </Card>
    );
}
