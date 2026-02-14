"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";

interface PermissionGuardProps {
    permission: "can_view_revenue" | "can_edit_inventory" | "can_view_clinical" | "can_manage_staff";
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * PermissionGuard
 * 
 * Conditionally renders children if the user has the required permission
 * or if they are in 'Solo Mode' (Unified Command).
 */
export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
    const { user } = useAuth();

    // Solo Mode Bypass or Permission Check
    const hasPermission = user?.featurePermissions?.solo_mode || user?.featurePermissions?.[permission] === true;

    if (!hasPermission) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
