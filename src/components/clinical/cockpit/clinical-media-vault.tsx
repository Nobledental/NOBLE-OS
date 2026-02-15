'use client';

import React, { useRef } from 'react';
import { useCockpitStore, type ClinicalMedia } from '@/lib/clinical-cockpit-store';
import { ClinicalMediaGallery, type MediaItem, type MediaCategory } from '@/components/clinical/clinical-media-gallery';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { FDI_PERMANENT_TEETH } from '@/types/clinical';
import { Camera, Upload, Usb } from "lucide-react";

export function ClinicalMediaVault() {
    const media = useCockpitStore(s => s.media);
    const addMedia = useCockpitStore(s => s.addMedia);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedTooth, setSelectedTooth] = React.useState<string>("");
    const [activeSource, setActiveSource] = React.useState<'USB' | 'MOBILE' | 'UPLOAD'>('UPLOAD');

    // Flatten all teeth for selector
    const allTeeth = [
        ...FDI_PERMANENT_TEETH.UR, ...FDI_PERMANENT_TEETH.UL,
        ...FDI_PERMANENT_TEETH.LL, ...FDI_PERMANENT_TEETH.LR
    ];

    // Map store media to gallery items
    const galleryItems: MediaItem[] = media.map(m => ({
        id: m.id,
        type: mapMediaType(m.type),
        title: m.notes || 'Untitled Scan',
        date: new Date(m.capturedAt).toLocaleDateString(),
        url: m.url,
        thumbnail: m.url,
        size: '1.2 MB', // Placeholder
        author: 'Dr. Dhivakaran',
    }));

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Process files
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const url = e.target?.result as string;
                const newMedia: ClinicalMedia = {
                    id: crypto.randomUUID(),
                    url,
                    type: 'XRAY', // Default to XRAY for now
                    source: activeSource,
                    capturedAt: new Date().toISOString(),
                    notes: file.name,
                    toothId: selectedTooth ? Number(selectedTooth) : undefined
                };
                addMedia(newMedia);
            };
            reader.readAsDataURL(file);
        });

        // Reset input
        e.target.value = '';
    };

    return (
        <div className="space-y-4">
            {/* Capture Controls */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-end">

                    {/* Tooth Selector */}
                    <div className="space-y-2 w-full md:w-48">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Tooth</Label>
                        <Select value={selectedTooth} onValueChange={setSelectedTooth}>
                            <SelectTrigger className="h-9 text-xs">
                                <SelectValue placeholder="General (No Tooth)" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                                <SelectItem value="0">General (No Tooth)</SelectItem>
                                {allTeeth.map(t => (
                                    <SelectItem key={t} value={t}>Tooth #{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Source Selector */}
                    <div className="space-y-2 flex-1">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Capture Source</Label>
                        <Tabs value={activeSource} onValueChange={(v) => setActiveSource(v as any)} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 h-9">
                                <TabsTrigger value="USB" className="text-xs gap-2"><Usb className="w-3 h-3" /> Sensor (USB)</TabsTrigger>
                                <TabsTrigger value="MOBILE" className="text-xs gap-2"><Camera className="w-3 h-3" /> Mobile Cam</TabsTrigger>
                                <TabsTrigger value="UPLOAD" className="text-xs gap-2"><Upload className="w-3 h-3" /> Upload</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
            />
            <ClinicalMediaGallery
                items={galleryItems}
                onUploadClick={handleUploadClick}
                onCaptureClick={() => {
                    if (activeSource === 'UPLOAD') handleUploadClick();
                    else alert(`${activeSource} capture not implemented in this demo. Please use Upload.`);
                }}
            />
        </div>
    );
}

function mapMediaType(type: ClinicalMedia['type']): MediaCategory {
    switch (type) {
        case 'XRAY':
        case 'IOPA':
            return 'XRAY';
        case 'INTRAORAL':
        case 'EXTRAORAL':
            return 'CLINICAL';
        default:
            return 'REPORTS';
    }
}
