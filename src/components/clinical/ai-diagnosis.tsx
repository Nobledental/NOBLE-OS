'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertCircle, CheckCircle, Stethoscope } from 'lucide-react';
import { provisionalDiagnosisEngine, DiagnosticInput } from '@/lib/icd10-mapping';

const symptomOptions = [
    { value: 'sharp_pain', label: 'Sharp Pain' },
    { value: 'spontaneous_pain', label: 'Spontaneous Pain' },
    { value: 'throbbing_pain', label: 'Throbbing Pain' },
    { value: 'radiating_pain', label: 'Radiating Pain' },
    { value: 'thermal_sensitivity', label: 'Thermal Sensitivity' },
    { value: 'pain_with_cold', label: 'Pain with Cold' },
    { value: 'nocturnal_pain', label: 'Nocturnal Pain' },
    { value: 'severe_pain_biting', label: 'Pain on Biting' },
    { value: 'swelling', label: 'Swelling' },
    { value: 'bleeding_gums', label: 'Bleeding Gums' },
    { value: 'fever', label: 'Fever' }
];

const clinicalFindingOptions = [
    { value: 'pain_subsides_instantly', label: 'Pain Subsides Instantly' },
    { value: 'lingering_cold_pain', label: 'Lingering Pain with Cold' },
    { value: 'pain_worse_lying_down', label: 'Worse When Lying Down' },
    { value: 'no_cold_response', label: 'No Response to Cold Test' },
    { value: 'tender_to_percussion', label: 'Tender to Percussion (TTP)' },
    { value: 'fluctuant_swelling', label: 'Fluctuant Swelling' },
    { value: 'exposed_bone', label: 'Exposed Bone' },
    { value: 'inflamed_operculum', label: 'Inflamed Operculum' }
];

const vitalSignOptions = [
    { value: 'elevated_temperature', label: 'Elevated Temperature (>100°F)' },
    { value: 'normal_vitals', label: 'Normal Vitals' }
];

export default function AIProvisionalDiagnosis() {
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [selectedFindings, setSelectedFindings] = useState<string[]>([]);
    const [selectedVitals, setSelectedVitals] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleItem = (value: string, list: string[], setter: (v: string[]) => void) => {
        setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
    };

    const analyzeDiagnosis = () => {
        if (selectedSymptoms.length === 0 && selectedFindings.length === 0) return;

        setLoading(true);

        const input: DiagnosticInput = {
            symptoms: selectedSymptoms,
            clinicalFindings: selectedFindings,
            vitalSigns: selectedVitals.length > 0 ? selectedVitals : undefined
        };

        const results = provisionalDiagnosisEngine(input);
        setSuggestions(results);
        setLoading(false);
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return 'bg-green-500';
        if (confidence >= 0.6) return 'bg-yellow-500';
        return 'bg-orange-500';
    };

    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold">AI Provisional Diagnosis Engine</h3>
                <Badge variant="outline" className="ml-auto">Smart Analysis</Badge>
            </div>

            <div className="space-y-4">
                {/* Symptoms */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium">Chief Complaints (Symptoms)</p>
                        <Badge variant="secondary" className="ml-auto text-xs">{selectedSymptoms.length}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {symptomOptions.map(symptom => (
                            <Button
                                key={symptom.value}
                                variant={selectedSymptoms.includes(symptom.value) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleItem(symptom.value, selectedSymptoms, setSelectedSymptoms)}
                            >
                                {symptom.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Clinical Findings */}
                <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium">Clinical Findings / Tests</p>
                        <Badge variant="secondary" className="ml-auto text-xs">{selectedFindings.length}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {clinicalFindingOptions.map(finding => (
                            <Button
                                key={finding.value}
                                variant={selectedFindings.includes(finding.value) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleItem(finding.value, selectedFindings, setSelectedFindings)}
                            >
                                {finding.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Vital Signs */}
                <div className="space-y-2 border-t pt-4">
                    <p className="text-sm font-medium">Vital Signs (Optional)</p>
                    <div className="flex flex-wrap gap-2">
                        {vitalSignOptions.map(vital => (
                            <Button
                                key={vital.value}
                                variant={selectedVitals.includes(vital.value) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleItem(vital.value, selectedVitals, setSelectedVitals)}
                            >
                                {vital.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <Button
                    onClick={analyzeDiagnosis}
                    disabled={(selectedSymptoms.length === 0 && selectedFindings.length === 0) || loading}
                    className="w-full"
                >
                    {loading ? 'Analyzing...' : 'Analyze & Suggest Diagnosis'}
                </Button>
            </div>

            {suggestions.length > 0 && (
                <div className="space-y-2 mt-4 border-t pt-4">
                    <p className="text-sm font-medium">Provisional Diagnoses (Ranked by Confidence)</p>
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                                    <div>
                                        <div className="font-medium">{suggestion.diagnosis}</div>
                                        <div className="text-xs text-muted-foreground">
                                            ICD-10: {suggestion.icd_code} • {suggestion.category}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Matched: {suggestion.matchedSymptoms} symptoms, {suggestion.matchedFindings} findings
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Badge className={getConfidenceColor(suggestion.confidence) + ' text-white'}>
                                {Math.round(suggestion.confidence * 100)}%
                            </Badge>
                        </div>
                    ))}
                </div>
            )}

            {suggestions.length > 0 && (
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 p-3 rounded-lg text-xs">
                    <p className="font-medium text-purple-900 dark:text-purple-200">⚠️ Clinical Note</p>
                    <p className="text-purple-700 dark:text-purple-300 mt-1">
                        These are AI-generated provisional diagnoses. Always confirm with clinical examination, patient history, and radiographic findings before finalizing treatment.
                    </p>
                </div>
            )}
        </Card>
    );
}
