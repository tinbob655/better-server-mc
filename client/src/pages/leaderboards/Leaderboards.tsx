import React, {Suspense, lazy} from 'react';
import PageHeader from "../../components/PageHeader.tsx";
import GenericMarkupSection from "../../components/genericMarkupSection/GenericMarkupSection.tsx";
import useLeaderboard from "../../hooks/useLeaderboard.ts";

const SingleLeaderboard = lazy(() => import("./singleLeaderboard/SingleLeaderboard.tsx"));

export default function Leaderboards(): React.ReactElement {

    const {leaderboards, fetchError, getSingleLeaderboard} = useLeaderboard();

    return (
        <React.Fragment>
            <PageHeader title={"Leaderboards"} subtitle={"Compete against other players"} />

            <GenericMarkupSection title={"Who's winning?"}>
                <p>
                    Look below to see a full list of leaderboards supported by the server. Click on a leaderboard to
                    expand it and see the current standings!
                </p>

                {!fetchError && !leaderboards && <p className={"warningText"}>Loading leaderboards</p>}
                {fetchError && <p className={"errorText"}>{fetchError}</p>}
                {leaderboards && Object.entries(leaderboards).map(([key, value]) =>
                    <Suspense>
                        <SingleLeaderboard
                        key={key}
                        statKey={key}
                        leader={value}
                        getDetailed={() => getSingleLeaderboard(key)}
                        />
                    </Suspense>
                )}
            </GenericMarkupSection>
        </React.Fragment>
    )
}