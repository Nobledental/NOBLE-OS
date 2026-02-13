"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

export type Role = "ADMIN" | "DOCTOR" | "CONSULTANT" | "RECEPTIONIST" | "ASSISTANT" | "OWNER";

interface ClinicBranch {
    id: string;
    name: string;
    location: string;
}

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
    selectedClinic?: ClinicBranch;
    availableClinics?: ClinicBranch[];
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    setRole: (role: Role) => void;
    updateFeaturePermissions: (permissions: Partial<FeaturePermissions>) => void;
    selectClinic: (clinic: ClinicBranch) => void;
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
        const cachedUser = getCookie("healthflo_user");
        if (cachedUser) {
            try {
                setUser(JSON.parse(cachedUser as string));
            } catch (e) {
                console.error("Failed to parse auth session", e);
            }
        }
    }, []);

    const login = (newUser: User) => {
        setUser(newUser);
        setCookie("healthflo_user", JSON.stringify(newUser), { maxAge: 60 * 60 * 24 * 7 }); // 7 days
    };

    const logout = () => {
        setUser(null);
        deleteCookie("healthflo_user");
    };

    const setRole = (newRole: Role) => {
        if (!user) return;
        const updatedUser = {
            ...user,
            role: newRole,
            modulePermissions: ROLE_MODULES[newRole] || [],
        };
        setUser(updatedUser);
        setCookie("healthflo_user", JSON.stringify(updatedUser), { maxAge: 60 * 60 * 24 * 7 });
    };

    const updateFeaturePermissions = (newPerms: Partial<FeaturePermissions>) => {
        if (!user) return;
        const updatedUser = {
            ...user,
            featurePermissions: { ...user.featurePermissions, ...newPerms },
        };
        setUser(updatedUser);
        setCookie("healthflo_user", JSON.stringify(updatedUser), { maxAge: 60 * 60 * 24 * 7 });
    };

    const selectClinic = (clinic: ClinicBranch) => {
        if (!user) return;
        const updatedUser = {
            ...user,
            selectedClinic: clinic
        };
        setUser(updatedUser);
        setCookie("healthflo_user", JSON.stringify(updatedUser), { maxAge: 60 * 60 * 24 * 7 });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, setRole, updateFeaturePermissions, selectClinic }}>
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
