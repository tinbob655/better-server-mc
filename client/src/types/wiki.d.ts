export interface WikiPost extends WikiSummary {
    body: string;
}

export interface WikiSummary {
    title: string;
    createdBy: string;
    createdAt: string;

    upvotes: string[];
    downvotes: string[];
}

export interface DetailedWikiPostRequest {
    title: string;
}

export interface NewWikiPostRequest {
    title: string;
    body: string;
}

export interface WikiVotingRequest {
    title: string;
    sign: 1 | -1;
}

export interface DeleteWikiPostRequest {
    title: string;
}