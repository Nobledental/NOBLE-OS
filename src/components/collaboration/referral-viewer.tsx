'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    FileImage, Clock, CheckCircle, User, Stethoscope, Download,
    Brain, ShieldCheck, FileText, Shield, AlertTriangle, Activity, Calendar
} from 'lucide-react';
import { ReferralView, ReferralXray } from '@/types/consultant.types';

interface ReferralViewerProps {
    token: string;
}

// This would be fetched from API based on token
const mockReferralData: ReferralView = {
    patientName: 'Rahul Kumar',
    patientAge: 32,
    mainComplaint: 'Impacted wisdom tooth with recurrent pericoronitis',
    timeline: [
        { date: '2025-12-15', type: 'visit', summary: 'Initial consultation - pain in lower right jaw' },
        { date: '2026-01-05', type: 'treatment', summary: 'Antibiotic course prescribed (Amoxicillin 500mg)' },
        { date: '2026-01-20', type: 'note', summary: 'Pericoronitis recurrence - surgical referral recommended' }
    ],
    xrays: [
        { id: 'xr1', type: 'OPG', signedUrl: '/placeholder-opg.jpg', capturedDate: '2026-01-05', notes: 'Shows mesioangular impaction of 48' },
        { id: 'xr2', type: 'IOPA', signedUrl: '/placeholder-iopa.jpg', capturedDate: '2026-01-20', notes: 'Periapical region clear' }
    ],
    smartAnalysis: {
        'Oral Surgery': { warScore: 8, difficulty: 'Complex', recommendation: 'Surgical extraction under LA' },
        'Periodontics': { status: 'Localized inflammation', bopSites: 2 },
        'General': { dmft: 4, hygiene: 'Fair' }
    },
    riskScores: {
        'WAR Score': 8,
        'Bleeding Risk': 2,
        'Nerve Proximity': 7
    },
    provisionalDiagnosis: 'Mesioangular impaction of 48 with recurrent pericoronitis. Recommend surgical extraction.',
    referringDoctor: 'Dr. Noble',
    createdAt: '2026-01-25T10:30:00Z'
};

export default function ReferralViewer({ token }: ReferralViewerProps) {
    const [data, setData] = useState<ReferralView | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedXray, setSelectedXray] = useState<ReferralXray | null>(null);

    useEffect(() => {
        // In production, fetch from API with token validation
        const fetchReferral = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Validate token (mock)
                if (token.length < 10) {
                    throw new Error('Invalid or expired referral link');
                }

                setData(mockReferralData);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchReferral();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
                <Card className="p-8 text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-pulse" />
                    <h2 className="text-lg font-semibold">Validating Secure Link...</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Decrypting patient data
                    </p>
                </Card>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
                <Card className="p-8 text-center max-w-md">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
                        Link Invalid or Expired
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        {error || 'This referral link is no longer valid. Please contact the referring clinic for a new link.'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-4">
                        Referral links expire after 7 days for patient privacy.
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Stethoscope className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Professional Referral Summary</h1>
                                <p className="text-sm text-muted-foreground">
                                    From {data.referringDoctor} • Noble Dental Care
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Read-Only
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Secure Link
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => window.print()}>
                                <Download className="w-3 h-3 mr-1" />
                                PDF
                            </Button>
                        </div>
                    </div>

                    {/* Patient Info */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div>
                            <div className="text-sm text-muted-foreground">Patient</div>
                            <div className="font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {data.patientName}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Age</div>
                            <div className="font-semibold">{data.patientAge} years</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Chief Complaint</div>
                            <div className="font-semibold">{data.mainComplaint}</div>
                        </div>
                    </div>
                </Card>

                {/* Provisional Diagnosis */}
                <Card className="p-6 border-l-4 border-l-blue-500">
                    <h2 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                        Provisional Diagnosis
                    </h2>
                    <p className="text-lg">{data.provisionalDiagnosis}</p>
                </Card>

                {/* NEO Clinical Insights */}
                <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border border-indigo-200 dark:border-indigo-900">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold flex items-center gap-2">
                            <Brain className="w-5 h-5 text-indigo-500" />
                            NEO Clinical Insights
                        </h2>
                        <Badge className="bg-indigo-500 text-white">AI Verified</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-indigo-100 flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5" />
                                <div>
                                    <div className="text-sm font-medium">Record Completeness</div>
                                    <p className="text-xs text-muted-foreground">Clinical notes meet hospital grade standards (85% data density).</p>
                                </div>
                            </div>
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-indigo-100 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                                <div>
                                    <div className="text-sm font-medium">Red Flag Detection</div>
                                    <p className="text-xs text-muted-foreground">Proximity to Inferior Alveolar Nerve detected in OPG analysis.</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-indigo-100 flex items-start gap-3">
                                <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div>
                                    <div className="text-sm font-medium">Suggested Protocol</div>
                                    <p className="text-xs text-muted-foreground">Follow "Complex Extraction - High Risk" surgical protocol.</p>
                                </div>
                            </div>
                            <div className="p-3 bg-indigo-500 text-white rounded-lg flex items-center justify-center text-center p-4">
                                <div>
                                    <div className="text-xs uppercase font-bold opacity-80">NEO Confidence</div>
                                    <div className="text-3xl font-bold">92%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Risk Scores */}
                <Card className="p-6">
                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Risk Assessment Scores
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        {Object.entries(data.riskScores).map(([name, score]) => (
                            <div
                                key={name}
                                className={`p-4 rounded-lg text-center ${score >= 7 ? 'bg-red-50 dark:bg-red-950/20 border border-red-200' :
                                    score >= 4 ? 'bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200' :
                                        'bg-green-50 dark:bg-green-950/20 border border-green-200'
                                    }`}
                            >
                                <div className="text-3xl font-bold">{score}</div>
                                <div className="text-sm text-muted-foreground">{name}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* 8-Department Smart Analysis */}
                <Card className="p-6">
                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-500" />
                        8-Department Smart Analysis
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(data.smartAnalysis).map(([dept, analysis]) => (
                            <div key={dept} className="p-4 bg-muted/50 rounded-lg">
                                <h3 className="font-medium mb-2">{dept}</h3>
                                <div className="text-sm space-y-1">
                                    {Object.entries(analysis as Record<string, any>).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="text-muted-foreground">{key}:</span>
                                            <span className="font-medium">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Timeline */}
                <Card className="p-6">
                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-500" />
                        Clinical Timeline
                    </h2>
                    <div className="space-y-4">
                        {data.timeline.map((entry, idx) => (
                            <div key={idx} className="flex gap-4 items-start">
                                <div className="w-24 text-sm text-muted-foreground">
                                    {new Date(entry.date).toLocaleDateString()}
                                </div>
                                <div className="flex-1">
                                    <Badge variant={
                                        entry.type === 'treatment' ? 'default' :
                                            entry.type === 'visit' ? 'secondary' : 'outline'
                                    } className="mb-1">
                                        {entry.type}
                                    </Badge>
                                    <p>{entry.summary}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* X-rays */}
                <Card className="p-6">
                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                        <FileImage className="w-5 h-5 text-cyan-500" />
                        Radiographs
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {data.xrays.map((xray) => (
                            <div
                                key={xray.id}
                                className="p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                                onClick={() => setSelectedXray(xray)}
                            >
                                <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded mb-2 flex items-center justify-center">
                                    <FileImage className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <Badge variant="outline">{xray.type}</Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(xray.capturedDate).toLocaleDateString()}
                                    </span>
                                </div>
                                {xray.notes && (
                                    <p className="text-sm text-muted-foreground mt-2">{xray.notes}</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                        X-ray images are served via signed URLs and expire for security.
                    </p>
                </Card>

                {/* Footer */}
                <div className="text-center text-sm text-muted-foreground py-4">
                    <p>This referral was generated by Noble Dental Care OS</p>
                    <p>Generated on {new Date(data.createdAt).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
