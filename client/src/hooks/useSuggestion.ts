import {useState, useEffect} from 'react';
import type {
    ChangeAdminResponseRequest,
    ChangeStatusRequest, DeleteSuggestionRequest,
    NewSuggestionRequest,
    Suggestion
} from "../types/suggestion";
import axiosInstance from "../axiosInstance.ts";
import type {AxiosResponse} from "axios";
import {parseAxiosError} from "../functions/parseAxiosError.ts";
import {useAuth} from "../context/auth/AuthContext.tsx";
import formatDate from '../functions/formatDate.ts';

export interface UseSuggestionExports {
    suggestions: Suggestion[];
    fetchError: string | null;

    addSuggestion: (request: NewSuggestionRequest) => Promise<void>;
    getAllSuggestions: () => Promise<void>;
    changeSuggestionStatus: (request: ChangeStatusRequest) => Promise<void>;
    changeSuggestionAdminResponse: (request: ChangeAdminResponseRequest) => Promise<void>;
    deleteSuggestion: (request: DeleteSuggestionRequest) => Promise<void>;
}

export default function useSuggestion(): UseSuggestionExports  {

    const {user} = useAuth();

    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        axiosInstance.get("/suggestion/open")
            .then((res: AxiosResponse<Suggestion[]>) => setSuggestions(res.data))
            .catch(err => setFetchError(parseAxiosError(err)))
    }, [])

    async function addSuggestion(request: NewSuggestionRequest): Promise<void> {
        await axiosInstance.post("/suggestion", request)

        setSuggestions(prev => [{
            title: request.title,
            description: request.description,
            status: "UNSEEN",
            adminResponse: '',
            posterUsername: user?.username ?? 'UNKNOWN',
            createdAt: formatDate(new Date().toISOString())
        }, ...prev]);
    }

    async function getAllSuggestions(): Promise<void> {
        try {
            const res: AxiosResponse<Suggestion[]> = await axiosInstance.get('/suggestion/all');
            setSuggestions(res.data);
        }
        catch (err) {
            setFetchError(parseAxiosError(err));
        }
    }

    async function changeSuggestionStatus(request: ChangeStatusRequest): Promise<void> {
        await axiosInstance.patch("/suggestion/status", request);

        setSuggestions(prev => prev.map(p =>
            p.title === request.suggestionTitle ? {...p, status: request.newStatus} : p
        ))
    }

    async function changeSuggestionAdminResponse(request: ChangeAdminResponseRequest): Promise<void> {
        await axiosInstance.patch("/suggestion/adminResponse", request);

        setSuggestions(prev => prev.map(p =>
            p.title === request.suggestionTitle ? {...p, adminResponse: request.adminResponse} : p
        ))
    }

    async function deleteSuggestion(request: DeleteSuggestionRequest): Promise<void> {
        await axiosInstance.delete("/suggestion", {data: request});

        setSuggestions(prev => prev.filter(p =>
            p.title != request.title
        ));
    }

    //exports
    return {
        suggestions,
        fetchError,

        addSuggestion,
        getAllSuggestions,
        changeSuggestionStatus,
        changeSuggestionAdminResponse,
        deleteSuggestion,
    }
}