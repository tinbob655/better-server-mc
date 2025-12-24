import React from 'react';
import GenericTextSection from '../../multiPageComponents/genericTextSection';


export default function Wiki():React.ReactElement {

    return (
        <React.Fragment>
            <GenericTextSection header="Coming soon..." paragraph="We're working hard on writing a full and comprehensive wiki for our server. Please understand that this takes time: we want to get it just right! Once it's done, you'll find it right here waiting for you!" linkText="Until then, browse the rest of our wonderful site" linkDestination="/" left={false} />
        </React.Fragment>
    );
};