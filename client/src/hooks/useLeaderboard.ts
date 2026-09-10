import type {LeaderboardEntry, MultipleLeaderboardRequest} from "../types/leaderboard";
import axiosInstance from "../axiosInstance.ts";
import type {AxiosResponse} from "axios";

interface UseLeaderboardExports {
    availableLeaderboardNames: string[];

    getSingleLeaderboard: (statKey: string) => Promise<LeaderboardEntry[]>
    getManyLeaderboards: (request: MultipleLeaderboardRequest) => Promise<LeaderboardEntry[][]>
}

const LEADERBOARD_STAT_KEYS: string[] = [];

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