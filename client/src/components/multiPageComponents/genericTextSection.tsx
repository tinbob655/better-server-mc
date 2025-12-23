import React from 'react';
import FancyButton from './fancyButton';


interface params {
    header: string,
    paragraph: string,
    linkDestination?: string,
    linkText?: string,
    left: Boolean,
};

export default function GenericTextSection({header, paragraph, linkDestination, linkText, left}:params):React.ReactElement {
    const alignment:string = left ? "alignLeft" : "alignRight";

    function getLink():React.ReactElement {
        let tempLink:React.ReactElement = <></>;
        if (linkDestination && linkText) {
            tempLink = (
                <FancyButton text={linkText} destination={linkDestination} transformOrigin="left" />
            )
        };
        return tempLink;
    };

    return (
        <div className="card" style={{marginLeft: left ? '2vw' : "auto", marginRight: left ? "auto" : '2vw'}}>
            <h2 className={alignment}>
                {header}
            </h2>
            <p className={alignment}>
                {paragraph}
            </p>
            {getLink()}
        </div>
    );
};