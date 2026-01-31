'use client';

import {
    Home, Users, Calendar, FileText,
    Settings, Bell, BarChart3, Stethoscope
} from 'lucide-react';
import { IOSBottomNav } from '@/components/navigation/navigation-components';
import { PrivacyToggle } from '@/components/privacy/privacy-provider';

// =============================================================================
// BENTO GRID LAYOUT
// =============================================================================

interface BentoGridProps {
    children: React.ReactNode;
    className?: string;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
    return (
        <div className={`bento-grid ${className}`}>
            {children}
        </div>
    );
}

// =============================================================================
// BENTO CARD
// =============================================================================

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    span?: 1 | 2 | 3 | 4;
    rowSpan?: 1 | 2;
}

export function BentoCard({
    children,
    className = '',
    span = 1,
    rowSpan = 1
}: BentoCardProps) {
    const spanClasses = {
        1: '',
        2: 'bento-span-2',
        3: 'bento-span-3',
        4: 'bento-span-4'
    };

    const rowClasses = rowSpan === 2 ? 'bento-row-2' : '';

    return (
        <div className={`glass-card p-4 ${spanClasses[span]} ${rowClasses} ${className}`}>
            {children}
        </div>
    );
}

// =============================================================================
// APP SHELL WITH MESH GRADIENT
// =============================================================================

interface AppShellProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
    activeNav?: string;
}

export function AppShell({ children, sidebar, activeNav = '/dashboard' }: AppShellProps) {
    const navItems = [
        { icon: <Home className="w-5 h-5" />, label: 'Home', href: '/dashboard' },
        { icon: <Users className="w-5 h-5" />, label: 'Patients', href: '/dashboard/patients' },
        { icon: <Calendar className="w-5 h-5" />, label: 'Calendar', href: '/dashboard/appointments' },
        { icon: <FileText className="w-5 h-5" />, label: 'Billing', href: '/dashboard/billing' },
        { icon: <Stethoscope className="w-5 h-5" />, label: 'Clinical', href: '/dashboard/clinical' }
    ];

    return (
        <div className="min-h-screen">
            {/* Dynamic Mesh Gradient Background */}
            <div className="mesh-gradient-bg" />

            {/* Main Content Area */}
            <div className="flex min-h-screen">
                {/* Desktop Sidebar */}
                {sidebar && (
                    <aside className="hidden md:flex glass-sidebar w-64 flex-col p-4">
                        {sidebar}
                    </aside>
                )}

                {/* Main Content */}
                <main className="flex-1 pb-20 md:pb-0">
                    {children}
                </main>
            </div>

            {/* iOS Bottom Navigation (Mobile Only) */}
            <IOSBottomNav items={navItems} activeHref={activeNav} />
        </div>
    );
}

// =============================================================================
// GLASS APP HEADER
// =============================================================================

interface AppHeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    showPrivacyToggle?: boolean;
    showNotifications?: boolean;
}

export function AppHeader({
    title,
    subtitle,
    actions,
    showPrivacyToggle = true,
    showNotifications = true
}: AppHeaderProps) {
    return (
        <header className="glass-card-heavy px-6 py-4 mb-6 flex items-center justify-between sticky top-0 z-40">
            <div>
                <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                {subtitle && (
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
            </div>

            <div className="flex items-center gap-2">
                {actions}

                {showPrivacyToggle && <PrivacyToggle />}

                {showNotifications && (
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>
                )}

                <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}

// =============================================================================
// STAT CARD (for dashboard)
// =============================================================================

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon?: React.ReactNode;
    className?: string;
}

export function StatCard({
    title,
    value,
    change,
    changeType = 'neutral',
    icon,
    className = ''
}: StatCardProps) {
    const changeColors = {
        positive: 'text-green-500',
        negative: 'text-red-500',
        neutral: 'text-muted-foreground'
    };

    return (
        <BentoCard className={`spring-interactive ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted-foreground mb-1">{title}</p>
                    <p className="text-2xl font-bold tracking-tight">{value}</p>
                    {change && (
                        <p className={`text-xs mt-1 ${changeColors[changeType]}`}>
                            {change}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {icon}
                    </div>
                )}
            </div>
        </BentoCard>
    );
}

// =============================================================================
// QUICK ACTION BUTTON
// =============================================================================

interface QuickActionProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: 'default' | 'primary' | 'success' | 'warning';
}

export function QuickAction({
    icon,
    label,
    onClick,
    href,
    variant = 'default'
}: QuickActionProps) {
    const variants = {
        default: 'bg-muted hover:bg-muted/80',
        primary: 'bg-primary/10 text-primary hover:bg-primary/20',
        success: 'bg-green-500/10 text-green-600 hover:bg-green-500/20',
        warning: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
    };

    const content = (
        <div className={`p-4 rounded-xl ${variants[variant]} transition-all spring-interactive haptic-touch flex flex-col items-center gap-2`}>
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </div>
    );

    if (href) {
        return <a href={href}>{content}</a>;
    }

    return <button onClick={onClick}>{content}</button>;
}
