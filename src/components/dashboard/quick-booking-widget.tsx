/**
 * Quick Appointment Booking Widget
 * 
 * Lightweight booking form for receptionists to quickly add walk-in patients
 * or schedule appointments without navigating away from dashboard
 */

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PanzeCard } from "@/components/ui/panze-card";
import { Calendar, Clock, UserPlus, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const DOCTORS = [
    { id: "1", name: "Dr. Sharma" },
    { id: "2", name: "Dr. Patel" },
    { id: "3", name: "Dr. Kumar" }
];

const COMMON_TREATMENTS = [
    "Consultation",
    "Root Canal",
    "Extraction",
    "Cleaning",
    "Filling",
    "Checkup"
];

export function QuickBookingWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        patientName: "",
        phone: "",
        doctor: "",
        date: new Date().toISOString().split('T')[0],
        time: "",
        treatment: "Consultation"
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: Replace with actual API call
        console.log("Quick booking:", formData);

        // Show success state
        setIsSuccess(true);

        toast.success("Appointment booked successfully!", {
            description: `${formData.patientName} scheduled for ${formData.date} at ${formData.time}`
        });

        // Reset after 1.5 seconds
        setTimeout(() => {
            setIsSuccess(false);
            setIsOpen(false);
            setFormData({
                patientName: "",
                phone: "",
                doctor: "",
                date: new Date().toISOString().split('T')[0],
                time: "",
                treatment: "Consultation"
            });
        }, 1500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <PanzeCard className="p-6 cursor-pointer group hover:shadow-xl transition-all duration-300 border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-gradient-to-br from-white to-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 group-hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center">
                            <UserPlus className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Quick Booking</h4>
                            <p className="text-xs text-slate-500">Add walk-in or schedule appointment</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-indigo-600 group-hover:scale-110 transition-transform flex items-center justify-center">
                            <span className="text-white font-bold text-xl">+</span>
                        </div>
                    </div>
                </PanzeCard>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <AnimatePresence mode="wait">
                    {isSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="py-12 flex flex-col items-center justify-center gap-4"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            >
                                <CheckCircle className="w-20 h-20 text-green-500" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-slate-900">Booked!</h3>
                            <p className="text-sm text-slate-600">Appointment added to queue</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">Quick Appointment</DialogTitle>
                                <p className="text-sm text-slate-600">Fast booking for walk-ins and scheduled visits</p>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <Label htmlFor="patientName">Patient Name *</Label>
                                        <Input
                                            id="patientName"
                                            placeholder="John Doe"
                                            value={formData.patientName}
                                            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                            required
                                            className="h-12 mt-1.5"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            required
                                            className="h-12 mt-1.5"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Label htmlFor="treatment">Treatment Type</Label>
                                        <Select
                                            value={formData.treatment}
                                            onValueChange={(value) => setFormData({ ...formData, treatment: value })}
                                        >
                                            <SelectTrigger className="h-12 mt-1.5">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {COMMON_TREATMENTS.map((treatment) => (
                                                    <SelectItem key={treatment} value={treatment}>
                                                        {treatment}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="col-span-2">
                                        <Label htmlFor="doctor">Assign Doctor *</Label>
                                        <Select
                                            value={formData.doctor}
                                            onValueChange={(value) => setFormData({ ...formData, doctor: value })}
                                            required
                                        >
                                            <SelectTrigger className="h-12 mt-1.5">
                                                <SelectValue placeholder="Select doctor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DOCTORS.map((doctor) => (
                                                    <SelectItem key={doctor.id} value={doctor.id}>
                                                        {doctor.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="date">Date *</Label>
                                        <div className="relative mt-1.5">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="date"
                                                type="date"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                required
                                                className="h-12 pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="time">Time *</Label>
                                        <div className="relative mt-1.5">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="time"
                                                type="time"
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                required
                                                className="h-12 pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsOpen(false)}
                                        className="flex-1 h-12"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                                    >
                                        Book Appointment
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
