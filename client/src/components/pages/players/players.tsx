import React, {useEffect, useState} from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import type { playerObj } from './playerObj';
import type { playerRecord } from './playerRecord';
import axios from 'axios';
import FancyButton from '../../multiPageComponents/fancyButton';
import NewPlayerPopup from './newPlayerPopup';
import {makeNewPlayer, deleteEntry} from './playerAPI';
import Post from '../../multiPageComponents/post/post';
import { queryLoggedIn } from '../account/accountAPI';


export default function Players():React.ReactElement {

    const [dbContent, setDbContent] = useState<playerRecord[]>([]);
    const [playerList, setPlayerList] = useState<playerObj[]>([]);
    const [playersHTML, setPlayersHTML] = useState<React.ReactElement[]>([]);
    const [newSectionPopup, setNewSectionPopup] = useState<React.ReactElement>(<></>);
    const [username, setUsername] = useState<string|null>(null);


    //initial queries
    useEffect(() => {

        //get the player entries
        axios.get('/api/playerDb').then((res) => {
            setDbContent(res.data);
        });

        //find out if the user is logged in
        queryLoggedIn().then((res) => {
            if (res && res && res.loggedIn) {
                setUsername(res.username);
            }
            else {
                setUsername(null);
            };
        });
    }, []);

    //keep the playerList up to date with the database
    useEffect(() => {
        let data:playerObj[] = [];

        dbContent.forEach((record:playerRecord) => {
            data.push({
                name: record.name,
                description: record.description,
                date: new Date(record.date),
            });
        });
        data.sort((a, b) => b.date.getTime() - a.date.getTime());
        setPlayerList([...data]);
    }, [dbContent]);

    
    //keep the playerHTML up to date with the playerList
    useEffect(() => {

        //make sure we have players
        if (playerList) {
            let tempPlayersHTML:React.ReactElement[] = [];
            let index:number = 0;
            playerList.forEach((player) => {
                let left:boolean = !(index % 2 === 0);
                tempPlayersHTML.push(
                    <Post key={player.name} postContent={player.description} username={player.name} deleteFunction={() => {deleteEntry(player.name).then((res) => {setDbContent([...res])})}} left={left} />
                );
                index++;
            });
            setPlayersHTML(tempPlayersHTML);
        };
    }, [playerList]);


    async function newPlayerPopupFormSubmitted(event: React.FormEvent, setErrorMsg: (msg: string) => void): Promise<void> {
        event.preventDefault();
        setErrorMsg('');

        //users cannot post if they are not logged in
        if (!username) {
            setErrorMsg('You may only post if you are logged in');
            return;
        };

        try {
            //make the new player and update local copy of db
            const res = await makeNewPlayer(event, playerList);
            if (res) {
                const exists: boolean = dbContent.some(player => player.name === res.name);
                if (exists) {
                    setDbContent(dbContent.map(player => player.name === res.name ? res : player));
                } 
                else {
                    setDbContent([...dbContent, res]);
                };
            };

            //hide the popup on success
            document.getElementById('newPlayerPopupWrapper')?.classList.remove('shown');
            setTimeout(() => {
                setNewSectionPopup(<></>);
            }, 1000);
        }
        catch (err: unknown) {
            let msg = 'An error occurred.';
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosErr = err as { response?: { data?: { message?: string } } };
                if (axiosErr.response?.data?.message) {
                    msg = axiosErr.response.data.message;
                }
            } else if (err instanceof Error) {
                msg = err.message;
            };
            setErrorMsg(msg);
        };
    };


    return (
        <React.Fragment>
            {/*popup for adding new players*/}
            {newSectionPopup}


            <PageHeader title="The playerbase" subtitle="Meet the team" />

            {/*sugared content from db*/}
            {playersHTML}

            {/*add / update section*/}
            <div className="card card-right">
                <h2 className="alignRight">
                    Add & Update
                </h2>
                <p className="alignRight fancy">
                    You can add yourself to this page right now and it's easy! All you need to do is log into your Better Server account and write yourself a description. Make sure you have an image for your profile picture as well!
                </p>
                <FancyButton text="Click here to get started!" transformOrigin="left"
                action={() => {
                    setNewSectionPopup(<NewPlayerPopup closeFunc={(event: React.FormEvent, setErrorMsg: (msg: string) => void) => {
                        newPlayerPopupFormSubmitted(event, setErrorMsg);
                    }}/>);
                    setTimeout(() => {
                        document.getElementById('newPlayerPopupWrapper')?.classList.add('shown');
                    }, 10);
                }}/>
            </div>
        </React.Fragment>
    );
};