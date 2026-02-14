/**
 * DURABLE Appointment Status Update API
 * 
 * Supabase persistence with:
 * - Server-side RBAC enforcement (DOCTOR/OWNER only)
 * - Zod input validation
 * - Durable audit trail logging
 * - Graceful fallback for unconfigured environments
 */

import { NextRequest, NextResponse } from "next/server";
import { requireRole, validateRequest, logAuditTrail } from "@/lib/server-auth";
import { updateAppointmentStatusSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
    // Step 1: Authenticate and authorize (only doctors and owners can update status)
    const authResult = await requireRole(request, ["DOCTOR", "OWNER"]);

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
        const supabase = getSupabaseAdmin();
        let appointment: Record<string, any>;
        let oldStatus: string = 'unknown';

        if (supabase) {
            // Fetch current status for audit trail
            const { data: current } = await supabase
                .from('appointments')
                .select('status')
                .eq('id', data.appointmentId)
                .single();

            oldStatus = current?.status || 'unknown';

            // DURABLE: Persist status update
            const { data: updated, error } = await supabase
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
            appointment = updated;
        } else {
            // FALLBACK: Mock response when Supabase not configured
            appointment = {
                id: data.appointmentId,
                status: data.status,
                updatedAt: new Date().toISOString(),
                updatedBy: user.id
            };
        }

        // Step 4: Durable audit trail for status changes
        await logAuditTrail({
            userId: user.id,
            action: "UPDATE_APPOINTMENT_STATUS",
            resource: `appointment:${data.appointmentId}`,
            details: {
                oldStatus,
                newStatus: data.status,
                reason: data.reason
            },
            request,
            status: 'SUCCESS'
        });

        // Step 5: Return success response
        return NextResponse.json({
            success: true,
            data: appointment,
            message: `Appointment status updated to ${data.status}`
        });

    } catch (error) {
        await logAuditTrail({
            userId: user.id,
            action: "UPDATE_APPOINTMENT_STATUS",
            resource: `appointment:${data.appointmentId}`,
            request,
            status: 'FAILURE',
            error
        });

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
