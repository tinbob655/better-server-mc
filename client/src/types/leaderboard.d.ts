import type {McPlayerStat} from "./player";

export interface MultipleLeaderboardRequest {
    statKeys: string[];
}

export type LeaderboardSummary = Record<string, string>;    //statKey, playerUsername

export interface LeaderboardEntry {
    playerName: string;
    uuid: string;
    statSummary: McPlayerStat;
}