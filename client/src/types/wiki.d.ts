export interface WikiPost extends WikiSummary {
    body: string;
}

export interface WikiSummary {
    title: string;
    createdBy: string;
    createdAt: string;

    upvotes: number;
    downvotes: number;
}

export interface DetailedWikiPostRequest {
    title: string;
}

export interface NewWikiPostRequest {
    title: string;
    body: string;
}

export interface DeleteWikiPostRequest {
    title: string;
}