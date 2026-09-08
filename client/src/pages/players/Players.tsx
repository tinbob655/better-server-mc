import React from 'react';
import PageHeader from "../../components/PageHeader.tsx";
import GenericMarkupSection from "../../components/genericMarkupSection/GenericMarkupSection.tsx";
import usePlayers from "../../hooks/usePlayers.ts";
import SinglePlayer from "./singlePlayer/SinglePlayer.tsx";

export default function Players(): React.ReactElement {

    const {players, loading, fetchError, getStatsFor} = usePlayers();

    return (
        <React.Fragment>
            <PageHeader title={"Players"} subtitle={"See who plays & their stats"} />

            {/*list of everyone who has ever played on the server*/}
            <GenericMarkupSection title={"Who's been on?"}>
                <p>
                    Please see the below list of every player who has ever connected to the Better Server! You can click
                    on a player to view more about them & their stats.
                </p>
                {loading && <p className={"warningText"}>Loading player information...</p>}
                {fetchError && <p className={"errorText"}>{fetchError}</p>}
                {players.map(p =>
                    <SinglePlayer
                        key={p.uuid}
                        player={p}
                        getStats={() => getStatsFor(p.uuid)}
                    />
                )}
            </GenericMarkupSection>
        </React.Fragment>
    )
}