import {useState, useEffect} from 'react';
import type {McPlayer, McPlayerStat, UUID} from "../types/player";
import axiosInstance from "../axiosInstance.ts";
import type {AxiosResponse} from "axios";
import {parseAxiosError} from "../functions/parseAxiosError.ts";

interface UsePlayersExports {
    players: McPlayer[];
    loading: boolean;
    fetchError: string | null;

    getStatsFor: (uuid: UUID) => Promise<McPlayerStat[]>;
}

export default function usePlayers(): UsePlayersExports {

    const [players, setPlayers] = useState<McPlayer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    //initial fetch
    useEffect(() => {
        axiosInstance.get("/mcPlayer/allPlayers")
            .then((res: AxiosResponse<McPlayer[]>) => setPlayers(res.data))
            .catch(err => setFetchError(parseAxiosError(err)))
            .finally(() => setLoading(false));
    }, []);

    async function getStatsFor(uuid: UUID): Promise<McPlayerStat[]> {
        const res: AxiosResponse<McPlayerStat[]> = await axiosInstance.get(`/mcPlayer/statsFor/${uuid}`);
        return res.data;
    }

    return {players, loading, fetchError, getStatsFor}
}