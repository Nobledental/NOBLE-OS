"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { parseHealthFloID, NOBLE_DENTAL_ID } from "@/lib/id-generator";
import { useSchedulingStore, PROCEDURE_TYPES } from "@/lib/scheduling-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeCheck, Calendar, CheckCircle2, ChevronRight, Clock, FileText, Loader2, MapPin, Phone, ShieldCheck, User, Star, ArrowRight, ArrowLeft, Stethoscope, Activity, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format, addDays, isSameDay, startOfToday } from "date-fns";

export default function PublicBookingPage() {
    const params = useParams();
    const clinicId = params.clinicId as string;
    const store = useSchedulingStore();

    // State
    const [isValidId, setIsValidId] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingStage, setBookingStage] = useState<'details' | 'service' | 'slots' | 'success'>('details');

    // Data State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        reasonId: "", // Procedure ID
        reasonLabel: "", // Procedure Label
        date: "",
        slot: "",
    });

    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [isFetchingSlots, setIsFetchingSlots] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load Clinic Data
    useEffect(() => {
        const parsed = parseHealthFloID(clinicId);
        if (parsed && clinicId === NOBLE_DENTAL_ID) {
            setIsValidId(true);
            if (!store.clinicDetails) {
                store.importFromGoogle().catch(() => { });
            }
        }
        setIsLoading(false);
    }, [clinicId, store]);

    // Fetch Slots when Date or Service Changes
    useEffect(() => {
        if (bookingStage === 'slots' && formData.date && formData.reasonId) {
            fetchSlots();
        }
    }, [formData.date, bookingStage]);

    const fetchSlots = async () => {
        setIsFetchingSlots(true);
        try {
            // Find duration
            const procedure = PROCEDURE_TYPES.find(p => p.id === formData.reasonId);
            const duration = procedure ? procedure.duration : 30;

            // Call Store
            const slots = await store.fetchAvailableSlots(formData.date, store.activeChairs, duration);
            setAvailableSlots(slots);
        } catch (error) {
            toast.error("Could not load slots. Please try another date.");
        } finally {
            setIsFetchingSlots(false);
        }
    };

    const handleNextDetails = () => {
        if (!formData.firstName || !formData.phone) {
            toast.error("Please fill in your name and phone number.");
            return;
        }
        setBookingStage('service');
    };

    const handleSelectService = (id: string, label: string) => {
        setFormData({ ...formData, reasonId: id, reasonLabel: label });
        setBookingStage('slots');
        // Default to today if not set
        if (!formData.date) {
            setFormData(prev => ({ ...prev, date: format(new Date(), 'yyyy-MM-dd') }));
        }
    };

    // Booking Logic
    const handleBook = async () => {
        if (!formData.date || !formData.slot) {
            toast.error("Please select a time slot.");
            return;
        }

        setIsSubmitting(true);
        // Simulate Booking Process
        await new Promise(r => setTimeout(r, 1500));

        // Add to Store (Temporary)
        const newPatientId = crypto.randomUUID();
        store.addPatient({
            id: newPatientId,
            name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            isNew: true
        });

        // Booking Mode Logic
        const initialStatus = store.bookingMode === 'auto' ? 'confirmed' : 'pending';

        store.addAppointment({
            patientId: newPatientId,
            date: formData.date,
            slot: formData.slot,
            type: formData.reasonId, // Pass Procedure ID
            reason: formData.reasonLabel,
            status: initialStatus,
            locationLink: store.clinicDetails?.googleMapsUrl
        });

        setBookingStage('success');
        setIsSubmitting(false);
    };

    if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-black"><Loader2 className="animate-spin text-white w-8 h-8" /></div>;

    if (!isValidId) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black p-6 text-center text-white">
            <h1 className="text-2xl font-black mb-2">Invalid Booking Link</h1>
            <p className="text-slate-400">Please contact the clinic directly.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black font-sans selection:bg-indigo-500 selection:text-white flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">

            {/* Cosmic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[100px] mix-blend-screen opacity-30"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>

            {/* Main Floating Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-5xl bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]"
            >

                {/* LEFT: Branding Panel (Glass) */}
                <div className="lg:w-[40%] p-8 lg:p-12 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-br from-white/5 to-transparent">

                    <div className="space-y-10">
                        {/* Logo Area */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                                    <Sparkles className="w-5 h-5 text-indigo-300" />
                                </div>
                                <span className="text-sm font-bold tracking-widest uppercase text-indigo-300/80">
                                    {store.clinicDetails?.isVerified ? "Verified Partner" : "Partner Clinic"}
                                </span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                                {store.clinicDetails?.name || "Noble Dental Care"}
                            </h1>
                            <p className="text-lg text-slate-400 font-medium mt-2">
                                {store.clinicDetails?.slogan || "Premium Dental Studio"}
                            </p>
                        </div>

                        {/* Stats / Trust */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                    <BadgeCheck className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">World-Class Care</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">Top-rated specialists and sterile environments for your safety.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                                    <Clock className="w-6 h-6 text-teal-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Zero Waiting</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">Book your slot and get treated on time. No crowded waiting rooms.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Location */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <div className="flex items-center gap-3 text-slate-400">
                            <MapPin className="w-5 h-5 text-indigo-400" />
                            <p className="text-sm font-medium">{store.clinicDetails?.address || "Loading location..."}</p>
                        </div>
                        {store.clinicDetails?.websiteUrl && (
                            <a
                                href={store.clinicDetails?.websiteUrl}
                                target="_blank"
                                className="inline-block mt-4 text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors"
                            >
                                Visit Website &rarr;
                            </a>
                        )}
                    </div>
                </div>

                {/* RIGHT: Interaction Area */}
                <div className="lg:w-[60%] bg-black/20 p-6 lg:p-12 flex flex-col relative">
                    {/* Progress Dots */}
                    {bookingStage !== 'success' && (
                        <div className="flex justify-center gap-3 mb-8">
                            {['details', 'service', 'slots'].map((step, i) => {
                                const isActive = step === bookingStage;
                                const isPast = ['details', 'service', 'slots'].indexOf(bookingStage) > i;
                                return (
                                    <div key={step} className={cn(
                                        "h-1.5 rounded-full transition-all duration-500",
                                        isActive ? "w-8 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" : (isPast ? "w-2 bg-indigo-500/40" : "w-2 bg-white/10")
                                    )} />
                                );
                            })}
                        </div>
                    )}

                    <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                        <AnimatePresence mode="wait">

                            {/* STAGE 1: PATIENT DETAILS */}
                            {bookingStage === 'details' && (
                                <motion.div
                                    key="details"
                                    initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center space-y-2">
                                        <h2 className="text-2xl font-black text-white">Welcome Back.</h2>
                                        <p className="text-slate-400">Enter your details to schedule your visit.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold uppercase text-indigo-300 ml-1">First Name</Label>
                                            <Input
                                                value={formData.firstName}
                                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                                placeholder="John"
                                                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl focus:bg-white/10 focus:border-indigo-500/50 transition-all font-medium text-lg"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold uppercase text-indigo-300 ml-1">Last Name</Label>
                                            <Input
                                                value={formData.lastName}
                                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                                placeholder="Doe"
                                                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl focus:bg-white/10 focus:border-indigo-500/50 transition-all font-medium text-lg"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold uppercase text-indigo-300 ml-1">Phone</Label>
                                            <Input
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+91 99999 00000"
                                                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl focus:bg-white/10 focus:border-indigo-500/50 transition-all font-medium text-lg"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleNextDetails}
                                        className="w-full h-14 bg-white text-black hover:bg-indigo-50 rounded-2xl font-bold text-base tracking-wide shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all"
                                    >
                                        Continue <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </motion.div>
                            )}

                            {/* STAGE 2: SERVICE SELECTION */}
                            {bookingStage === 'service' && (
                                <motion.div
                                    key="service"
                                    initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-full text-white/50 hover:text-white hover:bg-white/10" onClick={() => setBookingStage('details')}>
                                            <ArrowLeft className="w-6 h-6" />
                                        </Button>
                                        <h2 className="text-2xl font-black text-white">Select Service</h2>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {PROCEDURE_TYPES.map((proc) => (
                                            <motion.button
                                                key={proc.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleSelectService(proc.id, proc.label)}
                                                className="group relative flex items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-indigo-600/20 hover:border-indigo-500/50 transition-all text-left"
                                            >
                                                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors",
                                                    proc.id === 'emergency' ? "bg-red-500/20 text-red-400" : "bg-white/10 text-indigo-300 group-hover:bg-indigo-500/20 group-hover:text-indigo-300"
                                                )}>
                                                    {proc.id === 'consultation' && <Stethoscope className="w-6 h-6" />}
                                                    {proc.id === 'emergency' && <Activity className="w-6 h-6" />}
                                                    {!['consultation', 'emergency'].includes(proc.id) && <FileText className="w-6 h-6" />}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors">{proc.label}</h3>
                                                    <p className="text-xs text-slate-400 group-hover:text-indigo-300/70">{proc.duration} Minutes • Specialized Care</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* STAGE 3: SLOT SELECTION */}
                            {bookingStage === 'slots' && (
                                <motion.div
                                    key="slots"
                                    initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-full text-white/50 hover:text-white hover:bg-white/10" onClick={() => setBookingStage('service')}>
                                            <ArrowLeft className="w-6 h-6" />
                                        </Button>
                                        <div>
                                            <h2 className="text-xl font-black text-white">Select Time</h2>
                                            <p className="text-indigo-300 text-sm font-bold">{formData.reasonLabel}</p>
                                        </div>
                                    </div>

                                    {/* Date Picker (Horizontal) */}
                                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                                        {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                                            const date = addDays(new Date(), offset);
                                            const dateStr = format(date, 'yyyy-MM-dd');
                                            const isSelected = formData.date === dateStr;
                                            return (
                                                <motion.button
                                                    key={offset}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setFormData({ ...formData, date: dateStr, slot: "" })}
                                                    className={cn(
                                                        "flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center border transition-all relative overflow-hidden",
                                                        isSelected
                                                            ? "border-indigo-500 bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                                            : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20"
                                                    )}
                                                >
                                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{format(date, 'EEE')}</span>
                                                    <span className="text-xl font-black">{format(date, 'd')}</span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    {/* Slots Grid */}
                                    <div className="min-h-[200px]">
                                        {isFetchingSlots ? (
                                            <div className="flex flex-col items-center justify-center h-40 gap-3">
                                                <Loader2 className="animate-spin text-indigo-400 w-8 h-8" />
                                                <p className="text-xs text-indigo-300/50 uppercase tracking-widest animate-pulse">Finding best slots...</p>
                                            </div>
                                        ) : availableSlots.length > 0 ? (
                                            <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                {availableSlots.map((slot, i) => (
                                                    <motion.button
                                                        key={i}
                                                        layout
                                                        onClick={() => setFormData({ ...formData, slot: slot.time })}
                                                        className={cn(
                                                            "py-3 rounded-xl border font-bold text-sm transition-all relative overflow-hidden",
                                                            formData.slot === slot.time
                                                                ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                                                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20"
                                                        )}
                                                    >
                                                        {slot.time.slice(0, 5)}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="h-40 flex flex-col items-center justify-center text-center p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 text-slate-500">
                                                <Calendar className="w-8 h-8 mb-2 opacity-50" />
                                                <p className="text-sm">No slots available.</p>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        onClick={handleBook}
                                        disabled={isSubmitting || !formData.slot}
                                        className="w-full h-14 bg-white text-black hover:bg-emerald-400 hover:text-black rounded-2xl font-bold text-base tracking-wide shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] transition-all disabled:opacity-50 disabled:hover:shadow-none disabled:hover:bg-white"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm Booking"}
                                    </Button>
                                </motion.div>
                            )}

                            {/* STAGE 4: SUCCESS */}
                            {bookingStage === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="text-center space-y-8 py-8"
                                >
                                    <div className="relative inline-block">
                                        <div className={cn(
                                            "w-24 h-24 rounded-full flex items-center justify-center mx-auto relative z-10",
                                            store.bookingMode === 'auto' ? "bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)]" : "bg-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.5)]"
                                        )}>
                                            {store.bookingMode === 'auto' ? (
                                                <CheckCircle2 className="w-12 h-12 text-white" />
                                            ) : (
                                                <Clock className="w-12 h-12 text-white" />
                                            )}
                                        </div>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1.5, opacity: 0 }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className={cn(
                                                "absolute inset-0 rounded-full z-0",
                                                store.bookingMode === 'auto' ? "bg-emerald-500/50" : "bg-amber-500/50"
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-black text-white tracking-tight">
                                            {store.bookingMode === 'auto' ? "Booking Confirmed!" : "Request Received"}
                                        </h2>
                                        <p className="text-slate-400 text-lg">
                                            {store.bookingMode === 'auto'
                                                ? "You are all set for your appointment."
                                                : "We will contact you shortly to confirm."
                                            }
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 text-left space-y-4 backdrop-blur-md">
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service</span>
                                            <span className="font-bold text-white max-w-[200px] truncate text-right">{formData.reasonLabel}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</span>
                                            <span className="font-bold text-white">{formData.date}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time</span>
                                            <span className="font-bold text-emerald-400 text-xl">{formData.slot}</span>
                                        </div>
                                    </div>

                                    <Button onClick={() => window.location.reload()} className="w-full h-14 bg-white/10 hover:bg-white text-white hover:text-black rounded-2xl font-bold transition-all border border-white/20">
                                        Book Another
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
