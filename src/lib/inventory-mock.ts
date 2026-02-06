import { Consumable } from './smart-stock';

export const MOCK_INVENTORY: Consumable[] = [
    {
        id: 'GLOVES_STERILE',
        name: 'Sterile Gloves (Size 7.5)',
        sku: 'DENT-GLV-001',
        category: 'DISPOSABLE',
        unit: 'Pairs',
        currentStock: 150,
        reorderPoint: 50,
        reorderQuantity: 200,
        costPerUnit: 12,
        supplier: 'SafeHealth Supplies',
        lastRestockedAt: new Date('2024-05-15')
    },
    {
        id: 'SYRINGE_2ML',
        name: 'Disposable Syringe 2ml',
        sku: 'DENT-SYR-002',
        category: 'DISPOSABLE',
        unit: 'Units',
        currentStock: 85,
        reorderPoint: 40,
        reorderQuantity: 100,
        costPerUnit: 5,
        supplier: 'MediTech India'
    },
    {
        id: 'ANESTHETIC_LIDOCAINE',
        name: 'Lidocaine 2% w/ Adrenaline',
        sku: 'DENT-MED-003',
        category: 'MEDICATION',
        unit: 'Cartridges',
        currentStock: 45,
        reorderPoint: 30,
        reorderQuantity: 50,
        costPerUnit: 25,
        expiryDate: new Date('2025-12-31')
    },
    {
        id: 'COMPOSITE_A2',
        name: 'Composite Resin A2 Shade',
        sku: 'DENT-MAT-004',
        category: 'MATERIAL',
        unit: 'Syringes',
        currentStock: 12,
        reorderPoint: 5,
        reorderQuantity: 10,
        costPerUnit: 1200,
        expiryDate: new Date('2024-11-20')
    },
    {
        id: 'BONDING_AGENT',
        name: 'Universal Bonding Agent',
        sku: 'DENT-MAT-005',
        category: 'MATERIAL',
        unit: 'Bottles',
        currentStock: 4,
        reorderPoint: 2,
        reorderQuantity: 5,
        costPerUnit: 3500
    },
    {
        id: 'GAUZE_PACK',
        name: 'Sterile Gauze Pads (4x4)',
        sku: 'DENT-DSP-006',
        category: 'DISPOSABLE',
        unit: 'Packs',
        currentStock: 300,
        reorderPoint: 100,
        reorderQuantity: 500,
        costPerUnit: 2
    },
    {
        id: 'SCALER_TIP',
        name: 'Ultrasonic Scaler Tip G1',
        sku: 'DENT-INS-007',
        category: 'INSTRUMENT',
        unit: 'Units',
        currentStock: 8,
        reorderPoint: 3,
        reorderQuantity: 5,
        costPerUnit: 2200
    }
];
