import type {UserSummary} from "./auth";

export type Color = `#${string}`;

export interface PollSummary {
    title: string;
    createdAt: string;
}

export interface DetailedPoll extends PollSummary {
    anonymous: boolean;
    options: PollOption[];
}

export interface PollOption {
    name: string;
    color: Color;
    voters: UserSummary[];
}

export interface NewPollRequest {
    title: string;
    anonymous: boolean;
    defaultOptions: NewPollOptionRequest[];
}

export interface NewPollOptionRequest {
    name: string;
    color: Color;
}