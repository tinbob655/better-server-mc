import {useCallback, useEffect, useRef, useState} from 'react';

const DISCORD_AUTH_URL = 'https://discord.com/oauth2/authorize';
const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const REDIRECT_URI = `${import.meta.env.VITE_API_BASE_URL}/auth/discord/callback`;

interface DiscordAuthMessage {
    source: 'betterServerDiscordAuth';
    success: boolean;
    ticket: string | null;
}

export interface UseDiscordVerificationExports {
    ticket: string | null;      //non-null once verified
    verifying: boolean;         //true while popup is open
    error: string | null;
    startVerification: () => void;
}

export default function useDiscordVerification(): UseDiscordVerificationExports {

    const [ticket, setTicket] = useState<string | null>(null);
    const [verifying, setVerifying] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const popupRef = useRef<Window | null>(null);

    //listen for discord callback
    useEffect(() => {
        function handleMessage(e: MessageEvent<DiscordAuthMessage>): void {
            if (e.data?.source !== 'betterServerDiscordAuth') return;

            setVerifying(false);
            if (e.data.success && e.data.ticket) {
                setTicket(e.data.ticket);
                setError(null);
            }

            else {
                setError("We couldn't verify you're a member of our Discord server. Please join and try again.");
            }
        }

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    //opens the discord auth popup
    const startVerification = useCallback((): void => {
        setError(null);
        setVerifying(true);

        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: 'code',
            scope: 'guilds',
        });

        popupRef.current = window.open(
            `${DISCORD_AUTH_URL}?${params.toString()}`,
            'discordAuth',
            'width=500,height=800'
        );
    }, []);

    return {ticket, verifying, error, startVerification};
}