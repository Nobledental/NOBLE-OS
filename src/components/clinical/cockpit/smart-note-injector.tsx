'use client';

/**
 * Smart Note Injector
 * 
 * Auto-generates clinical notes based on:
 * 1. Selected procedures (from cockpit-store's SMART_NOTE_TEMPLATES)
 * 2. Patient context (age, gender, diagnoses)
 * 3. Tooth numbers
 * 
 * Doctor can edit, append, or use voice-to-text (reusing existing consultation.tsx logic).
 * Notes follow IDA case sheet format for legal compliance.
 * 
 * Integrates:
 * - SMART_NOTE_TEMPLATES from cockpit-store
 * - getProtocol from postop-protocols.ts
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Wand2, Copy, CheckCircle2,
    ClipboardList, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    useCockpitStore,
    SMART_NOTE_TEMPLATES,
} from '@/lib/clinical-cockpit-store';
import {
    POST_OP_PROTOCOLS,
} from '@/lib/postop-protocols';

export function SmartNoteInjector() {
    const patient = useCockpitStore(s => s.patient);
    const procedures = useCockpitStore(s => s.procedures);
    const diagnoses = useCockpitStore(s => s.diagnoses);
    const anesthesiaLog = useCockpitStore(s => s.anesthesiaLog);
    const vitals = useCockpitStore(s => s.vitals);
    const chiefComplaints = useCockpitStore(s => s.chiefComplaints);
    const warsScore = useCockpitStore(s => s.warsScore);

    const [editableNote, setEditableNote] = useState('');
    const [noteGenerated, setNoteGenerated] = useState(false);
    const [copied, setCopied] = useState(false);

    // Auto-generate comprehensive clinical note
    const generateNote = useCallback(() => {
        if (!patient) return;

        const lines: string[] = [];
        const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        // Header
        lines.push(`CLINICAL NOTE — ${now}`);
        lines.push(`Patient: ${patient.name} | ${patient.age}y ${patient.gender} | ${patient.phone}`);
        if (patient.bloodGroup) lines.push(`Blood Group: ${patient.bloodGroup}`);
        lines.push('');

        // Chief Complaints
        if (chiefComplaints.length > 0) {
            lines.push('CHIEF COMPLAINTS:');
            chiefComplaints.forEach(c => lines.push(`• ${c.label}`));
            lines.push('');
        }

        // Vitals
        const preOpVitals = vitals.find(v => v.type === 'PRE_OP');
        if (preOpVitals) {
            lines.push('VITALS (Pre-Op):');
            lines.push(`• BP: ${preOpVitals.bpSystolic}/${preOpVitals.bpDiastolic} mmHg`);
            lines.push(`• HR: ${preOpVitals.heartRate} bpm | SpO₂: ${preOpVitals.spo2}%`);
            lines.push(`• Temp: ${preOpVitals.temperature}°F | RR: ${preOpVitals.respiratoryRate}/min`);
            lines.push('');
        }

        // Diagnoses
        if (diagnoses.length > 0) {
            lines.push('DIAGNOSIS:');
            diagnoses.forEach(d => {
                lines.push(`• ${d.diagnosis} [${d.icdCode}] — ${d.isProvisional ? 'Provisional' : 'Confirmed'}`);
            });
            lines.push('');
        }

        // WARS if present
        if (warsScore) {
            lines.push('WARS ASSESSMENT:');
            lines.push(`• Winter's: ${warsScore.wintersClass} | Pell & Gregory: Class ${warsScore.pellGregoryClass} Position ${warsScore.pellGregoryPosition}`);
            lines.push(`• Difficulty: ${warsScore.difficultyGrade}`);
            lines.push('');
        }

        // Procedures with smart templates
        if (procedures.length > 0) {
            lines.push('PROCEDURES:');
            procedures.forEach(proc => {
                lines.push(`— ${proc.name} [${proc.status}]`);
                const teeth = proc.toothNumbers.length > 0 ? proc.toothNumbers.join(', ') : '#___';
                lines.push(`  Teeth: ${teeth}`);

                // Find smart note template (SMART_NOTE_TEMPLATES is Record<string, string>)
                const templateNote = SMART_NOTE_TEMPLATES[proc.code];
                if (templateNote) {
                    let note = templateNote;
                    note = note.replace(/#___/g, teeth);
                    lines.push(`  Note: ${note}`);
                }
            });
            lines.push('');
        }

        // Anesthesia
        if (anesthesiaLog) {
            lines.push('ANESTHESIA:');
            lines.push(`• ${anesthesiaLog.drugType.replace(/_/g, ' ')} ${anesthesiaLog.concentration}`);
            if (anesthesiaLog.adrenalineRatio) lines.push(`• Adrenaline: ${anesthesiaLog.adrenalineRatio}`);
            lines.push(`• Dosage: ${anesthesiaLog.dosage} | Block: ${anesthesiaLog.blockType}`);
            lines.push('');
        }

        // Post-op instructions (from existing postop-protocols.ts)
        const completedProcs = procedures.filter(p => p.status === 'COMPLETED');
        if (completedProcs.length > 0) {
            lines.push('POST-OP INSTRUCTIONS:');
            completedProcs.forEach(proc => {
                // POST_OP_PROTOCOLS is a Map<string, PostOpProtocol>
                // Keys may differ from our proc codes (e.g. 'EXTRACTION' vs 'SIMPLE_EXTRACTION')
                const codeVariants = [proc.code, proc.code.replace('SIMPLE_', ''), proc.code.replace('_PLACEMENT', '')];
                let protocol = null;
                for (const variant of codeVariants) {
                    protocol = POST_OP_PROTOCOLS.get(variant);
                    if (protocol) break;
                }
                if (protocol) {
                    lines.push(`— For ${proc.name}:`);
                    if (protocol.redFlags?.length) {
                        lines.push('  ⚠️ Red Flags to Watch:');
                        protocol.redFlags.forEach(flag => lines.push(`    • ${flag}`));
                    }
                    if (protocol.prescriptionDefaults?.length) {
                        lines.push('  💊 Recommended:');
                        protocol.prescriptionDefaults.forEach(rx => lines.push(`    • ${rx}`));
                    }
                }
            });
            lines.push('');
        }

        lines.push('---');
        lines.push('Electronically signed via Noble OS Clinical Cockpit');

        const note = lines.join('\n');
        setEditableNote(note);
        setNoteGenerated(true);
    }, [patient, chiefComplaints, vitals, diagnoses, procedures, anesthesiaLog, warsScore]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(editableNote);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [editableNote]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" /> Smart Clinical Note
                </h3>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={generateNote}
                        className="text-xs"
                    >
                        <Wand2 className="w-3.5 h-3.5 mr-1" />
                        {noteGenerated ? 'Regenerate' : 'Auto-Generate'}
                    </Button>
                    {noteGenerated && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            className={cn('text-xs', copied && 'bg-emerald-50 text-emerald-600 border-emerald-200')}
                        >
                            {copied ? <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                    )}
                </div>
            </div>

            {!noteGenerated ? (
                <div className="text-center py-8 text-sm text-slate-400">
                    <ClipboardList className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Click "Auto-Generate" to create a comprehensive clinical note
                    <br />
                    <span className="text-[11px]">
                        based on complaints, vitals, diagnoses, procedures, and post-op instructions.
                    </span>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <textarea
                        value={editableNote}
                        onChange={e => setEditableNote(e.target.value)}
                        className="w-full min-h-[400px] text-xs font-mono leading-relaxed rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-4 resize-y"
                    />
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] text-slate-400">
                            {editableNote.split('\n').length} lines · {editableNote.length} characters
                        </span>
                        <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200">
                            Editable — modify as needed
                        </Badge>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
