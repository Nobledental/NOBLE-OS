import { create } from 'zustand';

export type ToothStatus = 'healthy' | 'decay' | 'filled' | 'rct' | 'missing' | 'crown';
export type ToothZone = 'enamel' | 'dentin' | 'pulp' | 'root';

export interface ToothState {
    id: number; // Universal 1-32
    status: ToothStatus;
    notes?: string;
    selected?: boolean;
    history?: string[];
}

interface ChairState {
    selectedTeeth: number[];
    teeth: Record<number, ToothState>;

    // Actions
    selectTooth: (id: number, multi?: boolean) => void;
    updateToothStatus: (id: number, status: ToothStatus) => void;
    resetSelection: () => void;

    // Quick Chart Actions
    applyTreatment: (treatment: string) => void; // e.g., "RCT" applied to selected
}

export const useChairStore = create<ChairState>((set, get) => ({
    selectedTeeth: [],
    teeth: {}, // Will be populated with 1-32 initial state

    selectTooth: (id, multi = false) => set((state) => {
        const isSelected = state.selectedTeeth.includes(id);
        let newSelection = [];

        if (multi) {
            newSelection = isSelected
                ? state.selectedTeeth.filter(t => t !== id)
                : [...state.selectedTeeth, id];
        } else {
            newSelection = isSelected && state.selectedTeeth.length === 1 ? [] : [id];
        }

        return { selectedTeeth: newSelection };
    }),

    updateToothStatus: (id, status) => set((state) => ({
        teeth: {
            ...state.teeth,
            [id]: { ...state.teeth[id], status, id }
        }
    })),

    resetSelection: () => set({ selectedTeeth: [] }),

    applyTreatment: (treatment) => {
        const { selectedTeeth, teeth } = get();
        const updates: Record<number, ToothState> = {};

        selectedTeeth.forEach(id => {
            let status: ToothStatus = 'healthy';
            if (treatment === 'RCT') status = 'rct';
            if (treatment === 'Extraction') status = 'missing';
            if (treatment === 'Filling') status = 'filled';

            updates[id] = { ...teeth[id], status, id };
        });

        set((state) => ({
            teeth: { ...state.teeth, ...updates },
            selectedTeeth: [] // Auto-deselect after action? Maybe keep for chaining.
        }));
    }
}));
