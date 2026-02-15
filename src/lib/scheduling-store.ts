import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { format, parseISO } from 'date-fns';

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
    status: 'ACTIVE' | 'AVAILABLE' | 'MAINTENANCE' | 'CLEANING' | 'IDLE';
    currentAppointmentId?: string;
    efficiency?: number;
    metadata?: Record<string, string | number | boolean | null>;
}

export interface Appointment {
    id: string;
    patientId: string;
    doctorId?: string | null;
    type: string;
    date: string; // ISO-8601 Date String (YYYY-MM-DD)
    slot: string; // HH:mm
    status: 'confirmed' | 'canceled' | 'completed' | 'no-show' | 'arrived' | 'ongoing';
    isFamily?: boolean;
    reason?: string;
    googleMeetLink?: string;
    locationLink?: string;
    arrivedAt?: string;
    startedAt?: string;
    completedAt?: string;
    clinicId?: string; // Multi-tenancy
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
    operationalChairs: number;
    activeChairs: number;
    chairs: DentalChair[];
    clinicDetails?: {
        id?: string; // UUID for Multi-tenancy
        name: string;
        slogan?: string;
        websiteUrl?: string;
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
    showRevenue: boolean; // Privacy Mode
}

interface SchedulingState extends SchedulingConfig {
    // Actions
    setOperatingHours: (start: string, end: string) => void;
    addBreak: (breakItem: Omit<BreakInterval, 'id'>) => void;
    removeBreak: (id: string) => void;
    setBookingMode: (mode: BookingMode) => void;
    toggleAvailabilityVisibility: () => void;
    toggleRevenueVisibility: () => void; // New Action
    toggleDoctorAvailability: (id: string) => void;
    addPatient: (patient: PatientShort) => void;

    // Appointment Actions (Supabase Connected)
    addAppointment: (appt: Omit<Appointment, 'id'>) => Promise<void>;
    updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
    rescheduleAppointment: (id: string, newDate: string, newSlot: string) => Promise<void>;
    assignDoctor: (apptId: string, doctorId: string) => void;

    // Chair Actions
    setChairCapacity: (operational: number, active: number) => void;
    addChair: (chair: Omit<DentalChair, 'id' | 'status'>) => void;
    updateChairStatus: (id: string, status: DentalChair['status']) => void;
    removeChair: (id: string) => void;

    // Data Fetching & Real-time
    fetchClinicConfig: (clinicId: string) => Promise<void>;
    fetchAvailableSlots: (date: string, activeChairs: number, duration?: number) => Promise<{ time: string; capacity: number; available: number }[]>;
    subscribeToAppointments: () => void; // Real-time subscription
    unsubscribeFromAppointments: () => void; // Cleanup

    updateClinicDetails: (details: SchedulingConfig['clinicDetails']) => void;
    importFromGoogle: () => Promise<boolean>;

    // Patient Actions
    fetchPatients: () => Promise<void>;
    searchPatients: (query: string) => Promise<PatientShort[]>;
}

const DEFAULT_CONFIG: SchedulingConfig = {
    operatingHours: { start: "09:00", end: "18:00" },
    breaks: [
        { id: '1', start: "13:00", end: "14:00", label: "Lunch Break" }
    ],
    bookingMode: 'manual',
    showRevenue: false, // Default to hidden for privacy
    showDoctorAvailability: true,
    slotDurationMinutes: 30,
    doctors: [
        {
            id: 'd1',
            name: "Dr. Lead Dentist",
            specialty: "Clinical Director",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
            rating: 5.0,
            experience: 15,
            languages: ["English", "Tamil", "Hindi"],
            isAvailable: true
        }
    ],
    patients: [], // Load from DB
    appointments: [], // Load from DB
    operationalChairs: 5,
    activeChairs: 3,
    chairs: [
        { id: 'c1', name: 'Surgical Suite A', location: 'Floor 1', type: 'surgical', status: 'ACTIVE', efficiency: 95 },
        { id: 'c2', name: 'Hygiene Bay 1', location: 'Floor 1', type: 'hygiene', status: 'ACTIVE', efficiency: 88 },
        { id: 'c3', name: 'Consult Room 1', location: 'Ground', type: 'consultation', status: 'AVAILABLE', efficiency: 100 },
    ],
    clinicDetails: {
        id: '00000000-0000-0000-0000-000000000000', // Default / Fallback ID
        name: 'Noble Dental Care',
        slogan: 'PIONEERING BETTER HEALTH',
        websiteUrl: 'www.nobledental.in',
        address: '1ST Floor, ICA CLINIC, HUDA LAYOUT, NALLAGANDLA, HYDERABAD -500019',
        phone: '+91-8610-425342',
        lat: 17.4834,
        lng: 78.3155,
        isVerified: true,
        syncStatus: 'success',
        googleLocationId: 'noble-nallagandla-001'
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

export const useSchedulingStore = create<SchedulingState>()(
    persist(
        (set, get) => ({
            ...DEFAULT_CONFIG,

            setOperatingHours: async (start, end) => {
                set({ operatingHours: { start, end } });
                const { clinicDetails } = get();
                if (clinicDetails?.id) {
                    await supabase.from('clinic_configs').update({
                        operating_hours: { start, end }
                    }).eq('clinic_id', clinicDetails.id);
                }
            },

            addBreak: async (breakItem) => {
                const newBreak = { ...breakItem, id: crypto.randomUUID() };
                const updatedBreaks = [...get().breaks, newBreak];
                set({ breaks: updatedBreaks });

                const { clinicDetails } = get();
                if (clinicDetails?.id) {
                    await supabase.from('clinic_configs').update({
                        breaks: updatedBreaks
                    }).eq('clinic_id', clinicDetails.id);
                }
            },

            removeBreak: async (id) => {
                const updatedBreaks = get().breaks.filter(b => b.id !== id);
                set({ breaks: updatedBreaks });

                const { clinicDetails } = get();
                if (clinicDetails?.id) {
                    await supabase.from('clinic_configs').update({
                        breaks: updatedBreaks
                    }).eq('clinic_id', clinicDetails.id);
                }
            },

            setBookingMode: async (mode) => {
                set({ bookingMode: mode });
                const { clinicDetails } = get();
                if (clinicDetails?.id) {
                    await supabase.from('clinic_configs').update({
                        booking_mode: mode
                    }).eq('clinic_id', clinicDetails.id);
                }
            },

            toggleAvailabilityVisibility: () => set((state) => ({
                showDoctorAvailability: !state.showDoctorAvailability
            })),

            toggleRevenueVisibility: () => set((state) => ({
                showRevenue: !state.showRevenue
            })),

            toggleDoctorAvailability: (id) => set((state) => ({ doctors: state.doctors.map(d => d.id === id ? { ...d, isAvailable: !d.isAvailable } : d) })),
            addPatient: (patient) => set((state) => ({ patients: [...state.patients, patient] })),

            // --- Supabase Actions ---

            fetchClinicConfig: async (clinicId: string) => {
                const { data, error } = await supabase
                    .from('clinic_configs')
                    .select('*')
                    .eq('clinic_id', clinicId)
                    .single();

                if (error) {
                    console.error("Failed to fetch clinic config:", error);
                    return;
                }

                if (data) {
                    set({
                        clinicDetails: {
                            id: data.clinic_id,
                            name: data.name,
                            slogan: data.slogan,
                            websiteUrl: data.website_url,
                            address: data.address,
                            phone: data.phone,
                            googleMapsUrl: data.google_maps_url,
                            googleLocationId: data.google_location_id,
                            placeId: data.place_id,
                            lat: data.lat,
                            lng: data.lng,
                            isVerified: data.is_verified,
                            syncStatus: 'success'
                        },
                        operatingHours: data.operating_hours || { start: "09:00", end: "18:00" },
                        bookingMode: data.booking_mode || 'manual',
                        slotDurationMinutes: data.slot_duration || 30,
                        activeChairs: data.active_chairs || 3,
                        operationalChairs: data.operational_chairs || 5,
                        breaks: data.breaks || []
                    });
                }
            },

            addAppointment: async (appt) => {
                const { clinicDetails } = get();
                const newAppt: Appointment = {
                    ...appt,
                    id: crypto.randomUUID(),
                    clinicId: clinicDetails?.id,
                    status: 'confirmed'
                };

                // Optimistic UI Update
                set((state) => ({ appointments: [...state.appointments, newAppt] }));

                // Supabase Write
                const { error } = await supabase.from('appointments').insert({
                    id: newAppt.id,
                    patient_id: newAppt.patientId,
                    doctor_id: newAppt.doctorId,
                    type: newAppt.type,
                    date: newAppt.date,
                    slot: newAppt.slot,
                    status: newAppt.status,
                    clinic_id: newAppt.clinicId,
                    is_family: newAppt.isFamily,
                    metadata: { reason: newAppt.reason }
                });

                if (error) {
                    console.error("Failed to sync appointment:", error);
                    // Rollback on error
                    set((state) => ({ appointments: state.appointments.filter(a => a.id !== newAppt.id) }));
                }
            },

            updateAppointmentStatus: async (id, status) => {
                // Optimistic Update
                set((state) => ({
                    appointments: state.appointments.map(a => {
                        if (a.id !== id) return a;
                        const updates: Partial<Appointment> = { status };
                        const now = new Date().toISOString();
                        if (status === 'arrived') updates.arrivedAt = now;
                        if (status === 'ongoing') updates.startedAt = now;
                        if (status === 'completed') updates.completedAt = now;
                        return { ...a, ...updates };
                    })
                }));

                const { error } = await supabase.from('appointments').update({
                    status,
                    updated_at: new Date().toISOString()
                }).eq('id', id);

                if (error) console.error("Failed to update status:", error);
            },

            rescheduleAppointment: async (id, newDate, newSlot) => {
                // Optimistic Update
                set((state) => ({
                    appointments: state.appointments.map(a =>
                        a.id === id ? { ...a, date: newDate, slot: newSlot, status: 'confirmed' } : a
                    )
                }));

                const { error } = await supabase.from('appointments').update({
                    date: newDate,
                    slot: newSlot,
                    status: 'confirmed',
                    updated_at: new Date().toISOString()
                }).eq('id', id);

                if (error) console.error("Failed to reschedule:", error);
            },

            assignDoctor: async (apptId, doctorId) => {
                set((state) => ({
                    appointments: state.appointments.map(a => a.id === apptId ? { ...a, doctorId } : a)
                }));
                // Fire and forget update
                await supabase.from('appointments').update({ doctor_id: doctorId }).eq('id', apptId);
            },

            setChairCapacity: async (operational, active) => {
                set({ operationalChairs: operational, activeChairs: active });
                const { clinicDetails } = get();
                if (clinicDetails?.id) {
                    await supabase.from('clinic_configs').update({
                        operational_chairs: operational,
                        active_chairs: active
                    }).eq('clinic_id', clinicDetails.id);
                }
            },

            addChair: (chair) => set((state) => ({
                chairs: [...state.chairs, { ...chair, id: crypto.randomUUID(), status: 'AVAILABLE', efficiency: 100 }]
            })),

            updateChairStatus: (id, status) => set((state) => ({
                chairs: state.chairs.map(c => c.id === id ? { ...c, status } : c)
            })),

            removeChair: (id) => set((state) => ({
                chairs: state.chairs.filter(c => c.id !== id)
            })),

            // --- Server-Side Capacity Check with RPC ---
            fetchAvailableSlots: async (date, activeChairs, duration = 30) => {
                const { clinicDetails } = get();

                try {
                    // Call Supabase RPC 'get_available_slots'
                    const { data, error } = await supabase.rpc('get_available_slots', {
                        query_date: date,
                        clinic_id: clinicDetails?.id,
                        duration_minutes: duration,
                        active_chairs: activeChairs
                    });

                    if (error) throw error;

                    if (data) return data;
                    return [];

                } catch (err) {
                    console.error("RPC Fetch Failed, falling back to basic checks", err);
                    return [];
                }
            },

            // --- Real-time Subscription ---
            subscribeToAppointments: () => {
                const { clinicDetails } = get();
                if (!clinicDetails?.id) return;

                const channel = supabase
                    .channel('appointments-realtime')
                    .on(
                        'postgres_changes',
                        {
                            event: '*',
                            schema: 'public',
                            table: 'appointments',
                            filter: `clinic_id=eq.${clinicDetails.id}`
                        },
                        (payload) => {
                            const newAppt = payload.new as Appointment;
                            const oldAppt = payload.old as Appointment;

                            set((state) => {
                                if (payload.eventType === 'INSERT') {
                                    if (state.appointments.find(a => a.id === newAppt.id)) return state;
                                    return { appointments: [...state.appointments, newAppt] };
                                }
                                if (payload.eventType === 'UPDATE') {
                                    return {
                                        appointments: state.appointments.map(a => a.id === newAppt.id ? { ...a, ...newAppt } : a)
                                    };
                                }
                                return state;
                            });
                        }
                    )
                    .subscribe();
            },

            unsubscribeFromAppointments: () => {
                supabase.removeChannel(supabase.channel('appointments-realtime'));
            },

            updateClinicDetails: async (details) => {
                set({ clinicDetails: details });
                if (details?.id) {
                    // We primarily assume update happens via specific setters or manual DB edits for now, 
                    // but if we wanted full object sync:
                    /*
                    await supabase.from('clinic_configs').update({
                        name: details.name,
                        address: details.address,
                        // ...
                    }).eq('clinic_id', details.id);
                    */
                }
            },

            importFromGoogle: async () => {
                return true;
            },

            fetchPatients: async () => {
                const { clinicDetails } = get();
                if (!clinicDetails?.id) return;

                const { data, error } = await supabase
                    .from('patients')
                    .select('id, name, phone, is_new, medical_alerts, tags, last_visit')
                    .eq('clinic_id', clinicDetails.id)
                    .limit(500);

                if (error) {
                    console.error("Failed to fetch patients:", error);
                    return;
                }

                if (data) {
                    const patients: PatientShort[] = data.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        phone: p.phone,
                        isNew: p.is_new,
                        medicalAlerts: p.medical_alerts,
                        tags: p.tags,
                        lastVisit: p.last_visit
                    }));
                    set({ patients });
                }
            },

            searchPatients: async (query: string) => {
                const { clinicDetails } = get();
                const localResults = get().patients.filter(p =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.phone.includes(query)
                );

                if (localResults.length > 0) return localResults;

                if (query.length < 3 || !clinicDetails?.id) return [];

                const { data, error } = await supabase
                    .from('patients')
                    .select('id, name, phone')
                    .eq('clinic_id', clinicDetails.id)
                    .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
                    .limit(10);

                if (data) {
                    const serverPatients: PatientShort[] = data.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        phone: p.phone,
                    }));
                    return serverPatients;
                }
                return [];
            }
        }),
        {
            name: 'noble-scheduling-storage-v3',
            version: 3,
            storage: createJSONStorage(() => localStorage),
            migrate: (persistedState: any, version) => {
                if (version < 3) {
                    return {
                        ...DEFAULT_CONFIG,
                        clinicDetails: persistedState.clinicDetails || DEFAULT_CONFIG.clinicDetails
                    };
                }
                return persistedState as SchedulingState;
            },
            partialize: (state) => ({
                clinicDetails: state.clinicDetails,
                bookingMode: state.bookingMode, // We still persist locally for offline start, but fetchClinicConfig will override
                showRevenue: state.showRevenue,
                operatingHours: state.operatingHours,
                chairs: state.chairs,
                breaks: state.breaks
            }),
        }
    )
);



