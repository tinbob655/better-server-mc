import type { playerObj } from "./playerObj";
import type { playerRecord } from "./playerRecord";
import axios from "axios";
import { queryLoggedIn } from "../account/accountAPI";

export async function makeNewPlayer(event: React.FormEvent, playerList: playerObj[]): Promise<playerRecord | null> {
    const data = event.target as typeof event.target & {
        description: { value: string },
    };

    //find out the user's username
    const username = (await queryLoggedIn()).username;

    // Find out if we are creating a new player or editing an existing one
    const newPlayer: boolean = !playerList.some((value) => value.name === username);

    const inputData = {
        name: username,
        description: data.description.value,
        date: new Date(),
    };

    try {
        if (newPlayer) {

            // Creating a new player
            const res: playerRecord = (await axios.post('/api/playerDb', inputData)).data;
            return res;
        } 
        else {

            // Updating an existing player's record
            const res: playerRecord = (await axios.put(`/api/playerDb/${encodeURIComponent(username)}`, inputData)).data;
            return res;
        };
    } 
    catch (error) {
        console.error(error);
        return null;
    };
};

export async function deleteEntry(playerName: string): Promise<playerRecord[]> {
    try {
        //send DELETE request to the API with the player name in the URL
        const res = await axios.delete(`/api/playerDb/${encodeURIComponent(playerName)}`);
        return res.data as playerRecord[];
    } 
    catch (error) {
        console.error(error);
        return [];
    };
};