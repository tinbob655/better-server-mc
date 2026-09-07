import React, {lazy, Suspense, useRef} from 'react';
import type {DeleteNewsRequest, News} from "../../types/news";
import formatDate from "../../functions/formatDate.ts";
import {useAuth} from "../../context/auth/AuthContext.tsx";
import ProfilePicture from "../../components/profilePicture/ProfilePicture.tsx";

const IconButton = lazy(() => import("../../components/iconButton/IconButton.tsx"));

interface SingleNewsParams {
    news: News;
    deleteNews: (request: DeleteNewsRequest) => Promise<void>;
}

export default function SingleNews({news, deleteNews}: SingleNewsParams): React.ReactElement {

    const {user} = useAuth();
    const isDev: boolean = user?.maxPermission === 10;

    const wrapperRef = useRef(null);

    return (
        <div className={"widget"} ref={wrapperRef}>

            {/*dev sees delete button*/}
            {isDev && <Suspense>
                <IconButton
                    showElementRef={wrapperRef}
                    imageLoader={() => import("../../assets/images/buttons/delete.svg")}
                    onClick={() => deleteNews({title: news.title})}
                    />
            </Suspense>}

            <div style={{display: 'flex', width: 'fit-content', marginRight: '7.5%', marginLeft: 'auto'}}>
                <h2 className={"alignRight"} style={{marginBottom: '0.3rem', paddingBottom: 0, marginTop: 0, paddingTop: 0}}>
                    {news.title}
                </h2>
                <ProfilePicture username={news.createdBy} size={45} />
            </div>
            <p className={"alignRight smaller"}>
                Posted by {news.createdBy} on {formatDate(news.createdAt)}
            </p>
            <p className={"alignRight"}>
                {news.body}
            </p>
        </div>
    )
}