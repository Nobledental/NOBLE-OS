'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
    Clock, TrendingUp, TrendingDown, CalendarDays, Activity
} from 'lucide-react';
import {
    TimelineEvent,
    LifelongTimeline,
    calculateTrendData,
    getAgeStageLabel
} from '@/types/chronology.types';

interface HealthTimelineProps {
    timeline: LifelongTimeline;
    onEventSelect?: (event: TimelineEvent) => void;
}

export default function HealthTimeline({ timeline, onEventSelect }: HealthTimelineProps) {
    const [selectedAge, setSelectedAge] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'timeline' | 'graph'>('timeline');

    const currentAge = useMemo(() => {
        const dob = new Date(timeline.dateOfBirth);
        const now = new Date();
        return Math.floor((now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    }, [timeline.dateOfBirth]);

    const trendData = useMemo(() => calculateTrendData(timeline.events), [timeline.events]);

    // Sort events by date
    const sortedEvents = [...timeline.events].sort((a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );

    // Get event at selected age
    const eventAtAge = selectedAge !== null
        ? sortedEvents.find(e => Math.abs(e.ageAtEvent - selectedAge) < 1)
        : null;

    // Calculate trends
    const dmftTrend = trendData.dmft.length >= 2
        ? trendData.dmft[trendData.dmft.length - 1] - trendData.dmft[0]
        : 0;

    const ohisTrend = trendData.ohis.length >= 2
        ? trendData.ohis[trendData.ohis.length - 1] - trendData.ohis[0]
        : 0;

    const getEventColor = (type: TimelineEvent['eventType']) => {
        switch (type) {
            case 'checkup': return 'bg-blue-500';
            case 'treatment': return 'bg-green-500';
            case 'surgery': return 'bg-purple-500';
            case 'emergency': return 'bg-red-500';
        }
    };

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        Life-Long Dental Health Timeline
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {timeline.events.length} visits • Current age: {currentAge} years
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant={viewMode === 'timeline' ? 'default' : 'outline'}
                        onClick={() => setViewMode('timeline')}
                    >
                        <CalendarDays className="w-4 h-4 mr-1" />
                        Timeline
                    </Button>
                    <Button
                        size="sm"
                        variant={viewMode === 'graph' ? 'default' : 'outline'}
                        onClick={() => setViewMode('graph')}
                    >
                        <Activity className="w-4 h-4 mr-1" />
                        Trends
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`p-3 rounded-lg border ${dmftTrend > 0 ? 'bg-red-50 dark:bg-red-950/20 border-red-200' :
                        'bg-green-50 dark:bg-green-950/20 border-green-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">DMFT Trend</div>
                        {dmftTrend > 0
                            ? <TrendingUp className="w-4 h-4 text-red-500" />
                            : <TrendingDown className="w-4 h-4 text-green-500" />
                        }
                    </div>
                    <div className="text-2xl font-bold">
                        {trendData.dmft[trendData.dmft.length - 1] || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {dmftTrend > 0 ? `+${dmftTrend} since first visit` : dmftTrend === 0 ? 'Stable' : `${dmftTrend} (improved)`}
                    </div>
                </div>

                <div className={`p-3 rounded-lg border ${ohisTrend > 0 ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200' :
                        'bg-green-50 dark:bg-green-950/20 border-green-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">OHI-S Trend</div>
                        {ohisTrend > 0
                            ? <TrendingUp className="w-4 h-4 text-orange-500" />
                            : <TrendingDown className="w-4 h-4 text-green-500" />
                        }
                    </div>
                    <div className="text-2xl font-bold">
                        {trendData.ohis[trendData.ohis.length - 1]?.toFixed(1) || '-'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {ohisTrend > 0 ? 'Hygiene worsening' : ohisTrend === 0 ? 'Stable' : 'Hygiene improved'}
                    </div>
                </div>
            </div>

            {viewMode === 'timeline' ? (
                <>
                    {/* Age Slider */}
                    <div className="mb-4">
                        <label className="text-sm font-medium mb-2 block">
                            Scroll through patient's life: {selectedAge ?? currentAge} years
                        </label>
                        <Slider
                            value={[selectedAge ?? currentAge]}
                            onValueChange={([v]) => setSelectedAge(v)}
                            min={0}
                            max={Math.max(currentAge + 5, 80)}
                            step={1}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Birth</span>
                            <span>Current ({currentAge}y)</span>
                            <span>Future</span>
                        </div>
                    </div>

                    {/* Age Stage Indicator */}
                    <div className="mb-4 p-2 bg-muted/50 rounded text-center">
                        <Badge variant="outline">
                            {getAgeStageLabel((selectedAge ?? currentAge) * 12)}
                        </Badge>
                    </div>

                    {/* Timeline Events */}
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                        <div className="space-y-4">
                            {sortedEvents.map((event, idx) => (
                                <div
                                    key={event.id}
                                    className={`relative pl-10 cursor-pointer transition-all hover:bg-muted/30 p-2 rounded ${eventAtAge?.id === event.id ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                                        }`}
                                    onClick={() => onEventSelect?.(event)}
                                >
                                    {/* Node */}
                                    <div className={`absolute left-2 top-3 w-5 h-5 rounded-full border-2 border-white ${getEventColor(event.eventType)}`} />

                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-medium flex items-center gap-2">
                                                Age {event.ageAtEvent}
                                                <Badge variant="outline" className="text-xs">
                                                    {event.eventType}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(event.eventDate).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm mt-1">
                                                {event.snapshot.notes}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm">
                                                DMFT: <strong>{event.snapshot.dmft.total}</strong>
                                            </div>
                                            {event.snapshot.ohis && (
                                                <div className="text-sm">
                                                    OHI-S: <strong>{event.snapshot.ohis.ohisTotal}</strong>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                /* Graph View */
                <div className="space-y-4">
                    {/* DMFT Graph (simplified bar visualization) */}
                    <div>
                        <h4 className="font-medium mb-2">DMFT Over Time</h4>
                        <div className="flex items-end gap-1 h-32 border-b border-l p-2">
                            {trendData.dmft.map((value, idx) => (
                                <div
                                    key={idx}
                                    className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                                    style={{ height: `${Math.min(value * 5, 100)}%` }}
                                    title={`DMFT: ${value}`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            {trendData.dates.map((date, idx) => (
                                <span key={idx}>{new Date(date).getFullYear()}</span>
                            ))}
                        </div>
                    </div>

                    {/* OHI-S Graph */}
                    <div>
                        <h4 className="font-medium mb-2">OHI-S Over Time</h4>
                        <div className="flex items-end gap-1 h-32 border-b border-l p-2">
                            {trendData.ohis.map((value, idx) => (
                                <div
                                    key={idx}
                                    className={`flex-1 rounded-t transition-all ${value <= 1.2 ? 'bg-green-500 hover:bg-green-600' :
                                            value <= 3 ? 'bg-yellow-500 hover:bg-yellow-600' :
                                                'bg-red-500 hover:bg-red-600'
                                        }`}
                                    style={{ height: `${Math.min(value * 16, 100)}%` }}
                                    title={`OHI-S: ${value.toFixed(1)}`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            {trendData.dates.map((date, idx) => (
                                <span key={idx}>{new Date(date).getFullYear()}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Patient Insight */}
            {sortedEvents.length >= 2 && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-sm">
                    <strong>Health Scorecard insight:</strong>
                    {dmftTrend > 0 && ohisTrend > 0 && (
                        <p className="mt-1 text-blue-700 dark:text-blue-300">
                            "At age {sortedEvents[0]?.ageAtEvent}, your DMFT was {trendData.dmft[0]}.
                            Now at age {currentAge}, it is {trendData.dmft[trendData.dmft.length - 1]}.
                            This correlates with declining oral hygiene (OHI-S: {trendData.ohis[0]?.toFixed(1)} → {trendData.ohis[trendData.ohis.length - 1]?.toFixed(1)})."
                        </p>
                    )}
                    {dmftTrend <= 0 && (
                        <p className="mt-1 text-green-700 dark:text-green-300">
                            "Great progress! Your DMFT has remained stable or improved over time."
                        </p>
                    )}
                </div>
            )}
        </Card>
    );
}
