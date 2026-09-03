import { createContext, useContext } from 'react';
import type {Permission} from "../../types/permission.ts";
import type {AccountRequest} from "../../types/auth";

export interface AuthUser {
    username: string;
    permissions: Permission[];
}

export interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    register: (request: AccountRequest) => Promise<{success: boolean, error?: string}>;
    login: (request: AccountRequest) => Promise<boolean>;
    logout: () => Promise<void>;
    hasPermission: (permission: Permission) => boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}