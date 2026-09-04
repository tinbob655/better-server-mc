import React from 'react';
import PageHeader from "../../components/PageHeader.tsx";
import GenericMarkupSection from "../../components/genericMarkupSection/GenericMarkupSection.tsx";
import {useServerStatus} from "../../context/serverStatus/ServerStatusContext.tsx";
import type {ServerStatusInfo} from "../../types/serverStatus";

export default function ServerStatus(): React.ReactElement {

    const status: ServerStatusInfo | undefined = useServerStatus();

    return (
        <React.Fragment>
            <PageHeader title={"Server Status"} subtitle={"Find out what's going on with the server"} />

            <GenericMarkupSection title={"What's happening?"}>
                <p>
                    Based on our current information, the server is{' '}
                    <span className={status ? status.online ? "successText" : "errorText" : "warningText"}>
                        {status ? status.online ? "online" : "offline" : "missing??"}.
                    </span>
                </p>

                {/*only try to show more information if the server is online*/}
                {status?.online && (
                    <React.Fragment>
                        <p>

                            {/*motd*/}
                            The server says <i>"{status.motd.clean}"</i>
                            <br/>{status.players.online > 0 && <br/>}

                            {/*players online & player list*/}
                            Currently there are <b>{status.players.online}/{status.players.max}</b> players online
                            {status.players.online > 0 ? ":" : "."}
                            {status.players.online > 0 && (
                                <ol className={"alignRight"} style={{marginRight: 0}}>
                                    {status.players.list.map(player =>
                                        <li>
                                            {player.nameClean}
                                        </li>
                                    )}
                                </ol>
                            )}
                            <br/>

                            {/*version & protocol*/}
                            We are running MC version <b>{status.version.nameClean}</b> at the moment (protocol <b>{status.version.protocol}</b>).
                        </p>
                    </React.Fragment>
                )}
            </GenericMarkupSection>
        </React.Fragment>
    )
}