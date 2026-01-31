/**
 * Phase 23b: Automation Triggers
 * 
 * Procedure → Billing, Stock, and Follow-up automation
 */

import { v4 as uuid } from 'uuid';

// =============================================================================
// TYPES
// =============================================================================

export type TriggerEvent =
    | 'ON_PROCEDURE_COMPLETE'
    | 'ON_PAYMENT_SUCCESS'
    | 'ON_APPOINTMENT_BOOKED'
    | 'ON_PATIENT_CHECKIN'
    | 'ON_PATIENT_CHECKOUT'
    | 'ON_STOCK_LOW'
    | 'ON_REVIEW_SUBMITTED';

export interface ProcedureCompletionData {
    procedureId: string;
    procedureCode: string;
    procedureName: string;
    toothNumbers: number[];
    doctorId: string;
    patientId: string;
    clinicId: string;
    chairId: string;
    isMultiSitting: boolean;
    sittingNumber?: number;
    totalSittings?: number;
    stockItemsUsed: { itemId: string; quantity: number }[];
    notesId?: string;
    completedAt: Date;
}

export interface PaymentSuccessData {
    paymentId: string;
    invoiceId: string;
    patientId: string;
    clinicId: string;
    amount: number;
    method: 'cash' | 'card' | 'upi' | 'insurance';
    isFirstPayment: boolean;
    visitCount: number;
    paidAt: Date;
}

export interface DraftInvoice {
    id: string;
    patientId: string;
    clinicId: string;
    procedureId: string;
    lineItems: InvoiceLineItem[];
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    status: 'draft' | 'pending' | 'paid';
    createdAt: Date;
    emergencySurcharge?: number;
}

export interface InvoiceLineItem {
    id: string;
    description: string;
    procedureCode: string;
    toothNumbers: number[];
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface StockDeduction {
    id: string;
    itemId: string;
    itemName: string;
    quantity: number;
    previousStock: number;
    newStock: number;
    procedureId: string;
    deductedAt: Date;
    belowThreshold: boolean;
}

export interface ReminderFlag {
    id: string;
    type: 'MULTI_SITTING_FOLLOWUP' | 'POST_OP_CARE' | 'PAYMENT_DUE' | 'REVIEW_REQUEST';
    patientId: string;
    patientName: string;
    procedureId?: string;
    procedureName?: string;
    targetDate: Date;
    assignedTo: 'receptionist' | 'doctor' | 'patient';
    message: string;
    acknowledged: boolean;
    createdAt: Date;
}

export interface AutomationResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    notifications: NotificationPayload[];
}

export interface NotificationPayload {
    type: 'fcm' | 'sms' | 'email' | 'in_app';
    templateId: string;
    recipient: string;
    recipientType: 'patient' | 'doctor' | 'receptionist' | 'admin';
    data: Record<string, string>;
    scheduledFor?: Date;
}

export interface TariffItem {
    code: string;
    name: string;
    category: string;
    basePrice: number;
    taxPercent: number;
}

export interface StockItem {
    id: string;
    name: string;
    currentStock: number;
    minThreshold: number;
    unit: string;
}

// =============================================================================
// AUTOMATION ENGINE
// =============================================================================

export class AutomationEngine {
    private tariffs: Map<string, TariffItem> = new Map();
    private stockItems: Map<string, StockItem> = new Map();

    /**
     * Configure tariffs (should be loaded from database)
     */
    configureTariffs(tariffs: TariffItem[]): void {
        tariffs.forEach(t => this.tariffs.set(t.code, t));
    }

    /**
     * Configure stock items (should be loaded from database)
     */
    configureStock(items: StockItem[]): void {
        items.forEach(i => this.stockItems.set(i.id, i));
    }

    /**
     * ON_PROCEDURE_COMPLETE trigger
     */
    onProcedureComplete(data: ProcedureCompletionData): AutomationResult<{
        draftInvoice: DraftInvoice;
        stockDeductions: StockDeduction[];
        reminderFlag?: ReminderFlag;
    }> {
        const notifications: NotificationPayload[] = [];

        try {
            // 1. Create draft invoice
            const draftInvoice = this.createDraftInvoice(data);

            // 2. Deduct stock items
            const stockDeductions = this.deductStockItems(data);

            // 3. Check for low stock alerts
            const lowStockItems = stockDeductions.filter(d => d.belowThreshold);
            if (lowStockItems.length > 0) {
                notifications.push({
                    type: 'in_app',
                    templateId: 'LOW_STOCK_ALERT',
                    recipient: 'admin',
                    recipientType: 'admin',
                    data: {
                        items: lowStockItems.map(i => i.itemName).join(', '),
                        count: lowStockItems.length.toString()
                    }
                });
            }

            // 4. Create multi-sitting reminder if needed
            let reminderFlag: ReminderFlag | undefined;
            if (data.isMultiSitting && data.sittingNumber && data.totalSittings) {
                if (data.sittingNumber < data.totalSittings) {
                    reminderFlag = this.createMultiSittingReminder(data);

                    notifications.push({
                        type: 'in_app',
                        templateId: 'MULTI_SITTING_REMINDER',
                        recipient: 'receptionist',
                        recipientType: 'receptionist',
                        data: {
                            patientId: data.patientId,
                            procedureName: data.procedureName,
                            sittingNumber: data.sittingNumber.toString(),
                            totalSittings: data.totalSittings.toString()
                        }
                    });
                }
            }

            // 5. Notify front desk that bill is ready
            notifications.push({
                type: 'in_app',
                templateId: 'BILL_READY',
                recipient: 'receptionist',
                recipientType: 'receptionist',
                data: {
                    patientId: data.patientId,
                    invoiceId: draftInvoice.id,
                    amount: draftInvoice.total.toString()
                }
            });

            return {
                success: true,
                data: { draftInvoice, stockDeductions, reminderFlag },
                notifications
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                notifications
            };
        }
    }

    /**
     * ON_PAYMENT_SUCCESS trigger
     */
    onPaymentSuccess(data: PaymentSuccessData): AutomationResult<{
        receiptUrl: string;
        reviewUnlocked: boolean;
    }> {
        const notifications: NotificationPayload[] = [];

        try {
            // 1. Generate digital receipt
            const receiptUrl = this.generateReceiptUrl(data);

            // 2. Send thank you + post-op care notification
            notifications.push({
                type: 'fcm',
                templateId: 'THANK_YOU_POST_OP',
                recipient: data.patientId,
                recipientType: 'patient',
                data: {
                    receiptUrl,
                    invoiceId: data.invoiceId,
                    amount: data.amount.toString()
                }
            });

            // 3. Check if review button should be unlocked (after 2nd visit)
            const reviewUnlocked = data.visitCount >= 2;

            if (reviewUnlocked) {
                // Schedule review request for 2 hours later
                notifications.push({
                    type: 'fcm',
                    templateId: 'REVIEW_REQUEST',
                    recipient: data.patientId,
                    recipientType: 'patient',
                    data: {
                        clinicId: data.clinicId
                    },
                    scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000)
                });
            }

            // 4. Send receipt via SMS/WhatsApp
            notifications.push({
                type: 'sms',
                templateId: 'RECEIPT_SMS',
                recipient: data.patientId,
                recipientType: 'patient',
                data: {
                    amount: data.amount.toString(),
                    receiptUrl
                }
            });

            return {
                success: true,
                data: { receiptUrl, reviewUnlocked },
                notifications
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                notifications
            };
        }
    }

    /**
     * Create draft invoice from procedure
     */
    private createDraftInvoice(data: ProcedureCompletionData): DraftInvoice {
        const tariff = this.tariffs.get(data.procedureCode);
        const unitPrice = tariff?.basePrice || 0;
        const taxPercent = tariff?.taxPercent || 18; // Default GST

        const lineItem: InvoiceLineItem = {
            id: uuid(),
            description: data.procedureName,
            procedureCode: data.procedureCode,
            toothNumbers: data.toothNumbers,
            quantity: data.toothNumbers.length || 1,
            unitPrice,
            total: unitPrice * (data.toothNumbers.length || 1)
        };

        const subtotal = lineItem.total;
        const taxAmount = Math.round(subtotal * (taxPercent / 100));

        return {
            id: `INV-${uuid().slice(0, 8).toUpperCase()}`,
            patientId: data.patientId,
            clinicId: data.clinicId,
            procedureId: data.procedureId,
            lineItems: [lineItem],
            subtotal,
            taxAmount,
            discountAmount: 0,
            total: subtotal + taxAmount,
            status: 'draft',
            createdAt: new Date()
        };
    }

    /**
     * Deduct stock items
     */
    private deductStockItems(data: ProcedureCompletionData): StockDeduction[] {
        const deductions: StockDeduction[] = [];

        for (const usage of data.stockItemsUsed) {
            const item = this.stockItems.get(usage.itemId);
            if (!item) continue;

            const previousStock = item.currentStock;
            const newStock = Math.max(0, previousStock - usage.quantity);

            // Update stock in memory (should persist to DB)
            item.currentStock = newStock;

            deductions.push({
                id: uuid(),
                itemId: usage.itemId,
                itemName: item.name,
                quantity: usage.quantity,
                previousStock,
                newStock,
                procedureId: data.procedureId,
                deductedAt: new Date(),
                belowThreshold: newStock < item.minThreshold
            });
        }

        return deductions;
    }

    /**
     * Create multi-sitting reminder
     */
    private createMultiSittingReminder(data: ProcedureCompletionData): ReminderFlag {
        const nextSitting = (data.sittingNumber || 1) + 1;

        return {
            id: uuid(),
            type: 'MULTI_SITTING_FOLLOWUP',
            patientId: data.patientId,
            patientName: '', // Should be fetched
            procedureId: data.procedureId,
            procedureName: data.procedureName,
            targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week later
            assignedTo: 'receptionist',
            message: `Book Sitting ${nextSitting}/${data.totalSittings} for ${data.procedureName}`,
            acknowledged: false,
            createdAt: new Date()
        };
    }

    /**
     * Generate receipt URL
     */
    private generateReceiptUrl(data: PaymentSuccessData): string {
        return `/api/receipts/${data.paymentId}`;
    }
}

export const automationEngine = new AutomationEngine();
