"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { parseHealthFloID, NOBLE_DENTAL_ID } from "@/lib/id-generator";
import { useSchedulingStore, PROCEDURE_TYPES, Doctor } from "@/lib/scheduling-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    BadgeCheck, Calendar, CheckCircle2, ChevronRight, Clock, FileText,
    Loader2, MapPin, Phone, ShieldCheck, User, Star, ArrowRight, ArrowLeft,
    Stethoscope, Activity, Plane, Ticket, Users
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { BoardingPass } from "@/components/ui/boarding-pass";

export default function PublicBookingPage() {
    const params = useParams();
    const clinicId = params.clinicId as string;
    const store = useSchedulingStore();

    // State
    const [isValidId, setIsValidId] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // New Stage Flow: passenger -> pilot -> flight -> boarding_pass
    const [bookingStage, setBookingStage] = useState<'passenger' | 'pilot' | 'flight' | 'boarding_pass'>('passenger');

    // Data State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        doctor: null as Doctor | null, // Selected Pilot
        reasonId: "",
        reasonLabel: "",
        date: "",
        slot: "",
    });

    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [isFetchingSlots, setIsFetchingSlots] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedAppointmentId, setGeneratedAppointmentId] = useState("");

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

    // Fetch Slots
    useEffect(() => {
        if (bookingStage === 'flight' && formData.date && formData.reasonId) {
            fetchSlots();
        }
    }, [formData.date, bookingStage, formData.reasonId]);

    const fetchSlots = async () => {
        setIsFetchingSlots(true);
        try {
            const procedure = PROCEDURE_TYPES.find(p => p.id === formData.reasonId);
            const duration = procedure ? procedure.duration : 30;
            const slots = await store.fetchAvailableSlots(formData.date, store.activeChairs, duration);
            setAvailableSlots(slots);
        } catch (error) {
            toast.error("Could not load slots.");
        } finally {
            setIsFetchingSlots(false);
        }
    };

    const handleNextStage = (stage: typeof bookingStage) => {
        setBookingStage(stage);
    };

    const handleSelectService = (id: string, label: string) => {
        setFormData(prev => ({
            ...prev,
            reasonId: id,
            reasonLabel: label,
            date: prev.date || format(new Date(), 'yyyy-MM-dd')
        }));
    };

    const handleBook = async () => {
        if (!formData.date || !formData.slot || !formData.doctor) return;

        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 2000)); // Dramatic pause for "Printing" effect

        const newPatientId = crypto.randomUUID();
        const newApptId = crypto.randomUUID();

        store.addPatient({
            id: newPatientId,
            name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            isNew: true
        });

        const initialStatus = store.bookingMode === 'auto' ? 'confirmed' : 'pending';

        store.addAppointment({
            id: newApptId,
            patientId: newPatientId,
            doctorId: formData.doctor.id,
            date: formData.date,
            slot: formData.slot,
            type: formData.reasonId,
            reason: formData.reasonLabel,
            status: initialStatus,
            locationLink: store.clinicDetails?.googleMapsUrl
        });

        setGeneratedAppointmentId(newApptId);
        setBookingStage('boarding_pass');
        setIsSubmitting(false);
    };

    if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-white"><Loader2 className="animate-spin text-black w-8 h-8" /></div>;

    if (!isValidId) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <h1 className="text-2xl font-black text-black mb-2">Invalid Link</h1>
            <p className="text-slate-700">Please contact the clinic directly.</p>
        </div>
    );

    // Success State uses Full Screen Overlay
    if (bookingStage === 'boarding_pass' && formData.doctor) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
                {/* Ambient Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black opacity-50" />

                <div className="relative z-10 w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
                    <div className="text-center space-y-2 text-white">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-black uppercase tracking-tighter">Flight Confirmed</h1>
                        <p className="text-slate-400 font-medium tracking-wide">Your boarding pass has been issued.</p>
                    </div>

                    <BoardingPass
                        patientName={`${formData.firstName} ${formData.lastName}`}
                        doctor={formData.doctor}
                        date={formData.date}
                        time={formData.slot}
                        procedure={formData.reasonLabel}
                        appointmentId={generatedAppointmentId}
                        clinicName={store.clinicDetails?.name || "Noble Dental"}
                        clinicLocation={store.clinicDetails?.address || "Hyderabad"}
                        status="issued"
                    />

                    <div className="flex gap-4 pt-8">
                        <Button
                            onClick={() => window.location.reload()}
                            className="flex-1 h-14 bg-white text-black hover:bg-slate-200 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all"
                        >
                            Book Another
                        </Button>
                        <Button
                            variant="outline"
                            className="h-14 px-8 border-white/20 text-white hover:bg-white/10 rounded-2xl font-bold uppercase tracking-widest"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white flex flex-col lg:flex-row">

            {/* LEFT SIDE: Brand & Info */}
            <div className="lg:w-[45%] bg-black text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px]"></div>

                <div className="relative z-10 space-y-12">
                    {/* Clinic Header */}
                    <div className="border-l-4 border-indigo-500 pl-6">
                        <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none mb-2">
                            {store.clinicDetails?.name || "Noble Dental"}
                        </h1>
                        <p className="text-sm font-bold text-indigo-400 uppercase tracking-[0.2em]">
                            {store.clinicDetails?.slogan || "Premium Dental Studio"}
                        </p>
                    </div>

                    {/* Dynamic Context based on Stage */}
                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={bookingStage}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                {bookingStage === 'passenger' && (
                                    <div className="space-y-4">
                                        <h2 className="text-5xl font-black text-white/90">Who is flying?</h2>
                                        <p className="text-xl text-slate-400">Please provide passenger details for the manifest.</p>
                                    </div>
                                )}
                                {bookingStage === 'pilot' && (
                                    <div className="space-y-4">
                                        <h2 className="text-5xl font-black text-white/90">Select Pilot</h2>
                                        <p className="text-xl text-slate-400">Choose your preferred specialist for this procedure.</p>
                                    </div>
                                )}
                                {bookingStage === 'flight' && (
                                    <div className="space-y-4">
                                        <h2 className="text-5xl font-black text-white/90">Flight Time</h2>
                                        <p className="text-xl text-slate-400">Confirm your procedure and departure slot.</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 pt-12 mt-auto">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        <span>Secure SSL Encryption</span>
                        <span className="mx-2 text-slate-700">|</span>
                        <span>ISO 9001:2015</span>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Interactive Booking Form */}
            <div className="lg:w-[55%] bg-white flex flex-col justify-center p-6 lg:p-16 overflow-y-auto">
                <div className="max-w-md mx-auto w-full">

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 mb-12">
                        {['passenger', 'pilot', 'flight'].map((step, i) => {
                            const steps = ['passenger', 'pilot', 'flight'];
                            const isActive = step === bookingStage;
                            const isCompleted = steps.indexOf(bookingStage) > i;

                            return (
                                <div key={step} className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                                    <div className={cn(
                                        "absolute inset-y-0 left-0 transition-all duration-500 ease-out",
                                        isActive ? "w-1/2 bg-black" : (isCompleted ? "w-full bg-black" : "w-0")
                                    )} />
                                </div>
                            );
                        })}
                    </div>

                    <AnimatePresence mode="wait">
                        {/* STEP 1: Patient Details */}
                        {bookingStage === 'passenger' && (
                            <motion.div
                                key="passenger"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">First Name</Label>
                                        <Input
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                            className="h-16 text-3xl font-black border-0 border-b-2 border-slate-200 rounded-none px-0 focus:border-black focus:ring-0 placeholder:text-slate-200 transition-all font-sans"
                                            placeholder="JOHN"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Last Name</Label>
                                        <Input
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                            className="h-16 text-3xl font-black border-0 border-b-2 border-slate-200 rounded-none px-0 focus:border-black focus:ring-0 placeholder:text-slate-200 transition-all font-sans"
                                            placeholder="DOE"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact Number</Label>
                                        <Input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="h-16 text-3xl font-black border-0 border-b-2 border-slate-200 rounded-none px-0 focus:border-black focus:ring-0 placeholder:text-slate-200 transition-all font-sans"
                                            placeholder="+91"
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleNextStage('pilot')}
                                    disabled={!formData.firstName || !formData.phone}
                                    className="w-full h-16 bg-black text-white hover:bg-slate-800 rounded-none text-lg font-bold uppercase tracking-widest flex items-center justify-between px-8 group transition-all"
                                >
                                    <span>Select Doctor</span>
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </motion.div>
                        )}

                        {/* STEP 2: DOCTOR SELECTION */}
                        {bookingStage === 'pilot' && (
                            <motion.div
                                key="pilot"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid gap-4">
                                    {store.doctors.map((doc) => (
                                        <button
                                            key={doc.id}
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, doctor: doc }));
                                                handleNextStage('flight');
                                            }}
                                            className="group relative flex items-center gap-6 p-4 border border-slate-200 hover:border-black hover:bg-slate-50 transition-all rounded-3xl text-left overflow-hidden"
                                        >
                                            {/* Doctor Image */}
                                            <div className={cn("w-20 h-20 rounded-2xl flex-shrink-0 relative overflow-hidden bg-slate-200", doc.color || 'bg-slate-900')}>
                                                {doc.image ? (
                                                    <img src={doc.image} alt={doc.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                                ) : (
                                                    <User className="absolute inset-0 m-auto text-white/50 w-8 h-8" />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 group-hover:text-black">{doc.name}</h3>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{doc.specialty}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full font-bold text-slate-600">{doc.experience || 'Experienced'}</span>
                                                    {doc.languages && <span className="text-[10px] text-slate-400 font-medium">{doc.languages.join(' • ')}</span>}
                                                </div>
                                            </div>

                                            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all">
                                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-white" />
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <Button
                                    variant="ghost"
                                    onClick={() => setBookingStage('passenger')}
                                    className="w-full font-bold text-slate-400 hover:text-black uppercase tracking-widest text-xs"
                                >
                                    Change Patient
                                </Button>
                            </motion.div>
                        )}

                        {/* STEP 3: VISIT DETAILS (Service + Slots) */}
                        {bookingStage === 'flight' && (
                            <motion.div
                                key="flight"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                {/* Service Selection (Available Slots Style) */}
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Visit (Procedure)</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {PROCEDURE_TYPES.map(proc => (
                                            <button
                                                key={proc.id}
                                                onClick={() => handleSelectService(proc.id, proc.label)}
                                                className={cn(
                                                    "h-14 px-4 flex items-center justify-center text-xs font-bold uppercase tracking-wider border transition-all rounded-lg",
                                                    formData.reasonId === proc.id
                                                        ? "bg-black text-white border-black"
                                                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                                                )}
                                            >
                                                {proc.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {formData.reasonId && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date & Slot</Label>

                                        {/* Date Scroller */}
                                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                            {[0, 1, 2, 3, 4].map((offset) => {
                                                const date = addDays(new Date(), offset);
                                                const dateStr = format(date, 'yyyy-MM-dd');
                                                const isSelected = formData.date === dateStr;
                                                return (
                                                    <button
                                                        key={offset}
                                                        onClick={() => setFormData({ ...formData, date: dateStr })}
                                                        className={cn(
                                                            "flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center border-2 transition-all rounded-xl",
                                                            isSelected ? "border-black bg-black text-white shadow-lg" : "border-slate-100 bg-white text-slate-400 hover:border-slate-300"
                                                        )}
                                                    >
                                                        <span className="text-[10px] font-bold uppercase">{format(date, 'EEE')}</span>
                                                        <span className="text-xl font-black">{format(date, 'd')}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Slot Grid */}
                                        {isFetchingSlots ? (
                                            <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>
                                        ) : availableSlots.length > 0 ? (
                                            <div className="grid grid-cols-3 gap-3">
                                                {availableSlots.map((slot, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setFormData({ ...formData, slot: slot.time })}
                                                        className={cn(
                                                            "py-3 rounded-lg border-2 text-sm font-bold transition-all font-mono",
                                                            formData.slot === slot.time
                                                                ? "border-black bg-black text-white"
                                                                : "border-slate-100 bg-white text-slate-700 hover:border-slate-300"
                                                        )}
                                                    >
                                                        {slot.time.slice(0, 5)}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center text-xs font-bold text-slate-400 py-4">No slots available.</div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setBookingStage('pilot')}
                                        className="h-14 px-6 border-slate-200 text-slate-500 font-bold uppercase tracking-widest rounded-none"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleBook}
                                        disabled={isSubmitting || !formData.slot}
                                        className="flex-1 h-14 bg-black text-white hover:bg-slate-800 rounded-none text-sm font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" /> Confirming...
                                            </span>
                                        ) : "Confirm Visit"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </div>
    );
}
