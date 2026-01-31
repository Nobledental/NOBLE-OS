"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";

/**
 * Higher-Order Component (HOC) to restrict access to a component.
 * If unauthorized, the component is completely removed from the Virtual DOM.
 */
export function withPermission<P extends object>(
    Component: React.ComponentType<P>,
    permissionKey: "can_view_revenue" | "can_edit_inventory" | "can_view_clinical" | "can_manage_staff"
) {
    return function ProtectedComponent(props: P) {
        const { user } = useAuth();

        // Admin/Owner Bypass or Solo Mode Bypass
        const isAuthorized =
            user?.permissions?.solo_mode ||
            user?.role === "OWNER" ||
            user?.permissions?.[permissionKey] === true;

        if (!isAuthorized) {
            // Hard removal from Virtual DOM for security (returns null)
            return null;
        }

        return <Component {...props} />;
    };
}
