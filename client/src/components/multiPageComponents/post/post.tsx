import React, {useState, useEffect} from 'react';
import binIcon from '../../../assets/images/deleteIcon.svg';
import { useAuth } from '../../../context/AuthContext';
import PostImage from './postImage';


interface params {
    username: string,
    postContent: string,
    deleteFunction: Function,
    left: boolean,
};

export default function Post({username, postContent, deleteFunction, left}:params):React.ReactElement {

    const { loggedIn, username: currentUsername } = useAuth();
    const [showBin, setShowBin] = useState<boolean>(false);
    const [postImage, setPostImage] = useState<React.ReactElement>(<></>);

    //see if the user is logged in and if so check if this is their post
    useEffect(() => {
        if (loggedIn && currentUsername === username) {
            //this is the user's post
            setShowBin(true);
        } else {
            //this is not the user's post
            setShowBin(false);
        }

        //we also need to set an image
        setPostImage(<PostImage username={username} />);
    }, [loggedIn, currentUsername, username]);

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
                    {postImage}
                </div>
                <p className={`fancy ${left ? "alignLeft" : "alignRight"}`}>
                    {postContent}
                </p>
            </div>
        </React.Fragment>
    );
};