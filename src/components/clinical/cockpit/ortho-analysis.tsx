'use client';

/**
 * Orthodontic Analysis Module
 * 
 * Basic Cephalometric Analysis (Steiner's Analysis).
 * Inputs: SNA, SNB, ANB, FMA, IMPA.
 * Outputs: Skeletal Class (I/II/III), Growth Pattern (High/Low/Avg).
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Calculator, Info, Ruler } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCockpitStore } from '@/lib/clinical-cockpit-store';

// Normal Values (Steiner)
const NORMS = {
    SNA: { mean: 82, sd: 2 },
    SNB: { mean: 80, sd: 2 },
    ANB: { mean: 2, range: [0, 4] },
    FMA: { mean: 25, range: [20, 30] }, // Frankfort Mandibular Plane Angle
    IMPA: { mean: 90, range: [85, 95] } // Incisor Mandibular Plane Angle
};

export function OrthoAnalysis() {
    const [values, setValues] = useState({
        sna: '',
        snb: '',
        fma: '',
        impa: ''
    });

    const [results, setResults] = useState<{
        anb: number;
        skeletalClass: string;
        growthPattern: string;
        incisorInclination: string;
    } | null>(null);

    // Auto-calculate on change
    useEffect(() => {
        const sna = parseFloat(values.sna);
        const snb = parseFloat(values.snb);
        const fma = parseFloat(values.fma);
        const impa = parseFloat(values.impa);

        if (!isNaN(sna) && !isNaN(snb)) {
            const anb = parseFloat((sna - snb).toFixed(1));

            // Skeletal Class Logic
            let skeletalClass = 'Class I (Orthognathic)';
            if (anb > 4) skeletalClass = 'Class II (Retrognathic Mandible / Prog Maxilla)';
            else if (anb < 0) skeletalClass = 'Class III (Prognathic Mandible / Retro Maxilla)';
            else if (anb >= 0 && anb <= 4) skeletalClass = 'Class I (Orthognathic)';

            // Growth Pattern Logic (FMA)
            let growthPattern = 'Average Grower';
            if (!isNaN(fma)) {
                if (fma > 30) growthPattern = 'High Angle (Vertical Grower)';
                else if (fma < 20) growthPattern = 'Low Angle (Horizontal Grower)';
            }

            // IMPA (Incisor)
            let incisorInclination = 'Normal';
            if (!isNaN(impa)) {
                if (impa > 95) incisorInclination = 'Proclined Lower Incisors';
                else if (impa < 85) incisorInclination = 'Retroclined Lower Incisors';
            }

            setResults({ anb, skeletalClass, growthPattern, incisorInclination });
        } else {
            setResults(null);
        }
    }, [values]);

    const handleChange = (field: string, val: string) => {
        setValues(prev => ({ ...prev, [field]: val }));
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Ruler className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Ortho Analysis</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Steiner's Cephalometric Analysis</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Inputs */}
                <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Measurements</h4>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs">SNA (°)</Label>
                            <Input
                                type="number"
                                value={values.sna}
                                onChange={e => handleChange('sna', e.target.value)}
                                placeholder="82"
                                className="h-8 text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">SNB (°)</Label>
                            <Input
                                type="number"
                                value={values.snb}
                                onChange={e => handleChange('snb', e.target.value)}
                                placeholder="80"
                                className="h-8 text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">FMA (°)</Label>
                            <Input
                                type="number"
                                value={values.fma}
                                onChange={e => handleChange('fma', e.target.value)}
                                placeholder="25"
                                className="h-8 text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">IMPA (°)</Label>
                            <Input
                                type="number"
                                value={values.impa}
                                onChange={e => handleChange('impa', e.target.value)}
                                placeholder="90"
                                className="h-8 text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Calculator className="w-3 h-3" /> Diagnosis
                    </h4>

                    {results ? (
                        <div className="space-y-3">
                            {/* Skeletal Class */}
                            <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase">Skeletal Relation</p>
                                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">ANB: {results.anb}°</p>
                                </div>
                                <Badge variant={results.skeletalClass.includes('Class I') ? 'default' : 'destructive'} className="text-[10px]">
                                    {results.skeletalClass.split('(')[0]}
                                </Badge>

                            </div>
                            <p className="text-[10px] text-right text-slate-500 italic">{results.skeletalClass}</p>

                            {/* Growth Pattern */}
                            {results.growthPattern && (
                                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <p className="text-[10px] text-slate-500 uppercase">Growth Pattern</p>
                                    <p className="text-xs font-semibold">{results.growthPattern}</p>
                                </div>
                            )}

                            {/* Incisors */}
                            {results.incisorInclination && (
                                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <p className="text-[10px] text-slate-500 uppercase">Lower Incisors</p>
                                    <p className="text-xs font-semibold">{results.incisorInclination}</p>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                            <Info className="w-5 h-5 mb-2" />
                            <p className="text-xs">Enter SNA & SNB to calculate</p>
                            <p className="text-[10px] mt-1">ANB = SNA - SNB</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
