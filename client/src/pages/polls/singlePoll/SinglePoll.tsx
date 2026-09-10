import React, {useState, useRef, useEffect} from 'react';
import './singlePoll.scss';
import type {DetailedPoll, PollSummary} from "../../../types/poll";
import formatDate from "../../../functions/formatDate.ts";
import {useAuth} from "../../../context/auth/AuthContext.tsx";
import {Permission} from "../../../types/permission.ts";
import IconButton from "../../../components/iconButton/IconButton.tsx";
import ProfilePicture from "../../../components/profilePicture/ProfilePicture.tsx";
import {parseAxiosError} from "../../../functions/parseAxiosError.ts";

interface SinglePollParams {
    pollSummary: PollSummary;
    expired?: boolean;

    getDetailedPoll: () => Promise<DetailedPoll>
    voteFor: (pollTitle: string, optionName: string) => Promise<void>
    deletePoll: () => Promise<void>
    deletePollOption: (pollTitle: string, optionName: string) => Promise<void>
}

const MAX_VISIBLE_VOTERS: number = 8;

export default function SinglePoll({pollSummary, expired, getDetailedPoll, voteFor, deletePoll, deletePollOption}: SinglePollParams): React.ReactElement {

    const {user, isAuthenticated} = useAuth();
    const isDev: boolean = user?.maxPermission === Permission.DEV;

    const [isExpired, setIsExpired] = useState<boolean>(expired ?? false);


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsExpired(expired ?? new Date(pollSummary.expiresAt).getTime() < Date.now());
    }, [expired, pollSummary.expiresAt]);

    const wrapperRef = useRef<HTMLDivElement>(null);

    const [detailedPoll, setDetailedPoll] = useState<DetailedPoll | null>(null);
    const [showDetailedPoll, setShowDetailedPoll] = useState<boolean>(false);
    const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
    const [detailError, setDetailError] = useState<string | null>(null);

    const [votingOption, setVotingOption] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    //open / close the poll
    async function toggleDetailed(): Promise<void> {
        if (!showDetailedPoll && !detailedPoll) {
            setLoadingDetail(true);
            setDetailError(null);

            try {
                setDetailedPoll(await getDetailedPoll());
            }
            catch (err) {
                setDetailError(parseAxiosError(err));
            }
            finally {
                setLoadingDetail(false);
            }
        }
        setShowDetailedPoll(prev => !prev);
    }

    async function handleVote(optionName: string): Promise<void> {
        if (!isAuthenticated || isExpired || votingOption) return;

        setVotingOption(optionName);
        setActionError(null);

        try {
            await voteFor(pollSummary.title, optionName);
            setDetailedPoll(await getDetailedPoll());
        }
        catch (err) {
            setActionError(parseAxiosError(err));
        }
        finally {
            setVotingOption(null);
        }
    }

    function handleDeleteOption(e: React.MouseEvent, optionName: string): void {
        e.stopPropagation();
        setActionError(null);

        deletePollOption(pollSummary.title, optionName)
            .then(() => setDetailedPoll(prev => prev && ({
                ...prev,
                options: prev.options.filter(o => o.name !== optionName)
            })))
            .catch(err => setActionError(parseAxiosError(err)));
    }

    const totalVotes: number = detailedPoll?.options.reduce((sum, o) => sum + o.voters.length, 0) ?? 0;

    return (
        <div className={`singlePollWrapper widget ${isExpired ? "expired" : ""}`} ref={wrapperRef}>

            {/*title expands on click*/}
            <button className={"pollTitleButton"} onClick={toggleDetailed}>
                <h2 className={"alignLeft"}>
                    {pollSummary.title}
                </h2>
                <p className={"alignLeft smaller"}>
                    Created on {formatDate(pollSummary.createdAt)}.{' '}
                    {isExpired ? "This poll has closed." : `Closes ${formatDate(pollSummary.expiresAt)}.`}
                </p>
            </button>

            {/*if the user is a dev show the delete button in the top left*/}
            {isDev && <IconButton
                imageLoader={() => import("../../../assets/images/buttons/delete.svg")}
                showElementRef={wrapperRef}
                onClick={deletePoll}
                alt={"Delete this poll"}
            />
            }

            {/*extra poll information when expanded*/}
            {showDetailedPoll && (
                <React.Fragment>
                    {loadingDetail && <p className={"warningText smaller"}>Loading poll options...</p>}
                    {detailError && <p className={"errorText smaller"}>{detailError}</p>}

                    {detailedPoll && (
                        <div className={"pollOptionsList"}>
                            {detailedPoll.options.map(option => {
                                const voteCount: number = option.voters.length;
                                const percent: number = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                                const hasVoted: boolean = option.voters.some(v => v.username === user?.username);

                                return (
                                    <div
                                        key={option.name}
                                        className={`pollOption ${hasVoted ? "voted" : ""}`}
                                        style={{"--option-color": option.color, "--pct": `${percent}%`} as React.CSSProperties}
                                    >
                                        <button
                                            type={"button"}
                                            className={"pollOptionVoteArea"}
                                            onClick={() => handleVote(option.name)}
                                            disabled={!isAuthenticated || isExpired || votingOption !== null}
                                            aria-pressed={hasVoted}
                                        >
                                        <span className={"pollOptionTopRow"}>
                                            <span className={"pollOptionName"}>{option.name}</span>
                                            <span className={"pollOptionCount"}>
                                                {voteCount} vote{voteCount === 1 ? '' : 's'} ({percent}%)
                                            </span>
                                        </span>

                                            {hasVoted && <span className={"pollOptionVotedTag"}>You voted for this</span>}

                                            {/*don't reveal who voted on an anonymous poll*/}
                                            {!detailedPoll.anonymous && voteCount > 0 && (
                                                <span className={"pollOptionVoters"}>
                                                {option.voters.slice(0, MAX_VISIBLE_VOTERS).map(voter => (
                                                    <ProfilePicture key={voter.username} username={voter.username} size={22} />
                                                ))}
                                                    {voteCount > MAX_VISIBLE_VOTERS && (
                                                        <span className={"pollOptionVotersMore"}>
                                                        +{voteCount - MAX_VISIBLE_VOTERS}
                                                    </span>
                                                    )}
                                            </span>
                                            )}
                                        </button>

                                        {isDev && (
                                            <button
                                                type={"button"}
                                                className={"pollOptionDeleteButton"}
                                                onClick={(e) => handleDeleteOption(e, option.name)}
                                                aria-label={`Delete option ${option.name}`}
                                            >
                                                ✖
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {actionError && <p className={"errorText smaller"}>{actionError}</p>}
                    {!isAuthenticated && (
                        <p className={"warningText smaller pollLoginPrompt"}>
                            Log in to your Better Server account to vote in this poll.
                        </p>
                    )}
                </React.Fragment>
            )}
        </div>
    )
}