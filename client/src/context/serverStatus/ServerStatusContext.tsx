import {createContext, useContext} from "react";
import type {ServerStatusInfo} from "../../types/serverStatus";

interface ServerStatusContextValue {
    status: ServerStatusInfo | undefined;
}

export const ServerStatusContext = createContext<ServerStatusContextValue | undefined>(undefined);

export function useServerStatus(): ServerStatusInfo | undefined {
    const context = useContext(ServerStatusContext);
    if (context === undefined) throw new Error("useServerStatus must be used within a ServerStatusProvider");
    return context.status;
}