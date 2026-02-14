'use client';

/**
 * Vitals Recorder
 * 
 * Slider-based vital signs input (no typing needed).
 * Auto-flags abnormal values (BP > 140/90, SpO2 < 95).
 * Used for both PRE_OP and POST_OP contexts.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCockpitStore, type VitalsRecord } from '@/lib/clinical-cockpit-store';

interface VitalsRecorderProps {
    type: 'PRE_OP' | 'POST_OP' | 'ROUTINE';
}

interface VitalConfig {
    key: string;
    label: string;
    unit: string;
    min: number;
    max: number;
    default: number;
    step: number;
    warningHigh?: number;
    warningLow?: number;
    criticalHigh?: number;
    criticalLow?: number;
}

const VITAL_CONFIGS: VitalConfig[] = [
    { key: 'temperature', label: 'Temperature', unit: '°F', min: 95, max: 106, default: 98.6, step: 0.2, warningHigh: 100, criticalHigh: 103 },
    { key: 'bpSystolic', label: 'BP Systolic', unit: 'mmHg', min: 60, max: 250, default: 120, step: 2, warningHigh: 140, criticalHigh: 180 },
    { key: 'bpDiastolic', label: 'BP Diastolic', unit: 'mmHg', min: 30, max: 150, default: 80, step: 2, warningHigh: 90, criticalHigh: 120 },
    { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', min: 30, max: 200, default: 72, step: 1, warningHigh: 100, criticalHigh: 150, warningLow: 50, criticalLow: 40 },
    { key: 'spo2', label: 'SpO₂', unit: '%', min: 70, max: 100, default: 98, step: 1, warningLow: 95, criticalLow: 90 },
    { key: 'respiratoryRate', label: 'Respiratory Rate', unit: '/min', min: 8, max: 40, default: 16, step: 1, warningHigh: 22, criticalHigh: 30 },
];

function getVitalStatus(config: VitalConfig, value: number): 'normal' | 'warning' | 'critical' {
    if ((config.criticalHigh && value >= config.criticalHigh) || (config.criticalLow && value <= config.criticalLow))
        return 'critical';
    if ((config.warningHigh && value >= config.warningHigh) || (config.warningLow && value <= config.warningLow))
        return 'warning';
    return 'normal';
}

const statusColors = {
    normal: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/30',
    warning: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/30',
    critical: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800/30',
};

const sliderColors = {
    normal: 'accent-emerald-500',
    warning: 'accent-amber-500',
    critical: 'accent-red-500',
};

export function VitalsRecorder({ type }: VitalsRecorderProps) {
    const addVitals = useCockpitStore(s => s.addVitals);
    const existingVitals = useCockpitStore(s => s.vitals);
    const [values, setValues] = useState<Record<string, number>>(
        Object.fromEntries(VITAL_CONFIGS.map(c => [c.key, c.default]))
    );
    const [saved, setSaved] = useState(false);

    const hasExisting = existingVitals.some(v => v.type === type);

    const updateValue = useCallback((key: string, val: number) => {
        setValues(prev => ({ ...prev, [key]: val }));
    }, []);

    const handleSave = useCallback(() => {
        const vitals: VitalsRecord = {
            temperature: values.temperature,
            bpSystolic: values.bpSystolic,
            bpDiastolic: values.bpDiastolic,
            heartRate: values.heartRate,
            spo2: values.spo2,
            respiratoryRate: values.respiratoryRate,
            cns: 'Alert & Oriented',
            recordedAt: new Date().toISOString(),
            type,
        };
        addVitals(vitals);
        setSaved(true);
    }, [values, type, addVitals]);

    const alerts = VITAL_CONFIGS.filter(c => getVitalStatus(c, values[c.key]) !== 'normal');

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-500" />
                    {type === 'PRE_OP' ? 'Pre-Op' : type === 'POST_OP' ? 'Post-Op' : 'Routine'} Vitals
                </h3>
                {saved && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Saved
                    </Badge>
                )}
            </div>

            {/* Alert Banner */}
            {alerts.length > 0 && (
                <div className="mb-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-lg p-2.5">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-[11px] font-bold text-amber-700">ABNORMAL VALUES DETECTED</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {alerts.map(a => (
                            <Badge key={a.key} variant="outline" className={cn('text-[9px]', statusColors[getVitalStatus(a, values[a.key])])}>
                                {a.label}: {values[a.key]} {a.unit}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Slider Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {VITAL_CONFIGS.map(config => {
                    const value = values[config.key];
                    const status = getVitalStatus(config, value);

                    return (
                        <div key={config.key} className={cn('rounded-lg border p-3', statusColors[status])}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-semibold uppercase tracking-wider">{config.label}</span>
                                <span className="text-sm font-bold">
                                    {value} <span className="text-[10px] font-normal">{config.unit}</span>
                                </span>
                            </div>
                            <input
                                type="range"
                                min={config.min}
                                max={config.max}
                                step={config.step}
                                value={value}
                                onChange={e => updateValue(config.key, Number(e.target.value))}
                                className={cn('w-full h-2 rounded-lg cursor-pointer', sliderColors[status])}
                            />
                            <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                                <span>{config.min}</span>
                                <span>{config.max}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Save Button */}
            {!saved && (
                <div className="flex justify-end mt-4">
                    <Button
                        size="sm"
                        onClick={handleSave}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                    >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Save Vitals
                    </Button>
                </div>
            )}
        </div>
    );
}
