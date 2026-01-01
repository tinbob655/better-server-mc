import React, {useEffect, useState} from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import {logOut, handleLogin, handleSignUp, queryLoggedIn, querySudo} from './accountAPI';
import type { accountObj } from './accountObj';
import LoginPopup from './loginPopup';
import FancyButton from '../../multiPageComponents/fancyButton';
import PostImage from '../../multiPageComponents/post/postImage';
import GenericTextSection from '../../multiPageComponents/genericTextSection';

export default function Account():React.ReactElement {

    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [loginPopup, setLoginPopup] = useState<React.ReactElement>(<></>);
    const [sudo, setSudo] = useState<boolean>(false);


    //find out if the user is logged in
    useEffect(() => {
        queryLoggedIn().then((res:accountObj) => {

            //user is logged in
            setLoggedIn(res.loggedIn);
            setUsername(res.username);
        }).catch(() => {

            //user is not logged in
            setLoggedIn(false);
            setUsername('');
            setSudo(false);
        });
    }, []);

    //always find out if a user is sudo
    useEffect(() => {
        querySudo().then((res) => {
            setSudo(res);
        });
    }, [username]);

    async function loginPopupSubmitted(event: React.FormEvent, type: string, setErrorMsg: (msg: string) => void) {
        event.preventDefault();
        setErrorMsg('');

        const target = event.target as typeof event.target & {
            username: {value: string},
            password: {value: string},
            confirmPassword?: {value: string},
            profilePicture?: {files: FileList},
        };

        try {
            if (type === 'signUp') {

                //make sure passwords match
                if (target.password.value !== target.confirmPassword?.value) {
                    setErrorMsg('Passwords do not match');
                    return;
                };

                //make sure profile picture is provided
                if (!target.profilePicture?.files?.[0]) {
                    setErrorMsg('Profile picture is required');
                    return;
                };

                //sign up with profile picture
                const res = await handleSignUp(target.username.value, target.password.value, target.profilePicture.files[0]);
                setLoggedIn(res.loggedIn);
                setUsername(res.username);
            } 
            else {

                //login
                const res = await handleLogin(target.username.value, target.password.value);
                setLoggedIn(res.loggedIn);
                setUsername(res.username);
            };

            //close the popup on success
            document.getElementById('loginPopupWrapper')?.classList.remove('shown');
            setTimeout(() => {
                setLoginPopup(<></>);
            }, 1000);
        } 
        catch (err: unknown) {

            // Extract error message from axios or generic error
            let msg = 'An error occurred.';
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosErr = err as { response?: { data?: { message?: string } } };
                if (axiosErr.response?.data?.message) {
                    msg = axiosErr.response.data.message;
                };
            } 
            else if (err instanceof Error) {
                msg = err.message;
            };
            setErrorMsg(msg);
        };
    };

    async function handleLogOut() {
        const res = await logOut();
        setLoggedIn(res.loggedIn);
        setUsername(res.username);
    };

    return (
        <React.Fragment>
            <PageHeader title={username ? username : "Account"} subtitle="Sign up or log in" />

            {loggedIn ? (
                <React.Fragment>

                    {/*the user is logged in*/}
                    <div className="card card-right">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0, justifyContent: 'flex-end'}}>
                            <h2 className="alignRight" style={{marginRight: 0}}>
                                Welcome back,  {username}!
                            </h2>
                            <PostImage username={username} />
                        </div>
                        <p className="alignRight fancy">
                            Welcome back to the better server! You are currently logged in as {username}. To log out, click below.
                        </p>
                        <FancyButton text="Click here to log out" action={handleLogOut} transformOrigin='left'/>
                    </div>


                    {/*if the user is sudo, show them a button to the admin page*/}
                    {sudo ? (
                        <GenericTextSection header="HELLO ADMIN" paragraph="YOU ARE AN ADMIN. CLICK BELOW TO GET TO THE SUPER SECRET ADMIN PAGE" linkDestination='/admin' linkText="CLICK HERE TO ACCESS THE ADMIN PAGE" left={true} />
                    ) : <></>}
                </React.Fragment>
            ) : (
                <React.Fragment>

                    {/*the user is not logged in*/}
                    <div className="card card-right">
                        <h2 className="alignRight">
                            Sign up & log in
                        </h2>
                        <p className="alignRight fancy">
                            To access the full features of this site, you'll need to make an account. This is done to reduce spamming and help our moderators to filter the content posted to our website. NOTE: I will not store your password however I would recommend using a different password to the one you usually use as I'm can't be 100% sure the process of this website are secure.
                        </p>
                        <FancyButton text="Click here to log in / sign up" action={() => {
                            setLoginPopup(<LoginPopup closeFunc={(event: React.FormEvent, type: string, setErrorMsg: (msg: string) => void) => {loginPopupSubmitted(event, type, setErrorMsg)}} />)
                            setTimeout(() => {
                                document.getElementById('loginPopupWrapper')?.classList.add('shown');
                            }, 10);
                        }} transformOrigin="left" />
                    </div>
                </React.Fragment>
            )}
            {loginPopup}
        </React.Fragment>
    );
};