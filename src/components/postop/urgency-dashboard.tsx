'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertTriangle, Clock, Phone, MessageSquare,
    CheckCircle, XCircle, User, Stethoscope,
    Timer, Bell, ChevronRight, ChevronDown,
    Shield, Activity, Send
} from 'lucide-react';
import { ComplicationReport, slaMonitorService } from '@/lib/complication-bot';
import { AlertPriority } from '@/lib/postop-protocols';
import { hapticPatterns } from '@/components/gestures/ios-gestures';

// =============================================================================
// TYPES
// =============================================================================

interface UrgencyDashboardProps {
    complications: ComplicationReport[];
    onRespond: (report: ComplicationReport, note: string, resolution: ComplicationReport['resolution']) => void;
    onCallPatient: (report: ComplicationReport) => void;
    clinicId: string;
}

// =============================================================================
// COUNTDOWN TIMER COMPONENT
// =============================================================================

interface CountdownTimerProps {
    deadline: Date;
    respondedAt?: Date;
    size?: 'sm' | 'md' | 'lg';
}

export function CountdownTimer({ deadline, respondedAt, size = 'md' }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{
        hours: number;
        minutes: number;
        seconds: number;
        urgencyClass: 'green' | 'yellow' | 'red' | 'critical';
    }>({ hours: 0, minutes: 0, seconds: 0, urgencyClass: 'green' });

    useEffect(() => {
        if (respondedAt) {
            setTimeLeft({ hours: 0, minutes: 0, seconds: 0, urgencyClass: 'green' });
            return;
        }

        const updateTimer = () => {
            const now = new Date();
            const remaining = deadline.getTime() - now.getTime();

            if (remaining <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0, urgencyClass: 'critical' });
                return;
            }

            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            let urgencyClass: 'green' | 'yellow' | 'red' | 'critical';
            if (hours >= 12) urgencyClass = 'green';
            else if (hours >= 6) urgencyClass = 'yellow';
            else if (hours >= 1) urgencyClass = 'red';
            else urgencyClass = 'critical';

            setTimeLeft({ hours, minutes, seconds, urgencyClass });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [deadline, respondedAt]);

    if (respondedAt) {
        return (
            <Badge className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Responded
            </Badge>
        );
    }

    const colorClasses = {
        green: 'bg-green-100 text-green-700 border-green-200',
        yellow: 'bg-amber-100 text-amber-700 border-amber-200',
        red: 'bg-red-100 text-red-700 border-red-200',
        critical: 'bg-red-500 text-white border-red-600 animate-pulse'
    };

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-2'
    };

    return (
        <motion.div
            animate={timeLeft.urgencyClass === 'critical' ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
        >
            <Badge className={`${colorClasses[timeLeft.urgencyClass]} ${sizeClasses[size]} font-mono`}>
                <Timer className={`${size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />
                {timeLeft.hours.toString().padStart(2, '0')}:
                {timeLeft.minutes.toString().padStart(2, '0')}:
                {timeLeft.seconds.toString().padStart(2, '0')}
            </Badge>
        </motion.div>
    );
}

// =============================================================================
// PRIORITY INDICATOR
// =============================================================================

interface PriorityIndicatorProps {
    priority: AlertPriority;
    showLabel?: boolean;
}

export function PriorityIndicator({ priority, showLabel = true }: PriorityIndicatorProps) {
    const config = {
        GREEN: {
            color: 'bg-green-500',
            label: 'Healing',
            icon: CheckCircle
        },
        YELLOW: {
            color: 'bg-amber-500',
            label: 'Monitor',
            icon: Activity
        },
        RED: {
            color: 'bg-red-500',
            label: 'Urgent',
            icon: AlertTriangle
        },
        CRITICAL: {
            color: 'bg-red-600 animate-pulse',
            label: 'Critical',
            icon: XCircle
        }
    };

    const { color, label, icon: Icon } = config[priority];

    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            {showLabel && (
                <span className="text-sm font-medium flex items-center gap-1">
                    <Icon className="w-3 h-3" />
                    {label}
                </span>
            )}
        </div>
    );
}

// =============================================================================
// COMPLICATION CARD
// =============================================================================

interface ComplicationCardProps {
    report: ComplicationReport;
    onRespond: (note: string, resolution: ComplicationReport['resolution']) => void;
    onCallPatient: () => void;
    expanded?: boolean;
    onToggleExpand?: () => void;
}

export function ComplicationCard({
    report,
    onRespond,
    onCallPatient,
    expanded = false,
    onToggleExpand
}: ComplicationCardProps) {
    const [responseNote, setResponseNote] = useState('');
    const [selectedResolution, setSelectedResolution] = useState<ComplicationReport['resolution']>('resolved');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(async () => {
        if (!responseNote.trim()) return;

        setIsSubmitting(true);
        hapticPatterns.successPulse();
        await onRespond(responseNote, selectedResolution);
        setIsSubmitting(false);
        setResponseNote('');
    }, [responseNote, selectedResolution, onRespond]);

    const priorityStyles = {
        GREEN: 'border-l-green-500',
        YELLOW: 'border-l-amber-500',
        RED: 'border-l-red-500',
        CRITICAL: 'border-l-red-600 bg-red-50 dark:bg-red-950/20'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Card className={`overflow-hidden border-l-4 ${priorityStyles[report.severity]}`}>
                {/* Header */}
                <div
                    className="p-4 cursor-pointer"
                    onClick={onToggleExpand}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <PriorityIndicator priority={report.severity} />
                            <div>
                                <h3 className="font-semibold">{report.patientName}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {report.procedureName} • {report.symptom}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CountdownTimer
                                deadline={report.slaDeadline}
                                respondedAt={report.respondedAt}
                            />
                            {expanded ? (
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                        </div>
                    </div>

                    {/* Quick info */}
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Reported {new Date(report.reportedAt).toLocaleTimeString()}
                        </span>
                        {report.painLevel !== undefined && (
                            <span>Pain: {report.painLevel}/10</span>
                        )}
                        <Badge variant="outline" className="text-xs">
                            Escalation Level {report.escalationLevel}
                        </Badge>
                    </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                    {expanded && !report.respondedAt && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-4 space-y-4 border-t pt-4">
                                {/* Details */}
                                {report.additionalDetails && (
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-sm">{report.additionalDetails}</p>
                                    </div>
                                )}

                                {/* Quick actions */}
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            hapticPatterns.softTap();
                                            onCallPatient();
                                        }}
                                    >
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call Patient
                                    </Button>
                                    <Button variant="outline">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Send Message
                                    </Button>
                                </div>

                                {/* Response form */}
                                <div className="space-y-3">
                                    <Textarea
                                        placeholder="Enter your response note..."
                                        value={responseNote}
                                        onChange={(e) => setResponseNote(e.target.value)}
                                        rows={3}
                                    />

                                    {/* Resolution options */}
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-700' },
                                            { value: 'monitoring', label: 'Monitoring', color: 'bg-amber-100 text-amber-700' },
                                            { value: 'scheduled_visit', label: 'Schedule Visit', color: 'bg-blue-100 text-blue-700' },
                                            { value: 'emergency', label: 'Emergency', color: 'bg-red-100 text-red-700' }
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => setSelectedResolution(option.value as ComplicationReport['resolution'])}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedResolution === option.value
                                                        ? option.color
                                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>

                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!responseNote.trim() || isSubmitting}
                                        className="w-full"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        {isSubmitting ? 'Submitting...' : 'Submit Response'}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Responded state */}
                {report.respondedAt && (
                    <div className="px-4 pb-4 border-t pt-3">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                Responded by {report.respondedBy} at {new Date(report.respondedAt).toLocaleString()}
                            </span>
                        </div>
                        {report.responseNote && (
                            <p className="text-sm text-muted-foreground">{report.responseNote}</p>
                        )}
                    </div>
                )}
            </Card>
        </motion.div>
    );
}

// =============================================================================
// URGENCY DASHBOARD
// =============================================================================

export function UrgencyDashboard({
    complications,
    onRespond,
    onCallPatient,
    clinicId
}: UrgencyDashboardProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'responded'>('pending');

    // Sort by priority then by time remaining
    const sortedComplications = [...complications].sort((a, b) => {
        // Pending first
        if (!a.respondedAt && b.respondedAt) return -1;
        if (a.respondedAt && !b.respondedAt) return 1;

        // By priority
        const priorityOrder = { CRITICAL: 0, RED: 1, YELLOW: 2, GREEN: 3 };
        const priorityDiff = priorityOrder[a.severity] - priorityOrder[b.severity];
        if (priorityDiff !== 0) return priorityDiff;

        // By deadline
        return a.slaDeadline.getTime() - b.slaDeadline.getTime();
    });

    const filteredComplications = sortedComplications.filter(c => {
        if (filter === 'pending') return !c.respondedAt;
        if (filter === 'responded') return !!c.respondedAt;
        return true;
    });

    const criticalCount = complications.filter(c =>
        !c.respondedAt && (c.severity === 'CRITICAL' || c.severity === 'RED')
    ).length;

    const pendingCount = complications.filter(c => !c.respondedAt).length;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Complication Queue</h2>
                        <p className="text-sm text-muted-foreground">
                            {pendingCount} pending • {criticalCount} critical
                        </p>
                    </div>
                </div>
                {criticalCount > 0 && (
                    <Badge className="bg-red-500 text-white animate-pulse">
                        <Bell className="w-3 h-3 mr-1" />
                        {criticalCount} Critical
                    </Badge>
                )}
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-4 gap-2">
                {[
                    { label: 'Green', count: complications.filter(c => c.severity === 'GREEN' && !c.respondedAt).length, color: 'bg-green-500' },
                    { label: 'Yellow', count: complications.filter(c => c.severity === 'YELLOW' && !c.respondedAt).length, color: 'bg-amber-500' },
                    { label: 'Red', count: complications.filter(c => c.severity === 'RED' && !c.respondedAt).length, color: 'bg-red-500' },
                    { label: 'Critical', count: complications.filter(c => c.severity === 'CRITICAL' && !c.respondedAt).length, color: 'bg-red-600' }
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                    >
                        <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                        <span className="text-sm font-medium">{stat.count}</span>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {[
                    { value: 'pending', label: 'Pending' },
                    { value: 'responded', label: 'Responded' },
                    { value: 'all', label: 'All' }
                ].map((f) => (
                    <Button
                        key={f.value}
                        variant={filter === f.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(f.value as typeof filter)}
                    >
                        {f.label}
                    </Button>
                ))}
            </div>

            {/* Complication list */}
            <div className="space-y-3">
                {filteredComplications.length === 0 ? (
                    <Card className="p-8 text-center">
                        <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg">All Clear!</h3>
                        <p className="text-muted-foreground">
                            No {filter === 'pending' ? 'pending' : ''} complications to review
                        </p>
                    </Card>
                ) : (
                    filteredComplications.map((report) => (
                        <ComplicationCard
                            key={report.id}
                            report={report}
                            expanded={expandedId === report.id}
                            onToggleExpand={() => setExpandedId(
                                expandedId === report.id ? null : report.id
                            )}
                            onRespond={(note, resolution) => onRespond(report, note, resolution)}
                            onCallPatient={() => onCallPatient(report)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// =============================================================================
// POST-OP STATUS SUMMARY CARD (for patient view)
// =============================================================================

interface PostOpStatusCardProps {
    patientName: string;
    procedureName: string;
    completedAt: Date;
    currentPriority: AlertPriority;
    daysSinceProcedure: number;
    totalRecoveryDays: number;
    nextCheckIn?: Date;
    onReportIssue: () => void;
}

export function PostOpStatusCard({
    patientName,
    procedureName,
    completedAt,
    currentPriority,
    daysSinceProcedure,
    totalRecoveryDays,
    nextCheckIn,
    onReportIssue
}: PostOpStatusCardProps) {
    const progress = Math.min(100, (daysSinceProcedure / totalRecoveryDays) * 100);

    const statusConfig = {
        GREEN: {
            message: 'Healing well! Keep following care instructions.',
            icon: CheckCircle,
            color: 'text-green-600'
        },
        YELLOW: {
            message: 'We\'re monitoring you. Let us know if anything changes.',
            icon: Activity,
            color: 'text-amber-600'
        },
        RED: {
            message: 'Our team is prioritizing your care.',
            icon: AlertTriangle,
            color: 'text-red-600'
        },
        CRITICAL: {
            message: 'Please stay available. Help is on the way.',
            icon: Bell,
            color: 'text-red-700'
        }
    };

    const config = statusConfig[currentPriority];

    return (
        <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${currentPriority === 'GREEN' ? 'bg-green-100' :
                        currentPriority === 'YELLOW' ? 'bg-amber-100' :
                            'bg-red-100'
                    }`}>
                    <Stethoscope className={`w-5 h-5 ${config.color}`} />
                </div>
                <div>
                    <h3 className="font-semibold">{procedureName} Recovery</h3>
                    <p className="text-sm text-muted-foreground">
                        Day {daysSinceProcedure} of {totalRecoveryDays}
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Status message */}
            <div className={`flex items-center gap-2 mb-4 ${config.color}`}>
                <config.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{config.message}</span>
            </div>

            {/* Next check-in */}
            {nextCheckIn && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="w-4 h-4" />
                    <span>Next check-in: {nextCheckIn.toLocaleString()}</span>
                </div>
            )}

            {/* Report issue button */}
            <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                    hapticPatterns.softTap();
                    onReportIssue();
                }}
            >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report an Issue
            </Button>
        </Card>
    );
}
