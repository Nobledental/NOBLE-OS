/**
 * Permission Tooltip Component
 * 
 * Displays helpful information about role requirements for features
 * Used throughout the app to clarify what permissions are needed
 */

import { Info, ShieldCheck, Users, Stethoscope } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PermissionTooltipProps {
    requiredRole?: string[];
    requiredPermission?: string;
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    className?: string;
}

const PERMISSION_LABELS: Record<string, { icon: any, label: string, description: string }> = {
    "can_start_consultation": {
        icon: Stethoscope,
        label: "Clinical Access Required",
        description: "Only doctors and consultants can perform this action"
    },
    "can_manage_staff": {
        icon: Users,
        label: "Staff Management Required",
        description: "Only owners and admins can manage staff"
    },
    "can_view_clinical": {
        icon: ShieldCheck,
        label: "Clinical View Permission",
        description: "Access to view patient clinical records"
    }
};

export function PermissionTooltip({
    requiredRole,
    requiredPermission,
    children,
    side = "top",
    className
}: PermissionTooltipProps) {
    const permissionInfo = requiredPermission ? PERMISSION_LABELS[requiredPermission] : null;
    const Icon = permissionInfo?.icon || Info;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent
                    side={side}
                    className={cn(
                        "max-w-xs bg-slate-900 text-white border-slate-700 px-3 py-2",
                        className
                    )}
                >
                    <div className="flex items-start gap-2">
                        <Icon className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <div className="text-xs font-bold">
                                {permissionInfo?.label || "Permission Required"}
                            </div>
                            <div className="text-[10px] text-slate-300 leading-relaxed">
                                {permissionInfo?.description ||
                                    (requiredRole
                                        ? `Available to: ${requiredRole.join(', ')}`
                                        : "Limited access based on your role"
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

/**
 * Quick Role Badge Tooltip
 * Compact version for inline use
 */
export function RoleBadgeTooltip({
    roles,
    children
}: {
    roles: string[],
    children: React.ReactNode
}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 text-white border-slate-700 px-2 py-1">
                    <div className="text-[10px]">
                        <span className="font-semibold">Available to:</span>{' '}
                        <span className="text-blue-300">{roles.join(', ')}</span>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
