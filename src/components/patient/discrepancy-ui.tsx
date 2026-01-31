'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    AlertTriangle, Clock, FileWarning, Send,
    CheckCircle, XCircle, MessageSquare, Shield
} from 'lucide-react';
import {
    DiscrepancyReport,
    DiscrepancyStatus,
    discrepancyService
} from '@/lib/discrepancy-report';

// =============================================================================
// PATIENT-FACING DISCREPANCY TOGGLE
// =============================================================================

interface DiscrepancyToggleProps {
    previousDiagnosis: string;
    currentDiagnosis: string;
    toothNumber: number;
    previousClinic: { id: string; name: string; doctor: string; date: string };
    currentClinic: { id: string; name: string; doctor: string; date: string };
    patientId: string;
    patientName: string;
    onReport: (report: DiscrepancyReport) => void;
}

export function DiscrepancyToggle({
    previousDiagnosis,
    currentDiagnosis,
    toothNumber,
    previousClinic,
    currentClinic,
    patientId,
    patientName,
    onReport
}: DiscrepancyToggleProps) {
    const [isReporting, setIsReporting] = useState(false);
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [confirmed, setConfirmed] = useState(false);

    // Check if there's an actual discrepancy
    const hasDiscrepancy =
        previousDiagnosis.toLowerCase().includes('healthy') &&
        !currentDiagnosis.toLowerCase().includes('healthy');

    if (!hasDiscrepancy) return null;

    const handleSubmit = () => {
        const report = discrepancyService.createReport(
            patientId,
            patientName,
            {
                clinicId: previousClinic.id,
                clinicName: previousClinic.name,
                doctorId: '', // Would be fetched from records
                doctorName: previousClinic.doctor,
                visitDate: previousClinic.date,
                diagnosis: previousDiagnosis
            },
            {
                clinicId: currentClinic.id,
                clinicName: currentClinic.name,
                doctorId: '',
                doctorName: currentClinic.doctor,
                visitDate: currentClinic.date,
                diagnosis: currentDiagnosis
            },
            {
                affectedTooth: toothNumber,
                clinicalNotes: additionalNotes
            }
        );

        onReport(report);
        setIsReporting(false);
    };

    return (
        <Card className="p-4 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    <h4 className="font-medium text-amber-800 dark:text-amber-200">
                        Potential Missed Finding Detected
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        Tooth #{toothNumber} was marked as "{previousDiagnosis}" at {previousClinic.name}
                        but diagnosed as "{currentDiagnosis}" today.
                    </p>

                    {!isReporting ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 border-amber-300 text-amber-700"
                            onClick={() => setIsReporting(true)}
                        >
                            <FileWarning className="w-4 h-4 mr-1" />
                            Report Discrepancy
                        </Button>
                    ) : (
                        <div className="mt-3 space-y-3">
                            <Textarea
                                placeholder="Add any additional details about this finding (optional)..."
                                value={additionalNotes}
                                onChange={(e) => setAdditionalNotes(e.target.value)}
                                rows={3}
                            />

                            <label className="flex items-start gap-2 cursor-pointer">
                                <Switch
                                    checked={confirmed}
                                    onCheckedChange={setConfirmed}
                                />
                                <span className="text-xs text-muted-foreground">
                                    I understand that Dr. {previousClinic.doctor} will be notified
                                    and have 48 hours to respond before any action is taken.
                                </span>
                            </label>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsReporting(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    disabled={!confirmed}
                                    onClick={handleSubmit}
                                    className="bg-amber-600 hover:bg-amber-700"
                                >
                                    <Send className="w-4 h-4 mr-1" />
                                    Submit Report
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

// =============================================================================
// DOCTOR-FACING DISCREPANCY RESPONSE
// =============================================================================

interface DiscrepancyResponseProps {
    report: DiscrepancyReport;
    onRespond: (report: DiscrepancyReport, explanation: string, acknowledges: boolean) => void;
}

export function DiscrepancyResponse({ report, onRespond }: DiscrepancyResponseProps) {
    const [explanation, setExplanation] = useState('');
    const [acknowledges, setAcknowledges] = useState(false);
    const timeRemaining = discrepancyService.getTimeRemaining(report);

    const getStatusColor = () => {
        if (timeRemaining.expired) return 'destructive';
        if (timeRemaining.hours < 12) return 'default';
        return 'secondary';
    };

    return (
        <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950/20">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-red-600" />
                        <h4 className="font-semibold text-red-800 dark:text-red-200">
                            Discrepancy Report
                        </h4>
                    </div>
                    <Badge variant={getStatusColor()} className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeRemaining.expired
                            ? 'Deadline Passed'
                            : `${timeRemaining.hours}h ${timeRemaining.minutes}m remaining`
                        }
                    </Badge>
                </div>

                {/* Report Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Patient</p>
                        <p className="font-medium">{report.patientName}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Affected Tooth</p>
                        <p className="font-medium">#{report.affectedTooth}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Your Diagnosis</p>
                        <p className="font-medium">{report.originalDiagnosis}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Current Finding</p>
                        <p className="font-medium text-red-600">{report.newDiagnosis}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-muted-foreground">Reporting Clinic</p>
                        <p className="font-medium">
                            {report.reportingClinicName} (Dr. {report.reportingDoctorName})
                        </p>
                    </div>
                </div>

                {/* Response Form */}
                {report.status === 'doctor_notified' || report.status === 'pending_review' ? (
                    <div className="space-y-3 pt-3 border-t">
                        <h5 className="font-medium text-sm">Your Response</h5>

                        <Textarea
                            placeholder="Provide your clinical explanation. Include any relevant factors like lesion was incipient at time of examination, patient declined treatment, etc..."
                            value={explanation}
                            onChange={(e) => setExplanation(e.target.value)}
                            rows={4}
                        />

                        <label className="flex items-center gap-2 cursor-pointer">
                            <Switch
                                checked={acknowledges}
                                onCheckedChange={setAcknowledges}
                            />
                            <span className="text-sm">
                                I acknowledge this finding may have been missed during my examination
                            </span>
                        </label>

                        <div className="flex gap-2">
                            <Button
                                disabled={!explanation.trim()}
                                onClick={() => onRespond(report, explanation, acknowledges)}
                                className="flex-1"
                            >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Submit Response
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            💡 Honest acknowledgment with explanation often results in no Trust Score impact.
                            Clinical progression is understood.
                        </p>
                    </div>
                ) : report.doctorResponse ? (
                    <div className="pt-3 border-t">
                        <h5 className="font-medium text-sm mb-2">Your Response (Submitted)</h5>
                        <p className="text-sm bg-white dark:bg-slate-800 p-3 rounded border">
                            {report.doctorResponse.explanation}
                        </p>
                        <Badge variant="outline" className="mt-2">
                            {report.doctorResponse.acknowledgesMiss
                                ? '✓ Acknowledged'
                                : '⚡ Disputed'
                            }
                        </Badge>
                    </div>
                ) : null}

                {/* Resolution */}
                {report.resolution && (
                    <div className="pt-3 border-t">
                        <div className="flex items-center gap-2">
                            {report.resolution.outcome === 'valid_miss' ? (
                                <XCircle className="w-5 h-5 text-red-500" />
                            ) : (
                                <CheckCircle className="w-5141h-5 text-green-500" />
                            )}
                            <span className="font-medium">
                                {report.resolution.outcome === 'valid_miss'
                                    ? `Trust Score: ${report.resolution.trustImpact} points`
                                    : 'No Trust Impact'
                                }
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {report.resolution.explanation}
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
}

// =============================================================================
// DISCREPANCY LIST (FOR DASHBOARD)
// =============================================================================

interface DiscrepancyListProps {
    reports: DiscrepancyReport[];
    viewType: 'patient' | 'doctor' | 'admin';
    onRespond?: (report: DiscrepancyReport, explanation: string, acknowledges: boolean) => void;
}

export default function DiscrepancyList({ reports, viewType, onRespond }: DiscrepancyListProps) {
    const getStatusBadge = (status: DiscrepancyStatus) => {
        const statusConfig: Record<DiscrepancyStatus, { color: string; label: string }> = {
            pending_review: { color: 'bg-yellow-500', label: 'Pending' },
            doctor_notified: { color: 'bg-orange-500', label: 'Awaiting Doctor' },
            doctor_responded: { color: 'bg-blue-500', label: 'Under Review' },
            under_investigation: { color: 'bg-purple-500', label: 'Investigating' },
            verified: { color: 'bg-red-500', label: 'Verified Miss' },
            dismissed: { color: 'bg-green-500', label: 'Dismissed' },
            expired: { color: 'bg-gray-500', label: 'Expired (Auto-Deduct)' },
            withdrawn: { color: 'bg-gray-400', label: 'Withdrawn' }
        };

        const config = statusConfig[status];
        return <Badge className={`${config.color} text-white`}>{config.label}</Badge>;
    };

    if (reports.length === 0) {
        return (
            <Card className="p-8 text-center">
                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                <p className="text-muted-foreground">No discrepancy reports</p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {reports.map(report => (
                <div key={report.id}>
                    {viewType === 'doctor' && onRespond ? (
                        <DiscrepancyResponse
                            report={report}
                            onRespond={onRespond}
                        />
                    ) : (
                        <Card className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Tooth #{report.affectedTooth}</span>
                                    {getStatusBadge(report.status)}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {new Date(report.createdAt).toLocaleDateString('en-IN')}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Original: </span>
                                    {report.originalDiagnosis}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Found: </span>
                                    <span className="text-red-600">{report.newDiagnosis}</span>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            ))}
        </div>
    );
}
