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

    // ATOMIC VALIDATION: Duration must be multiple of 15
    if (durationMinutes! % 15 !== 0) {
        return NextResponse.json(
            { error: 'Invalid Duration', message: 'Duration must be a multiple of 15 minutes.' },
            { status: 400 }
        );
    }

    try {
        const calendarService = new GoogleCalendarService();

        // TIMEZONE LOCKING: Explicitly force Asia/Kolkata
        // Note: The incoming 'start' is an ISO string. We trust the date/time value but force the zone.
        const startTime = new Date(start);
        const endTime = new Date(startTime.getTime() + durationMinutes! * 60000);

        // CONFERENCE DATA LOGIC
        const eventPayload: any = {
            summary,
            description,
            start: {
                dateTime: startTime.toISOString(),
                timeZone: 'Asia/Kolkata'
            },
            end: {
                dateTime: endTime.toISOString(),
                timeZone: 'Asia/Kolkata'
            },
            location
        };

        if (googleMeet) {
            eventPayload.conferenceData = {
                createRequest: {
                    requestId: `meet-${Date.now()}-${crypto.randomUUID()}`,
                    conferenceSolutionKey: { type: 'hangoutsMeet' }
                }
            };
        }

        const event = await calendarService.createEvent(eventPayload);

        // AUDIT: Log calendar event creation with SAAS MULTI-TENANCY context
        const clinicId = user.clinicId || 'global'; // Fallback if not strictly enforced yet

        logAuditTrail(
            user.id,
            'CREATE_CALENDAR_EVENT',
            'calendar',
            {
                eventId: event.id,
                summary,
                start: startTime.toISOString(),
                duration: durationMinutes,
                clinicId,
                hangoutLink: event.hangoutLink
            }
        );

        return NextResponse.json({
            success: true,
            event: {
                ...event,
                hangoutLink: event.hangoutLink
            }
        });

    } catch (error: any) {
        console.error('Create Event Error:', error);

        // ERROR MAPPING: 401 vs 403
        if (error.code === 401 || error.message?.includes('invalid_grant')) {
            return NextResponse.json(
                { error: 'Token Expired', message: 'Google Calendar token expired. Please re-authenticate.' },
                { status: 401 }
            );
        }

        if (error.code === 403) {
            return NextResponse.json(
                { error: 'Rate Limit', message: 'Google Calendar rate limit exceeded. Try again later.' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            {
                error: 'Failed to create calendar event',
                message: error.message
            },
            { status: 500 }
        );
    }
}
