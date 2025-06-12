import React, {useState, useEffect} from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';

export default function Home():React.ReactElement {

    const [playersOnline, setPlayersOnline] = useState<number>(-1);
    const [serverOnline, setServerOnline] = useState<string>('loading...');
    const [reportedOutages, setReportedOutages] = useState<number>(-1);

    interface mcServerResponse {
        latency: number,
        status: {
            description: string,
            favicon: string,
            players: {
                max: number,
                online: number,
            },
            preventsChatReports: boolean,
            version: {
                name: string,
                protocol: number,
            },
        },
        statusRaw: string,
    };

    //use effect to fetch server status, players online and reported outages
    useEffect(() => {

        //asks the backend if the mc server is working
        async function fetchServerStatus():Promise<[string, number]> {

            try {
                const response:Response = await fetch(`${import.meta.env.VITE_EXPRESS_URL}/serverStatus`);
                const data:string = await response.text();

                if (data) {
                    const parsedData:mcServerResponse = JSON.parse(data);

                    return [
                        'ONLINE',
                        parsedData.status.players.online
                    ];
                }
                else return ['OFFLINE', -1];
            }
            catch(error) {
                console.error(error);
                return ['OFFLINE', -1];
            };
        };

        fetchServerStatus().then((response) => {
            setServerOnline(response[0]);
            setPlayersOnline(response[1]);
        });

        setReportedOutages(-1);
    }, []);

    return (
        <React.Fragment>
            <PageHeader title="Better Server MC" subtitle="A Better Minecraft Server" />

            {/*welcome & description section*/}

            <h2 className="alignLeft">
                Welcome on in...
            </h2>
            <p className="alignLeft" style={{maxWidth: '66%'}}>
                Eiusmod fugiat nostrud laborum occaecat ut.Dolore ullamco velit id cillum.Anim quis voluptate irure qui quis mollit incididunt quis irure eiusmod ex.Do do fugiat officia esse qui aliqua labore irure magna.Eu laboris aliquip officia duis ipsum ex ullamco ea in voluptate laborum.Esse culpa elit proident proident consequat esse excepteur aute proident sit exercitation aliqua.Incididunt ad laboris sunt ad pariatur laboris dolore nulla pariatur excepteur reprehenderit.Deserunt id aliquip nulla tempor Lorem cupidatat culpa elit esse voluptate sint.
            </p>

            <div className="dividerLine"></div>

            {/*server status section*/}
            <h2 className="alignRight">
                Server Status
            </h2>
            <p className="alignRight">
                Based on our current data, the server appears to be <b>{serverOnline}</b>
                <br/><br/>
                {reportedOutages} Player{reportedOutages === 1 ? ' has' : 's have'} reported an outage in the last hour.
                <br/><br/>

                {/*will display loading if fetching server data, otherwise will display the number of players online*/}
                {playersOnline === -1 ? 'Loading...' : playersOnline === 1 ? 'There is currently 1 player online.' : `There are currently ${playersOnline} players online.`}
            </p>
            <button type="button">
                <h3>
                    Having an issue? Report it here
                </h3>
            </button>

            <div className="dividerLine"></div>
        </React.Fragment>
    );
};