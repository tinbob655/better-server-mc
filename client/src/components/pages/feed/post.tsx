import React, {useState, useEffect} from 'react';
import axios from 'axios';
import binIcon from '../../../assets/images/deleteIcon.svg';
import {getProfilePictureUrl} from '../account/accountAPI';


interface params {
    username: string,
    postContent: string,
    deleteFunction: Function,
    left: boolean,
};

export default function Post({username, postContent, deleteFunction, left}:params):React.ReactElement {

    const [showBin, setShowBin] = useState<boolean>(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState<string>('');

    //see if the user is logged in and if so get their username
    useEffect(() => {
        axios.get('/api/accountDb/queryLoggedIn').then((res) => {
            if (res.data.loggedIn && res.data.username == username) {

                //this is the user's post
                setShowBin(true);
            }
            else {
                setShowBin(false);
            }
        }).catch((error) => {
            console.error(error);
            setShowBin(false);
        });
    }, []);

    //fetch the profile picture URL based on username
    useEffect(() => {
        if (username) {
            setProfilePictureUrl(getProfilePictureUrl(username));
        }
    }, [username]);

    return (
        <React.Fragment>
            <div className={`card ${left ? "card-left" : "card-right"}`}>
                {showBin ? (
                    <React.Fragment>
                        <button type="button" onClick={() => {deleteFunction()}} style={{position: 'absolute', top: 10, left: left ? "unset" : 10, right: left ? 10 : "unset"}}>
                            <img src={binIcon} className="button" />
                        </button>
                    </React.Fragment>
                ) : <></>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, justifyContent: left ? 'flex-start' : 'flex-end' }}>
                    <h2 className={left ? "alignLeft" : "alignRight"} style={{marginRight: 0}} >
                        {username}
                    </h2>
                    {profilePictureUrl && (
                        <img src={profilePictureUrl} className="rounded" style={{ height: '50px', margin: 0, marginLeft: '10px'}} />
                    )}
                </div>
                <p className={`fancy ${left ? "alignLeft" : "alignRight"}`}>
                    {postContent}
                </p>
            </div>
        </React.Fragment>
    );
};