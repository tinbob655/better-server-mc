import React, {useState, useEffect} from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import type { statusObj } from './statusObj';
import GenericTextSection from '../../multiPageComponents/genericTextSection';
import { getServiceStatus } from './serviceStatusAPI';


export default function ServiceStatus():React.ReactElement {

    //server state vars
    const [online, setOnline] = useState<boolean>(false);
    const [players, setPlayers] = useState<number>(0);
    const [maxPlayers, setMaxPlayers] = useState<number>(1e20);
    const [server, setServer] = useState<statusObj|null>(null);
    const [ping, setPing] = useState<number>(0);
    const [playerNames, setPlayerNames] = useState<React.ReactElement[]>([]);
    const [joinMessage, setJoinMessage] = useState<React.ReactElement>(<span style={{color: 'red', fontWeight: 900}}>unavailable</span>);


    //get server info
    useEffect(() => {

        async function getServerInfo():Promise<void> {
            const res = await getServiceStatus();
            
            //deal with potential errors
            if ('error' in res) {
                setOnline(false);
                setServer(null);
                setJoinMessage(<span style={{color: 'red', fontWeight: 900}}>unavailable</span>)
            }
            else {
                const data:statusObj = res;
                setOnline(true);
                setServer(data);
                setPlayers(data.players.online);
                setPing(data.roundTripLatency);
                setMaxPlayers(data.players.max);

                //work out the join message
                if (data.players.online < data.players.max) {

                    if (data.roundTripLatency > 100 || data.players.online >= data.players.max - 5) {

                        //server has high ping
                        setJoinMessage(<span style={{color: 'orange', fontWeight: 900}}>joinable, but may be slow</span>)
                    }
                    else {

                        //server is fine
                        setJoinMessage(<span style={{color: 'green', fontWeight: 900}}>joinable</span>)
                    };
                }
                else {

                    //server is full
                    setJoinMessage(<span style={{color:  'red', fontWeight: 900}}>full</span>)
                };
            };
        };

        //get a live feed of server info
        getServerInfo();
        setInterval(getServerInfo, 10000);
    }, []);

    //keep an up to date list of all the players
    useEffect(() => {
        let tempPlayers:React.ReactElement[] = [];
        let index:number = 0;
        let suffix:string;
        const sample = server?.players.sample;

        //make sure the stuff exists
        if (sample) {

            //work out if we need to end with a ', ', ' and ' or ''
            if (index == sample.length -1) {
                suffix = '';
            }
            else if (index == sample.length -2) {
                suffix = ' and ';
            }
            else {
                suffix = ', ';
            }
            sample.forEach((player) => {
                tempPlayers.push(
                    <React.Fragment>
                        {player.name}{suffix}
                    </React.Fragment>
                );
            });
            index++;
        };
        setPlayerNames(tempPlayers);
    }, [players]);

    return (
        <React.Fragment>
            <PageHeader title="Server Status" subtitle="Get up to speed" />
            
            {/*status section*/}
            <div className="card card-right">
                <h2 className="alignRight">
                    What's happening?
                </h2>
                <p className="alignRight">

                    {/*server online / offline*/}
                    -The server is currently {online ? (<span style={{color: 'green', fontWeight: 900}}>online</span>) : (<span style={{color: 'red', fontWeight: 900}}>offline</span>)}

                    {/*only show the rest of the server information if it is online*/}
                    {online ? (
                        <React.Fragment>
                            <br/>


                            {/*number of players online*/}
                            -There {players == 1 ? "is" : "are"} currently <span style={{fontWeight: 900}}> {players} </span> {players == 1 ? "person" : "people"} online


                            {/*list of all online players (if applicable)*/}
                            {players > 0 ? <React.Fragment>: {playerNames}</React.Fragment> : <></>}


                            {/*server ping*/}
                            <br/>
                            -Ping: {ping}ms
                            

                            {/*is the server full*/}
                            <br/>
                            -The server is {players < maxPlayers ? <span style={{color: 'green', fontWeight: 900}}>not full</span> : <span style={{color: 'green', fontWeight: 900}}>full</span>}


                        </React.Fragment>
                    ) : <></>}
                </p>
                <p className="fancy alignLeft">
                    Based on our data, the server is {joinMessage}.
                </p>
                <a href="https://discord.gg/76QQEy8XGz">
                    <h3 className="alignLeft fancyButtonText">
                        Join our discord to get whitelisted!
                    </h3>
                </a>
            </div>

            <GenericTextSection header="Server down?" paragraph="If the server is down and has been for some time, please rest assured that our admin team is working as hard as they can to get things working again. If the downtime is annoying you, you can find out more information on any scheduled downtime in our discord" linkDestination="https://discord.gg/76QQEy8XGz" linkText="Join the discord to see downtime plans" left={true} />
        </React.Fragment>
    );
};