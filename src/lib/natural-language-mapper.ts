/**
 * Natural Language Mapper - SVG Tooth Map → Automatic Index Updates
 * 
 * This hooks into tooth map click events and updates clinical indices
 * in the background without requiring separate form entry.
 */

import {
    processShadowIndex,
    ToothState,
    ToothMapEvent,
    ShadowIndexResult,
    updateMetadataBackground
} from './shadow-indexer';

// =============================================================================
// EVENT TYPES
// =============================================================================

export interface ToothClickEvent {
    toothNumber: number;
    surface?: 'Occlusal' | 'Mesial' | 'Distal' | 'Buccal' | 'Lingual' | 'Incisal';
    action: 'mark_caries' | 'mark_missing' | 'mark_filled' | 'mark_rct' | 'mark_crown' | 'clear';
    timestamp: string;
}

export interface MapperResult {
    success: boolean;
    updatedIndices: ShadowIndexResult;
    suggestion?: string;
    autoActions: AutoAction[];
}

export interface AutoAction {
    type: 'dmft_update' | 'gvblack_suggest' | 'kennedy_update' | 'treatment_suggest' | 'alert';
    description: string;
    data: Record<string, any>;
}

// =============================================================================
// STATE MANAGER
// =============================================================================

class ToothMapStateManager {
    private currentState: Record<number, ToothState> = {};
    private patientId: string = '';
    private listeners: ((result: ShadowIndexResult) => void)[] = [];

    /**
     * Initialize with patient data
     */
    initialize(patientId: string, initialState: Record<number, ToothState>) {
        this.patientId = patientId;
        this.currentState = { ...initialState };

        // Initialize all 32 adult teeth as healthy if not specified
        for (let quadrant = 1; quadrant <= 4; quadrant++) {
            for (let tooth = 1; tooth <= 8; tooth++) {
                const fdi = quadrant * 10 + tooth;
                if (!this.currentState[fdi]) {
                    this.currentState[fdi] = 'healthy';
                }
            }
        }
    }

    /**
     * Process a click event on the tooth map
     */
    processClick(event: ToothClickEvent): MapperResult {
        const previousState = this.currentState[event.toothNumber] || 'healthy';
        let newState: ToothState;

        // Map action to tooth state
        switch (event.action) {
            case 'mark_caries': newState = 'caries'; break;
            case 'mark_missing': newState = 'missing'; break;
            case 'mark_filled': newState = 'filled'; break;
            case 'mark_rct': newState = 'rct'; break;
            case 'mark_crown': newState = 'crowned'; break;
            case 'clear': newState = 'healthy'; break;
            default: newState = 'healthy';
        }

        // Update state
        this.currentState[event.toothNumber] = newState;

        // Create event for shadow indexer
        const mapEvent: ToothMapEvent = {
            toothNumber: event.toothNumber,
            previousState,
            newState,
            surfaces: event.surface ? [event.surface] : undefined,
            timestamp: event.timestamp,
            triggeredBy: 'user'
        };

        // Process through shadow indexer (automatic DMFT/Kennedy updates)
        const shadowResult = processShadowIndex(this.currentState, mapEvent);

        // Update metadata in background
        updateMetadataBackground(this.patientId, shadowResult);

        // Generate auto-actions
        const autoActions = this.generateAutoActions(event, previousState, newState, shadowResult);

        // Notify listeners
        this.listeners.forEach(listener => listener(shadowResult));

        // Generate suggestion message
        const suggestion = this.generateSuggestion(event, newState, shadowResult);

        return {
            success: true,
            updatedIndices: shadowResult,
            suggestion,
            autoActions
        };
    }

    /**
     * Generate automatic actions based on state change
     */
    private generateAutoActions(
        event: ToothClickEvent,
        previousState: ToothState,
        newState: ToothState,
        result: ShadowIndexResult
    ): AutoAction[] {
        const actions: AutoAction[] = [];

        // DMFT Update
        if (previousState !== newState) {
            actions.push({
                type: 'dmft_update',
                description: `DMFT updated to ${result.dmft.total} (D:${result.dmft.d} M:${result.dmft.m} F:${result.dmft.f})`,
                data: result.dmft
            });
        }

        // G.V. Black suggestion for caries
        if (newState === 'caries' && result.autoSuggestions.length > 0) {
            const gvbSuggestion = result.autoSuggestions.find(s => s.code.startsWith('GVB-'));
            if (gvbSuggestion) {
                actions.push({
                    type: 'gvblack_suggest',
                    description: gvbSuggestion.message,
                    data: { classification: gvbSuggestion.code.replace('GVB-', '') }
                });
            }
        }

        // Kennedy update for missing teeth
        if (newState === 'missing' || previousState === 'missing') {
            if (result.kennedyMaxilla || result.kennedyMandible) {
                actions.push({
                    type: 'kennedy_update',
                    description: `Kennedy Classification: ${result.kennedyMaxilla ? `Maxilla ${result.kennedyMaxilla.classification}` : ''} ${result.kennedyMandible ? `Mandible ${result.kennedyMandible.classification}` : ''}`.trim(),
                    data: { maxilla: result.kennedyMaxilla, mandible: result.kennedyMandible }
                });
            }
        }

        // Treatment suggestions
        result.autoSuggestions.filter(s => s.type === 'treatment').forEach(suggestion => {
            actions.push({
                type: 'treatment_suggest',
                description: suggestion.message,
                data: { code: suggestion.code, confidence: suggestion.confidence }
            });
        });

        return actions;
    }

    /**
     * Generate user-friendly suggestion message
     */
    private generateSuggestion(
        event: ToothClickEvent,
        newState: ToothState,
        result: ShadowIndexResult
    ): string {
        const messages: string[] = [];

        if (newState === 'caries') {
            messages.push(`Tooth #${event.toothNumber} marked as carious`);
            messages.push(`DMFT now ${result.dmft.total}`);
        } else if (newState === 'missing') {
            messages.push(`Tooth #${event.toothNumber} marked as missing`);
            if (result.kennedyMaxilla || result.kennedyMandible) {
                messages.push('Kennedy classification updated');
            }
        } else if (newState === 'filled') {
            messages.push(`Tooth #${event.toothNumber} marked as restored`);
        }

        return messages.join(' • ');
    }

    /**
     * Subscribe to index updates
     */
    subscribe(listener: (result: ShadowIndexResult) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Get current state
     */
    getState() {
        return { ...this.currentState };
    }

    /**
     * Get current indices without making changes
     */
    getCurrentIndices(): ShadowIndexResult {
        return processShadowIndex(this.currentState);
    }
}

// Singleton instance
export const toothMapManager = new ToothMapStateManager();

// =============================================================================
// REACT HOOK
// =============================================================================

import { useState, useEffect, useCallback } from 'react';

export function useToothMapMapper(patientId: string, initialState?: Record<number, ToothState>) {
    const [indices, setIndices] = useState<ShadowIndexResult | null>(null);
    const [lastAction, setLastAction] = useState<MapperResult | null>(null);

    useEffect(() => {
        toothMapManager.initialize(patientId, initialState || {});
        setIndices(toothMapManager.getCurrentIndices());

        const unsubscribe = toothMapManager.subscribe(setIndices);
        return unsubscribe;
    }, [patientId, initialState]);

    const handleToothClick = useCallback((event: ToothClickEvent) => {
        const result = toothMapManager.processClick(event);
        setLastAction(result);
        return result;
    }, []);

    return {
        indices,
        lastAction,
        handleToothClick,
        getState: () => toothMapManager.getState()
    };
}
