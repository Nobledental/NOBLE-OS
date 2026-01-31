/**
 * Phase 27: Subscription & Wallet Engine
 * 
 * The "Netflix" of Dentistry - Recurring membership plans with benefit tracking
 */

import { v4 as uuid } from 'uuid';

// =============================================================================
// TYPES
// =============================================================================

export interface MembershipPlan {
    id: string;
    clinicId: string;
    name: string;
    description: string;
    price: number;
    duration: 'MONTHLY' | 'QUARTERLY' | 'BIANNUAL' | 'ANNUAL';
    durationMonths: number;

    // Benefits
    benefits: MembershipBenefit[];

    // Discounts
    treatmentDiscount: number; // Percentage off all treatments
    emergencyDiscount: number; // Percentage off emergency visits

    // Status
    isActive: boolean;
    maxMembers?: number;
    currentMembers: number;

    // Display
    featured: boolean;
    badgeText?: string;
    color?: string;
}

export interface MembershipBenefit {
    id: string;
    type: 'FREE_TREATMENT' | 'FREE_CONSULTATION' | 'FREE_XRAY' | 'DISCOUNT' | 'PRIORITY_BOOKING' | 'FAMILY_DISCOUNT';
    procedureCode?: string;
    procedureName: string;
    quantity: number; // Number of times benefit can be used
    description: string;
}

export interface PatientMembership {
    id: string;
    patientId: string;
    patientName: string;
    patientPhone: string;
    planId: string;
    planName: string;
    clinicId: string;

    // Subscription
    startDate: Date;
    endDate: Date;
    renewalDate: Date;
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING_RENEWAL';

    // Benefits usage
    benefitsUsage: BenefitUsage[];

    // Payment
    totalPaid: number;
    paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'AUTO_DEBIT';
    autoRenewal: boolean;

    // History
    renewalHistory: Array<{
        renewedAt: Date;
        amountPaid: number;
        paymentMethod: string;
        previousEndDate: Date;
        newEndDate: Date;
    }>;
}

export interface BenefitUsage {
    benefitId: string;
    benefitType: MembershipBenefit['type'];
    procedureName: string;
    totalQuantity: number;
    usedQuantity: number;
    remainingQuantity: number;
    usageHistory: Array<{
        usedAt: Date;
        appointmentId: string;
        procedureCode: string;
        savedAmount: number;
    }>;
}

export interface WalletTransaction {
    id: string;
    patientId: string;
    clinicId: string;
    type: 'CREDIT' | 'DEBIT' | 'REFUND' | 'MEMBERSHIP_PAYMENT' | 'MEMBERSHIP_BENEFIT';
    amount: number;
    balanceAfter: number;
    description: string;
    referenceId?: string;
    referenceType?: 'APPOINTMENT' | 'MEMBERSHIP' | 'REFUND' | 'MANUAL';
    createdAt: Date;
    createdBy?: string;
}

export interface PatientWallet {
    id: string;
    patientId: string;
    clinicId: string;
    currentBalance: number;
    totalCredits: number;
    totalDebits: number;
    transactions: WalletTransaction[];
    lastUpdated: Date;
}

export interface MembershipInvite {
    id: string;
    patientId: string;
    patientName: string;
    clinicId: string;
    planId: string;
    planName: string;
    reason: string;
    ltvScore: number;
    invitedAt: Date;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
    respondedAt?: Date;
    expiresAt: Date;
    specialOffer?: {
        discountPercent: number;
        bonusBenefits: string[];
        validUntil: Date;
    };
}

// =============================================================================
// SAMPLE MEMBERSHIP PLANS
// =============================================================================

export const DEFAULT_MEMBERSHIP_PLANS: Omit<MembershipPlan, 'id' | 'clinicId' | 'currentMembers'>[] = [
    {
        name: 'Noble Care Essential',
        description: 'Perfect for maintaining your dental health with regular checkups',
        price: 1499,
        duration: 'ANNUAL',
        durationMonths: 12,
        benefits: [
            {
                id: 'ESS_CLEANING_1',
                type: 'FREE_TREATMENT',
                procedureCode: 'SCALING',
                procedureName: 'Dental Cleaning',
                quantity: 2,
                description: '2 Free dental cleanings per year'
            },
            {
                id: 'ESS_CHECKUP',
                type: 'FREE_CONSULTATION',
                procedureName: 'Dental Check-up',
                quantity: 2,
                description: '2 Free dental check-ups per year'
            }
        ],
        treatmentDiscount: 10,
        emergencyDiscount: 15,
        isActive: true,
        featured: false
    },
    {
        name: 'Noble Care Plus',
        description: 'Comprehensive coverage for complete dental wellness',
        price: 2999,
        duration: 'ANNUAL',
        durationMonths: 12,
        benefits: [
            {
                id: 'PLUS_CLEANING',
                type: 'FREE_TREATMENT',
                procedureCode: 'SCALING',
                procedureName: 'Dental Cleaning',
                quantity: 2,
                description: '2 Free dental cleanings per year'
            },
            {
                id: 'PLUS_XRAY',
                type: 'FREE_XRAY',
                procedureCode: 'XRAY_FULL',
                procedureName: 'Full Mouth X-Ray',
                quantity: 1,
                description: '1 Free full mouth X-Ray per year'
            },
            {
                id: 'PLUS_CONSULT',
                type: 'FREE_CONSULTATION',
                procedureName: 'Dental Consultation',
                quantity: 4,
                description: '4 Free consultations per year'
            },
            {
                id: 'PLUS_PRIORITY',
                type: 'PRIORITY_BOOKING',
                procedureName: 'Priority Appointments',
                quantity: -1, // Unlimited
                description: 'Priority slot booking'
            }
        ],
        treatmentDiscount: 15,
        emergencyDiscount: 25,
        isActive: true,
        featured: true,
        badgeText: 'Most Popular',
        color: '#4F46E5'
    },
    {
        name: 'Noble Care Family',
        description: 'Cover your entire family with one plan',
        price: 4999,
        duration: 'ANNUAL',
        durationMonths: 12,
        benefits: [
            {
                id: 'FAM_CLEANING',
                type: 'FREE_TREATMENT',
                procedureCode: 'SCALING',
                procedureName: 'Dental Cleaning',
                quantity: 8,
                description: '8 Free dental cleanings (for up to 4 family members)'
            },
            {
                id: 'FAM_XRAY',
                type: 'FREE_XRAY',
                procedureCode: 'XRAY_FULL',
                procedureName: 'Full Mouth X-Ray',
                quantity: 4,
                description: '4 Free X-Rays per year'
            },
            {
                id: 'FAM_CONSULT',
                type: 'FREE_CONSULTATION',
                procedureName: 'Dental Consultation',
                quantity: 12,
                description: '12 Free consultations per year'
            },
            {
                id: 'FAM_DISCOUNT',
                type: 'FAMILY_DISCOUNT',
                procedureName: 'Family Discount',
                quantity: -1,
                description: 'Additional 5% off for family members'
            }
        ],
        treatmentDiscount: 20,
        emergencyDiscount: 30,
        isActive: true,
        featured: false,
        badgeText: 'Best Value',
        color: '#059669'
    }
];

// =============================================================================
// SUBSCRIPTION ENGINE SERVICE
// =============================================================================

export class SubscriptionEngineService {
    private plans: Map<string, MembershipPlan> = new Map();
    private memberships: Map<string, PatientMembership> = new Map();
    private wallets: Map<string, PatientWallet> = new Map();
    private invites: MembershipInvite[] = [];

    /**
     * Create a membership plan
     */
    createPlan(
        clinicId: string,
        plan: Omit<MembershipPlan, 'id' | 'clinicId' | 'currentMembers'>
    ): MembershipPlan {
        const newPlan: MembershipPlan = {
            id: uuid(),
            clinicId,
            currentMembers: 0,
            ...plan
        };
        this.plans.set(newPlan.id, newPlan);
        return newPlan;
    }

    /**
     * Get available plans for a clinic
     */
    getAvailablePlans(clinicId: string): MembershipPlan[] {
        const plans: MembershipPlan[] = [];
        this.plans.forEach(plan => {
            if (plan.clinicId === clinicId && plan.isActive) {
                if (!plan.maxMembers || plan.currentMembers < plan.maxMembers) {
                    plans.push(plan);
                }
            }
        });
        return plans.sort((a, b) => a.price - b.price);
    }

    /**
     * Subscribe a patient to a plan
     */
    subscribeToPlan(
        patientId: string,
        patientName: string,
        patientPhone: string,
        planId: string,
        clinicId: string,
        paymentMethod: PatientMembership['paymentMethod'],
        autoRenewal: boolean = true
    ): PatientMembership | { error: string } {
        const plan = this.plans.get(planId);
        if (!plan) return { error: 'Plan not found' };
        if (plan.maxMembers && plan.currentMembers >= plan.maxMembers) {
            return { error: 'Plan is at maximum capacity' };
        }

        // Check if already subscribed
        const existing = this.getMembershipByPatient(patientId, clinicId);
        if (existing && existing.status === 'ACTIVE') {
            return { error: 'Patient already has an active membership' };
        }

        const now = new Date();
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + plan.durationMonths);

        // Initialize benefit usage
        const benefitsUsage: BenefitUsage[] = plan.benefits.map(benefit => ({
            benefitId: benefit.id,
            benefitType: benefit.type,
            procedureName: benefit.procedureName,
            totalQuantity: benefit.quantity,
            usedQuantity: 0,
            remainingQuantity: benefit.quantity === -1 ? -1 : benefit.quantity,
            usageHistory: []
        }));

        const membership: PatientMembership = {
            id: uuid(),
            patientId,
            patientName,
            patientPhone,
            planId,
            planName: plan.name,
            clinicId,
            startDate: now,
            endDate,
            renewalDate: new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days before expiry
            status: 'ACTIVE',
            benefitsUsage,
            totalPaid: plan.price,
            paymentMethod,
            autoRenewal,
            renewalHistory: []
        };

        this.memberships.set(membership.id, membership);
        plan.currentMembers++;
        this.plans.set(planId, plan);

        return membership;
    }

    /**
     * Use a membership benefit
     */
    useBenefit(
        membershipId: string,
        benefitId: string,
        appointmentId: string,
        procedureCode: string,
        savedAmount: number
    ): { success: boolean; remainingUses: number; error?: string } {
        const membership = this.memberships.get(membershipId);
        if (!membership) return { success: false, remainingUses: 0, error: 'Membership not found' };
        if (membership.status !== 'ACTIVE') return { success: false, remainingUses: 0, error: 'Membership not active' };

        const benefit = membership.benefitsUsage.find(b => b.benefitId === benefitId);
        if (!benefit) return { success: false, remainingUses: 0, error: 'Benefit not found' };
        if (benefit.remainingQuantity === 0) return { success: false, remainingUses: 0, error: 'No remaining uses for this benefit' };

        // Decrement usage if not unlimited
        if (benefit.remainingQuantity > 0) {
            benefit.usedQuantity++;
            benefit.remainingQuantity--;
        }

        benefit.usageHistory.push({
            usedAt: new Date(),
            appointmentId,
            procedureCode,
            savedAmount
        });

        this.memberships.set(membershipId, membership);

        return {
            success: true,
            remainingUses: benefit.remainingQuantity
        };
    }

    /**
     * Get membership by patient
     */
    getMembershipByPatient(patientId: string, clinicId: string): PatientMembership | undefined {
        let result: PatientMembership | undefined;
        this.memberships.forEach(membership => {
            if (membership.patientId === patientId && membership.clinicId === clinicId) {
                result = membership;
            }
        });
        return result;
    }

    /**
     * Get memberships due for renewal
     */
    getMembershipsForRenewal(clinicId: string): PatientMembership[] {
        const now = new Date();
        const renewals: PatientMembership[] = [];

        this.memberships.forEach(membership => {
            if (membership.clinicId === clinicId &&
                membership.status === 'ACTIVE' &&
                membership.renewalDate <= now) {
                renewals.push(membership);
            }
        });

        return renewals;
    }

    /**
     * Renew membership
     */
    renewMembership(
        membershipId: string,
        amountPaid: number,
        paymentMethod: string
    ): PatientMembership | { error: string } {
        const membership = this.memberships.get(membershipId);
        if (!membership) return { error: 'Membership not found' };

        const plan = this.plans.get(membership.planId);
        if (!plan) return { error: 'Plan not found' };

        const previousEndDate = membership.endDate;
        const newEndDate = new Date(previousEndDate);
        newEndDate.setMonth(newEndDate.getMonth() + plan.durationMonths);

        membership.endDate = newEndDate;
        membership.renewalDate = new Date(newEndDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        membership.status = 'ACTIVE';
        membership.totalPaid += amountPaid;

        // Reset benefits for new period
        membership.benefitsUsage = plan.benefits.map(benefit => ({
            benefitId: benefit.id,
            benefitType: benefit.type,
            procedureName: benefit.procedureName,
            totalQuantity: benefit.quantity,
            usedQuantity: 0,
            remainingQuantity: benefit.quantity === -1 ? -1 : benefit.quantity,
            usageHistory: []
        }));

        membership.renewalHistory.push({
            renewedAt: new Date(),
            amountPaid,
            paymentMethod,
            previousEndDate,
            newEndDate
        });

        this.memberships.set(membershipId, membership);
        return membership;
    }

    /**
     * Invite high-value patient to membership
     */
    inviteToMembership(
        patientId: string,
        patientName: string,
        clinicId: string,
        planId: string,
        ltvScore: number,
        reason: string,
        specialOffer?: MembershipInvite['specialOffer']
    ): MembershipInvite {
        const plan = this.plans.get(planId);
        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setDate(expiresAt.getDate() + 30); // 30-day validity

        const invite: MembershipInvite = {
            id: uuid(),
            patientId,
            patientName,
            clinicId,
            planId,
            planName: plan?.name || 'Membership',
            reason,
            ltvScore,
            invitedAt: now,
            status: 'PENDING',
            expiresAt,
            specialOffer
        };

        this.invites.push(invite);
        return invite;
    }

    /**
     * Get pending invites for a patient
     */
    getPendingInvites(patientId: string): MembershipInvite[] {
        const now = new Date();
        return this.invites.filter(i =>
            i.patientId === patientId &&
            i.status === 'PENDING' &&
            i.expiresAt > now
        );
    }

    /**
     * Identify high-value patients for membership invites
     */
    identifyMembershipCandidates(
        patients: Array<{
            id: string;
            name: string;
            totalSpend: number;
            visitCount: number;
            lastVisit: Date;
            hasActiveMembership: boolean;
        }>,
        clinicId: string
    ): Array<{
        patientId: string;
        patientName: string;
        score: number;
        reason: string;
        recommendedPlan: MembershipPlan | undefined;
    }> {
        const candidates: Array<{
            patientId: string;
            patientName: string;
            score: number;
            reason: string;
            recommendedPlan: MembershipPlan | undefined;
        }> = [];

        const plans = this.getAvailablePlans(clinicId);
        const popularPlan = plans.find(p => p.featured) || plans[0];

        for (const patient of patients) {
            if (patient.hasActiveMembership) continue;

            // Calculate score based on engagement
            let score = 0;
            let reasons: string[] = [];

            if (patient.totalSpend > 10000) {
                score += 30;
                reasons.push('High spender');
            }
            if (patient.visitCount >= 3) {
                score += 25;
                reasons.push('Regular visitor');
            }
            if (patient.lastVisit > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) {
                score += 20;
                reasons.push('Recently active');
            }
            if (patient.totalSpend / patient.visitCount > 3000) {
                score += 25;
                reasons.push('High average spend');
            }

            if (score >= 50) {
                candidates.push({
                    patientId: patient.id,
                    patientName: patient.name,
                    score,
                    reason: reasons.join(', '),
                    recommendedPlan: popularPlan
                });
            }
        }

        return candidates.sort((a, b) => b.score - a.score);
    }

    /**
     * Get wallet for a patient
     */
    getWallet(patientId: string, clinicId: string): PatientWallet {
        const key = `${patientId}:${clinicId}`;
        let wallet = this.wallets.get(key);

        if (!wallet) {
            wallet = {
                id: uuid(),
                patientId,
                clinicId,
                currentBalance: 0,
                totalCredits: 0,
                totalDebits: 0,
                transactions: [],
                lastUpdated: new Date()
            };
            this.wallets.set(key, wallet);
        }

        return wallet;
    }

    /**
     * Add credit to wallet
     */
    addCredit(
        patientId: string,
        clinicId: string,
        amount: number,
        description: string,
        referenceId?: string,
        referenceType?: WalletTransaction['referenceType'],
        createdBy?: string
    ): WalletTransaction {
        const wallet = this.getWallet(patientId, clinicId);
        const newBalance = wallet.currentBalance + amount;

        const transaction: WalletTransaction = {
            id: uuid(),
            patientId,
            clinicId,
            type: 'CREDIT',
            amount,
            balanceAfter: newBalance,
            description,
            referenceId,
            referenceType,
            createdAt: new Date(),
            createdBy
        };

        wallet.currentBalance = newBalance;
        wallet.totalCredits += amount;
        wallet.transactions.push(transaction);
        wallet.lastUpdated = new Date();

        this.wallets.set(`${patientId}:${clinicId}`, wallet);
        return transaction;
    }

    /**
     * Deduct from wallet
     */
    deductPayment(
        patientId: string,
        clinicId: string,
        amount: number,
        description: string,
        referenceId?: string,
        referenceType?: WalletTransaction['referenceType']
    ): WalletTransaction | { error: string } {
        const wallet = this.getWallet(patientId, clinicId);

        if (wallet.currentBalance < amount) {
            return { error: 'Insufficient balance' };
        }

        const newBalance = wallet.currentBalance - amount;

        const transaction: WalletTransaction = {
            id: uuid(),
            patientId,
            clinicId,
            type: 'DEBIT',
            amount,
            balanceAfter: newBalance,
            description,
            referenceId,
            referenceType,
            createdAt: new Date()
        };

        wallet.currentBalance = newBalance;
        wallet.totalDebits += amount;
        wallet.transactions.push(transaction);
        wallet.lastUpdated = new Date();

        this.wallets.set(`${patientId}:${clinicId}`, wallet);
        return transaction;
    }
}

export const subscriptionEngineService = new SubscriptionEngineService();
