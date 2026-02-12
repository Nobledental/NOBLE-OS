'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/hooks/use-booking';
import { PROCEDURE_TYPES, useSchedulingStore } from '@/lib/scheduling-store';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Mic, CheckCircle, ChevronRight, AlertCircle, Phone, CreditCard, Star, User } from 'lucide-react';
import { TreatmentSimulator } from './treatment-simulator';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

// --- Assets Mapping (Mock for now, replace with real images) ---
const SERVICE_IMAGES: Record<string, string> = {
    'consultation': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
    'dental_cleaning': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80',
    'root_canal': 'https://images.unsplash.com/photo-1609840114035-1c29046a8af3?w=800&q=80',
    'extraction': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
    'follow_up': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    'emergency': 'https://images.unsplash.com/photo-1516574187841-693083f0cc8d?w=800&q=80',
};

export function AppointmentGrid() {
    const { state, availableSlots, loadingSlots, actions } = useBooking();
    const { doctors } = useSchedulingStore();

    // --- Components ---

    const ServiceCard = ({ service }: { service: typeof PROCEDURE_TYPES[0] }) => (
        <motion.div
            layoutId={`service-${service.id}`}
            onClick={() => actions.selectService(service.id)}
            className={cn(
                "group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300",
                "border border-white/10 bg-white/5 hover:bg-white/10",
                state.selectedService === service.id ? "ring-2 ring-indigo-500 bg-white/10" : ""
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                    src={SERVICE_IMAGES[service.id] || SERVICE_IMAGES['consultation']}
                    alt={service.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">{service.label}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/70">
                            <Clock className="w-3 h-3" />
                            <span>{service.duration} mins</span>
                        </div>
                    </div>
                </div>
            </div>

            {state.selectedService === service.id && (
                <motion.div
                    layoutId="service-check"
                    className="absolute top-3 right-3 bg-indigo-500 rounded-full p-1"
                >
                    <CheckCircle className="w-4 h-4 text-white" />
                </motion.div>
            )}
        </motion.div>
    );

    const SlotBadge = ({ time, isSelected }: { time: string, isSelected: boolean }) => (
        <motion.button
            onClick={() => actions.selectSlot(time)}
            className={cn(
                "relative px-4 py-2 rounded-xl text-sm font-medium transition-all",
                isSelected
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {time}
        </motion.button>
    );

    // --- Main Layout ---
    return (
        <div className="min-h-screen bg-black text-white p-4 lg:p-8 font-sans selection:bg-indigo-500/30">
            {/* HUD Header */}
            <header className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-teal-400">
                        HealthFlo <span className="text-white/40 font-light">Booking</span>
                    </h1>
                </div>

                {/* Dual Logic Switch */}
                <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
                    <button
                        onClick={() => actions.setBookingType('standard')}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                            state.bookingType === 'standard' ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                        )}
                    >
                        Standard
                    </button>
                    <button
                        onClick={() => actions.setBookingType('academic')}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                            state.bookingType === 'academic' ? "bg-indigo-500/20 text-indigo-300" : "text-white/50 hover:text-white"
                        )}
                    >
                        Academic
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                {/* Left Panel: Service & Time (Glass-Bento) */}
                <div className="lg:col-span-8 space-y-8">

                    {/* 1. Service Selection */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span className="bg-indigo-500 w-1 h-6 rounded-full" />
                            Select Procedure
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {PROCEDURE_TYPES.map(service => (
                                <ServiceCard key={service.id} service={service} />
                            ))}
                        </div>
                    </section>

                    {/* 2. Date & Time (Show only if Service Selected) */}
                    <AnimatePresence mode="wait">
                        {state.selectedService && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
                            >
                                {/* DOCTOR SELECTION STEP */}
                                {state.step === 'doctor' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                                <span className="bg-indigo-500 w-1 h-6 rounded-full" />
                                                Choose Your Specialist
                                            </h2>
                                            <Button variant="ghost" className="text-white/40 hover:text-white" onClick={() => actions.setStep('service')}>
                                                Change Service
                                            </Button>
                                        </div>

                                        {/* TREATMENT SIMULATOR */}
                                        {(state.selectedService === 'whitening' || state.selectedService === 'veneers') && (
                                            <div className="mb-8 p-1">
                                                <TreatmentSimulator type={state.selectedService as any} />
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {doctors.filter(d => d.isAvailable).map((doctor) => (
                                                <motion.div
                                                    key={doctor.id}
                                                    onClick={() => actions.selectDoctor(doctor.id)}
                                                    className={cn(
                                                        "group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300",
                                                        "border border-white/10 bg-white/5 hover:bg-white/10 p-4 flex items-center gap-4",
                                                        state.selectedDoctor === doctor.id ? "ring-2 ring-indigo-500 bg-white/10" : ""
                                                    )}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 shrink-0">
                                                        <img
                                                            src={doctor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.id}`}
                                                            alt={doctor.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-white font-medium group-hover:text-indigo-300 transition-colors truncate">
                                                            {doctor.name}
                                                        </h3>
                                                        <p className="text-sm text-white/50 truncate">{doctor.specialty}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex items-center text-yellow-500 text-xs gap-0.5">
                                                                <Star size={12} fill="currentColor" />
                                                                <span className="text-white/70">{doctor.rating}</span>
                                                            </div>
                                                            <span className="text-xs text-white/30 truncate">• {doctor.experience} yrs exp</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 transition-colors shrink-0">
                                                        <ChevronRight size={16} className="text-white/50 group-hover:text-white" />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* DATE & SLOT SELECTION */}
                                {(state.step === 'date' || state.step === 'summary') && (
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Date Picker (Simplified) */}
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Date</h3>
                                            {/* Simple horizontal date scroller for demo */}
                                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                                {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                                                    const d = new Date();
                                                    d.setDate(d.getDate() + offset);
                                                    const isSelected = state.selectedDate?.toDateString() === d.toDateString();

                                                    return (
                                                        <button
                                                            key={offset}
                                                            onClick={() => actions.selectDate(d)}
                                                            className={cn(
                                                                "flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition-all",
                                                                isSelected
                                                                    ? "bg-indigo-500 border-indigo-400 shadow-lg shadow-indigo-500/20 scale-105"
                                                                    : "bg-black/40 border-white/10 hover:border-white/30 text-white/60 hover:text-white"
                                                            )}
                                                        >
                                                            <span className="text-xs">{format(d, 'EEE')}</span>
                                                            <span className="text-xl font-bold">{format(d, 'd')}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Slots */}
                                        <div className="flex-[2]">
                                            <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Availability</h3>

                                            {loadingSlots ? (
                                                <div className="flex items-center justify-center h-32">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                                </div>
                                            ) : availableSlots.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center h-32 text-white/40 border border-dashed border-white/10 rounded-xl">
                                                    <AlertCircle className="w-6 h-6 mb-2" />
                                                    <p>No slots available</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                                    {availableSlots.map((slot: any) => (
                                                        <SlotBadge
                                                            key={slot.time}
                                                            time={slot.time}
                                                            isSelected={state.selectedSlot === slot.time}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.section>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Panel: Summary & Details (Stick) */}
                <div className="lg:col-span-4">
                    <div className="sticky top-8">
                        <AnimatePresence>
                            {state.selectedSlot && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden"
                                >
                                    {/* Decorative Blur */}
                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />

                                    <h2 className="text-xl font-semibold mb-6">Patient Details</h2>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs text-white/50 uppercase tracking-widest pl-1">Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                value={state.patientDetails.name}
                                                onChange={(e) => actions.updatePatientDetails('name', e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs text-white/50 uppercase tracking-widest pl-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                value={state.patientDetails.phone}
                                                onChange={(e) => actions.updatePatientDetails('phone', e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            />
                                        </div>

                                        {/* Voice Note Input */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs text-white/50 uppercase tracking-widest pl-1">Notes / Symptoms</label>
                                                <button
                                                    onClick={actions.startVoiceInput}
                                                    className={cn(
                                                        "text-xs flex items-center gap-1 transition-colors px-2 py-0.5 rounded-full",
                                                        state.voiceListening ? "bg-red-500/20 text-red-400 animate-pulse" : "text-indigo-400 hover:text-indigo-300"
                                                    )}
                                                >
                                                    <Mic className="w-3 h-3" />
                                                    {state.voiceListening ? 'Listening...' : 'Use Voice'}
                                                </button>
                                            </div>
                                            <textarea
                                                placeholder="Describe your pain or requirements..."
                                                value={state.patientDetails.notes}
                                                onChange={(e) => actions.updatePatientDetails('notes', e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[80px]"
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                onClick={actions.confirmBooking}
                                                disabled={state.isSubmitting || !state.patientDetails.name || !state.patientDetails.phone}
                                                className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-white/90 rounded-xl shadow-lg shadow-white/10 transition-all hover:scale-[1.02]"
                                            >
                                                {state.isSubmitting ? 'Processing...' : 'Confirm Appointment'}
                                            </Button>
                                            <p className="text-center text-xs text-white/30 mt-3 flex items-center justify-center gap-1">
                                                Verified by Google Calendar <CheckCircle className="w-3 h-3" />
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
                {state.step === 'success' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] max-w-md w-full text-center shadow-2xl"
                        >
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                            <p className="text-white/60 mb-8">
                                Your appointment for <strong>{state.selectedService}</strong> has been scheduled.
                                A calendar invite has been sent to your device.
                            </p>
                            <Button
                                onClick={actions.resetRaw}
                                className="w-full bg-white text-black hover:bg-zinc-200 rounded-xl h-12"
                            >
                                Book Another
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
