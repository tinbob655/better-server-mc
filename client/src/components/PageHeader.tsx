import React from 'react';

interface PageHeaderParams {
    title: string;
    subtitle: string;
}

export default function PageHeader({title, subtitle}: PageHeaderParams): React.ReactElement {

    return (
        <React.Fragment>
            <h1 style={{marginLeft: '5%'}}>
                {title}
            </h1>
            <p className={"alignLeft"}>
                {subtitle}
            </p>
            <div className={"sectionDivider"} />
        </React.Fragment>
    )
}