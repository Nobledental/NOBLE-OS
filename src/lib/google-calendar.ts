import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

// --- Configuration ---
const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/business.manage' // Required for GMB Clinic Onboarding
];

interface CalendarEvent {
    summary: string;
    description?: string;
    start: { dateTime: string };
    end: { dateTime: string };
    attendees?: { email: string }[];
    meetLink?: boolean;
    location?: string;
}

export class GoogleCalendarService {
    private oauth2Client: any;
    private supabase: any;

    constructor() {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

        // Check for placeholder or missing credentials
        if (!clientId || clientId.includes('paste_your') || !clientSecret) {
            console.warn("Google Calendar Credentials missing or invalid. Using Mock Mode.");
            this.oauth2Client = null;
        } else {
            this.oauth2Client = new google.auth.OAuth2(
                clientId,
                clientSecret,
                process.env.GOOGLE_REDIRECT_URI
            );
        }

        // Initialize Supabase Admin Client (Service Role needed to read secure tokens)
        // Check for Supabase keys too to prevent crash
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
            this.supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            );
        } else {
            console.warn("Supabase Admin Credentials missing.");
            this.supabase = null;
        }
    }

    /**
     * Generate the URL for the user to authorize the app.
     */
    getAuthUrl() {
        if (!this.oauth2Client) return '#';
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline', // Critical for receiving refresh_token
            scope: SCOPES,
            prompt: 'consent' // Force consent to ensure refresh_token is returned
        });
    }

    /**
     * Exchange code for tokens and store them in Supabase.
     */
    async handleCallback(code: string) {
        if (!this.oauth2Client || !this.supabase) throw new Error("Service not configured");

        const { tokens } = await this.oauth2Client.getToken(code);

        if (tokens.refresh_token) {
            // Store tokens securely in DB
            const { error } = await this.supabase
                .from('clinic_settings')
                .upsert(
                    {
                        key: 'google_calendar_auth',
                        value: tokens,
                        updated_at: new Date().toISOString()
                    },
                    { onConflict: 'key' }
                );

            if (error) throw new Error(`DB Error: ${error.message}`);
        }

        return tokens;
    }

    /**
     * Load credentials from DB and set them on the OAuth client.
     */
    private async loadCredentials() {
        if (!this.oauth2Client || !this.supabase) return false;

        const { data, error } = await this.supabase
            .from('clinic_settings')
            .select('value')
            .eq('key', 'google_calendar_auth')
            .single();

        if (error || !data) return false;

        this.oauth2Client.setCredentials(data.value);
        return true;
    }

    /**
     * Get busy slots for the given time range.
     */
    async getBusySlots(timeMin: string, timeMax: string) {
        // Mock Mode Check
        const isConfigured = await this.loadCredentials();
        if (!isConfigured) {
            console.warn("[Mock Mode] Returning empty busy slots (Full Availability).");
            return [];
        }

        const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin,
                timeMax,
                items: [{ id: 'primary' }]
            }
        });

        return response.data.calendars?.['primary']?.busy || [];
    }

    /**
     * Create a new appointment event.
     */
    async createEvent(eventDetails: CalendarEvent) {
        await this.loadCredentials();

        const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

        const requestBody: any = {
            summary: eventDetails.summary,
            description: eventDetails.description,
            start: eventDetails.start,
            end: eventDetails.end,
            location: eventDetails.location, // Added location
            attendees: eventDetails.attendees,
        };

        // Add Google Meet support
        if (eventDetails.meetLink) {
            requestBody.conferenceData = {
                createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } }
            };
        }

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody,
            conferenceDataVersion: 1 // Required for Meet link generation
        });

        return response.data;
    }
}
