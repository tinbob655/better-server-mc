import React, {useState, lazy, Suspense} from 'react';
import PageHeader from "../../components/PageHeader.tsx";
import GenericMarkupSection from "../../components/GenericMarkupSection.tsx";
import FancyButton from "../../components/fancyButton/FancyButton.tsx";
import {useAuth} from "../../context/auth/AuthContext.tsx";

const LoginPopup = lazy(() => import("../../components/popups/loginPopup/LoginPopup.tsx"));

export default function Account(): React.ReactElement {

    const {logout} = useAuth();

    const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false);

    async function handleLogOutClick() {
        await logout();
    }

    const isAuthenticated = false;


    return (
        <React.Fragment>
            <PageHeader title={"Account"} subtitle={"Your Better Server account"} />

            {isAuthenticated ? (

                //log out
                <GenericMarkupSection title={"Sign out"}>
                    <p>
                        You are currently logged in to your Better Server account! If you wish to log out, please use
                        the below button. Be aware that logging out will restrict the functionalities of this web app.
                    </p>
                    <FancyButton label={"Click here to log out"} onClick={handleLogOutClick} />
                </GenericMarkupSection>
            ) : (

                //sign up / log in
                <GenericMarkupSection title={"Sign up & log in"}>
                    <p>
                        To access the full features of this site, you'll need a Better Server account. This is done to reduce
                        spamming and help our moderators filter the content posted to the website. It also improves security.
                        <br/>
                        NOTE: I will not store your password however I would recommend using a different password to the one
                        you usually use as I can never be 100% sure the systems of this website and its backend are 100%
                        secure.
                    </p>
                    <FancyButton label={"Click here to log in / sign up"} onClick={() => setShowLoginPopup(true)} />
                </GenericMarkupSection>
            )}

            {/*login popup when needed*/}
            <Suspense>
                {showLoginPopup && <LoginPopup closeFunction={() => setShowLoginPopup(false)} />}
            </Suspense>
        </React.Fragment>
    )
}