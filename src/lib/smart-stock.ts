/**
 * Phase 27: Smart Stock Link
 * 
 * Procedure-Consumable mapping with auto-decrement and low stock alerts
 */

import { v4 as uuid } from 'uuid';

// =============================================================================
// TYPES
// =============================================================================

export interface Consumable {
    id: string;
    name: string;
    sku: string;
    category: 'DISPOSABLE' | 'INSTRUMENT' | 'MATERIAL' | 'MEDICATION' | 'EQUIPMENT';
    unit: string;
    currentStock: number;
    reorderPoint: number;
    reorderQuantity: number;
    costPerUnit: number;
    supplier?: string;
    expiryDate?: Date;
    batchNumber?: string;
    lastRestockedAt?: Date;
}

export interface ProcedureConsumableMap {
    procedureCode: string;
    procedureName: string;
    consumables: Array<{
        consumableId: string;
        consumableName: string;
        quantityPerProcedure: number;
        isOptional: boolean;
    }>;
}

export interface StockMovement {
    id: string;
    consumableId: string;
    consumableName: string;
    movementType: 'IN' | 'OUT' | 'ADJUSTMENT' | 'EXPIRED' | 'DAMAGED';
    quantity: number;
    previousStock: number;
    newStock: number;
    reason: string;
    referenceId?: string; // appointmentId, purchaseOrderId, etc.
    referenceType?: 'TREATMENT' | 'PURCHASE' | 'MANUAL' | 'AUDIT';
    performedBy: string;
    performedAt: Date;
    clinicId: string;
}

export interface LowStockAlert {
    id: string;
    consumableId: string;
    consumableName: string;
    currentStock: number;
    reorderPoint: number;
    reorderQuantity: number;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    createdAt: Date;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
    reorderPlaced: boolean;
    reorderPlacedAt?: Date;
}

// =============================================================================
// PROCEDURE-CONSUMABLE MAPPINGS
// =============================================================================

export const PROCEDURE_CONSUMABLE_MAP: Map<string, ProcedureConsumableMap> = new Map([
    ['EXTRACTION', {
        procedureCode: 'EXTRACTION',
        procedureName: 'Tooth Extraction',
        consumables: [
            { consumableId: 'GLOVES_STERILE', consumableName: 'Sterile Gloves (pair)', quantityPerProcedure: 2, isOptional: false },
            { consumableId: 'SYRINGE_2ML', consumableName: '2ml Syringe', quantityPerProcedure: 2, isOptional: false },
            { consumableId: 'ANESTHETIC_LIDOCAINE', consumableName: 'Lidocaine 2%', quantityPerProcedure: 2, isOptional: false },
            { consumableId: 'GAUZE_PACK', consumableName: 'Gauze Pack', quantityPerProcedure: 5, isOptional: false },
            { consumableId: 'SUTURE_SILK', consumableName: 'Silk Suture 3-0', quantityPerProcedure: 1, isOptional: true },
            { consumableId: 'COTTON_ROLL', consumableName: 'Cotton Roll', quantityPerProcedure: 4, isOptional: false },
            { consumableId: 'SALINE_BOTTLE', consumableName: 'Saline Solution', quantityPerProcedure: 0.5, isOptional: false }
        ]
    }],

    ['RCT', {
        procedureCode: 'RCT',
        procedureName: 'Root Canal Treatment',
        consumables: [
            { consumableId: 'GLOVES_STERILE', consumableName: 'Sterile Gloves (pair)', quantityPerProcedure: 2, isOptional: false },
            { consumableId: 'SYRINGE_2ML', consumableName: '2ml Syringe', quantityPerProcedure: 2, isOptional: false },
            { consumableId: 'ANESTHETIC_LIDOCAINE', consumableName: 'Lidocaine 2%', quantityPerProcedure: 2, isOptional: false },
            { consumableId: 'RUBBER_DAM', consumableName: 'Rubber Dam Sheet', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'ENDO_FILE_SET', consumableName: 'Endo File Set', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'GUTTA_PERCHA', consumableName: 'Gutta Percha Points', quantityPerProcedure: 5, isOptional: false },
            { consumableId: 'SEALER_AH_PLUS', consumableName: 'AH Plus Sealer', quantityPerProcedure: 0.1, isOptional: false },
            { consumableId: 'SODIUM_HYPOCHLORITE', consumableName: 'Sodium Hypochlorite 3%', quantityPerProcedure: 10, isOptional: false },
            { consumableId: 'EDTA_SOLUTION', consumableName: 'EDTA Solution', quantityPerProcedure: 5, isOptional: false },
            { consumableId: 'COTTON_PELLET', consumableName: 'Cotton Pellets', quantityPerProcedure: 10, isOptional: false },
            { consumableId: 'TEMP_FILLING', consumableName: 'Temporary Filling Material', quantityPerProcedure: 1, isOptional: false }
        ]
    }],

    ['FILLING', {
        procedureCode: 'FILLING',
        procedureName: 'Dental Filling',
        consumables: [
            { consumableId: 'GLOVES_STERILE', consumableName: 'Sterile Gloves (pair)', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'SYRINGE_2ML', consumableName: '2ml Syringe', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'ANESTHETIC_LIDOCAINE', consumableName: 'Lidocaine 2%', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'COMPOSITE_A2', consumableName: 'Composite Resin A2', quantityPerProcedure: 0.2, isOptional: false },
            { consumableId: 'BONDING_AGENT', consumableName: 'Bonding Agent', quantityPerProcedure: 0.1, isOptional: false },
            { consumableId: 'ETCHANT_GEL', consumableName: 'Etchant Gel 37%', quantityPerProcedure: 0.1, isOptional: false },
            { consumableId: 'MATRIX_BAND', consumableName: 'Matrix Band', quantityPerProcedure: 1, isOptional: true },
            { consumableId: 'COTTON_ROLL', consumableName: 'Cotton Roll', quantityPerProcedure: 4, isOptional: false }
        ]
    }],

    ['SCALING', {
        procedureCode: 'SCALING',
        procedureName: 'Dental Scaling',
        consumables: [
            { consumableId: 'GLOVES_STERILE', consumableName: 'Sterile Gloves (pair)', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'SCALER_TIP', consumableName: 'Ultrasonic Scaler Tip', quantityPerProcedure: 0.1, isOptional: false },
            { consumableId: 'PROPHY_PASTE', consumableName: 'Prophylaxis Paste', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'SUCTION_TIP', consumableName: 'Suction Tip', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'COTTON_ROLL', consumableName: 'Cotton Roll', quantityPerProcedure: 2, isOptional: false }
        ]
    }],

    ['CROWN', {
        procedureCode: 'CROWN',
        procedureName: 'Crown Placement',
        consumables: [
            { consumableId: 'GLOVES_STERILE', consumableName: 'Sterile Gloves (pair)', quantityPerProcedure: 2, isOptional: false },
            { consumableId: 'SYRINGE_2ML', consumableName: '2ml Syringe', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'ANESTHETIC_LIDOCAINE', consumableName: 'Lidocaine 2%', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'IMPRESSION_MATERIAL', consumableName: 'Impression Material', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'TEMP_CROWN', consumableName: 'Temporary Crown', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'CEMENT_LUTING', consumableName: 'Luting Cement', quantityPerProcedure: 0.5, isOptional: false },
            { consumableId: 'RETRACTION_CORD', consumableName: 'Retraction Cord', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'COTTON_ROLL', consumableName: 'Cotton Roll', quantityPerProcedure: 4, isOptional: false }
        ]
    }],

    ['IMPLANT', {
        procedureCode: 'IMPLANT',
        procedureName: 'Dental Implant',
        consumables: [
            { consumableId: 'GLOVES_STERILE', consumableName: 'Sterile Gloves (pair)', quantityPerProcedure: 4, isOptional: false },
            { consumableId: 'SYRINGE_2ML', consumableName: '2ml Syringe', quantityPerProcedure: 3, isOptional: false },
            { consumableId: 'ANESTHETIC_LIDOCAINE', consumableName: 'Lidocaine 2%', quantityPerProcedure: 3, isOptional: false },
            { consumableId: 'SURGICAL_DRAPE', consumableName: 'Surgical Drape', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'IMPLANT_FIXTURE', consumableName: 'Implant Fixture', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'HEALING_ABUTMENT', consumableName: 'Healing Abutment', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'BONE_GRAFT', consumableName: 'Bone Graft Material', quantityPerProcedure: 0.5, isOptional: true },
            { consumableId: 'SUTURE_VICRYL', consumableName: 'Vicryl Suture 4-0', quantityPerProcedure: 2, isOptional: false },
            { consumableId: 'SALINE_BOTTLE', consumableName: 'Saline Solution', quantityPerProcedure: 1, isOptional: false },
            { consumableId: 'GAUZE_PACK', consumableName: 'Gauze Pack', quantityPerProcedure: 10, isOptional: false }
        ]
    }]
]);

// =============================================================================
// SMART STOCK SERVICE
// =============================================================================

export class SmartStockService {
    private inventory: Map<string, Consumable> = new Map();
    private movements: StockMovement[] = [];
    private alerts: LowStockAlert[] = [];

    /**
     * Initialize inventory with consumables
     */
    initializeInventory(consumables: Consumable[]): void {
        consumables.forEach(c => this.inventory.set(c.id, c));
    }

    /**
     * Get consumables required for a procedure
     */
    getConsumablesForProcedure(procedureCode: string): ProcedureConsumableMap | undefined {
        return PROCEDURE_CONSUMABLE_MAP.get(procedureCode);
    }

    /**
     * Check if all required consumables are in stock
     */
    checkStockAvailability(procedureCode: string): {
        available: boolean;
        shortages: Array<{ consumableId: string; consumableName: string; required: number; available: number }>;
    } {
        const mapping = PROCEDURE_CONSUMABLE_MAP.get(procedureCode);
        if (!mapping) return { available: true, shortages: [] };

        const shortages: Array<{ consumableId: string; consumableName: string; required: number; available: number }> = [];

        for (const item of mapping.consumables) {
            if (item.isOptional) continue;

            const consumable = this.inventory.get(item.consumableId);
            if (!consumable || consumable.currentStock < item.quantityPerProcedure) {
                shortages.push({
                    consumableId: item.consumableId,
                    consumableName: item.consumableName,
                    required: item.quantityPerProcedure,
                    available: consumable?.currentStock || 0
                });
            }
        }

        return {
            available: shortages.length === 0,
            shortages
        };
    }

    /**
     * Decrement stock after treatment completion
     */
    decrementStockForTreatment(
        procedureCode: string,
        appointmentId: string,
        performedBy: string,
        clinicId: string
    ): {
        movements: StockMovement[];
        lowStockAlerts: LowStockAlert[];
    } {
        const mapping = PROCEDURE_CONSUMABLE_MAP.get(procedureCode);
        if (!mapping) return { movements: [], lowStockAlerts: [] };

        const newMovements: StockMovement[] = [];
        const newAlerts: LowStockAlert[] = [];

        for (const item of mapping.consumables) {
            const consumable = this.inventory.get(item.consumableId);
            if (!consumable) continue;

            const previousStock = consumable.currentStock;
            const newStock = Math.max(0, previousStock - item.quantityPerProcedure);

            // Update inventory
            consumable.currentStock = newStock;
            this.inventory.set(item.consumableId, consumable);

            // Create movement record
            const movement: StockMovement = {
                id: uuid(),
                consumableId: item.consumableId,
                consumableName: item.consumableName,
                movementType: 'OUT',
                quantity: item.quantityPerProcedure,
                previousStock,
                newStock,
                reason: `Used in ${mapping.procedureName}`,
                referenceId: appointmentId,
                referenceType: 'TREATMENT',
                performedBy,
                performedAt: new Date(),
                clinicId
            };
            newMovements.push(movement);
            this.movements.push(movement);

            // Check for low stock
            if (newStock <= consumable.reorderPoint) {
                const alertPriority = this.calculateAlertPriority(newStock, consumable.reorderPoint);

                // Check if alert already exists
                const existingAlert = this.alerts.find(
                    a => a.consumableId === item.consumableId && !a.acknowledged
                );

                if (!existingAlert) {
                    const alert: LowStockAlert = {
                        id: uuid(),
                        consumableId: item.consumableId,
                        consumableName: item.consumableName,
                        currentStock: newStock,
                        reorderPoint: consumable.reorderPoint,
                        reorderQuantity: consumable.reorderQuantity,
                        priority: alertPriority,
                        createdAt: new Date(),
                        acknowledged: false,
                        reorderPlaced: false
                    };
                    newAlerts.push(alert);
                    this.alerts.push(alert);
                }
            }
        }

        return { movements: newMovements, lowStockAlerts: newAlerts };
    }

    /**
     * Calculate alert priority based on stock level
     */
    private calculateAlertPriority(current: number, reorderPoint: number): LowStockAlert['priority'] {
        const ratio = current / reorderPoint;
        if (ratio <= 0) return 'CRITICAL';
        if (ratio <= 0.25) return 'HIGH';
        if (ratio <= 0.5) return 'MEDIUM';
        return 'LOW';
    }

    /**
     * Add stock (restock)
     */
    addStock(
        consumableId: string,
        quantity: number,
        batchNumber: string,
        expiryDate: Date,
        performedBy: string,
        clinicId: string
    ): StockMovement | null {
        const consumable = this.inventory.get(consumableId);
        if (!consumable) return null;

        const previousStock = consumable.currentStock;
        const newStock = previousStock + quantity;

        consumable.currentStock = newStock;
        consumable.batchNumber = batchNumber;
        consumable.expiryDate = expiryDate;
        consumable.lastRestockedAt = new Date();
        this.inventory.set(consumableId, consumable);

        const movement: StockMovement = {
            id: uuid(),
            consumableId,
            consumableName: consumable.name,
            movementType: 'IN',
            quantity,
            previousStock,
            newStock,
            reason: `Restocked - Batch: ${batchNumber}`,
            referenceType: 'PURCHASE',
            performedBy,
            performedAt: new Date(),
            clinicId
        };
        this.movements.push(movement);

        return movement;
    }

    /**
     * Get all pending low stock alerts
     */
    getPendingAlerts(): LowStockAlert[] {
        return this.alerts.filter(a => !a.acknowledged);
    }

    /**
     * Acknowledge alert
     */
    acknowledgeAlert(alertId: string, acknowledgedBy: string): void {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
            alert.acknowledgedBy = acknowledgedBy;
            alert.acknowledgedAt = new Date();
        }
    }

    /**
     * Mark reorder placed
     */
    markReorderPlaced(alertId: string): void {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.reorderPlaced = true;
            alert.reorderPlacedAt = new Date();
        }
    }

    /**
     * Get stock movements for a date range
     */
    getMovements(startDate: Date, endDate: Date, clinicId: string): StockMovement[] {
        return this.movements.filter(m =>
            m.clinicId === clinicId &&
            m.performedAt >= startDate &&
            m.performedAt <= endDate
        );
    }

    /**
     * Get current inventory status
     */
    getInventoryStatus(): Array<{
        consumable: Consumable;
        stockStatus: 'OK' | 'LOW' | 'CRITICAL' | 'OUT';
        daysUntilStockout?: number;
    }> {
        const status: Array<{
            consumable: Consumable;
            stockStatus: 'OK' | 'LOW' | 'CRITICAL' | 'OUT';
            daysUntilStockout?: number;
        }> = [];

        this.inventory.forEach(consumable => {
            let stockStatus: 'OK' | 'LOW' | 'CRITICAL' | 'OUT';
            if (consumable.currentStock <= 0) stockStatus = 'OUT';
            else if (consumable.currentStock <= consumable.reorderPoint * 0.25) stockStatus = 'CRITICAL';
            else if (consumable.currentStock <= consumable.reorderPoint) stockStatus = 'LOW';
            else stockStatus = 'OK';

            status.push({ consumable, stockStatus });
        });

        return status;
    }
}

export const smartStockService = new SmartStockService();
