'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    FileText, Download, Share2, Mail, MessageSquare,
    Printer, Eye, Check, ChevronRight, QrCode,
    Shield, Clock, User, Activity, Stethoscope,
    Image, Calendar, AlertTriangle
} from 'lucide-react';
import {
    SmartReport,
    NOBLE_BRAND,
    generateHealthGaugeSVG,
    VitalSigns,
    ClinicalIndices,
    TreatmentSitting
} from '@/lib/pdf-export-engine';
import { hapticPatterns } from '@/components/gestures/ios-gestures';

// =============================================================================
// HEALTH SCORE GAUGE COMPONENT
// =============================================================================

interface HealthGaugeProps {
    score: number;
    size?: number;
    showLabel?: boolean;
}

export function HealthGauge({ score, size = 120, showLabel = true }: HealthGaugeProps) {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;

    const color = score >= 80 ? '#10B981'
        : score >= 60 ? '#F59E0B'
            : '#EF4444';

    const label = score >= 80 ? 'Healthy'
        : score >= 60 ? 'Moderate'
            : 'Needs Attention';

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                />
                {/* Progress arc */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - progress }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{score}%</span>
                {showLabel && (
                    <span className="text-xs text-muted-foreground">{label}</span>
                )}
            </div>
        </div>
    );
}

// =============================================================================
// INDEX BAR COMPONENT
// =============================================================================

interface IndexBarProps {
    label: string;
    percentage: number;
    teeth: string[];
}

export function IndexBar({ label, percentage, teeth }: IndexBarProps) {
    const color = percentage <= 20 ? 'bg-green-500'
        : percentage <= 50 ? 'bg-amber-500'
            : 'bg-red-500';

    const textColor = percentage <= 20 ? 'text-green-600'
        : percentage <= 50 ? 'text-amber-600'
            : 'text-red-600';

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className={`font-mono font-semibold ${textColor}`}>{percentage}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>
            {teeth.length > 0 && (
                <p className="text-xs text-muted-foreground font-mono">
                    {teeth.join(', ')}
                </p>
            )}
        </div>
    );
}

// =============================================================================
// CLINICAL PRESENTATION CARD
// =============================================================================

interface ClinicalPresentationProps {
    indices: ClinicalIndices;
}

export function ClinicalPresentationCard({ indices }: ClinicalPresentationProps) {
    return (
        <Card className="p-6 glass-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                Clinical Presentation
            </h3>
            <div className="flex gap-6">
                <HealthGauge score={indices.healthScore} />
                <div className="flex-1 grid grid-cols-2 gap-4">
                    <IndexBar
                        label="Tenderness"
                        percentage={indices.tenderness.percentage}
                        teeth={indices.tenderness.teeth}
                    />
                    <IndexBar
                        label="Sensitivity"
                        percentage={indices.sensitivity.percentage}
                        teeth={indices.sensitivity.teeth}
                    />
                    <IndexBar
                        label="Bleeding"
                        percentage={indices.bleeding.percentage}
                        teeth={indices.bleeding.teeth}
                    />
                    <IndexBar
                        label="Calculus"
                        percentage={indices.calculus.percentage}
                        teeth={indices.calculus.teeth}
                    />
                </div>
            </div>
        </Card>
    );
}

// =============================================================================
// VITALS TABLE COMPONENT
// =============================================================================

interface VitalsTableProps {
    vitals: VitalSigns[];
}

export function VitalsTable({ vitals }: VitalsTableProps) {
    const stageLabels = {
        PRE_ANESTHETIC: 'Pre-Anesthetic',
        INTRA_OP: 'Intra-Operative',
        POST_OPERATIVE: 'Post-Operative'
    };

    const stageColors = {
        PRE_ANESTHETIC: 'bg-blue-100 text-blue-700',
        INTRA_OP: 'bg-amber-100 text-amber-700',
        POST_OPERATIVE: 'bg-green-100 text-green-700'
    };

    return (
        <div className="overflow-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-slate-800 text-white">
                        <th className="px-4 py-3 text-left rounded-tl-lg">Stage</th>
                        <th className="px-4 py-3 text-center">Temp</th>
                        <th className="px-4 py-3 text-center">SpO2</th>
                        <th className="px-4 py-3 text-center">BP</th>
                        <th className="px-4 py-3 text-center rounded-tr-lg">HR</th>
                    </tr>
                </thead>
                <tbody>
                    {vitals.map((vital, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                            <td className="px-4 py-3">
                                <Badge className={stageColors[vital.stage]}>
                                    {stageLabels[vital.stage]}
                                </Badge>
                            </td>
                            <td className="px-4 py-3 text-center font-mono">
                                {vital.bodyTemperature.value}{vital.bodyTemperature.unit}
                            </td>
                            <td className="px-4 py-3 text-center font-mono">
                                <span className={vital.spO2 < 95 ? 'text-red-600' : ''}>
                                    {vital.spO2}%
                                </span>
                            </td>
                            <td className="px-4 py-3 text-center font-mono">
                                {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
                            </td>
                            <td className="px-4 py-3 text-center font-mono">
                                {vital.heartRate} <span className="text-xs text-muted-foreground">BPM</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// =============================================================================
// ANESTHESIA LOG CARD
// =============================================================================

interface AnesthesiaLogCardProps {
    log: {
        type: string;
        mode: string;
        nerveBlock?: string;
        side?: string;
        agent: string;
        dosage: string;
        aspirationNegative: boolean;
        topicalApplied: boolean;
        topicalAgent?: string;
    };
}

export function AnesthesiaLogCard({ log }: AnesthesiaLogCardProps) {
    return (
        <Card className="p-4 bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800">
            <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-teal-600 text-white">ANESTHESIA LOG</Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-semibold">{log.type}</span>
                </div>
                <div>
                    <span className="text-muted-foreground">Mode:</span>
                    <span className="ml-2 font-semibold">{log.mode}</span>
                </div>
                <div>
                    <span className="text-muted-foreground">Block:</span>
                    <span className="ml-2 font-semibold">
                        {log.nerveBlock || 'N/A'}{log.side ? ` (${log.side})` : ''}
                    </span>
                </div>
                <div>
                    <span className="text-muted-foreground">Agent:</span>
                    <span className="ml-2 font-semibold">{log.agent}</span>
                </div>
                <div>
                    <span className="text-muted-foreground">Dosage:</span>
                    <span className="ml-2 font-semibold">{log.dosage}</span>
                </div>
                <div>
                    <span className="text-muted-foreground">Aspiration:</span>
                    <span className={`ml-2 font-semibold ${log.aspirationNegative ? 'text-green-600' : 'text-red-600'}`}>
                        {log.aspirationNegative ? '✓ Negative' : '⚠ Positive'}
                    </span>
                </div>
            </div>
            {log.topicalApplied && (
                <p className="mt-2 text-xs text-muted-foreground">
                    Topical Applied: {log.topicalAgent || 'Standard'}
                </p>
            )}
        </Card>
    );
}

// =============================================================================
// TREATMENT SITTING CARD
// =============================================================================

interface TreatmentSittingCardProps {
    sitting: TreatmentSitting;
    onViewDetails?: () => void;
}

export function TreatmentSittingCard({ sitting, onViewDetails }: TreatmentSittingCardProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card className="overflow-hidden">
            {/* Header */}
            <div
                className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-white text-white">
                        Sitting #{sitting.sittingNumber}
                    </Badge>
                    <span className="text-sm opacity-80">
                        {sitting.date.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </span>
                </div>
                <ChevronRight className={`w-5 h-5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </div>

            {/* Quick View */}
            <div className="p-4 border-b">
                <p className="text-sm">
                    <span className="text-muted-foreground">Chief Complaint:</span>{' '}
                    {sitting.chiefComplaint}
                </p>
                <p className="text-sm mt-1">
                    <span className="text-muted-foreground">Diagnosis:</span>{' '}
                    {sitting.diagnosis.join(', ')}
                </p>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            {/* Procedures */}
                            <div>
                                <h4 className="font-semibold text-sm mb-2">Procedures</h4>
                                <div className="space-y-2">
                                    {sitting.proceduresPerformed.map((proc, idx) => (
                                        <div key={idx} className="p-3 bg-muted/50 rounded-lg text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{proc.name}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {proc.teeth.join(', ')}
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground mt-1">{proc.details}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Anesthesia */}
                            {sitting.anesthesia && (
                                <AnesthesiaLogCard log={sitting.anesthesia} />
                            )}

                            {/* Vitals */}
                            {sitting.vitals.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-sm mb-2">Vitals</h4>
                                    <VitalsTable vitals={sitting.vitals} />
                                </div>
                            )}

                            {/* Prescriptions */}
                            {sitting.prescriptions.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-sm mb-2">Prescriptions</h4>
                                    <div className="space-y-1">
                                        {sitting.prescriptions.map((rx, idx) => (
                                            <div key={idx} className="text-sm flex items-center gap-2">
                                                <span className="font-medium">{rx.drug}</span>
                                                <span className="text-muted-foreground">
                                                    {rx.dosage} • {rx.frequency} • {rx.duration}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Doctor Signature */}
            <div className="px-4 py-3 bg-muted/30 border-t flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Dr. {sitting.doctor.name}, {sitting.doctor.qualification}
                </div>
                {sitting.doctor.signature && (
                    <img
                        src={sitting.doctor.signature}
                        alt="Doctor Signature"
                        className="h-8 opacity-70"
                    />
                )}
            </div>
        </Card>
    );
}

// =============================================================================
// EXPORT ACTIONS PANEL
// =============================================================================

interface ExportActionsPanelProps {
    reportId: string;
    onExportPDF: () => void;
    onPrint: () => void;
    onShare: (channel: 'email' | 'whatsapp' | 'app') => void;
    isExporting?: boolean;
}

export function ExportActionsPanel({
    reportId,
    onExportPDF,
    onPrint,
    onShare,
    isExporting
}: ExportActionsPanelProps) {
    return (
        <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Export & Share
            </h3>
            <div className="grid grid-cols-2 gap-3">
                <Button
                    onClick={() => {
                        hapticPatterns.successPulse();
                        onExportPDF();
                    }}
                    disabled={isExporting}
                    className="flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    {isExporting ? 'Generating...' : 'Download PDF'}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        hapticPatterns.softTap();
                        onPrint();
                    }}
                >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        hapticPatterns.softTap();
                        onShare('email');
                    }}
                >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        hapticPatterns.softTap();
                        onShare('whatsapp');
                    }}
                    className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                </Button>
            </div>

            {/* Verification */}
            <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center gap-3">
                <QrCode className="w-10 h-10 text-muted-foreground" />
                <div className="text-sm">
                    <p className="font-medium">QR Verified Document</p>
                    <p className="text-muted-foreground text-xs">
                        Scan QR code to verify authenticity
                    </p>
                </div>
            </div>
        </Card>
    );
}

// =============================================================================
// SMART REPORT PREVIEW
// =============================================================================

interface SmartReportPreviewProps {
    report: SmartReport;
    onExport: () => void;
    onClose: () => void;
}

export function SmartReportPreview({ report, onExport, onClose }: SmartReportPreviewProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'sittings' | 'radiology'>('overview');

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-teal-600 to-slate-700 text-white">
                    <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6" />
                        <div>
                            <h2 className="font-bold">Smart Report Preview</h2>
                            <p className="text-sm opacity-80">UHID: {report.uhid}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-white hover:bg-white/20"
                    >
                        Close
                    </Button>
                </div>

                {/* Patient Header */}
                <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold">{report.patient.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {report.patient.age}Y / {report.patient.gender}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                            {report.uhid}
                        </Badge>
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                        </Badge>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b px-4">
                    <div className="flex gap-4">
                        {[
                            { id: 'overview', label: 'Overview', icon: Activity },
                            { id: 'sittings', label: 'Sittings', icon: Calendar },
                            { id: 'radiology', label: 'Radiology', icon: Image }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex items-center gap-2 py-3 px-1 border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[50vh]">
                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            <ClinicalPresentationCard indices={report.clinicalIndices} />

                            {/* Medical History */}
                            <Card className="p-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200">
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                                    Medical History
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Allergies:</span>
                                        <span className="ml-2">
                                            {report.medicalHistory.isNKDA
                                                ? <Badge className="bg-green-100 text-green-700">NKDA</Badge>
                                                : report.medicalHistory.drugAllergies.join(', ')
                                            }
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Conditions:</span>
                                        <span className="ml-2">
                                            {report.medicalHistory.systemicConditions.length > 0
                                                ? report.medicalHistory.systemicConditions.map(c => c.condition).join(', ')
                                                : 'None reported'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'sittings' && (
                        <div className="space-y-4">
                            {report.treatmentSittings.map((sitting) => (
                                <TreatmentSittingCard key={sitting.id} sitting={sitting} />
                            ))}
                        </div>
                    )}

                    {activeTab === 'radiology' && (
                        <div className="grid grid-cols-2 gap-4">
                            {report.radiology.map((rad) => (
                                <Card key={rad.id} className="overflow-hidden">
                                    <img
                                        src={rad.thumbnailUrl || rad.imageUrl}
                                        alt={rad.label}
                                        className="w-full h-40 object-cover bg-muted"
                                    />
                                    <div className="p-3">
                                        <Badge variant="outline" className="mb-2">{rad.type}</Badge>
                                        <p className="text-sm font-medium">{rad.label}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {rad.findings}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t bg-muted/30 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Generated: {report.generatedAt.toLocaleString()}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={onExport} className="bg-teal-600 hover:bg-teal-700">
                            <Download className="w-4 h-4 mr-2" />
                            Export PDF
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
