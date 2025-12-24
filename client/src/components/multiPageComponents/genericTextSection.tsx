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

    // Add a class to control rotation direction
    const cardClass = `card ${left ? 'card-left' : 'card-right'}`;
    return (
        <div className={cardClass} style={{marginLeft: left ? '2vw' : "auto", marginRight: left ? "auto" : '2vw'}}>
            <h2 className={alignment}>
                {header}
            </h2>
            <p className={`fancy ${alignment}`}>
                {paragraph}
            </p>
            {getLink()}
        </div>
    );
};