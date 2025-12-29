import React, {useState} from 'react';


interface params {
    closeFunc: Function,
};

export default function NewPlayerPopup({closeFunc}:params):React.ReactElement {

    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    return(
        <div className="popupWrapper" id="newPlayerPopupWrapper">
            <h2>
                Add & Update
            </h2>

            <div id="playerPopupErrorBox"></div>

            <div className="dividerLine"></div>

            <form id="newPlayerPopupForm" onSubmit={(event) => {closeFunc(event)}}>

                {/*name text input*/}
                <p className="aboveInput">
                    Enter player name (must match account username):
                </p>
                <input name="name" type="text" placeholder="Enter player name..." required />


                {/*description text input*/}
                <p className="aboveInput">
                    What do you want your section to say?
                </p>
                <textarea name="description" placeholder="Enter description..." required />


                {/*profile picture file input*/}
                <p className="aboveInput">
                    Add your profile picture:
                </p>
                <input id="profilePictureInput" name="profilePicture" type="file" onChange={e => setProfilePicture(e.target.files ? e.target.files[0] : null)} accept="image/*" required />
                <label htmlFor="profilePictureInput" className="fileInput" style={{marginBottom: '20px'}}>
                    {profilePicture ? (

                        //show a preview of the image after the user chooses one
                        <React.Fragment>
                            <img src={URL.createObjectURL(profilePicture)} alt="Preview" style={{maxHeight: '20vh', marginBottom: '5px'}} />
                            {profilePicture.name}
                        </React.Fragment>
                    ) : 'Choose file...'}
                </label>

                {/*submit button*/}
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};