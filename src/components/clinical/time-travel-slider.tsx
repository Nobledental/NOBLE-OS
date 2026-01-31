'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Clock, History, Play, Pause, ChevronLeft,
    ChevronRight, Eye, Lock
} from 'lucide-react';

interface TimelineSnapshot {
    id: string;
    date: string;
    label: string;
    toothStates: Record<number, string>;
    dmft: number;
    provider?: string;
}

interface TimeTravelSliderProps {
    patientId: string;
    snapshots: TimelineSnapshot[];
    currentSnapshotId?: string;
    onSnapshotChange?: (snapshot: TimelineSnapshot) => void;
}

export default function TimeTravelSlider({
    patientId,
    snapshots,
    currentSnapshotId,
    onSnapshotChange
}: TimeTravelSliderProps) {
    const [selectedIndex, setSelectedIndex] = useState<number>(snapshots.length - 1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(1000); // ms between frames

    // Sort snapshots by date
    const sortedSnapshots = useMemo(() =>
        [...snapshots].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        [snapshots]
    );

    const selectedSnapshot = sortedSnapshots[selectedIndex];
    const isLatest = selectedIndex === sortedSnapshots.length - 1;

    // Autoplay effect
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setSelectedIndex(prev => {
                if (prev >= sortedSnapshots.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, playSpeed);

        return () => clearInterval(interval);
    }, [isPlaying, playSpeed, sortedSnapshots.length]);

    // Notify parent of changes
    useEffect(() => {
        if (selectedSnapshot) {
            onSnapshotChange?.(selectedSnapshot);
        }
    }, [selectedSnapshot, onSnapshotChange]);

    const handleSliderChange = (value: number[]) => {
        setSelectedIndex(value[0]);
        setIsPlaying(false);
    };

    const handlePrev = () => {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
            setIsPlaying(false);
        }
    };

    const handleNext = () => {
        if (selectedIndex < sortedSnapshots.length - 1) {
            setSelectedIndex(selectedIndex + 1);
            setIsPlaying(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (sortedSnapshots.length === 0) {
        return (
            <Card className="p-4">
                <div className="text-center text-muted-foreground">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No historical snapshots available</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold">Ayu Time-Travel</h3>
                </div>
                <div className="flex items-center gap-2">
                    {!isLatest && (
                        <Badge variant="outline" className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30">
                            <Eye className="w-3 h-3" />
                            Read-Only
                        </Badge>
                    )}
                    <Badge variant={isLatest ? 'default' : 'secondary'}>
                        {isLatest ? 'Current' : 'Historical'}
                    </Badge>
                </div>
            </div>

            {/* Current Selection Display */}
            <div className="mb-4 p-3 bg-white dark:bg-slate-900 rounded-lg border">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-lg font-medium">
                            {formatDate(selectedSnapshot.date)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {selectedSnapshot.label}
                            {selectedSnapshot.provider && ` • ${selectedSnapshot.provider}`}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">
                            DMFT: {selectedSnapshot.dmft}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Snapshot {selectedIndex + 1} of {sortedSnapshots.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Slider */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={handlePrev}
                        disabled={selectedIndex === 0}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex-1">
                        <Slider
                            value={[selectedIndex]}
                            onValueChange={handleSliderChange}
                            min={0}
                            max={sortedSnapshots.length - 1}
                            step={1}
                        />
                    </div>

                    <Button
                        size="icon"
                        variant="outline"
                        onClick={handleNext}
                        disabled={selectedIndex === sortedSnapshots.length - 1}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>

                    <Button
                        size="icon"
                        variant={isPlaying ? 'default' : 'outline'}
                        onClick={() => setIsPlaying(!isPlaying)}
                        disabled={isLatest}
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                </div>

                {/* Timeline Markers */}
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>{formatDate(sortedSnapshots[0].date)}</span>
                    <span>→</span>
                    <span>{formatDate(sortedSnapshots[sortedSnapshots.length - 1].date)}</span>
                </div>
            </div>

            {/* Read-Only Warning */}
            {!isLatest && (
                <div className="mt-3 p-2 bg-amber-100 dark:bg-amber-900/30 rounded text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span>
                        Viewing historical data. Editing disabled.
                        <Button variant="link" className="h-auto p-0 ml-1" onClick={() => setSelectedIndex(sortedSnapshots.length - 1)}>
                            Return to current
                        </Button>
                    </span>
                </div>
            )}

            {/* Quick Jump Buttons */}
            {sortedSnapshots.length > 3 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                    {sortedSnapshots.slice(-5).map((snapshot, idx) => (
                        <Button
                            key={snapshot.id}
                            size="sm"
                            variant={selectedSnapshot.id === snapshot.id ? 'default' : 'outline'}
                            onClick={() => setSelectedIndex(sortedSnapshots.indexOf(snapshot))}
                        >
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(snapshot.date)}
                        </Button>
                    ))}
                </div>
            )}
        </Card>
    );
}
