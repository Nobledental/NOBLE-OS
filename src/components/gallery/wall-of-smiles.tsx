'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Camera, Upload, ChevronLeft, ChevronRight,
    Sparkles, ArrowLeftRight, Share2, Download,
    Star, Check, X, Eye
} from 'lucide-react';
import { hapticPatterns } from '@/components/gestures/ios-gestures';
import Image from 'next/image';

// =============================================================================
// TYPES
// =============================================================================

export interface CasePhoto {
    id: string;
    caseId: string;
    patientId: string;
    procedureName: string;
    beforeUrl: string;
    afterUrl: string;
    toothNumbers: number[];
    uploadedAt: Date;
    doctorId: string;
    doctorName: string;
    isPublic: boolean;
    patientConsent: boolean;
    caption?: string;
    rating?: number;
}

// =============================================================================
// BEFORE/AFTER SLIDER COMPONENT
// =============================================================================

interface BeforeAfterSliderProps {
    beforeUrl: string;
    afterUrl: string;
    procedureName: string;
    doctorName?: string;
    className?: string;
}

export function BeforeAfterSlider({
    beforeUrl,
    afterUrl,
    procedureName,
    doctorName,
    className = ''
}: BeforeAfterSliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(400);
    const sliderX = useMotionValue(containerWidth / 2);

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
            sliderX.set(containerRef.current.offsetWidth / 2);
        }
    }, [sliderX]);

    const clipPath = useTransform(sliderX, (x) => `inset(0 ${containerWidth - x}px 0 0)`);

    const handleDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const x = Math.max(0, Math.min(containerWidth, clientX - rect.left));
        sliderX.set(x);
    }, [containerWidth, sliderX]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden rounded-xl cursor-ew-resize ${className}`}
            style={{ aspectRatio: '4/3' }}
            onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
            onTouchMove={handleDrag}
        >
            {/* After Image (Bottom) */}
            <Image
                src={afterUrl}
                alt="After"
                fill
                className="object-cover"
            />

            {/* Before Image (Top, clipped) */}
            <motion.div
                className="absolute inset-0"
                style={{ clipPath }}
            >
                <Image
                    src={beforeUrl}
                    alt="Before"
                    fill
                    className="object-cover"
                />
            </motion.div>

            {/* Slider Handle */}
            <motion.div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                style={{ left: sliderX }}
                drag="x"
                dragConstraints={{ left: 0, right: containerWidth }}
                dragElastic={0}
                onDrag={(_, info) => sliderX.set(info.point.x - (containerRef.current?.getBoundingClientRect().left || 0))}
            >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <ArrowLeftRight className="w-5 h-5 text-gray-600" />
                </div>
            </motion.div>

            {/* Labels */}
            <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 rounded text-white text-xs font-medium">
                Before
            </div>
            <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 rounded text-white text-xs font-medium">
                After
            </div>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white font-medium">{procedureName}</p>
                {doctorName && (
                    <p className="text-white/80 text-sm">By Dr. {doctorName}</p>
                )}
            </div>
        </div>
    );
}

// =============================================================================
// WALL OF SMILES GALLERY
// =============================================================================

interface WallOfSmilesProps {
    cases: CasePhoto[];
    onCaseClick?: (casePhoto: CasePhoto) => void;
    showUpload?: boolean;
    onUpload?: () => void;
}

export function WallOfSmiles({
    cases,
    onCaseClick,
    showUpload = false,
    onUpload
}: WallOfSmilesProps) {
    const [selectedCase, setSelectedCase] = useState<CasePhoto | null>(null);
    const [filter, setFilter] = useState<string>('all');

    const procedures = [...new Set(cases.map(c => c.procedureName))];
    const filteredCases = filter === 'all'
        ? cases
        : cases.filter(c => c.procedureName === filter);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-amber-500" />
                        Wall of Smiles
                    </h2>
                    <p className="text-muted-foreground">{cases.length} transformations</p>
                </div>
                {showUpload && (
                    <Button onClick={onUpload} variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Add Case
                    </Button>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                >
                    All
                </Button>
                {procedures.map(proc => (
                    <Button
                        key={proc}
                        variant={filter === proc ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(proc)}
                    >
                        {proc}
                    </Button>
                ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCases.map((casePhoto) => (
                    <motion.div
                        key={casePhoto.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            hapticPatterns.softTap();
                            setSelectedCase(casePhoto);
                            onCaseClick?.(casePhoto);
                        }}
                        className="cursor-pointer"
                    >
                        <BeforeAfterSlider
                            beforeUrl={casePhoto.beforeUrl}
                            afterUrl={casePhoto.afterUrl}
                            procedureName={casePhoto.procedureName}
                            doctorName={casePhoto.doctorName}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedCase && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedCase(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="max-w-3xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <BeforeAfterSlider
                                beforeUrl={selectedCase.beforeUrl}
                                afterUrl={selectedCase.afterUrl}
                                procedureName={selectedCase.procedureName}
                                doctorName={selectedCase.doctorName}
                                className="shadow-2xl"
                            />
                            <div className="mt-4 flex justify-center gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedCase(null)}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Close
                                </Button>
                                <Button variant="outline">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// =============================================================================
// CASE COMPLETION PHOTO PROMPT
// =============================================================================

interface PhotoUploadPromptProps {
    caseId: string;
    procedureName: string;
    preOpPhotoUrl?: string;
    onUpload: (file: File) => void;
    onSkip: () => void;
}

export function PhotoUploadPrompt({
    caseId,
    procedureName,
    preOpPhotoUrl,
    onUpload,
    onSkip
}: PhotoUploadPromptProps) {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        }
    }, []);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
        onUpload(file);
    };

    return (
        <Card className="glass-card-heavy p-6 max-w-lg mx-auto">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Case Completed!</h3>
                <p className="text-muted-foreground mt-1">
                    {procedureName} finished successfully
                </p>
            </div>

            {/* Before/After Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <p className="text-xs text-muted-foreground mb-2 text-center">Pre-Op</p>
                    {preOpPhotoUrl ? (
                        <Image
                            src={preOpPhotoUrl}
                            alt="Pre-op"
                            width={300}
                            height={300}
                            className="w-full aspect-square object-cover rounded-lg"
                        />
                    ) : (
                        <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                            <Camera className="w-8 h-8 text-muted-foreground" />
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-2 text-center">Post-Op</p>
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${dragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-primary/50'
                            }`}
                    >
                        {preview ? (
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-cover rounded-lg"
                            />
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                <span className="text-xs text-muted-foreground">
                                    Drop or click
                                </span>
                            </>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                </div>
            </div>

            {/* Add to Gallery Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">Add to Wall of Smiles</span>
                </div>
                <Badge>With Consent</Badge>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onSkip}>
                    Skip for Now
                </Button>
                <Button
                    className="flex-1"
                    disabled={!preview}
                    onClick={() => hapticPatterns.successPulse()}
                >
                    <Camera className="w-4 h-4 mr-2" />
                    Save Photo
                </Button>
            </div>
        </Card>
    );
}

// =============================================================================
// SPLIT SCREEN COMPARISON VIEW
// =============================================================================

interface SplitScreenViewProps {
    beforeUrl: string;
    afterUrl: string;
    procedureName: string;
    details?: {
        doctor: string;
        date: string;
        toothNumbers: number[];
    };
}

export function SplitScreenView({
    beforeUrl,
    afterUrl,
    procedureName,
    details
}: SplitScreenViewProps) {
    return (
        <Card className="overflow-hidden">
            <div className="grid grid-cols-2">
                {/* Before */}
                <div className="relative">
                    <Image
                        src={beforeUrl}
                        alt="Before"
                        width={600}
                        height={450}
                        className="w-full aspect-[4/3] object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <span className="text-white font-medium">Before</span>
                    </div>
                </div>

                {/* After */}
                <div className="relative">
                    <Image
                        src={afterUrl}
                        alt="After"
                        width={600}
                        height={450}
                        className="w-full aspect-[4/3] object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <span className="text-white font-medium">After</span>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="p-4 space-y-2">
                <h3 className="font-semibold">{procedureName}</h3>
                {details && (
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>Dr. {details.doctor}</span>
                        <span>•</span>
                        <span>{details.date}</span>
                        {details.toothNumbers.length > 0 && (
                            <>
                                <span>•</span>
                                <span>Teeth: {details.toothNumbers.join(', ')}</span>
                            </>
                        )}
                    </div>
                )}
                <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3 mr-1" />
                        View Full
                    </Button>
                    <Button variant="outline" size="sm">
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                    </Button>
                </div>
            </div>
        </Card>
    );
}
