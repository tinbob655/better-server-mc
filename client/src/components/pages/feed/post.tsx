import React, {useState, useEffect} from 'react';
import axios from 'axios';
import binIcon from '../../../assets/images/deleteIcon.svg';


interface params {
    username: string,
    userProfile: File,
    postContent: string,
    deleteFunction: Function,
    left: boolean,
};

export default function Post({username, userProfile, postContent, deleteFunction, left}:params):React.ReactElement {

    const [showBin, setShowBin] = useState<boolean>(false);

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
                    <img src={URL.createObjectURL(userProfile)} className="rounded" style={{ height: '50px', margin: 0, marginLeft: '10px'}} />
                </div>
                <p className={`fancy ${left ? "alignLeft" : "alignRight"}`}>
                    {postContent}
                </p>
            </div>
        </React.Fragment>
    );
};