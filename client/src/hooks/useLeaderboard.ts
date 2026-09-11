import {useState, useEffect} from 'react';
import type {LeaderboardEntry, LeaderboardSummary, MultipleLeaderboardRequest} from "../types/leaderboard";
import axiosInstance from "../axiosInstance.ts";
import type {AxiosResponse} from "axios";
import {parseAxiosError} from "../functions/parseAxiosError.ts";
import {TOTAL_ORE_STAT_KEY, BLOCKS_BROKEN_STAT_KEY, THINGS_USED_STAT_KEY} from "../functions/stats.ts";

interface UseLeaderboardExports {
    leaderboards: LeaderboardSummary | null;
    fetchError: string | null;

    getSingleLeaderboard: (statKey: string) => Promise<LeaderboardEntry[]>
    getManyLeaderboards: (request: MultipleLeaderboardRequest) => Promise<LeaderboardEntry[][]>
}

//these are the stats that will be used in leaderboards
const LEADERBOARD_STAT_KEYS: string[] = [
    'minecraft:custom:minecraft:play_time',
    BLOCKS_BROKEN_STAT_KEY,
    'minecraft:custom:minecraft:walk_one_cm',
    'minecraft:custom:minecraft:deaths',
    THINGS_USED_STAT_KEY,
    'minecraft:custom:minecraft:fly_one_cm',
    'minecraft:custom:minecraft:mob_kills',
    'minecraft:custom:minecraft:jump',
    TOTAL_ORE_STAT_KEY, //all ores mined
    'minecraft:custom:minecraft:damage_dealt',
    'minecraft:custom:minecraft:fish_caught',
    'minecraft:custom:minecraft:animals_bred',
];

export default function useLeaderboard(): UseLeaderboardExports {

    const [leaderboards, setLeaderboards] = useState<LeaderboardSummary | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        axiosInstance.get("/leaderboard/getLeadersFor", {
            params: {
                statKeys: LEADERBOARD_STAT_KEYS
            }
        })
            .then((res: AxiosResponse<LeaderboardSummary>) => {
                setLeaderboards(res.data)
            })
            .catch(err => setFetchError(parseAxiosError(err)));
    }, []);

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
        leaderboards,
        fetchError,
        getSingleLeaderboard,
        getManyLeaderboards
    }
}