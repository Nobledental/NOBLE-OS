"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Syringe, Activity, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function SurgeryNote({ patientId }: { patientId: string }) {
    const [surgeryData, setSurgeryData] = useState({
        procedureName: "",
        anesthesiaType: "La (Lignocaine)",
        anesthesiaAmount: "2ml",
        preOpVitals: "",
        intraOpNotes: "",
        postOpInstructions: ""
    });

    const handleSave = () => {
        console.log("Saving Surgery Note:", { patientId, ...surgeryData });
        toast.success("Surgery/OT notes recorded.");
    };

    return (
        <Card className="h-full border-none shadow-none">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2 text-lg text-rose-600">
                    <Activity className="w-5 h-5" />
                    Surgery & OT Notes
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">

                {/* 1. Anesthesia Details */}
                <div className="bg-rose-50 p-4 rounded-lg space-y-4 border border-rose-100">
                    <h4 className="flex items-center gap-2 font-bold text-sm text-rose-700">
                        <Syringe className="w-4 h-4" /> Anesthesia Record
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs">Type</Label>
                            <Select
                                value={surgeryData.anesthesiaType}
                                onValueChange={(v) => setSurgeryData({ ...surgeryData, anesthesiaType: v })}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="La (Lignocaine)">LA (Lignocaine 2%)</SelectItem>
                                    <SelectItem value="La (Articaine)">LA (Articaine 4%)</SelectItem>
                                    <SelectItem value="GA">General Anesthesia</SelectItem>
                                    <SelectItem value="Sedation">IV Sedation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Amount</Label>
                            <Input
                                className="bg-white"
                                value={surgeryData.anesthesiaAmount}
                                onChange={(e) => setSurgeryData({ ...surgeryData, anesthesiaAmount: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Procedure Details</Label>
                    <Input
                        placeholder="Specific procedure name (e.g. Surgical Extraction 38)"
                        value={surgeryData.procedureName}
                        onChange={(e) => setSurgeryData({ ...surgeryData, procedureName: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Intra-Op Notes</Label>
                    <Textarea
                        placeholder="Incision details, bone removal, sutures placed..."
                        className="min-h-[100px]"
                        value={surgeryData.intraOpNotes}
                        onChange={(e) => setSurgeryData({ ...surgeryData, intraOpNotes: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Post-Op Check</Label>
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-md text-amber-700 text-xs">
                        <AlertCircle className="w-4 h-4" />
                        <span>Confirm Hemostasis achieved before discharge.</span>
                    </div>
                    <Textarea
                        placeholder="Instructions given to patient..."
                        className="min-h-[60px]"
                        value={surgeryData.postOpInstructions}
                        onChange={(e) => setSurgeryData({ ...surgeryData, postOpInstructions: e.target.value })}
                    />
                </div>

                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Finalize Procedure Record
                </Button>
            </CardContent>
        </Card>
    );
}
