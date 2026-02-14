/**
 * DURABLE Clinical Notes API v1
 * 
 * Supabase persistence with:
 * - Server-side RBAC (requires clinical permission)
 * - Zod validation for request body
 * - Durable audit trail logging
 * - Graceful fallback for unconfigured environments
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, validateRequest, logAuditTrail } from '@/lib/server-auth';
import { createClinicalNoteSchema } from '@/lib/validations';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    // SECURITY: Require clinical access permission
    const authResult = await requirePermission(request, 'can_view_clinical');

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const user = authResult;

    // VALIDATION: Validate request body against schema
    const validationResult = await validateRequest(request, createClinicalNoteSchema);

    if (validationResult instanceof NextResponse) {
        return validationResult;
    }

    const body = validationResult;

    try {
        const supabase = getSupabaseAdmin();
        let note: Record<string, any>;

        if (supabase) {
            // DURABLE: Persist to Supabase
            const { data: inserted, error } = await supabase
                .from('clinical_notes')
                .insert({
                    ...body,
                    created_by: user.id,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            note = inserted;
        } else {
            // FALLBACK: Mock when Supabase not configured (dev/demo)
            note = {
                id: crypto.randomUUID(),
                ...body,
                createdBy: user.id,
                created_at: new Date().toISOString()
            };
        }

        // AUDIT: Durable PII access log for medical records compliance
        await logAuditTrail({
            userId: user.id,
            action: 'CREATE_CLINICAL_NOTE',
            resource: `patient:${body.patientId}`,
            details: {
                noteId: note.id,
                diagnosis: body.diagnosis,
                teethAffected: body.teethAffected
            },
            request,
            status: 'SUCCESS'
        });

        return NextResponse.json({
            success: true,
            data: note
        });

    } catch (error) {
        await logAuditTrail({
            userId: user.id,
            action: 'CREATE_CLINICAL_NOTE',
            resource: `patient:${body.patientId}`,
            request,
            status: 'FAILURE',
            error
        });

        console.error('Clinical note creation error:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create clinical note',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
