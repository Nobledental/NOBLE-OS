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

export interface PatientShort {
    id: string;
    name: string;
    phone: string;
    isNew?: boolean;
}

export interface SchedulingConfig {
    operatingHours: TimeRange;
    breaks: BreakInterval[];
    bookingMode: BookingMode;
    showDoctorAvailability: boolean;
    slotDurationMinutes: number;
    doctors: Doctor[];
    patients: PatientShort[];
    appointments: any[];
    // Chair Capacity
    operationalChairs: number;
    activeChairs: number;
}

interface SchedulingState extends SchedulingConfig {
    // Actions
    setOperatingHours: (start: string, end: string) => void;
    addBreak: (breakItem: Omit<BreakInterval, 'id'>) => void;
    removeBreak: (id: string) => void;
    setBookingMode: (mode: BookingMode) => void;
    toggleAvailabilityVisibility: () => void;
    toggleDoctorAvailability: (id: string) => void;
    addPatient: (patient: PatientShort) => void;
    addAppointment: (appt: any) => void;
    assignDoctor: (apptId: string, doctorId: string) => void;
    setChairCapacity: (operational: number, active: number) => void;
    fetchAvailableSlots: (date: string, activeChairs: number) => Promise<any[]>; // Added
}

const DEFAULT_CONFIG: SchedulingConfig = {
    operatingHours: { start: "09:00", end: "18:00" },
    breaks: [
        { id: '1', start: "13:00", end: "14:00", label: "Lunch Break" }
    ],
    bookingMode: 'manual',
    showDoctorAvailability: true,
    slotDurationMinutes: 30,
    doctors: [
        { id: 'd1', name: "Dr. A. Smith", specialty: "General Dentist", isAvailable: true },
        { id: 'd2', name: "Dr. B. Jones", specialty: "Orthodontist", isAvailable: true },
    ],
    patients: [
        { id: 'p1', name: "Alice Johnson", phone: "9876543210" },
        { id: 'p2', name: "Bob Smith", phone: "9123456780" }
    ],
    appointments: [],
    // Defaults
    operationalChairs: 5,
    activeChairs: 3
};

// Simulation Logic: Generate slots based on Active Chairs
// Backend Integration: Fetch slots from API
export const fetchAvailableSlots = async (dateStr: string, activeChairs: number) => {
    try {
        const res = await fetch(`/api/calendar/availability?date=${dateStr}&chairs=${activeChairs}`);
        if (!res.ok) throw new Error("Failed to fetch slots");
        const data = await res.json();
        return data.slots;
    } catch (err) {
        console.error("Slot Fetch Error, falling back to simulation", err);
        // Fallback Simulation
        return generateFallbackSlots(dateStr, activeChairs);
    }
};

const generateFallbackSlots = (dateStr: string, activeChairs: number) => {
    const slots = [];
    let currentTime = new Date(`${dateStr}T09:00:00`);
    const endTime = new Date(`${dateStr}T18:00:00`);

    while (currentTime < endTime) {
        const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        slots.push({
            time: timeString,
            capacity: activeChairs,
            available: activeChairs - Math.floor(Math.random() * 2)
        });
        currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    return slots;
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

            addPatient: (patient) => set((state) => ({
                patients: [...state.patients, patient]
            })),

            addAppointment: (appt) => set((state) => ({
                appointments: [...state.appointments, { ...appt, id: crypto.randomUUID() }]
            })),

            assignDoctor: (apptId, doctorId) => set((state) => ({
                appointments: state.appointments.map(a =>
                    a.id === apptId ? { ...a, doctorId } : a
                )
            })),

            setChairCapacity: (operational, active) => set({ operationalChairs: operational, activeChairs: active }),

            fetchAvailableSlots: async (date, activeChairs) => {
                return await fetchAvailableSlots(date, activeChairs);
            },
        }),
        {
            name: 'noble-scheduling-storage',
        }
    )
);
