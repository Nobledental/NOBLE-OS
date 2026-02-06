"use client";

import { useState, useRef, useEffect } from "react";
import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    Maximize,
    Grid3X3,
    Smile,
    Upload,
    Download,
    Undo,
    Redo,
    Move,
    Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Mock Templates (In reality, these would be SVG paths or transparent PNGs)
const TEMPLATES = [
    { id: "natural", label: "Natural Ovoid", path: "M10,10..." },
    { id: "hollywood", label: "Hollywood White", path: "M20,20..." },
    { id: "soft", label: "Soft Youthful", path: "M30,30..." },
];

export function SmileDesigner() {
    const [image, setImage] = useState<string | null>("/assets/images/treatments/smile-design-placeholder.jpg"); // Fallback
    const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
    const [gridOpacity, setGridOpacity] = useState(0);
    const [templateScale, setTemplateScale] = useState(1);
    const [templatePos, setTemplatePos] = useState({ x: 0, y: 0 });

    // In a real implementation we would use a canvas ref here
    // For this UI demo, we simulate the overlay system

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
            {/* Left: Toolbar */}
            <PanzeCard className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
                <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold">Smile Studio</h3>
                    <p className="text-xs text-slate-500">iSmile™ Digital Planning</p>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">Upload Patient Photo</span>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase text-slate-400">Templates</label>
                        <div className="grid grid-cols-2 gap-2">
                            {TEMPLATES.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTemplate(t.id)}
                                    className={cn(
                                        "p-3 rounded-lg border text-left transition-all",
                                        activeTemplate === t.id
                                            ? "bg-indigo-600 border-indigo-600 text-white"
                                            : "bg-white border-slate-200 hover:border-indigo-300"
                                    )}
                                >
                                    <Smile className="w-5 h-5 mb-2" />
                                    <span className="text-xs font-bold block">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6 pt-4 border-t">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-slate-500">Golden Ratio Grid</label>
                                <span className="text-xs font-mono">{gridOpacity}%</span>
                            </div>
                            <Slider
                                value={[gridOpacity]}
                                onValueChange={(v) => setGridOpacity(v[0])}
                                max={100} step={1}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-slate-500">Template Scale</label>
                                <span className="text-xs font-mono">{templateScale.toFixed(1)}x</span>
                            </div>
                            <Slider
                                value={[templateScale]}
                                onValueChange={(v) => setTemplateScale(v[0])}
                                min={0.5} max={2} step={0.1}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-auto">
                    <Button className="w-full bg-slate-900 gap-2">
                        <Download className="w-4 h-4" />
                        Export Simulation
                    </Button>
                </div>
            </PanzeCard>

            {/* Right: Canvas Area */}
            <PanzeCard className="flex-1 overflow-hidden relative bg-slate-900 flex items-center justify-center p-0 group">
                {image ? (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
                        {/* Base Image */}
                        <img
                            src="https://images.unsplash.com/photo-1588776814546-1b98f553e817?q=80&w=2000&auto=format&fit=crop"
                            alt="Patient Smile"
                            className="max-w-full max-h-full object-contain opacity-90"
                        />

                        {/* Overlays */}
                        {/* 1. Golden Grid */}
                        <div
                            className="absolute inset-0 pointer-events-none border-indigo-500/30"
                            style={{
                                opacity: gridOpacity / 100,
                                backgroundImage: `
                                    linear-gradient(to right, rgba(99, 102, 241, 0.3) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px'
                            }}
                        >
                            {/* Central Line */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-yellow-400 opacity-50 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                        </div>

                        {/* 2. Teeth Template (Draggable Simulation) */}
                        {activeTemplate && (
                            <motion.div
                                drag
                                dragMomentum={false}
                                className="absolute cursor-move"
                                style={{
                                    scale: templateScale,
                                    x: templatePos.x, // In real app use drag controls
                                    y: templatePos.y
                                }}
                            >
                                {/* Simulating a Dental Veneer Overlay (Visual Approximation) */}
                                <div className="w-[300px] h-[120px] relative">
                                    <div className="absolute inset-x-0 top-0 flex items-center justify-center gap-0.5 opacity-80 mix-blend-screen px-4">
                                        {/* 6 Front Teeth Simulation */}
                                        {[1.6, 1.8, 2, 2, 1.8, 1.6].map((h, i) => (
                                            <div key={i} className="bg-white rounded-b-2xl shadow-inner w-full" style={{ height: `${h * 20}px` }} />
                                        ))}
                                    </div>

                                    {/* Controls overlay */}
                                    <div className="absolute -inset-4 border-2 border-dashed border-white/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-start justify-start p-2">
                                        <span className="bg-blue-600 text-white text-[10px] px-1 rounded">Template Active</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Floating Action Buttons */}
                        <div className="absolute bottom-6 right-6 flex gap-2">
                            <Button size="icon" variant="ghost" className="bg-black/50 text-white hover:bg-black/70 rounded-full">
                                <Undo className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="bg-black/50 text-white hover:bg-black/70 rounded-full">
                                <Redo className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="bg-black/50 text-white hover:bg-black/70 rounded-full">
                                <Maximize className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-500">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Drag and drop patient photo here</p>
                    </div>
                )}
            </PanzeCard>
        </div>
    );
}
