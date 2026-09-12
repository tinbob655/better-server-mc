import React, { useEffect, useState, type ReactNode } from 'react';
import axiosInstance from "../../axiosInstance.ts";
import { AuthContext, type AuthUser } from './AuthContext.tsx';
import {parseAxiosError} from "../../functions/parseAxiosError.ts";
import type {
    AccountRequest,
    ChangePasswordRequest,
    ChangePermissionRequest,
    CurrentUserResponse,
    NewAccountRequest
} from "../../types/auth";
import type {AxiosResponse} from "axios";
import {maxPermissionLevel, Permission} from "../../types/permission.ts";

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        axiosInstance.get("/auth/me")
            .then((res:AxiosResponse<CurrentUserResponse>) => setUser({username: res.data.username, maxPermission: maxPermissionLevel(res.data.permissions)}))
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    async function register({username, password, profilePicture}: NewAccountRequest): Promise<{success: boolean, error?: string}> {
        try {
            const formData = new FormData();

            formData.append('request', new Blob([JSON.stringify({
                username, password
            })], {type: 'application/json'}));

            formData.append('file', profilePicture);

            await axiosInstance.post("/auth/register", formData);

            const loggedIn = await login({username, password});
            return loggedIn ? {success: true} : {success: false, error: "Created account then failed to log into it"}
        }
        catch (err) {
            return {success: false, error: parseAxiosError(err)}
        }
    }

    async function login(request: AccountRequest): Promise<boolean> {
        try {
            await axiosInstance.post("/auth/login", request);
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
        await axiosInstance.post("/auth/logout");
        setUser(null);
    }

    function hasPermission(permission: Permission): boolean {
        return (user?.maxPermission ?? Permission.DEFAULT) >= permission;
    }

    async function changePassword(request: ChangePasswordRequest): Promise<void> {
        if (!user?.username) throw new Error("No username available");

        await axiosInstance.put(`/auth/users/${user.username}/password`, request);
    }

    async function changePermission(username: string, request: ChangePermissionRequest): Promise<void> {
        await axiosInstance.put(`/auth/users/${username}/permission`, request);
    }

    async function updateProfilePicture(file: File): Promise<void> {
        if (!user?.username) throw new Error("No username available");

        const formData = new FormData();
        formData.append('file', file);

        await axiosInstance.put(`/auth/users/${user.username}/profilePicture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
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
            changePassword,
            changePermission,
            updateProfilePicture,
        }}>
            {children}
        </AuthContext.Provider>
    )
}