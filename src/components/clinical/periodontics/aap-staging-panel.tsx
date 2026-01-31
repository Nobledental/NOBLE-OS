'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import {
    ToothProbingData,
    AAPStage,
    AAPGrade,
    calculateAAPStage,
    calculateAAPGrade,
    calculateChartSummary
} from '@/types/periodontal.types';

interface AAPStagingPanelProps {
    teeth: ToothProbingData[];
    hasDiabetes?: boolean;
    isSmoker?: boolean;
    boneLossPercent?: number;
    boneLossPerYear?: number;
}

const STAGE_DESCRIPTIONS: Record<AAPStage, { label: string; description: string; color: string }> = {
    'I': { label: 'Stage I - Initial', description: 'Mild periodontitis, CAL 1-2mm', color: 'bg-green-500' },
    'II': { label: 'Stage II - Moderate', description: 'Established periodontitis, CAL 3-4mm', color: 'bg-yellow-500' },
    'III': { label: 'Stage III - Severe', description: 'Advanced periodontitis with tooth loss potential, CAL ≥5mm', color: 'bg-orange-500' },
    'IV': { label: 'Stage IV - Very Severe', description: 'Extensive tooth loss, CAL ≥5mm + extensive bone loss', color: 'bg-red-600' }
};

const GRADE_DESCRIPTIONS: Record<AAPGrade, { label: string; description: string; color: string }> = {
    'A': { label: 'Grade A - Slow', description: 'Slow rate of progression, no risk factors', color: 'bg-green-500' },
    'B': { label: 'Grade B - Moderate', description: 'Moderate progression, controlled diabetes', color: 'bg-yellow-500' },
    'C': { label: 'Grade C - Rapid', description: 'Rapid progression, smoker or uncontrolled diabetes', color: 'bg-red-500' }
};

export default function AAPStagingPanel({
    teeth,
    hasDiabetes = false,
    isSmoker = false,
    boneLossPercent,
    boneLossPerYear
}: AAPStagingPanelProps) {
    const { stage, grade, summary, maxCAL, recommendations } = useMemo(() => {
        // Calculate max CAL from all sites
        let maxCAL = 0;
        let maxPD = 0;

        teeth.forEach(tooth => {
            const sites = [
                tooth.buccalMesial, tooth.buccalMid, tooth.buccalDistal,
                tooth.lingualMesial, tooth.lingualMid, tooth.lingualDistal
            ];

            sites.forEach(site => {
                if (site.cal && site.cal > maxCAL) maxCAL = site.cal;
                if (site.depth > maxPD) maxPD = site.depth;
            });
        });

        // If no CAL recorded, estimate from PD
        if (maxCAL === 0 && maxPD > 0) {
            maxCAL = Math.max(0, maxPD - 2); // Rough estimate
        }

        const chartSummary = calculateChartSummary(teeth);
        const stage = calculateAAPStage(maxCAL, boneLossPercent);
        const grade = calculateAAPGrade(boneLossPerYear, hasDiabetes, isSmoker);

        // Generate recommendations based on staging
        const recommendations: string[] = [];

        if (chartSummary.bopPercentage > 10) {
            recommendations.push('Active periodontal disease - immediate intervention required');
        }

        if (stage === 'I' || stage === 'II') {
            recommendations.push('Non-surgical therapy: Scaling & Root Planing');
            recommendations.push('Oral hygiene instruction and reinforcement');
        }

        if (stage === 'III' || stage === 'IV') {
            recommendations.push('Consider periodontal surgery (Flap, Regenerative)');
            if (chartSummary.sitesWithPD5plus > 0) {
                recommendations.push(`${chartSummary.sitesWithPD5plus} sites require surgical intervention`);
            }
        }

        if (isSmoker) {
            recommendations.push('Smoking cessation counseling critical for treatment success');
        }

        if (hasDiabetes) {
            recommendations.push('Coordinate with physician for glycemic control');
        }

        // Check for teeth with mobility III
        const mobilityIIITeeth = teeth.filter(t => t.mobility >= 3);
        if (mobilityIIITeeth.length > 0) {
            recommendations.push(`Consider extraction/splinting: Teeth ${mobilityIIITeeth.map(t => t.toothNumber).join(', ')}`);
        }

        return {
            stage,
            grade,
            summary: chartSummary,
            maxCAL,
            recommendations
        };
    }, [teeth, hasDiabetes, isSmoker, boneLossPercent, boneLossPerYear]);

    const stageInfo = STAGE_DESCRIPTIONS[stage];
    const gradeInfo = GRADE_DESCRIPTIONS[grade];

    return (
        <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                AAP Periodontitis Classification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Stage */}
                <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Stage</span>
                        <Badge className={stageInfo.color}>{stage}</Badge>
                    </div>
                    <div className="text-lg font-semibold">{stageInfo.label}</div>
                    <p className="text-sm text-muted-foreground mt-1">{stageInfo.description}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                        Max CAL: {maxCAL}mm
                    </div>
                </div>

                {/* Grade */}
                <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Grade</span>
                        <Badge className={gradeInfo.color}>{grade}</Badge>
                    </div>
                    <div className="text-lg font-semibold">{gradeInfo.label}</div>
                    <p className="text-sm text-muted-foreground mt-1">{gradeInfo.description}</p>
                    <div className="mt-2 flex gap-2">
                        {isSmoker && <Badge variant="outline" className="text-xs">Smoker</Badge>}
                        {hasDiabetes && <Badge variant="outline" className="text-xs">Diabetic</Badge>}
                    </div>
                </div>
            </div>

            {/* Active Disease Warning */}
            {summary.bopPercentage > 10 && (
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-950/30 border border-red-200 dark:border-red-800 mb-4">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-medium">ACTIVE DISEASE DETECTED</span>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        BOP {summary.bopPercentage}% indicates active periodontal inflammation.
                        Patient requires immediate attention and close monitoring.
                    </p>
                </div>
            )}

            {/* Clinical Summary */}
            <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center p-2 bg-muted/30 rounded">
                    <div className="text-xl font-bold">{summary.totalSites}</div>
                    <div className="text-xs text-muted-foreground">Sites Probed</div>
                </div>
                <div className="text-center p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                    <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{summary.sitesWithPD4plus}</div>
                    <div className="text-xs text-muted-foreground">PD ≥ 4mm</div>
                </div>
                <div className="text-center p-2 bg-red-100 dark:bg-red-900/30 rounded">
                    <div className="text-xl font-bold text-red-700 dark:text-red-300">{summary.sitesWithPD5plus}</div>
                    <div className="text-xs text-muted-foreground">PD ≥ 5mm</div>
                </div>
                <div className={`text-center p-2 rounded ${summary.bopPercentage > 10 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                    <div className={`text-xl font-bold ${summary.bopPercentage > 10 ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                        {summary.bopPercentage}%
                    </div>
                    <div className="text-xs text-muted-foreground">BOP</div>
                </div>
            </div>

            {/* Treatment Recommendations */}
            {recommendations.length > 0 && (
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Treatment Recommendations
                    </h4>
                    <ul className="space-y-1">
                        {recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Card>
    );
}
