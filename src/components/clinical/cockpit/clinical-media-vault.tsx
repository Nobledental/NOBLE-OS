'use client';

import React, { useRef } from 'react';
import { useCockpitStore, type ClinicalMedia } from '@/lib/clinical-cockpit-store';
import { ClinicalMediaGallery, type MediaItem, type MediaCategory } from '@/components/clinical/clinical-media-gallery';

export function ClinicalMediaVault() {
    const media = useCockpitStore(s => s.media);
    const addMedia = useCockpitStore(s => s.addMedia);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                    source: 'UPLOAD',
                    capturedAt: new Date().toISOString(),
                    notes: file.name
                };
                addMedia(newMedia);
            };
            reader.readAsDataURL(file);
        });

        // Reset input
        e.target.value = '';
    };

    return (
        <>
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
                onCaptureClick={handleUploadClick} // Use upload for capture for now
            />
        </>
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
