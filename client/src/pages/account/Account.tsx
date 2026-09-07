import React, {useState, lazy, Suspense} from 'react';
import PageHeader from "../../components/PageHeader.tsx";
import GenericMarkupSection from "../../components/genericMarkupSection/GenericMarkupSection.tsx";
import FancyButton from "../../components/fancyButton/FancyButton.tsx";
import {useAuth} from "../../context/auth/AuthContext.tsx";
import ProfilePicture from "../../components/profilePicture/ProfilePicture.tsx";

const LoginPopup = lazy(() => import("../../components/popups/loginPopup/LoginPopup.tsx"));
const ChangePasswordForm = lazy(() => import('./ChangePasswordForm.tsx'));
const ChangeProfilePictureForm = lazy(() => import("./ChangeProfilePictureForm.tsx"));

export default function Account(): React.ReactElement {

    const {logout, isAuthenticated, user} = useAuth();

    const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false);
    const [showChangePasswordForm, setShowChangePasswordForm] = useState<boolean>(false);
    const [showChangeProfilePictureForm, setShowChangeProfilePictureForm] = useState<boolean>(false);

    async function handleLogOutClick() {
        await logout();
    }


    return (
        <React.Fragment>
            <PageHeader title={"Account"} subtitle={"Your Better Server account"} />

            {isAuthenticated ? (
                <React.Fragment>

                    {/*log out section*/}
                    <GenericMarkupSection title={`Welcome back ${user?.username ?? 'UNKNOWN_USERNAME'}`}>
                        <div style={{float: 'right', top: 0}}>
                            <ProfilePicture username={user!.username} size={75} />
                        </div>
                        <p>
                            You are currently logged in to your Better Server account! If you wish to log out, please use
                            the below button. Be aware that logging out will restrict the functionalities of this web app.
                        </p>
                        <FancyButton label={"Click here to log out"} onClick={handleLogOutClick} />
                    </GenericMarkupSection>

                    {/*change password section*/}
                    <GenericMarkupSection title={"Change your password"} left>
                        <p>
                            If you wish to change your password, you can do so using the below form. Please note that
                            password changes may take a moment to come into effect.
                        </p>
                        <FancyButton
                            label={"Update password"}
                            onClick={() => setShowChangePasswordForm(prev => !prev)}
                            alignment={"LEFT"}
                        />
                        <Suspense>
                            <br/>
                            {showChangePasswordForm && <ChangePasswordForm/>}
                        </Suspense>
                    </GenericMarkupSection>

                    {/*change profile picture section*/}
                    <GenericMarkupSection title={"Change your profile picture"}>
                        <p>
                            Use the below form to change your profile picture. Be aware that depending on your browser /
                            data saving mode, it may take some time to show new profile pictures.
                        </p>
                        <FancyButton
                            label={"Change profile picture"}
                            onClick={() => setShowChangeProfilePictureForm(prev => !prev)} />
                        <Suspense>
                            <div style={{marginRight: '7.5%', marginLeft: 'auto', display: 'block', width: 'max-content', marginTop: '1rem'}}>
                                {showChangeProfilePictureForm && <ChangeProfilePictureForm/>}
                            </div>
                        </Suspense>
                    </GenericMarkupSection>
                </React.Fragment>

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