'use client';

import { useState, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Hand, Fingerprint, ArrowUp, ArrowDown,
    MousePointer2, Paintbrush, Vibrate
} from 'lucide-react';
import { ToothState } from '@/lib/shadow-indexer';

// =============================================================================
// TYPES
// =============================================================================

interface GestureConfig {
    swipeThreshold: number;
    longPressDelay: number;
    doubleTapDelay: number;
    hapticEnabled: boolean;
}

interface ToothGestureEvent {
    toothNumber: number;
    gestureType: 'tap' | 'double_tap' | 'swipe_up' | 'swipe_down' | 'long_press' | 'paint';
    timestamp: number;
}

interface GestureToothMapProps {
    toothStates: Record<number, ToothState>;
    onToothStateChange: (toothNumber: number, newState: ToothState) => void;
    onGestureDetected?: (event: ToothGestureEvent) => void;
    isPaintMode?: boolean;
    config?: Partial<GestureConfig>;
}

const DEFAULT_CONFIG: GestureConfig = {
    swipeThreshold: 50,
    longPressDelay: 500,
    doubleTapDelay: 300,
    hapticEnabled: true
};

// Gesture → State mapping
const GESTURE_ACTIONS: Record<string, ToothState> = {
    'swipe_up': 'missing',
    'swipe_down': 'filled',
    'double_tap': 'caries',
    'tap': 'healthy',
    'long_press': 'rct'
};

// =============================================================================
// HAPTIC FEEDBACK
// =============================================================================

function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'medium') {
    if ('vibrate' in navigator) {
        const patterns = {
            light: [10],
            medium: [25],
            heavy: [50, 30, 50]
        };
        navigator.vibrate(patterns[type]);
    }
}

// =============================================================================
// GESTURE HOOK
// =============================================================================

function useGestureDetection(config: GestureConfig) {
    const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
    const lastTap = useRef<number>(0);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const detectGesture = useCallback((
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        duration: number
    ): ToothGestureEvent['gestureType'] => {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // Swipe detection (vertical swipes only for dental map)
        if (absY > config.swipeThreshold && absY > absX) {
            return deltaY < 0 ? 'swipe_up' : 'swipe_down';
        }

        // Double tap detection
        const now = Date.now();
        if (now - lastTap.current < config.doubleTapDelay) {
            lastTap.current = 0;
            return 'double_tap';
        }
        lastTap.current = now;

        return 'tap';
    }, [config]);

    const handleTouchStart = useCallback((
        e: React.TouchEvent | React.MouseEvent,
        toothNumber: number,
        onLongPress: (tooth: number) => void
    ) => {
        const point = 'touches' in e ? e.touches[0] : e;
        touchStart.current = {
            x: point.clientX,
            y: point.clientY,
            time: Date.now()
        };

        // Long press timer
        longPressTimer.current = setTimeout(() => {
            if (config.hapticEnabled) triggerHaptic('heavy');
            onLongPress(toothNumber);
        }, config.longPressDelay);
    }, [config]);

    const handleTouchEnd = useCallback((
        e: React.TouchEvent | React.MouseEvent,
        toothNumber: number,
        onGesture: (tooth: number, gesture: ToothGestureEvent['gestureType']) => void
    ) => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }

        if (!touchStart.current) return;

        const point = 'changedTouches' in e ? e.changedTouches[0] : e;
        const duration = Date.now() - touchStart.current.time;

        // If long press already triggered, don't process
        if (duration >= config.longPressDelay) return;

        const gesture = detectGesture(
            touchStart.current.x,
            touchStart.current.y,
            point.clientX,
            point.clientY,
            duration
        );

        if (config.hapticEnabled) {
            triggerHaptic(gesture === 'double_tap' ? 'medium' : 'light');
        }

        onGesture(toothNumber, gesture);
        touchStart.current = null;
    }, [config, detectGesture]);

    const cancelGesture = useCallback(() => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        touchStart.current = null;
    }, []);

    return { handleTouchStart, handleTouchEnd, cancelGesture };
}

// =============================================================================
// TOOTH COMPONENT WITH GESTURES
// =============================================================================

interface GestureToothProps {
    toothNumber: number;
    state: ToothState;
    quadrant: 1 | 2 | 3 | 4;
    onStateChange: (tooth: number, state: ToothState) => void;
    onGesture: (event: ToothGestureEvent) => void;
    config: GestureConfig;
    isPaintMode: boolean;
}

function GestureTooth({
    toothNumber,
    state,
    quadrant,
    onStateChange,
    onGesture,
    config,
    isPaintMode
}: GestureToothProps) {
    const [isPressed, setIsPressed] = useState(false);
    const [animation, setAnimation] = useState<string | null>(null);
    const { handleTouchStart, handleTouchEnd, cancelGesture } = useGestureDetection(config);

    const handleGesture = (tooth: number, gesture: ToothGestureEvent['gestureType']) => {
        const newState = GESTURE_ACTIONS[gesture] || 'healthy';
        onStateChange(tooth, newState);
        onGesture({
            toothNumber: tooth,
            gestureType: gesture,
            timestamp: Date.now()
        });

        // Trigger animation
        setAnimation(gesture);
        setTimeout(() => setAnimation(null), 300);
    };

    const handleLongPress = (tooth: number) => {
        onGesture({
            toothNumber: tooth,
            gestureType: 'long_press',
            timestamp: Date.now()
        });
        onStateChange(tooth, 'rct');
        setAnimation('long_press');
        setTimeout(() => setAnimation(null), 300);
    };

    // Paint mode: just touching marks it
    const handlePaintEnter = () => {
        if (isPaintMode) {
            onStateChange(toothNumber, 'caries');
            if (config.hapticEnabled) triggerHaptic('light');
        }
    };

    const getToothColor = () => {
        switch (state) {
            case 'healthy': return 'fill-white stroke-gray-400';
            case 'caries': return 'fill-red-400 stroke-red-600';
            case 'filled': return 'fill-blue-400 stroke-blue-600';
            case 'missing': return 'fill-gray-200 stroke-gray-400 opacity-30';
            case 'rct': return 'fill-purple-400 stroke-purple-600';
            case 'crowned': return 'fill-yellow-400 stroke-yellow-600';
            case 'extracted': return 'fill-gray-100 stroke-gray-300 opacity-20';
            default: return 'fill-white stroke-gray-400';
        }
    };

    const getAnimationClass = () => {
        switch (animation) {
            case 'swipe_up': return 'animate-bounce -translate-y-2';
            case 'swipe_down': return 'animate-bounce translate-y-2';
            case 'double_tap': return 'animate-ping';
            case 'long_press': return 'animate-pulse scale-110';
            default: return '';
        }
    };

    // Simplified tooth shape based on quadrant position
    const isUpper = quadrant <= 2;
    const toothIndex = toothNumber % 10;

    return (
        <g
            className={`cursor-pointer transition-all duration-200 ${getAnimationClass()}`}
            onMouseDown={(e) => {
                setIsPressed(true);
                handleTouchStart(e, toothNumber, handleLongPress);
            }}
            onMouseUp={(e) => {
                setIsPressed(false);
                handleTouchEnd(e, toothNumber, handleGesture);
            }}
            onMouseLeave={() => {
                setIsPressed(false);
                cancelGesture();
            }}
            onMouseEnter={handlePaintEnter}
            onTouchStart={(e) => {
                setIsPressed(true);
                handleTouchStart(e, toothNumber, handleLongPress);
            }}
            onTouchEnd={(e) => {
                setIsPressed(false);
                handleTouchEnd(e, toothNumber, handleGesture);
            }}
            onTouchCancel={() => {
                setIsPressed(false);
                cancelGesture();
            }}
        >
            {/* Tooth body */}
            <rect
                x={0}
                y={0}
                width={24}
                height={isUpper ? 32 : 28}
                rx={4}
                className={`${getToothColor()} ${isPressed ? 'opacity-70' : ''} transition-all`}
                strokeWidth={2}
            />
            {/* Tooth number */}
            <text
                x={12}
                y={isUpper ? 20 : 16}
                textAnchor="middle"
                className="text-[8px] fill-gray-600 font-mono select-none pointer-events-none"
            >
                {toothNumber}
            </text>
            {/* Root indicator for RCT */}
            {state === 'rct' && (
                <line
                    x1={12}
                    y1={isUpper ? 28 : 4}
                    x2={12}
                    y2={isUpper ? 40 : -8}
                    stroke="#7c3aed"
                    strokeWidth={2}
                    strokeDasharray="3,2"
                />
            )}
        </g>
    );
}

// =============================================================================
// MAIN GESTURE TOOTH MAP
// =============================================================================

export default function GestureToothMap({
    toothStates,
    onToothStateChange,
    onGestureDetected,
    isPaintMode = false,
    config: userConfig
}: GestureToothMapProps) {
    const config = { ...DEFAULT_CONFIG, ...userConfig };
    const [lastGesture, setLastGesture] = useState<string | null>(null);

    const handleGesture = (event: ToothGestureEvent) => {
        setLastGesture(`${event.gestureType} on #${event.toothNumber}`);
        onGestureDetected?.(event);

        // Clear feedback after 2 seconds
        setTimeout(() => setLastGesture(null), 2000);
    };

    // Generate teeth for all quadrants
    const quadrants = [
        { id: 1, teeth: [18, 17, 16, 15, 14, 13, 12, 11], label: 'Upper Right' },
        { id: 2, teeth: [21, 22, 23, 24, 25, 26, 27, 28], label: 'Upper Left' },
        { id: 4, teeth: [48, 47, 46, 45, 44, 43, 42, 41], label: 'Lower Right' },
        { id: 3, teeth: [31, 32, 33, 34, 35, 36, 37, 38], label: 'Lower Left' }
    ];

    return (
        <Card className="p-4">
            {/* Header with gesture legend */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Hand className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">Gesture Tooth Map</h3>
                    {isPaintMode && (
                        <Badge className="bg-orange-500 text-white">
                            <Paintbrush className="w-3 h-3 mr-1" />
                            Paint Mode
                        </Badge>
                    )}
                </div>
                {lastGesture && (
                    <Badge variant="outline" className="animate-pulse">
                        <Vibrate className="w-3 h-3 mr-1" />
                        {lastGesture}
                    </Badge>
                )}
            </div>

            {/* Gesture Legend */}
            <div className="flex gap-4 text-xs text-muted-foreground mb-4 justify-center">
                <span className="flex items-center gap-1">
                    <ArrowUp className="w-3 h-3" /> Swipe Up = Missing
                </span>
                <span className="flex items-center gap-1">
                    <ArrowDown className="w-3 h-3" /> Swipe Down = Filled
                </span>
                <span className="flex items-center gap-1">
                    <MousePointer2 className="w-3 h-3" /> Double Tap = Caries
                </span>
                <span className="flex items-center gap-1">
                    <Fingerprint className="w-3 h-3" /> Long Press = RCT
                </span>
            </div>

            {/* SVG Tooth Map */}
            <svg
                viewBox="0 0 480 200"
                className="w-full h-auto"
                style={{ touchAction: 'none' }}
            >
                {/* Upper arch */}
                <g transform="translate(20, 10)">
                    {quadrants[0].teeth.map((tooth, i) => (
                        <g key={tooth} transform={`translate(${i * 28}, 0)`}>
                            <GestureTooth
                                toothNumber={tooth}
                                state={toothStates[tooth] || 'healthy'}
                                quadrant={1}
                                onStateChange={onToothStateChange}
                                onGesture={handleGesture}
                                config={config}
                                isPaintMode={isPaintMode}
                            />
                        </g>
                    ))}
                </g>
                <g transform="translate(252, 10)">
                    {quadrants[1].teeth.map((tooth, i) => (
                        <g key={tooth} transform={`translate(${i * 28}, 0)`}>
                            <GestureTooth
                                toothNumber={tooth}
                                state={toothStates[tooth] || 'healthy'}
                                quadrant={2}
                                onStateChange={onToothStateChange}
                                onGesture={handleGesture}
                                config={config}
                                isPaintMode={isPaintMode}
                            />
                        </g>
                    ))}
                </g>

                {/* Midline */}
                <line x1="240" y1="5" x2="240" y2="195" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,4" />

                {/* Lower arch */}
                <g transform="translate(20, 120)">
                    {quadrants[2].teeth.map((tooth, i) => (
                        <g key={tooth} transform={`translate(${i * 28}, 0)`}>
                            <GestureTooth
                                toothNumber={tooth}
                                state={toothStates[tooth] || 'healthy'}
                                quadrant={4}
                                onStateChange={onToothStateChange}
                                onGesture={handleGesture}
                                config={config}
                                isPaintMode={isPaintMode}
                            />
                        </g>
                    ))}
                </g>
                <g transform="translate(252, 120)">
                    {quadrants[3].teeth.map((tooth, i) => (
                        <g key={tooth} transform={`translate(${i * 28}, 0)`}>
                            <GestureTooth
                                toothNumber={tooth}
                                state={toothStates[tooth] || 'healthy'}
                                quadrant={3}
                                onStateChange={onToothStateChange}
                                onGesture={handleGesture}
                                config={config}
                                isPaintMode={isPaintMode}
                            />
                        </g>
                    ))}
                </g>

                {/* Quadrant labels */}
                <text x="120" y="55" textAnchor="middle" className="text-[10px] fill-gray-400">Q1</text>
                <text x="360" y="55" textAnchor="middle" className="text-[10px] fill-gray-400">Q2</text>
                <text x="120" y="160" textAnchor="middle" className="text-[10px] fill-gray-400">Q4</text>
                <text x="360" y="160" textAnchor="middle" className="text-[10px] fill-gray-400">Q3</text>
            </svg>

            {/* State Legend */}
            <div className="flex gap-3 justify-center mt-4 flex-wrap text-xs">
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-white border border-gray-400" /> Healthy
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-red-400" /> Caries
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-blue-400" /> Filled
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gray-200 opacity-50" /> Missing
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-purple-400" /> RCT
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-yellow-400" /> Crown
                </span>
            </div>
        </Card>
    );
}
