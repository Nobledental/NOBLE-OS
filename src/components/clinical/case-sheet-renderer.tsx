'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Stethoscope,
    Syringe,
    Scissors,
    Smile,
    Shield,
    FileText
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

// Department-specific sub-forms
import AIProvisionalDiagnosis from './ai-diagnosis';
import WARAssessmentModule from './war-assessment';
import RCTTrackingModule from './rct-tracking';
import CephalometricModule from './cephalometric';
import { ClinicalNoteEditor } from './clinical-note-editor';
import { AdultToothChart } from './tooth-chart';
import { ToothState } from '@/types/clinical';
import PrescriptionEngine from './prescription-engine';
import { ClinicalNoteState } from './clinical-note-editor';
import { AdvancedIntake, AdvancedIntakeState } from './advanced-intake';
import { PeriodontalExam, PeriodontalState } from './periodontal-exam';
import { TreatmentEstimator } from './treatment-estimator';
import { SurgicalSafetyChecklist } from './surgical-checklist';
import { DentalGrowthHub } from './dental-growth-hub';
import { SuccessCardGenerator } from './success-card-generator';
import { IDACaseSheet } from './ida-case-sheet';
import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog";
import { smartStockService } from '@/lib/smart-stock';
import { toast } from 'sonner';

type Department = 'ORAL_MEDICINE' | 'ORAL_SURGERY' | 'ENDODONTICS' | 'ORTHODONTICS' | 'GENERAL';

interface CaseSheetRendererProps {
    patientId: string;
    userPermissions?: {
        can_access_oral_medicine?: boolean;
        can_access_oral_surgery?: boolean;
        can_access_endodontics?: boolean;
        can_access_orthodontics?: boolean;
    };
}

const departmentConfig = {
    GENERAL: {
        name: 'General Examination',
        icon: Shield,
        color: 'text-gray-500',
        description: 'Basic clinical examination'
    },
    ORAL_MEDICINE: {
        name: 'Oral Medicine',
        icon: Stethoscope,
        color: 'text-purple-500',
        description: 'AI Diagnosis & Medical Management'
    },
    ORAL_SURGERY: {
        name: 'Oral Surgery',
        icon: Scissors,
        color: 'text-orange-500',
        description: 'Surgical Planning & WAR Assessment'
    },
    ENDODONTICS: {
        name: 'Endodontics',
        icon: Syringe,
        color: 'text-blue-500',
        description: 'RCT Tracking & Cavity Classification'
    },
    ORTHODONTICS: {
        name: 'Orthodontics',
        icon: Smile,
        color: 'text-pink-500',
        description: 'Cephalometric Analysis & Profile Evaluation'
    }
};

export default function CaseSheetRenderer({
    patientId,
    userPermissions = {}
}: CaseSheetRendererProps) {
    const [selectedDepartment, setSelectedDepartment] = useState<Department>('GENERAL');
    const [toothData, setToothData] = useState<Record<string, ToothState>>({});
    const [clinicalNotes, setClinicalNotes] = useState({
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
        advice: ""
    });
    const [intakeData, setIntakeData] = useState<AdvancedIntakeState>({
        isPregnant: false,
        isNursing: false,
        isOnBirthControl: false,
        hasBleedingDisorder: false,
        hasEasyBruising: false,
        isOnBloodThinners: false,
        isDiabetic: false,
        usesTobacco: false,
        usesAlcohol: false,
    });
    const [periodontalData, setPeriodontalData] = useState<PeriodontalState>({
        pocketDepths: {},
        bleedingNodes: [],
        calculusLevel: 'NONE',
        gingivalTone: 'PINK',
        mobility: {},
    });
    const [showSafetyCheck, setShowSafetyCheck] = useState(false);
    const [showSuccessCard, setShowSuccessCard] = useState(false);
    const [pendingArchiveNotes, setPendingArchiveNotes] = useState<ClinicalNoteState | null>(null);

    // Filter departments based on permissions
    const availableDepartments = Object.entries(departmentConfig).filter(([key]) => {
        if (key === 'GENERAL') return true;
        if (key === 'ORAL_MEDICINE') return userPermissions.can_access_oral_medicine !== false;
        if (key === 'ORAL_SURGERY') return userPermissions.can_access_oral_surgery !== false;
        if (key === 'ENDODONTICS') return userPermissions.can_access_endodontics !== false;
        if (key === 'ORTHODONTICS') return userPermissions.can_access_orthodontics !== false;
        return false;
    });

    const handleArchiveSession = (notes: ClinicalNoteState) => {
        const highRiskProcedures = ['EXTRACTION', 'IMPLANT', 'SURGERY'];
        const isHighRisk = highRiskProcedures.some(p => notes.plan.toUpperCase().includes(p));

        if (isHighRisk && !showSafetyCheck) {
            setPendingArchiveNotes(notes);
            setShowSafetyCheck(true);
            return;
        }

        const procedures = ['EXTRACTION', 'RCT', 'FILLING', 'SCALING', 'CROWN', 'IMPLANT'];
        let itemsUsed = 0;

        procedures.forEach(proc => {
            if (notes.plan.toUpperCase().includes(proc) || notes.assessment.toUpperCase().includes(proc)) {
                const result = smartStockService.decrementStockForTreatment(
                    proc,
                    `SESS-${patientId}-${Date.now()}`,
                    'Dr. Dhivakaran',
                    'demo-clinic'
                );
                itemsUsed += result.movements.length;
            }
        });

        if (itemsUsed > 0) {
            toast.success(`Inventory Updated: ${itemsUsed} items accounted for this session.`);
        }

        toast.success("Clinical record archived and verified.");
        setShowSafetyCheck(false);
        setShowSuccessCard(true); // Trigger success card
    };

    // Strategy Pattern: Dynamic form rendering based on department
    const renderDepartmentForm = () => {
        switch (selectedDepartment) {
            case 'ORAL_MEDICINE':
                return <AIProvisionalDiagnosis />;
            case 'ORAL_SURGERY':
                return <WARAssessmentModule />;
            case 'ENDODONTICS':
                return <RCTTrackingModule patientId={patientId} />;
            case 'ORTHODONTICS':
                return <CephalometricModule patientId={patientId} />;
            case 'GENERAL':
            default:
                return (
                    <div className="space-y-12 animate-ios-reveal">
                        <Tabs defaultValue="ida" className="w-full">
                            <div className="flex items-center justify-between mb-8">
                                <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl h-12">
                                    <TabsTrigger value="ida" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">IDA Case Sheet</TabsTrigger>
                                    <TabsTrigger value="exam" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Exam & Notes</TabsTrigger>
                                    <TabsTrigger value="intake" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Intake & Risks</TabsTrigger>
                                    <TabsTrigger value="growth" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Logistics & Growth</TabsTrigger>
                                    <TabsTrigger value="rx" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Prescription (Rx)</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="ida" className="mt-0 outline-none animate-ios-reveal">
                                <IDACaseSheet />
                            </TabsContent>

                            <TabsContent value="exam" className="mt-0 outline-none">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <Card className="p-8 bg-slate-50/50 border-slate-100 rounded-[3.5rem] overflow-hidden shadow-inner">
                                        <Tabs defaultValue="teeth" className="w-full">
                                            <div className="flex items-center justify-between mb-8">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" /> Diagnostic Charts
                                                </h4>
                                                <TabsList className="bg-white/50 p-1 rounded-xl h-10">
                                                    <TabsTrigger value="teeth" className="rounded-lg px-4 font-black text-[9px] uppercase tracking-widest h-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">Teeth (FDI)</TabsTrigger>
                                                    <TabsTrigger value="perio" className="rounded-lg px-4 font-black text-[9px] uppercase tracking-widest h-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">Gum (Perio)</TabsTrigger>
                                                </TabsList>
                                            </div>

                                            <TabsContent value="teeth" className="mt-0 outline-none">
                                                <AdultToothChart
                                                    data={toothData}
                                                    onChange={setToothData}
                                                />
                                            </TabsContent>

                                            <TabsContent value="perio" className="mt-0 outline-none">
                                                <PeriodontalExam
                                                    data={periodontalData}
                                                    onChange={setPeriodontalData}
                                                />
                                            </TabsContent>
                                        </Tabs>
                                    </Card>
                                    <ClinicalNoteEditor
                                        patientId={patientId}
                                        initialNotes={clinicalNotes}
                                        onNotesChange={setClinicalNotes}
                                        onArchive={handleArchiveSession}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="intake" className="mt-0 outline-none">
                                <div className="max-w-5xl mx-auto py-10">
                                    <AdvancedIntake
                                        data={intakeData}
                                        onChange={setIntakeData}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="growth" className="mt-0 outline-none">
                                <div className="max-w-5xl mx-auto py-10 scale-[0.9] origin-top">
                                    <DentalGrowthHub />
                                </div>
                            </TabsContent>

                            <TabsContent value="rx" className="mt-0 outline-none">
                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                                    <div className="xl:col-span-8">
                                        <PrescriptionEngine
                                            patientId={patientId}
                                            toothData={toothData}
                                            clinicalNotes={clinicalNotes}
                                        />
                                    </div>
                                    <div className="xl:col-span-4">
                                        <TreatmentEstimator
                                            toothData={toothData}
                                            clinicalNotes={clinicalNotes}
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-8 animate-ios-reveal">
            <GlassCard className="p-2 glass" intensity="low">
                <Tabs value={selectedDepartment} onValueChange={(v) => setSelectedDepartment(v as Department)}>
                    <TabsList className="grid w-full h-14 bg-transparent" style={{ gridTemplateColumns: `repeat(${availableDepartments.length}, 1fr)` }}>
                        {availableDepartments.map(([key, config]) => {
                            const Icon = config.icon;
                            return (
                                <TabsTrigger
                                    key={key}
                                    value={key}
                                    className={cn(
                                        "flex items-center gap-2 rounded-xl transition-all duration-300",
                                        "data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:text-white"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", config.color)} />
                                    <span className="hidden md:inline font-bold text-xs uppercase tracking-widest">{config.name}</span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </Tabs>
            </GlassCard>

            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">{departmentConfig[selectedDepartment].name}</h3>
                        <p className="text-sm text-muted-foreground">{departmentConfig[selectedDepartment].description}</p>
                    </div>
                </div>
                <Badge variant="outline" className="rounded-full px-4 py-1 glass text-[10px] font-bold uppercase tracking-widest border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
                    Clinical Ref: {selectedDepartment.replace('_', ' ')}
                </Badge>
            </div>

            <div className="bg-white dark:bg-slate-950/20 rounded-[32px] p-8 shadow-inner border border-slate-100 dark:border-slate-800 min-h-[400px]">
                {renderDepartmentForm()}
            </div>

            <SurgicalSafetyChecklist
                isOpen={showSafetyCheck}
                onClose={() => setShowSafetyCheck(false)}
                onApproval={() => pendingArchiveNotes && handleArchiveSession(pendingArchiveNotes)}
                procedureName={pendingArchiveNotes?.plan.split('\n')[0] || "Planned Surgery"}
                hasRiskFactors={intakeData.hasBleedingDisorder || intakeData.isPregnant}
            />

            <Dialog open={showSuccessCard} onOpenChange={setShowSuccessCard}>
                <DialogContent className="sm:max-w-[480px] rounded-[3rem] p-8 overflow-hidden border-none shadow-2xl">
                    <SuccessCardGenerator
                        patientName="Demo Patient"
                        procedure={pendingArchiveNotes?.plan.split('\n')[0] || "Dental Treatment"}
                        doctorName="Dr. Dhivakaran"
                        clinicName="Noble Dental Care"
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
