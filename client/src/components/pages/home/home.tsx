import React from 'react';
import PageHeader from '../../multiPageComponents/pageHeader';
import GenericTextSection from '../../multiPageComponents/genericTextSection';


export default function Home():React.ReactElement {
    
    return (
        <React.Fragment>
            <PageHeader title="Better Server" subtitle="The official better server website"/>

            {/*who are we section*/}
            <GenericTextSection header="Who are we?" paragraph="Welcome to our Minecraft server! We offer a survival experience in a friendly environment that encourages collaboration among players. Join us to build, explore, and make new friends in a supportive community." left={false} linkText="Find out more on our wiki page!" linkDestination="/wiki" />

            {/*feed section*/}
            <GenericTextSection header="Keep up to date" paragraph="The Better Server has a live feed where players can post what they have been up to and have a chat! All it takes is logging in to your account and getting verified before you're ready to get posting." linkText="Get posting here!" linkDestination="/feed" left={true}/>

            {/*playerbase section*/}
            <GenericTextSection header="Our playerbase" paragraph="Players are free to write about themselves and their achievements on our playerbase page. Write your server autobiography, or view other people's biographies; you must of course be logged in and verified first." linkText="View our playerbase here!" linkDestination="/playerbase" left={false} noDividerLine={true} />
        </React.Fragment>
    );
};