import React, {useState} from 'react';


interface params {
    closeFunc: (event: React.FormEvent, setErrorMsg: (msg: string) => void) => void;
}

export default function NewPlayerPopup({closeFunc}:params):React.ReactElement {

    const [errorMsg, setErrorMsg] = useState<string>('');

    return(
        <div className="popupWrapper" id="newPlayerPopupWrapper">
            <h2>
                Add & Update
            </h2>

            <div className="dividerLine"></div>

            <form id="newPlayerPopupForm" onSubmit={(event) => {closeFunc(event, setErrorMsg)}}>

                {/*description text input*/}
                <p className="aboveInput">
                    What do you want your section to say?
                </p>
                <textarea name="description" placeholder="Enter description..." required />

                <p className="aboveInput" style={{marginTop: '10px', fontSize: '0.9em', opacity: 0.8}}>
                    Your profile picture and username from your account will be used.
                </p>

                <p className="errorText">
                    {errorMsg}
                </p>

                {/*submit button*/}
                <input type="submit" value="Submit" style={{marginTop: '20px'}} />
            </form>
        </div>
    );
}