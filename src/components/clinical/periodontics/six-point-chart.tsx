'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Droplet } from 'lucide-react';
import { toast } from 'sonner';
import {
    ToothProbingData,
    ProbingSite,
    SITE_ORDER,
    TOOTH_ORDER_UPPER,
    TOOTH_ORDER_LOWER,
    getProbingDepthColor,
    createEmptyToothData,
    calculateChartSummary,
    generatePerioAlerts,
    PeriodontalAlert
} from '@/types/periodontal.types';

interface SixPointChartProps {
    patientId: string;
    initialData?: ToothProbingData[];
    onChartChange?: (teeth: ToothProbingData[]) => void;
    onAlertsGenerated?: (alerts: PeriodontalAlert[]) => void;
}

export default function SixPointChart({
    patientId,
    initialData,
    onChartChange,
    onAlertsGenerated
}: SixPointChartProps) {
    // Initialize all 32 teeth
    const initializeTeeth = (): ToothProbingData[] => {
        if (initialData && initialData.length > 0) return initialData;

        const allTeeth = [...TOOTH_ORDER_UPPER, ...TOOTH_ORDER_LOWER];
        return allTeeth.map(num => createEmptyToothData(num));
    };

    const [teeth, setTeeth] = useState<ToothProbingData[]>(initializeTeeth);
    const [selectedTooth, setSelectedTooth] = useState<number>(TOOTH_ORDER_UPPER[0]);
    const [focusedSite, setFocusedSite] = useState<string>('buccalMesial');
    const [isRecording, setIsRecording] = useState(false);

    const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

    // Calculate summary metrics
    const summary = calculateChartSummary(teeth);
    const alerts = generatePerioAlerts(teeth);

    useEffect(() => {
        onChartChange?.(teeth);
        onAlertsGenerated?.(alerts);
    }, [teeth]);

    // Get the current tooth data
    const currentTooth = teeth.find(t => t.toothNumber === selectedTooth) || createEmptyToothData(selectedTooth);

    // Snake path navigation: determines next site/tooth
    const getNextPosition = useCallback((currentSite: string, currentToothNum: number): { tooth: number; site: string } | null => {
        const siteIndex = SITE_ORDER.indexOf(currentSite as any);
        const allTeeth = [...TOOTH_ORDER_UPPER, ...TOOTH_ORDER_LOWER];
        const toothIndex = allTeeth.indexOf(currentToothNum);

        if (siteIndex < SITE_ORDER.length - 1) {
            // Move to next site on same tooth
            return { tooth: currentToothNum, site: SITE_ORDER[siteIndex + 1] };
        } else if (toothIndex < allTeeth.length - 1) {
            // Move to first site of next tooth
            return { tooth: allTeeth[toothIndex + 1], site: SITE_ORDER[0] };
        }
        return null; // End of chart
    }, []);

    // Handle probing depth input
    const handleDepthInput = (site: string, value: string) => {
        const depth = parseInt(value) || 0;
        if (depth > 15) return; // Max reasonable PD

        updateSiteData(selectedTooth, site, { depth });

        // Auto-advance after input
        if (value.length > 0 && isRecording) {
            const next = getNextPosition(site, selectedTooth);
            if (next) {
                setTimeout(() => {
                    setSelectedTooth(next.tooth);
                    setFocusedSite(next.site);
                    const inputKey = `${next.tooth}-${next.site}`;
                    inputRefs.current.get(inputKey)?.focus();
                }, 50);
            } else {
                setIsRecording(false);
                toast.success('Periodontal chart completed!');
            }
        }
    };

    // Toggle BOP for a site
    const toggleBOP = (site: string) => {
        const toothData = teeth.find(t => t.toothNumber === selectedTooth);
        if (!toothData) return;

        const currentBOP = (toothData[site as keyof ToothProbingData] as ProbingSite).bop;
        updateSiteData(selectedTooth, site, { bop: !currentBOP });
    };

    // Update site data
    const updateSiteData = (toothNum: number, site: string, updates: Partial<ProbingSite>) => {
        setTeeth(prev => prev.map(tooth => {
            if (tooth.toothNumber !== toothNum) return tooth;

            const currentSite = tooth[site as keyof ToothProbingData] as ProbingSite;
            return {
                ...tooth,
                [site]: { ...currentSite, ...updates }
            };
        }));
    };

    // Update tooth-level data (mobility, furcation)
    const updateToothData = (toothNum: number, field: string, value: any) => {
        setTeeth(prev => prev.map(tooth => {
            if (tooth.toothNumber !== toothNum) return tooth;
            return { ...tooth, [field]: value };
        }));
    };

    // Start rapid entry mode
    const startRecording = () => {
        setIsRecording(true);
        setFocusedSite(SITE_ORDER[0]);
        const inputKey = `${selectedTooth}-${SITE_ORDER[0]}`;
        inputRefs.current.get(inputKey)?.focus();
        toast.info('Auto-advance mode ON - Enter depths rapidly');
    };

    // Render a single probing input
    const renderProbingInput = (site: string, label: string) => {
        const toothData = teeth.find(t => t.toothNumber === selectedTooth);
        const siteData = toothData?.[site as keyof ToothProbingData] as ProbingSite | undefined;
        const depth = siteData?.depth || 0;
        const bop = siteData?.bop || false;
        const inputKey = `${selectedTooth}-${site}`;

        return (
            <div key={site} className="flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{label}</span>
                <div className="relative">
                    <input
                        ref={(el) => {
                            if (el) inputRefs.current.set(inputKey, el);
                        }}
                        type="number"
                        min="0"
                        max="15"
                        value={depth || ''}
                        onChange={(e) => handleDepthInput(site, e.target.value)}
                        onFocus={() => setFocusedSite(site)}
                        className="w-12 h-12 text-center text-lg font-bold rounded border-2 transition-colors"
                        style={{
                            backgroundColor: depth > 0 ? getProbingDepthColor(depth) + '20' : 'transparent',
                            borderColor: focusedSite === site ? '#3b82f6' : getProbingDepthColor(depth),
                            color: depth >= 5 ? '#ef4444' : depth === 4 ? '#ca8a04' : '#15803d'
                        }}
                    />
                    {bop && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" title="BOP" />
                    )}
                </div>
                <button
                    onClick={() => toggleBOP(site)}
                    className={`text-xs px-2 py-0.5 rounded transition-colors ${bop ? 'bg-red-500 text-white' : 'bg-muted hover:bg-muted/80'
                        }`}
                    title="Toggle Bleeding on Probing"
                >
                    <Droplet className="w-3 h-3" />
                </button>
            </div>
        );
    };

    // Render tooth selector
    const renderToothSelector = (toothNumbers: number[], label: string) => (
        <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <div className="flex flex-wrap gap-1">
                {toothNumbers.map(num => {
                    const toothData = teeth.find(t => t.toothNumber === num);
                    const hasData = toothData && [
                        toothData.buccalMesial, toothData.buccalMid, toothData.buccalDistal,
                        toothData.lingualMesial, toothData.lingualMid, toothData.lingualDistal
                    ].some(s => s.depth > 0);
                    const hasCritical = toothData && [
                        toothData.buccalMesial, toothData.buccalMid, toothData.buccalDistal,
                        toothData.lingualMesial, toothData.lingualMid, toothData.lingualDistal
                    ].some(s => s.depth >= 5);

                    return (
                        <button
                            key={num}
                            onClick={() => setSelectedTooth(num)}
                            className={`w-8 h-8 text-xs font-medium rounded transition-colors ${selectedTooth === num
                                    ? 'bg-blue-500 text-white'
                                    : hasCritical
                                        ? 'bg-red-100 text-red-700 border border-red-300'
                                        : hasData
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-muted hover:bg-muted/80'
                                }`}
                        >
                            {num}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Header with Summary */}
            <Card className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">6-Point Periodontal Chart</h3>
                        <p className="text-sm text-muted-foreground">High-velocity probing with auto-advance</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{summary.totalSites}</div>
                            <div className="text-xs text-muted-foreground">Sites Probed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{summary.sitesWithPD4plus}</div>
                            <div className="text-xs text-muted-foreground">PD ≥ 4mm</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{summary.sitesWithPD5plus}</div>
                            <div className="text-xs text-muted-foreground">PD ≥ 5mm</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-2xl font-bold ${summary.bopPercentage > 10 ? 'text-red-600' : 'text-green-600'}`}>
                                {summary.bopPercentage}%
                            </div>
                            <div className="text-xs text-muted-foreground">BOP</div>
                        </div>
                    </div>
                </div>

                {/* Quick Start */}
                <div className="mt-4 flex gap-2">
                    <Button onClick={startRecording} variant={isRecording ? 'default' : 'outline'}>
                        {isRecording ? '🔴 Recording...' : '▶ Start Auto-Advance'}
                    </Button>
                    {isRecording && (
                        <Button onClick={() => setIsRecording(false)} variant="secondary">
                            ⏹ Stop
                        </Button>
                    )}
                </div>
            </Card>

            {/* Tooth Selector */}
            <Card className="p-4">
                {renderToothSelector(TOOTH_ORDER_UPPER, 'Maxillary (Upper)')}
                <div className="my-3 border-t" />
                {renderToothSelector(TOOTH_ORDER_LOWER, 'Mandibular (Lower)')}
            </Card>

            {/* Active Tooth Probing Panel */}
            <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
                            {selectedTooth}
                        </div>
                        <div>
                            <h4 className="font-semibold">Tooth #{selectedTooth}</h4>
                            <p className="text-sm text-muted-foreground">
                                {TOOTH_ORDER_UPPER.includes(selectedTooth) ? 'Maxillary' : 'Mandibular'}
                            </p>
                        </div>
                    </div>

                    {/* Mobility & Furcation */}
                    <div className="flex gap-4">
                        <div>
                            <label className="text-xs font-medium block mb-1">Mobility</label>
                            <select
                                value={currentTooth.mobility}
                                onChange={(e) => updateToothData(selectedTooth, 'mobility', parseInt(e.target.value))}
                                className="px-2 py-1 border rounded text-sm"
                            >
                                <option value={0}>0 - Normal</option>
                                <option value={1}>I - &lt;1mm horizontal</option>
                                <option value={2}>II - &gt;1mm horizontal</option>
                                <option value={3}>III - Vertical movement</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium block mb-1">Furcation</label>
                            <select
                                value={currentTooth.furcation}
                                onChange={(e) => updateToothData(selectedTooth, 'furcation', parseInt(e.target.value))}
                                className="px-2 py-1 border rounded text-sm"
                            >
                                <option value={0}>0 - None</option>
                                <option value={1}>I - Incipient</option>
                                <option value={2}>II - Partial</option>
                                <option value={3}>III - Through-and-through</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 6-Point Grid */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Buccal Row */}
                    <div>
                        <h5 className="text-sm font-medium mb-2 text-center">Buccal</h5>
                        <div className="flex justify-center gap-4">
                            {renderProbingInput('buccalMesial', 'M')}
                            {renderProbingInput('buccalMid', 'Mid')}
                            {renderProbingInput('buccalDistal', 'D')}
                        </div>
                    </div>

                    {/* Lingual Row */}
                    <div>
                        <h5 className="text-sm font-medium mb-2 text-center">Lingual/Palatal</h5>
                        <div className="flex justify-center gap-4">
                            {renderProbingInput('lingualMesial', 'M')}
                            {renderProbingInput('lingualMid', 'Mid')}
                            {renderProbingInput('lingualDistal', 'D')}
                        </div>
                    </div>
                </div>

                {/* Color Legend */}
                <div className="mt-4 pt-4 border-t flex items-center justify-center gap-6 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }} />
                        <span>1-3mm (Healthy)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }} />
                        <span>4mm (Gingivitis)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }} />
                        <span>5+mm (Periodontitis)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>BOP</span>
                    </div>
                </div>
            </Card>

            {/* Alerts Panel */}
            {alerts.length > 0 && (
                <Card className="p-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Periodontal Alerts ({alerts.length})
                    </h4>
                    <div className="space-y-2">
                        {alerts.map((alert, idx) => (
                            <div key={idx} className={`p-2 rounded text-sm ${alert.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
                                }`}>
                                <div className="font-medium">{alert.message}</div>
                                <div className="text-xs text-muted-foreground">→ {alert.suggestedAction}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* BOP Warning */}
            {summary.bopPercentage > 10 && (
                <Card className="p-3 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
                    <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-medium">Active Disease: BOP &gt; 10% indicates active periodontal inflammation</span>
                    </div>
                </Card>
            )}
        </div>
    );
}
