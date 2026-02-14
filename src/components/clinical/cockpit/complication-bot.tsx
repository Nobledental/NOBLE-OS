'use client';

/**
 * Complication Bot
 * 
 * Post-operative complication decision tree. Guides doctors through
 * assessing common post-op symptoms (pain, swelling, bleeding, fever)
 * and recommends immediate actions.
 * 
 * Also generates patient-facing instructions (WhatsApp-ready format).
 * 
 * Integrates:
 * - POST_OP_PROTOCOLS red flags
 * - Procedure context from cockpit store
 * - Auto-generates escalation notes
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle, CheckCircle2, Phone, MessageSquare,
    ArrowRight, ThermometerSun, Droplets, Activity,
    ShieldAlert, Clock, Stethoscope, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCockpitStore } from '@/lib/clinical-cockpit-store';
import { POST_OP_PROTOCOLS } from '@/lib/postop-protocols';

// ============================================================================
// COMPLICATION DECISION TREE
// ============================================================================

type Severity = 'GREEN' | 'YELLOW' | 'RED';

interface ComplicationNode {
    id: string;
    symptom: string;
    icon: React.ReactNode;
    question: string;
    options: {
        label: string;
        severity: Severity;
        nextNodeId?: string;  // If null, this is a terminal node
        action: string;       // Doctor action recommendation
        patientNote: string;  // Patient-facing instruction
    }[];
}

const COMPLICATION_TREE: ComplicationNode[] = [
    {
        id: 'pain',
        symptom: 'Pain',
        icon: <Activity className="w-5 h-5" />,
        question: 'What is the pain level reported by the patient?',
        options: [
            {
                label: 'Mild (VAS 1-3)',
                severity: 'GREEN',
                action: 'Continue current analgesic regimen. Review at next appointment.',
                patientNote: '✅ Mild pain is normal after the procedure. Continue your medicines as prescribed. Apply ice pack if needed.',
            },
            {
                label: 'Moderate (VAS 4-6)',
                severity: 'YELLOW',
                nextNodeId: 'pain_duration',
                action: 'Upgrade analgesic. Consider Aceclofenac+Para BD. Monitor for 24h.',
                patientNote: '⚠️ Please take the upgraded medicine as prescribed. If pain does not reduce in 24 hours, call the clinic.',
            },
            {
                label: 'Severe (VAS 7-10)',
                severity: 'RED',
                action: 'URGENT: Rule out dry socket / alveolar osteitis / infection. Schedule immediate review.',
                patientNote: '🚨 Please call the clinic IMMEDIATELY or visit the emergency room if the pain is unbearable.',
            },
        ],
    },
    {
        id: 'pain_duration',
        symptom: 'Pain Duration',
        icon: <Clock className="w-5 h-5" />,
        question: 'How long has the moderate pain persisted?',
        options: [
            {
                label: '< 48 hours',
                severity: 'YELLOW',
                action: 'Expected. Upgrade analgesic if not already done. Warm saline rinses.',
                patientNote: '⚠️ Pain within 48 hours is common. Take your prescribed medicines and do warm salt-water rinses.',
            },
            {
                label: '3-5 days',
                severity: 'YELLOW',
                action: 'Suspect dry socket if extraction. Irrigate socket, place medicated dressing (Alvogyl). Add Metronidazole.',
                patientNote: '⚠️ Pain beyond 3 days needs attention. Please visit the clinic for a review appointment.',
            },
            {
                label: '> 5 days',
                severity: 'RED',
                action: 'CRITICAL: Investigate infection, nerve damage, or retained root. X-ray recommended.',
                patientNote: '🚨 Persistent pain > 5 days is not normal. Please come to the clinic urgently for examination.',
            },
        ],
    },
    {
        id: 'swelling',
        symptom: 'Swelling',
        icon: <ThermometerSun className="w-5 h-5" />,
        question: 'Describe the swelling pattern:',
        options: [
            {
                label: 'Mild, localized, reducing',
                severity: 'GREEN',
                action: 'Normal post-op swelling. Continue ice application. Review if worsening.',
                patientNote: '✅ Mild swelling is normal and will reduce in 3-5 days. Apply ice pack (20 min on, 20 min off).',
            },
            {
                label: 'Increasing after 48h',
                severity: 'YELLOW',
                action: 'Suspect infection. Start/upgrade antibiotics. Consider drainage if fluctuant.',
                patientNote: '⚠️ Increasing swelling after 48 hours may indicate infection. Please visit the clinic today.',
            },
            {
                label: 'Rapid, spreading to neck/eye',
                severity: 'RED',
                action: '🚨 FASCIAL SPACE INFECTION: Immediate hospitalization. IV antibiotics. CT scan. Surgical drainage.',
                patientNote: '🚨 EMERGENCY: Swelling spreading to neck or eye is a medical emergency. Go to the nearest hospital IMMEDIATELY.',
            },
        ],
    },
    {
        id: 'bleeding',
        symptom: 'Bleeding',
        icon: <Droplets className="w-5 h-5" />,
        question: 'Describe the bleeding:',
        options: [
            {
                label: 'Slight oozing, controlled by gauze',
                severity: 'GREEN',
                action: 'Normal. Instruct patient on gauze pressure technique (30 min). Avoid hot foods.',
                patientNote: '✅ Slight oozing is normal. Bite firmly on gauze pad for 30 minutes. Avoid hot food and spitting.',
            },
            {
                label: 'Persistent despite gauze',
                severity: 'YELLOW',
                action: 'Apply Surgicel / Gelfoam. Consider sutures. Check INR if on anticoagulants.',
                patientNote: '⚠️ If bleeding does not stop with gauze pressure, please come to the clinic. Use a cold tea bag if available.',
            },
            {
                label: 'Heavy, uncontrolled bleeding',
                severity: 'RED',
                action: '🚨 HEMORRHAGE: Suture immediately. Check coagulation profile. Tranexamic acid. Hematology consult if on anticoagulants.',
                patientNote: '🚨 EMERGENCY: Apply firm pressure and come to the clinic IMMEDIATELY. If heavy, go to nearest emergency room.',
            },
        ],
    },
    {
        id: 'fever',
        symptom: 'Fever',
        icon: <ThermometerSun className="w-5 h-5" />,
        question: 'What is the patient\'s temperature?',
        options: [
            {
                label: '< 100°F (37.8°C)',
                severity: 'GREEN',
                action: 'Low-grade fever expected post-surgery. Continue current medications. Hydration.',
                patientNote: '✅ Mild temperature rise is normal. Stay hydrated and take Paracetamol if needed.',
            },
            {
                label: '100-102°F (37.8-38.9°C)',
                severity: 'YELLOW',
                action: 'Possible infection developing. Add/upgrade antibiotics. Monitor closely for 24h.',
                patientNote: '⚠️ Moderate fever suggests possible infection. Take prescribed antibiotics and call clinic if fever persists.',
            },
            {
                label: '> 102°F (38.9°C)',
                severity: 'RED',
                action: '🚨 HIGH FEVER: Active infection. Blood culture recommended. Switch to IV antibiotics. Consider hospitalization.',
                patientNote: '🚨 High fever after dental procedure needs urgent attention. Please visit the clinic or emergency room today.',
            },
        ],
    },
    {
        id: 'numbness',
        symptom: 'Numbness / Paresthesia',
        icon: <ShieldAlert className="w-5 h-5" />,
        question: 'Is the patient experiencing persistent numbness?',
        options: [
            {
                label: 'Normal anesthesia wearing off (< 6h)',
                severity: 'GREEN',
                action: 'Normal. LA effects last 2-6 hours. Advise patient to avoid biting lips/cheeks.',
                patientNote: '✅ Numbness from anesthesia is normal and will wear off in a few hours. Be careful not to bite your lip.',
            },
            {
                label: 'Numbness > 24 hours',
                severity: 'YELLOW',
                action: 'Possible nerve bruising. Start Vitamin B complex. Monitor for 4 weeks. Document.',
                patientNote: '⚠️ Extended numbness may happen sometimes. Start Vitamin B complex tablets. It usually resolves in 4-8 weeks.',
            },
            {
                label: 'Complete numbness > 1 week',
                severity: 'RED',
                action: '🚨 NERVE INJURY: Document thoroughly. Refer to oral surgeon / neurologist. Start Prednisolone tapering.',
                patientNote: '🚨 Persistent numbness beyond a week needs specialist evaluation. Please visit the clinic for a referral.',
            },
        ],
    },
];

// ============================================================================
// SEVERITY STYLES
// ============================================================================

const severityStyles: Record<Severity, { bg: string; text: string; border: string; badge: string }> = {
    GREEN: {
        bg: 'bg-emerald-50 dark:bg-emerald-950/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        badge: 'bg-emerald-100 text-emerald-700',
    },
    YELLOW: {
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        badge: 'bg-amber-100 text-amber-700',
    },
    RED: {
        bg: 'bg-red-50 dark:bg-red-950/20',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        badge: 'bg-red-100 text-red-700',
    },
};

// ============================================================================
// COMPONENT
// ============================================================================

interface AssessmentResult {
    symptom: string;
    severity: Severity;
    action: string;
    patientNote: string;
}

export function ComplicationBot() {
    const procedures = useCockpitStore(s => s.procedures);
    const patient = useCockpitStore(s => s.patient);

    const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
    const [results, setResults] = useState<AssessmentResult[]>([]);
    const [showWhatsApp, setShowWhatsApp] = useState(false);

    // Get procedure-specific red flags from POST_OP_PROTOCOLS
    const redFlags = useMemo(() => {
        const flags: string[] = [];
        procedures.forEach(proc => {
            const protocol = POST_OP_PROTOCOLS.get(proc.code);
            if (protocol?.redFlags) {
                flags.push(...protocol.redFlags);
            }
        });
        return [...new Set(flags)];
    }, [procedures]);

    const activeNode = COMPLICATION_TREE.find(n => n.id === activeNodeId);

    const handleOptionSelect = (node: ComplicationNode, optionIndex: number) => {
        const option = node.options[optionIndex];
        setResults(prev => [...prev, {
            symptom: node.symptom,
            severity: option.severity,
            action: option.action,
            patientNote: option.patientNote,
        }]);

        if (option.nextNodeId) {
            setActiveNodeId(option.nextNodeId);
        } else {
            setActiveNodeId(null);
        }
    };

    const handleReset = () => {
        setResults([]);
        setActiveNodeId(null);
        setShowWhatsApp(false);
    };

    const generateWhatsAppMessage = () => {
        const lines = [
            `📋 *Post-Op Instructions*`,
            `Patient: ${patient?.name || 'Patient'}`,
            `Date: ${new Date().toLocaleDateString()}`,
            '',
        ];

        results.forEach(r => {
            lines.push(`*${r.symptom}:* ${r.patientNote}`);
            lines.push('');
        });

        if (redFlags.length > 0) {
            lines.push('🚩 *Watch for these Red Flags:*');
            redFlags.forEach(f => lines.push(`  • ${f}`));
            lines.push('');
        }

        lines.push(`📞 *Noble Dental Emergency:* Call us immediately if symptoms worsen.`);
        return lines.join('\n');
    };

    const overallSeverity: Severity = results.some(r => r.severity === 'RED') ? 'RED'
        : results.some(r => r.severity === 'YELLOW') ? 'YELLOW' : 'GREEN';

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-rose-500" /> Post-Op Complication Assessment
                </h3>
                {results.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1 text-slate-400">
                        <RotateCcw className="w-3 h-3" /> Reset
                    </Button>
                )}
            </div>

            {/* Red Flags from Protocols */}
            {redFlags.length > 0 && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3" /> Procedure-Specific Red Flags
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {redFlags.map((flag, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] border-red-200 text-red-600 bg-red-50">
                                {flag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Symptom Selector (when not in assessment) */}
            {!activeNode && results.length === 0 && (
                <div>
                    <p className="text-xs text-slate-500 mb-3">Select the symptom to assess:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {COMPLICATION_TREE.filter(n => !['pain_duration'].includes(n.id)).map(node => (
                            <button
                                key={node.id}
                                onClick={() => setActiveNodeId(node.id)}
                                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left group"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="text-slate-400 group-hover:text-rose-500 transition-colors">
                                        {node.icon}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{node.symptom}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Assessment Question */}
            <AnimatePresence mode="wait">
                {activeNode && (
                    <motion.div
                        key={activeNode.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                            {activeNode.icon}
                            {activeNode.question}
                        </div>
                        <div className="space-y-2">
                            {activeNode.options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleOptionSelect(activeNode, i)}
                                    className={cn(
                                        "w-full p-3 rounded-lg border text-left transition-all hover:shadow-md flex items-center justify-between group",
                                        severityStyles[opt.severity].bg,
                                        severityStyles[opt.severity].border
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Badge className={cn("text-[9px] font-bold min-w-[3rem] justify-center", severityStyles[opt.severity].badge)}>
                                            {opt.severity}
                                        </Badge>
                                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{opt.label}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                        {/* Back to symptom selector */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveNodeId(null)}
                            className="text-xs text-slate-400"
                        >
                            ← Add another symptom
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Summary */}
            {results.length > 0 && !activeNode && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                >
                    {/* Overall Severity Banner */}
                    <div className={cn(
                        "p-3 rounded-lg border flex items-center justify-between",
                        severityStyles[overallSeverity].bg,
                        severityStyles[overallSeverity].border
                    )}>
                        <div className="flex items-center gap-2">
                            {overallSeverity === 'RED' ? <AlertTriangle className="w-5 h-5 text-red-600" /> :
                                overallSeverity === 'YELLOW' ? <Clock className="w-5 h-5 text-amber-600" /> :
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                            <span className={cn("text-sm font-bold", severityStyles[overallSeverity].text)}>
                                {overallSeverity === 'RED' ? 'URGENT: Immediate attention required' :
                                    overallSeverity === 'YELLOW' ? 'CAUTION: Monitor closely' :
                                        'Normal post-op recovery'}
                            </span>
                        </div>
                        <Badge className={cn("text-[10px] font-bold", severityStyles[overallSeverity].badge)}>
                            {results.length} assessed
                        </Badge>
                    </div>

                    {/* Individual Results */}
                    {results.map((r, i) => (
                        <div key={i} className={cn(
                            "p-3 rounded-lg border",
                            severityStyles[r.severity].bg,
                            severityStyles[r.severity].border
                        )}>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className={cn("text-[9px]", severityStyles[r.severity].badge)}>{r.severity}</Badge>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{r.symptom}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                                <strong>Action:</strong> {r.action}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-500 italic">
                                {r.patientNote}
                            </p>
                        </div>
                    ))}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            size="sm"
                            onClick={() => setActiveNodeId(COMPLICATION_TREE[0].id)}
                            className="text-xs gap-1"
                            variant="outline"
                        >
                            <Activity className="w-3 h-3" /> Assess Another
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => setShowWhatsApp(!showWhatsApp)}
                            className="text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            <MessageSquare className="w-3 h-3" /> WhatsApp Instructions
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs gap-1 border-rose-200 text-rose-600 hover:bg-rose-50"
                        >
                            <Phone className="w-3 h-3" /> Call Patient
                        </Button>
                    </div>

                    {/* WhatsApp Message Preview */}
                    <AnimatePresence>
                        {showWhatsApp && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">
                                        WhatsApp-Ready Message
                                    </p>
                                    <pre className="text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono bg-white dark:bg-slate-800 rounded p-3 border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto">
                                        {generateWhatsAppMessage()}
                                    </pre>
                                    <Button
                                        size="sm"
                                        className="mt-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                                        onClick={() => {
                                            navigator.clipboard.writeText(generateWhatsAppMessage());
                                        }}
                                    >
                                        📋 Copy to Clipboard
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}
