'use client';

/**
 * Post-Op Panel
 * 
 * Final phase of the cockpit workflow. Combines:
 * 1. Post-op vitals recording
 * 2. Smart prescription generation
 * 3. Post-op instruction sheet
 * 4. Smart clinical note
 * 5. Session summary + billing trigger
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2, FileText, Printer, CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCockpitStore } from '@/lib/clinical-cockpit-store';
import { VitalsRecorder } from './vitals-recorder';
import { PrescriptionEngine } from './prescription-engine';
import { SmartNoteInjector } from './smart-note-injector';
import { ComplicationBot } from './complication-bot';

export function PostOpPanel() {
    const procedures = useCockpitStore(s => s.procedures);
    const markConsultationDone = useCockpitStore(s => s.markConsultationDone);
    const consultationMarkedDone = useCockpitStore(s => s.consultationMarkedDone);

    const completedCount = procedures.filter(p => p.status === 'COMPLETED').length;
    const totalCount = procedures.length;

    return (
        <div className="space-y-6">
            {/* Session Summary Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                            Session Summary
                        </h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                            {completedCount}/{totalCount} procedures completed
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {completedCount === totalCount && totalCount > 0 && (
                            <Badge className="bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> All Done
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Post-Op Vitals */}
            <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Post-Operative Vitals
                </h4>
                <VitalsRecorder type="POST_OP" />
            </div>

            {/* Prescription */}
            <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Prescription
                </h4>
                <PrescriptionEngine />
            </div>

            {/* Smart Clinical Note */}
            <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Clinical Note
                </h4>
                <SmartNoteInjector />
            </div>

            {/* Complication Assessment */}
            <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Post-Op Complication Check
                </h4>
                <ComplicationBot />
            </div>

            {/* Final Actions */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700"
            >
                <Button
                    onClick={markConsultationDone}
                    disabled={consultationMarkedDone}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl gap-2"
                >
                    <CheckCircle2 className="w-4 h-4" />
                    {consultationMarkedDone ? 'Consultation Completed' : 'Mark Consultation Done'}
                </Button>
                <Button
                    variant="outline"
                    className="h-12 rounded-xl text-xs font-bold uppercase tracking-widest gap-2"
                >
                    <Printer className="w-4 h-4" /> Print Rx
                </Button>
                <Button
                    variant="outline"
                    className="h-12 rounded-xl text-xs font-bold uppercase tracking-widest gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                    <CreditCard className="w-4 h-4" /> Generate Bill
                </Button>
            </motion.div>
        </div>
    );
}
