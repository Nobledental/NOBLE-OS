"use client"

import React, { useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import { Plus, CheckCircle2, Activity, Clock, Zap, User } from "lucide-react"
import { PanzeCard } from "@/components/ui/panze-card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

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
        <PanzeCard className="h-full flex flex-col p-8 border-white/40 bg-white/60 overflow-hidden relative group glass-white">
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="space-y-1">
                    <h3 className="text-3xl font-bold tracking-tight text-slate-900">Clinical Queue</h3>
                    <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-neo-emerald animate-pulse" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Sync Active</span>
                    </div>
                </div>
                <button className="w-12 h-12 rounded-2xl bg-slate-900/5 text-slate-900 flex items-center justify-center hover:scale-110 transition-all shadow-xl border border-slate-200 backdrop-blur-md">
                    <Plus className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide relative z-10">
                <AnimatePresence mode="popLayout">
                    {queue && queue.length > 0 ? (
                        queue.map((item, i) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={item.id}
                                className={cn(
                                    "p-6 rounded-[2.5rem] flex items-center gap-5 transition-all cursor-pointer border relative overflow-hidden group/item",
                                    i === 0
                                        ? "bg-slate-900/5 text-slate-900 border-slate-200 shadow-xl"
                                        : "bg-white/20 border-white/40 hover:border-slate-300 hover:bg-white/40 text-slate-600"
                                )}
                            >
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center text-lg shadow-sm transition-colors",
                                    i === 0 ? "bg-neo-vibrant-blue text-white shadow-lg shadow-neo-vibrant-blue/20" : "bg-white/40 text-slate-400"
                                )}>
                                    <User className="w-6 h-6" />
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold tracking-tight text-xl text-slate-900">{item.patient.user.full_name}</h4>
                                        {item.is_emergency && (
                                            <Badge className="bg-rose-500 hover:bg-rose-600 border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5 text-white">SOS</Badge>
                                        )}
                                    </div>
                                    <p className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest",
                                        i === 0 ? "text-slate-500" : "text-slate-400"
                                    )}>
                                        {item.visit_type || 'CONSULTATION'} • <span className={i === 0 ? "text-neo-vibrant-blue" : "text-neo-vibrant-blue/60"}>{item.estimated_wait_mins}M WAIT</span>
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                        i === 0 ? "bg-neo-vibrant-blue text-white" : "bg-slate-100 text-slate-400 group-hover/item:bg-neo-vibrant-blue group-hover/item:text-white"
                                    )}>
                                        <Zap className={cn("w-4 h-4", i === 0 ? "fill-white" : "group-hover/item:fill-white")} />
                                    </div>
                                </div>

                                {/* Progress bar for top item */}
                                {i === 0 && (
                                    <div className="absolute bottom-0 left-0 h-1.5 bg-neo-vibrant-blue w-full" />
                                )}
                            </motion.div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center py-10 space-y-4 opacity-50">
                            <Activity className="w-12 h-12 text-slate-300" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No Active Sessions</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Background Aesthetic */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-neo-vibrant-blue/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-neo-vibrant-blue/10 transition-all duration-700" />
        </PanzeCard>
    )
}
