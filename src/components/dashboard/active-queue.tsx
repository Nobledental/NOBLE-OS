"use client"

import React, { useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import { Plus, CheckCircle2 } from "lucide-react"
import { PanzeCard } from "@/components/ui/panze-card"

interface QueuePatient {
    id: string
    queue_number: number
    status: string
    estimated_wait_mins: number
    is_emergency: boolean
    visit_type?: string // 'CONSULTATION', 'PROCEDURE'
    patient: {
        user: {
            full_name: string
        }
    }
}

export function ActiveQueue() {
    const queryClient = useQueryClient()
    const clinicId = "noble-dental-primary"

    const { data: queue, isLoading } = useQuery({
        queryKey: ["activeQueue", clinicId],
        queryFn: async () => {
            const res = await api.get<QueuePatient[]>(`/appointments/queue/${clinicId}`)
            return res.data
        }
    })

    // 🔄 Supabase Realtime Handshake
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

    const tags = [
        { label: 'Today', active: true },
        { label: 'Tomorrow', active: false },
    ];

    return (
        <PanzeCard className="h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-slate-900">My Queue</h3>
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <Plus className="w-5 h-5 text-slate-500" />
                </button>
            </div>

            <div className="flex gap-2 mb-6">
                {tags.map(tag => (
                    <button
                        key={tag.label}
                        className={cn(
                            "px-5 py-2 rounded-full text-sm font-medium transition-colors",
                            tag.active
                                ? "bg-slate-900 text-white"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        {tag.label}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <div className="bg-slate-900 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                        {queue?.length || 0}
                    </div>
                    <span className="text-sm font-medium text-slate-600">On Going Patients</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {queue && queue.length > 0 ? (
                    queue.map((item, i) => (
                        <div
                            key={item.id}
                            className={cn(
                                "p-4 rounded-[1.2rem] flex items-start gap-4 transition-all group cursor-pointer",
                                i === 0 ? "bg-[#FFF7ED]" : "bg-slate-50 hover:bg-slate-100" // Orange tint for top item
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center text-lg",
                                i === 0 ? "bg-[#FFedd5] text-[#F97316]" : "bg-white text-slate-400"
                            )}>
                                {/* Icon placeholder logic based on type could go here */}
                                <CheckCircle2 className="w-5 h-5" />
                            </div>

                            <div className="flex-1">
                                <h4 className="text-slate-900 font-semibold text-sm mb-1">{item.patient.user.full_name}</h4>
                                <p className="text-slate-500 text-xs line-clamp-2">
                                    {item.visit_type || 'General Consultation'} • {item.estimated_wait_mins}m wait
                                </p>
                            </div>

                            {i === 0 && (
                                <div className="w-6 h-6 rounded-full bg-[#F97316] text-white flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-400 text-sm">
                        No patients in queue
                    </div>
                )}
            </div>
        </PanzeCard>
    )
}
