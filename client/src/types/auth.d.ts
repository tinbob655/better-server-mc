export interface CurrentUserResponse {
    username: string;
    permissions: string[];
}

export interface LoginResponse {
    token: string;
}

export interface AccountRequest {
    username: string;
    password: string;
}

export interface ChangePasswordRequest {
    newPassword: string;
}