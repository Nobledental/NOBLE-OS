import { create } from 'zustand';
import type { TreatmentRecord } from '@/types/treatment-record';
import { calculateTreatmentBill } from '@/lib/billing-calculator';

export type TaxRate = 0 | 5 | 12 | 18;
export type BillingMode = 'auto' | 'manual';

export interface InvoiceItem {
    id: string;
    name: string;
    baseCost: number;
    taxRate: TaxRate;
    quantity: number;
    isBundle?: boolean;
    bundleItems?: string[]; // Names of bundled items e.g., "Sutures"
    consultantId?: string; // If a visiting doctor performed this
    metadata?: {
        source?: 'auto_clinical' | 'manual';
        treatmentRecordId?: string;
        teethTreated?: number[];
        completedAt?: string;
        procedureId?: string;
        category?: string;
    };
}

export interface BillingState {
    // Mode
    mode: BillingMode;

    // Items
    items: InvoiceItem[];
    autoItems: InvoiceItem[]; // Generated from clinical
    manualItems: InvoiceItem[]; // Manually added

    // Patient/Appointment context
    patientId: string | null;
    appointmentId: string | null;
    consultantId: string | null; // Default consultant for the whole bill

    // Payment options
    enableEmi: boolean;
    emiTenure: number; // Months, default 12

    // Invoice metadata
    invoiceNumber?: string;
    invoiceDate?: string;

    // Actions - Mode
    switchMode: (mode: BillingMode) => void;

    // Actions - Items
    addItem: (item: Omit<InvoiceItem, 'id'>) => void;
    removeItem: (id: string) => void;
    clearItems: () => void;

    // Actions - Automated billing from clinical
    addFromClinical: (treatment: TreatmentRecord) => void;
    addMultipleFromClinical: (treatments: TreatmentRecord[]) => void;
    removeAutoItem: (itemId: string) => void;

    // Actions - Context
    setPatient: (patientId: string) => void;
    setAppointment: (appointmentId: string) => void;
    setConsultant: (id: string | null) => void;

    // Actions - Payment
    toggleEmi: (enabled: boolean) => void;
    setEmiTenure: (months: number) => void;

    // Computed (Helper to get totals)
    getTotals: () => { subtotal: number; tax: number; total: number; monthlyEmi: number };

    // Invoice generation
    generateInvoiceNumber: () => string;
    prepareForPayment: () => void;
    resetBilling: () => void;
}

export const useBillingStore = create<BillingState>((set, get) => ({
    // Initial state
    mode: 'auto',
    items: [],
    autoItems: [],
    manualItems: [],
    patientId: null,
    appointmentId: null,
    consultantId: null,
    enableEmi: false,
    emiTenure: 12,

    // Mode switching
    switchMode: (mode) => set({ mode }),

    // Add item (unified)
    addItem: (newItem) => set((state) => {
        const id = Math.random().toString(36).substring(7);
        const item = { ...newItem, id };

        // Add to appropriate list based on source
        if (newItem.metadata?.source === 'auto_clinical') {
            return {
                items: [...state.items, item],
                autoItems: [...state.autoItems, item]
            };
        } else {
            return {
                items: [...state.items, item],
                manualItems: [...state.manualItems, item]
            };
        }
    }),

    // Remove item
    removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
        autoItems: state.autoItems.filter((i) => i.id !== id),
        manualItems: state.manualItems.filter((i) => i.id !== id)
    })),

    // Clear all items
    clearItems: () => set({
        items: [],
        autoItems: [],
        manualItems: []
    }),

    // Add from clinical treatment
    addFromClinical: (treatment) => {
        try {
            const invoiceItem = calculateTreatmentBill(treatment);
            get().addItem(invoiceItem);
        } catch (error) {
            console.error('Failed to add treatment to billing:', error);
        }
    },

    // Add multiple treatments at once
    addMultipleFromClinical: (treatments) => {
        treatments.forEach(treatment => {
            get().addFromClinical(treatment);
        });
    },

    // Remove auto-generated item
    removeAutoItem: (itemId) => {
        get().removeItem(itemId);
    },

    // Context setters
    setPatient: (patientId) => set({ patientId }),
    setAppointment: (appointmentId) => set({ appointmentId }),
    setConsultant: (id) => set({ consultantId: id }),

    // Payment options
    toggleEmi: (enabled) => set({ enableEmi: enabled }),
    setEmiTenure: (months) => set({ emiTenure: months }),

    // Calculate totals
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
        const monthlyEmi = emiTenure > 0 ? total / emiTenure : 0;

        return { subtotal, tax, total, monthlyEmi };
    },

    // Generate invoice number
    generateInvoiceNumber: () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();

        return `INV-${year}${month}${day}-${random}`;
    },

    // Prepare invoice for payment
    prepareForPayment: () => {
        const invoiceNumber = get().generateInvoiceNumber();
        const invoiceDate = new Date().toISOString();
        set({ invoiceNumber, invoiceDate });
    },

    // Reset billing (after payment complete)
    resetBilling: () => set({
        items: [],
        autoItems: [],
        manualItems: [],
        patientId: null,
        appointmentId: null,
        consultantId: null,
        enableEmi: false,
        emiTenure: 12,
        invoiceNumber: undefined,
        invoiceDate: undefined,
        mode: 'auto'
    })
}));
