import React, {useState, useEffect} from 'react';



export default function ServerStatusOverlay():React.ReactElement {

    const [serverOnline, setServerOnline] = useState<boolean>(false);
    const [playerCount, setPlayerCount] = useState<number>(33);


    //Is the server running? How many players are online?
    useEffect(() => {
    }, []);

    return (
        <div id="serverStatusOverlayWrapper">

            {/*server status dot*/}
            <span className={`statusDot ${serverOnline ? "statusOn" : "statusOff"}`} />

            {/*server details (will show on hover)*/}
            <div className="statusDetails">
                <p>
                    Players online: {playerCount}
                </p>
            </div>
        </div>
    );
};