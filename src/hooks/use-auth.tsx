"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "ADMIN" | "DOCTOR" | "CONSULTANT" | "RECEPTIONIST" | "ASSISTANT";

interface AuthContextType {
    role: Role;
    setRole: (role: Role) => void;
    permissions: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_PERMISSIONS: Record<Role, string[]> = {
    ADMIN: ["all"],
    DOCTOR: ["dashboard", "appointments", "clinical", "patients", "analytics", "specialists", "sterilization"],
    CONSULTANT: ["dashboard", "appointments", "clinical", "patients"],
    RECEPTIONIST: ["dashboard", "appointments", "patients", "analytics", "billing", "settlement", "marketplace"],
    ASSISTANT: ["dashboard", "appointments", "clinical", "marketplace", "sterilization"],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRoleState] = useState<Role>("ADMIN");

    useEffect(() => {
        const savedRole = localStorage.getItem("active_user_role") as Role;
        if (savedRole && ROLE_PERMISSIONS[savedRole]) {
            setRoleState(savedRole);
        }
    }, []);

    const setRole = (newRole: Role) => {
        setRoleState(newRole);
        localStorage.setItem("active_user_role", newRole);
    };

    const permissions = ROLE_PERMISSIONS[role] || [];

    return (
        <AuthContext.Provider value={{ role, setRole, permissions }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function HasPermission({ permission, children }: { permission: string; children: React.ReactNode }) {
    const { permissions } = useAuth();
    if (permissions.includes("all") || permissions.includes(permission)) {
        return <>{children}</>;
    }
    return null;
}
