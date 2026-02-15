"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Phone, Mail, MapPin, Activity, TrendingUp, LayoutGrid, ClipboardCheck, Stethoscope } from "lucide-react";
import { useCockpitStore, type PatientContext } from "@/lib/clinical-cockpit-store";
import { useRouter } from "next/navigation";
import { VitalsChart } from "@/components/clinical/vitals-chart";
import { ClinicalTimeline } from "@/components/clinical/timeline";
import { ClinicalConsultation } from "@/components/clinical/consultation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VitalsHUD } from "@/components/clinical/vitals-hud";
import { PreOpChecklist } from "@/components/clinical/pre-op-checklist";
import { UniversalToothChart } from "@/components/clinical/universal-tooth-chart";

export default function PatientDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const selectCockpitPatient = useCockpitStore(s => s.selectPatient);

    const { data: patient, isLoading: isPatientLoading } = useQuery({
        queryKey: ['patient', id],
        queryFn: async () => {
            const res = await api.get(`/patients/${id}`);
            return res.data;
        }
    });

    const { data: records, isLoading: isRecordsLoading } = useQuery({
        queryKey: ['clinicalRecords', id],
        queryFn: async () => {
            const res = await api.get(`/clinical/patient/${id}`);
            return res.data;
        }
    });

    const isLoading = isPatientLoading || isRecordsLoading;

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

    // Prepare vitals data for chart
    const vitalsData = records
        ?.filter((r: any) => r.visit_vitals)
        .map((r: any) => ({
            date: new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            bp: parseInt(r.visit_vitals.bp?.split('/')[0] || "0"),
            pulse: parseInt(r.visit_vitals.hr || "0")
        }))
        .reverse() || [];

    // Determine Dentition Mode based on Age
    const chartMode = (patient.age < 6) ? "CHILD" : (patient.age < 13) ? "MIXED" : "ADULT";

    return (
        <div className="flex flex-col h-full bg-slate-50/30">
            {/* Phase 6: Chair-Side HUD */}
            <VitalsHUD data={{
                bp: `${vitalsData[0]?.bp || 120}/${80}`, // Mock Diastolic as we only store Systolic in simple chart for now
                hr: vitalsData[0]?.pulse || 72
            }} />

            <div className="p-8 space-y-6">
                {/* Hero Section */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-6">
                        <Avatar className="h-20 w-20 ring-4 ring-indigo-50">
                            <AvatarFallback className="text-2xl font-bold bg-indigo-600 text-white">
                                {patient.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{patient.name}</h1>
                            <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="secondary" className="font-mono bg-slate-100 text-slate-600">{patient.healthflo_id}</Badge>
                                <span className="text-slate-500 text-sm flex items-center font-medium">
                                    <Activity className="w-3 h-3 mr-1" />
                                    {patient.gender}, {patient.age} yrs
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" className="border-slate-200 text-slate-700 h-12 rounded-xl">Schedule Visit</Button>
                        <Button
                            className="bg-clinical-action hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 h-12 rounded-xl gap-2 font-bold"
                            onClick={() => {
                                const ctx: PatientContext = {
                                    id: patient.id || (id as string),
                                    name: patient.name,
                                    age: patient.age || 30,
                                    gender: (patient.gender as 'MALE' | 'FEMALE' | 'OTHER') || 'MALE',
                                    phone: patient.pii?.primary_contact || patient.user?.phone || '',
                                    bloodGroup: patient.blood_group,
                                    isRegistered: true,
                                };
                                selectCockpitPatient(ctx);
                                router.push('/dashboard/clinical');
                            }}
                        >
                            <Stethoscope className="w-4 h-4" /> Open Cockpit
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Column 1: Info & Baseline */}
                    <div className="space-y-6">
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold flex items-center text-slate-900">
                                    <Phone className="w-4 h-4 mr-2 text-indigo-500" />
                                    Contact Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center text-sm group cursor-pointer text-slate-600 hover:text-indigo-600 transition-colors">
                                    <Phone className="w-3.5 h-3.5 mr-3 text-slate-400 group-hover:text-indigo-500" />
                                    {patient.pii?.primary_contact || patient.user?.phone}
                                </div>
                                <div className="flex items-center text-sm group cursor-pointer text-slate-600 hover:text-indigo-600 transition-colors">
                                    <Mail className="w-3.5 h-3.5 mr-3 text-slate-400 group-hover:text-indigo-500" />
                                    {patient.pii?.email || patient.user?.email || "No email"}
                                </div>
                                <div className="flex items-center text-sm group cursor-pointer text-slate-600 hover:text-indigo-600 transition-colors">
                                    <MapPin className="w-3.5 h-3.5 mr-3 text-slate-400 group-hover:text-indigo-500" />
                                    <span className="line-clamp-2">{patient.pii?.full_address || "No address provided"}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold flex items-center text-slate-900">
                                    <Activity className="w-4 h-4 mr-2 text-rose-500" />
                                    Medical Baseline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Blood Group</p>
                                        <p className="font-bold text-red-600">{patient.blood_group || "O+"}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Latest BMI</p>
                                        <p className="font-bold text-slate-900">{patient.anthropometry?.bmi || "22.4"}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Chronic Conditions</p>
                                    <div className="flex flex-wrap gap-1">
                                        {patient.medical_history?.list?.map((h: any, i: number) => (
                                            <Badge key={i} variant="outline" className="text-[10px] border-slate-200 text-slate-600">{h.condition}</Badge>
                                        )) || <span className="text-xs text-slate-400">None recorded</span>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Column 2 & 3: Clinical Workspace */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="consultation" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-4 bg-slate-100/50 p-1 rounded-xl">
                                <TabsTrigger value="consultation" className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                                    <ClipboardCheck className="w-3.5 h-3.5 mr-2" />
                                    Consultation
                                </TabsTrigger>
                                <TabsTrigger value="charts" className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                                    <LayoutGrid className="w-3.5 h-3.5 mr-2" />
                                    Dental Chart
                                </TabsTrigger>
                                <TabsTrigger value="vitals" className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                                    <TrendingUp className="w-3.5 h-3.5 mr-2" />
                                    Vitals History
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="consultation">
                                <Card className="border-slate-100 shadow-sm">
                                    <CardContent className="pt-6">
                                        <ClinicalConsultation patientId={id as string} />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="charts">
                                <UniversalToothChart mode={chartMode as any} />
                            </TabsContent>

                            <TabsContent value="vitals">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-semibold flex items-center">
                                            <TrendingUp className="w-4 h-4 mr-2" />
                                            Vitals Trend (Systolic BP vs Pulse)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <VitalsChart data={vitalsData} />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold">Visit History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ClinicalTimeline records={records} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
