import React from 'react';
import {createPortal} from "react-dom";
import {Link} from "react-router";
import {useServerStatus} from "../../../context/serverStatus/ServerStatusContext.tsx";
import './serverStatusOverlay.scss';
import type {ServerStatusInfo} from "../../../types/serverStatus";

type StatusState = 'online' | 'offline' | 'loading';

export default function ServerStatusOverlay(): React.ReactElement {

    const serverStatus: ServerStatusInfo | undefined = useServerStatus();

    const state: StatusState = serverStatus === undefined
        ? 'loading'
        : serverStatus.online ? 'online' : 'offline';

    const label: string = state === 'loading'
        ? "Checking status..."
        : state === 'offline'
            ? "Server offline"
            : `${serverStatus!.players.online} player${serverStatus!.players.online === 1 ? '' : 's'} online`;

    return createPortal(
        <Link to={"/serverStatus"} className={`serverStatusOverlayWrapper ${state}`} aria-label={label}>
            <span className={"serverStatusIconSlot"}>
                <span className={"serverStatusDot"} />
            </span>
            <span className={"serverStatusLabel"}>
                {label}
            </span>
        </Link>,
        document.body
    )
}