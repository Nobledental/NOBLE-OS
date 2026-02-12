import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date'); // YYYY-MM-DD
    const activeChairs = parseInt(searchParams.get('chairs') || '3');
    const duration = parseInt(searchParams.get('duration') || '30'); // Duration in minutes

    console.log(`[Availability API] Request: Date=${date}, Chairs=${activeChairs}, Duration=${duration}`);

    if (!date) {
        return NextResponse.json({ error: 'Date required' }, { status: 400 });
    }

    try {
        const calendarService = new GoogleCalendarService();

        // Define day range (09:00 to 18:00)
        // Ensure standard formatting
        const timeMin = `${date}T09:00:00.000Z`; // UTC for simplicity? Or Local? 
        // Google Calendar API expects ISO string. If we just append Z, it treats as UTC.
        // If the clinic is in India/Local, we should be careful.
        // Ideally, we handle timezones. For now, assuming naive composition works if events are also returned in consistent TZ or we compare mostly relative.
        // Actually, let's use a wide range to catch everything for the day.

        const dayStart = new Date(`${date}T00:00:00`);
        const dayEnd = new Date(`${date}T23:59:59`);

        // Fetch busy slots from Google Calendar
        const busySlots = await calendarService.getBusySlots(dayStart.toISOString(), dayEnd.toISOString());
        console.log(`[Availability API] Busy Slots Found: ${busySlots.length}`);

        // Generate slots every 30 minutes
        const step = 30;
        const slots = generateTimeSlots(date, "09:00", "18:00", step);

        const availability = slots.map(slotTime => {
            // Calculate slot range based on requested DURATION
            const slotStart = new Date(`${date}T${slotTime}:00`);
            const slotEnd = new Date(slotStart.getTime() + duration * 60000);

            // Count overlapping busy events
            const overlaps = busySlots.filter((busy: any) => {
                const busyStart = new Date(busy.start);
                const busyEnd = new Date(busy.end);
                // Standard Overlap: StartA < EndB && EndA > StartB
                return (slotStart < busyEnd && slotEnd > busyStart);
            }).length;

            return {
                time: slotTime,
                capacity: activeChairs,
                available: Math.max(0, activeChairs - overlaps),
                // Debug info
                debug: { overlaps, slotEnd: slotEnd.toLocaleTimeString() }
            };
        });

        // Filter out slots with 0 availability to clean up the response?
        // Or let frontend do it on render? Frontend does: available > 0 check? 
        // Let's filter here to save bandwidth if needed, but for now stick to returning all.
        // Actually, store logic expects `available` count.

        return NextResponse.json({ slots: availability });
    } catch (error: any) {
        console.error('Availability Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function generateTimeSlots(date: string, start: string, end: string, step: number) {
    const slots = [];
    let current = new Date(`${date}T${start}:00`);
    const endTime = new Date(`${date}T${end}:00`);

    while (current < endTime) {
        // Enforce HH:mm format properly
        const hours = current.getHours().toString().padStart(2, '0');
        const minutes = current.getMinutes().toString().padStart(2, '0');
        slots.push(`${hours}:${minutes}`);
        current.setMinutes(current.getMinutes() + step);
    }
    return slots;
}
