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
    operationalChairs: number;
    activeChairs: number;
    // Verified Clinic Details (GMB)
    clinicDetails?: {
        name: string;
        slogan?: string; // Marketing Tagline
        websiteUrl?: string; // Custom Domain
        address: string;
        phone: string;
        googleMapsUrl?: string;
        googleLocationId?: string;
        placeId?: string;
        lat?: number;
        lng?: number;
        isVerified: boolean;
        syncStatus?: 'idle' | 'pending' | 'success' | 'error';
    };
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
    fetchAvailableSlots: (date: string, activeChairs: number) => Promise<any[]>;
    updateClinicDetails: (details: SchedulingConfig['clinicDetails']) => void; // New Action
    updateAppointmentStatus: (id: string, status: 'confirmed' | 'canceled' | 'completed' | 'no-show') => void;
    importFromGoogle: () => Promise<boolean>;
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
    activeChairs: 3,
    // Default Empty Clinic Details
    clinicDetails: undefined
};

// Simulation Logic: Generate slots based on Active Chairs
// Backend Integration: Fetch slots from API

// Simulation Logic: Generate slots based on Active Chairs
// Backend Integration: Fetch slots from API
export const fetchAvailableSlots = async (dateStr: string, activeChairs: number, duration: number, config: SchedulingConfig) => {
    try {
        // In real app, we might pass duration to API too
        const res = await fetch(`/api/calendar/availability?date=${dateStr}&chairs=${activeChairs}&duration=${duration}`);
        if (!res.ok) throw new Error("Failed to fetch slots");
        const data = await res.json();
        return data.slots;
    } catch (err) {
        // Fallback Simulation
        return generateFallbackSlots(dateStr, activeChairs, duration, config);
    }
};


export const PROCEDURE_TYPES = [
    { id: 'consultation', label: 'Consultation', duration: 30, color: 'bg-blue-100 text-blue-800' },
    { id: 'dental_cleaning', label: 'Dental Cleaning', duration: 45, color: 'bg-green-100 text-green-800' },
    { id: 'root_canal', label: 'Root Canal Treatment', duration: 60, color: 'bg-red-100 text-red-800' },
    { id: 'extraction', label: 'Tooth Extraction', duration: 45, color: 'bg-orange-100 text-orange-800' },
    { id: 'follow_up', label: 'Follow Up', duration: 15, color: 'bg-slate-100 text-slate-800' },
    { id: 'emergency', label: 'Emergency', duration: 30, color: 'bg-red-500 text-white' },
];

const generateFallbackSlots = (
    dateStr: string,
    activeChairs: number,
    durationMinutes: number = 30,
    config: SchedulingConfig
) => {
    const slots = [];
    const { start: startStr, end: endStr } = config.operatingHours;

    // Parse start/end times
    const startTime = new Date(`${dateStr}T${startStr}:00`);
    const endTime = new Date(`${dateStr}T${endStr}:00`);
    const now = new Date();

    // Loop through day in 15-min intervals
    let currentTime = new Date(startTime);

    while (currentTime.getTime() + (durationMinutes * 60000) <= endTime.getTime()) {
        const slotEnd = new Date(currentTime.getTime() + (durationMinutes * 60000));
        const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        let isAvailable = true;

        // 1. Check if slot is in the past (for today)
        if (new Date(dateStr).toDateString() === now.toDateString() && currentTime < now) {
            isAvailable = false;
        }

        // 2. Check Breaks
        const inBreak = config.breaks.some(b => {
            const breakStart = new Date(`${dateStr}T${b.start}:00`);
            const breakEnd = new Date(`${dateStr}T${b.end}:00`);
            // Overlap check
            return (currentTime < breakEnd && slotEnd > breakStart);
        });
        if (inBreak) isAvailable = false;

        // 3. Check Chair Capacity (Concept: Count overlapping appointments)
        // Simplified: Random simulation for demo, but structure is here for real logic
        // In real app: Filter appointments where (appt.start < slotEnd && appt.end > currentTime)
        // If count >= activeChairs, isAvailable = false.

        // For User Demo: We simulate "Busy" slots randomly if it's not a break
        if (isAvailable) {
            // Deterministic pseudo-random based on time (so it doesn't flicker on re-render)
            const entropy = currentTime.getHours() + currentTime.getMinutes();
            const bookedChairs = entropy % (activeChairs + 1); // Mock utilization
            const availableChairs = Math.max(0, activeChairs - bookedChairs);

            if (availableChairs > 0) {
                slots.push({
                    time: timeString,
                    capacity: activeChairs,
                    available: availableChairs
                });
            }
        }

        // Increment by 15 mins for granular slots
        currentTime.setMinutes(currentTime.getMinutes() + 15);
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

            fetchAvailableSlots: async (date, activeChairs, duration = 30) => {
                const state = get();
                return await fetchAvailableSlots(date, activeChairs, duration, state);
            },



            updateClinicDetails: (details) => set({ clinicDetails: details }),


            updateAppointmentStatus: (id: string, status: 'confirmed' | 'canceled' | 'completed' | 'no-show') => set((state) => ({
                appointments: state.appointments.map(a =>
                    a.id === id ? { ...a, status } : a
                )
            })),

            // --- Google My Business Action ---
            importFromGoogle: async () => {
                try {
                    // Set loading state
                    set((state) => ({
                        clinicDetails: {
                            ...state.clinicDetails!,
                            syncStatus: 'pending'
                        }
                    }));

                    const res = await fetch('/api/business/import');
                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.error || 'Import failed');
                    }

                    const data = await res.json();

                    set({
                        clinicDetails: {
                            name: data.name,
                            address: data.address,
                            phone: data.phone,
                            googleMapsUrl: data.googleMapsUrl,
                            lat: data.lat,
                            lng: data.lng,
                            googleLocationId: data.googleLocationId,
                            isVerified: true,
                            syncStatus: 'success'
                        }
                    });

                    return true;
                } catch (error) {
                    console.error("Store GMB Import Error:", error);
                    set((state) => ({
                        clinicDetails: {
                            ...state.clinicDetails!,
                            syncStatus: 'error'
                        }
                    }));
                    throw error;
                }
            }
        }),
        {
            name: 'noble-scheduling-storage',
        }
    )
);
