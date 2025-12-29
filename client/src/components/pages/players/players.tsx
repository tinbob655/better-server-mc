import React, {useEffect, useState} from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import type { playerObj } from './playerObj';
import type { playerRecord } from './playerRecord';
import axios from 'axios';
import FancyButton from '../../multiPageComponents/fancyButton';
import GenericTextSection from '../../multiPageComponents/genericTextSection'
import NewPlayerPopup from './newPlayerPopup';
import makeNewPlayer from './makeNewPlayer';


export default function Players():React.ReactElement {

    const [dbContent, setDbContent] = useState<playerRecord[]>([]);
    const [playerList, setPlayerList] = useState<playerObj[]>([]);
    const [playersHTML, setPlayersHTML] = useState<React.ReactElement[]>([]);
    const [newSectionPopup, setNewSectionPopup] = useState<React.ReactElement>(<></>);


    //initially we need to query all
    useEffect(() => {
        axios.get('/api/playerDb').then((res) => {
            setDbContent(res.data);
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
        if (playerList && playerList.length > 0) {
            let tempPlayersHTML:React.ReactElement[] = [];
            let index:number = 0;
            playerList.forEach((player) => {
                const left:boolean = !(index % 2 == 0);
                tempPlayersHTML.push(
                    <GenericTextSection header={player.name} paragraph={player.description}  left={left} headerImage={URL.createObjectURL(player.profilePicture)} />
                );
                index++;
            });
            setPlayersHTML(tempPlayersHTML);
        };
    }, [playerList]);


    function newPlayerPopupFormSubmitted(event:React.FormEvent) {
        event.preventDefault();

        //check if the end user is logged into a microsoft account

        //hide the popup
        document.getElementById('newPlayerPopupWrapper')?.classList.remove('shown');
        setTimeout(() => {
            setNewSectionPopup(<></>);
        }, 1000);

        //make the new player and update local copy of db
        makeNewPlayer(event, playerList).then((res) => {
            if (res) {
                const exists:boolean = dbContent.some(player => player.name === res.name);
                if (exists) {
                    setDbContent(dbContent.map(player => player.name === res.name ? res : player));
                } else {
                    setDbContent([...dbContent, res]);
                };
            };
        });
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
                    You can add yourself to this page right now and it's easy! All you need to do is log into your Minecraft account and write yourself a description. Make sure you have an image for your profile picture as well!
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