/**
 * Phase 20: Shadow Indexer - Auto-Classification Engine
 * Links SVG Tooth Map events directly to classification indices
 */

import {
    classifyGVBlack,
    classifyKennedy,
    calculateDMFT,
    DMFTData
} from '@/types/clinical-indices.types';

// =============================================================================
// TOOTH STATE TYPES
// =============================================================================

export type ToothState =
    | 'healthy'
    | 'caries'
    | 'filled'
    | 'missing'
    | 'crowned'
    | 'rct'
    | 'implant'
    | 'bridge_abutment'
    | 'bridge_pontic'
    | 'extracted'
    | 'impacted'
    | 'fractured';

export interface ToothMapEvent {
    toothNumber: number;
    previousState: ToothState;
    newState: ToothState;
    surfaces?: string[];
    timestamp: string;
    triggeredBy: 'user' | 'import' | 'sync';
}

export interface ShadowIndexResult {
    dmft: DMFTData;
    kennedyMaxilla?: { classification: string; modifications: number };
    kennedyMandible?: { classification: string; modifications: number };
    missingTeeth: number[];
    filledTeeth: number[];
    decayedTeeth: number[];
    autoSuggestions: AutoSuggestion[];
}

export interface AutoSuggestion {
    type: 'classification' | 'treatment' | 'warning';
    code: string;
    message: string;
    confidence: number;
    relatedTeeth: number[];
}

// =============================================================================
// SHADOW INDEXER ENGINE
// =============================================================================

/**
 * Processes tooth map changes and returns updated indices WITHOUT UI refresh
 */
export function processShadowIndex(
    toothMap: Record<number, ToothState>,
    event?: ToothMapEvent
): ShadowIndexResult {
    // Categorize teeth
    const missingTeeth: number[] = [];
    const filledTeeth: number[] = [];
    const decayedTeeth: number[] = [];

    Object.entries(toothMap).forEach(([num, state]) => {
        const toothNumber = parseInt(num);
        if (['missing', 'extracted'].includes(state)) {
            missingTeeth.push(toothNumber);
        } else if (['filled', 'crowned', 'rct', 'bridge_abutment'].includes(state)) {
            filledTeeth.push(toothNumber);
        } else if (['caries', 'fractured'].includes(state)) {
            decayedTeeth.push(toothNumber);
        }
    });

    // Calculate DMFT
    const dmft = calculateDMFT(decayedTeeth, missingTeeth, filledTeeth);

    // Calculate Kennedy Classification for both arches
    const maxillaryMissing = missingTeeth.filter(t => t >= 11 && t <= 28);
    const mandibularMissing = missingTeeth.filter(t => t >= 31 && t <= 48);

    const kennedyMaxilla = maxillaryMissing.length > 0
        ? classifyKennedy(maxillaryMissing, 'maxilla')
        : undefined;

    const kennedyMandible = mandibularMissing.length > 0
        ? classifyKennedy(mandibularMissing, 'mandible')
        : undefined;

    // Generate auto-suggestions
    const autoSuggestions = generateAutoSuggestions(
        toothMap,
        decayedTeeth,
        missingTeeth,
        event
    );

    return {
        dmft,
        kennedyMaxilla: kennedyMaxilla ? {
            classification: kennedyMaxilla.classification,
            modifications: 0 // Simplified
        } : undefined,
        kennedyMandible: kennedyMandible ? {
            classification: kennedyMandible.classification,
            modifications: 0
        } : undefined,
        missingTeeth,
        filledTeeth,
        decayedTeeth,
        autoSuggestions
    };
}

/**
 * Generates intelligent suggestions based on tooth states
 */
function generateAutoSuggestions(
    toothMap: Record<number, ToothState>,
    decayedTeeth: number[],
    missingTeeth: number[],
    event?: ToothMapEvent
): AutoSuggestion[] {
    const suggestions: AutoSuggestion[] = [];

    // Suggestion: Full mouth rehabilitation if many teeth affected
    const totalAffected = decayedTeeth.length + missingTeeth.length;
    if (totalAffected >= 10) {
        suggestions.push({
            type: 'treatment',
            code: 'FMR-SUGGEST',
            message: 'Consider Full Mouth Rehabilitation plan',
            confidence: 0.85,
            relatedTeeth: [...decayedTeeth, ...missingTeeth]
        });
    }

    // Suggestion: RPD/FPD based on Kennedy
    if (missingTeeth.length >= 3 && missingTeeth.length < 14) {
        suggestions.push({
            type: 'treatment',
            code: 'RPD-SUGGEST',
            message: 'Removable Partial Denture may be indicated',
            confidence: 0.75,
            relatedTeeth: missingTeeth
        });
    }

    // Suggestion: Implant for single missing
    if (missingTeeth.length === 1) {
        suggestions.push({
            type: 'treatment',
            code: 'IMPL-SINGLE',
            message: 'Single implant recommended for isolated missing tooth',
            confidence: 0.90,
            relatedTeeth: missingTeeth
        });
    }

    // Warning: Wisdom teeth impaction check
    const wisdomTeeth = [18, 28, 38, 48];
    wisdomTeeth.forEach(tooth => {
        if (toothMap[tooth] === 'impacted') {
            suggestions.push({
                type: 'warning',
                code: 'IMPACTED-8',
                message: `Impacted third molar #${tooth} - surgical assessment needed`,
                confidence: 0.95,
                relatedTeeth: [tooth]
            });
        }
    });

    // Real-time event suggestion
    if (event?.newState === 'caries' && event.surfaces) {
        const gvBlack = classifyGVBlack(event.toothNumber, event.surfaces as any);
        suggestions.push({
            type: 'classification',
            code: `GVB-${gvBlack.classification}`,
            message: `G.V. Black Class ${gvBlack.classification}: ${gvBlack.description}`,
            confidence: 0.88,
            relatedTeeth: [event.toothNumber]
        });
    }

    return suggestions;
}

// =============================================================================
// BACKGROUND METADATA SYNC
// =============================================================================

export interface MetadataUpdate {
    patientId: string;
    timestamp: string;
    indices: {
        dmft: DMFTData;
        kennedyMaxilla?: string;
        kennedyMandible?: string;
    };
    isDirty: boolean;
}

let metadataCache: MetadataUpdate | null = null;

/**
 * Updates metadata in background without triggering UI refresh
 */
export function updateMetadataBackground(
    patientId: string,
    result: ShadowIndexResult
): MetadataUpdate {
    const update: MetadataUpdate = {
        patientId,
        timestamp: new Date().toISOString(),
        indices: {
            dmft: result.dmft,
            kennedyMaxilla: result.kennedyMaxilla?.classification,
            kennedyMandible: result.kennedyMandible?.classification
        },
        isDirty: true
    };

    metadataCache = update;

    // In production, this would debounce and batch API calls
    console.log('[ShadowIndexer] Metadata updated:', update);

    return update;
}

/**
 * Flushes pending metadata updates to backend
 */
export async function flushMetadataUpdates(): Promise<void> {
    if (!metadataCache || !metadataCache.isDirty) return;

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100));

        metadataCache.isDirty = false;
        console.log('[ShadowIndexer] Metadata flushed to backend');
    } catch (error) {
        console.error('[ShadowIndexer] Flush failed:', error);
    }
}

// =============================================================================
// AUTO-TARIFF ENGINE
// =============================================================================

export interface TariffSuggestion {
    originalCode: string;
    suggestedCode: string;
    originalPrice: number;
    suggestedPrice: number;
    reason: string;
    adjustmentPercent: number;
}

export interface PricingContext {
    procedureCode: string;
    basePrice: number;
    toothNumber?: number;
    canalCount?: number;
    warScore?: number;
    material?: string;
    complexity?: 'simple' | 'moderate' | 'complex';
}

/**
 * Price Suggestion Engine - Auto-adjusts tariffs based on clinical context
 */
export function suggestPrice(context: PricingContext): TariffSuggestion {
    let adjustmentPercent = 0;
    let reason = '';
    let suggestedCode = context.procedureCode;

    // Endodontics: Canal count adjustment
    if (context.procedureCode.startsWith('ENDO') && context.canalCount) {
        if (context.canalCount > 3) {
            adjustmentPercent = 20;
            reason = `Multi-canal (${context.canalCount} canals) - 20% increase`;
            suggestedCode = `${context.procedureCode}-MC`;
        } else if (context.canalCount === 1) {
            adjustmentPercent = -10;
            reason = 'Single canal - 10% discount';
            suggestedCode = `${context.procedureCode}-SC`;
        }
    }

    // Oral Surgery: WAR Score adjustment
    if (context.procedureCode.startsWith('EXO') && context.warScore) {
        if (context.warScore > 7) {
            adjustmentPercent = 50;
            reason = `WAR Score ${context.warScore} - Surgical extraction recommended`;
            suggestedCode = 'EXO-SURGICAL';
        } else if (context.warScore > 4) {
            adjustmentPercent = 25;
            reason = `WAR Score ${context.warScore} - Complex extraction`;
            suggestedCode = 'EXO-COMPLEX';
        }
    }

    // Material-based pricing
    if (context.material) {
        if (context.material.toLowerCase().includes('zirconia')) {
            adjustmentPercent = Math.max(adjustmentPercent, 30);
            reason = 'Zirconia material premium';
        } else if (context.material.toLowerCase().includes('e.max')) {
            adjustmentPercent = Math.max(adjustmentPercent, 25);
            reason = 'E.max ceramic premium';
        }
    }

    // Complexity adjustment
    if (context.complexity === 'complex') {
        adjustmentPercent += 15;
        reason += (reason ? ' + ' : '') + 'Complex case surcharge';
    }

    const suggestedPrice = Math.round(context.basePrice * (1 + adjustmentPercent / 100));

    return {
        originalCode: context.procedureCode,
        suggestedCode,
        originalPrice: context.basePrice,
        suggestedPrice,
        reason: reason || 'Standard pricing',
        adjustmentPercent
    };
}
