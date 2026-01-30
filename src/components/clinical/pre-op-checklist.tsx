"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ClipboardList, PenTool } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChecklistItem {
    id: string
    label: string
    checked: boolean
}

export function PreOpChecklist({ procedure = "Extraction" }: { procedure?: string }) {
    const [items, setItems] = useState<ChecklistItem[]>([
        { id: "history", label: "Medical History Reviewed", checked: false },
        { id: "consent", label: "Consent Signed (Digital Signature)", checked: false },
        { id: "allergies", label: "High-Risk Allergies Flagged", checked: false },
        { id: "vitals", label: "Pre-Op Vitals Verified", checked: true }, // Auto-check if HUD looks good
        { id: "anesthesia", label: "Anesthesia Protocol Confirmed", checked: false }
    ])

    const toggle = (id: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item))
    }

    const allChecked = items.every(i => i.checked)

    return (
        <Card className={cn(
            "border-2 transition-all",
            allChecked ? "border-green-200 bg-green-50/20" : "border-amber-200 bg-amber-50/20"
        )}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-amber-600" />
                        Ayu-Style Pre-Op Checklist: {procedure}
                    </div>
                    {allChecked ? (
                        <Badge className="bg-green-600">READY FOR SURGERY</Badge>
                    ) : (
                        <Badge variant="outline" className="text-amber-600 border-amber-300">PENDING SAFETY CHECKS</Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                            <Checkbox
                                id={item.id}
                                checked={item.checked}
                                onCheckedChange={() => toggle(item.id)}
                                className="h-5 w-5 data-[state=checked]:bg-green-600 border-2"
                            />
                            <Label
                                htmlFor={item.id}
                                className={cn(
                                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                                    item.checked ? "text-slate-400 line-through" : "text-slate-900"
                                )}
                            >
                                {item.label}
                            </Label>
                        </div>
                    ))}
                </div>

                <div className="p-3 bg-white/60 dark:bg-slate-900/60 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-[11px] font-bold text-red-800 dark:text-red-400 uppercase">Emergency Protocol</p>
                        <p className="text-[10px] text-slate-600">Verify site (Tooth 36) and local anesthetic batch before proceeding.</p>
                    </div>
                    <PenTool className="h-4 w-4 text-slate-400" />
                </div>
            </CardContent>
        </Card>
    )
}
