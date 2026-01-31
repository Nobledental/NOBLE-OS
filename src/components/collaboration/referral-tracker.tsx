'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    ExternalLink, Eye, Clock, CheckCircle,
    AlertCircle, ArrowLeftRight, Search, RefreshCw
} from 'lucide-react';
import { ReferralTracker } from '@/types/consultant.types';

interface ReferralStatusTrackerProps {
    clinicId: string;
}

// Mock data
const mockTrackers: ReferralTracker[] = [
    {
        referralId: 'ref-1',
        patientId: 'pat-1',
        patientName: 'Rahul Kumar',
        referredTo: 'City Maxillofacial Center',
        referralDate: '2026-01-20',
        linkOpened: true,
        openedAt: '2026-01-20T14:30:00Z',
        treatmentStarted: true,
        treatmentStartedAt: '2026-01-25T10:00:00Z',
        treatmentCompleted: false,
        returnedToClinic: false,
        status: 'in_treatment'
    },
    {
        referralId: 'ref-2',
        patientId: 'pat-2',
        patientName: 'Priya Sharma',
        referredTo: 'Orthodontic Specialist Clinic',
        referralDate: '2026-01-15',
        linkOpened: true,
        openedAt: '2026-01-15T11:00:00Z',
        treatmentStarted: true,
        treatmentStartedAt: '2026-01-18T09:00:00Z',
        treatmentCompleted: true,
        treatmentCompletedAt: '2026-01-28T16:00:00Z',
        returnedToClinic: true,
        returnedAt: '2026-01-30T10:00:00Z',
        status: 'returned'
    },
    {
        referralId: 'ref-3',
        patientId: 'pat-3',
        patientName: 'Amit Patel',
        referredTo: 'Oral Surgery Associates',
        referralDate: '2026-01-28',
        linkOpened: true,
        openedAt: '2026-01-28T15:00:00Z',
        treatmentStarted: false,
        treatmentCompleted: false,
        returnedToClinic: false,
        status: 'viewed'
    },
    {
        referralId: 'ref-4',
        patientId: 'pat-4',
        patientName: 'Sunita Rao',
        referredTo: 'Dental Implant Center',
        referralDate: '2026-01-10',
        linkOpened: false,
        treatmentStarted: false,
        treatmentCompleted: false,
        returnedToClinic: false,
        status: 'sent'
    },
    {
        referralId: 'ref-5',
        patientId: 'pat-5',
        patientName: 'Vikram Singh',
        referredTo: 'TMJ Specialist',
        referralDate: '2025-12-15',
        linkOpened: true,
        openedAt: '2025-12-16T10:00:00Z',
        treatmentStarted: false,
        treatmentCompleted: false,
        returnedToClinic: false,
        status: 'lost'
    }
];

const STATUS_CONFIG: Record<ReferralTracker['status'], {
    label: string;
    color: string;
    icon: typeof Eye
}> = {
    sent: { label: 'Link Sent', color: 'bg-gray-500', icon: ExternalLink },
    viewed: { label: 'Viewed', color: 'bg-blue-500', icon: Eye },
    in_treatment: { label: 'In Treatment', color: 'bg-yellow-500', icon: Clock },
    completed: { label: 'Completed', color: 'bg-green-500', icon: CheckCircle },
    returned: { label: 'Returned', color: 'bg-purple-500', icon: ArrowLeftRight },
    lost: { label: 'Lost to Follow-up', color: 'bg-red-500', icon: AlertCircle }
};

export default function ReferralStatusTracker({ clinicId }: ReferralStatusTrackerProps) {
    const [trackers, setTrackers] = useState<ReferralTracker[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<ReferralTracker['status'] | 'all'>('all');
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        setTrackers(mockTrackers);
    }, [clinicId]);

    const filteredTrackers = trackers.filter(t => {
        const matchesSearch = t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.referredTo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsRefreshing(false);
    };

    // Stats
    const stats = {
        total: trackers.length,
        viewed: trackers.filter(t => t.linkOpened).length,
        inTreatment: trackers.filter(t => t.status === 'in_treatment').length,
        returned: trackers.filter(t => t.status === 'returned').length,
        lost: trackers.filter(t => t.status === 'lost').length
    };

    const getTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        return `${days} days ago`;
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <Card className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ArrowLeftRight className="w-6 h-6 text-purple-500" />
                            Referral Status Tracker
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Track patient journeys to external specialists
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4">
                <Card className="p-3 text-center">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Referrals</div>
                </Card>
                <Card className="p-3 text-center bg-blue-50 dark:bg-blue-950/20">
                    <div className="text-2xl font-bold text-blue-600">{stats.viewed}</div>
                    <div className="text-sm text-muted-foreground">Links Opened</div>
                </Card>
                <Card className="p-3 text-center bg-yellow-50 dark:bg-yellow-950/20">
                    <div className="text-2xl font-bold text-yellow-600">{stats.inTreatment}</div>
                    <div className="text-sm text-muted-foreground">In Treatment</div>
                </Card>
                <Card className="p-3 text-center bg-purple-50 dark:bg-purple-950/20">
                    <div className="text-2xl font-bold text-purple-600">{stats.returned}</div>
                    <div className="text-sm text-muted-foreground">Returned</div>
                </Card>
                <Card className="p-3 text-center bg-red-50 dark:bg-red-950/20">
                    <div className="text-2xl font-bold text-red-600">{stats.lost}</div>
                    <div className="text-sm text-muted-foreground">Lost</div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search patient or center..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'sent', 'viewed', 'in_treatment', 'returned', 'lost'] as const).map(status => (
                            <Button
                                key={status}
                                variant={filterStatus === status ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus(status)}
                            >
                                {status === 'all' ? 'All' : STATUS_CONFIG[status].label}
                            </Button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Referral List */}
            <Card className="p-4">
                <div className="space-y-3">
                    {filteredTrackers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No referrals found</p>
                        </div>
                    ) : (
                        filteredTrackers.map(tracker => {
                            const config = STATUS_CONFIG[tracker.status];
                            const StatusIcon = config.icon;

                            return (
                                <div
                                    key={tracker.referralId}
                                    className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <div className="font-medium text-lg">{tracker.patientName}</div>
                                            <div className="text-sm text-muted-foreground">
                                                → {tracker.referredTo}
                                            </div>
                                        </div>
                                        <Badge className={`${config.color} text-white`}>
                                            <StatusIcon className="w-3 h-3 mr-1" />
                                            {config.label}
                                        </Badge>
                                    </div>

                                    {/* Timeline */}
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1">
                                            <ExternalLink className="w-3 h-3" />
                                            <span>Sent {getTimeAgo(tracker.referralDate)}</span>
                                        </div>

                                        {tracker.linkOpened && (
                                            <>
                                                <span className="text-muted-foreground">→</span>
                                                <div className="flex items-center gap-1 text-blue-600">
                                                    <Eye className="w-3 h-3" />
                                                    <span>Opened {getTimeAgo(tracker.openedAt!)}</span>
                                                </div>
                                            </>
                                        )}

                                        {tracker.treatmentStarted && (
                                            <>
                                                <span className="text-muted-foreground">→</span>
                                                <div className="flex items-center gap-1 text-yellow-600">
                                                    <Clock className="w-3 h-3" />
                                                    <span>Treatment {getTimeAgo(tracker.treatmentStartedAt!)}</span>
                                                </div>
                                            </>
                                        )}

                                        {tracker.treatmentCompleted && (
                                            <>
                                                <span className="text-muted-foreground">→</span>
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <CheckCircle className="w-3 h-3" />
                                                    <span>Completed</span>
                                                </div>
                                            </>
                                        )}

                                        {tracker.returnedToClinic && (
                                            <>
                                                <span className="text-muted-foreground">→</span>
                                                <div className="flex items-center gap-1 text-purple-600">
                                                    <ArrowLeftRight className="w-3 h-3" />
                                                    <span>Returned {getTimeAgo(tracker.returnedAt!)}</span>
                                                </div>
                                            </>
                                        )}

                                        {tracker.status === 'lost' && (
                                            <div className="flex items-center gap-1 text-red-600">
                                                <AlertCircle className="w-3 h-3" />
                                                <span>No response for 30+ days</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </Card>

            {/* India Standard Note */}
            <div className="text-center text-sm text-muted-foreground p-4">
                <p>
                    <strong>Referral Leakage Prevention:</strong> Track where your patients go
                    and ensure continuity of care with automatic follow-up alerts.
                </p>
            </div>
        </div>
    );
}
