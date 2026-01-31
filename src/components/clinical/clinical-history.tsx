"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Clock,
    Calendar,
    User,
    ChevronRight
} from "lucide-react";

const MOCK_HISTORY = [
    {
        id: "1",
        date: "2024-01-15",
        doctor: "Dr. Sharma",
        procedure: "Root Canal Treatment",
        tooth: "Tooth 14",
        notes: "Initial access done. Canal cleaned.",
        status: "In Progress"
    },
    {
        id: "2",
        date: "2023-12-20",
        doctor: "Dr. Sharma",
        procedure: "Scaling & Polishing",
        tooth: "Full Mouth",
        notes: "Heavy calculus removed.",
        status: "Completed"
    }
];

export function ClinicalHistory({ patientId }: { patientId: string }) {
    return (
        <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Historical Timeline
            </h3>

            <div className="space-y-3">
                {MOCK_HISTORY.map((item) => (
                    <Card key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer group">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs font-medium text-slate-500">{item.date}</span>
                                </div>
                                <Badge variant={item.status === "Completed" ? "secondary" : "outline"} className="text-[10px]">
                                    {item.status}
                                </Badge>
                            </div>
                            <h4 className="font-bold text-sm group-hover:text-indigo-600 transition-colors">
                                {item.procedure}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 mb-2">
                                <Badge variant="outline" className="text-[10px] bg-indigo-50/50">
                                    {item.tooth}
                                </Badge>
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <User className="w-2 h-2" />
                                    {item.doctor}
                                </div>
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-2 italic">
                                "{item.notes}"
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Button variant="ghost" className="w-full text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                View All Records
                <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
        </div>
    );
}
