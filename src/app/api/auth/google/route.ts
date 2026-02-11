import { NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';

export async function GET() {
    try {
        const calendarService = new GoogleCalendarService();
        const url = calendarService.getAuthUrl();

        return NextResponse.redirect(url);
    } catch (error: any) {
        console.error('Google Auth Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
