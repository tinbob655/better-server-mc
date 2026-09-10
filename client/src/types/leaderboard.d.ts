import type {McPlayerStat} from "./player";

export interface MultipleLeaderboardRequest {
    statKeys: string[];
}

export interface LeaderboardEntry {
    playerName: string;
    uuid: string;
    statSummary: McPlayerStat;
}