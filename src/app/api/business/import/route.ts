import { NextRequest, NextResponse } from 'next/server';
import { GoogleBusinessService } from '@/lib/google-business';

export async function GET(request: NextRequest) {
    try {
        const service = new GoogleBusinessService();
        const locations = await service.getLocations();

        // If no locations found
        if (locations.length === 0) {
            return NextResponse.json({ error: 'No verified locations found for this Google Account.' }, { status: 404 });
        }

        // If multiple locations, we might want to let user choose, 
        // but for "Zero Cost" MVP, we'll pick the first verified one or just return all for UI to pick.
        // We will return all.
        return NextResponse.json({ locations });

    } catch (error: any) {
        console.error('GMB Import Error:', error);

        if (error.message.includes('not connected') || error.message.includes('authorize') || error.message.includes('insufficient authentication scopes')) {
            return NextResponse.json({ error: 'Additional permissions required', code: 'AUTH_REQUIRED' }, { status: 401 });
        }

        return NextResponse.json({ error: error.message || 'Failed to fetch business information' }, { status: 500 });
    }
}
