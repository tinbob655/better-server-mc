import React from 'react';
import PageHeader from "../../components/PageHeader.tsx";
import GenericMarkupSection from "../../components/GenericMarkupSection.tsx";
import FancyButton from "../../components/fancyButton/FancyButton.tsx";

export default function Home():React.ReactElement {

    return (
        <React.Fragment>
            <PageHeader title={"Better Server"} subtitle={"The official Better Server website"} />

            {/*who are we section*/}
            <GenericMarkupSection title={"Who are we?"}>
                <React.Fragment>
                    <p>
                        Welcome to our Minecraft Server! We offer a survival experience in a friendly environment that
                        encourages collaboration among players. Join us to build, explore and make new friends in a
                        supportive community.
                    </p>
                    <FancyButton label={"Find out more on our wiki page!"} to={"/wiki"} />
                </React.Fragment>
            </GenericMarkupSection>

            {/*map section*/}
            <GenericMarkupSection title={"View the map"} left>
                <p>
                    This website contains a life and real-time copy of the server's world map. You can see an overview
                    of the entire server's terrain, or you can zoom-in close and marvel as the bases our players have
                    made! You can even see the location of players currently logged in in real-time!
                    <br/>
                    Please be aware that you will need a Better Server account in order to view the map for security
                    purposes.
                </p>
                <FancyButton label={"Take a look at the map here!"} to={"/map"} />
            </GenericMarkupSection>

            {/*vote section*/}
            <GenericMarkupSection title={"Get heard"}>
                <p>
                    Sometimes there are polls which will have a direct influence on how we run the server. To view and
                    take part in these polls, you will need a Better Server account. Once you have an account, you will
                    be able to interact with all polls we post. You can even choose to subscribe to poll notifications!
                </p>
                <FancyButton label={"Cast your votes here!"} to={"/polls"} />
            </GenericMarkupSection>

            {/*keep up-to-date section*/}
            <GenericMarkupSection title={"Keep up to date"} left>
                <p>
                    The admins of the Better Server make frequent posts to keep you in the know with what is happening
                    on the server. Please take the time to read them, we hope you find them interesting!
                </p>
                <FancyButton label={"Read the news here!"} to={"/news"} />
            </GenericMarkupSection>

            {/*suggestions section*/}
            <GenericMarkupSection title={"Make suggestions"}>
                <p>
                    You, the players of our server, are able to make suggestions about how we run the server and what
                    goes on. All you'll need is a Better Server account and you can send us suggestions. We take time to
                    read through and carefully consider all suggestions we receive!
                </p>
                <FancyButton label={"Make a suggestion here!"} to={"/suggestions"} />
            </GenericMarkupSection>
        </React.Fragment>
    )
}