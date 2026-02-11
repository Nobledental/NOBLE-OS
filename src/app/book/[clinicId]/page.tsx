"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { parseHealthFloID, NOBLE_DENTAL_ID } from "@/lib/id-generator";
import { useSchedulingStore } from "@/lib/scheduling-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
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
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1019]"><Loader2 className="animate-spin text-blue-600" /></div>;
    }

    if (!isValidId) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0B1019] p-4 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Invalid Clinic ID</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">The clinic ID provided ({clinicId}) refers to a non-existent location.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1019] relative overflow-hidden transition-colors duration-500 font-sans selection:bg-blue-500/30">
            {/* CSS for Neon Effect */}
            <style jsx global>{`
                @keyframes energy-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .neon-card-wrapper {
                    position: relative;
                    border-radius: 3rem;
                    overflow: hidden;
                    padding: 3px;
                    isolation: isolate;
                    box-shadow: 0 40px 100px -20px rgba(0,0,0,0.5);
                }
                .neon-gradient-bg {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: conic-gradient(from 0deg, transparent, #2563eb, #0d9488, transparent, #2563eb, transparent);
                    animation: energy-spin 8s linear infinite;
                    z-index: -2;
                }
                .neon-blur-bg {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: conic-gradient(from 0deg, #2563eb, #0d9488, #ffffff, #2563eb);
                    animation: energy-spin 8s linear infinite;
                    filter: blur(40px);
                    opacity: 0.3;
                    z-index: -2;
                }
            `}</style>

            {/* Header */}
            <div className="absolute top-0 left-0 w-full z-20 px-6 py-6 flex items-center justify-between">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-3">
                    <div>
                        <h1 className="text-lg font-black text-slate-900 dark:text-white leading-none tracking-tight">NOBLE <span className="text-blue-500">DENTAL</span></h1>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mt-0.5">Nallagandla</p>
                    </div>
                </div>
                {store.clinicDetails?.isVerified && (
                    <div className="flex items-center gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full border border-green-500/20 backdrop-blur-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Verified</span>
                    </div>
                )}
            </div>

            <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Left Side: Welcome Text (Desktop Only) */}
                    <div className="hidden lg:block lg:col-span-5 space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-500/20">
                                <Clock className="w-3 h-3" /> 24/7 Online Booking
                            </div>
                            <h1 className="text-6xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter mb-4">
                                Book Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-400">Visit Now.</span>
                            </h1>
                            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm">
                                Secure your slot with Dr. Dhivakaran and team in less than 60 seconds.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-50 dark:border-[#0B1019] bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold">
                                        {['A', 'B', 'C'][i - 1]}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                <span className="text-blue-600 dark:text-cyan-400">120+</span> patients booked today
                            </p>
                        </div>
                    </div>

                    {/* Right Side: The Component */}
                    <div className="lg:col-span-7 w-full">
                        <div className="neon-card-wrapper">
                            <div className="neon-gradient-bg"></div>
                            <div className="neon-blur-bg"></div>
                            <div className="relative bg-white dark:bg-[#0B1019] p-6 md:p-10 overflow-hidden border border-white/50 dark:border-white/5 shadow-inner rounded-[2.9rem]">

                                {/* Success View */}
                                {bookingStage === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-10"
                                    >
                                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                            <div className="absolute inset-0 border border-green-500/20 rounded-full animate-ping opacity-20"></div>
                                            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Booking Confirmed!</h2>
                                        <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">Appointment details sent to <strong>{formData.phone}</strong></p>

                                        <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-8 text-left space-y-6 mb-10 border border-slate-100 dark:border-white/10">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
                                                    <Calendar className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Date & Time</p>
                                                    <p className="text-xl font-bold text-slate-900 dark:text-white">{formData.date} <span className="text-slate-300 mx-2">|</span> {formData.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-2xl text-amber-600 dark:text-amber-400">
                                                    <MapPin className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Location</p>
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed max-w-xs">{store.clinicDetails?.address || "Noble Dental Care, Nallagandla"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Button onClick={() => window.location.reload()} className="w-full h-16 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-transform">
                                            Book Another
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/5">
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                                {bookingStage === 'details' ? 'Patient Details' : 'Select Time'}
                                            </h3>
                                            <div className="flex gap-2">
                                                <div className={`h-2 w-2 rounded-full ${bookingStage === 'details' ? 'bg-blue-600' : 'bg-slate-200 dark:bg-white/10'}`} />
                                                <div className={`h-2 w-2 rounded-full ${bookingStage === 'slots' ? 'bg-blue-600' : 'bg-slate-200 dark:bg-white/10'}`} />
                                            </div>
                                        </div>

                                        {bookingStage === 'details' && (
                                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em] ml-1">Name</label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <Input
                                                                className="h-14 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-2xl px-4 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-blue-500"
                                                                placeholder="First Name"
                                                                value={formData.firstName}
                                                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                                            />
                                                            <Input
                                                                className="h-14 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-2xl px-4 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-blue-500"
                                                                placeholder="Last Name"
                                                                value={formData.lastName}
                                                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em] ml-1">Phone</label>
                                                    <Input
                                                        type="tel"
                                                        className="h-14 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-2xl px-4 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-blue-500"
                                                        placeholder="+91 98765 43210"
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em] ml-1">Clinical Issue</label>
                                                    <Input
                                                        className="h-14 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-2xl px-4 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-blue-500"
                                                        placeholder="e.g. Tooth ache, Cleaning..."
                                                        value={formData.reason}
                                                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                                    />
                                                </div>

                                                <Button
                                                    onClick={handleNext}
                                                    className="w-full h-16 mt-4 rounded-2xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                                                >
                                                    Find Slots
                                                </Button>
                                            </motion.div>
                                        )}

                                        {bookingStage === 'slots' && (
                                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                                <div className="p-1 bg-slate-100 dark:bg-white/5 rounded-2xl flex p-1">
                                                    <button onClick={() => setBookingStage('details')} className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-white dark:hover:bg-white/10 transition-all">Back</button>
                                                    <div className="w-full py-3 rounded-xl bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2">
                                                        <Clock className="w-3 h-3" /> Select Time
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em] ml-1">Date</label>
                                                        <Input
                                                            type="date"
                                                            className="h-14 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-2xl px-4 font-bold text-slate-900 dark:text-white focus-visible:ring-blue-500"
                                                            value={formData.date}
                                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em] ml-1">Time</label>
                                                        <Input
                                                            type="time"
                                                            className="h-14 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-2xl px-4 font-bold text-slate-900 dark:text-white focus-visible:ring-blue-500"
                                                            value={formData.time}
                                                            onChange={e => setFormData({ ...formData, time: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={handleBook}
                                                    disabled={isSubmitting}
                                                    className="w-full h-16 rounded-2xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                                                >
                                                    {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mr-3" /> : null}
                                                    {isSubmitting ? "Confirming..." : "Book Appointment"}
                                                </Button>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
