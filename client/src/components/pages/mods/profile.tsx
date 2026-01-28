import React from 'react';


export interface profile {
    name: string,
    pros: string[],
    cons: string[],
};

export default function Profile({name, pros, cons}:profile):React.ReactElement {

    return (
        <React.Fragment>
            <h2>
                {name} {pros} {cons}
            </h2>
        </React.Fragment>
    );
};