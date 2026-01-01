import React, {useState, useEffect} from 'react';
import type { statusObj } from './statusObj';
import { Link } from 'react-router';
import { getServiceStatus } from './serviceStatusAPI';


export default function ServerStatusOverlay():React.ReactElement {

    const [serverOnline, setServerOnline] = useState<boolean>(false);
    const [playerCount, setPlayerCount] = useState<number>(0);

    useEffect(() => {

        async function getServerInformation():Promise<void> {
            const res = await getServiceStatus();

            //check for error
            if ('error' in res) {
                setServerOnline(false);
                setPlayerCount(0);
            }
            else {
                const data:statusObj = res;
                setServerOnline(true);
                setPlayerCount(data.players.online);
            };
        };

        //refresh server status every 10 seconds
        getServerInformation();
        setInterval(() => {
            getServerInformation();
        }, 10000)
    }, []);


    //Is the server running? How many players are online?
    useEffect(() => {
    }, []);

    return (
        <Link to="/serviceStatus">
            <div id="serverStatusOverlayWrapper">
                {/*server status dot*/}
                <span className={`statusDot ${serverOnline ? "statusOn" : "statusOff"}`} />

                {/*server details (will show on hover)*/}
                <div className="statusDetails">
                    <p>
                        {serverOnline ? `Players Online: ${playerCount}` : "Server offline"}
                    </p>
                </div>
            </div>
        </Link>
    );
};