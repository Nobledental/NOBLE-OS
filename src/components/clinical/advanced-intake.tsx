"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    HeartPulse,
    Baby,
    Zap,
    AlertCircle,
    Settings2,
    Stethoscope,
    Activity,
    Wine,
    Dna
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type AdvancedIntakeState = {
    // Women's Health
    isPregnant: boolean;
    isNursing: boolean;
    isOnBirthControl: boolean;

    // Surgical Risks
    hasBleedingDisorder: boolean;
    hasEasyBruising: boolean;
    isOnBloodThinners: boolean;
    isDiabetic: boolean;
    hbA1cLevel?: string;

    // Lifestyle
    usesTobacco: boolean;
    usesAlcohol: boolean;
    tobaccoFrequency?: 'OCCASIONAL' | 'FREQUENT' | 'HEAVY';
    alcoholFrequency?: 'OCCASIONAL' | 'FREQUENT' | 'HEAVY';
};

interface AdvancedIntakeProps {
    data?: AdvancedIntakeState;
    onChange?: (data: AdvancedIntakeState) => void;
}

export function AdvancedIntake({ data, onChange }: AdvancedIntakeProps) {
    const [state, setState] = useState<AdvancedIntakeState>(data || {
        isPregnant: false,
        isNursing: false,
        isOnBirthControl: false,
        hasBleedingDisorder: false,
        hasEasyBruising: false,
        isOnBloodThinners: false,
        isDiabetic: false,
        usesTobacco: false,
        usesAlcohol: false,
    });

    const updateState = (updates: Partial<AdvancedIntakeState>) => {
        const newState = { ...state, ...updates };
        setState(newState);
        onChange?.(newState);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2 px-2">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <HeartPulse className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Advanced Intake 2.0</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High-Risk Clinical Markers</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Women's Health Section */}
                <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Baby className="w-4 h-4 text-pink-500" />
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Women's Health</Label>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                <span className="text-xs font-bold text-slate-700">Is Pregnant</span>
                                <Switch
                                    checked={state.isPregnant}
                                    onCheckedChange={(val) => updateState({ isPregnant: val })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                <span className="text-xs font-bold text-slate-700">Nursing</span>
                                <Switch
                                    checked={state.isNursing}
                                    onCheckedChange={(val) => updateState({ isNursing: val })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                <span className="text-xs font-bold text-slate-700">Birth Control Pills</span>
                                <Switch
                                    checked={state.isOnBirthControl}
                                    onCheckedChange={(val) => updateState({ isOnBirthControl: val })}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Surgical Risks Section */}
                <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Surgical Risks</Label>
                        </div>

                        <div className="space-y-3">
                            <div className={cn(
                                "flex items-center justify-between p-3 bg-slate-50 rounded-2xl transition-all",
                                state.hasBleedingDisorder && "bg-rose-50 border-rose-100 border"
                            )}>
                                <span className="text-xs font-bold text-slate-700">Bleeding Disorder</span>
                                <Switch
                                    checked={state.hasBleedingDisorder}
                                    onCheckedChange={(val) => updateState({ hasBleedingDisorder: val })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                <span className="text-xs font-bold text-slate-700">Blood Thinners</span>
                                <Switch
                                    checked={state.isOnBloodThinners}
                                    onCheckedChange={(val) => updateState({ isOnBloodThinners: val })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                <span className="text-xs font-bold text-slate-700">Diabetes</span>
                                <Switch
                                    checked={state.isDiabetic}
                                    onCheckedChange={(val) => updateState({ isDiabetic: val })}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Lifestyle Section */}
                <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Wine className="w-4 h-4 text-indigo-500" />
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Lifestyle Habits</Label>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                <span className="text-xs font-bold text-slate-700">Tobacco / Smoking</span>
                                <Switch
                                    checked={state.usesTobacco}
                                    onCheckedChange={(val) => updateState({ usesTobacco: val })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                <span className="text-xs font-bold text-slate-700">Alcohol Consumption</span>
                                <Switch
                                    checked={state.usesAlcohol}
                                    onCheckedChange={(val) => updateState({ usesAlcohol: val })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                <span className="text-xs font-bold text-slate-700">History of Trauma</span>
                                <Switch
                                    checked={false} // Placeholder for expansion
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </div >

            {/* Critical Alert Banner */}
            {
                state.hasBleedingDisorder && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-rose-600 rounded-[2rem] shadow-xl shadow-rose-200 border border-rose-500 flex items-center gap-6"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">High Alert: Bleeding Risk Detected</h4>
                            <p className="text-white/80 text-[10px] font-bold mt-1 uppercase leading-relaxed tracking-wider">
                                Patient has indicated a bleeding disorder. Consult with physician before any surgical extractions or deep scaling.
                            </p>
                        </div>
                    </motion.div>
                )
            }
        </div >
    );
}
