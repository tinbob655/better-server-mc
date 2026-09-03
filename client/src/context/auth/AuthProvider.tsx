// client/src/context/AuthProvider.tsx
import React, { useEffect, useState, type ReactNode } from 'react';
import axiosInstance from "../../axiosInstance.ts";
import { AuthContext, type AuthUser } from './AuthContext.tsx';
import {parseAxiosError} from "../../functions/parseAxiosError.ts";
import type {AccountRequest, CurrentUserResponse, LoginResponse} from "../../types/auth";
import type {AxiosResponse} from "axios";
import {maxPermissionLevel, Permission} from "../../types/permission.ts";

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!localStorage.getItem('authToken')) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsLoading(false);
            return;
        }
        axiosInstance.get("/auth/me")
            .then((response: AxiosResponse<CurrentUserResponse>) => setUser({
                username: response.data.username,
                maxPermission: maxPermissionLevel(response.data.permissions),
            }))
            .catch(() => {

                //the token must be invalid so remove it
                localStorage.removeItem('authToken');
                setUser(null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    async function register(request: AccountRequest): Promise<{success: boolean, error?: string}> {
        try {
            await axiosInstance.post("/auth/register", request);

            const loggedIn = await login(request);
            return loggedIn ? {success: true} : {success: false, error: "Created account then failed to log into it"}
        }
        catch (err) {
            return {success: false, error: parseAxiosError(err)}
        }
    }

    async function login(request: AccountRequest): Promise<boolean> {
        try {
            const response: AxiosResponse<LoginResponse> = await axiosInstance.post("/auth/login", request);
            localStorage.setItem('authToken', response.data.token);

            const me: AxiosResponse<CurrentUserResponse> = await axiosInstance.get("/auth/me");
            setUser({username: me.data.username, maxPermission: maxPermissionLevel(me.data.permissions)});

            return true;
        }
        catch {
            setUser(null);
            return false;
        }
    }

    async function logout(): Promise<void> {

        //just need to delete our token, backend doesn't care
        localStorage.removeItem('authToken');
        setUser(null);
    }

    function hasPermission(permission: Permission): boolean {
        return (user?.maxPermission ?? Permission.DEFAULT) >= permission;
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            register,
            login,
            logout,
            hasPermission,
        }}>
            {children}
        </AuthContext.Provider>
    )
}