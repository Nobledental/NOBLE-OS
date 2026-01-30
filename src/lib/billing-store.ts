import { create } from 'zustand';

export type TaxRate = 0 | 5 | 12 | 18;

export interface InvoiceItem {
    id: string;
    name: string;
    baseCost: number;
    taxRate: TaxRate;
    quantity: number;
    isBundle?: boolean;
    bundleItems?: string[]; // Names of bundled items e.g., "Sutures"
    consultantId?: string; // If a visiting doctor performed this
}

export interface BillingState {
    items: InvoiceItem[];
    patientId: string | null;
    consultantId: string | null; // Default consultant for the whole bill
    enableEmi: boolean;
    emiTenure: number; // Months, default 12

    // Actions
    addItem: (item: Omit<InvoiceItem, 'id'>) => void;
    removeItem: (id: string) => void;
    toggleEmi: (enabled: boolean) => void;
    setConsultant: (id: string | null) => void;

    // Computed (Helper to get totals)
    getTotals: () => { subtotal: number; tax: number; total: number; monthlyEmi: number };
}

export const useBillingStore = create<BillingState>((set, get) => ({
    items: [],
    patientId: null,
    consultantId: null,
    enableEmi: false,
    emiTenure: 12,

    addItem: (newItem) => set((state) => {
        // Basic ID generation
        const id = Math.random().toString(36).substring(7);
        return { items: [...state.items, { ...newItem, id }] };
    }),

    removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
    })),

    toggleEmi: (enabled) => set({ enableEmi: enabled }),

    setConsultant: (id) => set({ consultantId: id }),

    getTotals: () => {
        const { items, emiTenure } = get();
        let subtotal = 0;
        let tax = 0;

        items.forEach(item => {
            const itemTotal = item.baseCost * item.quantity;
            subtotal += itemTotal;
            tax += itemTotal * (item.taxRate / 100);
        });

        const total = subtotal + tax;
        const monthlyEmi = total / emiTenure;

        return { subtotal, tax, total, monthlyEmi };
    }
}));
