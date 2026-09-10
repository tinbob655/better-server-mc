import React, {useState, useEffect} from 'react';
import type {LeaderboardEntry} from "../../../types/leaderboard";
import {parseStatKey, toReadableLabel} from "../../../functions/stats.ts";
import {parseAxiosError} from "../../../functions/parseAxiosError.ts";

interface SingleLeaderboardParams {
    statKey: string;
    getDetailed: () => Promise<LeaderboardEntry[]>;
}

export default function SingleLeaderboard({statKey, getDetailed}: SingleLeaderboardParams): React.ReactElement {

    const [expanded, setExpanded] = useState<boolean>(false);
    const [detailedData, setDetailedData] = useState<LeaderboardEntry[] | null>(null);
    const [expansionError, setExpansionError] = useState<string | null>(null);

    const loadingExpansion: boolean = expanded && detailedData === null;

    useEffect(() => {
        if (!expanded || detailedData !== null) return;
        
        getDetailed()
            .then((res: LeaderboardEntry[]) => {
                setExpanded(true);
                setDetailedData(res);
            })
            .catch(err => setExpansionError(parseAxiosError(err)));
    }, [expanded, detailedData, getDetailed]);

    const readableKey: string = toReadableLabel(parseStatKey(statKey).name);


    return (
        <div className={`leaderboardWrapper widget ${expanded ? "expanded" : ""}`}>
            <button onChange={() => setExpanded(prev => !prev)}>
                <h2>
                    {readableKey}
                </h2>
            </button>
        </div>
    )
}