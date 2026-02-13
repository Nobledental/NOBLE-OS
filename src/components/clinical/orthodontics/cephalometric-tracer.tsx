'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Trash2, RefreshCw, Download, Info } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import {
    CephalometricLandmark,
    CephalometricAngles,
    LandmarkName,
    LANDMARK_DESCRIPTIONS,
    NORMAL_RANGES
} from '@/types/orthodontic.types';
import { calculateAllAngles, validateLandmarks } from '@/utils/cephalometric-calculations';

interface CephalometricTracerProps {
    initialImage?: string;
    initialLandmarks?: CephalometricLandmark[];
    onAnglesCalculated?: (angles: CephalometricAngles) => void;
    onLandmarksChange?: (landmarks: CephalometricLandmark[]) => void;
}

export default function CephalometricTracer({
    initialImage,
    initialLandmarks = [],
    onAnglesCalculated,
    onLandmarksChange
}: CephalometricTracerProps) {
    const [image, setImage] = useState<string | null>(initialImage || null);
    const [landmarks, setLandmarks] = useState<CephalometricLandmark[]>(initialLandmarks);
    const [selectedLandmark, setSelectedLandmark] = useState<LandmarkName | null>('S');
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [angles, setAngles] = useState<CephalometricAngles | null>(null);
    const [imageScale, setImageScale] = useState<number>(1);

    const canvasRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const landmarkOrder: LandmarkName[] = ['S', 'N', 'A', 'B', 'Or', 'Po', 'Go', 'Gn'];

    useEffect(() => {
        if (landmarks.length > 0) {
            onLandmarksChange?.(landmarks);

            // Calculate angles when all landmarks are placed
            const landmarkMap = landmarks.reduce((acc, lm) => {
                acc[lm.name] = lm;
                return acc;
            }, {} as Record<string, CephalometricLandmark>);

            const validation = validateLandmarks(landmarkMap);
            if (validation.valid) {
                const calculatedAngles = calculateAllAngles(landmarkMap);
                setAngles(calculatedAngles);
                onAnglesCalculated?.(calculatedAngles);
            }
        }
    }, [landmarks]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target?.result as string);
            setLandmarks([]);
            setAngles(null);
            toast.success('Cephalometric X-ray uploaded');
        };
        reader.readAsDataURL(file);
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!image || !selectedLandmark || draggingId) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if landmark already exists
        const existingIndex = landmarks.findIndex(lm => lm.name === selectedLandmark);

        const newLandmark: CephalometricLandmark = {
            id: `landmark-${selectedLandmark}-${Date.now()}`,
            name: selectedLandmark,
            x,
            y,
            label: selectedLandmark
        };

        if (existingIndex >= 0) {
            // Update existing landmark
            const updated = [...landmarks];
            updated[existingIndex] = newLandmark;
            setLandmarks(updated);
            toast.info(`${selectedLandmark} landmark updated`);
        } else {
            // Add new landmark
            setLandmarks([...landmarks, newLandmark]);
            toast.success(`${selectedLandmark} landmark placed`);

            // Auto-advance to next landmark
            const currentIndex = landmarkOrder.indexOf(selectedLandmark);
            if (currentIndex < landmarkOrder.length - 1) {
                setSelectedLandmark(landmarkOrder[currentIndex + 1]);
            }
        }
    };

    const handleLandmarkDragStart = (id: string) => {
        setDraggingId(id);
    };

    const handleLandmarkDrag = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!draggingId || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setLandmarks(prev =>
            prev.map(lm =>
                lm.id === draggingId ? { ...lm, x, y } : lm
            )
        );
    };

    const handleLandmarkDragEnd = () => {
        setDraggingId(null);
    };

    const clearLandmarks = () => {
        setLandmarks([]);
        setAngles(null);
        setSelectedLandmark('S');
        toast.info('All landmarks cleared');
    };

    const resetTracing = () => {
        setImage(null);
        setLandmarks([]);
        setAngles(null);
        setSelectedLandmark('S');
        toast.info('Cephalometric tracer reset');
    };

    const exportTracing = () => {
        // TODO: Implement SVG export with landmarks and angle annotations
        toast.success('Tracing exported (implementation pending)');
    };

    const getLandmarkColor = (name: LandmarkName): string => {
        const placed = landmarks.find(lm => lm.name === name);
        if (placed) return '#10b981'; // Green
        if (selectedLandmark === name) return '#3b82f6'; // Blue
        return '#94a3b8'; // Gray
    };

    const renderAngleLines = () => {
        if (landmarks.length < 2) return null;

        const landmarkMap = landmarks.reduce((acc, lm) => {
            acc[lm.name] = lm;
            return acc;
        }, {} as Record<string, CephalometricLandmark>);

        return (
            <svg
                className="absolute inset-0 pointer-events-none"
                style={{ width: '100%', height: '100%' }}
            >
                {/* SNA Line (S-N-A) */}
                {landmarkMap['S'] && landmarkMap['N'] && (
                    <line
                        x1={landmarkMap['S'].x}
                        y1={landmarkMap['S'].y}
                        x2={landmarkMap['N'].x}
                        y2={landmarkMap['N'].y}
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                    />
                )}
                {landmarkMap['N'] && landmarkMap['A'] && (
                    <line
                        x1={landmarkMap['N'].x}
                        y1={landmarkMap['N'].y}
                        x2={landmarkMap['A'].x}
                        y2={landmarkMap['A'].y}
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                    />
                )}

                {/* SNB Line (S-N-B) */}
                {landmarkMap['N'] && landmarkMap['B'] && (
                    <line
                        x1={landmarkMap['N'].x}
                        y1={landmarkMap['N'].y}
                        x2={landmarkMap['B'].x}
                        y2={landmarkMap['B'].y}
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                    />
                )}

                {/* Frankfort Plane (Or-Po) */}
                {landmarkMap['Or'] && landmarkMap['Po'] && (
                    <line
                        x1={landmarkMap['Or'].x}
                        y1={landmarkMap['Or'].y}
                        x2={landmarkMap['Po'].x}
                        y2={landmarkMap['Po'].y}
                        stroke="#3b82f6"
                        strokeWidth="2"
                    />
                )}

                {/* Mandibular Plane (Go-Gn) */}
                {landmarkMap['Go'] && landmarkMap['Gn'] && (
                    <line
                        x1={landmarkMap['Go'].x}
                        y1={landmarkMap['Go'].y}
                        x2={landmarkMap['Gn'].x}
                        y2={landmarkMap['Gn'].y}
                        stroke="#8b5cf6"
                        strokeWidth="2"
                    />
                )}
            </svg>
        );
    };

    const getAngleStatus = (value: number, range: { min: number; max: number }) => {
        if (value >= range.min && value <= range.max) return 'normal';
        return 'abnormal';
    };

    return (
        <div className="space-y-4">
            {/* Upload Section */}
            {!image && (
                <Card className="p-8 border-2 border-dashed">
                    <div className="text-center space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <div>
                            <h3 className="font-semibold text-lg">Upload Cephalometric X-ray</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Lateral ceph radiograph required for landmark tracing
                            </p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="ceph-upload"
                        />
                        <label htmlFor="ceph-upload">
                            <Button asChild>
                                <span>Select X-ray Image</span>
                            </Button>
                        </label>
                    </div>
                </Card>
            )}

            {/* Tracing Workspace */}
            {image && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Canvas Area */}
                    <div className="lg:col-span-2 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Landmark Placement</h3>
                            <div className="flex gap-2">
                                <Button onClick={clearLandmarks} variant="outline" size="sm">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Clear Points
                                </Button>
                                <Button onClick={resetTracing} variant="outline" size="sm">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    New X-ray
                                </Button>
                                <Button onClick={exportTracing} variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>

                        <Card className="p-0 overflow-hidden bg-black">
                            <div
                                ref={canvasRef}
                                className="relative cursor-crosshair"
                                onClick={handleCanvasClick}
                                onMouseMove={handleLandmarkDrag}
                                onMouseUp={handleLandmarkDragEnd}
                                onMouseLeave={handleLandmarkDragEnd}
                            >
                                <Image
                                    ref={imageRef}
                                    src={image}
                                    alt="Cephalometric X-ray"
                                    width={800}
                                    height={600}
                                    className="w-full h-auto select-none"
                                    draggable={false}
                                />

                                {/* Angle Lines */}
                                {renderAngleLines()}

                                {/* Landmark Points */}
                                {landmarks.map(landmark => (
                                    <div
                                        key={landmark.id}
                                        className="absolute w-4 h-4 -ml-2 -mt-2 cursor-move group"
                                        style={{ left: landmark.x, top: landmark.y }}
                                        onMouseDown={() => handleLandmarkDragStart(landmark.id)}
                                    >
                                        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg" />
                                        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                            {landmark.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3 rounded-lg text-xs">
                            <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                                <div>
                                    <p className="font-medium text-blue-900 dark:text-blue-200">
                                        {selectedLandmark ? `Next: Place ${selectedLandmark} - ${LANDMARK_DESCRIPTIONS[selectedLandmark]}` : 'All landmarks placed'}
                                    </p>
                                    <p className="text-blue-700 dark:text-blue-300 mt-1">
                                        Click on the X-ray to place landmarks. Drag to adjust. Angles calculate automatically.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Control Panel */}
                    <div className="space-y-4">
                        {/* Landmark Selector */}
                        <Card className="p-4">
                            <h4 className="font-medium text-sm mb-3">Anatomical Landmarks</h4>
                            <div className="space-y-2">
                                {landmarkOrder.map(name => {
                                    const placed = landmarks.find(lm => lm.name === name);
                                    return (
                                        <button
                                            key={name}
                                            onClick={() => setSelectedLandmark(name)}
                                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedLandmark === name
                                                ? 'bg-blue-500 text-white'
                                                : placed
                                                    ? 'bg-green-100 dark:bg-green-900/30'
                                                    : 'bg-muted hover:bg-muted/80'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{name}</span>
                                                {placed && <Badge variant="secondary" className="text-xs">✓</Badge>}
                                            </div>
                                            <div className="text-xs opacity-80 mt-1">
                                                {LANDMARK_DESCRIPTIONS[name].split(':')[1]}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Calculated Angles */}
                        {angles && (
                            <Card className="p-4">
                                <h4 className="font-medium text-sm mb-3">Cephalometric Analysis</h4>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium">SNA Angle</span>
                                            <Badge variant={getAngleStatus(angles.SNA, NORMAL_RANGES.SNA) === 'normal' ? 'default' : 'destructive'}>
                                                {angles.SNA}°
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Normal: {NORMAL_RANGES.SNA.min}-{NORMAL_RANGES.SNA.max}°
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium">SNB Angle</span>
                                            <Badge variant={getAngleStatus(angles.SNB, NORMAL_RANGES.SNB) === 'normal' ? 'default' : 'destructive'}>
                                                {angles.SNB}°
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Normal: {NORMAL_RANGES.SNB.min}-{NORMAL_RANGES.SNB.max}°
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium">ANB Angle</span>
                                            <Badge variant={getAngleStatus(angles.ANB, NORMAL_RANGES.ANB) === 'normal' ? 'default' : 'destructive'}>
                                                {angles.ANB}°
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Normal: {NORMAL_RANGES.ANB.min}-{NORMAL_RANGES.ANB.max}° (Class I)
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium">FMA</span>
                                            <Badge variant={getAngleStatus(angles.FMA, NORMAL_RANGES.FMA) === 'normal' ? 'default' : 'destructive'}>
                                                {angles.FMA}°
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Normal: {NORMAL_RANGES.FMA.min}-{NORMAL_RANGES.FMA.max}°
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium">Skeletal Class</span>
                                            <Badge>{angles.skeletalClass}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium">Vertical Pattern</span>
                                            <Badge variant="outline">{angles.verticalPattern}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
