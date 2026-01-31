'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';

interface ModuleLockWrapperProps {
    children: ReactNode;
    moduleName: string;
    moduleKey: 'SMART_MEDICINE' | 'SMART_SURGERY' | 'SMART_ENDODONTICS' | 'SMART_ORTHODONTICS';
    clinicActiveModules?: string[];
}

export default function ModuleLockWrapper({
    children,
    moduleName,
    moduleKey,
    clinicActiveModules = []
}: ModuleLockWrapperProps) {
    const isModuleActive = clinicActiveModules.includes(moduleKey);

    if (isModuleActive) {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            {/* Blurred content */}
            <div className="filter blur-sm pointer-events-none opacity-50">
                {children}
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <Card className="p-8 max-w-md text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
                            <Crown className="w-5 h-5 text-yellow-500" />
                            Premium Module Locked
                        </h3>
                        <p className="text-muted-foreground">
                            <span className="font-semibold text-foreground">{moduleName}</span> is a premium feature that enhances your clinical workflow with AI-powered insights.
                        </p>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
                        <div className="font-medium">What you'll get:</div>
                        <ul className="text-left list-disc list-inside text-muted-foreground">
                            {moduleKey === 'SMART_SURGERY' && (
                                <>
                                    <li>WAR Difficulty Calculator</li>
                                    <li>Automatic surgical complexity scoring</li>
                                    <li>Dynamic pricing recommendations</li>
                                </>
                            )}
                            {moduleKey === 'SMART_MEDICINE' && (
                                <>
                                    <li>AI Provisional Diagnosis Engine</li>
                                    <li>ICD-10 code automation</li>
                                    <li>Symptom-to-diagnosis mapping</li>
                                </>
                            )}
                            {moduleKey === 'SMART_ENDODONTICS' && (
                                <>
                                    <li>RCT tracking & measurement logs</li>
                                    <li>Cavity classification automation</li>
                                    <li>Protocol checklists</li>
                                </>
                            )}
                            {moduleKey === 'SMART_ORTHODONTICS' && (
                                <>
                                    <li>Cephalometric analysis</li>
                                    <li>Profile type classification</li>
                                    <li>Skeletal pattern assessment</li>
                                </>
                            )}
                        </ul>
                    </div>

                    <Button className="w-full" size="lg">
                        <Crown className="w-4 h-4 mr-2" />
                        Subscribe to Unlock
                    </Button>

                    <p className="text-xs text-muted-foreground">
                        Contact your administrator or visit the subscription page to activate this module.
                    </p>
                </Card>
            </div>
        </div>
    );
}
