"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Clock, Calendar, User, ChevronRight, FileText, Syringe, Pill, Stethoscope, Activity, Users
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock Family Members
const FAMILY_MEMBERS = [
    { id: "p123", name: "Dhivakaran (Self)", relation: "Self" },
    { id: "p124", name: "Anitha (Wife)", relation: "Wife" },
    { id: "p125", name: "Rohan (Son)", relation: "Son" }
];

// Mock Timeline Data with multiple types
const MOCK_TIMELINE = [
    {
        id: "1",
        date: "2024-02-10",
        type: "lab",
        title: "Lab Report Uploaded",
        subtitle: "Haemoglobin, WBC Stats",
        doctor: "Auto-Scanner",
        icon: FileText,
        color: "text-emerald-600 bg-emerald-100",
        details: "Detected 4 values."
    },
    {
        id: "2",
        date: "2024-01-15",
        type: "procedure",
        title: "Root Canal Treatment",
        subtitle: "Tooth 14 - Access Opening",
        doctor: "Dr. Sharma",
        icon: Syringe,
        color: "text-rose-600 bg-rose-100",
        details: "Patient reported mild pain."
    },
    {
        id: "3",
        date: "2023-12-20",
        type: "visit",
        title: "Regular Checkup",
        subtitle: "Scaling & Polishing",
        doctor: "Dr. Sharma",
        icon: Stethoscope,
        color: "text-indigo-600 bg-indigo-100",
        details: "Clean bill of health."
    },
    {
        id: "4",
        date: "2023-11-05",
        type: "rx",
        title: "Prescription Issued",
        subtitle: "Amoxicillin, Pan-D",
        doctor: "Dr. Smith",
        icon: Pill,
        color: "text-amber-600 bg-amber-100",
        details: "3 Days Course"
    }
];

export function ClinicalHistory({ patientId }: { patientId: string }) {
    const [selectedMember, setSelectedMember] = useState(FAMILY_MEMBERS[0].id);

    return (
        <div className="space-y-4 h-full flex flex-col">
            {/* Header with Family Switcher */}
            <div className="flex items-center justify-between shrink-0">
                <h3 className="font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    Health Timeline
                </h3>
                <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger className="w-[140px] h-8 text-xs border-indigo-200 bg-indigo-50/50">
                        <Users className="w-3 h-3 mr-2 text-indigo-500" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {FAMILY_MEMBERS.map(m => (
                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Timeline Feed */}
            <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="space-y-6 pl-2 pt-2">
                    {MOCK_TIMELINE.map((item, index) => (
                        <div key={item.id} className="relative pl-6 pb-6 last:pb-0 border-l-2 border-slate-200 dark:border-slate-800 last:border-transparent">
                            {/* Dot */}
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-950 ${item.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-100 ')}`} />

                            {/* Content */}
                            <div className="relative -top-1.5 group cursor-pointer">
                                <span className="text-[10px] font-mono text-muted-foreground bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded mb-1 inline-block">
                                    {item.date}
                                </span>

                                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-slate-50/50 dark:bg-slate-900/50">
                                    <CardContent className="p-3 flex items-start gap-3">
                                        <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>

                                            {item.details && (
                                                <div className="mt-2 text-[11px] text-slate-400 bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-800">
                                                    {item.details}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline" className="text-[9px] h-4 px-1 gap-1">
                                                    <User className="w-2 h-2" /> {item.doctor}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ))}

                    {/* End of Timeline */}
                    <div className="relative pl-6 pt-2">
                        <div className="absolute -left-[5px] top-3 w-2 h-2 rounded-full bg-slate-300" />
                        <p className="text-xs text-muted-foreground">Patient Registered on 2023-10-01</p>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
