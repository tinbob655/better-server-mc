import type {LeaderboardEntry, MultipleLeaderboardRequest} from "../types/leaderboard";
import axiosInstance from "../axiosInstance.ts";
import type {AxiosResponse} from "axios";

interface UseLeaderboardExports {
    availableLeaderboardNames: string[];

    getSingleLeaderboard: (statKey: string) => Promise<LeaderboardEntry[]>
    getManyLeaderboards: (request: MultipleLeaderboardRequest) => Promise<LeaderboardEntry[][]>
}

//these are the stats that will be used in leaderboards
const LEADERBOARD_STAT_KEYS: string[] = [
    'minecraft:custom:minecraft:play_time',
    'minecraft:custom:minecraft:walk_one_cm',
    'minecraft:custom:minecraft:aviate_one_cm',
    'minecraft:custom:minecraft:mob_kills',
    'minecraft:custom:minecraft:deaths',
    'minecraft:custom:minecraft:jump',
    'minecraft:custom:minecraft:damage_dealt',
    'minecraft:custom:minecraft:fish_caught',
    'minecraft:custom:minecraft:animals_bred',
    'minecraft:mined:minecraft:diamond_ore,minecraft:mined:minecraft:deepslate_diamond_ore', //deepslate & normal ore
];

export default function useLeaderboard(): UseLeaderboardExports {

    async function getSingleLeaderboard(statKey: string): Promise<LeaderboardEntry[]> {
        const res: AxiosResponse<LeaderboardEntry[]> = await axiosInstance.get(`/leaderboard/single/${statKey}`);
        return res.data;
    }

    async function getManyLeaderboards(request: MultipleLeaderboardRequest): Promise<LeaderboardEntry[][]> {
        const res: AxiosResponse<LeaderboardEntry[][]> = await axiosInstance.get("/leaderboard/many", {
            params: request,
        });
        return res.data;
    }

    return {
        availableLeaderboardNames: LEADERBOARD_STAT_KEYS,
        getSingleLeaderboard,
        getManyLeaderboards
    }
}