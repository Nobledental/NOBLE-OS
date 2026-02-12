'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/hooks/use-booking';
import { PROCEDURE_TYPES, useSchedulingStore } from '@/lib/scheduling-store';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Mic, CheckCircle, ChevronRight, AlertCircle, Phone, CreditCard, Star, User } from 'lucide-react';

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
                "group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300",
                "border border-slate-200 bg-white shadow-sm hover:shadow-md",
                state.selectedService === service.id ? "ring-2 ring-brand-primary border-brand-primary" : ""
            )}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img
                    src={SERVICE_IMAGES[service.id] || SERVICE_IMAGES['consultation']}
                    alt={service.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{service.label}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{service.duration} mins</span>
                </div>
            </div>

            {state.selectedService === service.id && (
                <div className="absolute top-3 right-3 bg-brand-primary rounded-full p-1 shadow-lg">
                    <CheckCircle className="w-4 h-4 text-white" />
                </div>
            )}
        </motion.div>
    );

    const SlotBadge = ({ time, isSelected }: { time: string, isSelected: boolean }) => (
        <motion.button
            onClick={() => actions.selectSlot(time)}
            className={cn(
                "relative px-4 py-3 rounded-lg text-sm font-medium transition-all border",
                isSelected
                    ? "bg-brand-primary text-white border-brand-primary shadow-md"
                    : "bg-white text-slate-700 border-slate-200 hover:border-brand-primary/50 hover:bg-slate-50"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {time}
        </motion.button>
    );

    // --- Main Layout ---
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-primary/20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold">N</div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            Noble Dental <span className="text-slate-400 font-normal">Booking</span>
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Panel: Steps */}
                <div className="lg:col-span-8 space-y-8">

                    {/* 1. Service Selection */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm font-bold">1</span>
                            Select Procedure
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {PROCEDURE_TYPES.map(service => (
                                <ServiceCard key={service.id} service={service} />
                            ))}
                        </div>
                    </section>

                    {/* 2. Doctor & Time */}
                    <AnimatePresence mode="wait">
                        {state.selectedService && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* DOCTOR SELECTION */}
                                {state.step === 'doctor' && (
                                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-bold flex items-center gap-2">
                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm font-bold">2</span>
                                                Choose Specialist
                                            </h2>
                                            <Button variant="ghost" size="sm" onClick={() => actions.setStep('service')}>
                                                Change
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {doctors.filter(d => d.isAvailable).map((doctor) => (
                                                <div
                                                    key={doctor.id}
                                                    onClick={() => actions.selectDoctor(doctor.id)}
                                                    className={cn(
                                                        "group relative rounded-xl cursor-pointer transition-all duration-200",
                                                        "border p-4 flex items-center gap-4 hover:shadow-md",
                                                        state.selectedDoctor === doctor.id
                                                            ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary"
                                                            : "border-slate-200 bg-white hover:border-brand-primary/50"
                                                    )}
                                                >
                                                    <div className="relative w-16 h-16 rounded-full overflow-hidden border border-slate-200 shrink-0">
                                                        <img
                                                            src={doctor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.id}`}
                                                            alt={doctor.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                                                            {doctor.name}
                                                        </h3>
                                                        <p className="text-sm text-slate-500">{doctor.specialty}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex items-center text-amber-500 text-xs gap-0.5">
                                                                <Star size={12} fill="currentColor" />
                                                                <span className="text-slate-700 font-medium">{doctor.rating}</span>
                                                            </div>
                                                            <span className="text-xs text-slate-400">• {doctor.experience} yrs exp</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* DATE & TIME */}
                                {(state.step === 'date' || state.step === 'summary') && (
                                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-bold flex items-center gap-2">
                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm font-bold">3</span>
                                                Select Time
                                            </h2>
                                            <Button variant="ghost" size="sm" onClick={() => actions.setStep('doctor')}>
                                                Back
                                            </Button>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-8">
                                            {/* Date Scroller */}
                                            <div className="flex-1">
                                                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                                    {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                                                        const d = new Date();
                                                        d.setDate(d.getDate() + offset);
                                                        const isSelected = state.selectedDate?.toDateString() === d.toDateString();

                                                        return (
                                                            <button
                                                                key={offset}
                                                                onClick={() => actions.selectDate(d)}
                                                                className={cn(
                                                                    "flex flex-col items-center justify-center w-16 h-20 rounded-xl border transition-all",
                                                                    isSelected
                                                                        ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-105"
                                                                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                                                                )}
                                                            >
                                                                <span className="text-xs font-medium uppercase">{format(d, 'EEE')}</span>
                                                                <span className="text-xl font-bold">{format(d, 'd')}</span>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Slot Grid */}
                                            <div className="flex-[2]">
                                                {loadingSlots ? (
                                                    <div className="flex items-center justify-center h-32">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
                                                    </div>
                                                ) : availableSlots.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center h-32 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                                                        <AlertCircle className="w-5 h-5 mb-2" />
                                                        <p className="text-sm">No slots available</p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
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
                                    </div>
                                )}
                            </motion.section>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Panel: Summary */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24">
                        <AnimatePresence>
                            {state.selectedSlot && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl"
                                >
                                    <h2 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Confirm Booking</h2>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="Enter your name"
                                                value={state.patientDetails.name}
                                                onChange={(e) => actions.updatePatientDetails('name', e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
                                            <input
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                value={state.patientDetails.phone}
                                                onChange={(e) => actions.updatePatientDetails('phone', e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</label>
                                            <textarea
                                                placeholder="Describe your issue..."
                                                value={state.patientDetails.notes}
                                                onChange={(e) => actions.updatePatientDetails('notes', e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all min-h-[80px] resize-none"
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                onClick={actions.confirmBooking}
                                                disabled={state.isSubmitting || !state.patientDetails.name || !state.patientDetails.phone}
                                                className="w-full h-12 text-base font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.02]"
                                            >
                                                {state.isSubmitting ? 'Confirming...' : 'Book Appointment'}
                                            </Button>
                                            <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Secure Booking
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </main>

            {/* Success Overlay */}
            <AnimatePresence>
                {state.step === 'success' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Confirmed!</h2>
                            <p className="text-slate-600 mb-8">
                                Your appointment for <strong>{state.selectedService}</strong> has been secured.
                            </p>
                            <Button
                                onClick={actions.resetRaw}
                                variant="outline"
                                className="w-full h-12"
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
