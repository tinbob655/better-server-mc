import type { playerObj } from "./playerObj";
import type { playerRecord } from "./playerRecord";
import axios from "axios";

export async function makeNewPlayer(event: React.FormEvent, playerList: playerObj[]): Promise<playerRecord | null> {
    const data = event.target as typeof event.target & {
        name: { value: string },
        description: { value: string },
        profilePicture: { files: FileList },
    };

    // Find out if we are creating a new player or editing an existing one
    const newPlayer: boolean = !playerList.some((value) => value.name === data.name.value);

    // Use FormData for file upload
    const formData = new FormData();
    formData.append("name", data.name.value);
    formData.append("description", data.description.value);
    formData.append("date", new Date().toISOString());
    if (data.profilePicture.files && data.profilePicture.files[0]) {
        formData.append("profilePicture", data.profilePicture.files[0]);
    };

    try {
        if (newPlayer) {
            // Creating a new player
            const res: playerRecord = (await axios.post('/api/playerDb', formData)).data;
            return res;
        } else {
            // Updating an existing player's record
            const res: playerRecord = (await axios.put(`/api/playerDb/${encodeURIComponent(data.name.value)}`, formData)).data;
            return res;
        }
    } catch (error) {
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