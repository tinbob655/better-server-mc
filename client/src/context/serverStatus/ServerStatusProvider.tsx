import React, {useEffect, useState} from 'react';
import type {ServerStatusInfo} from "../../types/serverStatus";
import {ServerStatusContext} from "./ServerStatusContext.tsx";

/*derives the websocket origin from the REST API base url, e.g.
//"http://localhost:8080/api" -> "ws://localhost:8080" (https -> wss) */
const WS_BASE_URL: string = import.meta.env.VITE_API_BASE_URL
    .replace(/\/api\/?$/, '')
    .replace(/^http/, 'ws');

const RECONNECT_DELAY_MS = 3_000;

export function ServerStatusProvider({children}: {children: React.ReactNode}): React.ReactElement {

    const [serverStatus, setServerStatus] = useState<ServerStatusInfo | undefined>(undefined);

    useEffect(() => {
        let socket: WebSocket;
        let reconnectTimeout: ReturnType<typeof setTimeout>;
        let cancelled = false;

        function connect(): void {
            socket = new WebSocket(`${WS_BASE_URL}/ws/serverStatus`);

            socket.onmessage = (event: MessageEvent<string>) => {
                setServerStatus(JSON.parse(event.data));
            };

            //if the connection drops out, try to reconnect
            socket.onclose = () => {
                if (!cancelled) reconnectTimeout = setTimeout(connect, RECONNECT_DELAY_MS);
            };
        }

        connect();

        return () => {
            cancelled = true;
            clearTimeout(reconnectTimeout);
            socket?.close();
        };
    }, []);

    return (
        <ServerStatusContext.Provider value={{status: serverStatus}}>
            {children}
        </ServerStatusContext.Provider>
    )
}