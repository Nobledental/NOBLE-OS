"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Permissions {
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
    role: string;
    permissions: Permissions;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    updatePermissions: (permissions: Partial<Permissions>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_PERMISSIONS: Permissions = {
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
            // Default to OWNER for development as requested
            const defaultUser: User = {
                id: "u1",
                email: "dhivakaran@healthflo.ai",
                full_name: "Dr. Dhivakaran",
                role: "OWNER",
                permissions: {
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

    const updatePermissions = (newPerms: Partial<Permissions>) => {
        if (!user) return;
        const updatedUser = {
            ...user,
            permissions: { ...user.permissions, ...newPerms },
        };
        setUser(updatedUser);
        sessionStorage.setItem("healthflo_user", JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updatePermissions }}>
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
