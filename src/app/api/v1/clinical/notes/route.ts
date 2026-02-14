/**
 * SECURED Clinical Notes API Route
 * 
 * Changes from original:
 * - Added server-side RBAC (requires clinical permission)
 * - Added Zod validation for request body
 * - Added audit trail logging
 * - Replaced generic error with specific validation errors
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, validateRequest, logAuditTrail } from '@/lib/server-auth';
import { createClinicalNoteSchema } from '@/lib/validations';

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
        // TODO: Replace with actual Supabase insert
        /* Production code:
        const { data, error } = await supabase
            .from('clinical_notes')
            .insert({
                ...body,
                created_by: user.id,
                created_at: new Date().toISOString()
            })
            .select()
            .single();
            
        if (error) throw error;
        */

        // Mock response (preserves original behavior)
        console.log("Mock Saving Clinical Note:", body);

        const note = {
            id: crypto.randomUUID(),
            ...body,
            createdBy: user.id,
            created_at: new Date().toISOString()
        };

        // AUDIT: Log PII access for medical records compliance
        logAuditTrail(
            user.id,
            'CREATE_CLINICAL_NOTE',
            `patient:${body.patientId}`,
            {
                noteId: note.id,
                diagnosis: body.diagnosis,
                teethAffected: body.teethAffected
            }
        );

        return NextResponse.json({
            success: true,
            data: note
        });

    } catch (error) {
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
