'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertCircle, CheckCircle } from 'lucide-react';

interface DiagnosisSuggestion {
    diagnosis: string;
    icd_code: string;
    confidence: number;
}

const symptomOptions = [
    { value: 'radiating_pain', label: 'Radiating Pain' },
    { value: 'thermal_sensitivity', label: 'Thermal Sensitivity' },
    { value: 'swelling', label: 'Swelling' },
    { value: 'bleeding_gums', label: 'Bleeding Gums' }
];

export default function AIProvisionalDiagnosis() {
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<DiagnosisSuggestion[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleSymptom = (symptom: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(symptom)
                ? prev.filter(s => s !== symptom)
                : [...prev, symptom]
        );
    };

    const analyzeSuggestions = async () => {
        if (selectedSymptoms.length === 0) return;
        setLoading(true);
        try {
            const response = await fetch('/api/clinical/diagnosis/provisional', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms: selectedSymptoms })
            });
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Failed to fetch diagnosis:', error);
        } finally {
            setLoading(false);
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return 'bg-green-500';
        if (confidence >= 0.6) return 'bg-yellow-500';
        return 'bg-orange-500';
    };

    return (
        <Card className=\"p-6 space-y-4\">
            < div className =\"flex items-center gap-2\">
                < Brain className =\"w-5 h-5 text-purple-500\" />
                    < h3 className =\"text-lg font-semibold\">AI Provisional Diagnosis Suggestor</h3>
            </div >

        <div className=\"space-y-3\">
            < p className =\"text-sm text-muted-foreground\">Select observed symptoms:</p>
                < div className =\"flex flex-wrap gap-2\">
    {
        symptomOptions.map(symptom => (
            <Button
                key={symptom.value}
                variant={selectedSymptoms.includes(symptom.value) ?\"default\" : \"outline\"}
                            size =\"sm\"
                            onClick = {() => toggleSymptom(symptom.value)}
                        >
        { symptom.label }
                        </Button >
                    ))
}
                </div >

    <Button
        onClick={analyzeSuggestions}
        disabled={selectedSymptoms.length === 0 || loading}
        className=\"w-full\"
            >
            { loading? 'Analyzing...': 'Analyze' }
                </Button >
            </div >

{
    suggestions.length > 0 && (
        <div className=\"space-y-2 mt-4 border-t pt-4\">
        <p className =\"text-sm font-medium\">Suggested Diagnoses:</p>
                    {
        suggestions.map((suggestion, index) => (
            <div
                key={index}
                className=\"flex items-center justify-between p-3 bg-muted/50 rounded-lg\"
        >
        <div className=\"flex-1\">
        < div className =\"flex items-center gap-2\">
        < CheckCircle className =\"w-4 h-4 text-green-500\" />
        < span className =\"font-medium\">{suggestion.diagnosis}</span>
                                </div >
            <span className=\"text-xs text-muted-foreground\">ICD-10: {suggestion.icd_code}</span>
                            </div >
            <Badge className={getConfidenceColor(suggestion.confidence)}>
                {Math.round(suggestion.confidence * 100)}%
            </Badge>
                        </div >
                    ))
    }
                </div>
            )}
        </Card >
    );
}
