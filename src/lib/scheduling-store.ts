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
    image: string;
    rating: number;
    experience: number;
    languages: string[];
    isAvailable: boolean;
}

export interface PatientShort {
    id: string;
    name: string;
    phone: string;
    isNew?: boolean;
    medicalAlerts?: string[];
    tags?: string[];
    lastVisit?: string;
}

// --- Dental Chair Types ---
export interface DentalChair {
    id: string;
    name: string;
    location: string;
    type: 'surgical' | 'hygiene' | 'consultation';
    status: 'ACTIVE' | 'AVAILABLE' | 'MAINTENANCE' | 'CLEANING' | 'IDLE'; // Aligned with Hub
    currentAppointmentId?: string;
    efficiency?: number;
    metadata?: Record<string, string | number | boolean | null>;
}

export interface Appointment {
    id: string;
    patientId: string;
    doctorId?: string | null;
    type: string;
    date: string;
    slot: string;
    status: 'confirmed' | 'canceled' | 'completed' | 'no-show' | 'arrived' | 'ongoing';
    isFamily?: boolean;
    arrivedAt?: string;
    startedAt?: string;
    completedAt?: string;
}

export interface SchedulingConfig {
    operatingHours: TimeRange;
    breaks: BreakInterval[];
    bookingMode: BookingMode;
    showDoctorAvailability: boolean;
    slotDurationMinutes: number;
    doctors: Doctor[];
    patients: PatientShort[];
    appointments: Appointment[];
    // Deprecating strict numbers in favor of Chairs array, but keeping for backward compat if needed or calculating from array
    operationalChairs: number;
    activeChairs: number;
    chairs: DentalChair[]; // NEW: Source of Truth for "Space"
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
    addAppointment: (appt: Omit<Appointment, 'id'>) => void;
    assignDoctor: (apptId: string, doctorId: string) => void;

    // Chair Actions
    setChairCapacity: (operational: number, active: number) => void; // Legacy wrapper?
    addChair: (chair: Omit<DentalChair, 'id' | 'status'>) => void;
    updateChairStatus: (id: string, status: DentalChair['status']) => void;
    removeChair: (id: string) => void;

    fetchAvailableSlots: (date: string, activeChairs: number, duration?: number) => Promise<{ time: string; capacity: number; available: number }[]>;
    updateClinicDetails: (details: SchedulingConfig['clinicDetails']) => void; // New Action
    updateAppointmentStatus: (id: string, status: 'confirmed' | 'canceled' | 'completed' | 'no-show') => void;
    rescheduleAppointment: (id: string, newDate: string, newSlot: string) => void;
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
        {
            id: 'd1',
            name: "Dr. Lead Dentist",
            specialty: "Clinical Director",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300", // Updated to a more professional headshot if needed, or keep existing
            rating: 5.0,
            experience: 15,
            languages: ["English", "Tamil", "Hindi"],
            isAvailable: true
        }
    ],
    patients: [
        { id: 'p1', name: "Alice Johnson", phone: "9876543210" },
        { id: 'p2', name: "Bob Smith", phone: "9123456780" }
    ],
    appointments: [],
    // Defaults
    operationalChairs: 5,
    activeChairs: 3,
    chairs: [
        { id: 'c1', name: 'Surgical Suite A', location: 'Floor 1', type: 'surgical', status: 'ACTIVE', efficiency: 95 },
        { id: 'c2', name: 'Hygiene Bay 1', location: 'Floor 1', type: 'hygiene', status: 'ACTIVE', efficiency: 88 },
        { id: 'c3', name: 'Consult Room 1', location: 'Ground', type: 'consultation', status: 'AVAILABLE', efficiency: 100 },
    ],
    // Verified Clinic Details (Pre-filled for Noble Dental)
    clinicDetails: {
        name: 'Noble Dental Care',
        slogan: 'PIONEERING BETTER HEALTH',
        websiteUrl: 'www.nobledental.in',
        address: '1ST Floor, ICA CLINIC, HUDA LAYOUT, NALLAGANDLA, HYDERABAD -500019',
        phone: '+91-8610-425342', // Verified from Branding Config
        lat: 17.4834,
        lng: 78.3155,
        isVerified: true,
        syncStatus: 'success',
        googleLocationId: 'noble-nallagandla-001'
    }
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
    } catch (_err) {
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
    { id: 'whitening', label: 'Teeth Whitening', duration: 60, color: 'bg-cyan-100 text-cyan-800' },
    { id: 'veneers', label: 'Dental Veneers', duration: 90, color: 'bg-purple-100 text-purple-800' },
];

const generateFallbackSlots = (
    dateStr: string,
    activeChairs: number, // Still used as an override or we calculate from config.chairs
    durationMinutes: number = 30,
    config: SchedulingConfig
) => {
    const slots = [];
    const { start: startStr, end: endStr } = config.operatingHours;

    // Use "Real" Active Chairs from store if available, otherwise fallback to prop
    const _realActiveChairs = config.chairs && config.chairs.length > 0
        ? config.chairs.filter(c => c.status === 'ACTIVE' || c.status === 'AVAILABLE').length
        : activeChairs;

    // Parse start/end times
    const startTime = new Date(`${dateStr}T${startStr}:00`);
    const endTime = new Date(`${dateStr}T${endStr}:00`);
    const now = new Date();

    // Loop through day in 15-min intervals
    const currentTime = new Date(startTime);

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

        // 3. Check Chair Capacity (Real Logic using Local Store)
        if (isAvailable) {
            // Count overlapping appointments in local store
            const bookedChairs = config.appointments.filter(appt => {
                if (appt.status === 'canceled' || appt.status === 'no-show') return false;

                // Parse appt time
                // appt.date is YYYY-MM-DD
                // appt.slot is HH:mm
                if (appt.date !== dateStr) return false;

                const apptStart = new Date(`${appt.date}T${appt.slot}:00`);
                // Assume default 30 min duration if not specified in appt
                // In real app, appt usually has duration or end time. 
                // We'll use PROCEDURES map if possible, or default 30.
                const procDuration = 30; // Simplify for now
                const apptEnd = new Date(apptStart.getTime() + procDuration * 60000);

                // Overlap Check: StartA < EndB && EndA > StartB
                return (apptStart < slotEnd && apptEnd > currentTime);
            }).length;

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
        (set, get) => ({
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

            addChair: (chair) => set((state) => ({
                chairs: [...state.chairs, { ...chair, id: crypto.randomUUID(), status: 'AVAILABLE', efficiency: 100 }]
            })),

            updateChairStatus: (id, status) => set((state) => ({
                chairs: state.chairs.map(c => c.id === id ? { ...c, status } : c)
            })),

            removeChair: (id) => set((state) => ({
                chairs: state.chairs.filter(c => c.id !== id)
            })),

            fetchAvailableSlots: async (date, activeChairs, duration = 30) => {
                const state = get();
                // Pass state to generator to access full chair list
                return await fetchAvailableSlots(date, activeChairs, duration, state);
            },



            updateClinicDetails: (details) => set({ clinicDetails: details }),


            updateAppointmentStatus: (id: string, status: 'confirmed' | 'canceled' | 'completed' | 'no-show' | 'arrived' | 'ongoing') => set((state) => ({
                appointments: state.appointments.map(a => {
                    if (a.id !== id) return a;
                    const updates: Partial<Appointment> = { status };
                    const now = new Date().toISOString();

                    if (status === 'arrived') updates.arrivedAt = now;
                    if (status === 'ongoing') updates.startedAt = now;
                    if (status === 'completed') updates.completedAt = now;

                    return { ...a, ...updates };
                })
            })),

            rescheduleAppointment: (id: string, newDate: string, newSlot: string) => set((state) => ({
                appointments: state.appointments.map(a =>
                    a.id === id ? { ...a, date: newDate, slot: newSlot, status: 'confirmed' } : a
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
            name: 'noble-scheduling-storage-v3', // Version bumped to remove mock doctors
        }
    )
);
