'use server';

import { GoogleCalendarService } from '@/lib/google-calendar';
import { PROCEDURE_TYPES } from '@/lib/scheduling-store';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { logAuditTrail } from '@/lib/server-auth';

interface BookingRequest {
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    serviceId: string;
    doctorId?: string;
    date: string; // ISO String
    startTime: string; // HH:mm
    notes?: string;
    type: 'standard' | 'academic';
}

export async function createBooking(data: BookingRequest) {
    // 1. Validation
    if (!data.patientName || !data.patientPhone || !data.serviceId || !data.date || !data.startTime) {
        return { success: false, error: "Missing required fields" };
    }

    // 2. Resolve Service Details
    const service = PROCEDURE_TYPES.find(p => p.id === data.serviceId);
    if (!service) return { success: false, error: "Invalid Service ID" };

    const duration = service.duration;
    const startStr = data.startTime.includes('Z') || data.startTime.includes('+') ? data.startTime : `${data.startTime}+05:30`;
    const startDate = new Date(startStr);
    const endDate = new Date(startDate.getTime() + duration * 60000);

    // 3. Generate idempotency key
    const bookingRequestId = crypto.randomUUID();
    const supabase = getSupabaseAdmin();

    try {
        // 4. Persist booking record (PENDING state)
        let bookingId: string = bookingRequestId;

        if (supabase) {
            const { data: booking, error: dbError } = await supabase
                .from('bookings')
                .insert({
                    booking_request_id: bookingRequestId,
                    patient_name: data.patientName,
                    patient_phone: data.patientPhone,
                    patient_email: data.patientEmail || null,
                    service_id: data.serviceId,
                    service_label: service.label,
                    doctor_id: data.doctorId || null,
                    appointment_date: data.date,
                    appointment_time: data.startTime,
                    duration_minutes: duration,
                    notes: data.notes || null,
                    type: data.type,
                    status: 'PENDING_EXTERNAL_SYNC',
                })
                .select('id')
                .single();

            if (dbError) throw dbError;
            bookingId = booking.id;
        }

        // 5. Google Calendar Integration
        const isTeleconsult = data.serviceId === 'online_consult' || data.serviceId === 'teleconsult';
        const calendarService = new GoogleCalendarService();

        const eventSummary = `[${data.type.toUpperCase()}] ${service.label} - ${data.patientName}`;
        const description = `Patient: ${data.patientName}\nPhone: ${data.patientPhone}\nNotes: ${data.notes || 'None'}\nType: ${data.type}`;

        let calendarEventId: string | null = null;
        let meetLink: string | null = null;
        let finalStatus = 'CONFIRMED';
        let syncError: Record<string, any> | null = null;

        try {
            const event = await calendarService.createEvent({
                summary: eventSummary,
                description,
                start: { dateTime: startDate.toISOString() },
                end: { dateTime: endDate.toISOString() },
                attendees: data.patientEmail ? [{ email: data.patientEmail }] : [],
                meetLink: isTeleconsult,
                location: isTeleconsult ? 'Google Meet' : 'Noble Dental Care, Nallagandla'
            });

            calendarEventId = event.id ?? null;
            meetLink = event.hangoutLink ?? null;
        } catch (calError: any) {
            console.error('[Booking] Calendar sync failed:', calError?.message);
            finalStatus = 'EXTERNAL_SYNC_FAILED';
            syncError = { message: calError?.message || 'Calendar sync failed', timestamp: new Date().toISOString() };
        }

        // 6. Update booking with calendar result
        if (supabase) {
            const { error: updateError } = await supabase
                .from('bookings')
                .update({
                    calendar_event_id: calendarEventId,
                    meet_link: meetLink,
                    status: finalStatus,
                    sync_error: syncError
                })
                .eq('id', bookingId);

            if (updateError) {
                console.error('[Booking] Failed to update booking status:', updateError.message);
            }
        }

        // 7. Audit log
        await logAuditTrail({
            userId: 'server-action',
            action: 'CREATE_BOOKING',
            resource: `booking:${bookingId}`,
            details: {
                bookingRequestId,
                patientName: data.patientName,
                service: service.label,
                calendarEventId,
                status: finalStatus
            },
            status: 'SUCCESS'
        });

        return {
            success: true,
            bookingId,
            eventId: calendarEventId,
            meetLink,
            status: finalStatus
        };

    } catch (error: any) {
        await logAuditTrail({
            userId: 'server-action',
            action: 'CREATE_BOOKING',
            resource: 'booking:new',
            details: { patientName: data.patientName, service: service.label },
            status: 'FAILURE',
            error
        });

        console.error("[Booking] Error:", error?.message);
        return { success: false, error: error?.message || "Failed to create booking" };
    }
}
