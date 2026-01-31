'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Baby, User, Calendar, Sparkles, AlertCircle, ChevronRight
} from 'lucide-react';
import {
    Gender,
    DentitionStage,
    FDITooth,
    PrimaryTooth,
    AdultTooth,
    EruptionPrediction,
    getExpectedEruptions,
    getDentitionStage,
    getExpectedSheddingTeeth,
    getAgeStageLabel,
    PRIMARY_ERUPTION_DATA,
    PERMANENT_ERUPTION_DATA
} from '@/types/chronology.types';

interface EruptionPredictorProps {
    dateOfBirth: string;
    gender: Gender;
    existingTeeth?: FDITooth[];
    onToothSelect?: (tooth: FDITooth) => void;
}

// Tooth position grid (simplified visual)
const UPPER_PRIMARY = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65] as PrimaryTooth[];
const LOWER_PRIMARY = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75] as PrimaryTooth[];
const UPPER_PERMANENT = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28] as AdultTooth[];
const LOWER_PERMANENT = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38] as AdultTooth[];

export default function EruptionPredictor({
    dateOfBirth,
    gender,
    existingTeeth = [],
    onToothSelect
}: EruptionPredictorProps) {
    const [showMixed, setShowMixed] = useState(true);
    const [showPrimary, setShowPrimary] = useState(true);

    const ageInMonths = useMemo(() => {
        const dob = new Date(dateOfBirth);
        const now = new Date();
        return (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
    }, [dateOfBirth]);

    const ageInYears = Math.floor(ageInMonths / 12);
    const dentitionStage = getDentitionStage(ageInMonths);
    const predictions = getExpectedEruptions(ageInMonths, gender);
    const sheddingTeeth = getExpectedSheddingTeeth(ageInMonths, gender);

    // Get prediction for a specific tooth
    const getPrediction = (tooth: FDITooth): EruptionPrediction | undefined => {
        return predictions.find(p => p.toothNumber === tooth);
    };

    // Get tooth cell styling based on status
    const getToothStyle = (tooth: FDITooth, isPrimary: boolean) => {
        const prediction = getPrediction(tooth);
        const isExisting = existingTeeth.includes(tooth);
        const isShedding = sheddingTeeth.includes(tooth as PrimaryTooth);

        if (isExisting) {
            return 'bg-green-500 text-white';
        }
        if (isShedding) {
            return 'bg-orange-400 text-white animate-pulse';
        }
        if (prediction?.status === 'erupting') {
            return 'bg-blue-500 text-white ring-2 ring-blue-300 animate-pulse';
        }
        if (prediction?.status === 'expected_soon') {
            return 'bg-yellow-400 text-black';
        }
        return 'bg-muted text-muted-foreground';
    };

    // Upcoming eruptions
    const upcomingEruptions = predictions.filter(
        p => p.status === 'erupting' || p.status === 'expected_soon'
    );

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        FDI Eruption Predictor
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                            {gender === 'male' ? '♂' : '♀'} {ageInYears} years old
                        </Badge>
                        <Badge variant={
                            dentitionStage === 'primary' ? 'default' :
                                dentitionStage === 'mixed' ? 'secondary' : 'outline'
                        }>
                            {dentitionStage === 'primary' && <Baby className="w-3 h-3 mr-1" />}
                            {dentitionStage === 'permanent' && <User className="w-3 h-3 mr-1" />}
                            {getAgeStageLabel(ageInMonths)}
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                        <Switch checked={showPrimary} onCheckedChange={setShowPrimary} />
                        Primary
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <Switch checked={showMixed} onCheckedChange={setShowMixed} />
                        Mixed View
                    </label>
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-4 text-xs flex-wrap">
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-green-500" />
                    <span>Present</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-blue-500 animate-pulse" />
                    <span>Erupting Now</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-yellow-400" />
                    <span>Expected Soon</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-orange-400" />
                    <span>Shedding</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-muted" />
                    <span>Future</span>
                </div>
            </div>

            {/* Tooth Chart */}
            <div className="space-y-2">
                {/* Primary Upper */}
                {showPrimary && (
                    <div className="flex justify-center gap-1">
                        {UPPER_PRIMARY.map(tooth => (
                            <button
                                key={tooth}
                                onClick={() => onToothSelect?.(tooth)}
                                className={`w-8 h-8 rounded text-xs font-medium transition-all hover:scale-110 ${getToothStyle(tooth, true)}`}
                                title={getPrediction(tooth)?.message}
                            >
                                {tooth}
                            </button>
                        ))}
                    </div>
                )}

                {/* Permanent Upper */}
                {showMixed && (
                    <div className="flex justify-center gap-1">
                        {UPPER_PERMANENT.map(tooth => (
                            <button
                                key={tooth}
                                onClick={() => onToothSelect?.(tooth)}
                                className={`w-7 h-7 rounded text-xs font-medium transition-all hover:scale-110 ${getToothStyle(tooth, false)}`}
                                title={getPrediction(tooth)?.message}
                            >
                                {tooth}
                            </button>
                        ))}
                    </div>
                )}

                <div className="border-t my-2" />

                {/* Permanent Lower */}
                {showMixed && (
                    <div className="flex justify-center gap-1">
                        {LOWER_PERMANENT.map(tooth => (
                            <button
                                key={tooth}
                                onClick={() => onToothSelect?.(tooth)}
                                className={`w-7 h-7 rounded text-xs font-medium transition-all hover:scale-110 ${getToothStyle(tooth, false)}`}
                                title={getPrediction(tooth)?.message}
                            >
                                {tooth}
                            </button>
                        ))}
                    </div>
                )}

                {/* Primary Lower */}
                {showPrimary && (
                    <div className="flex justify-center gap-1">
                        {LOWER_PRIMARY.map(tooth => (
                            <button
                                key={tooth}
                                onClick={() => onToothSelect?.(tooth)}
                                className={`w-8 h-8 rounded text-xs font-medium transition-all hover:scale-110 ${getToothStyle(tooth, true)}`}
                                title={getPrediction(tooth)?.message}
                            >
                                {tooth}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Upcoming Eruptions Alert */}
            {upcomingEruptions.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200">
                    <div className="flex items-center gap-2 font-medium text-blue-800 dark:text-blue-200 mb-2">
                        <Sparkles className="w-4 h-4" />
                        Expected Eruptions for {ageInYears}-year-old {gender}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {upcomingEruptions.slice(0, 8).map(prediction => (
                            <Badge
                                key={prediction.toothNumber}
                                variant={prediction.status === 'erupting' ? 'default' : 'secondary'}
                            >
                                #{prediction.toothNumber}: {prediction.message}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* 6-Year Molar Alert */}
            {ageInMonths >= 66 && ageInMonths <= 84 && (
                <div className="mt-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200">
                    <div className="flex items-center gap-2 font-medium text-purple-800 dark:text-purple-200">
                        <AlertCircle className="w-4 h-4" />
                        First Permanent Molar Alert ("6-Year Molars")
                    </div>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                        Teeth 16, 26, 36, 46 are erupting. These are the most important teeth for occlusion.
                        <br />
                        <strong>Recommend:</strong> Fissure sealants to prevent caries.
                    </p>
                </div>
            )}

            {/* Shedding Teeth Alert */}
            {sheddingTeeth.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200">
                    <div className="flex items-center gap-2 font-medium text-orange-800 dark:text-orange-200">
                        <ChevronRight className="w-4 h-4" />
                        Primary Teeth Expected to Shed
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {sheddingTeeth.map(tooth => (
                            <Badge key={tooth} variant="outline" className="bg-orange-100">
                                #{tooth}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
