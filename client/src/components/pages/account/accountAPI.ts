import type { accountObj } from "./accountObj";
import axios from "axios";


//query if a user is logged in
export async function queryLoggedIn():Promise<accountObj> {
    const res = (await axios.get('/api/accountDb/queryLoggedIn', {withCredentials: true})).data;
    return {
        loggedIn: res.loggedIn,
        username: res.loggedIn ? res.username : '',
    };
};

//log a user in
async function logIn(username:string, password:string):Promise<accountObj> {
    const res = (await axios.post('/api/accountDb/login', {username, password}, {withCredentials: true})).data;
    return res;
};

//create a new account with profile picture
async function createAccount(username:string, password:string, profilePicture:File):Promise<accountObj> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('profilePicture', profilePicture);
    
    const res = (await axios.post('/api/accountDb/createAccount', formData, {withCredentials: true})).data;
    return res;
};

//log a user out
export async function logOut():Promise<accountObj> {
    const res = (await axios.post('/api/accountDb/logout')).data;
    return res;
};

//deal with a user logging in (for existing accounts)
export async function handleLogin(username: string, password: string):Promise<accountObj> {
    const res = await logIn(username, password);
    return res;
};

//deal with a user signing up (for new accounts)
export async function handleSignUp(username: string, password: string, profilePicture: File):Promise<accountObj> {
    const res = await createAccount(username, password, profilePicture);
    return res;
};

//get profile picture URL for a username
export function getProfilePictureUrl(username: string): string {
    return `/api/accountDb/profilePicture/${encodeURIComponent(username)}`;
};