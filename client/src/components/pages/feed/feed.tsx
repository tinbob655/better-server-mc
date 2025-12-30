import React, {useEffect, useState} from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import {getPosts, newPost, editPost, deletePost} from './feedAPI';
import type { postObj } from './postObj';
import Post from './post';
import FancyButton from '../../multiPageComponents/fancyButton';
import NewPostPopup from './newPostPopup';
import { queryLoggedIn } from '../account/accountAPI';


export default function Feed():React.ReactElement {

    const [postList, setPostList] = useState<postObj[]>([]);
    const [postHTML, setPostHTML] = useState<React.ReactElement[]>([]);
    const [newPostPopup, setNewPostPopup] = useState<React.ReactElement>(<></>);

    //get all the posts
    useEffect(() => {
        getPosts().then((res) => {
            setPostList(res);
        });
    }, []);


    //keep html up to date with post list
    useEffect(() => {
        if (postList) {
            let tempPostHTML:React.ReactElement[] = [];
            let index:number = 0;
            postList.forEach((post) => {
                let left:boolean = !(index % 2 === 0);
                tempPostHTML.push(
                    <Post username={post.posterUsername} postContent={post.textContent} left={left} deleteFunction={() => {
                        deletePost(post.id).then((res) => {
                            setPostList([...res]);
                        });
                    }} />
                );
                index++;
            });
            setPostHTML(tempPostHTML);
        };
    }, [postList]);


    async function newPostPopupSubmitted(event:React.FormEvent):Promise<void> {
        event.preventDefault();

        //make sure we have the required fields
        const target = event.target as typeof event.target & {
            textContent: {value: string},
        };
        if (!target.textContent || !target.textContent.value) {
            throw new Error("Didn't get any text for the new post");
        };

        //we need to know the logged in user's username to make the post
        const loggedIn = await queryLoggedIn();
        if (!loggedIn.loggedIn) {
            throw new Error('Can only post when logged in');
        };

        //make a post
        const res = await newPost(loggedIn.username, target.textContent.value);
        setPostList([...postList, res]);

        //close the popup
        document.getElementById('newPostPopupWrapper')?.classList.remove('shown');
        setTimeout(() => {
            setNewPostPopup(<></>);
        }, 1000);
    };

    return (
        <React.Fragment>
            <PageHeader title="Feed" subtitle="Keep in touch" />

            {/*actual posts*/}
            {postHTML}

            {/*make a post section*/}
            <div className="card card-right">
                <h2 className="alignRight">
                    Make a post
                </h2>
                <p className="alignRight">
                    Making a post is easy: just log into your Better Server account and click the button below to get posting! Please remember that we do not tolerate offensive or inappropriate content on this website and posting such content may result in a ban.
                </p>
                <FancyButton text="Click here to make a post" transformOrigin="left" action={() => {
                    setNewPostPopup(<NewPostPopup closeFunc={(event:React.FormEvent) => {newPostPopupSubmitted(event)}} />);
                    setTimeout(() => {
                        document.getElementById('newPostPopupWrapper')?.classList.add('shown');
                    }, 10);
                }}/>
            </div>

            {newPostPopup}
        </React.Fragment>
    );
};