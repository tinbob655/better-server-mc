import React, {useEffect, useState} from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import type { playerObj } from './playerObj';
import type { playerRecord } from './playerRecord';
import axios from 'axios';
import FancyButton from '../../multiPageComponents/fancyButton';
import GenericTextSection from '../../multiPageComponents/genericTextSection'
import NewPlayerPopup from './newPlayerPopup';
import {makeNewPlayer, deleteEntry} from './playerAPI';
import deleteIcon from '../../../assets/images/deleteIcon.svg';


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
        axios.get('/api/accountDb/queryLoggedIn').then((res) => {
            if (res && res.data && res.data.loggedIn) {
                setUsername(res.data.username);
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
                profilePicture: new File(
                    [new Uint8Array(record.profilePicture.data)],
                    "profilePicture.png",
                    {type: "image/png"}
                ),
            });
        });
        setPlayerList([...data]);
    }, [dbContent]);

    
    //keep the playerHTML up to date with the playerList
    useEffect(() => {

        //make sure we have players
        if (playerList) {
            let tempPlayersHTML:React.ReactElement[] = [];
            let index:number = 0;
            playerList.forEach((player) => {
                tempPlayersHTML.push(
                    <React.Fragment>

                        {/*if this is the user's post give them the option to delete it*/}
                        {player.name === username ? (
                            <React.Fragment>
                                <button type="button" onClick={() => {deleteEntry(player.name).then((res) => {setDbContent([...res])})}} style={{position: 'absolute', zIndex: 1, left: '8vw', marginTop: '10px'}}>
                                    <img src={deleteIcon} className="button" />
                                </button>
                            </React.Fragment>
                        ) : <></>}


                        <GenericTextSection header={player.name} paragraph={player.description}  left={false} headerImage={URL.createObjectURL(player.profilePicture)} />
                    </React.Fragment>
                );
                index++;
            });
            setPlayersHTML(tempPlayersHTML);
        };
    }, [playerList]);


    async function newPlayerPopupFormSubmitted(event:React.FormEvent):Promise<void> {
        event.preventDefault();

        //users cannot post if they are not logged in
        if (!username) {
            throw new Error('You may only post if you are logged in');
        };

        //users may only post about themselves
        const target = event.target as typeof event.target & {name: {value: string}};
        if (username != target.name.value) {
            throw new Error('You may only post about yourself');
        };

        //hide the popup
        document.getElementById('newPlayerPopupWrapper')?.classList.remove('shown');
        setTimeout(() => {
            setNewSectionPopup(<></>);
        }, 1000);

        //make the new player and update local copy of db
        const res = await makeNewPlayer(event, playerList)
        if (res) {
            const exists:boolean = dbContent.some(player => player.name === res.name);
            if (exists) {
                setDbContent(dbContent.map(player => player.name === res.name ? res : player));
            }
            else {
                setDbContent([...dbContent, res]);
            };
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
                    setNewSectionPopup(<NewPlayerPopup closeFunc={(event:React.FormEvent) => {
                        newPlayerPopupFormSubmitted(event);
                }}/>)
                    setTimeout(() => {
                        document.getElementById('newPlayerPopupWrapper')?.classList.add('shown');
                    }, 10);
                }}/>
            </div>
        </React.Fragment>
    );
};