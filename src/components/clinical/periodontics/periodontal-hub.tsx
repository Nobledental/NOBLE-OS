'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Save, FileDown, AlertCircle } from 'lucide-react';

import SixPointChart from './six-point-chart';
import GumSurgeryModule from './gum-surgery-module';
import AAPStagingPanel from './aap-staging-panel';

import {
    ToothProbingData,
    SurgeryRecord,
    PerioMetadata,
    PeriodontalAlert,
    calculateChartSummary,
    calculateAAPStage,
    TOOTH_ORDER_UPPER,
    TOOTH_ORDER_LOWER,
    createEmptyToothData
} from '@/types/periodontal.types';

interface PeriodontalHubProps {
    patientId: string;
    initialData?: PerioMetadata;
    hasDiabetes?: boolean;
    isSmoker?: boolean;
}

export default function PeriodontalHub({
    patientId,
    initialData,
    hasDiabetes = false,
    isSmoker = false
}: PeriodontalHubProps) {
    // Initialize teeth state
    const initializeTeeth = (): ToothProbingData[] => {
        if (initialData?.charts?.[0]?.teeth) {
            return initialData.charts[0].teeth;
        }
        const allTeeth = [...TOOTH_ORDER_UPPER, ...TOOTH_ORDER_LOWER];
        return allTeeth.map(num => createEmptyToothData(num));
    };

    const [teeth, setTeeth] = useState<ToothProbingData[]>(initializeTeeth);
    const [surgeries, setSurgeries] = useState<SurgeryRecord[]>(initialData?.surgeries || []);
    const [alerts, setAlerts] = useState<PeriodontalAlert[]>(initialData?.alerts || []);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('chart');

    // Calculate summary for badges
    const summary = calculateChartSummary(teeth);
    const hasData = summary.totalSites > 0;

    // Save all periodontal data
    const handleSave = async () => {
        setIsSaving(true);

        const metadata: PerioMetadata = {
            charts: [{
                chartDate: new Date().toISOString(),
                examiner: 'Doctor', // TODO: Get from auth context
                teeth,
                ...summary,
                aapStage: calculateAAPStage(0), // TODO: Calculate from actual CAL
                isActive: summary.bopPercentage > 10
            }],
            surgeries,
            alerts
        };

        try {
            const response = await fetch('/api/clinical/periodontal/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    metadata
                })
            });

            if (!response.ok) throw new Error('Failed to save');

            toast.success('Periodontal data saved successfully');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save periodontal data');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <Card className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Periodontal Assessment Suite</h2>
                        <p className="text-sm text-muted-foreground">
                            6-Point Chart, AAP Staging, Surgery Tracker
                        </p>
                    </div>

                    {/* Summary Badges */}
                    <div className="flex items-center gap-3">
                        {hasData && (
                            <>
                                <Badge variant="outline" className="px-3 py-1">
                                    {summary.totalSites} Sites
                                </Badge>
                                {summary.sitesWithPD5plus > 0 && (
                                    <Badge variant="destructive" className="px-3 py-1">
                                        {summary.sitesWithPD5plus} Deep Pockets
                                    </Badge>
                                )}
                                {summary.bopPercentage > 10 && (
                                    <Badge className="bg-orange-500 px-3 py-1">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Active Disease
                                    </Badge>
                                )}
                            </>
                        )}

                        <Button onClick={handleSave} disabled={isSaving}>
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Saving...' : 'Save All'}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Tabbed Interface */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                    <TabsTrigger value="chart" className="flex items-center gap-1">
                        📊 6-Point Chart
                        {summary.sitesWithPD5plus > 0 && (
                            <span className="ml-1 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="staging">
                        🏥 AAP Staging
                    </TabsTrigger>
                    <TabsTrigger value="surgery" className="flex items-center gap-1">
                        ✂️ Surgery
                        {surgeries.length > 0 && (
                            <Badge variant="secondary" className="ml-1 text-xs">{surgeries.length}</Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="alerts" className="flex items-center gap-1">
                        ⚠️ Alerts
                        {alerts.length > 0 && (
                            <Badge variant="destructive" className="ml-1 text-xs">{alerts.length}</Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="chart" className="mt-4">
                    <SixPointChart
                        patientId={patientId}
                        initialData={teeth}
                        onChartChange={setTeeth}
                        onAlertsGenerated={setAlerts}
                    />
                </TabsContent>

                <TabsContent value="staging" className="mt-4">
                    <AAPStagingPanel
                        teeth={teeth}
                        hasDiabetes={hasDiabetes}
                        isSmoker={isSmoker}
                    />
                </TabsContent>

                <TabsContent value="surgery" className="mt-4">
                    <GumSurgeryModule
                        patientId={patientId}
                        initialSurgeries={surgeries}
                        onSurgeriesChange={setSurgeries}
                    />
                </TabsContent>

                <TabsContent value="alerts" className="mt-4">
                    <Card className="p-4">
                        <h3 className="text-lg font-semibold mb-4">Periodontal Alert System</h3>

                        {alerts.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No alerts detected</p>
                                <p className="text-sm">Complete the 6-point chart to generate clinical alerts</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {alerts.map((alert, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-3 rounded-lg border ${alert.severity === 'critical'
                                                ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                                                : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={alert.severity === 'critical' ? 'destructive' : 'default'}>
                                                        {alert.type.replace('_', ' ')}
                                                    </Badge>
                                                    {alert.toothNumber && (
                                                        <span className="text-sm font-medium">Tooth #{alert.toothNumber}</span>
                                                    )}
                                                </div>
                                                <p className="text-sm mt-1">{alert.message}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    → {alert.suggestedAction}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Alert Summary Table */}
                        {alerts.length > 0 && (
                            <div className="mt-6 pt-4 border-t">
                                <h4 className="font-medium mb-3">Alert Triggers Reference</h4>
                                <div className="text-xs space-y-1">
                                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                                        <span>PD ≥ 5mm</span>
                                        <span className="text-red-600">→ Suggest Deep Scaling / Flap Surgery</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                                        <span>BOP +</span>
                                        <span className="text-red-600">→ Record as Active Site</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                                        <span>Mobility Grade III</span>
                                        <span className="text-red-600">→ Suggest Extraction or Splinting</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                                        <span>BOP &gt; 10%</span>
                                        <span className="text-orange-600">→ Flag as Active Disease on Dashboard</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
