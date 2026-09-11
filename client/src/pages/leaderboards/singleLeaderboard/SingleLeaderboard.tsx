import React, {useState, useEffect} from 'react';
import type {LeaderboardEntry} from "../../../types/leaderboard";
import {formatStatValue, parseStatKey, toReadableLabel, TOTAL_ORE_STAT_KEY} from "../../../functions/stats.ts";
import {parseAxiosError} from "../../../functions/parseAxiosError.ts";
import './singleLeaderboard.scss';
import FancyButton from "../../../components/fancyButton/FancyButton.tsx";

interface SingleLeaderboardParams {
    statKey: string;
    leader: string;

    getDetailed: () => Promise<LeaderboardEntry[]>;
}

const MAX_VISIBLE_ENTRIES: number = 10;

/*most leaderboard stats read fine as "<Name>", but "mined"/"crafted"/etc need a suffix to make sense as a title, e.g.
 "Diamond ore" -> "Diamond Ore Mined"*/
const CATEGORY_TITLE_SUFFIXES: Record<string, string> = {
    mined: 'Mined',
    crafted: 'Crafted',
    used: 'Used',
    broken: 'Broken',
    killed: 'Kills',
    killed_by: 'Deaths To',
};

const LEADERBOARD_TITLE_OVERRIDES: Record<string, string> = {
    [TOTAL_ORE_STAT_KEY]: 'Total ore mined',
}

//shows a medal for the podium places, falls back to a plain rank number
function getRankLabel(index: number): string {
    switch (index) {
        case 0: return '🥇';
        case 1: return '🥈';
        case 2: return '🥉';
        default: return String(index + 1);
    }
}

export default function SingleLeaderboard({statKey, leader, getDetailed}: SingleLeaderboardParams): React.ReactElement {

    const [expanded, setExpanded] = useState<boolean>(false);
    const [detailedData, setDetailedData] = useState<LeaderboardEntry[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [expansionError, setExpansionError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState<number>(MAX_VISIBLE_ENTRIES);

    //fetch the leaderboard the first time this card is expanded, then cache it
    useEffect(() => {
        if (!expanded || detailedData !== null || loading) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        setExpansionError(null);

        getDetailed()
            .then(setDetailedData)
            .catch(err => setExpansionError(parseAxiosError(err)))
            .finally(() => setLoading(false));
    }, [expanded, detailedData, loading, getDetailed]);

    const {category, name: rawStatName} = parseStatKey(statKey);
    const suffix: string = CATEGORY_TITLE_SUFFIXES[category];
    const title: string = LEADERBOARD_TITLE_OVERRIDES[statKey] ?? `${toReadableLabel(rawStatName)} ${suffix ? suffix : ''}`

    return (
        <div className={`widget leaderboardWrapper ${expanded ? "expanded" : ""}`}>

            {/*small summary when not expanded*/}
            <button
                type={"button"}
                className={"leaderboardHeaderButton"}
                onClick={() => setExpanded(prev => !prev)}
                aria-expanded={expanded}
            >
                <span className={"leaderboardHeaderInfo"}>
                    <h2>{title}</h2>
                    {leader && <span className={"leaderboardLeaderTag"}>👑 {leader} leads</span>}
                </span>
                <span className={"expandChevron"}>▸</span>
            </button>

            {/*show the leaderboard when expanded*/}
            <div className={`leaderboardCollapse ${expanded ? "expanded" : ""}`}>
                <div className={"leaderboardInner"}>

                    {loading && <p className={"warningText smaller alignLeft"}>Loading leaderboard...</p>}
                    {expansionError && <p className={"errorText smaller alignLeft"}>{expansionError}</p>}

                    {!loading && !expansionError && detailedData?.length === 0 && (
                        <p className={"smaller alignLeft"}>No one has recorded this stat yet.</p>
                    )}

                    {!loading && !expansionError && detailedData && detailedData.length > 0 && (
                        <React.Fragment>
                            <div className={"leaderboardRankings"}>
                                {detailedData.slice(0, visibleCount).map((entry, index) => (
                                    <div
                                        key={entry.uuid}
                                        className={`leaderboardEntry ${index === 0 ? "first" : ""} ${index === 1 ? "second" : ""} ${index === 2 ? "third" : ""}`}
                                    >
                                        <span className={"leaderboardRank"}>{getRankLabel(index)}</span>
                                        <img
                                            src={`https://mc-heads.net/avatar/${entry.uuid}/32`}
                                            alt={""}
                                            className={"leaderboardAvatar"}
                                            onError={e => { e.currentTarget.style.visibility = 'hidden'; }}
                                        />
                                        <span className={"leaderboardPlayerName"}>{entry.playerName}</span>
                                        <span className={"leaderboardStatValue"}>
                                            {formatStatValue(rawStatName, entry.statSummary.statValue)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {detailedData.length > visibleCount && (
                                <div className={"leaderboardShowMoreWrapper"}>
                                    <FancyButton
                                        label={`Show ${Math.min(MAX_VISIBLE_ENTRIES, detailedData.length - visibleCount)} more`}
                                        onClick={() => setVisibleCount(prev => prev + MAX_VISIBLE_ENTRIES)}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div>
    )
}