import {useState, useEffect} from 'react';
import type {
    DeleteWikiPostRequest,
    DetailedWikiPostRequest,
    NewWikiPostRequest,
    WikiPost,
    WikiSummary, WikiVotingRequest
} from "../types/wiki";
import axiosInstance from "../axiosInstance.ts";
import type {AxiosResponse} from "axios";
import {parseAxiosError} from "../functions/parseAxiosError.ts";
import {useAuth} from "../context/auth/AuthContext.tsx";

interface UseWikiExports {
    summaries: WikiSummary[];
    fetchError: string | null;

    getDetailedPost: (request: DetailedWikiPostRequest) => Promise<WikiPost>;
    addWikiPost: (request: NewWikiPostRequest) => Promise<void>;
    voteOnWikiPost: (request: WikiVotingRequest) => Promise<void>;
    deleteWikiPost: (request: DeleteWikiPostRequest) => Promise<void>;
}

export default function useWiki(): UseWikiExports {

    const {user} = useAuth();

    const [summaries, setSummaries] = useState<WikiSummary[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);

    //initial fetch
    useEffect(() => {
        axiosInstance.get("/wiki/all")
            .then((res: AxiosResponse<WikiSummary[]>) => setSummaries(res.data))
            .catch(err => setFetchError(parseAxiosError(err)));
    }, []);

    async function getDetailedPost(request: DetailedWikiPostRequest): Promise<WikiPost> {
        const post: AxiosResponse<WikiPost> = await axiosInstance.get(`/wiki/${request.title}`);
        return post.data;
    }

    async function addWikiPost(request: NewWikiPostRequest): Promise<void> {
        await axiosInstance.post("/wiki", request);

        setSummaries(prev => ([{
            title: request.title,
            createdBy: user?.username || 'UNKNOWN USER',
            createdAt: new Date().toISOString(),
            upvotes: [],
            downvotes: [],
        }, ...prev]));
    }

    async function voteOnWikiPost(request: WikiVotingRequest): Promise<void> {
        await axiosInstance.patch(
            `/wiki/${request.sign === 1 ? "upvote" : "downvote"}/${request.title}`
        );

        setSummaries(prev => prev.map(p => {
            if (p.title !== request.title) return p;

            const username: string = user!.username;

            return {
                ...p,
                upvotes: request.sign === 1
                    ? [...p.upvotes.filter(up => up !== username), username]
                    : p.upvotes.filter(up => up !== username),

                downvotes: request.sign === -1
                    ? [...p.downvotes.filter(down => down !== username), username]
                    : p.downvotes.filter(down => down !== username)
            };
        }));
    }

    async function deleteWikiPost(request: DeleteWikiPostRequest): Promise<void> {
        await axiosInstance.delete(`/wiki/${request.title}`)

        setSummaries(prev => prev.filter(p => p.title !== request.title));
    }

    return {
        summaries,
        fetchError,
        getDetailedPost,
        addWikiPost,
        voteOnWikiPost,
        deleteWikiPost
    }
}