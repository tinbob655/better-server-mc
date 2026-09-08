import React from 'react';
import type {McPlayer, McPlayerStat} from "../../types/player";

interface SinglePlayerParams {
    player: McPlayer;
    getStats: () => Promise<McPlayerStat[]>
}

export default function SinglePlayer({player, getStats}: SinglePlayerParams): React.ReactElement {

    return (
        <div className={"widget"}>
            <h2 className={"alignRight"}>
                {player.username}
            </h2>
        </div>
    )
}