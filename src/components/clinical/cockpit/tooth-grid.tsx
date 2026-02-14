'use client';

import React from 'react';
import { useCockpitStore } from '@/lib/clinical-cockpit-store';
import { AdultToothChart } from '@/components/clinical/tooth-chart';

/**
 * ToothGrid Wrapper
 * 
 * Connects the visual `AdultToothChart` to the `clinical-cockpit-store` state.
 * Handles persistence of tooth status (decayed, filled, missing, etc.) and surfaces.
 */
export function ToothGrid() {
    const toothState = useCockpitStore(s => s.toothState);
    const setToothState = useCockpitStore(s => s.setToothState);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Odontogram</h3>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Permanent Dentition (FDI)</span>
            </div>

            <AdultToothChart
                data={toothState}
                onChange={setToothState}
            />
        </div>
    );
}
