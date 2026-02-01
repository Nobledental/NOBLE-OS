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

    // Filter departments based on permissions
    const availableDepartments = Object.entries(departmentConfig).filter(([key]) => {
        if (key === 'GENERAL') return true;
        if (key === 'ORAL_MEDICINE') return userPermissions.can_access_oral_medicine !== false;
        if (key === 'ORAL_SURGERY') return userPermissions.can_access_oral_surgery !== false;
        if (key === 'ENDODONTICS') return userPermissions.can_access_endodontics !== false;
        if (key === 'ORTHODONTICS') return userPermissions.can_access_orthodontics !== false;
        return false;
    });

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
                    <Card className="p-6">
                        <div className="text-center text-muted-foreground py-8">
                            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>General examination fields will appear here</p>
                            <p className="text-sm mt-2">Chief Complaint, Clinical Findings, Diagnosis</p>
                        </div>
                    </Card>
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
        </div>
    );
}
