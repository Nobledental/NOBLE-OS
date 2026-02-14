/**
 * Example: Protected API Route for Clinical Notes
 * 
 * Demonstrates:
 * - Permission-based authorization
 * - Complex validation with nested objects
 * - PII handling best practices
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission, validateRequest, logAuditTrail } from "@/lib/server-auth";
import { createClinicalNoteSchema } from "@/lib/validations";

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
        // TODO: Replace with Supabase transaction
        /* Example implementation:
        const { data: note, error } = await supabase
            .from('clinical_notes')
            .insert({
                ...data,
                created_by: user.id,
                created_at: new Date().toISOString()
            })
            .select()
            .single();
            
        if (error) throw error;
        */

        // Mock response
        const note = {
            id: crypto.randomUUID(),
            ...data,
            createdBy: user.id,
            createdAt: new Date().toISOString()
        };

        // Audit log (critical for medical records)
        logAuditTrail(
            user.id,
            "CREATE_CLINICAL_NOTE",
            `patient:${data.patientId}`,
            {
                noteId: note.id,
                diagnosis: data.diagnosis,
                treatmentProvided: data.treatment
            }
        );

        return NextResponse.json({
            success: true,
            data: note,
            message: "Clinical note created successfully"
        });

    } catch (error) {
        console.error("Clinical note creation error:", error);

        return NextResponse.json(
            { error: "Internal Server Error", message: "Failed to create clinical note" },
            { status: 500 }
        );
    }
}
