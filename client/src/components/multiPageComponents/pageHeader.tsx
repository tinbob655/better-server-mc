import React from 'react';


interface params {
    title: string,
    subtitle: string,
};

export default function PageHeader({title, subtitle}:params):React.ReactElement {

    return (
        <React.Fragment>
            <h1 className="alignLeft" style={{marginLeft: '5%', marginBottom: '25px'}}>
                {title}
            </h1>
            <p className="alignLeft" style={{marginLeft: '10%', marginTop: 0, fontWeight: '400'}}>
                {subtitle}
            </p>

            <div className="dividerLine"></div>
        </React.Fragment>
    );
};