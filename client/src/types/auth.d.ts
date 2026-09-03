import type {Permission} from "./permission.ts";

export interface CurrentUserResponse {
    username: string;
    permissions: Permission[];
}

export interface LoginResponse {
    token: string;
}

export interface AccountRequest {
    username: string;
    password: string;
}