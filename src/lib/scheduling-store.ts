import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BookingMode = 'auto' | 'manual' | 'open_queue';

export interface TimeRange {
    start: string; // "HH:mm" 24h format
    end: string;
}

export interface BreakInterval extends TimeRange {
    id: string;
    label: string;
}

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    isAvailable: boolean;
}

export interface SchedulingConfig {
    operatingHours: TimeRange;
    breaks: BreakInterval[];
    bookingMode: BookingMode;
    showDoctorAvailability: boolean;
    slotDurationMinutes: number; // e.g., 30 mins
    doctors: Doctor[];
}

interface SchedulingState extends SchedulingConfig {
    // Actions
    setOperatingHours: (start: string, end: string) => void;
    addBreak: (breakItem: Omit<BreakInterval, 'id'>) => void;
    removeBreak: (id: string) => void;
    setBookingMode: (mode: BookingMode) => void;
    toggleAvailabilityVisibility: () => void;
    toggleDoctorAvailability: (id: string) => void;
}

const DEFAULT_CONFIG: SchedulingConfig = {
    operatingHours: { start: "09:00", end: "18:00" },
    breaks: [
        { id: '1', start: "13:00", end: "14:00", label: "Lunch Break" }
    ],
    bookingMode: 'manual', // Default to manual for safety
    showDoctorAvailability: true,
    slotDurationMinutes: 30,
    doctors: [
        { id: 'd1', name: "Dr. A. Smith", specialty: "General Dentist", isAvailable: true },
        { id: 'd2', name: "Dr. B. Jones", specialty: "Orthodontist", isAvailable: true },
    ]
};

export const useSchedulingStore = create<SchedulingState>()(
    persist(
        (set) => ({
            ...DEFAULT_CONFIG,

            setOperatingHours: (start, end) => set({ operatingHours: { start, end } }),

            addBreak: (breakItem) => set((state) => ({
                breaks: [...state.breaks, { ...breakItem, id: crypto.randomUUID() }]
            })),

            removeBreak: (id) => set((state) => ({
                breaks: state.breaks.filter(b => b.id !== id)
            })),

            setBookingMode: (mode) => set({ bookingMode: mode }),

            toggleAvailabilityVisibility: () => set((state) => ({
                showDoctorAvailability: !state.showDoctorAvailability
            })),

            toggleDoctorAvailability: (id) => set((state) => ({
                doctors: state.doctors.map(d =>
                    d.id === id ? { ...d, isAvailable: !d.isAvailable } : d
                )
            })),
        }),
        {
            name: 'noble-scheduling-storage',
        }
    )
);
