import React, {useState, useEffect} from 'react';
import axios from 'axios';
import type { statusObj } from '../pages/serverStatus/statusObj';
import { Link } from 'react-router';


export default function ServerStatusOverlay():React.ReactElement {

    const [serverOnline, setServerOnline] = useState<boolean>(false);
    const [playerCount, setPlayerCount] = useState<number>(0);

    useEffect(() => {

        function getServerInformation():void {
            axios.get('/serverStatus').then((res) => {
    
                //if we managed to successfully get the server status
                if (!res.data.error) {
                    const data: statusObj = res.data;
                    setPlayerCount(data.players.online);
                    setServerOnline(true);
                }
                else {
                    setServerOnline(false);
                    setPlayerCount(0);
                };
            });
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
        <Link to="/serverStatus">
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