import React from 'react';


interface params {
    closeFunc: (event: React.FormEvent) => void;
};

export default function NewPostPopup({closeFunc}:params):React.ReactElement {

    return (
        <React.Fragment>
            <div className="popupWrapper" id="newPostPopupWrapper">
                <h2>
                    Make a post
                </h2>

                <div className="dividerLine"></div>

                <form id="newPostForm" onSubmit={(event:React.FormEvent) => {closeFunc(event)}}>
                    <p className="aboveInput">
                        Write your post:
                    </p>
                    <textarea name="textContent" placeholder="Post..." required rows={9} style={{marginTop: '10px', marginBottom: '20px'}} />

                    <input type="submit" value="Submit" />
                </form>
            </div>
        </React.Fragment>
    );
};