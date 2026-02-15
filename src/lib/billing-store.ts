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
    discount: number;

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
    getTotals: () => { subtotal: number; discount: number; tax: number; total: number; monthlyEmi: number };

    // Invoice generation
    generateInvoiceNumber: () => string;
    prepareForPayment: () => void;
    resetBilling: () => void;

    // Discount Action
    setDiscount: (amount: number) => void;
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
    discount: 0, // Default discount

    // Mode switching
    switchMode: (mode) => set({ mode }),

    // Actions - Items
    addItem: (item) => set((state) => ({ items: [...state.items, { ...item, id: crypto.randomUUID() }] })),
    removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
    clearItems: () => set({ items: [], autoItems: [], manualItems: [] }),

    // Actions - Automated billing from clinical
    addFromClinical: (treatment) => {
        const newItem = calculateTreatmentBill(treatment);

        // Avoid adding duplicates based on treatment ID
        const exists = get().autoItems.some(i => i.metadata?.treatmentRecordId === treatment.id);
        if (exists) return;

        set((state) => ({
            autoItems: [...state.autoItems, newItem],
            items: [...state.items, newItem]
        }));
    },

    addMultipleFromClinical: (treatments) => {
        treatments.forEach((t) => get().addFromClinical(t));
    },

    removeAutoItem: (itemId) => set((state) => ({
        autoItems: state.autoItems.filter((i) => i.id !== itemId),
        items: state.items.filter((i) => i.id !== itemId)
    })),

    // Actions - Context
    setPatient: (patientId) => set({ patientId }),
    setAppointment: (appointmentId) => set({ appointmentId }),
    setConsultant: (id) => set({ consultantId: id }),

    // Actions - Payment
    toggleEmi: (enabled) => set({ enableEmi: enabled }),
    setEmiTenure: (months) => set({ emiTenure: months }),

    // Computed (Helper to get totals)
    getTotals: () => {
        const { items, discount } = get();
        const subtotal = items.reduce((sum, item) => sum + (item.baseCost * item.quantity), 0);
        const tax = 0; // Simplified for now
        const total = subtotal - discount + tax;
        const monthlyEmi = get().enableEmi ? total / get().emiTenure : 0;
        return { subtotal, discount, tax, total, monthlyEmi };
    },

    // Invoice generation
    generateInvoiceNumber: () => `INV-${Date.now()}`,
    prepareForPayment: () => {
        // Logic to lock items and move to payment gateway
    },
    resetBilling: () => set({
        items: [],
        autoItems: [],
        manualItems: [],
        patientId: null,
        appointmentId: null,
        consultantId: null,
        enableEmi: false,
        emiTenure: 12,
        discount: 0
    }),

    // Discount Action
    setDiscount: (amount) => set({ discount: amount }),



    // Calculate totals
    getTotals: () => {
        const { items, emiTenure, discount } = get();
        let subtotal = 0;
        let tax = 0;

        items.forEach(item => {
            const itemTotal = item.baseCost * item.quantity;
            subtotal += itemTotal;
            // Note: Tax is currently calculated on gross amount. 
            // In a real sovereign ledger, discount should ideally be itemized or pro-rated for accurate GST.
            // For this v1 refactor, we apply tax on the Item Total as per existing logic.
            tax += itemTotal * (item.taxRate / 100);
        });

        // Current Logic: Total = (Subtotal + Tax) - Discount
        // This effectively treats the discount as a "Post-Tax Adjustment" or "Cash Discount"
        let total = (subtotal + tax) - discount;
        if (total < 0) total = 0;

        const monthlyEmi = emiTenure > 0 ? total / emiTenure : 0;

        return { subtotal, discount, tax, total, monthlyEmi };
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
