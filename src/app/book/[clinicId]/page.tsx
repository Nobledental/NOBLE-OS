"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { parseHealthFloID, NOBLE_DENTAL_ID } from "@/lib/id-generator";
import { useSchedulingStore } from "@/lib/scheduling-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Loader2, Phone, User, FileText, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicBookingPage() {
    const params = useParams();
    const clinicId = params.clinicId as string;
    const store = useSchedulingStore();

    const [isValidId, setIsValidId] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingStage, setBookingStage] = useState<'details' | 'slots' | 'success'>('details');

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        reason: "",
        date: "",
        time: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

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
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setBookingStage('success');
        setIsSubmitting(false);
    };

    if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin text-black w-8 h-8" /></div>;

    if (!isValidId) return <div className="min-h-screen bg-white flex items-center justify-center font-black text-2xl">INVALID SESS_ID</div>;

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <div className="relative z-20 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter">NOBLE<span className="text-blue-600">.</span></h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Nallagandla</p>
                </div>
                {store.clinicDetails?.isVerified && (
                    <div className="px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Verified Clinic</span>
                    </div>
                )}
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* Left: Editorial Content */}
                <div className="lg:col-span-5 space-y-8 pt-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h2 className="text-7xl font-black leading-[0.9] tracking-tighter text-black mb-6">
                            Next Gen <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Care.</span>
                        </h2>
                        <p className="text-lg font-medium text-slate-500 leading-relaxed max-w-sm">
                            Experience dentistry reimagined. Book your premium consultation with Dr. Dhivakaran today.
                        </p>
                    </motion.div>

                    <div className="flex gap-8">
                        <div>
                            <p className="text-3xl font-black text-black">4.9</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Google Rating</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-black">500+</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Smiles Crafted</p>
                        </div>
                    </div>
                </div>

                {/* Right: The "Noble Card" */}
                <div className="lg:col-span-7">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100 relative overflow-hidden"
                    >
                        {/* Decorative Gradient Line */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />

                        <AnimatePresence mode="wait">
                            {bookingStage === 'success' ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-10"
                                >
                                    <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tight mb-4">You&apos;re Confirmed.</h3>
                                    <p className="text-slate-500 mb-8 font-medium">We&apos;ve secured your slot. A calendar invite has been sent to your device.</p>

                                    <div className="bg-slate-50 rounded-[2rem] p-8 text-left space-y-4 mb-8 border border-slate-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Time</span>
                                            <span className="text-xl font-black text-black">{formData.time}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Date</span>
                                            <span className="text-xl font-black text-black">{formData.date}</span>
                                        </div>
                                    </div>

                                    <Button onClick={() => window.location.reload()} className="w-full h-16 rounded-2xl bg-black text-white font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all">
                                        Book Another
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Step {bookingStage === 'details' ? '01' : '02'} / 02</p>
                                            <h3 className="text-3xl font-black tracking-tight text-black">
                                                {bookingStage === 'details' ? 'Personal Details' : 'Select Availability'}
                                            </h3>
                                        </div>
                                        <div className="hidden md:block">
                                            <Sparkles className="w-6 h-6 text-yellow-400" />
                                        </div>
                                    </div>

                                    {bookingStage === 'details' ? (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="group">
                                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">First Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="John"
                                                        value={formData.firstName}
                                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                                        className="w-full h-16 bg-slate-50 rounded-2xl px-6 text-lg font-bold text-black border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                                    />
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">Last Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Doe"
                                                        value={formData.lastName}
                                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                                        className="w-full h-16 bg-slate-50 rounded-2xl px-6 text-lg font-bold text-black border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                                    />
                                                </div>
                                            </div>

                                            <div className="group">
                                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">Mobile Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input
                                                        type="tel"
                                                        placeholder="+91 98765 00000"
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full h-16 bg-slate-50 rounded-2xl pl-14 pr-6 text-lg font-bold text-black border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                                    />
                                                </div>
                                            </div>

                                            <div className="group">
                                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">Reason for Visit</label>
                                                <div className="relative">
                                                    <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Tooth ache, Cleaning"
                                                        value={formData.reason}
                                                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                                        className="w-full h-16 bg-slate-50 rounded-2xl pl-14 pr-6 text-lg font-bold text-black border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <Button
                                                    onClick={handleNext}
                                                    className="w-full h-20 rounded-[2rem] bg-black text-white font-black text-lg uppercase tracking-[0.2em] hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-slate-200"
                                                >
                                                    Continue <ChevronRight className="ml-2 w-6 h-6" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="p-2 bg-slate-100 rounded-[1.5rem] flex p-1 mb-8">
                                                <button onClick={() => setBookingStage('details')} className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-white transition-all">Back to Details</button>
                                                <div className="w-full py-4 rounded-2xl bg-white text-black shadow-md text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2">
                                                    <Clock className="w-4 h-4" /> Select Time
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="group">
                                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">Preferred Date</label>
                                                    <input
                                                        type="date"
                                                        value={formData.date}
                                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                        className="w-full h-16 bg-slate-50 rounded-2xl px-6 text-lg font-bold text-black border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">Preferred Time</label>
                                                    <input
                                                        type="time"
                                                        value={formData.time}
                                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                                        className="w-full h-16 bg-slate-50 rounded-2xl px-6 text-lg font-bold text-black border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-8">
                                                <Button
                                                    onClick={handleBook}
                                                    disabled={isSubmitting}
                                                    className="w-full h-20 rounded-[2rem] bg-blue-600 text-white font-black text-lg uppercase tracking-[0.2em] hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-blue-200"
                                                >
                                                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm & Book"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="fixed bottom-6 left-0 w-full text-center pointer-events-none">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em]">Powered by HealthFlo OS</p>
            </div>
        </div>
    );
}
