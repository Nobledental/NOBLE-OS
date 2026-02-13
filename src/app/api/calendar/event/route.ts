import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';

export async function POST(request: NextRequest) {
    try {
        // Security: Check Authentication (Placeholder for middleware/session check)
        // const supabase = createRouteHandlerClient({ cookies });
        // const { data: { session } } = await supabase.auth.getSession();
        // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { summary, description, start, durationMinutes = 30, googleMeet, location } = body;

        const calendarService = new GoogleCalendarService();

        const startTime = new Date(start.includes('Z') || start.includes('+') ? start : `${start}+05:30`);
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

        const event = await calendarService.createEvent({
            summary,
            description,
            start: { dateTime: startTime.toISOString() },
            end: { dateTime: endTime.toISOString() },
            meetLink: googleMeet,
            location // Pass location
        });

        return NextResponse.json({ success: true, event });
    } catch (error: any) {
        console.error('Create Event Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
