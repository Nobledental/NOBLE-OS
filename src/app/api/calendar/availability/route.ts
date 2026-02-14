import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleCalendarService } from '@/lib/google-calendar';
import { getISTStartOfDay, getISTEndOfDay } from '@/lib/timezone';
import { requireAuth, ROLE_PERMISSIONS } from '@/lib/server-auth';

// Zod schema for query parameter validation
const AvailabilityQuerySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    chairs: z.string().optional().transform(val => parseInt(val || '3', 10)),
    duration: z.string().optional().transform(val => parseInt(val || '30', 10)),
});

export async function GET(request: NextRequest) {
    // SECURITY: Require authentication
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const user = authResult;

    // SECURITY: Require calendar management permission (admin, receptionist, doctor)
    // Check if user has appointments permission (for viewing/managing calendar)
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    if (!rolePermissions.includes('can_create_appointments')) {
        return NextResponse.json(
            {
                error: 'Forbidden',
                message: 'You don\'t have permission to access calendar availability',
                role: user.role
            },
            { status: 403 }
        );
    }

    // Zod validation for query parameters
    const searchParams = request.nextUrl.searchParams;
    const rawQuery = {
        date: searchParams.get('date'),
        chairs: searchParams.get('chairs'),
        duration: searchParams.get('duration'),
    };

    const parseResult = AvailabilityQuerySchema.safeParse(rawQuery);

    if (!parseResult.success) {
        return NextResponse.json(
            { error: 'Invalid query parameters', details: parseResult.error.flatten() },
            { status: 400 }
        );
    }

    const { date, chairs: activeChairs, duration } = parseResult.data;

    console.log(`[Availability API] User=${user.email}, Date=${date}, Chairs=${activeChairs}, Duration=${duration}`);

    try {
        const calendarService = new GoogleCalendarService();

        // Use IST timezone helpers to get day boundaries
        const dayStart = getISTStartOfDay(date);
        const dayEnd = getISTEndOfDay(date);

        // Fetch busy slots from Google Calendar
        const busySlots = await calendarService.getBusySlots(dayStart.toISOString(), dayEnd.toISOString());
        console.log(`[Availability API] Busy Slots Found: ${busySlots.length}`);

        // Generate slots every 30 minutes (clinic hours: 09:00-18:00 IST)
        const step = 30;
        const slots = generateTimeSlots(date, "09:00", "18:00", step);

        const availability = slots.map(slotTime => {
            // Calculate slot range based on requested DURATION (Asia/Kolkata timezone)
            const slotStart = new Date(`${date}T${slotTime}:00+05:30`);
            const slotEnd = new Date(slotStart.getTime() + duration * 60000);

            // Count overlapping busy events
            const overlaps = busySlots.filter((busy: any) => {
                const busyStart = new Date(busy.start);
                const busyEnd = new Date(busy.end);
                // Standard overlap check: StartA < EndB && EndA > StartB
                return (slotStart < busyEnd && slotEnd > busyStart);
            }).length;

            return {
                start: slotStart.toISOString(),
                time: slotTime,
                capacity: activeChairs,
                available: Math.max(0, activeChairs - overlaps),
            };
        });

        return NextResponse.json({ slots: availability });
    } catch (error: any) {
        console.error('[Availability API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch availability', message: error.message },
            { status: 500 }
        );
    }
}

function generateTimeSlots(date: string, start: string, end: string, step: number): string[] {
    const slots: string[] = [];
    // Use Asia/Kolkata timezone for slot generation
    let current = new Date(`${date}T${start}:00+05:30`);
    const endTime = new Date(`${date}T${end}:00+05:30`);

    while (current < endTime) {
        const hours = current.getHours().toString().padStart(2, '0');
        const minutes = current.getMinutes().toString().padStart(2, '0');
        slots.push(`${hours}:${minutes}`);
        current.setMinutes(current.getMinutes() + step);
    }
    return slots;
}
