'use client';

import CollaborationHub from '@/components/collaboration/collaboration-hub';
import { PermissionGuard } from '@/components/security/permission-guard';
import { Lock } from 'lucide-react';

export default function SpecialistsPage() {
    return (
        <div className="flex-1 space-y-6">
            <PermissionGuard
                permission="can_manage_staff"
                fallback={
                    <div className="h-[calc(100vh-20rem)] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center space-y-4 bg-slate-50 dark:bg-slate-900/50">
                        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold">Managerial Access Required</h3>
                        <p className="text-muted-foreground text-center max-w-xs">
                            Specialist assignments and financial ledgers are restricted to Clinic Managers and Chief Dentists.
                        </p>
                    </div>
                }
            >
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <CollaborationHub isAdmin={true} />
                </div>
            </PermissionGuard>
        </div>
    );
}
