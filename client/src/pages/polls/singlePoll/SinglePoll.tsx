import React, {useState, useRef} from 'react';
import './singlePoll.scss';
import type {DetailedPoll, PollSummary} from "../../../types/poll";
import formatDate from "../../../functions/formatDate.ts";
import {useAuth} from "../../../context/auth/AuthContext.tsx";
import {Permission} from "../../../types/permission.ts";
import IconButton from "../../../components/iconButton/IconButton.tsx";

interface SinglePollParams {
    pollSummary: PollSummary;
    expired?: boolean;

    getDetailedPoll: () => Promise<DetailedPoll>
    voteFor: (pollTitle: string, optionName: string) => Promise<void>
    deletePoll: () => Promise<void>
    deletePollOption: (pollTitle: string, optionName: string) => Promise<void>
}

export default function SinglePoll({pollSummary, expired, getDetailedPoll, voteFor, deletePoll, deletePollOption}: SinglePollParams): React.ReactElement {

    const {user} = useAuth();
    const isDev: boolean = user?.maxPermission === Permission.DEV;

    const wrapperRef = useRef<HTMLDivElement>(null);

    const [detailedPoll, setDetailedPoll] = useState<DetailedPoll | null>(null);
    const [showDetailedPoll, setShowDetailedPoll] = useState<boolean>(false);

    async function toggleDetailed(): Promise<void> {
        if (showDetailedPoll && !detailedPoll) {
            const res = await getDetailedPoll();
            setDetailedPoll(res);
        }
        setShowDetailedPoll(prev => !prev);
    }

    return (
        <div className={`singlePollWrapper widget ${expired ? "expired" : ""}`} ref={wrapperRef}>

            {/*title expands on click*/}
            <button onClick={toggleDetailed}>
                <h2 className={"alignLeft"}>
                    {pollSummary.title}
                </h2>
                <p className={"alignLeft smaller"}>
                    Created on {formatDate(pollSummary.createdAt)}.
                </p>
            </button>

            {/*if the user is a dev show the delete button in the top left*/}
            {isDev && <IconButton
                imageLoader={() => import("../../../assets/images/buttons/delete.svg")}
                showElementRef={wrapperRef}
                onClick={deletePoll}
                />
                }

            {/*extra poll information when expanded*/}
            {showDetailedPoll && detailedPoll && (
                <React.Fragment>

                </React.Fragment>
            )}
        </div>
    )
}