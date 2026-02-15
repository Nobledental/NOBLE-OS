'use client';

import React from 'react';
import { useCockpitStore } from '@/lib/clinical-cockpit-store';
import { DentitionChart } from '@/components/clinical/tooth-chart';
import { getDentitionMode } from '@/types/clinical';
import { Baby, User, Users } from 'lucide-react';

/**
 * ToothGrid Wrapper — Age-Aware
 * 
 * Connects the visual `DentitionChart` to the `clinical-cockpit-store` state.
 * Automatically switches between ADULT / MIXED / CHILD dentition based on patient age.
 */
export function ToothGrid() {
    const toothState = useCockpitStore(s => s.toothState);
    const setToothState = useCockpitStore(s => s.setToothState);
    const patient = useCockpitStore(s => s.patient);

    const age = patient?.age ?? 30;
    const mode = getDentitionMode(age);

    const ModeIcon = mode === 'CHILD' ? Baby : mode === 'MIXED' ? Users : User;
    const modeLabel = mode === 'ADULT' ? 'Permanent Dentition (FDI)' : mode === 'CHILD' ? 'Deciduous Dentition (FDI)' : 'Mixed Dentition (FDI)';

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Odontogram</h3>
                <span className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                    <ModeIcon className="w-3 h-3" />
                    {modeLabel}
                </span>
            </div>

            <DentitionChart
                data={toothState}
                onChange={setToothState}
                mode={mode}
            />
        </div>
    );
}
