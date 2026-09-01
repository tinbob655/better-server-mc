import React, {useState} from 'react';
import PopupWrapper from "../PopupWrapper.tsx";
import {useAuth} from "../../../context/auth/AuthContext.tsx";
import FormGroup from "../../form/FormGroup.tsx";
import FancyButton from "../../fancyButton/FancyButton.tsx";

interface LoginPopupParams {
    closeFunction: () => void;
}

interface LoginFormData {
    username: string;
    password: string;
}

export default function LoginPopup({closeFunction}: LoginPopupParams): React.ReactElement {

    const {register, login} = useAuth();

    const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        password: '',
    });
    const [confirmedPassword, setConfirmedPassword] = useState<string>('');

    function toggleMode(): void {
        setMode(prev => prev === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
        setError(null);
    }

    async function handleSubmit() {
        setIsLoading(true);
        setError(null);

        //log the user in
        if (mode === 'LOGIN') {
            const res = await login(formData.username, formData.password);

            //successful login
            if (res) closeFunction();

            //failed login
            else {
                setError("Failed to log in. Please check your username and password and try again");
            }
        }

        //register the user with a new account
        else {
            const res = await register(formData.username, formData.password);
            if (res.success) closeFunction();
            else setError(res.error ?? "Failed to create account. Please try again later.");
        }

        setIsLoading(false);
    }

    return (
        <PopupWrapper closeFunction={closeFunction}>
            <form className={"horizontal"}>

                {/*username*/}
                <FormGroup
                    label={"Username"}
                    type={"text"}
                    name={"username"}
                    formState={formData}
                    setFormState={setFormData}
                />

                {/*password*/}
                <FormGroup
                    label={"Password"}
                    type={"text"}
                    name={"password"}
                    formState={formData}
                    setFormState={setFormData}
                />

                {/*confirm password only when creating a new account*/}
                {mode === 'SIGNUP' && <FormGroup
                    name={"confirmPassword"}
                    value={confirmedPassword}
                    setValue={setConfirmedPassword}
                    label={"Confirm password"}
                />
                    }
            </form>

            <FancyButton
                label={mode === 'LOGIN' ? "Submit" : "Create account"}
                onClick={handleSubmit}
                disabled={isLoading}
            />
            {error && <p className={"errorText"}>{error}</p>}

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