import React, {useEffect, useState} from 'react';
import axiosInstance from "../../axiosInstance.ts";
import type {ServerStatusInfo} from "../../types/serverStatus";
import {ServerStatusContext} from "./ServerStatusContext.tsx";

const PING_DELAY_MS = 5_000;

export function ServerStatusProvider({children}: {children: React.ReactNode}): React.ReactElement {

    const [serverStatus, setServerStatus] = useState<ServerStatusInfo|undefined>(undefined);

    useEffect(() => {
        function fetchStatus(): void {
            axiosInstance.get("/serverStatus")
                .then(res => setServerStatus(res.data));
        }

        //initial ping
        setTimeout(() => {
            fetchStatus();
        }, 100);

        //recurring ping
        const interval = setInterval(fetchStatus, PING_DELAY_MS);

        return (() => clearInterval(interval));
    }, []);

    return (
        <ServerStatusContext.Provider value={{status: serverStatus}}>
            {children}
        </ServerStatusContext.Provider>
    )
}