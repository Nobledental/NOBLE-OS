'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Brain, Sparkles, Activity, Flag, Smile } from 'lucide-react';
import { toast } from 'sonner';

import PSRQuickScan from './psr-quick-scan';
import SmileStudio from './smile-studio';
import IndiaSpecificModules from './india-specific-modules';
import ClassificationMapper from './classification-mapper';
import { ToothSurface, PSRResult, SmileAnalysis, OSMFResult, SalivaryFlowResult } from '@/types/clinical-indices.types';

interface ClassificationHubProps {
    patientId: string;
    selectedTooth?: number;
    toothStatus?: 'healthy' | 'decayed' | 'missing' | 'filled' | 'fractured';
    affectedSurfaces?: ToothSurface[];
    allMissingTeeth?: number[];
    allDecayedTeeth?: number[];
    allFilledTeeth?: number[];
}

export default function ClassificationHub({
    patientId,
    selectedTooth = 11,
    toothStatus = 'healthy',
    affectedSurfaces = [],
    allMissingTeeth = [],
    allDecayedTeeth = [],
    allFilledTeeth = []
}: ClassificationHubProps) {
    const [activeTab, setActiveTab] = useState('mapper');
    const [isSaving, setIsSaving] = useState(false);

    // Collected results
    const [psrResult, setPsrResult] = useState<PSRResult | null>(null);
    const [smileAnalysis, setSmileAnalysis] = useState<SmileAnalysis | null>(null);
    const [osmfResult, setOsmfResult] = useState<OSMFResult | null>(null);
    const [salivaryResult, setSalivaryResult] = useState<SalivaryFlowResult | null>(null);
    const [acceptedDiagnoses, setAcceptedDiagnoses] = useState<string[]>([]);

    const handleSaveAll = async () => {
        setIsSaving(true);

        const metadata = {
            patientId,
            timestamp: new Date().toISOString(),
            classifications: {
                acceptedDiagnoses,
                psr: psrResult,
                smile: smileAnalysis,
                osmf: osmfResult,
                salivary: salivaryResult
            }
        };

        try {
            const response = await fetch('/api/clinical/indexing/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(metadata)
            });

            if (!response.ok) throw new Error('Save failed');
            toast.success('Clinical indices saved to case sheet');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save indices');
        } finally {
            setIsSaving(false);
        }
    };

    const completedIndices = [
        psrResult && 'PSR',
        smileAnalysis && 'Smile',
        osmfResult && 'OSMF',
        salivaryResult && 'Salivary',
        acceptedDiagnoses.length > 0 && 'Classifications'
    ].filter(Boolean);

    return (
        <div className="space-y-4">
            {/* Header */}
            <Card className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Brain className="w-6 h-6" />
                            Clinical Indexing Engine
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Auto-classification • Accept or Override • Provisional Diagnosis
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {completedIndices.length > 0 && (
                            <div className="flex gap-1">
                                {completedIndices.map((idx, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                        {idx}
                                    </Badge>
                                ))}
                            </div>
                        )}
                        <Button onClick={handleSaveAll} disabled={isSaving}>
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Saving...' : 'Save to Case Sheet'}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Intelligence Matrix Reference */}
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Intelligence Matrix (Auto-Mapping)
                </h3>
                <div className="grid grid-cols-3 gap-px bg-border rounded-lg overflow-hidden text-xs">
                    <div className="bg-muted p-2 font-medium">Input Finding</div>
                    <div className="bg-muted p-2 font-medium">Auto-Classification</div>
                    <div className="bg-muted p-2 font-medium">Suggested Action</div>

                    <div className="bg-background p-2">Occlusal Decay (Molar)</div>
                    <div className="bg-background p-2"><Badge variant="outline">G.V. Black Class I</Badge></div>
                    <div className="bg-background p-2 text-blue-600">Composite/Amalgam</div>

                    <div className="bg-background p-2">Bilateral Posterior Missing</div>
                    <div className="bg-background p-2"><Badge variant="outline">Kennedy Class I</Badge></div>
                    <div className="bg-background p-2 text-blue-600">RPD or Implants</div>

                    <div className="bg-background p-2">Enamel + Dentin Fracture</div>
                    <div className="bg-background p-2"><Badge variant="outline">Ellis Class II</Badge></div>
                    <div className="bg-background p-2 text-blue-600">Composite Build-up</div>

                    <div className="bg-background p-2">Deep Pocket ({">"}5.5mm)</div>
                    <div className="bg-background p-2"><Badge variant="outline">PSR Code 4</Badge></div>
                    <div className="bg-background p-2 text-blue-600">Complex Perio Therapy</div>
                </div>
            </Card>

            {/* Tabbed Modules */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="mapper" className="flex items-center gap-1">
                        <Brain className="w-4 h-4" />
                        Auto-Mapper
                    </TabsTrigger>
                    <TabsTrigger value="psr" className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        PSR/CPITN
                        {psrResult && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                    </TabsTrigger>
                    <TabsTrigger value="smile" className="flex items-center gap-1">
                        <Smile className="w-4 h-4" />
                        Smile Studio
                        {smileAnalysis && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                    </TabsTrigger>
                    <TabsTrigger value="india" className="flex items-center gap-1">
                        <Flag className="w-4 h-4" />
                        India-Specific
                    </TabsTrigger>
                    <TabsTrigger value="hygiene">
                        Hygiene Index
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="mapper" className="mt-4">
                    <ClassificationMapper
                        toothNumber={selectedTooth}
                        toothStatus={toothStatus}
                        affectedSurfaces={affectedSurfaces}
                        allMissingTeeth={allMissingTeeth}
                        allDecayedTeeth={allDecayedTeeth}
                        allFilledTeeth={allFilledTeeth}
                        onDiagnosisAccept={(diagnosis) => {
                            setAcceptedDiagnoses(prev => [...prev, diagnosis.classification]);
                        }}
                    />
                </TabsContent>

                <TabsContent value="psr" className="mt-4">
                    <PSRQuickScan onComplete={setPsrResult} />
                </TabsContent>

                <TabsContent value="smile" className="mt-4">
                    <SmileStudio onAnalysisComplete={setSmileAnalysis} />
                </TabsContent>

                <TabsContent value="india" className="mt-4">
                    <IndiaSpecificModules
                        onOSMFComplete={setOsmfResult}
                        onSalivaryComplete={setSalivaryResult}
                    />
                </TabsContent>

                <TabsContent value="hygiene" className="mt-4">
                    <Card className="p-6 text-center text-muted-foreground">
                        <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <h3 className="font-medium mb-1">Plaque & Gingival Index</h3>
                        <p className="text-sm">
                            Löe & Silness scoring integrated with periodontal charting module.
                            <br />
                            Full-mouth plaque score auto-calculated from 6-point chart.
                        </p>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Accepted Diagnoses Summary */}
            {acceptedDiagnoses.length > 0 && (
                <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <h3 className="font-semibold mb-2 text-green-800 dark:text-green-200">
                        ✓ Accepted Provisional Diagnoses
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {acceptedDiagnoses.map((diagnosis, idx) => (
                            <Badge key={idx} className="bg-green-600">
                                {diagnosis}
                            </Badge>
                        ))}
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                        These will be added to the case sheet as the Provisional Diagnosis.
                    </p>
                </Card>
            )}
        </div>
    );
}
