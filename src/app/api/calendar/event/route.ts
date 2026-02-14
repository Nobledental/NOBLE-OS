/**
 * SECURED Calendar Event Creation API
 * 
 * Changes from original:
 * - Added authentication requirement
 * - Added Zod validation for event data
 * - Improved error handling
 * - Added audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';
import { requireAuth, validateRequest, logAuditTrail, ROLE_PERMISSIONS } from '@/lib/server-auth';
import { z } from 'zod';

// Validation schema for calendar event creation
const createEventSchema = z.object({
    summary: z.string().min(1, 'Event title is required').max(200),
    description: z.string().max(1000).optional(),
    start: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)),
    durationMinutes: z.number().int().min(15).max(480).default(30),
    googleMeet: z.boolean().optional(),
    location: z.string().max(500).optional()
});

export async function POST(request: NextRequest) {
    // SECURITY: Require authentication
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const user = authResult;

    // SECURITY: Require permission to create appointments
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    if (!rolePermissions.includes('can_create_appointments')) {
        return NextResponse.json(
            {
                error: 'Forbidden',
                message: 'You don\'t have permission to create calendar events',
                role: user.role
            },
            { status: 403 }
        );
    }

    // VALIDATION: Validate request body
    const validationResult = await validateRequest(request, createEventSchema);

    if (validationResult instanceof NextResponse) {
        return validationResult;
    }

    const { summary, description, start, durationMinutes, googleMeet, location } = validationResult;

    try {
        const calendarService = new GoogleCalendarService();

        // Parse start time - if no timezone specified, assume Asia/Kolkata (IST +05:30)
        const startTime = new Date(
            start.includes('Z') || start.includes('+')
                ? start
                : `${start}+05:30`
        );

        const endTime = new Date(startTime.getTime() + durationMinutes! * 60000);

        const event = await calendarService.createEvent({
            summary,
            description,
            start: { dateTime: startTime.toISOString() },
            end: { dateTime: endTime.toISOString() },
            meetLink: googleMeet,
            location
        });

        // AUDIT: Log calendar event creation
        logAuditTrail(
            user.id,
            'CREATE_CALENDAR_EVENT',
            'calendar',
            {
                eventId: event.id,
                summary,
                start: startTime.toISOString(),
                duration: durationMinutes
            }
        );

        return NextResponse.json({ success: true, event });

    } catch (error: any) {
        console.error('Create Event Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to create calendar event',
                message: error.message
            },
            { status: 500 }
        );
    }
}
