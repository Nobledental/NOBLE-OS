import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleCalendarService } from '@/lib/google-calendar';

// Zod schema for OAuth callback query parameters
const CallbackQuerySchema = z.object({
    code: z.string().min(1, 'Authorization code is required').optional(),
    error: z.string().optional(),
});

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const rawQuery = {
        code: searchParams.get('code'),
        error: searchParams.get('error'),
    };

    // Validate query parameters
    const parseResult = CallbackQuerySchema.safeParse(rawQuery);

    if (!parseResult.success) {
        return NextResponse.json(
            {
                error: 'Invalid callback parameters',
                details: parseResult.error.flatten()
            },
            { status: 400 }
        );
    }

    const { code, error } = parseResult.data;

    if (error) {
        return NextResponse.json({ error: 'Google Auth Failed', details: error }, { status: 400 });
    }

    if (!code) {
        return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
    }

    try {
        const calendarService = new GoogleCalendarService();
        await calendarService.handleCallback(code);

        // Redirect back to the appointments dashboard with a success flag
        const url = new URL('/dashboard/appointments', request.url);
        url.searchParams.set('google_auth', 'success');

        return NextResponse.redirect(url);
    } catch (err: any) {
        console.error('[Google OAuth] Token Exchange Error:', err);
        return NextResponse.json(
            {
                error: 'Failed to exchange authorization token',
                message: err.message
            },
            { status: 500 }
        );
    }
}
