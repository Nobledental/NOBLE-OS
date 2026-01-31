/**
 * Phase 25: Offer Engine
 * 
 * Percentage, flat, and membership offers with auto-apply to billing
 */

import { v4 as uuid } from 'uuid';

// =============================================================================
// TYPES
// =============================================================================

export type OfferType = 'PERCENTAGE' | 'FLAT' | 'MEMBERSHIP';
export type OfferStatus = 'draft' | 'active' | 'paused' | 'expired' | 'deleted';

export interface Offer {
    id: string;
    clinicId: string;
    code: string;
    title: string;
    description: string;
    type: OfferType;

    // Discount details
    discountValue: number; // Percentage (0-100) or flat amount
    maxDiscountAmount?: number; // Cap for percentage discounts
    minPurchaseAmount?: number; // Minimum bill amount

    // Targeting
    targetProcedures: string[]; // Empty = all
    targetPatientTypes: ('new' | 'repeat' | 'referral' | 'all')[];
    targetDays: number[]; // 0-6 for days of week, empty = all
    targetTimeRange?: { start: string; end: string };

    // Membership specifics
    membershipDetails?: {
        duration: number; // months
        freeConsultations: number;
        procedures: Array<{
            code: string;
            discountPercent: number;
        }>;
        benefits: string[];
        price: number;
    };

    // Validity
    validFrom: Date;
    validUntil: Date;
    usageLimit?: number;
    usageCount: number;
    perPatientLimit?: number;

    // Status
    status: OfferStatus;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;

    // Analytics
    claimsCount: number;
    totalDiscountGiven: number;
    conversionRate?: number;
}

export interface OfferClaim {
    id: string;
    offerId: string;
    offerCode: string;
    patientId: string;
    invoiceId: string;
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
    claimedAt: Date;
}

export interface MembershipSubscription {
    id: string;
    patientId: string;
    patientName: string;
    offerId: string;
    membershipName: string;
    startDate: Date;
    endDate: Date;
    consultationsUsed: number;
    consultationsTotal: number;
    status: 'active' | 'expired' | 'cancelled';
    benefits: string[];
}

// =============================================================================
// OFFER ENGINE SERVICE
// =============================================================================

export class OfferEngineService {
    /**
     * Create a new offer
     */
    createOffer(
        clinicId: string,
        createdBy: string,
        params: Omit<Offer, 'id' | 'usageCount' | 'claimsCount' | 'totalDiscountGiven' | 'createdAt' | 'updatedAt' | 'status'>
    ): Offer {
        const code = params.code || this.generateOfferCode(params.type);

        return {
            ...params,
            id: uuid(),
            clinicId,
            code,
            usageCount: 0,
            claimsCount: 0,
            totalDiscountGiven: 0,
            status: 'draft',
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy
        };
    }

    /**
     * Generate offer code
     */
    generateOfferCode(type: OfferType): string {
        const prefix = type === 'MEMBERSHIP' ? 'MBR' : type === 'PERCENTAGE' ? 'PCT' : 'FLT';
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${random}`;
    }

    /**
     * Validate if offer is applicable
     */
    validateOfferApplicability(
        offer: Offer,
        context: {
            patientType: 'new' | 'repeat' | 'referral';
            procedureCodes: string[];
            billAmount: number;
            dayOfWeek: number;
            time: string;
            patientOfferUsage?: number;
        }
    ): { valid: boolean; reason?: string } {
        const now = new Date();

        // Check status
        if (offer.status !== 'active') {
            return { valid: false, reason: 'Offer is not active' };
        }

        // Check validity dates
        if (now < offer.validFrom) {
            return { valid: false, reason: 'Offer not yet started' };
        }
        if (now > offer.validUntil) {
            return { valid: false, reason: 'Offer has expired' };
        }

        // Check usage limit
        if (offer.usageLimit && offer.usageCount >= offer.usageLimit) {
            return { valid: false, reason: 'Offer usage limit reached' };
        }

        // Check per-patient limit
        if (offer.perPatientLimit && context.patientOfferUsage &&
            context.patientOfferUsage >= offer.perPatientLimit) {
            return { valid: false, reason: 'You have already used this offer' };
        }

        // Check minimum purchase
        if (offer.minPurchaseAmount && context.billAmount < offer.minPurchaseAmount) {
            return { valid: false, reason: `Minimum purchase of ₹${offer.minPurchaseAmount} required` };
        }

        // Check patient type
        if (offer.targetPatientTypes.length > 0 &&
            !offer.targetPatientTypes.includes('all') &&
            !offer.targetPatientTypes.includes(context.patientType)) {
            return { valid: false, reason: 'Offer not applicable for your patient type' };
        }

        // Check target procedures
        if (offer.targetProcedures.length > 0 &&
            !offer.targetProcedures.some(p => context.procedureCodes.includes(p))) {
            return { valid: false, reason: 'Offer not applicable for selected procedures' };
        }

        // Check target days
        if (offer.targetDays.length > 0 &&
            !offer.targetDays.includes(context.dayOfWeek)) {
            return { valid: false, reason: 'Offer not valid on this day' };
        }

        // Check time range
        if (offer.targetTimeRange) {
            if (context.time < offer.targetTimeRange.start ||
                context.time > offer.targetTimeRange.end) {
                return { valid: false, reason: 'Offer not valid at this time' };
            }
        }

        return { valid: true };
    }

    /**
     * Calculate discount amount
     */
    calculateDiscount(
        offer: Offer,
        billAmount: number,
        procedureBreakdown?: Map<string, number>
    ): number {
        if (offer.type === 'FLAT') {
            return Math.min(offer.discountValue, billAmount);
        }

        if (offer.type === 'PERCENTAGE') {
            let discountableAmount = billAmount;

            // If targeting specific procedures, only discount those
            if (offer.targetProcedures.length > 0 && procedureBreakdown) {
                discountableAmount = 0;
                for (const [code, amount] of procedureBreakdown.entries()) {
                    if (offer.targetProcedures.includes(code)) {
                        discountableAmount += amount;
                    }
                }
            }

            let discount = (discountableAmount * offer.discountValue) / 100;

            // Apply max cap
            if (offer.maxDiscountAmount) {
                discount = Math.min(discount, offer.maxDiscountAmount);
            }

            return Math.round(discount);
        }

        // Membership - discounts are applied per procedure
        if (offer.type === 'MEMBERSHIP' && offer.membershipDetails && procedureBreakdown) {
            let totalDiscount = 0;
            for (const [code, amount] of procedureBreakdown.entries()) {
                const memberDiscount = offer.membershipDetails.procedures.find(p => p.code === code);
                if (memberDiscount) {
                    totalDiscount += (amount * memberDiscount.discountPercent) / 100;
                }
            }
            return Math.round(totalDiscount);
        }

        return 0;
    }

    /**
     * Apply offer to invoice
     */
    applyOffer(
        offer: Offer,
        patientId: string,
        invoiceId: string,
        originalAmount: number,
        procedureBreakdown?: Map<string, number>
    ): OfferClaim {
        const discountAmount = this.calculateDiscount(offer, originalAmount, procedureBreakdown);
        const finalAmount = originalAmount - discountAmount;

        const claim: OfferClaim = {
            id: uuid(),
            offerId: offer.id,
            offerCode: offer.code,
            patientId,
            invoiceId,
            originalAmount,
            discountAmount,
            finalAmount,
            claimedAt: new Date()
        };

        // Update offer stats (should be persisted)
        offer.usageCount++;
        offer.claimsCount++;
        offer.totalDiscountGiven += discountAmount;
        offer.updatedAt = new Date();

        return claim;
    }

    /**
     * Create membership subscription
     */
    createMembershipSubscription(
        offer: Offer,
        patientId: string,
        patientName: string
    ): MembershipSubscription | null {
        if (offer.type !== 'MEMBERSHIP' || !offer.membershipDetails) {
            return null;
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + offer.membershipDetails.duration);

        return {
            id: uuid(),
            patientId,
            patientName,
            offerId: offer.id,
            membershipName: offer.title,
            startDate,
            endDate,
            consultationsUsed: 0,
            consultationsTotal: offer.membershipDetails.freeConsultations,
            status: 'active',
            benefits: offer.membershipDetails.benefits
        };
    }

    /**
     * Get active offers for display in storefront
     */
    getStorefrontOffers(offers: Offer[]): Offer[] {
        const now = new Date();
        return offers.filter(o =>
            o.status === 'active' &&
            o.validFrom <= now &&
            o.validUntil >= now &&
            (!o.usageLimit || o.usageCount < o.usageLimit)
        );
    }

    /**
     * Auto-find best applicable offer
     */
    findBestOffer(
        offers: Offer[],
        context: {
            patientType: 'new' | 'repeat' | 'referral';
            procedureCodes: string[];
            billAmount: number;
            dayOfWeek: number;
            time: string;
        }
    ): Offer | null {
        const validOffers = offers.filter(o =>
            this.validateOfferApplicability(o, context).valid
        );

        if (validOffers.length === 0) return null;

        // Calculate discount for each and return the best one
        let bestOffer: Offer | null = null;
        let bestDiscount = 0;

        for (const offer of validOffers) {
            const discount = this.calculateDiscount(offer, context.billAmount);
            if (discount > bestDiscount) {
                bestDiscount = discount;
                bestOffer = offer;
            }
        }

        return bestOffer;
    }
}

export const offerEngineService = new OfferEngineService();
