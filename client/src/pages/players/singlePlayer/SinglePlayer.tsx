import React, {useState, useEffect} from 'react';
import type {McPlayer, McPlayerStat} from "../../../types/player";
import './singlePlayer.scss'

interface SinglePlayerParams {
    player: McPlayer;
    getStats: () => Promise<McPlayerStat[]>
}

export default function SinglePlayer({player, getStats}: SinglePlayerParams): React.ReactElement {

    const [expanded, setExpanded] = useState<boolean>(false);
    const [stats, setStats] = useState<McPlayerStat[] | null>(null);

    //if expanded get & show detailed data
    useEffect(() => {
        if (expanded && stats === null) {
            getStats()
                .then(setStats);
        }
    }, [expanded, stats, getStats]);

    return (
        <div className={`widget singlePlayerWrapper ${expanded ? "expanded" : ""}`}>

            <button onClick={() => setExpanded(prev => !prev)} className={"expandButton noVerticalSpacing"}>
                <h2 className={"noVerticalSpacing"}>
                    {player.username}
                </h2>
            </button>
        </div>
    )
}