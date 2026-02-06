export interface TreatmentPrice {
    code: string;
    name: string;
    description: string;
    basePrice: number;
    category: 'GENERAL' | 'SURGERY' | 'ENDODONTICS' | 'ORTHODONTICS' | 'PERIODONTICS';
}

export const TREATMENT_PRICES: TreatmentPrice[] = [
    { code: 'CONSULTATION', name: 'Dental Consultation', description: 'Standard oral examination', basePrice: 500, category: 'GENERAL' },
    { code: 'EXTRACTION', name: 'Simple Extraction', description: 'Non-surgical tooth removal', basePrice: 1500, category: 'SURGERY' },
    { code: 'RCT', name: 'Root Canal Treatment', description: 'Complete endodontic therapy', basePrice: 6500, category: 'ENDODONTICS' },
    { code: 'FILLING', name: 'Composite Filling', description: 'Tooth-colored restoration', basePrice: 1200, category: 'GENERAL' },
    { code: 'SCALING', name: 'Ultra-sonic Scaling', description: 'Full mouth cleaning', basePrice: 2000, category: 'PERIODONTICS' },
    { code: 'CROWN', name: 'Zirconia Crown', description: 'Metal-free aesthetic crown', basePrice: 8500, category: 'GENERAL' },
    { code: 'IMPLANT', name: 'Dental Implant', description: 'Single tooth replacement', basePrice: 45000, category: 'SURGERY' },
    { code: 'XRAY', name: 'Digital X-ray (RVG)', description: 'Single IOPA image', basePrice: 300, category: 'GENERAL' },
];

export const getPriceForProcedure = (code: string): number => {
    return TREATMENT_PRICES.find(p => p.code === code.toUpperCase())?.basePrice || 0;
};
