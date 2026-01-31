'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Activity, Clock, AlertTriangle, Users,
    Phone, Power, Zap, Coffee
} from 'lucide-react';
import {
    ClinicAvailabilityState,
    ClinicHeartbeat,
    clinicStatusService
} from '@/lib/clinic-status';
import { hapticPatterns } from '@/components/gestures/ios-gestures';

// =============================================================================
// LIVE STATUS INDICATOR
// =============================================================================

interface LiveStatusIndicatorProps {
    state: ClinicAvailabilityState;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function LiveStatusIndicator({
    state,
    size = 'md',
    showLabel = true
}: LiveStatusIndicatorProps) {
    const display = clinicStatusService.getStatusDisplay(state);

    const sizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    };

    const colorClasses = {
        green: 'bg-green-500',
        red: 'bg-red-500',
        amber: 'bg-amber-500',
        gray: 'bg-gray-400'
    };

    return (
        <div className="flex items-center gap-2">
            <span className="relative flex">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorClasses[display.color]} opacity-75`} />
                <span className={`relative inline-flex rounded-full ${sizeClasses[size]} ${colorClasses[display.color]}`} />
            </span>
            {showLabel && (
                <span className="text-sm font-medium">{display.label}</span>
            )}
        </div>
    );
}

// =============================================================================
// CLINIC CONTROL PANEL
// =============================================================================

interface ClinicControlPanelProps {
    heartbeat: ClinicHeartbeat;
    onToggleStatus: (newState: ClinicAvailabilityState, reason?: string) => void;
    className?: string;
}

export function ClinicControlPanel({
    heartbeat,
    onToggleStatus,
    className = ''
}: ClinicControlPanelProps) {
    const [isEmergencyMode, setIsEmergencyMode] = useState(
        heartbeat.status.currentState === 'EMERGENCY_ONLY'
    );
    const [isManualClosed, setIsManualClosed] = useState(
        heartbeat.status.manualOverride && heartbeat.status.currentState === 'CLOSED'
    );

    const handleEmergencyToggle = (enabled: boolean) => {
        hapticPatterns.warningShake();
        setIsEmergencyMode(enabled);
        onToggleStatus(enabled ? 'EMERGENCY_ONLY' : 'OPEN',
            enabled ? 'Emergency mode activated' : undefined
        );
    };

    const handleClosedToggle = (closed: boolean) => {
        hapticPatterns.softTap();
        setIsManualClosed(closed);
        onToggleStatus(closed ? 'CLOSED' : 'OPEN',
            closed ? 'Manual override - clinic closed' : undefined
        );
    };

    const display = clinicStatusService.getStatusDisplay(heartbeat.status.currentState);

    return (
        <Card className={`glass-card p-4 space-y-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Clinic Heartbeat</h3>
                </div>
                <LiveStatusIndicator state={heartbeat.status.currentState} size="lg" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 rounded-lg bg-muted/50">
                    <Users className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                    <p className="text-lg font-bold">{heartbeat.activePatients}</p>
                    <p className="text-xs text-muted-foreground">In Clinic</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                    <p className="text-lg font-bold">{heartbeat.queueLength}</p>
                    <p className="text-xs text-muted-foreground">Waiting</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                    <Coffee className="w-4 h-4 mx-auto mb-1 text-orange-500" />
                    <p className="text-lg font-bold">~{heartbeat.estimatedWaitMinutes}m</p>
                    <p className="text-xs text-muted-foreground">Est. Wait</p>
                </div>
            </div>

            {/* Doctor Availability */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Doctors</p>
                <div className="flex flex-wrap gap-2">
                    {heartbeat.doctorAvailability.map(doc => (
                        <Badge
                            key={doc.doctorId}
                            variant={doc.isAvailable ? 'default' : 'secondary'}
                            className={doc.currentStatus === 'with_patient' ? 'animate-pulse' : ''}
                        >
                            {doc.doctorName}
                            {doc.currentStatus === 'with_patient' && ' 🦷'}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Control Toggles */}
            <div className="space-y-3 pt-3 border-t">
                {/* Manual Close Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Power className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Close Clinic</span>
                    </div>
                    <Switch
                        checked={isManualClosed}
                        onCheckedChange={handleClosedToggle}
                    />
                </div>

                {/* Emergency Mode Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-sm">Emergency Only</span>
                    </div>
                    <Switch
                        checked={isEmergencyMode}
                        onCheckedChange={handleEmergencyToggle}
                    />
                </div>
            </div>

            {/* Emergency Mode Warning */}
            <AnimatePresence>
                {isEmergencyMode && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200"
                    >
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-medium text-amber-800 dark:text-amber-200">
                                    Emergency Mode Active
                                </p>
                                <p className="text-amber-700 dark:text-amber-300">
                                    +{heartbeat.status.emergencySurchargePercent}% surcharge will be applied
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Override Info */}
            {heartbeat.status.manualOverride && heartbeat.status.overrideReason && (
                <p className="text-xs text-muted-foreground">
                    Override: {heartbeat.status.overrideReason}
                </p>
            )}
        </Card>
    );
}

// =============================================================================
// PATIENT-FACING STATUS CARD
// =============================================================================

interface PatientStatusCardProps {
    state: ClinicAvailabilityState;
    estimatedWait: number;
    emergencySurcharge?: number;
    onBookEmergency?: () => void;
}

export function PatientStatusCard({
    state,
    estimatedWait,
    emergencySurcharge,
    onBookEmergency
}: PatientStatusCardProps) {
    const display = clinicStatusService.getStatusDisplay(state);

    const bgColors = {
        green: 'bg-green-50 dark:bg-green-950/30 border-green-200',
        red: 'bg-red-50 dark:bg-red-950/30 border-red-200',
        amber: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200',
        gray: 'bg-gray-50 dark:bg-gray-950/30 border-gray-200'
    };

    return (
        <Card className={`p-4 border ${bgColors[display.color]}`}>
            <div className="flex items-center justify-between mb-3">
                <LiveStatusIndicator state={state} size="lg" />
                {state === 'OPEN' && (
                    <span className="text-sm text-muted-foreground">
                        ~{estimatedWait} min wait
                    </span>
                )}
            </div>

            <p className="text-sm">{display.description}</p>

            {state === 'EMERGENCY_ONLY' && onBookEmergency && (
                <div className="mt-3 space-y-2">
                    <Button
                        onClick={() => {
                            hapticPatterns.warningShake();
                            onBookEmergency();
                        }}
                        className="w-full bg-amber-500 hover:bg-amber-600"
                    >
                        <Phone className="w-4 h-4 mr-2" />
                        Book Emergency Appointment
                    </Button>
                    {emergencySurcharge && (
                        <p className="text-xs text-center text-amber-700">
                            +{emergencySurcharge}% emergency surcharge applies
                        </p>
                    )}
                </div>
            )}

            {state === 'CLOSED' && (
                <p className="mt-2 text-sm text-muted-foreground">
                    Check back during operating hours
                </p>
            )}
        </Card>
    );
}

// =============================================================================
// COMPACT STATUS BADGE (for headers)
// =============================================================================

interface StatusBadgeProps {
    state: ClinicAvailabilityState;
}

export function StatusBadge({ state }: StatusBadgeProps) {
    const display = clinicStatusService.getStatusDisplay(state);

    const variants: Record<string, string> = {
        green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        gray: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
    };

    return (
        <Badge className={`${variants[display.color]} flex items-center gap-1.5`}>
            <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${display.color === 'green' ? 'bg-green-400' : display.color === 'red' ? 'bg-red-400' : display.color === 'amber' ? 'bg-amber-400' : 'bg-gray-400'}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${display.color === 'green' ? 'bg-green-500' : display.color === 'red' ? 'bg-red-500' : display.color === 'amber' ? 'bg-amber-500' : 'bg-gray-400'}`} />
            </span>
            {display.label}
        </Badge>
    );
}
