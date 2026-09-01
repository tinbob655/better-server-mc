import React from 'react';
import './footer.scss';

export default function Footer():React.ReactElement {

    return (
        <footer>
            <img src={"/logo.png"} alt={"The Better Server logo"} />
            <p>
                Website created by <a href={"https://tinbob655.github.io/tinbob655/"} target={"_blank"}>Tinbob655</a>
                {' '}for the Better Server community.
                <br/>
                Want your own website? Find my socials <a href={"https://tinbob655.github.io/tinbob655/"} target={"_blank"}>here.</a>
            </p>
        </footer>
    )
}