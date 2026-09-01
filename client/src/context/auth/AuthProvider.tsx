// client/src/context/AuthProvider.tsx
import React, { useEffect, useState, type ReactNode } from 'react';
import axiosInstance from "../../axiosInstance.ts";
import { AuthContext, type AuthUser } from './AuthContext.tsx';

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        axiosInstance.get('/auth/me')
            .then(response => setUser({ username: response.data.username }))
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    async function login(username: string, password: string): Promise<boolean> {
        try {
            await axiosInstance.post('/auth/login', { username, password });
            setUser({ username });
            return true;
        } catch {
            setUser(null);
            return false;
        }
    }

    async function logout(): Promise<void> {
        await axiosInstance.post('/auth/logout');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}