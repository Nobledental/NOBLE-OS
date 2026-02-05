export interface TariffItem {
    id: string;
    name: string;
    cost: number;
    tax: number;
    category: string;
    isBundle?: boolean;
    bundleDetails?: string[];
}

export const TARIFF_MASTER_DATA: TariffItem[] = [
    { id: '1', name: 'Consultation', cost: 500, tax: 0, category: 'General' },
    { id: '2', name: 'Scaling & Polishing', cost: 1500, tax: 18, category: 'Cleaning' },
    { id: '3', name: 'Composite Filling', cost: 2500, tax: 0, category: 'Restorative' },
    { id: '4', name: 'Root Canal Treatment', cost: 4500, tax: 0, category: 'Endo' },
    {
        id: '5',
        name: 'Surgical Extraction (Bundle)',
        cost: 3500,
        tax: 0,
        category: 'Surgery',
        isBundle: true,
        bundleDetails: ['Local Anesthesia', 'Sutures', 'Hemostatic Agent', 'Post-op Pack']
    },
    {
        id: '6',
        name: 'Zirconia Crown',
        cost: 8000,
        tax: 12,
        category: 'Prostho'
    },
    {
        id: '7',
        name: 'Ortho Consultation',
        cost: 800,
        tax: 0,
        category: 'Ortho'
    },
    {
        id: '8',
        name: 'Metal Braces',
        cost: 25000,
        tax: 0,
        category: 'Ortho'
    },
    {
        id: '9',
        name: 'Ceramic Braces',
        cost: 35000,
        tax: 0,
        category: 'Ortho'
    },
    {
        id: '10',
        name: 'Invisalign (Basic)',
        cost: 150000,
        tax: 18,
        category: 'Ortho'
    }
];
