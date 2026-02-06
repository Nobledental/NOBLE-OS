"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scan, Upload, FileText, CheckCircle2, RotateCw, Trash2, Camera, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Mock Data for "Detected" values
const MOCK_EXTRACTED_DATA = {
    testNames: ["Haemoglobin", "Total WBC", "Neutrophils", "Platelet Count"],
    values: ["13.2 g/dL", "7,500 /c.mm", "65 %", "2.5 Lakhs"],
    normalRanges: ["13-17", "4000-11000", "40-70", "1.5-4.5"]
};

export function SmartScanner({ patientId }: { patientId: string }) {
    const [image, setImage] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [dataFound, setDataFound] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("upload");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
                setDataFound([]); // Reset any previous data
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerScan = () => {
        if (!image) return;

        setIsScanning(true);
        // Simulate OCR Delay
        setTimeout(() => {
            setIsScanning(false);

            // "Detect" data
            const extracted = MOCK_EXTRACTED_DATA.testNames.map((name, i) => ({
                id: i,
                test: name,
                value: MOCK_EXTRACTED_DATA.values[i],
                range: MOCK_EXTRACTED_DATA.normalRanges[i],
                confidence: Math.floor(Math.random() * (99 - 85) + 85) // Random confidence > 85%
            }));

            setDataFound(extracted);
            setActiveTab("results");
            toast.success("AI Analysis Complete: 4 Critical Values Found");
        }, 2000);
    };

    const handleSave = () => {
        toast.success("Vitals added to Patient Record successfully.");
        setImage(null);
        setDataFound([]);
        setActiveTab("upload");
    };

    return (
        <Card className="h-full border-none shadow-none flex flex-col">
            <CardHeader className="px-0 pt-0 pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-emerald-700">
                    <Scan className="w-5 h-5" /> Smart Report Scanner
                </CardTitle>
                <CardDescription>
                    Upload or snap a picture of lab reports. Our AI will digitize the values.
                </CardDescription>
            </CardHeader>

            <CardContent className="px-5 py-4 flex-1 flex flex-col md:flex-row gap-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">

                {/* Left: Image Preview & Actions */}
                <div className="flex-1 flex flex-col relative">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="upload" disabled={dataFound.length > 0}>Capture / Upload</TabsTrigger>
                            <TabsTrigger value="results" disabled={dataFound.length === 0}>Extracted Data</TabsTrigger>
                        </TabsList>

                        <TabsContent value="upload" className="flex-1 flex flex-col">
                            <div
                                className={`
                                    relative flex-1 bg-white border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-all
                                    ${image ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-300 hover:border-slate-400'}
                                `}
                            >
                                {image ? (
                                    <>
                                        {/* Scanner Line Animation */}
                                        {isScanning && (
                                            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10 animate-[scan_2s_ease-in-out_infinite]" />
                                        )}

                                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg group">
                                            <img src={image} alt="Report Preview" className="max-h-[300px] object-contain opacity-90 transition-opacity" />
                                            {/* Overlay Actions */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <Button variant="secondary" size="icon" onClick={() => setImage(null)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                                            <Upload className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">Drag & Drop or Click to Upload</p>
                                            <p className="text-sm text-muted-foreground mt-1">Supports PDF, JPG, PNG</p>
                                        </div>
                                        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                            Select File
                                        </Button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                )}
                            </div>

                            {image && !isScanning && dataFound.length === 0 && (
                                <Button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={triggerScan}>
                                    <Scan className="w-4 h-4 mr-2" />
                                    Start Analysis
                                </Button>
                            )}

                            {isScanning && (
                                <Button disabled className="mt-4 w-full bg-emerald-600/80 text-white">
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyzing Document...
                                </Button>
                            )}
                        </TabsContent>

                        <TabsContent value="results" className="flex-1 flex flex-col">
                            <ScrollArea className="flex-1 h-[250px] border rounded-md bg-white p-4">
                                <div className="space-y-4">
                                    {dataFound.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                            <div>
                                                <div className="font-bold text-sm text-slate-800">{item.test}</div>
                                                <div className="text-xs text-muted-foreground">Range: {item.range}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono font-bold text-emerald-700">{item.value}</div>
                                                <Badge variant="outline" className="text-[10px] h-5 border-emerald-200 text-emerald-600 bg-emerald-50">
                                                    {item.confidence}% Match
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <Button variant="outline" onClick={() => setActiveTab("upload")}>
                                    Discard
                                </Button>
                                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSave}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Confirm & Save
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </CardContent>
            <style jsx global>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </Card>
    );
}
