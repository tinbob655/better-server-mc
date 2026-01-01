import React, {useState, useEffect} from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import { deleteEntry as delPlayer } from '../players/playerAPI';
import {deletePost as delFeed, getPosts} from '../feed/feedAPI';
import { querySudo } from '../account/accountAPI';


export default function Admin():React.ReactElement {

    const [playerErrorMessage, setPlayerErrorMessage] = useState<string>('');
    const [feedErrorMessage, setFeedErrorMessage] = useState<string>('');
    const [sudo, setSudo] = useState<boolean>(false);

    
    //find out if the user is logged in as sudo
    useEffect(() => {
        querySudo().then((res) => {
            setSudo(res);
        });
    }, []);

    async function deletePlayerFormSubmitted(event:React.FormEvent) {
        event.preventDefault();

        //get the username from the form
        const target = event.target as typeof event.target & {
            username?: {value: string},
        };
        if (!target.username?.value) {
            return setPlayerErrorMessage('No username received');
        };

        //delete the player post
        await delPlayer(target.username.value);
    };

    async function deleteFeedFormSubmitted(event:React.FormEvent) {
        event.preventDefault();

        //get data from the form
        const target = event.target as typeof event.target & {
            username: {value: string},
            content: {value: string},
        };
        if (!target.username || !target.content) {
            return setFeedErrorMessage('Did not receive either a username or content');
        };
        console.log(target.username.value, target.content.value);

        // Find the post index and delete if found
        const allFeedPosts = await getPosts();

        function normalize(str: string) {
          return str.replace(/\s+/g, ' ').trim().toLowerCase();
        }

        const inputUsername = normalize(target.username.value);
        const inputContent = normalize(target.content.value);

        const post = allFeedPosts.find(
          value =>
            normalize(value.posterUsername) === inputUsername &&
            normalize(value.textContent) === inputContent
        );
        if (!post) {
          return setFeedErrorMessage('No post found with that username and content');
        };
        await delFeed(post.id);
    };

    return (
        <React.Fragment>

            {/*only show the page if the user is sudo*/}
            {sudo ? (
                <React.Fragment>
                    <PageHeader title="Admin" subtitle="Moderation, masterfully" />

                    
                    {/*delete something from the players page*/}
                    <div>
                        <h2>
                            Delete something from the Players page:
                        </h2>
                        <form id="deletePlayerForm" onSubmit={(event:React.FormEvent) => {deletePlayerFormSubmitted(event)}}>
                            <p className="aboveInput">
                                Enter player's username:
                            </p>
                            <input name="username" type="text" placeholder="Username..." required />

                            <p className="errorText">
                                {playerErrorMessage}
                            </p>

                            <input type="submit" value="Submit" />
                        </form>
                    </div>

                    <div className="dividerLine" style={{marginTop: '50px', marginBottom: '50px'}}></div>


                    {/*delete something from the feed page*/}
                    <div>
                        <h2>
                            Delete something from the Feed page:
                        </h2>
                        <form id="deleteFeedForm" onSubmit={(event:React.FormEvent) => {(deleteFeedFormSubmitted(event))}}>
                            <p className="aboveInput">
                                Enter poster's username:
                            </p>
                            <input type="text" name="username" placeholder="Username..." required />

                            <p className="aboveInput">
                                Enter post content (copy & paste):
                            </p>
                            <textarea name="content" placeholder="Post content..." required />

                            <p className="errorText">
                                {feedErrorMessage}
                            </p>

                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <h2>
                        You do not have permission to access this page
                    </h2>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};