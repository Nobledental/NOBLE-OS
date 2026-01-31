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
    Shield
} from 'lucide-react';

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
        <div className="space-y-4">
            <Card className="p-4">
                <Tabs value={selectedDepartment} onValueChange={(v) => setSelectedDepartment(v as Department)}>
                    <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availableDepartments.length}, 1fr)` }}>
                        {availableDepartments.map(([key, config]) => {
                            const Icon = config.icon;
                            return (
                                <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                                    <Icon className={`w-4 h-4 ${config.color}`} />
                                    <span className="hidden md:inline">{config.name}</span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </Tabs>

                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">{departmentConfig[selectedDepartment].name}</h3>
                        <p className="text-sm text-muted-foreground">{departmentConfig[selectedDepartment].description}</p>
                    </div>
                    <Badge variant="outline">{selectedDepartment.replace('_', ' ')}</Badge>
                </div>
            </Card>

            {renderDepartmentForm()}
        </div>
    );
}
