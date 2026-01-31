'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, CheckCircle, X, Lightbulb, ChevronRight } from 'lucide-react';
import {
    ToothSurface,
    GVBlackResult,
    EllisFractureResult,
    KennedyResult,
    classifyGVBlack,
    classifyEllisFracture,
    classifyKennedy,
    calculateDMFT,
    DMFTResult
} from '@/types/clinical-indices.types';

interface DiagnosticSuggestion {
    type: 'gvblack' | 'ellis' | 'kennedy' | 'dmft';
    classification: string;
    description: string;
    suggestedTreatment: string;
    confidence: 'high' | 'medium';
    accepted?: boolean;
}

interface ClassificationMapperProps {
    toothNumber: number;
    toothStatus: 'healthy' | 'decayed' | 'missing' | 'filled' | 'fractured';
    affectedSurfaces: ToothSurface[];
    allMissingTeeth: number[];
    allDecayedTeeth: number[];
    allFilledTeeth: number[];
    onDiagnosisAccept?: (suggestion: DiagnosticSuggestion) => void;
    onDiagnosisOverride?: (suggestion: DiagnosticSuggestion, newValue: string) => void;
}

export default function ClassificationMapper({
    toothNumber,
    toothStatus,
    affectedSurfaces,
    allMissingTeeth,
    allDecayedTeeth,
    allFilledTeeth,
    onDiagnosisAccept,
    onDiagnosisOverride
}: ClassificationMapperProps) {
    const [fracture, setFracture] = useState({
        involvesEnamel: false,
        involvesDentin: false,
        involvesPulp: false,
        isRootFracture: false,
        isAvulsed: false,
        isLuxated: false
    });
    const [acceptedSuggestions, setAcceptedSuggestions] = useState<Set<string>>(new Set());

    const suggestions = useMemo(() => {
        const results: DiagnosticSuggestion[] = [];

        // G.V. Black classification for decay
        if (toothStatus === 'decayed' && affectedSurfaces.length > 0) {
            const gvResult = classifyGVBlack(toothNumber, affectedSurfaces, fracture.involvesPulp);
            results.push({
                type: 'gvblack',
                classification: `G.V. Black Class ${gvResult.classification}`,
                description: gvResult.description,
                suggestedTreatment: gvResult.suggestedTreatment,
                confidence: 'high'
            });
        }

        // Ellis classification for fracture
        if (toothStatus === 'fractured') {
            const ellisResult = classifyEllisFracture(
                fracture.involvesEnamel,
                fracture.involvesDentin,
                fracture.involvesPulp,
                fracture.isRootFracture,
                fracture.isAvulsed,
                fracture.isLuxated
            );
            results.push({
                type: 'ellis',
                classification: `Ellis Class ${ellisResult.classification}`,
                description: ellisResult.description,
                suggestedTreatment: ellisResult.suggestedTreatment,
                confidence: 'high'
            });
        }

        // Kennedy classification for missing teeth
        if (allMissingTeeth.length > 0) {
            const arch = toothNumber >= 31 ? 'mandible' : 'maxilla';
            const kennedyResult = classifyKennedy(allMissingTeeth, arch);
            results.push({
                type: 'kennedy',
                classification: `Kennedy Class ${kennedyResult.classification}`,
                description: kennedyResult.applegateRules.join('; ') || 'Standard classification',
                suggestedTreatment: kennedyResult.suggestedTreatment,
                confidence: 'medium'
            });
        }

        // DMFT Index
        const dmftResult = calculateDMFT(allDecayedTeeth, allMissingTeeth, allFilledTeeth);
        if (dmftResult.total > 0) {
            results.push({
                type: 'dmft',
                classification: `DMFT: ${dmftResult.total}`,
                description: `D=${dmftResult.decayed}, M=${dmftResult.missing}, F=${dmftResult.filled}`,
                suggestedTreatment: dmftResult.severity === 'Very High'
                    ? 'Comprehensive caries management program'
                    : 'Standard preventive care',
                confidence: 'high'
            });
        }

        return results;
    }, [toothNumber, toothStatus, affectedSurfaces, allMissingTeeth, allDecayedTeeth, allFilledTeeth, fracture]);

    const handleAccept = (suggestion: DiagnosticSuggestion) => {
        setAcceptedSuggestions(prev => new Set([...prev, suggestion.classification]));
        onDiagnosisAccept?.({ ...suggestion, accepted: true });
    };

    const isAnterior = [11, 12, 13, 21, 22, 23, 31, 32, 33, 41, 42, 43].includes(toothNumber);

    return (
        <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Auto-Classification Engine</h3>
                <Badge variant="outline" className="ml-auto">Tooth #{toothNumber}</Badge>
            </div>

            {/* Fracture Detail Inputs (for anterior teeth with fractures) */}
            {toothStatus === 'fractured' && isAnterior && (
                <div className="mb-4 p-3 rounded-lg bg-muted/50">
                    <h4 className="text-sm font-medium mb-2">Ellis Fracture Details</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <label className="flex items-center gap-2">
                            <Checkbox
                                checked={fracture.involvesEnamel}
                                onCheckedChange={(c) => setFracture({ ...fracture, involvesEnamel: !!c })}
                            />
                            Enamel
                        </label>
                        <label className="flex items-center gap-2">
                            <Checkbox
                                checked={fracture.involvesDentin}
                                onCheckedChange={(c) => setFracture({ ...fracture, involvesDentin: !!c })}
                            />
                            Dentin
                        </label>
                        <label className="flex items-center gap-2">
                            <Checkbox
                                checked={fracture.involvesPulp}
                                onCheckedChange={(c) => setFracture({ ...fracture, involvesPulp: !!c })}
                            />
                            Pulp Exposed
                        </label>
                        <label className="flex items-center gap-2">
                            <Checkbox
                                checked={fracture.isRootFracture}
                                onCheckedChange={(c) => setFracture({ ...fracture, isRootFracture: !!c })}
                            />
                            Root Fracture
                        </label>
                        <label className="flex items-center gap-2">
                            <Checkbox
                                checked={fracture.isLuxated}
                                onCheckedChange={(c) => setFracture({ ...fracture, isLuxated: !!c })}
                            />
                            Luxation
                        </label>
                        <label className="flex items-center gap-2">
                            <Checkbox
                                checked={fracture.isAvulsed}
                                onCheckedChange={(c) => setFracture({ ...fracture, isAvulsed: !!c })}
                            />
                            Avulsed
                        </label>
                    </div>
                </div>
            )}

            {/* Suggestions */}
            {suggestions.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                    <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Mark findings on the tooth to generate classifications</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {suggestions.map((suggestion, idx) => {
                        const isAccepted = acceptedSuggestions.has(suggestion.classification);

                        return (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg border transition-colors ${isAccepted
                                        ? 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700'
                                        : 'bg-muted/50 border-border'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={suggestion.confidence === 'high' ? 'default' : 'secondary'}>
                                            {suggestion.classification}
                                        </Badge>
                                        {isAccepted && (
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        )}
                                    </div>
                                    {!isAccepted && (
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleAccept(suggestion)}
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Accept
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onDiagnosisOverride?.(suggestion, '')}
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Override
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                                <div className="flex items-center gap-1 mt-2 text-sm">
                                    <ChevronRight className="w-4 h-4 text-blue-500" />
                                    <span className="text-blue-600 dark:text-blue-400">{suggestion.suggestedTreatment}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Summary for Case Sheet */}
            {acceptedSuggestions.size > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Provisional Diagnosis Summary
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        {Array.from(acceptedSuggestions).join(' • ')}
                    </p>
                </div>
            )}
        </Card>
    );
}
