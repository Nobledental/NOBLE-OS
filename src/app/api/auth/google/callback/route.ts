import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.json({ error: 'Google Auth Failed', details: error }, { status: 400 });
    }

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        const calendarService = new GoogleCalendarService();
        await calendarService.handleCallback(code);

        // Redirect back to the appointments dashboard with a success flag
        const url = new URL('/dashboard/appointments', request.url);
        url.searchParams.set('google_auth', 'success');

        return NextResponse.redirect(url);
    } catch (err: any) {
        console.error('Token Exchange Error:', err);
        return NextResponse.json({ error: 'Failed to exchange token', details: err.message }, { status: 500 });
    }
}
