export type UUID = string;

export interface McPlayer {
    uuid: UUID;
    username: string;
}

export interface McPlayerStat {
    uuid: UUID;
    statKey: string;
    statValue: number;
    updatedAt: string;
}