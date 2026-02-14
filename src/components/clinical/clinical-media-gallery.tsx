
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Image as ImageIcon,
    FileText,
    Upload,
    Search,
    Filter,
    Maximize2,
    Download,
    Trash2,
    AlertCircle,
    CheckCircle2,
    Clock,
    Camera
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type MediaCategory = "ALL" | "XRAY" | "CLINICAL" | "REPORTS";

export interface MediaItem {
    id: string;
    type: MediaCategory;
    title: string;
    date: string;
    url: string;
    thumbnail: string;
    size: string;
    author: string;
}

const MOCK_MEDIA: MediaItem[] = [
    { id: "1", type: "XRAY", title: "OPG - Full Arch", date: "2024-02-10", url: "#", thumbnail: "/assets/images/treatments/rct.webp", size: "2.4 MB", author: "Dr. Dhivakaran" },
    { id: "2", type: "CLINICAL", title: "Pre-Op Intraoral - Upper Right", date: "2024-02-11", url: "#", thumbnail: "/assets/images/treatments/extraction.webp", size: "1.1 MB", author: "Dr. Dhivakaran" },
    { id: "3", type: "REPORTS", title: "Radiology Report #9921", date: "2024-02-12", url: "#", thumbnail: "", size: "450 KB", author: "AI Assistant" },
    { id: "4", type: "XRAY", title: "IOPA - Tooth 46", date: "2024-02-12", url: "#", thumbnail: "/assets/images/treatments/rct.webp", size: "800 KB", author: "Dr. Dhivakaran" },
];

interface ClinicalMediaGalleryProps {
    items?: MediaItem[];
    onUploadClick?: () => void;
    onCaptureClick?: () => void;
}

export function ClinicalMediaGallery({ items, onUploadClick, onCaptureClick }: ClinicalMediaGalleryProps) {
    const [category, setCategory] = useState<MediaCategory>("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

    const displayMedia = items || MOCK_MEDIA;
    const filteredMedia = displayMedia.filter(item => {
        const matchesCategory = category === "ALL" || item.type === category;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex flex-col h-full space-y-8 animate-ios-reveal">
            {/* Header / Search Area */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search scans, photos, or reports..."
                        className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="outline" onClick={onUploadClick} className="flex-1 md:flex-none h-14 rounded-2xl border-slate-100 gap-2 font-black text-[10px] uppercase tracking-widest">
                        <Upload className="w-4 h-4" /> Bulk Upload
                    </Button>
                    <Button onClick={onCaptureClick} className="flex-1 md:flex-none h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 gap-2 font-black text-[10px] uppercase tracking-widest">
                        <Camera className="w-4 h-4" /> Live Capture
                    </Button>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {(["ALL", "XRAY", "CLINICAL", "REPORTS"] as MediaCategory[]).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={cn(
                                "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                category === cat
                                    ? "bg-slate-900 text-white shadow-lg"
                                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <p className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {filteredMedia.length} Items Found
                </p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredMedia.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card
                                className="group relative aspect-square rounded-[2rem] overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                onClick={() => setSelectedItem(item)}
                            >
                                {item.type === "REPORTS" ? (
                                    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-6 space-y-4">
                                        <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-black uppercase tracking-tight text-slate-900 line-clamp-2">{item.title}</p>
                                            <p className="text-[9px] font-bold text-slate-400 mt-1">{item.size}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Image
                                            src={item.thumbnail}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white">{item.title}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-[9px] font-bold text-slate-300">{item.date}</span>
                                                <div className="flex gap-2">
                                                    <Button size="icon" variant="ghost" className="w-8 h-8 text-white hover:bg-white/20 rounded-full">
                                                        <Maximize2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className={cn(
                                        "px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm border border-white/10",
                                        item.type === "XRAY" ? "bg-amber-500/80 text-white" :
                                            item.type === "CLINICAL" ? "bg-blue-500/80 text-white" :
                                                "bg-emerald-500/80 text-white"
                                    )}>
                                        {item.type}
                                    </span>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Empty State / Add Card */}
                <Card className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-6 space-y-4 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all group cursor-pointer">
                    <div className="w-12 h-12 rounded-full border-2 border-slate-300 group-hover:border-indigo-300 flex items-center justify-center transition-colors">
                        <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-500">Add New Scan</p>
                </Card>
            </div>

            {/* Lightbox / Detail Dialog Placeholder (Simplified for brevity) */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-10 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="relative w-full h-full max-w-6xl flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{selectedItem.title}</h3>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {selectedItem.author} • {selectedItem.date} • {selectedItem.size}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20"
                                onClick={() => setSelectedItem(null)}
                            >
                                <Maximize2 className="w-5 h-5 rotate-45" />
                            </Button>
                        </div>

                        <div className="flex-1 bg-black/40 rounded-[3rem] border border-white/5 overflow-hidden flex items-center justify-center p-10">
                            {selectedItem.type === "REPORTS" ? (
                                <div className="max-w-2xl w-full bg-white rounded-[2rem] p-12 text-slate-900">
                                    {/* Mock Radiology Report Content */}
                                    <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                                        <h4 className="text-2xl font-serif italic text-indigo-900">Radiology Findings</h4>
                                        <Badge className="bg-emerald-100 text-emerald-800 border-none px-4 py-2 font-black text-[10px] uppercase">AI VERIFIED</Badge>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Observation</p>
                                            <p className="text-sm leading-relaxed text-slate-600">
                                                Interproximal decay detected on distal of 46. Bone loss of 3mm observed in the mandibular molar region. No periapical lesions found.
                                            </p>
                                        </div>
                                        <div className="space-y-2 pt-6">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recommendations</p>
                                            <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
                                                <li>Composite restoration for 46 (Distal)</li>
                                                <li>Periodontal scaling & root planing for Quadrant 4</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Image src={selectedItem.thumbnail} alt="" width={1200} height={800} className="max-h-full max-w-full object-contain rounded-xl shadow-2xl" />
                            )}
                        </div>

                        <div className="flex justify-center gap-4 mt-8">
                            <Button className="h-14 px-10 rounded-2xl bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest gap-2">
                                <Download className="w-4 h-4" /> Download Original
                            </Button>
                            <Button variant="outline" className="h-14 px-10 rounded-2xl border-white/10 text-white hover:bg-white/10 font-black text-[10px] uppercase tracking-widest gap-2">
                                <Maximize2 className="w-4 h-4" /> Compare
                            </Button>
                            <Button className="h-14 px-10 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest gap-2">
                                <Trash2 className="w-4 h-4" /> Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={cn("px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", className)}>
            {children}
        </span>
    );
}
