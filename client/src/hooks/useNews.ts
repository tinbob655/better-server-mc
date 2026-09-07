import {useState, useEffect} from 'react';
import type {DeleteNewsRequest, NewNewsRequest, News} from "../types/news";
import axiosInstance from "../axiosInstance.ts";
import {parseAxiosError} from "../functions/parseAxiosError.ts";
import type {AxiosResponse} from "axios";
import {useAuth} from "../context/auth/AuthContext.tsx";

interface UseNewsExports {
    news: News[];
    fetchError: string | null;

    addNews: (request: NewNewsRequest) => Promise<void>;
    deleteNews: (request: DeleteNewsRequest) => Promise<void>;
}

export default function useNews(): UseNewsExports {

    const {user} = useAuth();

    const [news, setNews] = useState<News[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);

    //initial fetch
    useEffect(() => {
        axiosInstance.get("/news")
            .then((res: AxiosResponse<News[]>) => setNews(res.data))
            .catch(err => setFetchError(parseAxiosError(err)));
    }, []);

    async function addNews(request: NewNewsRequest): Promise<void> {
        await axiosInstance.post("/news", request);

        setNews(prev => ([{
            title: request.title,
            body: request.body,
            createdBy: user?.username || 'UNKNOWN USER',
            createdAt: new Date().toISOString()
        }, ...prev]));
    }

    async function deleteNews(request: DeleteNewsRequest): Promise<void> {
        await axiosInstance.delete("/news", {
            data: request
        });

        setNews(prev => prev.filter(p => p.title != request.title));
    }

    return {news, fetchError, addNews, deleteNews}
}