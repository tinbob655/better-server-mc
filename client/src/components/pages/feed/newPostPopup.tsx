import React, {useState} from 'react';


interface params {
    closeFunc: (event: React.FormEvent, setErrorMsg: (msg: string) => void) => void;
}

export default function NewPostPopup({closeFunc}:params):React.ReactElement {

    const [errorMsg, setErrorMsg] = useState<string>('');

    return (
        <React.Fragment>
            <div className="popupWrapper" id="newPostPopupWrapper">
                <h2>
                    Make a post
                </h2>

                <div className="dividerLine"></div>

                <form id="newPostForm" onSubmit={(event:React.FormEvent) => {closeFunc(event, setErrorMsg)}}>
                    <p className="aboveInput">
                        Write your post:
                    </p>
                    <textarea name="textContent" placeholder="Post..." required rows={9} style={{marginTop: '10px', marginBottom: '20px'}} />

                    <p className="errorText">
                        {errorMsg}
                    </p>

                    <input type="submit" value="Submit" />
                </form>
            </div>
        </React.Fragment>
    );
}