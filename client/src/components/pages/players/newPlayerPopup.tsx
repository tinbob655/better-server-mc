import React from 'react';


interface params {
    closeFunc: Function,
};

export default function NewPlayerPopup({closeFunc}:params):React.ReactElement {

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

                <p className="aboveInput" style={{marginTop: '10px', fontSize: '0.9em', opacity: 0.8}}>
                    Your profile picture from your account will be used.
                </p>

                {/*submit button*/}
                <input type="submit" value="Submit" style={{marginTop: '20px'}} />
            </form>
        </div>
    );
};