// client/src/context/AuthContext.ts
import { createContext, useContext } from 'react';

export interface AuthUser {
    username: string;
}

export interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    register: (username: string, password: string) => Promise<{success: boolean, error?: string}>;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}