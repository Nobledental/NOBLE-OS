'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { createBooking } from '@/app/actions/booking'; // We will create this next
import { PROCEDURE_TYPES } from '@/lib/scheduling-store';

export type BookingStep = 'service' | 'doctor' | 'date' | 'summary' | 'success';

interface BookingState {
    step: BookingStep;
    bookingType: 'standard' | 'academic';
    selectedService: string | null;
    selectedDoctor: string | null;
    selectedDate: Date | null;
    selectedSlot: string | null;
    patientDetails: {
        name: string;
        phone: string;
        email?: string;
        notes: string;
    };
    voiceListening: boolean;
    isSubmitting: boolean;
}

const INITIAL_STATE: BookingState = {
    step: 'service',
    bookingType: 'standard', // 'academic' for lower rates/students
    selectedService: null,
    selectedDoctor: null,
    selectedDate: new Date(),
    selectedSlot: null,
    patientDetails: {
        name: '',
        phone: '',
        notes: ''
    },
    voiceListening: false,
    isSubmitting: false
};

export function useBooking() {
    const [state, setState] = useState<BookingState>(INITIAL_STATE);
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // --- Voice Input Logic ---
    const startVoiceInput = useCallback(() => {
        if (!('webkitSpeechRecognition' in window)) {
            toast.error("Voice input is not supported in this browser.");
            return;
        }

        // @ts-ignore - Web Speech API
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN'; // Default to Indian English

        recognition.onstart = () => {
            setState(prev => ({ ...prev, voiceListening: true }));
            toast.info("Listening... Describe your symptoms.");
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;

            // Simple keyword parsing for "Reason for visit"
            let detectedService = state.selectedService;
            const lowerTranscript = transcript.toLowerCase();

            if (lowerTranscript.includes("root canal") || lowerTranscript.includes("pain")) {
                detectedService = 'root_canal';
            } else if (lowerTranscript.includes("clean")) {
                detectedService = 'dental_cleaning';
            }

            setState(prev => ({
                ...prev,
                patientDetails: {
                    ...prev.patientDetails,
                    notes: prev.patientDetails.notes ? `${prev.patientDetails.notes} ${transcript}` : transcript
                },
                selectedService: detectedService || prev.selectedService,
                voiceListening: false
            }));

            toast.success("Note added from voice!");
        };

        recognition.onerror = (event: any) => {
            console.error(event.error);
            setState(prev => ({ ...prev, voiceListening: false }));
            toast.error("Voice recognition failed.");
        };

        recognition.onend = () => {
            setState(prev => ({ ...prev, voiceListening: false }));
        };

        recognition.start();
    }, [state.selectedService]);

    // --- Actions ---

    const setBookingType = (type: 'standard' | 'academic') => {
        setState(prev => ({ ...prev, bookingType: type }));
        // Reset slots if type changes as academic might have different slots
        setAvailableSlots([]);
    };

    const selectService = (serviceId: string) => {
        // If service is "Cosmetic" (e.g. Veneers), we might want to show Simulator first? 
        // For now, standard flow: Service -> Doctor -> Date
        setState(prev => ({ ...prev, selectedService: serviceId, step: 'doctor' }));
    };

    const selectDoctor = (doctorId: string) => {
        setState(prev => ({ ...prev, selectedDoctor: doctorId, step: 'date' }));
    };

    const selectDate = (date: Date) => {
        setState(prev => ({ ...prev, selectedDate: date, selectedSlot: null }));
    };

    const selectSlot = (slotTime: string) => {
        setState(prev => ({ ...prev, selectedSlot: slotTime, step: 'summary' }));
    };

    const updatePatientDetails = (field: string, value: string) => {
        setState(prev => ({
            ...prev,
            patientDetails: { ...prev.patientDetails, [field]: value }
        }));
    };

    // --- Data Fetching ---

    useEffect(() => {
        if (state.selectedDate && state.selectedService) {
            fetchSlots();
        }
    }, [state.selectedDate, state.selectedService, state.bookingType, state.selectedDoctor]);

    const fetchSlots = async () => {
        if (!state.selectedDate || !state.selectedService) return;

        setLoadingSlots(true);
        try {
            const dateStr = state.selectedDate.toISOString().split('T')[0];
            const service = PROCEDURE_TYPES.find(p => p.id === state.selectedService);
            const duration = service ? service.duration : 30;

            // Call API (optionally pass doctorId if backend supports it)
            const doctorParam = state.selectedDoctor ? `&doctorId=${state.selectedDoctor}` : '';
            const res = await fetch(`/api/calendar/availability?date=${dateStr}&duration=${duration}${doctorParam}`);
            const data = await res.json();

            if (data.slots) {
                setAvailableSlots(data.slots);
            }
        } catch (error) {
            console.error("Failed to fetch slots", error);
            toast.error("Could not load available times.");
        } finally {
            setLoadingSlots(false);
        }
    };

    // --- Submission ---

    const confirmBooking = async () => {
        if (!state.selectedSlot || !state.selectedDate || !state.selectedService) return;

        setState(prev => ({ ...prev, isSubmitting: true }));

        try {
            const result = await createBooking({
                patientName: state.patientDetails.name,
                patientPhone: state.patientDetails.phone,
                patientEmail: state.patientDetails.email,
                serviceId: state.selectedService,
                doctorId: state.selectedDoctor || undefined,
                date: state.selectedDate.toISOString(),
                startTime: state.selectedSlot,
                notes: state.patientDetails.notes,
                type: state.bookingType
            });

            if (result.success) {
                setState(prev => ({ ...prev, step: 'success' }));
                toast.success("Appointment Confirmed!");
            } else {
                toast.error(result.error || "Booking failed.");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        } finally {
            setState(prev => ({ ...prev, isSubmitting: false }));
        }
    };

    return {
        state,
        availableSlots,
        loadingSlots,
        setLoadingSlots, // Expose for immediate UI feedback
        setBookingType,
        selectService,
        selectDoctor,
        selectDate: (date: Date) => {
            setLoadingSlots(true); // Immediate feedback
            selectDate(date);
        },
        selectSlot,
        updatePatientDetails,
        startVoiceInput,
        confirmBooking,
        // @ts-ignore
        setStep: (step: BookingStep) => setState(prev => ({ ...prev, step })),
        resetRaw: () => setState(INITIAL_STATE)
    }
};

