/**
 * SECURED Business Data Import API
 * 
 * - Role-based access (OWNER/ADMIN only)
 * - Durable audit logging
 * - Static business data (Google Business Profile cache)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, logAuditTrail } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
    // SECURITY: Only owners and admins can access business data
    const authResult = await requireRole(request, ['OWNER', 'ADMIN']);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const user = authResult;

    // AUDIT: Durable log for business data access
    await logAuditTrail({
        userId: user.id,
        action: 'ACCESS_BUSINESS_DATA',
        resource: 'business:import',
        details: { source: 'google_my_business' },
        request,
        status: 'SUCCESS'
    });

    // Static business profile data (Google My Business cache)
    // This is intentionally static — business profile data is imported once
    // and cached. Real-time sync should use a Supabase-backed cache table.
    return NextResponse.json({
        locations: [{
            name: "locations/4527181657920795054",
            title: "Demo Dental Clinic",
            storefrontAddress: {
                addressLines: ["1st Floor, Demo Plaza, Main Road"],
                locality: "Nallagandla",
                administrativeArea: "Telangana",
                postalCode: "500019"
            },
            phoneNumbers: { primaryPhone: "+91 86104 25342" },
            latlng: { latitude: 17.4739015, longitude: 78.305614 },
            metadata: { mapsUri: "https://maps.google.com/?cid=4527181657920795054" }
        }]
    });
}
