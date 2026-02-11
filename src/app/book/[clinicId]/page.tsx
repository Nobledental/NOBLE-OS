"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { parseHealthFloID, NOBLE_DENTAL_ID } from "@/lib/id-generator";
import { useSchedulingStore, PROCEDURE_TYPES } from "@/lib/scheduling-store"; // Import Types
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeCheck, Calendar, CheckCircle2, ChevronRight, Clock, FileText, Loader2, MapPin, Phone, ShieldCheck, User, Star, ArrowRight, ArrowLeft, Stethoscope, Activity } from "lucide-react";
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

    if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-white"><Loader2 className="animate-spin text-black w-8 h-8" /></div>;

    if (!isValidId) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <h1 className="text-2xl font-black text-black mb-2">Invalid Booking Link</h1>
            <p className="text-slate-700">Please contact the clinic directly for a valid appointment link.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white flex flex-col lg:flex-row">

            {/* LEFT SIDE: Brand & Info (Professional Dark) */}
            <div className="lg:w-[45%] bg-black text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10 space-y-12">
                    {/* Header/Logo */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                                <span className="text-2xl font-black text-black">
                                    {(store.clinicDetails?.name || "Noble")[0]}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    {store.clinicDetails?.name || "Noble Dental Care"}
                                </h1>
                                <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">
                                    {store.clinicDetails?.slogan || "Premium Dental Studio"}
                                </p>
                            </div>
                        </div>

                        {store.clinicDetails?.isVerified && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-wider">
                                <BadgeCheck className="w-4 h-4" />
                                Verified Medical Center
                            </div>
                        )}
                    </div>

                    {/* Value Props */}
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-[1.1] text-white">
                                World-Class <br />
                                <span className="text-blue-500">Dental Care.</span>
                            </h2>
                            <p className="text-lg text-slate-400 max-w-sm leading-relaxed">
                                Schedule your premium consultation. Optimized for your comfort and time.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                            <div>
                                <div className="flex items-center gap-1 text-yellow-400 mb-2">
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                                <p className="text-sm font-bold text-white">4.9/5 Rating</p>
                                <p className="text-xs text-slate-500">Based on 500+ Reviews</p>
                            </div>
                            <div>
                                <ShieldCheck className="w-6 h-6 text-green-400 mb-2" />
                                <p className="text-sm font-bold text-white">100% Sterile</p>
                                <p className="text-xs text-slate-500">ISO Certified Clinic</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="relative z-10 pt-12 mt-auto">
                    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-white mb-1">Nallagandla, Hyderabad</p>
                            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">{store.clinicDetails?.address || "Loading location..."}</p>
                            {store.clinicDetails?.websiteUrl && (
                                <p className="text-xs text-blue-400 mt-2 hover:underline cursor-pointer" onClick={() => window.open(store.clinicDetails?.websiteUrl, '_blank')}>
                                    {store.clinicDetails.websiteUrl.replace(/^https?:\/\//, '')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Booking Form (Clean, High Contrast, Black Text) */}
            <div className="lg:w-[55%] bg-white flex flex-col justify-center p-6 lg:p-16 overflow-y-auto">
                <div className="max-w-md mx-auto w-full">

                    {/* Stage Indicators */}
                    {bookingStage !== 'success' && (
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-black tracking-tight">
                                {bookingStage === 'details' && 'Patient Details'}
                                {bookingStage === 'service' && 'Select Service'}
                                {bookingStage === 'slots' && 'Select Time Slot'}
                            </h2>
                            <div className="flex gap-2">
                                <div className={cn("h-1.5 w-6 rounded-full transition-all", bookingStage === 'details' ? 'bg-black' : 'bg-green-500')}></div>
                                <div className={cn("h-1.5 w-6 rounded-full transition-all", bookingStage === 'service' ? 'bg-black' : (bookingStage === 'details' ? 'bg-slate-200' : 'bg-green-500'))}></div>
                                <div className={cn("h-1.5 w-6 rounded-full transition-all", bookingStage === 'slots' ? 'bg-black' : 'bg-slate-200')}></div>
                            </div>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {/* STAGE 1: DETAILS */}
                        {bookingStage === 'details' && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-xs font-bold uppercase text-black tracking-wider ml-1">First Name <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 w-5 h-5 text-black pointer-events-none" />
                                        <Input
                                            id="firstName"
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                            className="h-12 pl-12 bg-white border-2 border-slate-200 focus:border-black focus:ring-0 rounded-xl text-black font-bold placeholder:text-slate-400 shadow-sm transition-all text-base"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-xs font-bold uppercase text-black tracking-wider ml-1">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        className="h-12 pl-4 bg-white border-2 border-slate-200 focus:border-black focus:ring-0 rounded-xl text-black font-bold placeholder:text-slate-400 shadow-sm transition-all text-base"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-xs font-bold uppercase text-black tracking-wider ml-1">Phone Number <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-black pointer-events-none" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="h-12 pl-12 bg-white border-2 border-slate-200 focus:border-black focus:ring-0 rounded-xl text-black font-bold placeholder:text-slate-400 shadow-sm transition-all text-base"
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleNextDetails}
                                    className="w-full h-14 bg-black hover:bg-slate-800 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                >
                                    Select Service <ArrowRight className="w-5 h-5" />
                                </Button>
                            </motion.div>
                        )}

                        {/* STAGE 2: SERVICE SELECTION (New Feature) */}
                        {bookingStage === 'service' && (
                            <motion.div
                                key="service"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <p className="text-sm text-slate-700 font-medium mb-4">What kind of appointment do you need?</p>

                                <div className="grid grid-cols-1 gap-3">
                                    {PROCEDURE_TYPES.map((proc) => (
                                        <button
                                            key={proc.id}
                                            onClick={() => handleSelectService(proc.id, proc.label)}
                                            className="group relative flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-black hover:bg-white transition-all text-left"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", proc.color.replace('text-', 'bg-opacity-20 text-'))}>
                                                    {proc.id === 'consultation' && <Stethoscope className="w-5 h-5" />}
                                                    {proc.id === 'emergency' && <Activity className="w-5 h-5" />}
                                                    {!['consultation', 'emergency'].includes(proc.id) && <FileText className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-black text-black group-hover:text-black transition-colors">{proc.label}</h3>
                                                    <p className="text-xs text-slate-600 font-medium">{proc.duration} Minutes</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-black transition-colors" />
                                        </button>
                                    ))}
                                </div>

                                <Button
                                    variant="ghost"
                                    onClick={() => setBookingStage('details')}
                                    className="w-full mt-4 text-slate-500 hover:text-black font-bold"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                            </motion.div>
                        )}

                        {/* STAGE 3: SLOTS (Smart Grid) */}
                        {bookingStage === 'slots' && (
                            <motion.div
                                key="slots"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {/* Selected Service Badge */}
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <BadgeCheck className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-black text-black">{formData.reasonLabel}</span>
                                    </div>
                                    <button onClick={() => setBookingStage('service')} className="text-xs font-bold text-slate-500 hover:text-black underline">
                                        Change
                                    </button>
                                </div>

                                {/* Date Selection */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-black tracking-wider ml-1">Select Date</Label>
                                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                        {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                                            const date = addDays(new Date(), offset);
                                            const dateStr = format(date, 'yyyy-MM-dd');
                                            const isSelected = formData.date === dateStr;
                                            return (
                                                <button
                                                    key={offset}
                                                    onClick={() => setFormData({ ...formData, date: dateStr })}
                                                    className={cn(
                                                        "flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-all",
                                                        isSelected ? "border-black bg-black text-white shadow-lg scale-105" : "border-slate-100 bg-white text-slate-400 hover:border-slate-300"
                                                    )}
                                                >
                                                    <span className="text-xs font-bold uppercase">{format(date, 'EEE')}</span>
                                                    <span className="text-xl font-black">{format(date, 'd')}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Slots Grid */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-black tracking-wider ml-1">Available Slots</Label>

                                    {isFetchingSlots ? (
                                        <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>
                                    ) : availableSlots.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-3">
                                            {availableSlots.map((slot, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setFormData({ ...formData, slot: slot.time })}
                                                    className={cn(
                                                        "py-3 rounded-xl border-2 text-sm font-bold transition-all",
                                                        formData.slot === slot.time
                                                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                                                            : "border-slate-100 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                                                    )}
                                                >
                                                    {slot.time.slice(0, 5)}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            <p className="text-sm font-bold text-slate-400">No slots available for this date.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setBookingStage('service')}
                                        className="h-14 w-14 rounded-xl border-slate-300 font-bold text-slate-600 hover:bg-slate-50 hover:text-black p-0 flex items-center justify-center"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        onClick={handleBook}
                                        disabled={isSubmitting || !formData.slot}
                                        className="h-14 flex-1 bg-black hover:bg-slate-800 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin" /> Confirming...
                                            </span>
                                        ) : (
                                            "Confirm Appointment"
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STAGE 4: SUCCESS */}
                        {bookingStage === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6"
                            >
                                <div className={cn(
                                    "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 transition-all",
                                    store.bookingMode === 'auto' ? "bg-green-100 ring-green-50" : "bg-amber-100 ring-amber-50"
                                )}>
                                    {store.bookingMode === 'auto' ? (
                                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                                    ) : (
                                        <Clock className="w-10 h-10 text-amber-600" />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-black tracking-tight">
                                        {store.bookingMode === 'auto' ? "Booking Confirmed!" : "Request Received"}
                                    </h2>
                                    <p className="text-slate-600 text-lg">
                                        {store.bookingMode === 'auto'
                                            ? "Your appointment is scheduled."
                                            : "We will review and confirm your slot shortly."
                                        }
                                    </p>
                                </div>

                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4 shadow-sm">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service</span>
                                        <span className="font-bold text-black">{formData.reasonLabel}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</span>
                                        <span className="font-bold text-black">{formData.date}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time</span>
                                        <span className="font-bold text-black">{formData.slot}</span>
                                    </div>
                                </div>

                                <Button onClick={() => window.location.reload()} className="w-full h-14 bg-black hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg transition-all">
                                    Book Another
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
