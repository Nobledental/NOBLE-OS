/**
 * Treatment Store
 * 
 * Manages clinical treatment records for automated billing
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TreatmentRecord } from '@/types/treatment-record';
import { useBillingStore } from '@/lib/billing-store';

interface TreatmentState {
    treatments: TreatmentRecord[];

    // Actions
    addTreatment: (treatment: Omit<TreatmentRecord, 'id' | 'createdAt' | 'updatedAt' | 'autoAddedToBilling'>) => void;
    updateTreatmentStatus: (id: string, status: TreatmentRecord['status']) => void;
    markAsCompleted: (id: string) => void;
    getTreatmentsByAppointment: (appointmentId: string) => TreatmentRecord[];
    getTreatmentsByPatient: (patientId: string) => TreatmentRecord[];
    getPendingTreatments: () => TreatmentRecord[];
    getCompletedTreatments: (appointmentId?: string) => TreatmentRecord[];
}

export const useTreatmentStore = create<TreatmentState>()(
    persist(
        (set, get) => ({
            treatments: [],

            addTreatment: (newTreatment) => {
                const id = `tr_${Date.now()}_${Math.random().toString(36).substring(7)}`;
                const now = new Date().toISOString();

                const treatment: TreatmentRecord = {
                    ...newTreatment,
                    id,
                    createdAt: now,
                    updatedAt: now,
                    autoAddedToBilling: false,
                    teethCount: newTreatment.teethAffected.length || 1
                };

                set(state => ({
                    treatments: [...state.treatments, treatment]
                }));
            },

            updateTreatmentStatus: (id, status) => {
                set(state => ({
                    treatments: state.treatments.map(t =>
                        t.id === id
                            ? { ...t, status, updatedAt: new Date().toISOString() }
                            : t
                    )
                }));
            },

            markAsCompleted: (id) => {
                const treatment = get().treatments.find(t => t.id === id);

                if (!treatment) return;

                const completedAt = new Date().toISOString();

                // Update treatment status
                set(state => ({
                    treatments: state.treatments.map(t =>
                        t.id === id
                            ? {
                                ...t,
                                status: 'completed',
                                completedAt,
                                updatedAt: completedAt,
                                autoAddedToBilling: true
                            }
                            : t
                    )
                }));

                // Auto-add to billing
                const updatedTreatment = {
                    ...treatment,
                    status: 'completed' as const,
                    completedAt,
                    autoAddedToBilling: true
                };

                useBillingStore.getState().addFromClinical(updatedTreatment);
            },

            getTreatmentsByAppointment: (appointmentId) => {
                return get().treatments.filter(t => t.appointmentId === appointmentId);
            },

            getTreatmentsByPatient: (patientId) => {
                return get().treatments.filter(t => t.patientId === patientId);
            },

            getPendingTreatments: () => {
                return get().treatments.filter(t =>
                    t.status === 'planned' || t.status === 'in_progress'
                );
            },

            getCompletedTreatments: (appointmentId?: string) => {
                const completed = get().treatments.filter(t => t.status === 'completed');

                if (appointmentId) {
                    return completed.filter(t => t.appointmentId === appointmentId);
                }

                return completed;
            }
        }),
        {
            name: 'treatment-storage'
        }
    )
);
