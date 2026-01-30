"use client"

import React, { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import { User, Clock, AlertTriangle, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface QueuePatient {
    id: string
    queue_number: number
    status: string
    estimated_wait_mins: number
    is_emergency: boolean
    patient: {
        user: {
            full_name: string
        }
    }
}

export function ActiveQueue() {
    const queryClient = useQueryClient()
    const clinicId = "noble-dental-primary" // Hardcoded for Noble Dental

    const { data: queue, isLoading } = useQuery({
        queryKey: ["activeQueue", clinicId],
        queryFn: async () => {
            const res = await api.get<QueuePatient[]>(`/appointments/queue/${clinicId}`)
            return res.data
        }
    })

    // 🔄 Supabase Realtime Handshake (Master Blueprint Phase 5)
    useEffect(() => {
        const channel = supabase
            .channel('active-queue')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'Appointment',
                filter: `clinic_id=eq.${clinicId}`
            }, (payload) => {
                console.log('Realtime update received:', payload)
                queryClient.invalidateQueries({ queryKey: ["activeQueue", clinicId] })
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [queryClient, clinicId])

    if (isLoading) return <div className="h-64 flex items-center justify-center">Loading queue...</div>

    return (
        <div className="bg-white dark:bg-slate-950 rounded-xl border shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold">Live Patient Queue</h3>
                        <p className="text-[10px] text-muted-foreground">Real-time WebSocket Sync active</p>
                    </div>
                </div>
                <Badge variant="outline" className="bg-white dark:bg-slate-800 text-[10px]">
                    {queue?.length || 0} Patients
                </Badge>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {queue && queue.length > 0 ? (
                    queue.map((item) => {
                        const isLongWait = item.estimated_wait_mins > 20
                        return (
                            <div
                                key={item.id}
                                className={cn(
                                    "p-3 rounded-lg border transition-all flex items-center justify-between group",
                                    item.is_emergency
                                        ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                        : isLongWait
                                            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 animate-pulse-slow"
                                            : "bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-inner",
                                        item.is_emergency
                                            ? "bg-red-600 text-white"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                    )}>
                                        #{item.queue_number}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold">{item.patient.user.full_name}</span>
                                            {item.is_emergency && (
                                                <Badge className="bg-red-600 text-white border-0 text-[8px] h-4 px-1.5 flex gap-1">
                                                    <Zap className="h-2 w-2" /> EMERGENCY
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {item.estimated_wait_mins}m wait
                                            </span>
                                            <span>•</span>
                                            <span className="uppercase">{item.status}</span>
                                        </div>
                                    </div>
                                </div>

                                {isLongWait && !item.is_emergency && (
                                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                                )}
                            </div>
                        )
                    })
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                            <Clock className="h-6 w-6 opacity-20" />
                        </div>
                        <p className="text-xs">No patients in queue</p>
                    </div>
                )}
            </div>

            <div className="p-3 border-t bg-slate-50/50 dark:bg-slate-900/50 text-center">
                <button className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-wider">
                    View Full Waiting Room ↗
                </button>
            </div>
        </div>
    )
}
