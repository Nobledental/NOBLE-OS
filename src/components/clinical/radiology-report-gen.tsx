
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Cpu,
    Scan,
    FileText,
    Printer,
    Share2,
    Zap,
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    Eye,
    ChevronRight,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Finding {
    tooth: string | string[];
    condition: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
    description: string;
}

const MOCK_FINDINGS: Finding[] = [
    { tooth: "46", condition: "Distal Caries", severity: "HIGH", description: "Deep radiolucency observed on the distal surface approaching the pulp chamber." },
    { tooth: ["18", "28", "38", "48"], condition: "Impacted Third Molars", severity: "MEDIUM", description: "All third molars are mesio-angularly impacted. Observation recommended." },
    { tooth: "General", condition: "Horizontal Bone Loss", severity: "MEDIUM", description: "Mild to moderate horizontal bone loss observed in the mandibular anterior region." },
];

export function RadiologyReportGen() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [selectedXray, setSelectedXray] = useState<string | null>("/assets/images/treatments/rct.webp");

    const startAnalysis = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisComplete(true);
        }, 3000);
    };

    return (
        <div className="flex flex-col h-full space-y-10 animate-ios-reveal">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">
                        <Zap className="w-4 h-4" /> AI Radiology Hub
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter leading-none">
                        Computer-Aided <br /> Diagnostic (CAD) Reporting
                    </h2>
                    <p className="text-sm font-medium text-slate-400 max-w-md">
                        Our neural network identifies caries, lesions, and bone-level discrepancies with 94.2% clinical accuracy.
                    </p>
                </div>
                {!analysisComplete && !isAnalyzing && (
                    <Button
                        onClick={startAnalysis}
                        className="relative z-10 h-16 px-10 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-2xl shadow-indigo-600/20"
                    >
                        <Cpu className="w-5 h-5" /> Analyze Active X-Ray
                    </Button>
                )}
                <Zap className="absolute border-indigo-500/10 right-[-40px] bottom-[-40px] w-64 h-64 opacity-5 rotate-12" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Visual Viewport */}
                <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 flex items-center gap-2">
                        <Scan className="w-4 h-4" /> Analysis Viewport
                    </h3>
                    <Card className="aspect-video rounded-[3rem] bg-slate-950 border-none relative overflow-hidden group">
                        {isAnalyzing && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 z-20 shadow-[0_0_20px_rgba(99,102,241,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
                        )}

                        <img
                            src={selectedXray || ""}
                            className={cn(
                                "w-full h-full object-cover opacity-60 grayscale transition-all duration-1000",
                                analysisComplete && "grayscale-0 opacity-80"
                            )}
                        />

                        {/* Analysis Overlays */}
                        {analysisComplete && (
                            <div className="absolute inset-0">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute top-[40%] left-[60%] w-24 h-24 border-2 border-rose-500 rounded-full bg-rose-500/10 backdrop-blur-sm"
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-rose-600 text-[8px] font-black text-white px-2 py-1 rounded-full whitespace-nowrap">
                                        CARIES (46D)
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {!selectedXray && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 space-y-4">
                                <Eye className="w-12 h-12 opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No Image Selected</p>
                            </div>
                        )}
                    </Card>
                    <div className="flex justify-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">FDI Coordinate System Active</p>
                    </div>
                </div>

                {/* Findings & Report */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Diagnostic Findings
                        </h3>
                        {analysisComplete && (
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="rounded-xl h-10 px-4 text-[9px] font-black uppercase tracking-widest gap-2">
                                    <Printer className="w-3.5 h-3.5" /> Print
                                </Button>
                                <Button size="sm" variant="ghost" className="rounded-xl h-10 px-4 text-[9px] font-black uppercase tracking-widest gap-2">
                                    <Share2 className="w-3.5 h-3.5" /> Share
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="wait">
                            {isAnalyzing ? (
                                <motion.div
                                    key="analyzing"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="h-64 flex flex-col items-center justify-center space-y-4 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100"
                                >
                                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                                    <div className="text-center space-y-1">
                                        <p className="text-sm font-black uppercase tracking-widest text-slate-900">Pixel Scanning...</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Running Deep Dental Neural Net v4.2</p>
                                    </div>
                                </motion.div>
                            ) : analysisComplete ? (
                                <div className="space-y-4">
                                    {MOCK_FINDINGS.map((finding, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <Card className="p-6 rounded-[2rem] border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-2xl flex items-center justify-center",
                                                            finding.severity === "HIGH" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                                                        )}>
                                                            <AlertTriangle className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Tooth {Array.isArray(finding.tooth) ? finding.tooth.join(", ") : finding.tooth}</p>
                                                            <h4 className="text-sm font-black text-slate-900">{finding.condition}</h4>
                                                        </div>
                                                    </div>
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                                        finding.severity === "HIGH" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                                                    )}>
                                                        {finding.severity} RISK
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed font-medium">{finding.description}</p>
                                                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end">
                                                    <Button variant="ghost" className="h-8 text-[9px] font-black uppercase tracking-widest gap-1 hover:bg-slate-50 rounded-lg">
                                                        View Anatomy <ChevronRight className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}

                                    <div className="pt-6">
                                        <Card className="p-8 rounded-[2.5rem] bg-emerald-50 border-none flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                                                <ShieldCheck className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tight">Report Verified</h4>
                                                <p className="text-[11px] text-emerald-700 font-medium leading-tight mt-1">
                                                    AI findings cross-referenced with previous scans. <br />
                                                    Confidence score: **98.2%**.
                                                </p>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-96 flex flex-col items-center justify-center space-y-6 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100 text-center p-12">
                                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
                                        <Cpu className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Awaiting Analysis</h4>
                                        <p className="text-xs text-slate-400 font-medium max-w-[200px] mx-auto leading-relaxed">
                                            Select an X-ray from the gallery and click "Analyze" to start pixel diagnostic.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
