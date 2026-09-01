// client/src/context/AuthProvider.tsx
import React, { useEffect, useState, type ReactNode } from 'react';
import axiosInstance from "../../axiosInstance.ts";
import { AuthContext, type AuthUser } from './AuthContext.tsx';
import {parseAxiosError} from "../../functions/parseAxiosError.ts";

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        axiosInstance.get('/auth/me')
            .then(response => setUser({ username: response.data.username }))
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    async function register(username: string, password: string): Promise<{success: boolean, error?: string}> {
        try {
            await axiosInstance.post("/auth/register", {username, password});

            const loggedIn = await login(username, password);
            return loggedIn ? {success: true} : {success: false, error: "Created account then failed to log into it"}
        }
        catch (err) {
            return {success: false, error: parseAxiosError(err)}
        }
    }

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
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}