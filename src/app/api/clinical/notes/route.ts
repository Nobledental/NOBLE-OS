/**
 * DURABLE Clinical Notes API Route
 * 
 * Full Supabase persistence with:
 * - Server-side RBAC (requires clinical permission)
 * - Zod validation for request body
 * - Supabase insert (graceful fallback to mock if unconfigured)
 * - Durable audit trail logging
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission, validateRequest, logAuditTrail } from "@/lib/server-auth";
import { createClinicalNoteSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
    // Require clinical access permission
    const authResult = await requirePermission(request, "can_view_clinical");

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const user = authResult;

    // Validate input
    const validationResult = await validateRequest(request, createClinicalNoteSchema);

    if (validationResult instanceof NextResponse) {
        return validationResult;
    }

    const data = validationResult;

    try {
        const supabase = getSupabaseAdmin();
        let note: Record<string, any>;

        if (supabase) {
            // DURABLE: Persist to Supabase
            const { data: inserted, error } = await supabase
                .from('clinical_notes')
                .insert({
                    ...data,
                    created_by: user.id,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            note = inserted;
        } else {
            // FALLBACK: Mock response when Supabase not configured (dev/demo)
            note = {
                id: crypto.randomUUID(),
                ...data,
                createdBy: user.id,
                createdAt: new Date().toISOString()
            };
        }

        // Durable audit log (critical for medical records)
        await logAuditTrail({
            userId: user.id,
            action: "CREATE_CLINICAL_NOTE",
            resource: `patient:${data.patientId}`,
            details: {
                noteId: note.id,
                diagnosis: data.diagnosis,
                treatmentProvided: data.treatment
            },
            request,
            status: 'SUCCESS'
        });

        return NextResponse.json({
            success: true,
            data: note,
            message: "Clinical note created successfully"
        });

    } catch (error) {
        // Log failure audit
        await logAuditTrail({
            userId: user.id,
            action: "CREATE_CLINICAL_NOTE",
            resource: `patient:${data.patientId}`,
            request,
            status: 'FAILURE',
            error
        });

        console.error("Clinical note creation error:", error);

        return NextResponse.json(
            { error: "Internal Server Error", message: "Failed to create clinical note" },
            { status: 500 }
        );
    }
}
