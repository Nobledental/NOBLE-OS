'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import CephalometricTracer from './cephalometric-tracer';
import ProfileAnalyzer from './profile-analyzer';
import ALDCalculator from './ald-calculator';
import ApplianceTracker from './appliance-tracker';
import {
    CephalometricAngles,
    ProfileAnalysis,
    ALDCalculation,
    ApplianceMilestone,
    OrthodonticMetadata
} from '@/types/orthodontic.types';

interface OrthodonticHubProps {
    patientId: string;
    initialData?: Partial<OrthodonticMetadata>;
    onSave?: (metadata: OrthodonticMetadata) => void;
}

export default function OrthodonticHub({ patientId, initialData, onSave }: OrthodonticHubProps) {
    const [activeTab, setActiveTab] = useState('cephalometric');
    const [angles, setAngles] = useState<CephalometricAngles | undefined>(initialData?.angles);
    const [profileAnalysis, setProfileAnalysis] = useState<ProfileAnalysis | undefined>(initialData?.profileAnalysis);
    const [aldCalculation, setALDCalculation] = useState<ALDCalculation | undefined>(initialData?.aldCalculation);
    const [milestones, setMilestones] = useState<ApplianceMilestone[]>(initialData?.milestones || []);
    const [landmarks, setLandmarks] = useState(initialData?.cephalometricLandmarks || []);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        const metadata: OrthodonticMetadata = {
            cephalometricLandmarks: landmarks,
            angles,
            profileAnalysis,
            aldCalculation,
            milestones,
            bondingDate: milestones.find(m => m.type === 'BONDING')?.date,
            estimatedDebondingDate: milestones.find(m => m.type === 'DEBONDING')?.date
        };

        setSaving(true);

        try {
            const response = await fetch('/api/clinical/orthodontic/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    metadata
                })
            });

            if (!response.ok) throw new Error('Failed to save orthodontic data');

            toast.success('Orthodontic case analysis saved successfully');
            onSave?.(metadata);
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save orthodontic data');
        } finally {
            setSaving(false);
        }
    };

    const generateCasePresentation = () => {
        // TODO: Implement PDF generation with all measurements
        toast.info('Case presentation PDF (implementation pending)');
    };

    const getCompletionBadges = () => {
        const badges = [];

        if (angles) badges.push('Ceph Analysis');
        if (profileAnalysis) badges.push('Profile');
        if (aldCalculation) badges.push('ALD');
        if (milestones.length > 0) badges.push('Milestones');

        return badges;
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <Card className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-5 h-5 text-purple-500" />
                            <h2 className="text-xl font-semibold">Orthodontic Case Study Hub</h2>
                        </div>
                        <div className="flex gap-2">
                            {getCompletionBadges().map(badge => (
                                <Badge key={badge} variant="outline" className="text-xs">
                                    ✓ {badge}
                                </Badge>
                            ))}
                            {getCompletionBadges().length === 0 && (
                                <span className="text-sm text-muted-foreground">No analyses completed yet</span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={generateCasePresentation} variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export Presentation
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : 'Save All'}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Diagnostic Summary (if all analyses complete) */}
            {angles && profileAnalysis && aldCalculation && (
                <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-900">
                    <h3 className="font-semibold mb-3">Diagnostic Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground block">Skeletal Class</span>
                            <Badge className="mt-1">{angles.skeletalClass}</Badge>
                        </div>
                        <div>
                            <span className="text-muted-foreground block">Vertical Pattern</span>
                            <Badge variant="outline" className="mt-1">{angles.verticalPattern}</Badge>
                        </div>
                        <div>
                            <span className="text-muted-foreground block">Profile Type</span>
                            <Badge variant="secondary" className="mt-1">{profileAnalysis.profileType}</Badge>
                        </div>
                        <div>
                            <span className="text-muted-foreground block">Treatment Plan</span>
                            <Badge variant="destructive" className="mt-1">{aldCalculation.recommendation}</Badge>
                        </div>
                    </div>
                </Card>
            )}

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="cephalometric">
                        <div className="text-center">
                            <div className="font-medium">Cephalometric</div>
                            <div className="text-xs text-muted-foreground">Hard Tissue</div>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="profile">
                        <div className="text-center">
                            <div className="font-medium">Profile</div>
                            <div className="text-xs text-muted-foreground">Soft Tissue</div>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="ald">
                        <div className="text-center">
                            <div className="font-medium">ALD</div>
                            <div className="text-xs text-muted-foreground">Space Analysis</div>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="progress">
                        <div className="text-center">
                            <div className="font-medium">Progress</div>
                            <div className="text-xs text-muted-foreground">Milestones</div>
                        </div>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="cephalometric" className="mt-4">
                    <CephalometricTracer
                        onAnglesCalculated={setAngles}
                        onLandmarksChange={setLandmarks}
                    />
                </TabsContent>

                <TabsContent value="profile" className="mt-4">
                    <ProfileAnalyzer onAnalysisComplete={setProfileAnalysis} />
                </TabsContent>

                <TabsContent value="ald" className="mt-4">
                    <ALDCalculator onCalculationComplete={setALDCalculation} />
                </TabsContent>

                <TabsContent value="progress" className="mt-4">
                    <ApplianceTracker
                        initialMilestones={milestones}
                        onMilestonesChange={setMilestones}
                    />
                </TabsContent>
            </Tabs>

            {/* Professional Notice */}
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 p-4 rounded-lg text-sm">
                <p className="font-medium text-purple-900 dark:text-purple-200">🏥 Premium Orthodontic Diagnostics</p>
                <p className="text-purple-700 dark:text-purple-300 mt-1">
                    This comprehensive analysis (Ceph + Profile + ALD) positions your clinic as a premium orthodontic provider.
                    Use "Export Presentation" to generate patient-ready reports that increase case acceptance.
                </p>
            </div>
        </div>
    );
}
