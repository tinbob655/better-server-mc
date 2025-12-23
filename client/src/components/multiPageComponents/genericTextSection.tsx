import React from 'react';
import { Link } from 'react-router';


interface params {
    header: string,
    paragraph: string,
    linkDestination?: string,
    linkText?: string,
    left: Boolean,
    noDividerLine?: Boolean,
};

export default function GenericTextSection({header, paragraph, linkDestination, linkText, left, noDividerLine}:params):React.ReactElement {

    const alignment:string = left ? "alignLeft" : "alignRight";

    function getLink():React.ReactElement {
        let tempLink = <></>;

        //we have a link that needs to be got
        if (linkDestination && linkText) {
            tempLink = (
                <React.Fragment>
                    <Link to={linkDestination}>
                        <h3 className={alignment}>
                            {linkText}
                        </h3>
                    </Link>
                </React.Fragment>
            )
        };
        return tempLink;
    };

    return (
        <React.Fragment>
            <h2 className={alignment}>
                {header}
            </h2>
            <p className={alignment}>
                {paragraph}
            </p>

            {getLink()}

            {noDividerLine ? null : <div className="dividerLine"></div>}
        </React.Fragment>
    );
};