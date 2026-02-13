import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

// Interfaces for Google Business Profile Data
export interface GoogleLocation {
    name: string; // Resource name: "locations/..."
    title: string;
    storefrontAddress?: {
        addressLines?: string[];
        postalCode?: string;
        locality?: string;
        administrativeArea?: string;
        regionCode?: string;
    };
    phoneNumbers?: {
        primaryPhone?: string;
    };
    latlng?: {
        latitude: number;
        longitude: number;
    };
    metadata?: {
        mapsUri?: string; // The Google Maps Link
        placeId?: string;
    };
}

export class GoogleBusinessService {
    private oauth2Client;
    private supabase;

    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        this.supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    }

    /**
     * Load credentials from DB
     */
    private async loadCredentials() {
        const { data, error } = await this.supabase
            .from('clinic_settings')
            .select('value')
            .eq('key', 'google_calendar_auth')
            .single();

        if (error || !data) throw new Error('Google Account not connected. Please authorize first.');

        this.oauth2Client.setCredentials(data.value);
    }

    /**
     * Fetch all locations for the authenticated account.
     * Uses 'mybusinessbusinessinformation' v1 API.
     */
    async getLocations(): Promise<GoogleLocation[]> {
        // --- MOCK MODE: Bypass API Quota ---
        if (process.env.NEXT_PUBLIC_USE_GMB_MOCK === 'true') {
            console.log(' Using MOCK GMB Data (Quota Bypass)');
            await new Promise(resolve => setTimeout(resolve, 1500)); // Fake latency
            return [{
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
            }];
        }
        // -----------------------------------

        await this.loadCredentials();

        // 1. Get the Account ID first
        const accountManagement = google.mybusinessaccountmanagement({
            version: 'v1',
            auth: this.oauth2Client
        });

        const accountsRes = await accountManagement.accounts.list();
        const account = accountsRes.data.accounts?.[0]; // Use the first account found

        if (!account || !account.name) {
            throw new Error('No Google Business Profile account found.');
        }

        // 2. List Locations for this Account
        const businessInfo = google.mybusinessbusinessinformation({
            version: 'v1',
            auth: this.oauth2Client
        });

        // The filter must use the account name, e.g., "accounts/12345"
        const locationsRes = await businessInfo.accounts.locations.list({
            parent: account.name,
            readMask: 'name,title,storefrontAddress,phoneNumbers,latlng,metadata'
        });

        return (locationsRes.data.locations as GoogleLocation[]) || [];
    }

    /**
     * Fetch merged clinic data for onboarding.
     * Returns the first location found.
     */
    async fetchClinicData() {
        try {
            const locations = await this.getLocations();
            if (locations.length === 0) throw new Error("No locations found.");

            const loc = locations[0];
            return {
                name: loc.title,
                address: `${loc.storefrontAddress?.addressLines?.[0]}, ${loc.storefrontAddress?.locality}`,
                phone: loc.phoneNumbers?.primaryPhone || "",
                googleMapsUrl: loc.metadata?.mapsUri,
                lat: loc.latlng?.latitude,
                lng: loc.latlng?.longitude,
                googleLocationId: loc.name,
                isVerified: true, // If we got it from API, it's a real listing
                syncStatus: 'success'
            };
        } catch (error) {
            console.error("GMB Fetch Details Error:", error);
            throw error;
        }
    }
}
