/**
 * Phase 23b: Clinic Heartbeat Service
 * 
 * Controls clinic availability state and emergency protocols
 */

import { v4 as uuid } from 'uuid';

// =============================================================================
// TYPES
// =============================================================================

export type ClinicAvailabilityState =
    | 'OPEN'
    | 'CLOSED'
    | 'EMERGENCY_ONLY'
    | 'BREAK'
    | 'DOCTOR_AWAY';

export interface DoctorAvailability {
    doctorId: string;
    doctorName: string;
    isAvailable: boolean;
    currentStatus: 'with_patient' | 'available' | 'break' | 'offline';
    nextAvailableAt?: Date;
    chairId?: string;
}

export interface OperatingHours {
    dayOfWeek: number; // 0 = Sunday, 6 = Saturday
    openTime: string; // "09:00"
    closeTime: string; // "21:00"
    isOpen: boolean;
    breaks?: { start: string; end: string }[];
}

export interface ClinicStatus {
    id: string;
    clinicId: string;
    currentState: ClinicAvailabilityState;
    manualOverride: boolean;
    overrideReason?: string;
    overrideExpiry?: Date;
    overrideBy?: string;
    emergencyContactEnabled: boolean;
    emergencySurchargePercent: number;
    lastUpdated: Date;
    updatedBy: string;
}

export interface ClinicHeartbeat {
    timestamp: Date;
    status: ClinicStatus;
    doctorAvailability: DoctorAvailability[];
    activePatients: number;
    queueLength: number;
    estimatedWaitMinutes: number;
    nextAvailableSlot?: Date;
}

export interface SlotAvailability {
    slotTime: Date;
    available: boolean;
    reason?: 'booked' | 'blocked' | 'outside_hours' | 'emergency_only';
    doctorId?: string;
    isEmergencySlot?: boolean;
}

// =============================================================================
// CLINIC STATUS SERVICE
// =============================================================================

export class ClinicStatusService {
    private readonly DEFAULT_OPERATING_HOURS: OperatingHours[] = [
        { dayOfWeek: 0, isOpen: false, openTime: '', closeTime: '' }, // Sunday closed
        { dayOfWeek: 1, isOpen: true, openTime: '09:00', closeTime: '21:00', breaks: [{ start: '13:00', end: '14:00' }] },
        { dayOfWeek: 2, isOpen: true, openTime: '09:00', closeTime: '21:00', breaks: [{ start: '13:00', end: '14:00' }] },
        { dayOfWeek: 3, isOpen: true, openTime: '09:00', closeTime: '21:00', breaks: [{ start: '13:00', end: '14:00' }] },
        { dayOfWeek: 4, isOpen: true, openTime: '09:00', closeTime: '21:00', breaks: [{ start: '13:00', end: '14:00' }] },
        { dayOfWeek: 5, isOpen: true, openTime: '09:00', closeTime: '21:00', breaks: [{ start: '13:00', end: '14:00' }] },
        { dayOfWeek: 6, isOpen: true, openTime: '10:00', closeTime: '18:00' } // Saturday shorter hours
    ];

    private readonly EMERGENCY_SURCHARGE_PERCENT = 25;

    /**
     * Determine current clinic availability
     */
    determineAvailability(
        status: ClinicStatus,
        operatingHours: OperatingHours[],
        doctors: DoctorAvailability[],
        currentTime: Date = new Date()
    ): ClinicAvailabilityState {
        // 1. Check manual override first
        if (status.manualOverride) {
            // Check if override has expired
            if (status.overrideExpiry && currentTime > status.overrideExpiry) {
                // Override expired, continue to normal logic
            } else {
                return status.currentState;
            }
        }

        // 2. Check operating hours
        const dayOfWeek = currentTime.getDay();
        const todayHours = operatingHours.find(h => h.dayOfWeek === dayOfWeek);

        if (!todayHours || !todayHours.isOpen) {
            return 'CLOSED';
        }

        const currentTimeStr = this.formatTime(currentTime);

        if (currentTimeStr < todayHours.openTime || currentTimeStr > todayHours.closeTime) {
            return 'CLOSED';
        }

        // 3. Check if in break time
        if (todayHours.breaks) {
            for (const breakTime of todayHours.breaks) {
                if (currentTimeStr >= breakTime.start && currentTimeStr <= breakTime.end) {
                    return 'BREAK';
                }
            }
        }

        // 4. Check doctor availability
        const availableDoctors = doctors.filter(d => d.isAvailable && d.currentStatus !== 'offline');

        if (availableDoctors.length === 0) {
            return 'DOCTOR_AWAY';
        }

        return 'OPEN';
    }

    /**
     * Set manual override
     */
    setManualOverride(
        clinicId: string,
        state: ClinicAvailabilityState,
        reason: string,
        userId: string,
        expiryMinutes?: number
    ): ClinicStatus {
        return {
            id: uuid(),
            clinicId,
            currentState: state,
            manualOverride: true,
            overrideReason: reason,
            overrideExpiry: expiryMinutes
                ? new Date(Date.now() + expiryMinutes * 60 * 1000)
                : undefined,
            overrideBy: userId,
            emergencyContactEnabled: state === 'EMERGENCY_ONLY',
            emergencySurchargePercent: this.EMERGENCY_SURCHARGE_PERCENT,
            lastUpdated: new Date(),
            updatedBy: userId
        };
    }

    /**
     * Clear manual override
     */
    clearManualOverride(status: ClinicStatus, userId: string): ClinicStatus {
        return {
            ...status,
            manualOverride: false,
            overrideReason: undefined,
            overrideExpiry: undefined,
            overrideBy: undefined,
            lastUpdated: new Date(),
            updatedBy: userId
        };
    }

    /**
     * Enable emergency mode
     */
    enableEmergencyMode(clinicId: string, userId: string): ClinicStatus {
        return this.setManualOverride(
            clinicId,
            'EMERGENCY_ONLY',
            'Emergency mode activated',
            userId
        );
    }

    /**
     * Get heartbeat (real-time status)
     */
    getHeartbeat(
        status: ClinicStatus,
        operatingHours: OperatingHours[],
        doctors: DoctorAvailability[],
        activePatients: number,
        queueLength: number
    ): ClinicHeartbeat {
        const currentState = this.determineAvailability(status, operatingHours, doctors);

        // Calculate estimated wait
        const avgAppointmentMinutes = 30;
        const availableDoctors = doctors.filter(d => d.isAvailable).length || 1;
        const estimatedWaitMinutes = Math.ceil((queueLength / availableDoctors) * avgAppointmentMinutes);

        return {
            timestamp: new Date(),
            status: { ...status, currentState },
            doctorAvailability: doctors,
            activePatients,
            queueLength,
            estimatedWaitMinutes,
            nextAvailableSlot: this.findNextAvailableSlot(operatingHours, doctors)
        };
    }

    /**
     * Check if slot is available
     */
    checkSlotAvailability(
        slotTime: Date,
        status: ClinicStatus,
        operatingHours: OperatingHours[],
        bookedSlots: Date[],
        blockedSlots: Date[]
    ): SlotAvailability {
        const state = this.determineAvailability(status, operatingHours, [], slotTime);

        // Check if outside hours
        if (state === 'CLOSED') {
            return { slotTime, available: false, reason: 'outside_hours' };
        }

        // Check if blocked
        const isBlocked = blockedSlots.some(b =>
            Math.abs(b.getTime() - slotTime.getTime()) < 30 * 60 * 1000
        );
        if (isBlocked) {
            return { slotTime, available: false, reason: 'blocked' };
        }

        // Check if already booked
        const isBooked = bookedSlots.some(b =>
            Math.abs(b.getTime() - slotTime.getTime()) < 30 * 60 * 1000
        );
        if (isBooked) {
            return { slotTime, available: false, reason: 'booked' };
        }

        // Emergency only mode
        if (state === 'EMERGENCY_ONLY') {
            return { slotTime, available: true, reason: 'emergency_only', isEmergencySlot: true };
        }

        return { slotTime, available: true };
    }

    /**
     * Calculate emergency surcharge
     */
    calculateEmergencySurcharge(baseAmount: number): { surcharge: number; total: number } {
        const surcharge = Math.round(baseAmount * (this.EMERGENCY_SURCHARGE_PERCENT / 100));
        return {
            surcharge,
            total: baseAmount + surcharge
        };
    }

    /**
     * Get status display info
     */
    getStatusDisplay(state: ClinicAvailabilityState): {
        label: string;
        color: 'green' | 'red' | 'amber' | 'gray';
        description: string;
    } {
        switch (state) {
            case 'OPEN':
                return {
                    label: 'Open',
                    color: 'green',
                    description: 'Accepting appointments'
                };
            case 'CLOSED':
                return {
                    label: 'Closed',
                    color: 'red',
                    description: 'Not accepting appointments'
                };
            case 'EMERGENCY_ONLY':
                return {
                    label: 'Emergency Only',
                    color: 'amber',
                    description: 'Emergency appointments with surcharge'
                };
            case 'BREAK':
                return {
                    label: 'On Break',
                    color: 'amber',
                    description: 'Will resume shortly'
                };
            case 'DOCTOR_AWAY':
                return {
                    label: 'Doctor Away',
                    color: 'gray',
                    description: 'No doctors available'
                };
        }
    }

    // Helper methods
    private formatTime(date: Date): string {
        return date.toTimeString().slice(0, 5);
    }

    private findNextAvailableSlot(
        operatingHours: OperatingHours[],
        doctors: DoctorAvailability[]
    ): Date | undefined {
        const now = new Date();
        const slotInterval = 30 * 60 * 1000; // 30 minutes

        for (let i = 0; i < 48; i++) { // Check next 24 hours
            const checkTime = new Date(now.getTime() + i * slotInterval);
            const dayOfWeek = checkTime.getDay();
            const hours = operatingHours.find(h => h.dayOfWeek === dayOfWeek);

            if (hours && hours.isOpen) {
                const timeStr = this.formatTime(checkTime);
                if (timeStr >= hours.openTime && timeStr <= hours.closeTime) {
                    return checkTime;
                }
            }
        }

        return undefined;
    }
}

export const clinicStatusService = new ClinicStatusService();
