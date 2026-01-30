"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Phone, Mail, MapPin, Activity } from "lucide-react";

export default function PatientDetailPage() {
    const { id } = useParams();

    const { data: patient, isLoading } = useQuery({
        queryKey: ['patient', id],
        queryFn: async () => {
            const res = await api.get(`/patients/${id}`);
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
    );

    if (!patient) return (
        <div className="h-screen flex items-center justify-center">
            <p>Patient not found.</p>
        </div>
    );

    return (
        <div className="p-8 space-y-6">
            {/* Hero Section */}
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-6">
                    <Avatar className="h-20 w-20">
                        <AvatarFallback className="text-2xl">{patient.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold">{patient.name}</h1>
                        <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{patient.healthflo_id}</Badge>
                            <span className="text-muted-foreground text-sm">{patient.gender}, {patient.age} yrs</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contact Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Contact Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center text-sm">
                            <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                            {patient.pii?.primary_contact || patient.user?.phone}
                        </div>
                        <div className="flex items-center text-sm">
                            <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                            {patient.pii?.email || patient.user?.email || "No email"}
                        </div>
                        <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
                            {patient.pii?.full_address || "No address provided"}
                        </div>
                    </CardContent>
                </Card>

                {/* Clinical Summary */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Medical Baseline</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                            <Label className="text-[10px] uppercase text-muted-foreground">Blood Group</Label>
                            <p className="font-semibold">{patient.blood_group || "Unknown"}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                            <Label className="text-[10px] uppercase text-muted-foreground">Allergies</Label>
                            <p className="text-sm">{patient.allergies?.list?.join(", ") || "None recorded"}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Timeline / Records placeholder */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground py-8 text-center italic">
                        No recent clinical activity recorded.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
    return <span className={className}>{children}</span>;
}
