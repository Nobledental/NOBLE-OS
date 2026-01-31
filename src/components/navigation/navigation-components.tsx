'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

// =============================================================================
// HAPTIC FEEDBACK UTILITY
// =============================================================================

export function triggerHaptic(duration: number = 10) {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

// =============================================================================
// SOFT BACK BUTTON
// =============================================================================

interface SoftBackButtonProps {
    href?: string;
    label?: string;
    className?: string;
    onBack?: () => void;
}

export function SoftBackButton({
    href,
    label = 'Back',
    className = '',
    onBack
}: SoftBackButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        triggerHaptic(10);
        if (onBack) {
            onBack();
        } else if (href) {
            router.push(href);
        } else {
            router.back();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`soft-back-btn spring-interactive haptic-touch ${className}`}
        >
            <ChevronLeft className="w-4 h-4" />
            <span>{label}</span>
        </button>
    );
}

// =============================================================================
// BREADCRUMBS
// =============================================================================

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
    showHome?: boolean;
}

export function Breadcrumbs({ items, className = '', showHome = true }: BreadcrumbsProps) {
    const allItems = showHome
        ? [{ label: 'Home', href: '/dashboard' }, ...items]
        : items;

    return (
        <nav className={`breadcrumbs ${className}`} aria-label="Breadcrumb">
            {allItems.map((item, index) => (
                <span key={index} className="breadcrumb-item">
                    {index > 0 && (
                        <ChevronRight className="breadcrumb-separator w-4 h-4" />
                    )}
                    {index === 0 && showHome && (
                        <Home className="w-4 h-4 mr-1" />
                    )}
                    {item.href && index < allItems.length - 1 ? (
                        <Link
                            href={item.href}
                            onClick={() => triggerHaptic(10)}
                            className="hover:underline"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className={index === allItems.length - 1 ? 'breadcrumb-current' : ''}>
                            {item.label}
                        </span>
                    )}
                </span>
            ))}
        </nav>
    );
}

// =============================================================================
// PAGE HEADER WITH BACK & BREADCRUMBS
// =============================================================================

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: BreadcrumbItem[];
    showBack?: boolean;
    backHref?: string;
    backLabel?: string;
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    subtitle,
    breadcrumbs,
    showBack = true,
    backHref,
    backLabel,
    actions,
    className = ''
}: PageHeaderProps) {
    return (
        <header className={`space-y-2 mb-6 ${className}`}>
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs items={breadcrumbs} />
            )}

            {/* Title Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {showBack && (
                        <SoftBackButton href={backHref} label={backLabel} />
                    )}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                        {subtitle && (
                            <p className="text-muted-foreground">{subtitle}</p>
                        )}
                    </div>
                </div>

                {actions && (
                    <div className="flex items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </header>
    );
}

// =============================================================================
// iOS BOTTOM NAVIGATION
// =============================================================================

interface NavItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    badge?: number;
}

interface IOSBottomNavProps {
    items: NavItem[];
    activeHref: string;
}

export function IOSBottomNav({ items, activeHref }: IOSBottomNavProps) {
    return (
        <nav className="ios-bottom-nav md:hidden">
            {items.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    onClick={() => triggerHaptic(10)}
                    className={`ios-nav-item ${activeHref === item.href ? 'active' : ''}`}
                >
                    <div className="relative">
                        {item.icon}
                        {item.badge !== undefined && item.badge > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                                {item.badge > 9 ? '9+' : item.badge}
                            </span>
                        )}
                    </div>
                    <span>{item.label}</span>
                </Link>
            ))}
        </nav>
    );
}

// =============================================================================
// HAPTIC BUTTON WRAPPER
// =============================================================================

interface HapticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    hapticDuration?: number;
    children: React.ReactNode;
}

export function HapticButton({
    hapticDuration = 10,
    children,
    onClick,
    className = '',
    ...props
}: HapticButtonProps) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        triggerHaptic(hapticDuration);
        onClick?.(e);
    };

    return (
        <button
            onClick={handleClick}
            className={`haptic-touch spring-interactive ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
