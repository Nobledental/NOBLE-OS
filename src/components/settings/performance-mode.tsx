'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Zap, Battery, Gauge, Moon, Sun,
    Sparkles, Monitor, Smartphone
} from 'lucide-react';

// =============================================================================
// PERFORMANCE CONTEXT
// =============================================================================

export type PerformanceMode = 'auto' | 'high' | 'low';

interface PerformanceSettings {
    mode: PerformanceMode;
    reduceShadows: boolean;
    reduceBlur: boolean;
    reduceAnimations: boolean;
    reduceBorderRadius: boolean;
    prefersReducedMotion: boolean;
    deviceMemory: number | null;
    isLowEndDevice: boolean;
}

interface PerformanceContextType {
    settings: PerformanceSettings;
    updateSettings: (updates: Partial<PerformanceSettings>) => void;
    setMode: (mode: PerformanceMode) => void;
    getCSSVariables: () => Record<string, string>;
}

const defaultSettings: PerformanceSettings = {
    mode: 'auto',
    reduceShadows: false,
    reduceBlur: false,
    reduceAnimations: false,
    reduceBorderRadius: false,
    prefersReducedMotion: false,
    deviceMemory: null,
    isLowEndDevice: false
};

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export function usePerformance() {
    const context = useContext(PerformanceContext);
    if (!context) {
        return {
            settings: defaultSettings,
            updateSettings: () => { },
            setMode: () => { },
            getCSSVariables: () => ({})
        };
    }
    return context;
}

// =============================================================================
// PERFORMANCE PROVIDER
// =============================================================================

interface PerformanceProviderProps {
    children: React.ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
    const [settings, setSettings] = useState<PerformanceSettings>(defaultSettings);

    // Detect device capabilities on mount
    useEffect(() => {
        const detectDevice = () => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            // Device memory detection (Chrome only)
            const deviceMemory = (navigator as any).deviceMemory || null;

            // Connection speed detection
            const connection = (navigator as any).connection;
            const isSlowConnection = connection?.effectiveType === '2g' ||
                connection?.effectiveType === 'slow-2g';

            // Low-end device detection
            const isLowEndDevice =
                (deviceMemory !== null && deviceMemory < 4) ||
                isSlowConnection ||
                prefersReducedMotion;

            setSettings(prev => ({
                ...prev,
                prefersReducedMotion,
                deviceMemory,
                isLowEndDevice,
                // Auto-enable optimizations for low-end devices
                ...(isLowEndDevice ? {
                    reduceShadows: true,
                    reduceBlur: true,
                    reduceAnimations: true
                } : {})
            }));
        };

        detectDevice();

        // Listen for reduced motion preference changes
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', detectDevice);

        return () => mediaQuery.removeEventListener('change', detectDevice);
    }, []);

    // Apply CSS variables when settings change
    useEffect(() => {
        const root = document.documentElement;
        const vars = getCSSVariables();

        Object.entries(vars).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

        // Add/remove performance class
        if (settings.mode === 'low' || settings.isLowEndDevice) {
            root.classList.add('performance-mode-low');
        } else {
            root.classList.remove('performance-mode-low');
        }
    }, [settings]);

    const updateSettings = (updates: Partial<PerformanceSettings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    };

    const setMode = (mode: PerformanceMode) => {
        const isLow = mode === 'low';
        setSettings(prev => ({
            ...prev,
            mode,
            reduceShadows: isLow,
            reduceBlur: isLow,
            reduceAnimations: isLow,
            reduceBorderRadius: isLow
        }));
    };

    const getCSSVariables = (): Record<string, string> => {
        const isLow = settings.mode === 'low' ||
            (settings.mode === 'auto' && settings.isLowEndDevice);

        return {
            '--shadow-sm': isLow || settings.reduceShadows ? 'none' : '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            '--shadow-md': isLow || settings.reduceShadows ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            '--shadow-lg': isLow || settings.reduceShadows ? '0 1px 3px 0 rgb(0 0 0 / 0.1)' : '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            '--blur-sm': isLow || settings.reduceBlur ? '0' : '4px',
            '--blur-md': isLow || settings.reduceBlur ? '0' : '12px',
            '--blur-lg': isLow || settings.reduceBlur ? '0' : '24px',
            '--transition-duration': isLow || settings.reduceAnimations ? '0ms' : '150ms',
            '--animation-duration': isLow || settings.reduceAnimations ? '0ms' : '300ms',
            '--border-radius-sm': isLow || settings.reduceBorderRadius ? '2px' : '4px',
            '--border-radius-md': isLow || settings.reduceBorderRadius ? '4px' : '8px',
            '--border-radius-lg': isLow || settings.reduceBorderRadius ? '6px' : '12px'
        };
    };

    return (
        <PerformanceContext.Provider value={{ settings, updateSettings, setMode, getCSSVariables }}>
            {children}
        </PerformanceContext.Provider>
    );
}

// =============================================================================
// PERFORMANCE SETTINGS UI
// =============================================================================

export default function PerformanceSettings() {
    const { settings, updateSettings, setMode } = usePerformance();

    const getModeIcon = () => {
        switch (settings.mode) {
            case 'high': return <Sparkles className="w-5 h-5 text-purple-500" />;
            case 'low': return <Battery className="w-5 h-5 text-green-500" />;
            default: return <Gauge className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <Card className="p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-yellow-500" />
                    <div>
                        <h3 className="font-semibold">Performance Mode</h3>
                        <p className="text-sm text-muted-foreground">
                            Optimize for speed or visual quality
                        </p>
                    </div>
                </div>
                {settings.isLowEndDevice && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                        <Smartphone className="w-3 h-3 mr-1" />
                        Low-End Device Detected
                    </Badge>
                )}
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { mode: 'auto' as const, label: 'Auto', icon: Gauge, desc: 'Detect device' },
                    { mode: 'high' as const, label: 'High Quality', icon: Sparkles, desc: 'All effects' },
                    { mode: 'low' as const, label: 'Low Power', icon: Battery, desc: '60fps smooth' }
                ].map(({ mode, label, icon: Icon, desc }) => (
                    <button
                        key={mode}
                        onClick={() => setMode(mode)}
                        className={`p-3 rounded-lg border text-center transition-all ${settings.mode === mode
                                ? 'bg-blue-50 border-blue-300 dark:bg-blue-950/30'
                                : 'hover:bg-muted'
                            }`}
                    >
                        <Icon className={`w-6 h-6 mx-auto mb-1 ${settings.mode === mode ? 'text-blue-600' : 'text-muted-foreground'
                            }`} />
                        <div className="font-medium text-sm">{label}</div>
                        <div className="text-xs text-muted-foreground">{desc}</div>
                    </button>
                ))}
            </div>

            {/* Individual Toggles */}
            <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground">Fine Controls</h4>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Reduce Shadows</span>
                    </div>
                    <Switch
                        checked={settings.reduceShadows}
                        onCheckedChange={(checked) => updateSettings({ reduceShadows: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Reduce Blur Effects</span>
                    </div>
                    <Switch
                        checked={settings.reduceBlur}
                        onCheckedChange={(checked) => updateSettings({ reduceBlur: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Reduce Animations</span>
                    </div>
                    <Switch
                        checked={settings.reduceAnimations}
                        onCheckedChange={(checked) => updateSettings({ reduceAnimations: checked })}
                    />
                </div>
            </div>

            {/* Device Info */}
            <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                    <Monitor className="w-3 h-3" />
                    <span>
                        Device Memory: {settings.deviceMemory ? `${settings.deviceMemory}GB` : 'Unknown'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span>
                        Reduced Motion: {settings.prefersReducedMotion ? 'Enabled (OS)' : 'Disabled'}
                    </span>
                </div>
            </div>
        </Card>
    );
}

// =============================================================================
// PERFORMANCE CSS (to be added to global.css)
// =============================================================================

export const PERFORMANCE_CSS = `
/* Performance Mode - Low Power */
.performance-mode-low {
  /* Disable expensive effects */
  * {
    box-shadow: none !important;
    text-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
  
  /* Simplify borders */
  *:not(input):not(button) {
    border-radius: 4px !important;
  }
  
  /* Disable gradients */
  [class*="bg-gradient"] {
    background: var(--bg-fallback, inherit) !important;
  }
  
  /* Faster animations */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Optimize SVG rendering */
  svg {
    shape-rendering: optimizeSpeed;
  }
  
  /* Will-change hints for frequent animations */
  .tooth-element {
    will-change: transform, opacity;
    contain: layout style paint;
  }
}

/* High-quality mode specific */
.performance-mode-high {
  /* Enable GPU acceleration for smooth 60fps */
  .animate-element {
    transform: translateZ(0);
    backface-visibility: hidden;
  }
}
`;
