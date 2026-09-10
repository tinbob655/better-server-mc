import React, {Suspense, lazy} from 'react';
import PageHeader from "../../components/PageHeader.tsx";
import GenericMarkupSection from "../../components/genericMarkupSection/GenericMarkupSection.tsx";
import useLeaderboard from "../../hooks/useLeaderboard.ts";

const SingleLeaderboard = lazy(() => import("./singleLeaderboard/SingleLeaderboard.tsx"));

export default function Leaderboards(): React.ReactElement {

    const {availableLeaderboardNames, getSingleLeaderboard} = useLeaderboard();

    return (
        <React.Fragment>
            <PageHeader title={"Leaderboards"} subtitle={"Compete against other players"} />

            <GenericMarkupSection title={"Who's winning?"}>
                <p>
                    Look below to see a full list of leaderboards supported by the server. Click on a leaderboard to
                    expand it and see the current standings!
                </p>

                {availableLeaderboardNames.map(name =>
                    <Suspense>
                        <SingleLeaderboard
                            key={name}
                            statKey={name}
                            getDetailed={() => getSingleLeaderboard(name)}
                        />
                    </Suspense>
                )}
            </GenericMarkupSection>
        </React.Fragment>
    )
}