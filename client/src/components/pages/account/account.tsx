import React, {useEffect, useState} from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import axios from 'axios';
import {logOut, handleLogin} from './accountAPI';
import type { accountObj } from './accountObj';
import LoginPopup from './loginPopup';
import FancyButton from '../../multiPageComponents/fancyButton';


export default function Account():React.ReactElement {

    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [loginPopup, setLoginPopup] = useState<React.ReactElement>(<></>);


    //find out if the user is logged in
    useEffect(() => {
        axios.get('/api/accountDb/queryLoggedIn', {withCredentials: true}).then((res:{data: accountObj}) => {

            //user is logged in
            setLoggedIn(res.data.loggedIn);
            setUsername(res.data.username);
        }).catch(() => {

            //user is not logged in
            setLoggedIn(false);
            setUsername('');
        });
    }, []);

    async function loginPopupSubmitted(event:React.FormEvent, type:string,) {
        event.preventDefault();

        //close the popup
        document.getElementById('loginPopupWrapper')?.classList.remove('shown');
        setTimeout(() => {
            setLoginPopup(<></>);
        }, 1000);

        const target = event.target as typeof event.target & {
            username: {value: string},
            password: {value: string},
            confirmPassword?: {value: string},
        };
        
        //if we are signing up then we need to make sure passwords match
        if (type === 'signUp' && (target.password.value != target.confirmPassword?.value)) {

            //passwords do not match
            throw new Error('Passwords do not match');
        };

        //login
        const res = await handleLogin(target.username.value, target.password.value);
        setLoggedIn(res.loggedIn);
        setUsername(res.username);
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
                        <h2 className="alignRight">
                            Welcome back {username}
                        </h2>
                        <p className="alignRight fancy">
                            Welcome back to the better server! You are currently logged in as {username}. To log out, click below.
                        </p>
                        <FancyButton text="Click here to log out" action={handleLogOut} />
                    </div>
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
                            setLoginPopup(<LoginPopup closeFunc={(event:React.FormEvent, type:string) => {loginPopupSubmitted(event, type)}} />)
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