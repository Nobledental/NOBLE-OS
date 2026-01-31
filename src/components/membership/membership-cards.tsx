'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Crown, Sparkles, Check, Gift, Calendar,
    CreditCard, ArrowRight, Users, Percent,
    Zap, Shield, Star, Clock
} from 'lucide-react';
import { MembershipPlan, PatientMembership, BenefitUsage } from '@/lib/subscription-engine';
import { hapticPatterns } from '@/components/gestures/ios-gestures';

// =============================================================================
// MEMBERSHIP PLAN CARD
// =============================================================================

interface MembershipPlanCardProps {
    plan: MembershipPlan;
    onSubscribe: () => void;
    isCurrentPlan?: boolean;
}

export function MembershipPlanCard({ plan, onSubscribe, isCurrentPlan }: MembershipPlanCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative"
        >
            <Card className={`p-6 overflow-hidden ${plan.featured
                    ? 'border-2 border-primary shadow-lg'
                    : 'border border-border'
                }`}>
                {/* Badge */}
                {plan.badgeText && (
                    <div
                        className="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-xl"
                        style={{ backgroundColor: plan.color || '#4F46E5' }}
                    >
                        {plan.badgeText}
                    </div>
                )}

                {/* Header */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-bold">{plan.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-bold">₹{plan.price.toLocaleString('en-IN')}</span>
                    <span className="text-muted-foreground">/{plan.duration.toLowerCase()}</span>
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-6">
                    {plan.benefits.map((benefit) => (
                        <div key={benefit.id} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{benefit.description}</span>
                        </div>
                    ))}
                    <div className="flex items-start gap-2">
                        <Percent className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{plan.treatmentDiscount}% off all treatments</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{plan.emergencyDiscount}% off emergency visits</span>
                    </div>
                </div>

                {/* CTA */}
                <Button
                    className="w-full"
                    variant={plan.featured ? 'default' : 'outline'}
                    disabled={isCurrentPlan}
                    onClick={() => {
                        hapticPatterns.successPulse();
                        onSubscribe();
                    }}
                >
                    {isCurrentPlan ? 'Current Plan' : 'Subscribe Now'}
                    {!isCurrentPlan && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
            </Card>
        </motion.div>
    );
}

// =============================================================================
// ACTIVE MEMBERSHIP CARD
// =============================================================================

interface ActiveMembershipCardProps {
    membership: PatientMembership;
    onRenew: () => void;
    onViewBenefits: () => void;
}

export function ActiveMembershipCard({
    membership,
    onRenew,
    onViewBenefits
}: ActiveMembershipCardProps) {
    const daysRemaining = Math.ceil(
        (membership.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    const isExpiringSoon = daysRemaining <= 30;

    return (
        <Card className="glass-card-heavy p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                        <Crown className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-bold">{membership.planName}</h3>
                        <Badge variant={membership.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {membership.status}
                        </Badge>
                    </div>
                </div>
                {membership.autoRenewal && (
                    <Badge variant="outline" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        Auto-Renew
                    </Badge>
                )}
            </div>

            {/* Expiry */}
            <div className={`p-3 rounded-lg mb-4 ${isExpiringSoon
                    ? 'bg-amber-100 dark:bg-amber-900/30'
                    : 'bg-muted/50'
                }`}>
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Valid until
                    </span>
                    <span className="font-medium">
                        {membership.endDate.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </span>
                </div>
                {isExpiringSoon && (
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                        ⚠️ Expiring in {daysRemaining} days
                    </p>
                )}
            </div>

            {/* Benefits Summary */}
            <div className="space-y-3 mb-4">
                <p className="text-sm font-medium">Your Benefits</p>
                {membership.benefitsUsage.slice(0, 3).map((benefit) => (
                    <BenefitUsageBar key={benefit.benefitId} benefit={benefit} />
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={onViewBenefits}>
                    <Gift className="w-4 h-4 mr-2" />
                    All Benefits
                </Button>
                {isExpiringSoon && (
                    <Button className="flex-1" onClick={onRenew}>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Renew Now
                    </Button>
                )}
            </div>
        </Card>
    );
}

// =============================================================================
// BENEFIT USAGE BAR
// =============================================================================

interface BenefitUsageBarProps {
    benefit: BenefitUsage;
    showDetails?: boolean;
}

export function BenefitUsageBar({ benefit, showDetails }: BenefitUsageBarProps) {
    const isUnlimited = benefit.totalQuantity === -1;
    const usagePercent = isUnlimited
        ? 0
        : (benefit.usedQuantity / benefit.totalQuantity) * 100;

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
                <span className="truncate">{benefit.procedureName}</span>
                <span className="text-muted-foreground text-xs">
                    {isUnlimited
                        ? 'Unlimited'
                        : `${benefit.usedQuantity}/${benefit.totalQuantity} used`
                    }
                </span>
            </div>
            {!isUnlimited && (
                <Progress value={usagePercent} className="h-1.5" />
            )}
            {showDetails && benefit.usageHistory.length > 0 && (
                <p className="text-xs text-muted-foreground">
                    Last used: {benefit.usageHistory[benefit.usageHistory.length - 1].usedAt.toLocaleDateString()}
                </p>
            )}
        </div>
    );
}

// =============================================================================
// MEMBERSHIP INVITE CARD
// =============================================================================

interface MembershipInviteCardProps {
    invite: {
        planName: string;
        reason: string;
        specialOffer?: {
            discountPercent: number;
            bonusBenefits: string[];
            validUntil: Date;
        };
        expiresAt: Date;
    };
    onAccept: () => void;
    onDecline: () => void;
}

export function MembershipInviteCard({ invite, onAccept, onDecline }: MembershipInviteCardProps) {
    const daysLeft = Math.ceil(
        (invite.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Card className="glass-card-heavy p-6 border-2 border-primary/30">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-primary font-medium">EXCLUSIVE INVITE</p>
                        <h3 className="font-bold">Join {invite.planName}</h3>
                    </div>
                </div>

                {/* Reason */}
                <p className="text-sm text-muted-foreground mb-4">
                    {invite.reason}
                </p>

                {/* Special offer */}
                {invite.specialOffer && (
                    <div className="p-4 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Gift className="w-5 h-5 text-amber-600" />
                            <span className="font-bold text-amber-800 dark:text-amber-400">
                                Special Offer: {invite.specialOffer.discountPercent}% OFF
                            </span>
                        </div>
                        {invite.specialOffer.bonusBenefits.length > 0 && (
                            <ul className="text-sm text-amber-700 dark:text-amber-500 space-y-1">
                                {invite.specialOffer.bonusBenefits.map((b, i) => (
                                    <li key={i} className="flex items-center gap-1">
                                        <Check className="w-3 h-3" />
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Timer */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="w-4 h-4" />
                    <span>Offer expires in {daysLeft} days</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={onDecline}>
                        Maybe Later
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={() => {
                            hapticPatterns.successPulse();
                            onAccept();
                        }}
                    >
                        <Crown className="w-4 h-4 mr-2" />
                        Join Now
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}

// =============================================================================
// WALLET CARD
// =============================================================================

interface WalletCardProps {
    balance: number;
    patientName: string;
    recentTransactions: Array<{
        type: 'CREDIT' | 'DEBIT';
        amount: number;
        description: string;
        date: Date;
    }>;
    onAddFunds: () => void;
}

export function WalletCard({
    balance,
    patientName,
    recentTransactions,
    onAddFunds
}: WalletCardProps) {
    return (
        <Card className="overflow-hidden">
            {/* Balance section */}
            <div className="p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                <p className="text-sm opacity-80">Wallet Balance</p>
                <p className="text-4xl font-bold mt-1">
                    ₹{balance.toLocaleString('en-IN')}
                </p>
                <p className="text-sm opacity-80 mt-2">{patientName}</p>
            </div>

            {/* Transactions */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-sm">Recent Activity</p>
                    <Button variant="ghost" size="sm">View All</Button>
                </div>
                <div className="space-y-3">
                    {recentTransactions.slice(0, 3).map((tx, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${tx.type === 'CREDIT' ? 'bg-green-500' : 'bg-red-500'
                                    }`} />
                                <span className="truncate max-w-[180px]">{tx.description}</span>
                            </div>
                            <span className={tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}>
                                {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add funds */}
            <div className="p-4 border-t">
                <Button variant="outline" className="w-full" onClick={onAddFunds}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Funds
                </Button>
            </div>
        </Card>
    );
}

// =============================================================================
// MEMBERSHIP PLANS GRID
// =============================================================================

interface MembershipPlansGridProps {
    plans: MembershipPlan[];
    currentPlanId?: string;
    onSubscribe: (planId: string) => void;
}

export function MembershipPlansGrid({
    plans,
    currentPlanId,
    onSubscribe
}: MembershipPlansGridProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Crown className="w-6 h-6 text-amber-500" />
                    Noble Care Memberships
                </h2>
                <p className="text-muted-foreground mt-1">
                    Save more with our dental wellness plans
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <MembershipPlanCard
                        key={plan.id}
                        plan={plan}
                        isCurrentPlan={plan.id === currentPlanId}
                        onSubscribe={() => onSubscribe(plan.id)}
                    />
                ))}
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>500+ Members</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>4.9 Rating</span>
                </div>
            </div>
        </div>
    );
}
