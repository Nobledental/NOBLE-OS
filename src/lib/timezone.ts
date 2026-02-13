
export const TIMEZONE = 'Asia/Kolkata';

/**
 * Converts a date string or object to an ISO string in Asia/Kolkata
 */
export function toISTString(date: Date | string | number): string {
    const d = new Date(date);
    return d.toLocaleString('en-US', { timeZone: TIMEZONE });
}

/**
 * Creates a Date object for the start of the day in IST
 */
export function getISTStartOfDay(dateStr: string): Date {
    // Composition in local then shift?
    // Better: parse as UTC then adjust? 
    // Actually, "2024-02-14T00:00:00+05:30" is deterministic.
    return new Date(`${dateStr}T00:00:00+05:30`);
}

/**
 * Creates a Date object for the end of the day in IST
 */
export function getISTEndOfDay(dateStr: string): Date {
    return new Date(`${dateStr}T23:59:59+05:30`);
}
