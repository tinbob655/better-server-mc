export interface News {
    title: string;
    body: string;
    createdBy: string;
    createdAt: string;
}

export interface NewNewsRequest {
    title: string;
    body: string;
}

export interface DeleteNewsRequest {
    title: string;
}