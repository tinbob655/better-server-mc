import type { accountObj } from "./accountObj";
import axios from "axios";

//log a user in
async function logIn(username:string, password:string):Promise<accountObj> {
    const res = (await axios.post('/api/accountDb/login', {username, password}, {withCredentials: true})).data;
    return res;
};

//create a new account
async function createAccount(username:string, password:string):Promise<accountObj> {
    const res = (await axios.post('/api/accountDb/createAccount', {username, password}, {withCredentials: true})).data;
    return res;
};

//log a user out
export async function logOut():Promise<accountObj> {
    const res = (await axios.post('/api/accountDb/logout')).data;
    return res;
};

//see if a user is logged in
async function usernameExists(username: string) {
    const res = (await axios.post('/api/accountDb/usernameExists', {username})).data;
    return res.exists;
};

//deal with a user logging in
export async function handleLogin(username: string, password: string) {

    //need to find out if we are making a new account or logging into one
    let acc;
    const newUser:boolean = !(await usernameExists(username));
    if (newUser) {

        //we need to make a new account
        acc = await createAccount(username, password);
    }
    else {
        
        //we need to log into an existing account
        acc = await logIn(username, password);
    };
    return acc;
};