'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users,
    MessageSquare,
    Wallet,
    Link2,
    Shield,
    Settings,
    Briefcase
} from 'lucide-react';
import ReferralLinkGenerator from './referral-link-generator';
import ConsultantLedgerPanel from './consultant-ledger';
import ConsultantDiscussion from './consultant-discussion';
import ReferralStatusTracker from './referral-tracker';
import ConsultantAssignment from './consultant-assignment';

interface CollaborationHubProps {
    patientId?: string;
    patientName?: string;
    isAdmin?: boolean;
}

export default function CollaborationHub({
    patientId,
    patientName = 'Select Patient',
    isAdmin = true
}: CollaborationHubProps) {
    const [activeTab, setActiveTab] = useState('referrals');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-blue-500" />
                        Specialist Collaboration Hub
                    </h2>
                    <p className="text-muted-foreground">
                        Secure referrals, consultant tracking, and peer discussions.
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    <TabsTrigger value="referrals" className="rounded-xl py-2 gap-2">
                        <Link2 className="w-4 h-4" />
                        Referral Link
                    </TabsTrigger>
                    <TabsTrigger value="tracking" className="rounded-xl py-2 gap-2">
                        <Users className="w-4 h-4" />
                        Tracker
                    </TabsTrigger>
                    <TabsTrigger value="assignment" className="rounded-xl py-2 gap-2">
                        <Shield className="w-4 h-4" />
                        Assignments
                    </TabsTrigger>
                    <TabsTrigger value="discussion" className="rounded-xl py-2 gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Case Chat
                    </TabsTrigger>
                    <TabsTrigger value="ledger" className="rounded-xl py-2 gap-2">
                        <Wallet className="w-4 h-4" />
                        Financials
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="referrals" className="space-y-4">
                    <ReferralLinkGenerator
                        patientId={patientId || 'temp-id'}
                        patientName={patientName}
                        referringDoctor="Dr. Dhivakaran"
                    />
                </TabsContent>

                <TabsContent value="tracking" className="space-y-4">
                    <ReferralStatusTracker clinicId="noble-indiranagar" />
                </TabsContent>

                <TabsContent value="assignment" className="space-y-4">
                    <ConsultantAssignment
                        patientId={patientId || 'temp-id'}
                        patientName={patientName}
                    />
                </TabsContent>

                <TabsContent value="discussion" className="space-y-4">
                    <ConsultantDiscussion
                        caseAssignmentId="assign-1"
                        currentUserId="chief-1"
                        currentUserRole="chief_dentist"
                        currentUserName="Dr. Dhivakaran"
                    />
                </TabsContent>

                <TabsContent value="ledger" className="space-y-4">
                    <ConsultantLedgerPanel isAdmin={isAdmin} />
                </TabsContent>
            </Tabs>

            {/* Compliance Footer */}
            <div className="flex items-center justify-center gap-4 py-4 text-xs text-muted-foreground border-t">
                <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-500" />
                    DPDPA 2023 Compliant
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-1">
                    <Settings className="w-3 h-3 text-blue-500" />
                    256-bit AES Encryption
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-purple-500" />
                    Peer-Reviewed Summaries
                </div>
            </div>
        </div>
    );
}
