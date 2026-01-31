'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Calculator, AlertTriangle } from 'lucide-react';

interface WARData {
    toothNumber: number;
    winterClass: string;
    archClass: string;
    radioDepth: string;
}

export default function WARAssessmentModule() {
    const [toothNumber, setToothNumber] = useState<number>(38);
    const [winterClass, setWinterClass] = useState<string>('');
    const [archClass, setArchClass] = useState<string>('');
    const [radioDepth, setRadioDepth] = useState<string>('');
    const [assessment, setAssessment] = useState<any>(null);

    const calculateWARScore = () => {
        let score = 0;

        // Winter's Classification
        if (winterClass === 'VERTICAL') score += 1;
        else if (winterClass === 'MESIOANGULAR') score += 2;
        else if (winterClass === 'HORIZONTAL') score += 3;
        else if (winterClass === 'DISTOANGULAR') score += 4;

        // Arch Relationship
        if (archClass === 'CLASS_I') score += 1;
        else if (archClass === 'CLASS_II') score += 2;
        else if (archClass === 'CLASS_III') score += 3;

        // Radio Depth
        if (radioDepth === 'POSITION_A') score += 1;
        else if (radioDepth === 'POSITION_B') score += 2;
        else if (radioDepth === 'POSITION_C') score += 3;

        let difficulty = 'EASY';
        let surgicalTime = '15-20 min';
        let complications = 'Minimal';

        if (score >= 7) {
            difficulty = 'DIFFICULT';
            surgicalTime = '45-60 min';
            complications = 'High risk of nerve injury, bone removal required';
        } else if (score >= 4) {
            difficulty = 'MODERATE';
            surgicalTime = '25-35 min';
            complications = 'Moderate risk, sectioning likely required';
        } else {
            complications = 'Low risk, simple extraction';
        }

        setAssessment({
            score,
            difficulty,
            surgicalTime,
            complications,
            winterClass,
            archClass,
            radioDepth
        });
    };

    const getDifficultyColor = (difficulty: string) => {
        if (difficulty === 'EASY') return 'bg-green-500';
        if (difficulty === 'MODERATE') return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const saveAssessment = async () => {
        const response = await fetch('/api/clinical/surgery/war-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                toothNumber,
                angulation: winterClass,
                depth: radioDepth,
                relationToRamus: archClass
            })
        });
        const result = await response.json();
        console.log('WAR Assessment Saved:', result);
    };

    return (
        <Card className=\"p-6 space-y-6\">
            < div className =\"flex items-center gap-2\">
                < Calculator className =\"w-5 h-5 text-orange-500\" />
                    < h3 className =\"text-lg font-semibold\">WAR Assessment Module</h3>
                        < Badge variant =\"outline\" className=\"ml-auto\">Oral Surgery</Badge>
            </div >

        <div className=\"grid grid-cols-2 gap-4\">
    {/* Tooth Selection */ }
    <div className=\"space-y-2\">
        < Label > Impacted Tooth</Label >
                    <Select value={toothNumber.toString()} onValueChange={(v) => setToothNumber(parseInt(v))}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value=\"18\">Tooth 18 (UR8)</SelectItem>
                            <SelectItem value=\"28\">Tooth 28 (UL8)</SelectItem>
                            <SelectItem value=\"38\">Tooth 38 (LL8)</SelectItem>
        < SelectItem value =\"48\">Tooth 48 (LR8)</SelectItem>
                        </SelectContent >
                    </Select >
                </div >

        {/* Winter's Classification */ }
        < div className =\"space-y-2\">
            < Label > Winter's Classification (Angulation)</Label>
                < Select value = { winterClass } onValueChange = { setWinterClass } >
                        <SelectTrigger>
                            <SelectValue placeholder=\"Select...\" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value=\"VERTICAL\">Vertical</SelectItem>
                            <SelectItem value=\"MESIOANGULAR\">Mesioangular</SelectItem>
        < SelectItem value =\"HORIZONTAL\">Horizontal</SelectItem>
            < SelectItem value =\"DISTOANGULAR\">Distoangular</SelectItem>
                        </SelectContent >
                    </Select >
                </div >

        {/* Arch Relationship */ }
        < div className =\"space-y-2\">
            < Label > Arch Relationship</Label >
                    <Select value={archClass} onValueChange={setArchClass}>
                        <SelectTrigger>
                            <SelectValue placeholder=\"Select...\" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value=\"CLASS_I\">Class I (Adequate space)</SelectItem>
                            <SelectItem value=\"CLASS_II\">Class II (Reduced space)</SelectItem>
                            <SelectItem value=\"CLASS_III\">Class III (No space)</SelectItem>
                        </SelectContent >
                    </Select >
                </div >

        {/* Radio Depth */ }
        < div className =\"space-y-2\">
            < Label > Radio Depth(Position)</Label >
                    <Select value={radioDepth} onValueChange={setRadioDepth}>
                        <SelectTrigger>
                            <SelectValue placeholder=\"Select...\" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value=\"POSITION_A\">Position A (Above occlusal)</SelectItem>
                            <SelectItem value=\"POSITION_B\">Position B (At occlusal)</SelectItem>
                            <SelectItem value=\"POSITION_C\">Position C (Below occlusal)</SelectItem>
                        </SelectContent >
                    </Select >
                </div >
            </div >

        <Button
            onClick={calculateWARScore}
            disabled={!winterClass || !archClass || !radioDepth}
            className=\"w-full\"
                >
                Calculate Surgical Difficulty
            </Button >

        { assessment && (
            <div className=\"border-t pt-4 space-y-4\">
                < div className =\"flex items-center justify-between\">
                    < span className =\"font-medium\">Difficulty Score:</span>
                        < Badge className = { getDifficultyColor(assessment.difficulty) + ' text-white'
}>
    { assessment.score } / 10 - { assessment.difficulty }
                        </Badge >
                    </div >

    <div className=\"grid grid-cols-2 gap-4 text-sm\">
        < div className =\"bg-muted/50 p-3 rounded-lg\">
            < div className =\"text-xs text-muted-foreground\">Estimated Surgical Time</div>
                < div className =\"font-medium mt-1\">{assessment.surgicalTime}</div>
                        </div >
    <div className=\"bg-muted/50 p-3 rounded-lg\">
        < div className =\"text-xs text-muted-foreground\">Classification</div>
            < div className =\"font-medium mt-1\">{assessment.winterClass.replace('_', ' ')}</div>
                        </div >
                    </div >

    <div className=\"bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 p-3 rounded-lg\">
        < div className =\"flex gap-2\">
            < AlertTriangle className =\"w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5\" />
                < div >
                <div className=\"text-sm font-medium text-orange-900 dark:text-orange-200\">Complications Risk</div>
                    < div className =\"text-xs text-orange-700 dark:text-orange-300 mt-1\">{assessment.complications}</div>
                            </div >
                        </div >
                    </div >

    <Button onClick={saveAssessment} variant=\"outline\" className=\"w-full\">
                        Save WAR Assessment to Case Sheet
                    </Button >
                </div >
            )}
        </Card >
    );
}
