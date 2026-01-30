"use client"

import { format } from "date-fns"
import { FileText, Stethoscope, ClipboardList } from "lucide-react"

interface ClinicalTimelineProps {
    records: any[]
}

export function ClinicalTimeline({ records }: ClinicalTimelineProps) {
    if (!records || records.length === 0) return (
        <div className="py-8 text-center text-sm text-muted-foreground italic">
            No clinical visits recorded yet.
        </div>
    )

    return (
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {records.map((record, idx) => (
                <div key={record.id} className="relative flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-indigo-500 shadow-sm z-10 shrink-0">
                        {record.diagnosis ? <Stethoscope className="h-5 w-5 text-indigo-500" /> : <FileText className="h-5 w-5 text-slate-400" />}
                    </div>
                    <div className="flex-1 rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold text-slate-900">
                                {record.diagnosis || "General Consult"}
                            </h4>
                            <time className="text-[10px] text-muted-foreground uppercase font-medium">
                                {format(new Date(record.created_at), "MMM d, yyyy")}
                            </time>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                            {record.clinical_findings || "No findings recorded."}
                        </p>

                        {record.visit_vitals && (
                            <div className="flex items-center space-x-3 mt-2 pt-2 border-t border-dashed">
                                <div className="text-[10px] text-muted-foreground">
                                    <span className="font-semibold text-slate-700">BP:</span> {record.visit_vitals.bp}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                    <span className="font-semibold text-slate-700">HR:</span> {record.visit_vitals.hr}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                    <span className="font-semibold text-slate-700">Temp:</span> {record.visit_vitals.temp}°C
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
