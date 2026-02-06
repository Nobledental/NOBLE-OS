"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LabOrderHub } from "@/components/clinical/lab-order-hub";
import DMETemplateEngine from "@/components/clinical/dme-template-engine";
import { FlaskConical, ClipboardList } from "lucide-react";

export default function LabPage() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8">
            <Tabs defaultValue="tracking" className="w-full">
                <div className="flex items-center justify-between mb-8">
                    <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl">
                        <TabsTrigger value="tracking" className="rounded-xl gap-2 px-6">
                            <FlaskConical size={14} />
                            Order Tracking
                        </TabsTrigger>
                        <TabsTrigger value="formulation" className="rounded-xl gap-2 px-6">
                            <ClipboardList size={14} />
                            DME Formulation
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="tracking" className="mt-0 outline-none">
                    <LabOrderHub />
                </TabsContent>

                <TabsContent value="formulation" className="mt-0 outline-none">
                    <DMETemplateEngine />
                </TabsContent>
            </Tabs>
        </div>
    );
}
