
import React, { useMemo } from 'react';
import { getProfilePictureUrl } from '../../pages/account/accountAPI';

interface params {
    username: string,
};


export default function PostImage({ username }: params): React.ReactElement {
    // Memoize the image URL for this username
    const imgSrc = useMemo(() => getProfilePictureUrl(username), [username]);

    return (
        <img src={imgSrc} className="rounded" style={{ height: '50px', margin: 0, marginLeft: '10px' }} />
    );
}