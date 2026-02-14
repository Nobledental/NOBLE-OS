/**
 * SECURED Business Data Import API
 * 
 * Changes from original:
 * - Added role-based access (OWNER/ADMIN only)
 * - Added audit logging for business data access
 * - Maintained mock data for demo purposes
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

    // AUDIT: Log business data access
    logAuditTrail(
        user.id,
        'ACCESS_BUSINESS_DATA',
        'business:import',
        { source: 'google_my_business' }
    );

    // Mock data bypass (preserved from original for demo)
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
