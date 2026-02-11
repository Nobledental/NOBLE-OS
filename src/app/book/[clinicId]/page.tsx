"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { parseHealthFloID, NOBLE_DENTAL_ID } from "@/lib/id-generator";
import { useSchedulingStore } from "@/lib/scheduling-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeCheck, Calendar, CheckCircle2, ChevronRight, Clock, FileText, Loader2, MapPin, Phone, ShieldCheck, User, Star, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicBookingPage() {
    const params = useParams();
    const clinicId = params.clinicId as string;
    const store = useSchedulingStore();

    // State
    const [isValidId, setIsValidId] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingStage, setBookingStage] = useState<'details' | 'slots' | 'success'>('details');

    // User Form
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        reason: "",
        date: "",
        time: "",
    });

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

    const handleNext = () => {
        if (!formData.firstName || !formData.phone || !formData.reason) {
            toast.error("Please fill in all required fields.");
            return;
        }
        setBookingStage('slots');
    };

    const handleBook = async () => {
        if (!formData.date || !formData.time) {
            toast.error("Please select a date and time.");
            return;
        }

        setIsSubmitting(true);
        // Simulate Booking Process
        await new Promise(r => setTimeout(r, 2000));

        // Add to Store (Temporary)
        const newPatientId = crypto.randomUUID();
        store.addPatient({
            id: newPatientId,
            name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            isNew: true
        });

        store.addAppointment({
            patientId: newPatientId,
            date: formData.date,
            slot: formData.time,
            reason: formData.reason,
            type: 'new',
            locationLink: store.clinicDetails?.googleMapsUrl
        });

        setBookingStage('success');
        setIsSubmitting(false);
    };

    if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>;

    if (!isValidId) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Booking Link</h1>
            <p className="text-slate-500">Please contact the clinic directly for a valid appointment link.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col lg:flex-row">

            {/* LEFT SIDE: Brand & Info (Professional Dark Blue/Gradient) */}
            <div className="lg:w-[45%] bg-slate-900 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10 space-y-12">
                    {/* Header/Logo */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                                <span className="text-2xl font-black text-slate-900">N</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Noble Dental Care</h1>
                                <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Premium Dental Studio</p>
                            </div>
                        </div>

                        {store.clinicDetails?.isVerified && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-wider">
                                <BadgeCheck className="w-4 h-4" />
                                Verified Medical Center
                            </div>
                        )}
                    </div>

                    {/* Value Props */}
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-[1.1]">
                                World-Class <br />
                                <span className="text-blue-400">Dental Care.</span>
                            </h2>
                            <p className="text-lg text-slate-400 max-w-sm leading-relaxed">
                                Schedule your consultation with Dr. Dhivakaran and experience pain-free, modern dentistry.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
                            <div>
                                <div className="flex items-center gap-1 text-yellow-400 mb-1">
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                </div>
                                <p className="text-sm font-bold">4.9/5 Rating</p>
                                <p className="text-xs text-slate-500">Based on 500+ Reviews</p>
                            </div>
                            <div>
                                <ShieldCheck className="w-6 h-6 text-green-400 mb-2" />
                                <p className="text-sm font-bold">100% Sterile</p>
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
                            <a href={store.clinicDetails?.googleMapsUrl} target="_blank" className="text-xs font-bold text-blue-400 hover:text-blue-300 mt-2 inline-flex items-center gap-1">
                                Get Directions <ArrowRight className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Booking Form (Clean, High Contrast) */}
            <div className="lg:w-[55%] bg-white flex flex-col justify-center p-6 lg:p-16 overflow-y-auto">
                <div className="max-w-md mx-auto w-full">

                    {bookingStage === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Appointment Confirmed!</h2>
                                <p className="text-slate-500 text-lg">We&apos;ve sent the details to your phone.</p>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4 shadow-sm">
                                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Patient</span>
                                    <span className="font-bold text-slate-900">{formData.firstName} {formData.lastName}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Date</span>
                                    <span className="font-bold text-slate-900">{formData.date}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Time</span>
                                    <span className="font-bold text-slate-900">{formData.time}</span>
                                </div>
                            </div>

                            <Button onClick={() => window.location.reload()} className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-xl font-bold shadow-lg transition-all">
                                Book Another Appointment
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="space-y-8">
                            {/* Progress Header */}
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                    {bookingStage === 'details' ? 'Patient Details' : 'Select Time Slot'}
                                </h2>
                                <div className="flex gap-2">
                                    <div className={`h-2 w-8 rounded-full transition-all ${bookingStage === 'details' ? 'bg-blue-600' : 'bg-green-500'}`}></div>
                                    <div className={`h-2 w-8 rounded-full transition-all ${bookingStage === 'slots' ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {bookingStage === 'details' ? (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName" className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">First Name <span className="text-red-500">*</span></Label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                                                    <Input
                                                        id="firstName"
                                                        placeholder="John"
                                                        value={formData.firstName}
                                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                                        className="h-12 pl-12 bg-white border-slate-300 focus:border-blue-600 focus:ring-blue-100 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all text-base"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName" className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    placeholder="Doe"
                                                    value={formData.lastName}
                                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                                    className="h-12 bg-white border-slate-300 focus:border-blue-600 focus:ring-blue-100 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all text-base"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Phone Number <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="+91 98765 43210"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                    className="h-12 pl-12 bg-white border-slate-300 focus:border-blue-600 focus:ring-blue-100 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all text-base"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="reason" className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Reason for Visit <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <FileText className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                                                <Input
                                                    id="reason"
                                                    placeholder="Describe your issue..."
                                                    value={formData.reason}
                                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                                    className="h-12 pl-12 bg-white border-slate-300 focus:border-blue-600 focus:ring-blue-100 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all text-base"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                onClick={handleNext}
                                                className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                            >
                                                Next Step <ChevronRight className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="slots"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Select Date <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                                                <Input
                                                    type="date"
                                                    value={formData.date}
                                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                    className="h-12 pl-12 bg-white border-slate-300 focus:border-blue-600 focus:ring-blue-100 rounded-xl text-slate-900 font-medium shadow-sm transition-all text-base"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Select Time <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                                                <Input
                                                    type="time"
                                                    value={formData.time}
                                                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                                                    className="h-12 pl-12 bg-white border-slate-300 focus:border-blue-600 focus:ring-blue-100 rounded-xl text-slate-900 font-medium shadow-sm transition-all text-base"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                                            <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Secure Booking</p>
                                                <p className="text-xs text-slate-600 leading-relaxed mt-1">Your data is encrypted and securely stored. We respect your medical privacy.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => setBookingStage('details')}
                                                className="h-14 flex-1 rounded-xl border-slate-300 font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                onClick={handleBook}
                                                disabled={isSubmitting}
                                                className="h-14 flex-[2] bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
                                            >
                                                {isSubmitting ? (
                                                    <span className="flex items-center gap-2">
                                                        <Loader2 className="w-5 h-5 animate-spin" /> Confirming...
                                                    </span>
                                                ) : (
                                                    "Confirm Booking"
                                                )}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
