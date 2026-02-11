'use client';

import { useState } from 'react';
import {
    Crown,
    Star,
    Zap,
    ShieldCheck,
    Clock,
    PhoneCall,
    ShoppingBag,
    Gift,
    ArrowRight,
    UserCircle,
    Sparkles,
    CalendarCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function NobleOnePortal() {
    const [isMember, setIsMember] = useState(true);

    // Mock Member Data (In production, this comes from useUser() / Supabase)
    const member = {
        name: "Dhivakaran",
        tier: "Gold",
        status: "Active",
        points: 650,
        savings: 1400,
        nextReward: "Platinum Tier",
        rewardProgress: 2 // cleanings away
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto space-y-10">
                {/* Membership Hero Section */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="space-y-6 max-w-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                                    <Crown className="text-amber-400" size={32} />
                                </div>
                                <h1 className="text-5xl font-black tracking-tighter">Noble One</h1>
                            </div>
                            <p className="text-lg font-medium text-indigo-100 leading-relaxed">
                                Welcome back, {member.name}. Your {member.tier} status gives you absolute clinical peace of mind.
                            </p>
                            <div className="flex gap-4">
                                <Button
                                    className="px-8 h-14 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 hover:bg-white transition-all shadow-xl"
                                    onClick={() => toast.info("Subscription Management Portal Opening...")}
                                >
                                    Manage Subscription
                                </Button>
                                <NewAppointmentDialog />
                            </div>
                        </div>

                        <div className="hidden md:block relative group">
                            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 rotate-[5deg] group-hover:rotate-0 transition-all duration-700">
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Member Status</div>
                                <div className="text-3xl font-black">{member.status} {member.tier}</div>
                                <div className="mt-8 space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                                        <ShieldCheck size={14} /> ₹{member.savings.toLocaleString()} Saved this year
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                                        <Zap size={14} /> Priority Lane Active
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Background */}
                    <Sparkles className="absolute top-10 right-10 text-white/10" size={120} />
                </div>

                {/* Exclusive Benefit Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Priority Access', desc: 'Skip the wait with exclusive member slots.', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { title: 'Unlimited Tele-Care', desc: 'Zero-cost follow-ups with your clinical team.', icon: PhoneCall, color: 'text-purple-500', bg: 'bg-purple-50' },
                        { title: 'Specialist Concierge', desc: 'Direct access to senior clinicians 24/7.', icon: UserCircle, color: 'text-pink-500', bg: 'bg-pink-50' },
                    ].map((benefit, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl hover:scale-[1.02] transition-all">
                            <div className={`p-4 rounded-2xl ${benefit.bg} ${benefit.color} w-fit mb-6`}>
                                <benefit.icon size={24} />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-slate-900">{benefit.title}</h3>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed">{benefit.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Automated Health Reordering (Instamart Logic) */}
                <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
                    <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-pink-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">
                                <ShoppingBag size={14} /> Smart Health Reordering
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter text-slate-900">Hygiene Essentials Hub</h2>
                            <p className="text-sm font-medium text-slate-400 mt-2">Personalized reordering based on your clinical plan.</p>
                        </div>
                        <button className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 hover:opacity-75 tracking-widest">
                            View All Products <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { name: "Noble Ortho Kit", price: "₹850", img: "📦", freq: "Every 3 Months" },
                            { name: "Sensitive Care Paste", price: "₹210", img: "🧼", freq: "Monthly" },
                            { name: "Eco-Friendly Brush", price: "₹150", img: "🪥", freq: "Every 2 Months" },
                        ].map((item, i) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-pink-200 transition-all">
                                <div className="text-4xl mb-6">{item.img}</div>
                                <h4 className="font-black text-slate-900">{item.name}</h4>
                                <div className="flex justify-between items-center mt-4">
                                    <div className="text-lg font-black text-pink-600">{item.price}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.freq}</div>
                                </div>
                                <button className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-pink-600 transition-all">
                                    Setup Auto-ship
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Membership Loyalty Progress */}
                <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Gift size={24} className="text-amber-400" />
                            <h3 className="font-black text-xl uppercase tracking-tighter">Your Noble Loyalty</h3>
                        </div>
                        <p className="text-xs font-medium text-slate-400">
                            &quot;You are {member.rewardProgress} cleanings away from unlocking the &apos;{member.nextReward}&apos;—includes free whitening for life.&quot;
                        </p>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                        <div className="text-right">
                            <div className="text-2xl font-black">{member.points} Pts</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Status Points</div>
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 border-amber-400/20 border-t-amber-400 flex items-center justify-center animate-spin-slow">
                            <Star className="text-amber-400" size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
