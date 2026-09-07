import React, {useEffect, useState} from 'react';
import './profilePicture.scss';

interface ProfilePictureParams {
    username: string;
    size?: number; //in px
    refreshKey?: number; //incremented to remove browser caching
}

const DEFAULT_AVATAR = '/defaultAvatar.svg';

export default function ProfilePicture({username, size, refreshKey}: ProfilePictureParams): React.ReactElement {

    const [failed, setFailed] = useState<boolean>(false);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setFailed(false), [username, refreshKey]);

    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/users/${username}/profilePicture`;
    const src = failed ? DEFAULT_AVATAR : `${baseUrl}${refreshKey ? `?v=${refreshKey}` : ''}`;

    return (
        <img
            src={src}
            alt={`${username}'s profile picture`}
            className={"profilePicture"}
            style={size ? {width: `${size}px`, height: `${size}px`} : undefined}
            onError={() => setFailed(true)}
        />
    )
}