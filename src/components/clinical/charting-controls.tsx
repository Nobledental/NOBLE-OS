"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Stethoscope,
    Save,
    Clock,
    Zap,
    Box
} from "lucide-react";
import { toast } from "sonner";

export function ChartingControls({ patientId }: { patientId: string }) {
    const handleSave = () => {
        toast.success("Clinical record saved successfully");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b">
                <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
                    <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold">Procedure Deck</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Zone A-1 Deployment</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-400">Treatment Plan</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="text-xs h-16 flex flex-col gap-1 border-dashed">
                            <Box className="w-4 h-4 text-indigo-500" />
                            RCT
                        </Button>
                        <Button variant="outline" className="text-xs h-16 flex flex-col gap-1 border-dashed">
                            <Zap className="w-4 h-4 text-amber-500" />
                            Filling
                        </Button>
                        <Button variant="outline" className="text-xs h-16 flex flex-col gap-1 border-dashed">
                            <Clock className="w-4 h-4 text-emerald-500" />
                            Scaling
                        </Button>
                        <Button variant="outline" className="text-xs h-16 flex flex-col gap-1 border-dashed">
                            <Stethoscope className="w-4 h-4 text-rose-500" />
                            Extraction
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-400">Clinical Observations</Label>
                    <Textarea
                        placeholder="Type observation or use voice commands..."
                        className="min-h-[120px] rounded-xl resize-none bg-slate-50 dark:bg-slate-900 border-none focus-visible:ring-indigo-500"
                    />
                </div>

                <div className="pt-4 flex flex-col gap-2">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Finalize Record
                    </Button>
                    <Button variant="ghost" className="text-xs text-muted-foreground">
                        Draft saved at 14:02
                    </Button>
                </div>
            </div>
        </div>
    );
}
