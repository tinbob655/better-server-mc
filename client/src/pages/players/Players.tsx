import React from 'react';
import PageHeader from "../../components/PageHeader.tsx";
import GenericMarkupSection from "../../components/genericMarkupSection/GenericMarkupSection.tsx";
import usePlayers from "../../hooks/usePlayers.ts";
import SinglePlayer from "./SinglePlayer.tsx";

export default function Players(): React.ReactElement {

    const {players, fetchError, getStatsFor} = usePlayers();

    return (
        <React.Fragment>
            <PageHeader title={"Players"} subtitle={"See who plays & their stats"} />

            {/*list of everyone who has ever played on the server*/}
            <GenericMarkupSection title={"Who's been on?"}>
                <p>
                    Please see the below list of every player who has ever connected to the Better Server! You can click
                    on a player to view more about them & their stats.
                </p>
                {fetchError && <p className={"errorText"}>{fetchError}</p>}
                {players.map(p =>
                    <SinglePlayer
                        key={p.UUID}
                        player={p}
                        getStats={() => getStatsFor(p.UUID)}
                    />
                )}
            </GenericMarkupSection>
        </React.Fragment>
    )
}