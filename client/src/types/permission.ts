export const Permission = {
    DEFAULT: 0,
    DEV: 10,
} as const;

export type Permission = typeof Permission[keyof typeof Permission];

export function maxPermissionLevel(permissionNames: string[]): Permission {
    return permissionNames.reduce<number>(
        (max, name) => Math.max(max, Permission[name as keyof typeof Permission] ?? Permission.DEFAULT),
        Permission.DEFAULT
    ) as Permission;
}