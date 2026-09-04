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
    oldPassword: string;
    newPassword: string;
}

export interface ChangePermissionRequest {
    newPermission: keyof typeof Permission;
}

export interface UserSummary {
    username: string;
    maxPermissionLevel: string;
}