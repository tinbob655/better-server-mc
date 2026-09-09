import {useState, useEffect} from 'react';
import type {DetailedPoll, NewPollRequest, PollSummary} from "../types/poll";
import axiosInstance from "../axiosInstance.ts";
import type {AxiosResponse} from "axios";
import {parseAxiosError} from "../functions/parseAxiosError.ts";

interface UsePollExports {
    pollSummaries: PollSummary[];
    fetchError: string | null;

    getAllPolls: () => void;
    getDetailedPoll: (pollTitle: string) => Promise<DetailedPoll>;

    addPoll: (request: NewPollRequest) => Promise<void>;

    deletePoll: (pollTitle: string) => Promise<void>;
    deletePollOption: (pollTitle: string, optionName: string) => Promise<void>;

    voteFor: (pollTitle: string, optionName: string) => Promise<void>;
}

export default function usePoll(): UsePollExports {

    const [pollSummaries, setPollSummaries] = useState<PollSummary[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);

    //fetches present polls initially
    useEffect(() => {
        axiosInstance.get("/poll/summaries/future")
            .then((res: AxiosResponse<PollSummary[]>) => setPollSummaries(res.data))
            .catch(err => setFetchError(parseAxiosError(err)));
    }, []);

    function getAllPolls(): void {
        axiosInstance.get("/poll/summaries/future")
            .then((res: AxiosResponse<PollSummary[]>) => setPollSummaries(prev =>
                ([...prev, ...res.data])
            ))
            .catch(err => setFetchError(parseAxiosError(err)));
    }

    async function getDetailedPoll(pollTitle: string): Promise<DetailedPoll> {
         const res = await axiosInstance.get(`/poll/detailed/${pollTitle}`);
         return res.data;
    }

    async function addPoll(request: NewPollRequest): Promise<void> {
         await axiosInstance.post("/poll/addPoll", request);
    }

    async function deletePoll(pollTitle: string): Promise<void> {
         await axiosInstance.delete(`/poll/deletePoll/${pollTitle}`);
    }

    async function deletePollOption(pollTitle: string, optionName: string): Promise<void> {
         await axiosInstance.delete(`/poll/deleteOption/${pollTitle}/${optionName}`);
    }

    async function voteFor(pollTitle: string, optionName: string): Promise<void> {
         await axiosInstance.patch(`/poll/voteFor/${pollTitle}/${optionName}`);
    }

    return {
        pollSummaries,
        fetchError,

        getAllPolls,
        getDetailedPoll,

        addPoll,

        deletePoll,
        deletePollOption,

        voteFor,
    }
}