"use client";

import { useAuth, Role } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserCircle, Shield, Stethoscope, Users, User, ChevronDown, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLE_ICONS: Record<Role, any> = {
    OWNER: Crown,
    ADMIN: Shield,
    DOCTOR: Stethoscope,
    CONSULTANT: UserCircle,
    RECEPTIONIST: Users,
    ASSISTANT: User,
};

export function RoleSwitcher() {
    const { user, setRole } = useAuth();
    const role = user?.role || "DOCTOR";
    const Icon = ROLE_ICONS[role] || User;

    const roles: Role[] = ["OWNER", "ADMIN", "DOCTOR", "CONSULTANT", "RECEPTIONIST", "ASSISTANT"];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 px-4 rounded-full gap-2 border-slate-200 bg-white/50 backdrop-blur-sm">
                    <Icon className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-700">{role}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                <DropdownMenuLabel className="text-xs text-slate-500 font-medium px-2 py-1.5">Simulate Access Level</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {roles.map((r) => {
                    const RoleIcon = ROLE_ICONS[r];
                    return (
                        <DropdownMenuItem
                            key={r}
                            onClick={() => setRole(r)}
                            className={cn(
                                "flex items-center gap-2 p-2 rounded-xl transition-colors cursor-pointer",
                                role === r ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50"
                            )}
                        >
                            <RoleIcon className={cn("w-4 h-4", role === r ? "text-indigo-600" : "text-slate-400")} />
                            <span className="text-sm font-medium">{r}</span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
