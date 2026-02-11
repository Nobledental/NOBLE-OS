'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Shield, AlertTriangle, Ban, RefreshCw, Search,
    Eye, Flag, CheckCircle, XCircle, TrendingDown
} from 'lucide-react';
import {
    ClinicRankProfile,
    ExploitFlag
} from '@/lib/rank-calculator';

interface AuditorDashboardProps {
    clinics?: ClinicRankProfile[];
    onFlagClinic?: (clinicId: string, flag: ExploitFlag) => void;
    onResolveFlag?: (clinicId: string, flagId: string) => void;
    onManualAdjustment?: (clinicId: string, points: number, reason: string) => void;
}

// Mock data
const mockClinics: ClinicRankProfile[] = [
    {
        clinicId: 'clinic-1',
        clinicName: 'Sunrise Dental Care',
        dciNumber: 'DCI-12345',
        trustScore: 780,
        breakdown: {
            clinicalDiligence: { score: 320, maxScore: 400, details: '80% note completeness' },
            patientSuccessRate: { score: 160, maxScore: 200, details: '85% positive outcomes' },
            reviewRating: { score: 180, maxScore: 200, details: '4.5/5 avg', isGated: false },
            peerAccuracy: { score: 120, maxScore: 200, details: '2 potential misses', silentDeductions: 80 }
        },
        tier: 'Gold',
        lastUpdated: '2026-01-30T10:00:00Z',
        isVerified: true,
        exploitFlags: []
    },
    {
        clinicId: 'clinic-2',
        clinicName: 'City Smile Studio',
        dciNumber: 'DCI-67890',
        trustScore: 420,
        breakdown: {
            clinicalDiligence: { score: 160, maxScore: 400, details: '40% note completeness' },
            patientSuccessRate: { score: 80, maxScore: 200, details: '60% positive outcomes' },
            reviewRating: { score: 200, maxScore: 200, details: '5.0/5 avg ⚠️', isGated: false },
            peerAccuracy: { score: 0, maxScore: 200, details: '4 missed diagnoses', silentDeductions: 200 }
        },
        tier: 'Bronze',
        lastUpdated: '2026-01-30T09:00:00Z',
        isVerified: true,
        exploitFlags: [
            {
                id: 'flag-1',
                type: 'bot_review',
                description: 'Suspicious 5-star review pattern detected',
                flaggedAt: '2026-01-29T15:00:00Z',
                flaggedBy: 'system',
                resolved: false
            }
        ]
    },
    {
        clinicId: 'clinic-3',
        clinicName: 'Dental Excellence',
        dciNumber: 'DCI-11111',
        trustScore: 890,
        breakdown: {
            clinicalDiligence: { score: 380, maxScore: 400, details: '95% note completeness' },
            patientSuccessRate: { score: 180, maxScore: 200, details: '92% positive outcomes' },
            reviewRating: { score: 170, maxScore: 200, details: '4.3/5 avg', isGated: false },
            peerAccuracy: { score: 160, maxScore: 200, details: '1 potential miss', silentDeductions: 40 }
        },
        tier: 'Platinum',
        lastUpdated: '2026-01-30T11:00:00Z',
        isVerified: true,
        exploitFlags: []
    }
];

export default function AuditorDashboard({
    clinics = mockClinics,
    onFlagClinic,
    onResolveFlag,
    onManualAdjustment
}: AuditorDashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClinic, setSelectedClinic] = useState<ClinicRankProfile | null>(null);
    const [adjustmentPoints, setAdjustmentPoints] = useState('');
    const [adjustmentReason, setAdjustmentReason] = useState('');
    const [flagType, setFlagType] = useState<ExploitFlag['type']>('bot_review');
    const [flagDescription, setFlagDescription] = useState('');

    const filteredClinics = clinics.filter(c =>
        c.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.dciNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFlag = () => {
        if (!selectedClinic || !flagDescription) return;
        const flag: ExploitFlag = {
            id: `flag-${Date.now()}`,
            type: flagType,
            description: flagDescription,
            flaggedAt: new Date().toISOString(),
            flaggedBy: 'admin',
            resolved: false
        };
        onFlagClinic?.(selectedClinic.clinicId, flag);
        setFlagDescription('');
    };

    const handleAdjustment = () => {
        if (!selectedClinic || !adjustmentPoints || !adjustmentReason) return;
        onManualAdjustment?.(selectedClinic.clinicId, parseInt(adjustmentPoints), adjustmentReason);
        setAdjustmentPoints('');
        setAdjustmentReason('');
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Platinum': return 'bg-purple-500';
            case 'Gold': return 'bg-yellow-500';
            case 'Silver': return 'bg-slate-400';
            case 'Bronze': return 'bg-orange-600';
            case 'Flagged': return 'bg-red-600';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="space-y-4 font-sans text-slate-900">
            {/* Header */}
            <Card className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8 text-red-600" />
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">HealthFlo Auditor</h2>
                            <p className="text-sm text-slate-500">
                                Trust Engine Administration & Exploit Control
                            </p>
                        </div>
                    </div>
                    <Badge variant="destructive" className="text-lg px-4 py-1">
                        ADMIN ACCESS
                    </Badge>
                </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="p-3 text-center bg-white border-slate-200">
                    <div className="text-2xl font-bold text-slate-900">{clinics.length}</div>
                    <div className="text-sm text-slate-500">Total Clinics</div>
                </Card>
                <Card className="p-3 text-center bg-red-50 border-red-100">
                    <div className="text-2xl font-bold text-red-600">
                        {clinics.filter(c => c.exploitFlags.length > 0).length}
                    </div>
                    <div className="text-sm text-red-600/80">Flagged</div>
                </Card>
                <Card className="p-3 text-center bg-purple-50 border-purple-100">
                    <div className="text-2xl font-bold text-purple-600">
                        {clinics.filter(c => c.tier === 'Platinum').length}
                    </div>
                    <div className="text-sm text-purple-600/80">Platinum Tier</div>
                </Card>
                <Card className="p-3 text-center bg-orange-50 border-orange-100">
                    <div className="text-2xl font-bold text-orange-600">
                        {clinics.filter(c => c.breakdown.peerAccuracy.silentDeductions > 100).length}
                    </div>
                    <div className="text-sm text-orange-600/80">Peer Issues</div>
                </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Clinic List */}
                <Card className="p-4 bg-white border-slate-200">
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search clinic or DCI..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-slate-50 border-slate-200"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredClinics.map(clinic => (
                            <div
                                key={clinic.clinicId}
                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedClinic?.clinicId === clinic.clinicId
                                    ? 'bg-blue-50 border-blue-300'
                                    : 'hover:bg-slate-50 border-slate-100'
                                    }`}
                                onClick={() => setSelectedClinic(clinic)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium flex items-center gap-2 text-slate-900">
                                            {clinic.clinicName}
                                            {clinic.exploitFlags.length > 0 && (
                                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {clinic.dciNumber}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-slate-900">{clinic.trustScore}</div>
                                        <Badge className={`${getTierColor(clinic.tier)} text-white text-xs`}>
                                            {clinic.tier}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Clinic Details & Actions */}
                <Card className="p-4 bg-white border-slate-200">
                    {selectedClinic ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg text-slate-900">{selectedClinic.clinicName}</h3>
                                <Badge className={`${getTierColor(selectedClinic.tier)} text-white`}>
                                    {selectedClinic.trustScore} pts
                                </Badge>
                            </div>

                            {/* Score Breakdown */}
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm text-slate-700">Score Breakdown</h4>
                                {Object.entries(selectedClinic.breakdown).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between text-sm">
                                        <span className="capitalize text-slate-600">{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <span className={`${value.score < value.maxScore * 0.5 ? 'text-red-500' : 'text-slate-900'}`}>
                                            {value.score}/{value.maxScore}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Active Flags */}
                            {selectedClinic.exploitFlags.length > 0 && (
                                <div className="p-3 bg-red-50 rounded border border-red-200">
                                    <h4 className="font-medium text-sm text-red-700 flex items-center gap-1 mb-2">
                                        <Flag className="w-4 h-4" /> Active Flags
                                    </h4>
                                    {selectedClinic.exploitFlags.map(flag => (
                                        <div key={flag.id} className="flex items-center justify-between text-sm mb-1 text-red-800">
                                            <span>{flag.type.replace('_', ' ')}: {flag.description}</span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-red-200 hover:bg-red-100 text-red-700"
                                                onClick={() => onResolveFlag?.(selectedClinic.clinicId, flag.id)}
                                            >
                                                <CheckCircle className="w-3 h-3 mr-1" /> Resolve
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Flag */}
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm flex items-center gap-1 text-slate-700">
                                    <Ban className="w-4 h-4" /> Add Exploit Flag
                                </h4>
                                <select
                                    className="w-full p-2 border border-slate-200 rounded bg-slate-50 text-slate-900"
                                    value={flagType}
                                    onChange={(e) => setFlagType(e.target.value as ExploitFlag['type'])}
                                >
                                    <option value="bot_review">Bot Reviews</option>
                                    <option value="fake_patient">Fake Patients</option>
                                    <option value="review_trading">Review Trading</option>
                                    <option value="negligence">Medical Negligence</option>
                                </select>
                                <Input
                                    placeholder="Description..."
                                    value={flagDescription}
                                    onChange={(e) => setFlagDescription(e.target.value)}
                                    className="bg-slate-50 border-slate-200"
                                />
                                <Button variant="destructive" size="sm" onClick={handleFlag} className="w-full">
                                    <Flag className="w-3 h-3 mr-1" /> Flag Clinic
                                </Button>
                            </div>

                            {/* Manual Adjustment */}
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                <h4 className="font-medium text-sm flex items-center gap-1 text-slate-700">
                                    <TrendingDown className="w-4 h-4" /> Manual Score Adjustment
                                </h4>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Pts"
                                        value={adjustmentPoints}
                                        onChange={(e) => setAdjustmentPoints(e.target.value)}
                                        className="w-24 bg-slate-50 border-slate-200"
                                    />
                                    <Input
                                        placeholder="Reason..."
                                        value={adjustmentReason}
                                        onChange={(e) => setAdjustmentReason(e.target.value)}
                                        className="flex-1 bg-slate-50 border-slate-200"
                                    />
                                </div>
                                <Button variant="outline" size="sm" onClick={handleAdjustment} className="w-full">
                                    <RefreshCw className="w-3 h-3 mr-1" /> Apply Override
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-400 py-12">
                            <Eye className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p>Select a clinic to view details and take action</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Audit Log Notice */}
            <div className="text-center text-sm text-slate-400 p-2">
                <strong>⚠️ All actions are logged.</strong> Manual overrides require justification and are subject to review.
            </div>
        </div>
    );
}
