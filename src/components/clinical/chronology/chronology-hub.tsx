'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Calendar, Sparkles, Cigarette, Activity, Scissors } from 'lucide-react';
import { toast } from 'sonner';

import OHISPanel from './ohis-panel';
import SmokingIndexPanel from './smoking-index-panel';
import EruptionPredictor from './eruption-predictor';
import HealthTimeline from './health-timeline';
import CairoRecessionPanel from './cairo-recession-panel';
import {
    Gender,
    OHISResult,
    SmokingIndexResult,
    LifelongTimeline,
    TimelineEvent
} from '@/types/chronology.types';

interface ChronologyHubProps {
    patientId: string;
    dateOfBirth: string;
    gender: Gender;
    existingTimeline?: LifelongTimeline;
}

export default function ChronologyHub({
    patientId,
    dateOfBirth,
    gender,
    existingTimeline
}: ChronologyHubProps) {
    const [activeTab, setActiveTab] = useState('eruption');
    const [isSaving, setIsSaving] = useState(false);

    // Collected data
    const [ohisResult, setOhisResult] = useState<OHISResult | null>(null);
    const [smokingResult, setSmokingResult] = useState<SmokingIndexResult | null>(null);

    // Mock timeline for demo (replace with API data)
    const [timeline] = useState<LifelongTimeline>(existingTimeline || {
        patientId,
        dateOfBirth,
        gender,
        events: [
            {
                id: 'evt-1',
                patientId,
                eventDate: '2020-03-15',
                eventType: 'checkup',
                ageAtEvent: 20,
                snapshot: {
                    date: '2020-03-15',
                    ageInMonths: 240,
                    dmft: { d: 2, m: 0, f: 1, total: 3 },
                    ohis: { debrisScores: {}, calculusScores: {}, debrisIndex: 0.5, calculusIndex: 0.3, ohisTotal: 0.8, interpretation: 'Good', recommendation: '' },
                    notes: 'Initial visit - good oral hygiene'
                },
                fdiChartState: {},
                provider: 'Dr. Noble'
            },
            {
                id: 'evt-2',
                patientId,
                eventDate: '2023-06-20',
                eventType: 'treatment',
                ageAtEvent: 23,
                snapshot: {
                    date: '2023-06-20',
                    ageInMonths: 276,
                    dmft: { d: 1, m: 0, f: 3, total: 4 },
                    ohis: { debrisScores: {}, calculusScores: {}, debrisIndex: 1.2, calculusIndex: 0.8, ohisTotal: 2.0, interpretation: 'Fair', recommendation: '' },
                    smokingIndex: { cigarettesPerDay: 10, yearsOfSmoking: 5, smokingIndex: 50, riskLevel: 'Moderate', perioRisk: '', oralCancerRisk: '' },
                    notes: 'Scaling done, smoking counseling'
                },
                fdiChartState: {},
                provider: 'Dr. Noble'
            },
            {
                id: 'evt-3',
                patientId,
                eventDate: '2026-01-15',
                eventType: 'checkup',
                ageAtEvent: 26,
                snapshot: {
                    date: '2026-01-15',
                    ageInMonths: 312,
                    dmft: { d: 0, m: 0, f: 4, total: 4 },
                    ohis: { debrisScores: {}, calculusScores: {}, debrisIndex: 0.8, calculusIndex: 0.5, ohisTotal: 1.3, interpretation: 'Fair', recommendation: '' },
                    notes: 'Improved hygiene, reduced smoking'
                },
                fdiChartState: {},
                provider: 'Dr. Noble'
            }
        ],
        trendData: { dates: [], dmft: [], ohis: [] }
    });

    const handleSaveSnapshot = async () => {
        setIsSaving(true);

        const snapshot = {
            patientId,
            timestamp: new Date().toISOString(),
            ohis: ohisResult,
            smokingIndex: smokingResult
        };

        try {
            const response = await fetch('/api/clinical/chronology/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(snapshot)
            });

            if (!response.ok) throw new Error('Save failed');
            toast.success('Chronology snapshot saved');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save snapshot');
        } finally {
            setIsSaving(false);
        }
    };

    // Calculate current age
    const currentAge = Math.floor(
        (new Date().getTime() - new Date(dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );

    return (
        <div className="space-y-4">
            {/* Header */}
            <Card className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Calendar className="w-6 h-6" />
                            Chronology & Hygiene Engine
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            FDI Eruption • Life-Long Timeline • OHI-S • Smoking Index • Cairo Classification
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-lg px-3">
                            {gender === 'male' ? '♂' : '♀'} {currentAge} years
                        </Badge>
                        <Button onClick={handleSaveSnapshot} disabled={isSaving}>
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Saving...' : 'Save Snapshot'}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Collected Results Summary */}
            {(ohisResult || smokingResult) && (
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <h3 className="font-semibold mb-2">Current Visit Snapshot</h3>
                    <div className="flex gap-4">
                        {ohisResult && (
                            <Badge variant={
                                ohisResult.interpretation === 'Good' ? 'default' :
                                    ohisResult.interpretation === 'Fair' ? 'secondary' : 'destructive'
                            }>
                                OHI-S: {ohisResult.ohisTotal} ({ohisResult.interpretation})
                            </Badge>
                        )}
                        {smokingResult && (
                            <Badge variant={
                                smokingResult.riskLevel === 'Low' ? 'default' :
                                    smokingResult.riskLevel === 'Moderate' ? 'secondary' : 'destructive'
                            }>
                                SI: {smokingResult.smokingIndex} ({smokingResult.riskLevel})
                            </Badge>
                        )}
                    </div>
                </Card>
            )}

            {/* Tabbed Modules */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="eruption" className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Eruption
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        Timeline
                    </TabsTrigger>
                    <TabsTrigger value="ohis" className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        OHI-S
                        {ohisResult && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                    </TabsTrigger>
                    <TabsTrigger value="smoking" className="flex items-center gap-1">
                        <Cigarette className="w-4 h-4" />
                        Smoking
                        {smokingResult && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                    </TabsTrigger>
                    <TabsTrigger value="cairo" className="flex items-center gap-1">
                        <Scissors className="w-4 h-4" />
                        Cairo
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="eruption" className="mt-4">
                    <EruptionPredictor
                        dateOfBirth={dateOfBirth}
                        gender={gender}
                    />
                </TabsContent>

                <TabsContent value="timeline" className="mt-4">
                    <HealthTimeline timeline={timeline} />
                </TabsContent>

                <TabsContent value="ohis" className="mt-4">
                    <OHISPanel onComplete={setOhisResult} />
                </TabsContent>

                <TabsContent value="smoking" className="mt-4">
                    <SmokingIndexPanel onComplete={setSmokingResult} />
                </TabsContent>

                <TabsContent value="cairo" className="mt-4">
                    <CairoRecessionPanel />
                </TabsContent>
            </Tabs>
        </div>
    );
}
