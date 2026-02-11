"use client";

import { useState } from "react";
import {
    Heart,
    MessageCircle,
    Star,
    TrendingUp,
    Share2,
    ThumbsUp,
    ThumbsDown,
    MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function PatientSentimentHub() {
    const [npsScore, setNpsScore] = useState(72);

    const reviews = [
        { id: 1, name: "Sita Ram", rating: 5, text: "Excellent care, dr. priya was very gentle.", source: "Google", time: "2h ago", sentiment: "positive" },
        { id: 2, name: "John Deo", rating: 4, text: "Wait time was a bit long but service was good.", source: "Practo", time: "5h ago", sentiment: "neutral" },
        { id: 3, name: "Anita K.", rating: 5, text: "Best dental clinic in the city! Loved the ambiance.", source: "Direct", time: "1d ago", sentiment: "positive" },
    ];

    const handleRequestReview = () => {
        toast.success("Review Request Sent", {
            description: "SMS campaign triggered for 12 recent patients."
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 text-pink-600 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                            <Heart size={14} className="animate-pulse" /> Patient Love
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">Sentiment Hub</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">NPS Tracking & Reputation Management</p>
                    </div>
                    <Button
                        onClick={handleRequestReview}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 rounded-xl px-6 py-6 font-black text-xs uppercase tracking-widest"
                    >
                        <Share2 className="w-4 h-4 mr-2" /> Request Reviews
                    </Button>
                </div>

                {/* NPS Gauge & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* NPS Card */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Net Promoter Score</h3>
                            <p className="text-sm text-slate-400">World-class loyalty metric.</p>
                        </div>
                        <div className="relative z-10 mt-6 flex items-baseline gap-2">
                            <span className="text-6xl font-black">{npsScore}</span>
                            <span className="text-emerald-400 text-sm font-bold flex items-center gap-1">
                                <TrendingUp size={14} /> +4.2%
                            </span>
                        </div>
                        <div className="mt-6 h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${npsScore}%` }}
                                className="h-full bg-gradient-to-r from-pink-500 to-indigo-500"
                            />
                        </div>
                        {/* Decorative */}
                        <Star className="absolute top-[-20px] right-[-20px] text-white/5 w-48 h-48 rotate-12" />
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col justify-center items-center text-center gap-2 hover:scale-[1.02] transition-transform">
                        <div className="p-4 bg-amber-50 text-amber-500 rounded-full mb-2">
                            <Star size={32} fill="currentColor" />
                        </div>
                        <div className="text-4xl font-black text-slate-900">4.9/5</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Rating</div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col justify-center items-center text-center gap-2 hover:scale-[1.02] transition-transform">
                        <div className="p-4 bg-blue-50 text-blue-500 rounded-full mb-2">
                            <MessageCircle size={32} />
                        </div>
                        <div className="text-4xl font-black text-slate-900">128</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Reviews</div>
                    </div>
                </div>

                {/* Feedback Feed */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-black uppercase tracking-tighter text-xl text-slate-900">Recent Feedback</h3>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200 text-slate-400">
                                <MoreHorizontal size={20} />
                            </Button>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {reviews.map((review) => (
                            <div key={review.id} className="p-8 hover:bg-slate-50 transition-colors flex gap-6 items-start">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white ${review.sentiment === 'positive' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-amber-500 shadow-lg shadow-amber-500/20'
                                    }`}>
                                    {review.rating}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">{review.name}</h4>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                <span>{review.source}</span>
                                                <span>•</span>
                                                <span>{review.time}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-lg hover:bg-slate-100">
                                                Reply
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-slate-600 font-medium leading-relaxed">"{review.text}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
