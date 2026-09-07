import React, {useState} from 'react';
import {useAuth} from "../../context/auth/AuthContext.tsx";
import {parseAxiosError} from "../../functions/parseAxiosError.ts";
import ProfilePicture from "../../components/profilePicture/ProfilePicture.tsx";
import FileInput from "../../components/form/fileInput/FileInput.tsx";
import FancyButton from "../../components/fancyButton/FancyButton.tsx";

export default function ChangeProfilePictureForm(): React.ReactElement {

    const {updateProfilePicture, user} = useAuth();

    const [pictureFile, setPictureFile] = useState<File | null>(null);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    function handleUpload(): void {
        if (!pictureFile) return;

        updateProfilePicture(pictureFile)
            .then(() => {
                setPictureFile(null);
                setRefreshKey(prev => prev + 1) //forces a refresh
            })
            .catch(err => setError(parseAxiosError(err)));
    }

    return (
        <React.Fragment>
            <ProfilePicture username={user!.username} size={96} refreshKey={refreshKey} />
            <FileInput
                label={"Choose a new profile picture"}
                allowedTypes={["image/png", "image/jpeg", "image/webp"]}
                value={pictureFile}
                setValue={setPictureFile}
                enforceCircle
            />
            <FancyButton label={"Upload"} onClick={handleUpload} disabled={!pictureFile} />
            {error && <p className={"errorText"}>{error}</p>}
        </React.Fragment>
    )
}