'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/hooks/use-booking';
import { PROCEDURE_TYPES, useSchedulingStore } from '@/lib/scheduling-store';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Clock, Mic, CheckCircle, ChevronRight, AlertCircle, Phone, CreditCard, Star, User, MapPin, ArrowLeft, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Calendar } from '@/components/ui/calendar'; // Removed as per request for horizontal row
import { format, addDays, isSameDay, isBefore, startOfDay } from 'date-fns';

// --- Improved Asset Mapping ---
const SERVICE_IMAGES: Record<string, string> = {
    'consultation': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400',
    'dental_cleaning': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=400',
    'root_canal': 'https://images.unsplash.com/photo-1609840114035-1c29046a8af3?auto=format&fit=crop&q=80&w=400',
    'extraction': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400',
    'whitening': 'https://images.unsplash.com/photo-1598256989494-02638511db58?auto=format&fit=crop&q=80&w=400',
    'veneers': 'https://images.unsplash.com/photo-1600170486025-69695666d6d8?auto=format&fit=crop&q=80&w=400',
    'emergency': 'https://images.unsplash.com/photo-1516574187841-693083f0cc8d?auto=format&fit=crop&q=80&w=400',
};

export function AppointmentGrid() {
    const { state, availableSlots, loadingSlots, actions } = useBooking();
    const { doctors, clinicDetails } = useSchedulingStore();

    // Helper to calculate progress
    const getProgress = () => {
        if (state.step === 'success') return 100;
        if (state.step === 'summary') return 90;
        if (state.step === 'date') return 66;
        if (state.step === 'doctor') return 33;
        return 10;
    };

    // --- Sub-Components ---

    const SectionHeader = ({ step, title, subtitle }: { step: number, title: string, subtitle: string }) => (
        <div className="mb-6">
            <span className="text-xs font-bold tracking-widest text-brand-primary/80 uppercase mb-2 block">Step 0{step}</span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{title}</h2>
            <p className="text-slate-500">{subtitle}</p>
        </div>
    );

    return (
        <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-4 lg:p-6 font-sans overflow-hidden">
            <div className="bg-white w-full max-w-6xl max-h-[90vh] min-h-[600px] h-auto rounded-[2rem] shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row relative ring-1 ring-slate-900/5 overflow-hidden">

                {/* --- Left Panel: Steps & Interaction --- */}
                <div className="flex-1 flex flex-col relative z-10">
                    {/* Header */}
                    <header className="p-8 flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                                <Sparkles className="w-5 h-5 text-white" fill="currentColor" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900 leading-tight">Noble Dental</h1>
                                <p className="text-xs text-slate-400 font-medium">Nallagandla Branch</p>
                            </div>
                        </div>

                        {/* Progress Indicator */}
                        <div className="hidden md:flex flex-col items-end gap-1">
                            <span className="text-xs font-semibold text-slate-400">Booking Progress</span>
                            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-brand-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${getProgress()}%` }}
                                    transition={{ duration: 0.5, ease: "circOut" }}
                                />
                            </div>
                        </div>
                    </header>

                    {/* Main Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-8 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
                        <AnimatePresence mode="wait">

                            {/* STEP 1: SERVICE */}
                            {state.step === 'service' && (
                                <motion.div
                                    key="step-service"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="max-w-3xl"
                                >
                                    <SectionHeader step={1} title="What brings you in?" subtitle="Select a service to find the right specialist for you." />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {PROCEDURE_TYPES.map(service => (
                                            <motion.button
                                                key={service.id}
                                                onClick={() => actions.selectService(service.id)}
                                                whileHover={{ y: -4, shadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                                                whileTap={{ scale: 0.98 }}
                                                className="group relative flex flex-col text-left bg-white border border-slate-100 rounded-3xl p-2 hover:border-brand-primary/20 transition-all shadow-sm"
                                            >
                                                <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 mb-3 relative">
                                                    <img
                                                        src={SERVICE_IMAGES[service.id] || SERVICE_IMAGES['consultation']}
                                                        alt={service.label}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                                        <span className="text-xs font-medium bg-white/20 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                                                            {service.duration} mins
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="px-2 pb-2">
                                                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-brand-primary transition-colors">{service.label}</h3>
                                                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">Professional care for your dental needs.</p>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: DOCTOR */}
                            {state.step === 'doctor' && (
                                <motion.div
                                    key="step-doctor"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="max-w-3xl"
                                >
                                    <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all text-slate-400 hover:text-slate-900" onClick={() => actions.setStep('service')}>
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
                                    </Button>
                                    <SectionHeader step={2} title="Choose your Expert" subtitle="Our specialists are rated 4.9/5 by 2000+ patients." />

                                    <div className="grid grid-cols-1 gap-4">
                                        {doctors.filter(d => d.isAvailable).map((doctor) => (
                                            <div
                                                key={doctor.id}
                                                onClick={() => actions.selectDoctor(doctor.id)}
                                                className="group flex flex-col sm:flex-row items-center gap-6 bg-white border border-slate-100 p-6 rounded-[2rem] cursor-pointer hover:border-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/5 transition-all relative overflow-hidden"
                                            >
                                                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-md">
                                                    <img
                                                        src={doctor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.id}`}
                                                        alt={doctor.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 text-center sm:text-left">
                                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                                        <h3 className="text-xl font-bold text-slate-900">{doctor.name}</h3>
                                                        <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-50" />
                                                    </div>
                                                    <p className="text-slate-500 font-medium mb-3">{doctor.specialty}</p>
                                                    <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-slate-400">
                                                        <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {doctor.rating}</span>
                                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                        <span>{doctor.experience} yrs exp</span>
                                                    </div>
                                                </div>
                                                <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:text-white transition-all">
                                                    <ChevronRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: DATE & TIME */}
                            {(state.step === 'date' || state.step === 'summary') && (
                                <motion.div
                                    key="step-date"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="max-w-3xl"
                                >
                                    <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all text-slate-400 hover:text-slate-900" onClick={() => actions.setStep('doctor')}>
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Specialists
                                    </Button>
                                    <SectionHeader step={3} title="When works best?" subtitle="Book a guaranteed slot. No wait times." />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Date Calendar */}
                                        {/* Date Scroller */}
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Select Date</h3>
                                            <div className="flex overflow-x-auto gap-3 pb-4 custom-scrollbar snap-x">
                                                {Array.from({ length: 14 }).map((_, i) => {
                                                    const date = addDays(new Date(), i);
                                                    const isSelected = state.selectedDate && isSameDay(date, state.selectedDate);
                                                    return (
                                                        <button
                                                            key={i}
                                                            onClick={() => actions.selectDate(date)}
                                                            className={cn(
                                                                "flex flex-col items-center justify-center min-w-[70px] h-20 rounded-2xl border transition-all snap-start",
                                                                isSelected
                                                                    ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105"
                                                                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900"
                                                            )}
                                                        >
                                                            <span className="text-xs font-semibold uppercase">{format(date, 'EEE')}</span>
                                                            <span className="text-xl font-bold">{format(date, 'd')}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Time Slots */}
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Available Slots</h3>

                                            <div className="bg-slate-50/50 rounded-3xl p-6 min-h-[300px]">
                                                {loadingSlots ? (
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                                            <div key={i} className="h-10 bg-slate-200 rounded-xl animate-pulse" />
                                                        ))}
                                                    </div>
                                                ) : availableSlots.filter(slot => {
                                                    if (!state.selectedDate) return false;
                                                    // Filter past slots if today
                                                    if (isSameDay(state.selectedDate, new Date())) {
                                                        const slotDate = new Date(slot.start);
                                                        return isBefore(new Date(), slotDate);
                                                    }
                                                    return true;
                                                }).length > 0 ? (
                                                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
                                                        {availableSlots
                                                            .filter(slot => {
                                                                if (!state.selectedDate) return false;
                                                                if (isSameDay(state.selectedDate, new Date())) {
                                                                    const slotDate = new Date(slot.start);
                                                                    return isBefore(new Date(), slotDate);
                                                                }
                                                                return true;
                                                            })
                                                            .map((slot, i) => {
                                                                const isFull = slot.available === 0;
                                                                const isEmergency = state.selectedService === 'emergency';
                                                                const isDisabled = isFull && !isEmergency;

                                                                return (
                                                                    <motion.div
                                                                        key={i}
                                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        transition={{ delay: i * 0.02 }}
                                                                    >
                                                                        <button
                                                                            onClick={() => actions.selectSlot(slot.start)}
                                                                            disabled={isDisabled}
                                                                            className={cn(
                                                                                "w-full h-14 rounded-xl text-xs font-bold transition-all border-2 relative overflow-hidden flex flex-col items-center justify-center gap-0.5",
                                                                                state.selectedSlot === slot.start
                                                                                    ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105"
                                                                                    : isDisabled
                                                                                        ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-50"
                                                                                        : "bg-white border-slate-200 text-slate-600 hover:border-brand-primary/50 hover:shadow-md hover:-translate-y-0.5"
                                                                            )}
                                                                        >
                                                                            <span className="text-sm">{format(new Date(slot.start), 'h:mm a')}</span>
                                                                            {!isFull && state.selectedSlot !== slot.start && <span className="text-[9px] font-medium opacity-50">{slot.available} Left</span>}
                                                                            {isFull && isEmergency && <span className="text-[9px] text-red-500">OVERBOOK</span>}
                                                                        </button>
                                                                    </motion.div>
                                                                );
                                                            })}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                                        <Clock className="w-8 h-8 mb-2 opacity-50" />
                                                        <p className="text-sm">No slots available for this date.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: SUMMARY & FORM */}
                            {state.step === 'summary' && (
                                <motion.div
                                    key="step-summary"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="max-w-3xl mt-8 pt-8 border-t border-slate-100"
                                >
                                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5 text-brand-primary" />
                                            Confirm Details
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                                                    <Input
                                                        placeholder="Enter your name"
                                                        className="h-12 rounded-xl border-slate-200 bg-white text-slate-900 font-medium text-lg placeholder:text-slate-300 focus-visible:ring-brand-primary"
                                                        value={state.patientDetails.name}
                                                        onChange={(e) => actions.updatePatientDetails('name', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Phone Number</label>
                                                    <Input
                                                        placeholder="10-digit number"
                                                        className="h-12 rounded-xl border-slate-200 bg-white text-slate-900 font-medium text-lg placeholder:text-slate-300 focus-visible:ring-brand-primary"
                                                        value={state.patientDetails.phone}
                                                        onChange={(e) => actions.updatePatientDetails('phone', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email (Optional)</label>
                                                    <Input
                                                        placeholder="For confirmation"
                                                        className="h-12 rounded-xl border-slate-200 bg-white text-slate-900 font-medium text-lg placeholder:text-slate-300 focus-visible:ring-brand-primary"
                                                        value={state.patientDetails.email || ''}
                                                        onChange={(e) => actions.updatePatientDetails('email', e.target.value)}
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Notes / Symptoms</label>
                                                    <div className="relative">
                                                        <Input
                                                            placeholder="Describe pain, etc."
                                                            className="h-12 rounded-xl border-slate-200 bg-white text-slate-900 font-medium text-lg placeholder:text-slate-300 focus-visible:ring-brand-primary pr-12"
                                                            value={state.patientDetails.notes}
                                                            onChange={(e) => actions.updatePatientDetails('notes', e.target.value)}
                                                        />
                                                        <button
                                                            onClick={actions.startVoiceInput}
                                                            className={cn(
                                                                "absolute right-2 top-2 p-2 rounded-lg transition-all",
                                                                state.voiceListening ? "bg-red-50 text-red-500 animate-pulse" : "bg-slate-100 text-slate-400 hover:text-brand-primary"
                                                            )}
                                                        >
                                                            <Mic className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Family Checkbox */}
                                                <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50">
                                                    <div className="flex items-center h-5">
                                                        <input
                                                            id="family-mode"
                                                            type="checkbox"
                                                            checked={state.patientDetails.isFamily}
                                                            onChange={(e) => actions.updatePatientDetails('isFamily', e.target.checked)}
                                                            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                    <div className="text-sm">
                                                        <label htmlFor="family-mode" className="font-bold text-slate-700 block">Booking for a family member?</label>
                                                        <p className="text-slate-500 text-xs">We'll ask for their specific details when you arrive.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <Button
                                                onClick={actions.confirmBooking}
                                                disabled={state.isSubmitting || !state.patientDetails.name || !state.patientDetails.phone}
                                                className="w-full h-14 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white text-lg font-bold shadow-lg shadow-brand-primary/25 transition-all hover:scale-[1.01]"
                                            >
                                                {state.isSubmitting ? (
                                                    <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Confirming...</span>
                                                ) : "Confirm Appointment"}
                                            </Button>
                                            <p className="text-center text-xs text-slate-400 mt-4">
                                                By booking, you agree to our terms. No payment required now.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>

                {/* --- Right Panel: Summary & Context --- */}
                <div className="w-full lg:w-[400px] xl:w-[450px] bg-slate-50/50 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-slate-200 p-8 flex flex-col relative">

                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Booking Summary</h3>

                    {/* Summary Card */}
                    <div className="flex-1 space-y-6">

                        {/* Service Context */}
                        <div className={cn("transition-all duration-500", state.selectedService ? "opacity-100 translate-x-0" : "opacity-50 translate-x-4 grayscale blur-[1px]")}>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-5 h-5 text-indigo-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Procedure</p>
                                    <p className="text-lg font-bold text-slate-900">{PROCEDURE_TYPES.find(p => p.id === state.selectedService)?.label || 'Not selected'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Doctor Context */}
                        <div className={cn("transition-all duration-500 delay-100", state.selectedDoctor ? "opacity-100 translate-x-0" : "opacity-30 translate-x-4 blur-[1px]")}>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5 text-teal-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Specialist</p>
                                    <p className="text-lg font-bold text-slate-900">{doctors.find(d => d.id === state.selectedDoctor)?.name || 'Not selected'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Time Context */}
                        <div className={cn("transition-all duration-500 delay-200", state.selectedSlot ? "opacity-100 translate-x-0" : "opacity-30 translate-x-4 blur-[1px]")}>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                    <CalendarIcon className="w-5 h-5 text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Schedule</p>
                                    <p className="text-lg font-bold text-slate-900">
                                        {state.selectedDate ? format(new Date(state.selectedDate), 'MMM do') : '--'}
                                        <span className="text-slate-400 font-normal"> at </span>
                                        {state.selectedSlot ? format(new Date(state.selectedSlot), 'h:mm a') : '--'}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>



                    {/* Location Badge */}
                    {!state.selectedSlot && clinicDetails && (
                        <div className="mt-auto bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-slate-500" />
                            </div>
                            <div className="text-xs">
                                <p className="font-bold text-slate-900">{clinicDetails.name}</p>
                                <p className="text-slate-500 truncate max-w-[200px]">{clinicDetails.address}</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Success Overlay */}
            <AnimatePresence>
                {state.step === 'success' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white p-12 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-indigo-500" />

                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                >
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                </motion.div>
                                <div className="absolute inset-0 border-4 border-green-100 rounded-full animate-ping opacity-20" />
                            </div>

                            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">You're Booked!</h2>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                We've sent a confirmation to <span className="text-slate-900 font-semibold">{state.patientDetails.phone}</span>.
                                See you on <span className="text-brand-primary font-bold">{state.selectedDate && format(state.selectedDate, 'EEEE, d MMM')}</span>.
                            </p>

                            <Button
                                onClick={actions.resetRaw}
                                variant="outline"
                                className="w-full h-14 rounded-xl border-2 hover:bg-slate-50 font-bold"
                            >
                                Book for Someone Else
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
