/**
 * Clinical Visit History API — Per Patient
 * 
 * GET: Load all past visits for a patient (ordered by date DESC)
 * Returns full visit records + computed latestToothState overlay
 * 
 * Security: Requires can_view_clinical permission
 * Audit: All PII access logged
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, logAuditTrail } from '@/lib/server-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ patientId: string }> }
) {
    const { patientId } = await params;

    // SECURITY: Require clinical view permission
    const authResult = await requirePermission(request, 'can_view_clinical');

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const user = authResult;

    try {
        const supabase = getSupabaseAdmin();
        let visits: Record<string, any>[] = [];

        if (supabase) {
            // DURABLE: Fetch from Supabase
            const { data, error } = await supabase
                .from('clinical_visits')
                .select('*')
                .eq('patient_id', patientId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            visits = data || [];
        }

        // Compute latest tooth state by merging all visit tooth states (newest first)
        const latestToothState: Record<string, any> = {};
        for (const visit of [...visits].reverse()) {
            if (visit.tooth_state && typeof visit.tooth_state === 'object') {
                Object.assign(latestToothState, visit.tooth_state);
            }
        }

        // Compute latest active medications (from most recent visit)
        const latestMedications = visits[0]?.medications || [];

        // AUDIT: Log every PII access
        await logAuditTrail({
            userId: user.id,
            action: 'VIEW_CLINICAL_HISTORY',
            resource: `patient:${patientId}`,
            details: {
                visitCount: visits.length,
            },
            request,
            status: 'SUCCESS'
        });

        return NextResponse.json({
            success: true,
            data: {
                visits: visits.map(v => ({
                    id: v.id,
                    visitId: v.visit_id,
                    chiefComplaints: v.chief_complaints || [],
                    medications: v.medications || [],
                    vitals: v.vitals || [],
                    diagnoses: v.diagnoses || [],
                    procedures: v.procedures || [],
                    prescriptions: v.prescriptions || [],
                    toothState: v.tooth_state || {},
                    maternity: v.maternity,
                    anesthesiaLog: v.anesthesia_log,
                    warsScore: v.wars_score,
                    paeChecklist: v.pae_checklist,
                    postOpInstructions: v.post_op_instructions || '',
                    iopaCount: v.iopa_count || 0,
                    clinicalRiskScore: v.clinical_risk_score || 0,
                    createdAt: v.created_at,
                    createdBy: v.created_by,
                })),
                latestToothState,
                latestMedications,
            }
        });

    } catch (error) {
        await logAuditTrail({
            userId: user.id,
            action: 'VIEW_CLINICAL_HISTORY',
            resource: `patient:${patientId}`,
            request,
            status: 'FAILURE',
            error
        });

        console.error('Clinical history fetch error:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch clinical history',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
