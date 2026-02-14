/**
 * Example: Protected API Route for Appointment Status Updates
 * 
 * Demonstrates:
 * - Server-side RBAC enforcement
 * - Zod input validation
 * - Audit trail logging
 * - Proper error handling
 */

import { NextRequest, NextResponse } from "next/server";
import { requireRole, validateRequest, logAuditTrail } from "@/lib/server-auth";
import { updateAppointmentStatusSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
    // Step 1: Authenticate and authorize (only doctors and owners can update status)
    const authResult = await requireRole(request, ["DOCTOR", "OWNER"]);

    // If auth/authz failed, return error response
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const user = authResult;

    // Step 2: Validate request body
    const validationResult = await validateRequest(request, updateAppointmentStatusSchema);

    if (validationResult instanceof NextResponse) {
        return validationResult;
    }

    const data = validationResult;

    // Step 3: Business logic - update appointment status
    try {
        // TODO: Replace with actual Supabase call
        /* Example Supabase implementation:
        const { data: appointment, error } = await supabase
            .from('appointments')
            .update({ 
                status: data.status,
                updated_at: new Date().toISOString(),
                updated_by: user.id
            })
            .eq('id', data.appointmentId)
            .select()
            .single();
            
        if (error) throw error;
        */

        // Mock response for now
        const appointment = {
            id: data.appointmentId,
            status: data.status,
            updatedAt: new Date().toISOString(),
            updatedBy: user.id
        };

        // Step 4: Log audit trail for status changes
        logAuditTrail(
            user.id,
            "UPDATE_APPOINTMENT_STATUS",
            `appointment:${data.appointmentId}`,
            {
                oldStatus: "arrived", // Would come from database
                newStatus: data.status,
                reason: data.reason
            }
        );

        // Step 5: Return success response
        return NextResponse.json({
            success: true,
            data: appointment,
            message: `Appointment status updated to ${data.status}`
        });

    } catch (error) {
        console.error("Appointment status update error:", error);

        return NextResponse.json(
            {
                error: "Internal Server Error",
                message: "Failed to update appointment status"
            },
            { status: 500 }
        );
    }
}

// Prevent unauthorized methods
export async function GET() {
    return NextResponse.json(
        { error: "Method Not Allowed" },
        { status: 405, headers: { "Allow": "POST" } }
    );
}
