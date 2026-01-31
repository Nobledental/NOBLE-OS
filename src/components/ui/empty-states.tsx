'use client';

import { Coffee, Calendar, FileText, Users, Inbox, Search, Heart, Sparkles } from 'lucide-react';

// =============================================================================
// EMPTY STATE TYPES
// =============================================================================

export type EmptyStateType =
    | 'patients'
    | 'appointments'
    | 'invoices'
    | 'search'
    | 'notifications'
    | 'messages'
    | 'reports'
    | 'generic';

interface EmptyStateConfig {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
}

// =============================================================================
// EMPTY STATE CONFIGURATIONS
// =============================================================================

const emptyStateConfigs: Record<EmptyStateType, EmptyStateConfig> = {
    patients: {
        icon: <Users className="w-16 h-16 text-blue-400" />,
        title: "No patients yet",
        description: "Time for a coffee? ☕ Your first patient is just a click away.",
        actionLabel: "Add First Patient",
        actionHref: "/dashboard/patients/new"
    },
    appointments: {
        icon: <Calendar className="w-16 h-16 text-purple-400" />,
        title: "Calendar's looking empty",
        description: "A quiet day ahead. Perfect for planning or catching up on records.",
        actionLabel: "Book Appointment",
        actionHref: "/dashboard/appointments/new"
    },
    invoices: {
        icon: <FileText className="w-16 h-16 text-green-400" />,
        title: "No invoices yet",
        description: "All clear on the billing front. Time to make some smiles! 😊",
        actionLabel: "Create Invoice",
        actionHref: "/dashboard/billing/new"
    },
    search: {
        icon: <Search className="w-16 h-16 text-slate-400" />,
        title: "No results found",
        description: "Try a different search term or check for typos.",
    },
    notifications: {
        icon: <Inbox className="w-16 h-16 text-amber-400" />,
        title: "All caught up!",
        description: "No new notifications. You're doing great! ⭐",
    },
    messages: {
        icon: <Heart className="w-16 h-16 text-pink-400" />,
        title: "No messages",
        description: "Start a conversation with your patients or team.",
        actionLabel: "New Message"
    },
    reports: {
        icon: <Sparkles className="w-16 h-16 text-indigo-400" />,
        title: "No reports generated",
        description: "Analytics will appear here once you have some activity.",
    },
    generic: {
        icon: <Coffee className="w-16 h-16 text-orange-400" />,
        title: "Nothing here yet",
        description: "This space is waiting for something amazing.",
    }
};

// =============================================================================
// EMPTY STATE COMPONENT
// =============================================================================

interface EmptyStateProps {
    type?: EmptyStateType;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    className?: string;
}

export default function EmptyState({
    type = 'generic',
    title,
    description,
    icon,
    actionLabel,
    actionHref,
    onAction,
    className = ''
}: EmptyStateProps) {
    const config = emptyStateConfigs[type];

    const finalIcon = icon || config.icon;
    const finalTitle = title || config.title;
    const finalDescription = description || config.description;
    const finalActionLabel = actionLabel || config.actionLabel;
    const finalActionHref = actionHref || config.actionHref;

    return (
        <div className={`empty-state glass-card p-8 ${className}`}>
            <div className="animate-spring-in">
                <div className="empty-state-icon mx-auto">
                    {finalIcon}
                </div>

                <h3 className="empty-state-title text-xl font-semibold mb-2">
                    {finalTitle}
                </h3>

                <p className="empty-state-description text-muted-foreground mb-6 max-w-xs">
                    {finalDescription}
                </p>

                {(finalActionLabel && (finalActionHref || onAction)) && (
                    <button
                        onClick={onAction || (() => window.location.href = finalActionHref!)}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-soft-md hover:shadow-soft-lg transition-all spring-interactive"
                    >
                        {finalActionLabel}
                    </button>
                )}
            </div>
        </div>
    );
}

// =============================================================================
// INLINE EMPTY STATE (for tables/lists)
// =============================================================================

interface InlineEmptyStateProps {
    message: string;
    icon?: React.ReactNode;
    className?: string;
}

export function InlineEmptyState({
    message,
    icon,
    className = ''
}: InlineEmptyStateProps) {
    return (
        <div className={`flex items-center justify-center gap-3 py-8 text-muted-foreground ${className}`}>
            {icon || <Coffee className="w-5 h-5" />}
            <span>{message}</span>
        </div>
    );
}

// =============================================================================
// LOADING SKELETON (for empty loading states)
// =============================================================================

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    className = '',
    variant = 'rectangular',
    width,
    height
}: SkeletonProps) {
    const baseClasses = 'animate-pulse bg-muted';

    const variantClasses = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
}

// =============================================================================
// CARD SKELETON
// =============================================================================

export function CardSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`glass-card p-4 space-y-3 ${className}`}>
            <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="space-y-2 flex-1">
                    <Skeleton height={16} width="60%" />
                    <Skeleton height={12} width="40%" />
                </div>
            </div>
            <Skeleton height={60} />
            <div className="flex gap-2">
                <Skeleton height={32} width={80} />
                <Skeleton height={32} width={80} />
            </div>
        </div>
    );
}

// =============================================================================
// TABLE SKELETON
// =============================================================================

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                <Skeleton height={16} width="20%" />
                <Skeleton height={16} width="30%" />
                <Skeleton height={16} width="25%" />
                <Skeleton height={16} width="15%" />
            </div>

            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 p-3 border-b">
                    <Skeleton height={14} width="20%" />
                    <Skeleton height={14} width="30%" />
                    <Skeleton height={14} width="25%" />
                    <Skeleton height={14} width="15%" />
                </div>
            ))}
        </div>
    );
}
