import React from 'react';

interface params {
    title: string;
    subtitle: string;
};

export default function PageHeader({title, subtitle}:params):React.ReactElement {

    return (
        <React.Fragment>
            <h1 style={{marginLeft: '15%'}}>
                {title}
            </h1>
            <p style={{marginLeft: '20%'}}>
                {subtitle}
            </p>
            <div className="dividerLine"></div>
        </React.Fragment>
    );
};