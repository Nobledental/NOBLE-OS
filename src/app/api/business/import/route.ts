import { NextRequest, NextResponse } from 'next/server';
import { GoogleBusinessService } from '@/lib/google-business';


export async function GET(request: NextRequest) {
    // START: MOCK DATA BYPASS (Fixed for Demo)
    // We return hardcoded Noble Dental data to avoid Supabase/GMB auth crashes
    return NextResponse.json({
        locations: [{
            name: "locations/4527181657920795054",
            title: "Noble Dental Care",
            storefrontAddress: {
                addressLines: ["1st Floor, ICA Clinic, Plot no. 151/2, Huda Layout, Water Tank Road"],
                locality: "Nallagandla",
                administrativeArea: "Telangana",
                postalCode: "500019"
            },
            phoneNumbers: { primaryPhone: "+91 86104 25342" },
            latlng: { latitude: 17.4739015, longitude: 78.305614 },
            metadata: { mapsUri: "https://maps.google.com/?cid=4527181657920795054" }
        }]
    });
    // END: MOCK DATA BYPASS
}
