import React from 'react';
import {useAuth} from "../../context/auth/AuthContext.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import GenericMarkupSection from "../../components/GenericMarkupSection.tsx";
import FancyButton from "../../components/fancyButton/FancyButton.tsx";
import {useNavigate} from "react-router";

export default function Admin(): React.ReactElement {

    const navigate = useNavigate();

    const {user} = useAuth();
    const isDev: boolean = user?.maxPermission === 10;

    //only show the page to devs
    if (isDev) return (
        <React.Fragment>
            <PageHeader title={"Admin"} subtitle={"Edit core data on the webapp"} />
        </React.Fragment>
    )

    else return (
        <React.Fragment>
            <PageHeader title={"Restricted"} subtitle={"You're on restricted turf and we recommend turning around"} />

            <GenericMarkupSection title={"Access denied"}>
                <p>
                    You are not allowed access to this page. If you think you should be allowed access then please get
                    in touch with <b>Tinbob655</b>. Otherwise please return to safety.
                </p>
                <FancyButton label={"Return to safety"} onClick={() => navigate(-1)} />
            </GenericMarkupSection>
        </React.Fragment>
    )
}