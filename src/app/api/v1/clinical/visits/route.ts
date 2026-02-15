/**
 * DURABLE Clinical Visits API
 * 
 * Full cockpit snapshot persistence:
 * - POST: Save entire cockpit state as a clinical visit record
 * - Server-side RBAC (requires can_start_consultation permission)
 * - Zod validation for the full visit payload
 * - Supabase insert (graceful fallback to mock if unconfigured)
 * - Durable audit trail logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, validateRequest, logAuditTrail } from '@/lib/server-auth';
import { createClinicalVisitSchema } from '@/lib/validations';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    // SECURITY: Require consultation permission
    const authResult = await requirePermission(request, 'can_start_consultation');

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const user = authResult;

    // VALIDATION: Validate full visit payload
    const validationResult = await validateRequest(request, createClinicalVisitSchema);

    if (validationResult instanceof NextResponse) {
        return validationResult;
    }

    const data = validationResult;

    try {
        const supabase = getSupabaseAdmin();
        let visit: Record<string, any>;

        if (supabase) {
            // DURABLE: Persist full cockpit snapshot to Supabase
            const { data: inserted, error } = await supabase
                .from('clinical_visits')
                .insert({
                    patient_id: data.patientId,
                    visit_id: data.visitId,
                    chief_complaints: data.chiefComplaints,
                    medications: data.medications,
                    vitals: data.vitals,
                    diagnoses: data.diagnoses,
                    procedures: data.procedures,
                    prescriptions: data.prescriptions,
                    tooth_state: data.toothState,
                    maternity: data.maternity || null,
                    anesthesia_log: data.anesthesiaLog || null,
                    wars_score: data.warsScore || null,
                    pae_checklist: data.paeChecklist || null,
                    post_op_instructions: data.postOpInstructions,
                    iopa_count: data.iopaCount,
                    clinical_risk_score: data.clinicalRiskScore,
                    created_by: user.id,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            visit = inserted;
        } else {
            // FALLBACK: Mock response when Supabase not configured (dev/demo)
            visit = {
                id: crypto.randomUUID(),
                patient_id: data.patientId,
                visit_id: data.visitId,
                chief_complaints: data.chiefComplaints,
                medications: data.medications,
                vitals: data.vitals,
                diagnoses: data.diagnoses,
                procedures: data.procedures,
                prescriptions: data.prescriptions,
                tooth_state: data.toothState,
                maternity: data.maternity || null,
                anesthesia_log: data.anesthesiaLog || null,
                wars_score: data.warsScore || null,
                pae_checklist: data.paeChecklist || null,
                post_op_instructions: data.postOpInstructions,
                iopa_count: data.iopaCount,
                clinical_risk_score: data.clinicalRiskScore,
                created_by: user.id,
                created_at: new Date().toISOString()
            };
        }

        // AUDIT: Durable log for medical visit records
        await logAuditTrail({
            userId: user.id,
            action: 'CREATE_CLINICAL_VISIT',
            resource: `patient:${data.patientId}`,
            details: {
                visitId: data.visitId,
                procedureCount: data.procedures.length,
                diagnosisCount: data.diagnoses.length,
                prescriptionCount: data.prescriptions.length,
                iopaCount: data.iopaCount,
                riskScore: data.clinicalRiskScore
            },
            request,
            status: 'SUCCESS'
        });

        return NextResponse.json({
            success: true,
            data: visit,
            message: 'Clinical visit saved successfully'
        });

    } catch (error) {
        await logAuditTrail({
            userId: user.id,
            action: 'CREATE_CLINICAL_VISIT',
            resource: `patient:${data.patientId}`,
            request,
            status: 'FAILURE',
            error
        });

        console.error('Clinical visit save error:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to save clinical visit',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
