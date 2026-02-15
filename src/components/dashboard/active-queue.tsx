"use client"

import React, { useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import { Plus, CheckCircle2, Activity, Clock, Stethoscope, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { PanzeCard } from "@/components/ui/panze-card"
import { Badge } from "@/components/ui/badge"

interface QueuePatient {
    id: string
    queue_number: number
    status: string
    estimated_wait_mins: number
    is_emergency: boolean
    visit_type?: string
    patient: {
        user: {
            full_name: string
        }
        age?: number
        gender?: string
        phone?: string
    }
}

interface ActiveQueueProps {
    onPatientSelect?: (patient: {
        id: string;
        name: string;
        age?: number;
        gender?: string;
        phone?: string;
    }) => void;
}

export function ActiveQueue({ onPatientSelect }: ActiveQueueProps) {
    const queryClient = useQueryClient()
    const { user } = useAuth()
    const clinicId = user?.selectedClinic?.id || "noble-dental-primary"

    const { data: queue, isLoading } = useQuery({
        queryKey: ["activeQueue", clinicId],
        queryFn: async () => {
            const res = await api.get<QueuePatient[]>(`/appointments/queue/${clinicId}`)
            return res.data
        }
    })

    useEffect(() => {
        const channel = supabase
            .channel('active-queue')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'Appointment',
                filter: `clinic_id=eq.${clinicId}`
            }, () => {
                queryClient.invalidateQueries({ queryKey: ["activeQueue", clinicId] })
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [queryClient, clinicId])

    return (
        <PanzeCard className="h-full flex flex-col p-5 bg-white/95 backdrop-blur-xl border-slate-200/60 overflow-hidden">
            <div className="flex items-center justify-between mb-5">
                <div className="space-y-0.5">
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">Clinical Queue</h3>
                    <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-clinical-complete animate-pulse" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Live Queue Synchronized</span>
                    </div>
                </div>
                <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-clinical-action hover:text-white transition-colors border border-slate-200">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                {queue && queue.length > 0 ? (
                    queue.map((item, i) => (
                        <div
                            key={item.id}
                            onClick={() => onPatientSelect?.({
                                id: item.id,
                                name: item.patient.user.full_name,
                                age: item.patient.age,
                                gender: item.patient.gender,
                                phone: item.patient.phone,
                            })}
                            className={cn(
                                "p-4 rounded-2xl flex items-center gap-4 transition-all cursor-pointer border animate-in fade-in duration-200",
                                i === 0
                                    ? "bg-indigo-50/80 border-indigo-200/60 shadow-sm"
                                    : "bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-slate-100/80"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm transition-colors",
                                i === 0 ? "bg-clinical-action text-white shadow-md" : "bg-white text-slate-400 border border-slate-200"
                            )}>
                                <User className="w-5 h-5" />
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold tracking-tight text-base text-slate-900">{item.patient.user.full_name}</h4>
                                    {item.is_emergency && (
                                        <Badge className="bg-red-100 text-red-700 border-red-200 font-black text-[8px] uppercase tracking-widest px-2 py-0.5">SOS</Badge>
                                    )}
                                </div>
                                <p className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest",
                                    i === 0 ? "text-slate-500" : "text-slate-400"
                                )}>
                                    {item.visit_type || 'CONSULTATION'} • <span className={i === 0 ? "text-clinical-action" : "text-clinical-action/60"}>{item.estimated_wait_mins}M WAIT</span>
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                    i === 0 ? "bg-clinical-action text-white" : "bg-slate-100 text-slate-400 hover:bg-clinical-action hover:text-white"
                                )}>
                                    <Stethoscope className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Active indicator for top item */}
                            {i === 0 && (
                                <div className="absolute bottom-0 left-0 h-1 bg-clinical-action w-full rounded-b-2xl" />
                            )}
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center py-10 space-y-4 opacity-50">
                        <Activity className="w-12 h-12 text-slate-300" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No Active Sessions</p>
                    </div>
                )}
            </div>
        </PanzeCard>
    )
}
