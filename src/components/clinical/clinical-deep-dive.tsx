'use client';

import { useState, ReactNode } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Microscope, Activity, Sparkles, Scissors,
    TrendingUp, AlertTriangle
} from 'lucide-react';

interface ClinicalDeepDiveProps {
    children: ReactNode;
    title: string;
    description?: string;
    badge?: string;
    icon?: 'microscope' | 'activity' | 'sparkles' | 'scissors' | 'trending' | 'alert';
}

const ICONS = {
    microscope: Microscope,
    activity: Activity,
    sparkles: Sparkles,
    scissors: Scissors,
    trending: TrendingUp,
    alert: AlertTriangle
};

/**
 * Progressive Disclosure Component
 * Specialized indices stay hidden until "Clinical Deep Dive" is clicked
 */
export default function ClinicalDeepDive({
    children,
    title,
    description,
    badge,
    icon = 'microscope'
}: ClinicalDeepDiveProps) {
    const [isOpen, setIsOpen] = useState(false);
    const IconComponent = ICONS[icon];

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-12"
                >
                    <IconComponent className="w-5 h-5 text-purple-500" />
                    <span className="flex-1 text-left">{title}</span>
                    {badge && (
                        <Badge variant="secondary" className="ml-auto">
                            {badge}
                        </Badge>
                    )}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh]">
                <DrawerHeader className="border-b">
                    <DrawerTitle className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5 text-purple-500" />
                        {title}
                    </DrawerTitle>
                    {description && (
                        <DrawerDescription>{description}</DrawerDescription>
                    )}
                </DrawerHeader>
                <div className="p-4 overflow-y-auto max-h-[70vh]">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    );
}

// =============================================================================
// PRE-BUILT CLINICAL DEEP DIVE TRIGGERS
// =============================================================================

interface DeepDiveTriggerListProps {
    onOHISClick?: () => void;
    onCairoClick?: () => void;
    onSmokingClick?: () => void;
    onVMIClick?: () => void;
    ohisValue?: number;
    smokingIndex?: number;
}

export function ClinicalDeepDiveTriggers({
    onOHISClick,
    onCairoClick,
    onSmokingClick,
    onVMIClick,
    ohisValue,
    smokingIndex
}: DeepDiveTriggerListProps) {
    return (
        <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground mb-2">
                Clinical Deep Dive
            </div>

            <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={onOHISClick}
            >
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="flex-1 text-left">OHI-S Index</span>
                {ohisValue !== undefined && (
                    <Badge variant={
                        ohisValue <= 1.2 ? 'default' :
                            ohisValue <= 3 ? 'secondary' : 'destructive'
                    }>
                        {ohisValue.toFixed(1)}
                    </Badge>
                )}
            </Button>

            <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={onCairoClick}
            >
                <Scissors className="w-4 h-4 text-pink-500" />
                <span className="flex-1 text-left">Cairo Recession</span>
            </Button>

            <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={onSmokingClick}
            >
                <Activity className="w-4 h-4 text-orange-500" />
                <span className="flex-1 text-left">Smoking Index</span>
                {smokingIndex !== undefined && smokingIndex > 200 && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {smokingIndex}
                    </Badge>
                )}
            </Button>

            <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={onVMIClick}
            >
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span className="flex-1 text-left">VMI Index</span>
            </Button>
        </div>
    );
}
