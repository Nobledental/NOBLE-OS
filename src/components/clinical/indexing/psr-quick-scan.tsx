'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { PSRCode, interpretPSR, PSRResult } from '@/types/clinical-indices.types';

interface PSRQuickScanProps {
    onComplete?: (result: PSRResult) => void;
}

const SEXTANT_LABELS = [
    'UR Posterior (14-18)',
    'Upper Anterior (13-23)',
    'UL Posterior (24-28)',
    'LR Posterior (44-48)',
    'Lower Anterior (43-33)',
    'LL Posterior (34-38)'
];

const CODE_DESCRIPTIONS: Record<PSRCode, { label: string; color: string; description: string }> = {
    0: { label: '0', color: 'bg-green-500', description: 'Healthy' },
    1: { label: '1', color: 'bg-green-400', description: 'Bleeding on probing' },
    2: { label: '2', color: 'bg-yellow-500', description: 'Calculus/retention factors' },
    3: { label: '3', color: 'bg-orange-500', description: 'Pockets 3.5-5.5mm' },
    4: { label: '4', color: 'bg-red-500', description: 'Pockets >5.5mm' }
};

export default function PSRQuickScan({ onComplete }: PSRQuickScanProps) {
    const [codes, setCodes] = useState<PSRCode[]>([0, 0, 0, 0, 0, 0]);
    const [isComplete, setIsComplete] = useState(false);

    const result = useMemo(() => {
        if (!isComplete) return null;
        return interpretPSR(codes as [PSRCode, PSRCode, PSRCode, PSRCode, PSRCode, PSRCode]);
    }, [codes, isComplete]);

    const handleCodeChange = (sextantIndex: number, code: PSRCode) => {
        const newCodes = [...codes];
        newCodes[sextantIndex] = code;
        setCodes(newCodes as PSRCode[]);
    };

    const handleComplete = () => {
        setIsComplete(true);
        const psrResult = interpretPSR(codes as [PSRCode, PSRCode, PSRCode, PSRCode, PSRCode, PSRCode]);
        onComplete?.(psrResult);
        toast.success(`PSR Complete: Maximum Code ${psrResult.maxCode}`);
    };

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    PSR/CPITN Quick Scan
                </h3>
                {!isComplete && (
                    <Button onClick={handleComplete} size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Exam
                    </Button>
                )}
            </div>

            {/* Code Reference */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {Object.entries(CODE_DESCRIPTIONS).map(([code, info]) => (
                    <div key={code} className="flex items-center gap-1 text-xs">
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-white font-bold ${info.color}`}>
                            {info.label}
                        </span>
                        <span className="text-muted-foreground">{info.description}</span>
                    </div>
                ))}
            </div>

            {/* Sextant Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                {SEXTANT_LABELS.map((label, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground mb-2">{label}</div>
                        <div className="flex gap-1">
                            {([0, 1, 2, 3, 4] as PSRCode[]).map(code => (
                                <button
                                    key={code}
                                    onClick={() => handleCodeChange(idx, code)}
                                    className={`w-8 h-8 rounded font-bold text-sm transition-all ${codes[idx] === code
                                            ? `${CODE_DESCRIPTIONS[code].color} text-white ring-2 ring-offset-2 ring-blue-500`
                                            : 'bg-background border hover:bg-muted'
                                        }`}
                                >
                                    {code}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Results */}
            {result && (
                <div className={`p-4 rounded-lg border ${result.maxCode >= 4
                        ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                        : result.maxCode >= 3
                            ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
                            : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                    }`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Maximum Code: </span>
                        <Badge className={CODE_DESCRIPTIONS[result.maxCode].color}>
                            {result.maxCode}
                        </Badge>
                    </div>
                    <div className="text-sm mb-2">
                        <strong>Assessment:</strong> {result.overallAssessment}
                    </div>
                    <div className="text-sm">
                        <strong>Suggested Treatment:</strong> {result.suggestedTreatment}
                    </div>
                </div>
            )}
        </Card>
    );
}
