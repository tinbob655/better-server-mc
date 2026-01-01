import React, {useEffect, useState} from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import {getPosts, newPost, deletePost} from './feedAPI';
import type { postObj } from './postObj';
import Post from '../../multiPageComponents/post/post';
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
            setPostList(res.sort((a, b) => {

                //sort the list from newest post to oldest post
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }));
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
                            setPostList([...res].sort((a, b) => {
                                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                            }));
                        });
                    }} />
                );
                index++;
            });
            setPostHTML(tempPostHTML);
        };
    }, [postList]);


    async function newPostPopupSubmitted(event: React.FormEvent, setErrorMsg: (msg: string) => void): Promise<void> {
        event.preventDefault();
        setErrorMsg('');

        //make sure we have the required fields
        const target = event.target as typeof event.target & {
            textContent: {value: string},
        };
        if (!target.textContent || !target.textContent.value) {
            setErrorMsg("Didn't get any text for the new post");
            return;
        }

        try {
            //we need to know the logged in user's username to make the post
            const loggedIn = await queryLoggedIn();
            if (!loggedIn.loggedIn) {
                setErrorMsg('Can only post when logged in');
                return;
            }

            //make a post
            const res = await newPost(loggedIn.username, target.textContent.value);
            const orderedRes:postObj[] = [...postList, res].sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            setPostList([...orderedRes]);

            //close the popup
            document.getElementById('newPostPopupWrapper')?.classList.remove('shown');
            setTimeout(() => {
                setNewPostPopup(<></>);
            }, 1000);
        } 

        //deal with errors
        catch (err: unknown) {
            let msg = 'An error occurred.';
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosErr = err as { response?: { data?: { message?: string } } };
                if (axiosErr.response?.data?.message) {
                    msg = axiosErr.response.data.message;
                }
            } 
            else if (err instanceof Error) {
                msg = err.message;
            };
            setErrorMsg(msg);
        };
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
                <p className="alignRight fancy">
                    Making a post is easy: just log into your Better Server account and click the button below to get posting! Please remember that we do not tolerate offensive or inappropriate content on this website and posting such content may result in a ban.
                </p>
                <FancyButton text="Click here to make a post" transformOrigin="left" action={() => {
                    setNewPostPopup(<NewPostPopup closeFunc={(event: React.FormEvent, setErrorMsg: (msg: string) => void) => {newPostPopupSubmitted(event, setErrorMsg)}} />);
                    setTimeout(() => {
                        document.getElementById('newPostPopupWrapper')?.classList.add('shown');
                    }, 10);
                }}/>
            </div>

            {newPostPopup}
        </React.Fragment>
    );
};