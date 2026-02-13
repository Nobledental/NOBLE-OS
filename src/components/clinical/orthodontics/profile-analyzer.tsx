'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Trash2, Info } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { ProfileAnalysis, Point } from '@/types/orthodontic.types';
import { calculateAngle, distancePointToLine } from '@/utils/cephalometric-calculations';
import { NORMAL_RANGES, classifyProfile } from '@/types/orthodontic.types';

interface ProfileAnalyzerProps {
    onAnalysisComplete?: (analysis: ProfileAnalysis) => void;
}

type LandmarkType = 'noseTip' | 'pronasale' | 'upperLip' | 'lowerLip' | 'softTissuePogonion';

export default function ProfileAnalyzer({ onAnalysisComplete }: ProfileAnalyzerProps) {
    const [image, setImage] = useState<string | null>(null);
    const [landmarks, setLandmarks] = useState<Record<string, Point>>({});
    const [selectedLandmark, setSelectedLandmark] = useState<LandmarkType>('noseTip');
    const [analysis, setAnalysis] = useState<ProfileAnalysis | null>(null);

    const canvasRef = useRef<HTMLDivElement>(null);

    const landmarkOrder: LandmarkType[] = ['noseTip', 'pronasale', 'upperLip', 'lowerLip', 'softTissuePogonion'];

    const landmarkLabels: Record<LandmarkType, string> = {
        noseTip: 'Nose Tip (N\')',
        pronasale: 'Pronasale (Prn)',
        upperLip: 'Upper Lip (UL)',
        lowerLip: 'Lower Lip (LL)',
        softTissuePogonion: 'Soft Tissue Pogonion (Pg\')'
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target?.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target?.result as string);
            setLandmarks({});
            setAnalysis(null);
            toast.success('Profile photo uploaded');
        };
        reader.readAsDataURL(file);
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!image || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const updated = { ...landmarks, [selectedLandmark]: { x, y } };
        setLandmarks(updated);
        toast.success(`${landmarkLabels[selectedLandmark]} marked`);

        // Auto-advance to next landmark
        const currentIndex = landmarkOrder.indexOf(selectedLandmark);
        if (currentIndex < landmarkOrder.length - 1) {
            setSelectedLandmark(landmarkOrder[currentIndex + 1]);
        } else if (Object.keys(updated).length === landmarkOrder.length) {
            // All landmarks placed, calculate immediately
            calculateProfile(updated);
        }
    };

    const calculateProfile = (lms = landmarks) => {
        if (Object.keys(lms).length < landmarkOrder.length) {
            toast.error('Please mark all landmarks first');
            return;
        }

        // Calculate Nasolabial Angle (angle at Pronasale between Nose Tip and Upper Lip)
        const nasolabialAngle = calculateAngle(
            lms.noseTip,
            lms.pronasale,
            lms.upperLip
        );

        // Calculate E-Line (Rickett's Esthetic Plane: from Nose Tip to Soft Tissue Pogonion)
        const eLineUpperLip = distancePointToLine(
            lms.upperLip,
            lms.noseTip,
            lms.softTissuePogonion
        );

        const eLineLowerLip = distancePointToLine(
            lms.lowerLip,
            lms.noseTip,
            lms.softTissuePogonion
        );

        const profileType = classifyProfile(nasolabialAngle);

        const result: ProfileAnalysis = {
            nasolabialAngle,
            eLineUpperLip,
            eLineLowerLip,
            profileType
        };

        setAnalysis(result);
        onAnalysisComplete?.(result);
        toast.success('Profile analysis complete');
    };

    const reset = () => {
        setImage(null);
        setLandmarks({});
        setAnalysis(null);
        setSelectedLandmark('noseTip');
        toast.info('Profile analyzer reset');
    };

    const getStatusColor = (value: number, range: { min: number; max: number }) => {
        if (value >= range.min && value <= range.max) return 'bg-green-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-4">
            {/* Upload Section */}
            {!image && (
                <Card className="p-8 border-2 border-dashed">
                    <div className="text-center space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <div>
                            <h3 className="font-semibold text-lg">Upload Profile Photo</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Lateral profile view required for soft tissue analysis
                            </p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="profile-upload"
                        />
                        <label htmlFor="profile-upload">
                            <Button asChild>
                                <span>Select Profile Photo</span>
                            </Button>
                        </label>
                    </div>
                </Card>
            )}

            {/* Analysis Workspace */}
            {image && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Canvas Area */}
                    <div className="lg:col-span-2 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Soft Tissue Analysis</h3>
                            <Button onClick={reset} variant="outline" size="sm">
                                <Trash2 className="w-4 h-4 mr-2" />
                                New Photo
                            </Button>
                        </div>

                        <Card className="p-0 overflow-hidden bg-muted">
                            <div
                                ref={canvasRef}
                                className="relative cursor-crosshair"
                                onClick={handleCanvasClick}
                            >
                                <Image
                                    src={image}
                                    alt="Profile view"
                                    width={800}
                                    height={600}
                                    className="w-full h-auto select-none"
                                    draggable={false}
                                />

                                {/* E-Line */}
                                {landmarks.noseTip && landmarks.softTissuePogonion && (
                                    <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                                        <line
                                            x1={landmarks.noseTip.x}
                                            y1={landmarks.noseTip.y}
                                            x2={landmarks.softTissuePogonion.x}
                                            y2={landmarks.softTissuePogonion.y}
                                            stroke="#3b82f6"
                                            strokeWidth="2"
                                            strokeDasharray="4 2"
                                        />
                                        <text
                                            x={(landmarks.noseTip.x + landmarks.softTissuePogonion.x) / 2}
                                            y={(landmarks.noseTip.y + landmarks.softTissuePogonion.y) / 2 - 10}
                                            fill="#3b82f6"
                                            fontSize="12"
                                            fontWeight="bold"
                                        >
                                            E-Line
                                        </text>
                                    </svg>
                                )}

                                {/* Nasolabial Angle Lines */}
                                {landmarks.noseTip && landmarks.pronasale && (
                                    <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                                        <line
                                            x1={landmarks.noseTip.x}
                                            y1={landmarks.noseTip.y}
                                            x2={landmarks.pronasale.x}
                                            y2={landmarks.pronasale.y}
                                            stroke="#f59e0b"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                )}
                                {landmarks.pronasale && landmarks.upperLip && (
                                    <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                                        <line
                                            x1={landmarks.pronasale.x}
                                            y1={landmarks.pronasale.y}
                                            x2={landmarks.upperLip.x}
                                            y2={landmarks.upperLip.y}
                                            stroke="#f59e0b"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                )}

                                {/* Landmark Points */}
                                {Object.entries(landmarks).map(([name, point]) => (
                                    <div
                                        key={name}
                                        className="absolute w-3 h-3 -ml-1.5 -mt-1.5 group"
                                        style={{ left: point.x, top: point.y }}
                                    >
                                        <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg" />
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                            {landmarkLabels[name as LandmarkType]}
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
                                        {selectedLandmark ? `Next: Mark ${landmarkLabels[selectedLandmark]}` : 'All landmarks placed'}
                                    </p>
                                    <p className="text-blue-700 dark:text-blue-300 mt-1">
                                        Click on the profile photo to mark soft tissue landmarks for esthetic analysis
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Control Panel */}
                    <div className="space-y-4">
                        {/* Landmark Selector */}
                        <Card className="p-4">
                            <h4 className="font-medium text-sm mb-3">Soft Tissue Landmarks</h4>
                            <div className="space-y-2">
                                {landmarkOrder.map(name => {
                                    const placed = landmarks[name];
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
                                                <span className="font-medium">{landmarkLabels[name]}</span>
                                                {placed && <Badge variant="secondary" className="text-xs">✓</Badge>}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {Object.keys(landmarks).length === landmarkOrder.length && !analysis && (
                                <Button onClick={() => calculateProfile()} className="w-full mt-3" size="sm">
                                    Calculate Profile
                                </Button>
                            )}
                        </Card>

                        {/* Analysis Results */}
                        {analysis && (
                            <Card className="p-4">
                                <h4 className="font-medium text-sm mb-3">Profile Analysis Results</h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium">Nasolabial Angle</span>
                                            <Badge variant={
                                                analysis.nasolabialAngle >= NORMAL_RANGES.nasolabialAngle.min &&
                                                    analysis.nasolabialAngle <= NORMAL_RANGES.nasolabialAngle.max
                                                    ? 'default' : 'destructive'
                                            }>
                                                {analysis.nasolabialAngle}°
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Normal: {NORMAL_RANGES.nasolabialAngle.min}-{NORMAL_RANGES.nasolabialAngle.max}°
                                        </div>
                                        <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
                                            <div
                                                className={`h-full ${getStatusColor(analysis.nasolabialAngle, NORMAL_RANGES.nasolabialAngle)}`}
                                                style={{
                                                    width: `${Math.min((analysis.nasolabialAngle / 120) * 100, 100)}%`
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium">Upper Lip to E-Line</span>
                                            <Badge variant={
                                                analysis.eLineUpperLip >= NORMAL_RANGES.eLineUpperLip.min &&
                                                    analysis.eLineUpperLip <= NORMAL_RANGES.eLineUpperLip.max
                                                    ? 'default' : 'destructive'
                                            }>
                                                {analysis.eLineUpperLip > 0 ? '+' : ''}{analysis.eLineUpperLip} mm
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Normal: {NORMAL_RANGES.eLineUpperLip.min} to {NORMAL_RANGES.eLineUpperLip.max} mm
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium">Lower Lip to E-Line</span>
                                            <Badge variant={
                                                analysis.eLineLowerLip >= NORMAL_RANGES.eLineLowerLip.min &&
                                                    analysis.eLineLowerLip <= NORMAL_RANGES.eLineLowerLip.max
                                                    ? 'default' : 'destructive'
                                            }>
                                                {analysis.eLineLowerLip > 0 ? '+' : ''}{analysis.eLineLowerLip} mm
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Normal: {NORMAL_RANGES.eLineLowerLip.min} to {NORMAL_RANGES.eLineLowerLip.max} mm
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium">Profile Type</span>
                                            <Badge className="bg-purple-500">{analysis.profileType}</Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-2">
                                            {analysis.profileType === 'Convex' && 'Upper lip and/or chin appears retruded'}
                                            {analysis.profileType === 'Concave' && 'Lower jaw appears protruded'}
                                            {analysis.profileType === 'Straight' && 'Balanced facial profile'}
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
