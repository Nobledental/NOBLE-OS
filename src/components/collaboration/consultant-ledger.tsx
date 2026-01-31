'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    DollarSign, TrendingUp, Calendar, Download,
    CheckCircle, Clock, AlertCircle, Wallet
} from 'lucide-react';
import {
    ConsultantLedger,
    ConsultantProcedure,
    EODConsultantSummary,
    ConsultantProfile,
    generateEODConsultantSummary
} from '@/types/consultant.types';

interface ConsultantLedgerPanelProps {
    consultantId?: string; // Optional - if not provided, shows admin view
    isAdmin?: boolean;
}

// Mock data
const mockProcedures: ConsultantProcedure[] = [
    {
        id: 'proc-1',
        consultantId: 'cons-2',
        patientId: 'pat-1',
        procedureCode: 'EXO-SUR',
        procedureName: 'Surgical Extraction - 48',
        performedAt: '2026-01-30T10:30:00Z',
        totalAmount: 8000,
        consultantShare: 5200,
        clinicCommission: 2800,
        status: 'completed'
    },
    {
        id: 'proc-2',
        consultantId: 'cons-2',
        patientId: 'pat-2',
        procedureCode: 'EXO-SUR',
        procedureName: 'Surgical Extraction - 38',
        performedAt: '2026-01-30T14:00:00Z',
        totalAmount: 7500,
        consultantShare: 4875,
        clinicCommission: 2625,
        status: 'completed'
    },
    {
        id: 'proc-3',
        consultantId: 'cons-1',
        patientId: 'pat-3',
        procedureCode: 'ORTHO-BRK',
        procedureName: 'Bracket Placement - Full',
        performedAt: '2026-01-30T11:00:00Z',
        totalAmount: 45000,
        consultantShare: 27000,
        clinicCommission: 18000,
        status: 'completed'
    },
    {
        id: 'proc-4',
        consultantId: 'cons-3',
        patientId: 'pat-4',
        procedureCode: 'PERIO-FMD',
        procedureName: 'Full Mouth Debridement',
        performedAt: '2026-01-30T15:30:00Z',
        totalAmount: 5000,
        consultantShare: 2750,
        clinicCommission: 2250,
        status: 'pending'
    }
];

const mockConsultants: ConsultantProfile[] = [
    { id: 'cons-1', name: 'Dr. Priya Sharma', specialty: 'orthodontics', commissionPercentage: 60 } as ConsultantProfile,
    { id: 'cons-2', name: 'Dr. Rajesh Kumar', specialty: 'oral_surgery', commissionPercentage: 65 } as ConsultantProfile,
    { id: 'cons-3', name: 'Dr. Anita Menon', specialty: 'periodontics', commissionPercentage: 55 } as ConsultantProfile
];

export default function ConsultantLedgerPanel({
    consultantId,
    isAdmin = false
}: ConsultantLedgerPanelProps) {
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
    const [procedures, setProcedures] = useState<ConsultantProcedure[]>([]);

    useEffect(() => {
        // Filter procedures based on consultant and date
        let filtered = [...mockProcedures];

        if (consultantId) {
            filtered = filtered.filter(p => p.consultantId === consultantId);
        }

        // Date filtering would happen here in production
        setProcedures(filtered);
    }, [consultantId, selectedDate, selectedPeriod]);

    const eodSummary = useMemo(() =>
        generateEODConsultantSummary(selectedDate, procedures, mockConsultants),
        [selectedDate, procedures]
    );

    const myProcedures = consultantId
        ? procedures.filter(p => p.consultantId === consultantId)
        : procedures;

    const totals = useMemo(() => {
        return myProcedures.reduce((acc, p) => ({
            gross: acc.gross + p.totalAmount,
            consultantShare: acc.consultantShare + p.consultantShare,
            clinicCommission: acc.clinicCommission + p.clinicCommission,
            completed: acc.completed + (p.status === 'completed' ? 1 : 0),
            pending: acc.pending + (p.status === 'pending' ? 1 : 0)
        }), { gross: 0, consultantShare: 0, clinicCommission: 0, completed: 0, pending: 0 });
    }, [myProcedures]);

    return (
        <div className="space-y-4">
            {/* Header */}
            <Card className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Wallet className="w-6 h-6 text-green-500" />
                            {isAdmin ? 'Consultant Ledger' : 'My Earnings'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {isAdmin
                                ? 'Track consultant payables and settlements'
                                : 'View your procedure earnings and payouts'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Select value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as 'today' | 'week' | 'month')}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Export
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Gross Revenue</span>
                        <DollarSign className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">₹{totals.gross.toLocaleString()}</div>
                </Card>

                <Card className="p-4 bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                            {isAdmin ? 'Payable to Consultants' : 'My Share'}
                        </span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                        ₹{totals.consultantShare.toLocaleString()}
                    </div>
                </Card>

                <Card className="p-4 bg-blue-50 dark:bg-blue-950/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Clinic Commission</span>
                        <Calendar className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                        ₹{totals.clinicCommission.toLocaleString()}
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Procedures</span>
                        <CheckCircle className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold">
                        {totals.completed}/{myProcedures.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                </Card>
            </div>

            {/* EOD Admin Summary */}
            {isAdmin && (
                <Card className="p-4 border-l-4 border-l-amber-500">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-500" />
                        EOD Settlement - Consultant Payouts
                    </h3>
                    <div className="space-y-2">
                        {eodSummary.consultants.map(c => (
                            <div key={c.consultantId} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{c.consultantName}</span>
                                    <Badge variant="outline">{c.procedureCount} procedures</Badge>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-green-600">
                                        ₹{c.payableAmount.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        from ₹{c.totalEarnings.toLocaleString()} gross
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <span className="font-semibold">Total Payable to Consultants:</span>
                        <span className="text-2xl font-bold text-amber-600">
                            ₹{eodSummary.totalPayableToConsultants.toLocaleString()}
                        </span>
                    </div>
                </Card>
            )}

            {/* Procedure List */}
            <Card className="p-4">
                <h3 className="font-semibold mb-3">Procedure Details</h3>
                <div className="space-y-2">
                    {myProcedures.map(proc => {
                        const consultant = mockConsultants.find(c => c.id === proc.consultantId);
                        return (
                            <div
                                key={proc.id}
                                className="p-3 bg-muted/50 rounded-lg"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <div className="font-medium">{proc.procedureName}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {isAdmin && consultant?.name} • {proc.procedureCode}
                                        </div>
                                    </div>
                                    <Badge variant={proc.status === 'completed' ? 'default' : 'secondary'}>
                                        {proc.status === 'completed'
                                            ? <><CheckCircle className="w-3 h-3 mr-1" /> Completed</>
                                            : <><Clock className="w-3 h-3 mr-1" /> Pending</>
                                        }
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Total:</span>
                                        <span className="ml-2 font-medium">₹{proc.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Consultant:</span>
                                        <span className="ml-2 font-medium text-green-600">₹{proc.consultantShare.toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Clinic:</span>
                                        <span className="ml-2 font-medium text-blue-600">₹{proc.clinicCommission.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}
