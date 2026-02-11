"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { parseHealthFloID, NOBLE_DENTAL_ID } from "@/lib/id-generator";
import { useSchedulingStore } from "@/lib/scheduling-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Loader2, Phone, User, FileText } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function PublicBookingPage() {
    const params = useParams();
    const clinicId = params.clinicId as string;
    const store = useSchedulingStore();

    const [isValidId, setIsValidId] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingStage, setBookingStage] = useState<'details' | 'slots' | 'confirm' | 'success'>('details');

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        reason: "",
        date: "",
        time: "",
        moduleId: "any"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // validate ID
        const parsed = parseHealthFloID(clinicId);
        if (parsed && clinicId === NOBLE_DENTAL_ID) {
            setIsValidId(true);
            // Simulate fetching clinic data if not present
            if (!store.clinicDetails) {
                store.importFromGoogle().catch(() => { });
            }
        }
        setIsLoading(false);
    }, [clinicId, store]);

    const handleNext = () => {
        if (!formData.firstName || !formData.phone || !formData.reason) {
            toast.error("Please fill in your details");
            return;
        }
        setBookingStage('slots');
    };

    const handleBook = async () => {
        if (!formData.date || !formData.time) {
            toast.error("Please select a time slot");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Create Event (Mocked Backend Call)
            await fetch('/api/calendar/event', {
                method: 'POST',
                body: JSON.stringify({
                    summary: `New Patient: ${formData.firstName} ${formData.lastName}`,
                    description: `Phone: ${formData.phone}\nReason: ${formData.reason}`,
                    start: `${formData.date}T${formData.time}:00`,
                    location: store.clinicDetails?.address
                })
            });

            // 2. Add to Store (Local State)
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
        } catch (error) {
            toast.error("Booking Failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>;
    }

    if (!isValidId) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">Invalid Clinic Link</h1>
                <p className="text-slate-500 mt-2 max-w-sm mx-auto">The booking link you used seems incorrect or expired. Please contact the clinic directly.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">

            {/* Professional Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 md:px-8 py-4 shadow-sm">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Logo Placeholder */}
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-md">
                            N
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 leading-tight">Noble Dental Care</h1>
                            <p className="text-sm font-medium text-slate-500">Multispeciality Clinic, Nallagandla</p>
                        </div>
                    </div>
                    {store.clinicDetails?.isVerified && (
                        <div className="hidden sm:flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wide">Verified Identity</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-12 px-4">
                <div className="w-full max-w-lg">

                    {/* Progress Steps */}
                    {bookingStage !== 'success' && (
                        <div className="mb-8 flex items-center justify-center gap-4">
                            <div className={`flex items-center gap-2 ${bookingStage === 'details' ? 'text-blue-600 font-bold' : 'text-slate-400 font-medium'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 ${bookingStage === 'details' || bookingStage === 'slots' ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>1</div>
                                <span className="text-sm">Your Details</span>
                            </div>
                            <div className="h-px w-12 bg-slate-200"></div>
                            <div className={`flex items-center gap-2 ${bookingStage === 'slots' ? 'text-blue-600 font-bold' : 'text-slate-400 font-medium'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 ${bookingStage === 'slots' ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>2</div>
                                <span className="text-sm">Date & Time</span>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                        {/* Success State */}
                        {bookingStage === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-8 text-center"
                            >
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Appointment Confirmed</h2>
                                <p className="text-slate-600 mb-8">We have notified Dr. Dhivakaran. Details sent to <strong>{formData.phone}</strong>.</p>

                                <div className="bg-slate-50 rounded-lg p-6 text-left border border-slate-200 mb-8 space-y-4">
                                    <div className="flex justify-between items-center border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                                        <span className="text-sm font-medium text-slate-500">Date</span>
                                        <span className="text-sm font-bold text-slate-900">{formData.date}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                                        <span className="text-sm font-medium text-slate-500">Time</span>
                                        <span className="text-sm font-bold text-slate-900">{formData.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                                        <span className="text-sm font-medium text-slate-500">Location</span>
                                        <a href={store.clinicDetails?.googleMapsUrl} target="_blank" className="text-sm font-bold text-blue-600 hover:underline truncate max-w-[200px]">
                                            open in maps ↗
                                        </a>
                                    </div>
                                </div>

                                <Button onClick={() => window.location.reload()} className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md">
                                    Book Another Appointment
                                </Button>
                            </motion.div>
                        ) : (
                            <div className="p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    {bookingStage === 'details' ? (
                                        <>Patient Registration</>
                                    ) : (
                                        <>Select Availability</>
                                    )}
                                </h2>

                                {bookingStage === 'details' && (
                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="firstName" className="text-xs font-semibold uppercase text-slate-500">First Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                    <Input
                                                        id="firstName"
                                                        className="pl-9 h-11 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-slate-900 placeholder:text-slate-400"
                                                        placeholder="John"
                                                        value={formData.firstName}
                                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="lastName" className="text-xs font-semibold uppercase text-slate-500">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    className="h-11 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-slate-900 placeholder:text-slate-400"
                                                    placeholder="Doe"
                                                    value={formData.lastName}
                                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="phone" className="text-xs font-semibold uppercase text-slate-500">Mobile Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    className="pl-9 h-11 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-slate-900 placeholder:text-slate-400"
                                                    placeholder="+91 98765 43210"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="reason" className="text-xs font-semibold uppercase text-slate-500">Purpose of Visit</Label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                <Input
                                                    id="reason"
                                                    className="pl-9 h-11 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-slate-900 placeholder:text-slate-400"
                                                    placeholder="e.g. Tooth ache, Cleaning, General Checkup"
                                                    value={formData.reason}
                                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleNext}
                                            className="w-full h-12 mt-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all active:scale-[0.98]"
                                        >
                                            Continue to Scheduling
                                        </Button>
                                    </motion.div>
                                )}

                                {bookingStage === 'slots' && (
                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold uppercase text-slate-500">Date</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                    <Input
                                                        type="date"
                                                        className="pl-9 h-11 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-slate-900 font-medium"
                                                        value={formData.date}
                                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold uppercase text-slate-500">Time</Label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                    <Input
                                                        type="time"
                                                        className="pl-9 h-11 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-slate-900 font-medium"
                                                        value={formData.time}
                                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                                            <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold text-blue-900">Instant Confirmation</p>
                                                <p className="text-xs text-blue-700 mt-1">Your appointment is confirmed immediately. No phone call required.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => setBookingStage('details')}
                                                className="flex-1 h-12 rounded-lg border-slate-300 text-slate-600 font-bold hover:bg-slate-50"
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                onClick={handleBook}
                                                disabled={isSubmitting}
                                                className="flex-[2] h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all active:scale-[0.98]"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    "Confirm Booking"
                                                )}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center space-y-2">
                    <p className="text-xs font-medium text-slate-400">Powered by HealthFlo Dental OS</p>
                    <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                        <a href="#" className="hover:text-slate-600">Privacy</a>
                        <span>•</span>
                        <a href="#" className="hover:text-slate-600">Terms</a>
                        <span>•</span>
                        <a href="#" className="hover:text-slate-600">Support</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
