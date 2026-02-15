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
 * 
 * DURABLE: All 3 action buttons are now wired:
 * - Mark Consultation Done → saveVisit() to API + mark done
 * - Print Rx → open print-ready prescription popup
 * - Generate Bill → push procedures to billing store
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2, Printer, CreditCard, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useCockpitStore } from '@/lib/clinical-cockpit-store';
import { useBillingStore } from '@/lib/billing-store';
import { VitalsRecorder } from './vitals-recorder';
import { PrescriptionEngine } from './prescription-engine';
import { SmartNoteInjector } from './smart-note-injector';
import { ComplicationBot } from './complication-bot';

export function PostOpPanel() {
    const procedures = useCockpitStore(s => s.procedures);
    const prescriptions = useCockpitStore(s => s.prescriptions);
    const patient = useCockpitStore(s => s.patient);
    const markConsultationDone = useCockpitStore(s => s.markConsultationDone);
    const saveVisit = useCockpitStore(s => s.saveVisit);
    const consultationMarkedDone = useCockpitStore(s => s.consultationMarkedDone);
    const isSaving = useCockpitStore(s => s.isSaving);

    const [isCompleting, setIsCompleting] = useState(false);

    const completedCount = procedures.filter(p => p.status === 'COMPLETED').length;
    const totalCount = procedures.length;

    // DURABLE: Save visit + mark done
    const handleMarkDone = useCallback(async () => {
        setIsCompleting(true);
        try {
            await saveVisit();
            markConsultationDone();
            toast.success('Visit saved & consultation marked complete');
        } catch {
            toast.error('Failed to save visit — data retained locally');
        } finally {
            setIsCompleting(false);
        }
    }, [saveVisit, markConsultationDone]);

    // Print Rx: Open a print-ready prescription in new window
    const handlePrintRx = useCallback(() => {
        if (prescriptions.length === 0) {
            toast.error('No prescriptions to print');
            return;
        }

        const rxHTML = `
            <!DOCTYPE html>
            <html><head>
                <title>Prescription — ${patient?.name || 'Patient'}</title>
                <style>
                    body { font-family: 'Segoe UI', system-ui, sans-serif; max-width: 700px; margin: 40px auto; padding: 20px; }
                    h1 { font-size: 18px; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; color: #1e293b; }
                    .patient { font-size: 13px; color: #64748b; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
                    th, td { padding: 8px 12px; border: 1px solid #e2e8f0; text-align: left; font-size: 13px; }
                    th { background: #f8fafc; font-weight: 600; color: #334155; }
                    .footer { margin-top: 40px; text-align: right; font-size: 12px; color: #94a3b8; }
                    .sig { margin-top: 60px; border-top: 1px solid #cbd5e1; padding-top: 8px; font-size: 13px; }
                    @media print { body { margin: 0; } }
                </style>
            </head><body>
                <h1>℞ Noble Dental — Prescription</h1>
                <div class="patient">
                    <strong>${patient?.name || ''}</strong> · ${patient?.age || ''}y / ${patient?.gender || ''} · ${patient?.phone || ''}<br/>
                    Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <table>
                    <thead><tr><th>#</th><th>Medication</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr></thead>
                    <tbody>
                        ${prescriptions.map((rx, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${rx.name}</td>
                                <td>${rx.dosage}</td>
                                <td>${rx.frequency}</td>
                                <td>${rx.duration || '—'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="sig">Doctor's Signature</div>
                <div class="footer">Printed from Noble Dental OS · ${new Date().toISOString()}</div>
                <script>window.onload = () => window.print();</script>
            </body></html>
        `;

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.write(rxHTML);
            printWindow.document.close();
        }
        toast.success('Prescription opened for printing');
    }, [prescriptions, patient]);

    // Generate Bill: Push completed procedures to billing store
    const handleGenerateBill = useCallback(() => {
        const completed = procedures.filter(p => p.status === 'COMPLETED');
        if (completed.length === 0) {
            toast.error('No completed procedures to bill');
            return;
        }

        const billingStore = useBillingStore.getState();
        if (billingStore && typeof billingStore.addItem === 'function') {
            completed.forEach(proc => {
                billingStore.addItem({
                    name: proc.name,
                    baseCost: 0, // Default to 0, requires manual pricing
                    taxRate: 0,
                    quantity: 1,
                    metadata: {
                        source: 'auto_clinical',
                        procedureId: proc.id,
                        category: proc.category,
                        teethTreated: proc.toothNumbers,
                        completedAt: new Date().toISOString()
                    }
                });
            });
            toast.success(`${completed.length} procedure(s) sent to billing`);
        } else {
            // Fallback if billing store doesn't have addItems
            toast.info(`${completed.length} procedure(s) ready for billing — billing module will pick up from visit record`);
        }
    }, [procedures]);

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
                    onClick={handleMarkDone}
                    disabled={consultationMarkedDone || isCompleting || isSaving}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl gap-2"
                >
                    {(isCompleting || isSaving) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <CheckCircle2 className="w-4 h-4" />
                    )}
                    {consultationMarkedDone ? 'Visit Saved ✓' : isCompleting ? 'Saving Visit...' : 'Complete & Save'}
                </Button>
                <Button
                    variant="outline"
                    onClick={handlePrintRx}
                    className="h-12 rounded-xl text-xs font-bold uppercase tracking-widest gap-2"
                >
                    <Printer className="w-4 h-4" /> Print Rx
                </Button>
                <Button
                    variant="outline"
                    onClick={handleGenerateBill}
                    className="h-12 rounded-xl text-xs font-bold uppercase tracking-widest gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                    <CreditCard className="w-4 h-4" /> Generate Bill
                </Button>
            </motion.div>
        </div>
    );
}
