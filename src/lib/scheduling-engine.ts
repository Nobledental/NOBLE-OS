import { SchedulingConfig, TimeRange } from "./scheduling-store"; // Assuming Types are exported from store

/**
 * Helper to convert "HH:mm" string to minutes from midnight
 */
function timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

/**
 * Helper to convert minutes from midnight to "HH:mm"
 */
function minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Check if a slot (start-end) overlaps with any break
 */
function isOverlappingBreak(slotStart: number, slotEnd: number, breaks: { start: number, end: number }[]): boolean {
    return breaks.some(b =>
        (slotStart >= b.start && slotStart < b.end) || // Slot starts inside break
        (slotEnd > b.start && slotEnd <= b.end) ||     // Slot ends inside break
        (slotStart <= b.start && slotEnd >= b.end)     // Slot engulfs break
    );
}

export function generateAvailableSlots(config: SchedulingConfig): string[] {
    const startMins = timeToMinutes(config.operatingHours.start);
    const endMins = timeToMinutes(config.operatingHours.end);
    const slotDuration = config.slotDurationMinutes;

    // Convert breaks to minutes for easier comparison
    const breaksInMinutes = config.breaks.map(b => ({
        start: timeToMinutes(b.start),
        end: timeToMinutes(b.end)
    }));

    const slots: string[] = [];
    let currentMins = startMins;

    while (currentMins + slotDuration <= endMins) {
        const slotEnd = currentMins + slotDuration;

        if (!isOverlappingBreak(currentMins, slotEnd, breaksInMinutes)) {
            slots.push(minutesToTime(currentMins));
        }

        currentMins += slotDuration;
    }

    return slots;
}

export function getStatusMessage(config: SchedulingConfig, slotCount: number): string {
    if (config.bookingMode === 'open_queue') {
        return "Open Queue: Walk-ins and all bookings accepted based on arrival.";
    }

    if (slotCount === 0) {
        return "No slots available for this day.";
    }

    return `${slotCount} slots available.`;
}
