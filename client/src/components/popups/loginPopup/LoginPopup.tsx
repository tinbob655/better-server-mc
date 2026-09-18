import React, {useState, lazy, Suspense} from 'react';
import PopupWrapper from "../PopupWrapper.tsx";
import {useAuth} from "../../../context/auth/AuthContext.tsx";
import FormGroup from "../../form/FormGroup.tsx";
import FancyButton from "../../fancyButton/FancyButton.tsx";
import PasswordInput from "../../form/passwordInput/PasswordInput.tsx";
import useDiscordVerification from "../../../hooks/useDiscordVerification.ts";
import type {RegistrationResponse} from "../../../types/auth";

const FileInput = lazy(() => import("../../form/fileInput/FileInput.tsx"));

interface LoginPopupParams {
    closeFunction: () => void;
}

export default function LoginPopup({closeFunction}: LoginPopupParams): React.ReactElement {

    const {register, login} = useAuth();
    const {
        ticket: discordTicket,
        verifying: verifyingDiscord,
        error: discordError,
        startVerification,
    } = useDiscordVerification();

    const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmedPassword, setConfirmedPassword] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    function toggleMode(): void {
        setMode(prev => prev === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
        setError(null);
    }

    async function handleSubmit() {
        setIsLoading(true);
        setError(null);

        //log the user in
        if (mode === 'LOGIN') {
            const res = await login({username, password});

            //successful login
            if (res) closeFunction();

            //failed login
            else {
                setError("Failed to log in. Please check your username and password and try again");
            }
        }

        //register the user with a new account
        else {
            if (!profilePicture) {
                setError("Profile picture is required");
            }
            else if (!discordTicket) {
                setError("Please verify your Discord membership first.");
            }
            else {
                const res: RegistrationResponse = await register({username, password, profilePicture, discordTicket});
                if (res.success) closeFunction();
                else setError(res.error ?? "Failed to create account. Please try again later.");
            }
        }

        setIsLoading(false);
    }

    return (
        <PopupWrapper closeFunction={closeFunction}>

            {/*signup requires discord verification before anything else*/}
            {mode === 'SIGNUP' && !discordTicket && (
                <React.Fragment>
                    <p>
                        New accounts need to be a member of our Discord before signing up.
                    </p>
                    <FancyButton
                        label={verifyingDiscord ? "Waiting for Discord" : "Verify with Discord"}
                        onClick={startVerification}
                        disabled={verifyingDiscord}
                        className={"discord"}
                    />
                    {discordError && <p className={"errorText"}>{discordError}</p>}
                    <div className={"sectionDivider"} style={{marginTop: '2rem'}} />
                </React.Fragment>
            )}

            {(mode === 'LOGIN' || discordTicket) && (
                <React.Fragment>
                    <form className={"horizontal"}>

                        {/*username*/}
                        <FormGroup
                            label={"Username"}
                            type={"text"}
                            name={"username"}
                            value={username}
                            setValue={setUsername}
                        />

                        {/*password*/}
                        <PasswordInput value={password} setValue={setPassword} />

                        {/*confirm password & profile picture only when signing up*/}
                        {mode === 'SIGNUP' && (
                            <Suspense>
                                <PasswordInput value={confirmedPassword} setValue={setConfirmedPassword} confirm />
                                <FileInput
                                    label={"Profile picture"}
                                    allowedTypes={["image/png", "image/jpeg", "image/webp"]}
                                    value={profilePicture}
                                    setValue={setProfilePicture}
                                    enforceCircle
                                />
                                <br/>
                            </Suspense>
                        )}
                    </form>

                    <FancyButton
                        label={mode === 'LOGIN' ? "Submit" : "Create account"}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    />
                    {error && <p className={"errorText"}>{error}</p>}
                </React.Fragment>
            )}

            <div className={"sectionDivider"} style={{marginTop: '2rem'}} />
            <p>
                {mode === 'LOGIN' ? "Don't have an account?" : "Already have an account?"}
                <br/>
                <button type={"button"} onClick={toggleMode} className={"textButton"}>
                    {mode === "LOGIN" ? "Sign up now!" : "Log in!"}
                </button>
            </p>
        </PopupWrapper>
    )
}