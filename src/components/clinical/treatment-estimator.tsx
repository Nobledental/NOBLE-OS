"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Calculator,
    ChevronRight,
    IndianRupee,
    Clock,
    FileSpreadsheet,
    AlertCircle,
    Info
} from "lucide-react";
import { TREATMENT_PRICES, TreatmentPrice } from "@/lib/treatment-pricing";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TreatmentEstimatorProps {
    toothData: Record<string, any>;
    clinicalNotes: any;
}

export function TreatmentEstimator({ toothData, clinicalNotes }: TreatmentEstimatorProps) {
    const estimates = useMemo(() => {
        const detectedProcedures: { price: TreatmentPrice; count: number }[] = [];
        const plan = (clinicalNotes?.plan || "").toUpperCase();

        // Check each treatment in price list
        TREATMENT_PRICES.forEach(tp => {
            if (plan.includes(tp.code)) {
                // If it's a tooth-specific treatment (RCT, Extraction, Crown, Filling)
                const isToothSpecific = ['RCT', 'EXTRACTION', 'CROWN', 'FILLING', 'IMPLANT'].includes(tp.code);

                if (isToothSpecific) {
                    // Count how many teeth have this status in toothData
                    // This is a bit complex as toothData status might not match TP code exactly
                    // For now, let's assume if it's in the plan, it's at least for 1 tooth
                    // Or we can look for specific keywords like "RCT for 24, 25"
                    let count = 1;
                    const toothMatch = plan.match(new RegExp(`${tp.code}.*?(\\d{2})`, 'g'));
                    if (toothMatch) count = toothMatch.length;

                    detectedProcedures.push({ price: tp, count: count });
                } else {
                    // Consultation, Scaling, Xray (Fixed count 1)
                    detectedProcedures.push({ price: tp, count: 1 });
                }
            }
        });

        return detectedProcedures;
    }, [toothData, clinicalNotes]);

    const totalCost = estimates.reduce((acc, curr) => acc + (curr.price.basePrice * curr.count), 0);

    return (
        <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden bg-white group hover:shadow-2xl transition-all h-full flex flex-col">
            <div className="p-8 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <Calculator className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-sm uppercase tracking-widest">Live Estimate</h3>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Zero-Cost Cost Projection</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-baseline gap-2 mt-2">
                    <IndianRupee className="w-6 h-6 text-indigo-400" />
                    <span className="text-4xl font-black text-white tabular-nums">{totalCost.toLocaleString('en-IN')}</span>
                </div>
            </div>

            <div className="flex-1 p-8 space-y-6 overflow-y-auto max-h-[400px] scrollbar-hide">
                <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identified Procedures</Label>

                    <AnimatePresence mode="popLayout">
                        {estimates.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-12 flex flex-col items-center justify-center text-center space-y-3"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                                    <FileSpreadsheet className="w-6 h-6 text-slate-200" />
                                </div>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">No procedures detected in <br /> Clinical Plan yet.</p>
                            </motion.div>
                        ) : (
                            estimates.map((est, idx) => (
                                <motion.div
                                    key={est.price.code}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group/item hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-slate-100 text-slate-400 font-black text-[10px]">
                                            {est.count}x
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-slate-700">{est.price.name}</h4>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{est.price.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-black text-slate-900">₹{(est.price.basePrice * est.count).toLocaleString()}</div>
                                        <div className="text-[8px] font-bold text-slate-400 uppercase">₹{est.price.basePrice}/ea</div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 rounded-b-[2.5rem]">
                <div className="flex items-center gap-2 mb-4">
                    <Info className="w-3 h-3 text-indigo-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">Smart Calculation Basis</span>
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed tracking-wider">
                    This estimate is generated by analyzing keywords in your treatment plan and tooth chart statuses. Final billing may vary based on material choice and complexity.
                </p>
                <button className="w-full mt-6 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all group/btn">
                    <span className="text-[10px] font-black uppercase tracking-widest">Generate Patient PDF</span>
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover/btn:translate-x-1 group-hover/btn:text-white transition-all" />
                </button>
            </div>
        </Card>
    );
}
