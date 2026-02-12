'use server';

import { GoogleCalendarService } from '@/lib/google-calendar';
import { PROCEDURE_TYPES } from '@/lib/scheduling-store';

interface BookingRequest {
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    serviceId: string;
    date: string; // ISO String
    startTime: string; // HH:mm
    notes?: string;
    type: 'standard' | 'academic';
}

export async function createBooking(data: BookingRequest) {
    console.log("[Server Action] Creating Booking:", data);

    try {
        // 1. Validation
        if (!data.patientName || !data.patientPhone || !data.serviceId || !data.date || !data.startTime) {
            return { success: false, error: "Missing required fields" };
        }

        // 2. Resolve Service Details
        const service = PROCEDURE_TYPES.find(p => p.id === data.serviceId);
        if (!service) return { success: false, error: "Invalid Service ID" };

        const duration = service.duration;
        const startDate = new Date(`${data.date.split('T')[0]}T${data.startTime}:00`);
        const endDate = new Date(startDate.getTime() + duration * 60000);

        // 3. Teleconsult Logic
        const isTeleconsult = data.serviceId === 'online_consult' || data.serviceId === 'teleconsult'; // Adjust based on your IDs
        // Or if the user selected "Teleconsult" mode specifically. 
        // For now, let's assume specific service IDs trigger it.

        // 4. Google Calendar Integration
        const calendarService = new GoogleCalendarService();

        const eventSummary = `[${data.type.toUpperCase()}] ${service.label} - ${data.patientName}`;
        const description = `
            Patient: ${data.patientName}
            Phone: ${data.patientPhone}
            Notes: ${data.notes || 'None'}
            Type: ${data.type}
        `;

        const event = await calendarService.createEvent({
            summary: eventSummary,
            description: description,
            start: { dateTime: startDate.toISOString() },
            end: { dateTime: endDate.toISOString() },
            attendees: data.patientEmail ? [{ email: data.patientEmail }] : [],
            meetLink: isTeleconsult, // Trigger Google Meet link generation
            location: isTeleconsult ? 'Google Meet' : 'Noble Dental Care, Nallagandla'
        });

        console.log("[Server Action] Event Created:", event.id);

        return { success: true, eventId: event.id, meetLink: event.hangoutLink };
    } catch (error: any) {
        console.error("[Server Action] Booking Error:", error);
        return { success: false, error: error.message || "Failed to create booking" };
    }
}
