"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "ADMIN" | "DOCTOR" | "CONSULTANT" | "RECEPTIONIST" | "ASSISTANT" | "OWNER";

interface FeaturePermissions {
    can_view_revenue: boolean;
    can_edit_inventory: boolean;
    can_view_clinical: boolean;
    can_manage_staff: boolean;
    solo_mode: boolean;
}

interface User {
    id: string;
    email: string;
    full_name: string;
    role: Role;
    modulePermissions: string[];
    featurePermissions: FeaturePermissions;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    setRole: (role: Role) => void;
    updateFeaturePermissions: (permissions: Partial<FeaturePermissions>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_MODULES: Record<Role, string[]> = {
    OWNER: ["all"],
    ADMIN: ["all"],
    DOCTOR: ["dashboard", "appointments", "clinical", "patients", "analytics", "specialists", "sterilization"],
    CONSULTANT: ["dashboard", "appointments", "clinical", "patients"],
    RECEPTIONIST: ["dashboard", "appointments", "patients", "analytics", "billing", "settlement", "marketplace"],
    ASSISTANT: ["dashboard", "appointments", "clinical", "marketplace", "sterilization"],
};

const DEFAULT_FEATURE_PERMISSIONS: FeaturePermissions = {
    can_view_revenue: false,
    can_edit_inventory: false,
    can_view_clinical: false,
    can_manage_staff: false,
    solo_mode: false,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const cachedUser = sessionStorage.getItem("healthflo_user");
        if (cachedUser) {
            try {
                setUser(JSON.parse(cachedUser));
            } catch (e) {
                console.error("Failed to parse auth session", e);
            }
        } else {
            // Default to OWNER for development
            const defaultUser: User = {
                id: "u1",
                email: "dhivakaran@healthflo.ai",
                full_name: "Dr. Dhivakaran",
                role: "OWNER",
                modulePermissions: ROLE_MODULES["OWNER"],
                featurePermissions: {
                    can_view_revenue: true,
                    can_edit_inventory: true,
                    can_view_clinical: true,
                    can_manage_staff: true,
                    solo_mode: true
                }
            };
            setUser(defaultUser);
            sessionStorage.setItem("healthflo_user", JSON.stringify(defaultUser));
        }
    }, []);

    const login = (newUser: User) => {
        setUser(newUser);
        sessionStorage.setItem("healthflo_user", JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem("healthflo_user");
    };

    const setRole = (newRole: Role) => {
        if (!user) return;
        const updatedUser = {
            ...user,
            role: newRole,
            modulePermissions: ROLE_MODULES[newRole] || [],
        };
        setUser(updatedUser);
        sessionStorage.setItem("healthflo_user", JSON.stringify(updatedUser));
    };

    const updateFeaturePermissions = (newPerms: Partial<FeaturePermissions>) => {
        if (!user) return;
        const updatedUser = {
            ...user,
            featurePermissions: { ...user.featurePermissions, ...newPerms },
        };
        setUser(updatedUser);
        sessionStorage.setItem("healthflo_user", JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, setRole, updateFeaturePermissions }}>
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
    const { user } = useAuth();
    if (!user) return null;

    const perms = user.modulePermissions;
    if (perms.includes("all") || perms.includes(permission)) {
        return <>{children}</>;
    }
    return null;
}
