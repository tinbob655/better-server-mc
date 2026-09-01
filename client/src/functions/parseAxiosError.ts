import axios from 'axios';


interface SpringErrorBody {
    message?: string;
}

const DEFAULT_ERROR_MESSAGE: string = "An unexpected error occurred. Please try again.";

export function parseAxiosError(error: unknown): string {
    if (!axios.isAxiosError(error)) {
        return error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
    }

    //case 1: request reached the server, server replied with an error status
    if (error.response) {
        const {data, status} = error.response;

        //ResponseEntity.body("some string") is delivered here as a plain string
        if (typeof data === 'string' && data.trim().length > 0) {
            return data;
        }

        //fallback for Spring's default JSON error shape, in case a handler ever
        //returns that instead of a plain string
        if (data && typeof data === 'object') {
            const message = (data as SpringErrorBody).message;
            if (typeof message === 'string' && message.trim().length > 0) {
                return message;
            }
        }

        return `Request failed with status ${status}`;
    }

    //case 2: request was made, but the server never responded
    if (error.request) {
        return 'Could not reach the server. Please check your connection and try again.';
    }

    //case 3: request was never sent
    return error.message || DEFAULT_ERROR_MESSAGE;
}