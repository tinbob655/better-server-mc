import React, {useState} from 'react';
import './singlePoll.scss';
import type {DetailedPoll, PollSummary} from "../../../types/poll";
import formatDate from "../../../functions/formatDate.ts";

interface SinglePollParams {
    pollSummary: PollSummary;
    expired?: boolean;

    getDetailedPoll: () => Promise<DetailedPoll>
    voteFor: (pollTitle: string, optionName: string) => Promise<void>
    deletePoll: (pollTitle: string) => Promise<void>
    deletePollOption: (pollTitle: string, optionName: string) => Promise<void>
}

export default function SinglePoll({pollSummary, expired, getDetailedPoll, voteFor, deletePoll, deletePollOption}: SinglePollParams): React.ReactElement {

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
        <div className={`singlePollWrapper widget ${expired ? "expired" : ""}`}>

            {/*title expands on click*/}
            <button onClick={toggleDetailed}>
                <h2 className={"alignLeft"}>
                    {pollSummary.title}
                </h2>
                <p className={"alignLeft smaller"}>
                    Created on {formatDate(pollSummary.createdAt)}.
                </p>
            </button>

            {/*extra poll information when expanded*/}
            {showDetailedPoll && detailedPoll && (
                <React.Fragment>

                </React.Fragment>
            )}
        </div>
    )
}