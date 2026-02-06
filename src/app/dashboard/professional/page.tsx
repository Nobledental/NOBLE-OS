"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfessionalEvolutionPortal from "@/components/profile/professional-evolution-portal";
import MentorCommandCenter from "@/components/academic/mentor-command-center";
import NEETAcceleratorHub from "@/components/academic/neet-accelerator-hub";
import RecruitmentCommandCenter from "@/components/admin/recruitment-command-center";
import { User, Briefcase, GraduationCap, Users } from "lucide-react";

export default function ProfessionalPage() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 bg-[#F8FAFC] dark:bg-[#020617] min-h-screen">
            <Tabs defaultValue="portal" className="w-full">
                <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
                    <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl flex-nowrap shrink-0">
                        <TabsTrigger value="portal" className="rounded-xl gap-2 px-6">
                            <User size={14} />
                            Evolution Portal
                        </TabsTrigger>
                        <TabsTrigger value="recruitment" className="rounded-xl gap-2 px-6">
                            <Briefcase size={14} />
                            Recruitment
                        </TabsTrigger>
                        <TabsTrigger value="mentorship" className="rounded-xl gap-2 px-6">
                            <Users size={14} />
                            Mentorship
                        </TabsTrigger>
                        <TabsTrigger value="academic" className="rounded-xl gap-2 px-6">
                            <GraduationCap size={14} />
                            Academic Prep
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="portal" className="mt-0 outline-none">
                    <ProfessionalEvolutionPortal />
                </TabsContent>

                <TabsContent value="recruitment" className="mt-0 outline-none">
                    <RecruitmentCommandCenter />
                </TabsContent>

                <TabsContent value="mentorship" className="mt-0 outline-none">
                    <MentorCommandCenter />
                </TabsContent>

                <TabsContent value="academic" className="mt-0 outline-none">
                    <NEETAcceleratorHub />
                </TabsContent>
            </Tabs>
        </div>
    );
}
