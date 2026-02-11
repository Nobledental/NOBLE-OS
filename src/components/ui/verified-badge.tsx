import React from 'react';
import { Check, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSchedulingStore } from '@/lib/scheduling-store';

interface VerifiedBadgeProps {
    className?: string;
    showLabel?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ className, showLabel = true }) => {
    const { clinicDetails } = useSchedulingStore();

    if (!clinicDetails?.isVerified) return null;

    return (
        <div className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 border border-green-200 text-green-700",
            className
        )}>
            <div className="bg-green-600 rounded-full p-0.5">
                <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
            </div>
            {showLabel && (
                <span className="text-[10px] font-black uppercase tracking-wider leading-none pt-px">
                    Verified
                </span>
            )}
        </div>
    );
};
