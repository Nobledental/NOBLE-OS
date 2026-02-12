"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Scan, CheckCircle2, FileText, X, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface SmartScannerProps {
    onScanComplete?: (data: any) => void;
    className?: string;
}

export function SmartScanner({ onScanComplete, className }: SmartScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const [scanStage, setScanStage] = useState<'idle' | 'camera' | 'processing' | 'result'>('idle');
    const [scannedData, setScannedData] = useState<any>(null);

    // Mock extraction
    const processImage = () => {
        setScanStage('processing');
        setTimeout(() => {
            const mockData = {
                doctorName: "Dr. Sarah Miller",
                date: new Date().toLocaleDateString(),
                medications: ["Amoxicillin 500mg", "Ibuprofen 400mg"],
                diagnosis: "Acute Pulpitis"
            };
            setScannedData(mockData);
            setScanStage('result');
            toast.success("Prescription Digitized Successfully!");
            if (onScanComplete) onScanComplete(mockData);
        }, 2500); // 2.5s simulation
    };

    return (
        <div className={cn("w-full max-w-md mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10", className)}>

            {/* Header */}
            <div className="p-4 bg-zinc-900 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <Scan size={16} className="text-indigo-400" />
                    </div>
                    <span className="font-semibold text-white">Smart Scan</span>
                </div>
                {scanStage !== 'idle' && (
                    <button
                        onClick={() => setScanStage('idle')}
                        className="text-white/50 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="relative aspect-[3/4] bg-zinc-950">

                {/* IDLE STATE */}
                {scanStage === 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-6">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
                            <FileText size={32} className="text-white/50" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Digitize Records</h3>
                            <p className="text-sm text-white/50 mt-2">
                                Scan prescriptions, lab reports, or invoices to add them to your health timeline.
                            </p>
                        </div>
                        <Button
                            onClick={() => setScanStage('camera')}
                            className="w-full bg-white text-black hover:bg-zinc-200 font-bold rounded-xl h-12"
                        >
                            <Camera className="mr-2 h-4 w-4" /> Start Camera
                        </Button>
                    </div>
                )}

                {/* CAMERA STATE */}
                {scanStage === 'camera' && (
                    <div className="absolute inset-0 bg-black relative">
                        {/* Mock Camera View */}
                        <img
                            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop"
                            className="w-full h-full object-cover opacity-80"
                            alt="Camera View"
                        />

                        {/* Scanning Grid Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none" />

                        {/* Scanning Bar Animation */}
                        <motion.div
                            className="absolute top-0 left-0 right-0 h-1 bg-green-500 shadow-[0_0_20px_rgba(0,255,0,0.5)] z-10"
                            animate={{ top: ["10%", "90%", "10%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Capture Button */}
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                            <button
                                onClick={processImage}
                                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all"
                            >
                                <div className="w-12 h-12 bg-white rounded-full" />
                            </button>
                        </div>
                    </div>
                )}

                {/* PROCESSING STATE */}
                {scanStage === 'processing' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-20 space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Scan size={20} className="text-indigo-400 animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h4 className="text-white font-medium">Analyzing Document...</h4>
                            <p className="text-xs text-white/50 mt-1">Extracting Doctor Name & Meds</p>
                        </div>
                    </div>
                )}

                {/* RESULT STATE */}
                {scanStage === 'result' && scannedData && (
                    <div className="absolute inset-0 bg-zinc-900 p-6 flex flex-col overflow-y-auto">
                        <div className="flex items-center gap-2 mb-6 text-green-400">
                            <CheckCircle2 size={20} />
                            <span className="font-bold text-sm uppercase tracking-wider">Scan Successful</span>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-black/50 p-4 rounded-xl border border-white/5 space-y-1">
                                <div className="text-xs text-white/40 uppercase">Doctor</div>
                                <div className="text-lg font-semibold text-white">{scannedData.doctorName}</div>
                            </div>

                            <div className="bg-black/50 p-4 rounded-xl border border-white/5 space-y-1">
                                <div className="text-xs text-white/40 uppercase">Date</div>
                                <div className="text-white font-mono">{scannedData.date}</div>
                            </div>

                            <div className="bg-black/50 p-4 rounded-xl border border-white/5 space-y-2">
                                <div className="text-xs text-white/40 uppercase">Prescribed Meds</div>
                                {scannedData.medications.map((med: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-indigo-300">
                                        <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                                        {med}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 text-xs text-amber-200">
                                <span className="font-bold">Note:</span> Please verify all details before saving.
                            </div>
                        </div>

                        <div className="mt-auto pt-6 flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white"
                                onClick={() => setScanStage('camera')}
                            >
                                Retake
                            </Button>
                            <Button
                                className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
                                onClick={() => {
                                    toast.success("Saved to Health Record");
                                    setScanStage('idle');
                                }}
                            >
                                Save Record
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
