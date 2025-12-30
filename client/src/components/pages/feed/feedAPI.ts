import type { postObj } from "./postObj";
import axios from "axios";

//get all posts
export async function getPosts():Promise<postObj[]> {
    const res = (await axios.get('/api/feedDb')).data;
    return res;
};

//make a new post to the feed
export async function newPost(posterUsername: string, textContent: string): Promise<postObj> {
    const res = (await axios.post('/api/feedDb', { posterUsername, textContent })).data;
    return res;
};

//edit an existing post
export async function editPost(posterUsername: string, textContent: string, id: string): Promise<postObj[]> {
    const res = (await axios.put(`/api/feedDb/${encodeURIComponent(id)}`, { posterUsername, textContent })).data;
    return res;
};

//remove a post
export async function deletePost(id: string): Promise<postObj[]> {
    const res = (await axios.delete(`/api/feedDb/${encodeURIComponent(id)}`)).data;
    return res;
};