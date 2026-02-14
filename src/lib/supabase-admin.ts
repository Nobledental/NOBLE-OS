/**
 * Server-Side Supabase Admin Client
 * 
 * Uses SERVICE_ROLE_KEY for server-only operations:
 * - Audit trail writes
 * - Clinical note persistence
 * - Booking persistence
 * - Appointment status updates
 * 
 * SECURITY: This file must NEVER be imported in client-side code.
 * The service role key bypasses RLS for administrative operations.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _adminClient: SupabaseClient | null = null;

/**
 * Returns a Supabase admin client using the service role key.
 * Singleton pattern to avoid creating multiple clients.
 * Returns null if environment variables are not configured.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
    if (_adminClient) return _adminClient;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey || url.includes('placeholder')) {
        console.warn('[Supabase Admin] Credentials not configured — running in mock mode');
        return null;
    }

    _adminClient = createClient(url, serviceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    return _adminClient;
}
