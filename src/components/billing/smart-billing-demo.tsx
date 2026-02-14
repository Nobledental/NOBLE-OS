/**
 * Demo Component: Demonstrates Smart Billing with Sample Treatments
 * 
 * This component allows testing the automated billing workflow
 * Shows how treatments marked as "done" automatically generate billing
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PanzeCard } from "@/components/ui/panze-card";
import { Check, X, Play, Sparkles } from "lucide-react";
import { useTreatmentStore } from "@/lib/treatment-store";
import { useBillingStore } from "@/lib/billing-store";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Sample treatments for demo
const SAMPLE_TREATMENTS = [
    {
        procedure: { id: 'consultation', name: 'General Dental Consultation', category: 'diagnostic' as const },
        teethAffected: [],
        isMultiSession: false,
        notes: 'Routine check-up and oral exam'
    },
    {
        procedure: { id: 'scaling_full', name: 'Full Mouth Scaling & Polishing', category: 'preventive' as const },
        teethAffected: [],
        isMultiSession: false,
        notes: 'Deep cleaning with ultrasonic scaler'
    },
    {
        procedure: { id: 'crown_zirconia', name: 'Zirconia Crown', category: 'prosthodontic' as const },
        teethAffected: [11, 21],
        isMultiSession: true,
        sessionNumber: 2,
        totalSessions: 2,
        notes: 'Crown cementation after tooth preparation'
    },
    {
        procedure: { id: 'iopa', name: 'IOPA X-Ray', category: 'diagnostic' as const },
        teethAffected: [36, 37],
        isMultiSession: false,
        notes: 'Digital radiograph for lower right molars'
    }
];

export function SmartBillingDemo() {
    const [demoStep, setDemoStep] = useState(0);
    const addTreatment = useTreatmentStore(state => state.addTreatment);
    const markAsCompleted = useTreatmentStore(state => state.markAsCompleted);
    const treatments = useTreatmentStore(state => state.treatments);
    const autoItems = useBillingStore(state => state.autoItems);

    const startDemo = () => {
        // Clear existing demo data
        useTreatmentStore.setState({ treatments: [] });
        useBillingStore.getState().clearItems();

        // Add all sample treatments as "planned"
        const demoAppointmentId = 'demo_appt_001';
        const demoPatientId = 'p1';
        const demoDoctorId = 'd1';

        SAMPLE_TREATMENTS.forEach(sample => {
            addTreatment({
                appointmentId: demoAppointmentId,
                patientId: demoPatientId,
                doctorId: demoDoctorId,
                procedure: sample.procedure,
                teethAffected: sample.teethAffected,
                status: 'planned',
                notes: sample.notes,
                isMultiSession: sample.isMultiSession,
                sessionNumber: sample.sessionNumber,
                totalSessions: sample.totalSessions
            });
        });

        setDemoStep(1);
        toast.success('Demo treatments created!', {
            description: `${SAMPLE_TREATMENTS.length} treatments added to clinical queue`
        });
    };

    const completeNextTreatment = () => {
        const pending = treatments.filter(t => t.status === 'planned');

        if (pending.length === 0) {
            toast.info('All treatments completed!');
            setDemoStep(3);
            return;
        }

        const next = pending[0];
        markAsCompleted(next.id);

        toast.success('Treatment marked as done!', {
            description: `${next.procedure.name} auto-added to billing`
        });

        setDemoStep(2);
    };

    const resetDemo = () => {
        useTreatmentStore.setState({ treatments: [] });
        useBillingStore.getState().clearItems();
        setDemoStep(0);
        toast.info('Demo reset');
    };

    const pendingCount = treatments.filter(t => t.status === 'planned').length;
    const completedCount = treatments.filter(t => t.status === 'completed').length;

    return (
        <PanzeCard className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase text-green-900">Smart Billing Demo</h3>
                        <p className="text-xs text-green-700">Test automated billing workflow</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetDemo}
                    className="text-xs text-green-700 hover:bg-green-100"
                >
                    <X className="w-3 h-3 mr-1" />
                    Reset
                </Button>
            </div>

            {/* Progress Indicators */}
            <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-black text-green-600">{treatments.length}</div>
                    <div className="text-green-700 font-semibold mt-1">Total</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
                    <div className="text-amber-700 font-semibold mt-1">Pending</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-black text-purple-600">{autoItems.length}</div>
                    <div className="text-purple-700 font-semibold mt-1">Billed</div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                {demoStep === 0 && (
                    <Button
                        onClick={startDemo}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
                    >
                        <Play className="w-4 h-4 mr-2" />
                        Start Demo
                    </Button>
                )}

                {demoStep >= 1 && pendingCount > 0 && (
                    <Button
                        onClick={completeNextTreatment}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold"
                    >
                        <Check className="w-4 h-4 mr-2" />
                        Mark Next Treatment Done ({pendingCount} left)
                    </Button>
                )}

                {demoStep === 3 && (
                    <div className="flex-1 bg-green-100 border-2 border-green-300 rounded-lg p-3 text-center">
                        <p className="text-sm font-black text-green-900">✅ Demo Complete!</p>
                        <p className="text-xs text-green-700 mt-1">Check Auto-Generated tab to see all {autoItems.length} items</p>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="text-xs text-green-800 bg-white/60 rounded-lg p-3 leading-relaxed">
                <p className="font-semibold mb-2">📋 Demo Workflow:</p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Click "Start Demo" to create sample treatments</li>
                    <li>Click "Mark Next Treatment Done" to simulate doctor completing work</li>
                    <li>Watch items automatically appear in "Auto-Generated" tab</li>
                    <li>Notice per-tooth calculations (e.g., 2 crowns = ₹16,000)</li>
                </ol>
            </div>
        </PanzeCard>
    );
}
