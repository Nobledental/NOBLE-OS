'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Timer, Droplet, Activity } from 'lucide-react';
import {
    stageOSMF, OSMFResult,
    assessSalivaryFlow, SalivaryFlowResult, SalivaConsistency
} from '@/types/clinical-indices.types';

interface IndiaModulesProps {
    onOSMFComplete?: (result: OSMFResult) => void;
    onSalivaryComplete?: (result: SalivaryFlowResult) => void;
}

export default function IndiaSpecificModules({ onOSMFComplete, onSalivaryComplete }: IndiaModulesProps) {
    // OSMF State
    const [mouthOpening, setMouthOpening] = useState<number | ''>('');
    const [hasBands, setHasBands] = useState(true);
    const [osmfResult, setOsmfResult] = useState<OSMFResult | null>(null);

    // Leukoplakia State
    const [leukoplakiaSize, setLeukoplakiaSize] = useState<string>('');
    const [leukoplakiaTexture, setLeukoplakiaTexture] = useState<'Homogeneous' | 'Non-homogeneous' | ''>('');

    // Salivary Flow State
    const [salivaVolume, setSalivaVolume] = useState<number | ''>('');
    const [salivaDuration, setSalivaDuration] = useState<number>(5);
    const [salivaConsistency, setSalivaConsistency] = useState<SalivaConsistency>('Serous');
    const [salivaResult, setSalivaResult] = useState<SalivaryFlowResult | null>(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);

    // OSMF Staging
    const handleOSMFStage = () => {
        if (mouthOpening === '') return;
        const result = stageOSMF(mouthOpening, hasBands);
        setOsmfResult(result);
        onOSMFComplete?.(result);
    };

    // Salivary Flow Test
    const startSalivaTimer = () => {
        setIsTimerRunning(true);
        setTimerSeconds(0);
        const interval = setInterval(() => {
            setTimerSeconds(prev => {
                if (prev >= salivaDuration * 60 - 1) {
                    clearInterval(interval);
                    setIsTimerRunning(false);
                    return salivaDuration * 60;
                }
                return prev + 1;
            });
        }, 1000);
    };

    const handleSalivaryAnalysis = () => {
        if (salivaVolume === '') return;
        const result = assessSalivaryFlow(salivaVolume, salivaDuration, salivaConsistency);
        setSalivaResult(result);
        onSalivaryComplete?.(result);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getOSMFStageColor = (stage: string) => {
        switch (stage) {
            case 'I': return 'bg-yellow-500';
            case 'II': return 'bg-orange-500';
            case 'III': return 'bg-red-500';
            case 'IVA': case 'IVB': return 'bg-red-700';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-4">
            {/* OSMF Staging */}
            <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    OSMF Staging (India-Specific)
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Maximum Mouth Opening (mm)</label>
                        <Input
                            type="number"
                            placeholder="e.g., 25"
                            value={mouthOpening}
                            onChange={(e) => setMouthOpening(e.target.value ? parseInt(e.target.value) : '')}
                        />
                        <div className="text-xs text-muted-foreground">Normal: ≥40mm (3 fingers)</div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Palpable Fibrous Bands</label>
                        <div className="flex gap-2">
                            <Button
                                variant={hasBands ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setHasBands(true)}
                                className="flex-1"
                            >
                                Present
                            </Button>
                            <Button
                                variant={!hasBands ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setHasBands(false)}
                                className="flex-1"
                            >
                                Absent
                            </Button>
                        </div>
                    </div>
                </div>

                <Button onClick={handleOSMFStage} className="w-full mb-4">
                    Calculate OSMF Stage
                </Button>

                {osmfResult && (
                    <div className={`p-4 rounded-lg border ${osmfResult.stage.startsWith('IV')
                            ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700'
                            : 'bg-orange-50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-700'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Stage:</span>
                            <Badge className={getOSMFStageColor(osmfResult.stage)}>
                                {osmfResult.stage}
                            </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                            <p><strong>Description:</strong> {osmfResult.description}</p>
                            <p><strong>Opening Range:</strong> {osmfResult.mouthOpeningRange}</p>
                            <p><strong>Malignancy Risk:</strong> <span className="text-red-600 font-medium">{osmfResult.malignancyRisk}</span></p>
                            <p className="pt-2 border-t mt-2"><strong>Management:</strong> {osmfResult.suggestedManagement}</p>
                        </div>
                    </div>
                )}
            </Card>

            {/* Leukoplakia Assessment */}
            <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    Leukoplakia Assessment
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Size/Extent</label>
                        <Input
                            placeholder="e.g., 2cm x 1cm, buccal mucosa"
                            value={leukoplakiaSize}
                            onChange={(e) => setLeukoplakiaSize(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Texture Type</label>
                        <Select
                            value={leukoplakiaTexture}
                            onValueChange={(v: 'Homogeneous' | 'Non-homogeneous') => setLeukoplakiaTexture(v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Homogeneous">Homogeneous (Lower risk)</SelectItem>
                                <SelectItem value="Non-homogeneous">Non-homogeneous (Higher risk - Biopsy!)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {leukoplakiaTexture === 'Non-homogeneous' && (
                    <div className="mt-3 p-3 rounded bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm">
                        <strong>⚠️ HIGH MALIGNANCY RISK:</strong> Non-homogeneous leukoplakia requires immediate biopsy.
                        Consider referral to oral surgeon.
                    </div>
                )}
            </Card>

            {/* Salivary Flow Test */}
            <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-blue-500" />
                    Salivary Flow Test (Spit Test)
                </h3>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Duration (minutes)</label>
                        <Select
                            value={salivaDuration.toString()}
                            onValueChange={(v) => setSalivaDuration(parseInt(v))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1 min</SelectItem>
                                <SelectItem value="5">5 min (standard)</SelectItem>
                                <SelectItem value="10">10 min</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Volume Collected (mL)</label>
                        <Input
                            type="number"
                            step="0.1"
                            placeholder="e.g., 2.5"
                            value={salivaVolume}
                            onChange={(e) => setSalivaVolume(e.target.value ? parseFloat(e.target.value) : '')}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Consistency</label>
                        <Select
                            value={salivaConsistency}
                            onValueChange={(v: SalivaConsistency) => setSalivaConsistency(v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Serous">Serous (Normal)</SelectItem>
                                <SelectItem value="Mucous">Mucous (Thick)</SelectItem>
                                <SelectItem value="Frothy">Frothy</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-3 mb-4">
                    <Button
                        onClick={startSalivaTimer}
                        disabled={isTimerRunning}
                        variant="outline"
                        className="flex-1"
                    >
                        <Timer className="w-4 h-4 mr-2" />
                        {isTimerRunning ? formatTime(timerSeconds) : 'Start Timer'}
                    </Button>
                    <Button onClick={handleSalivaryAnalysis} className="flex-1">
                        Analyze Flow Rate
                    </Button>
                </div>

                {salivaResult && (
                    <div className={`p-4 rounded-lg border ${salivaResult.xerostomiaRisk === 'High'
                            ? 'bg-red-50 dark:bg-red-950/30 border-red-300'
                            : salivaResult.xerostomiaRisk === 'Moderate'
                                ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-300'
                                : 'bg-green-50 dark:bg-green-950/30 border-green-300'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Flow Rate:</span>
                            <span className="text-lg font-bold">{salivaResult.flowRate} mL/min</span>
                        </div>
                        <div className="space-y-1 text-sm">
                            <p><strong>Assessment:</strong> {salivaResult.assessment}</p>
                            <p><strong>Xerostomia Risk:</strong>
                                <Badge variant={salivaResult.xerostomiaRisk === 'High' ? 'destructive' : 'secondary'} className="ml-2">
                                    {salivaResult.xerostomiaRisk}
                                </Badge>
                            </p>
                            {salivaResult.recommendations.length > 0 && (
                                <div className="pt-2 border-t mt-2">
                                    <strong>Recommendations:</strong>
                                    <ul className="list-disc ml-4 mt-1">
                                        {salivaResult.recommendations.map((rec, idx) => (
                                            <li key={idx}>{rec}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
