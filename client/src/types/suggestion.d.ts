export type SuggestionStatus = 'UNSEEN' | 'REJECTED' | 'ACCEPTED' | 'CLOSED';

export interface Suggestion {
    title: string;
    description: string;
    status: SuggestionStatus;
    adminResponse: string;
    posterUsername: string,
    createdAt: string;
}

export interface NewSuggestionRequest {
    title: string;
    description: string;
}

export interface ChangeAdminResponseRequest {
    suggestionTitle: string;
    adminResponse: string;
}

export interface ChangeStatusRequest {
    suggestionTitle: string;
    newStatus: SuggestionStatus;
}

export interface DeleteSuggestionRequest {
    title: string;
}