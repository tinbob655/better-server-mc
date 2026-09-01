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

    const {login} = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        password: '',
    });

    async function handleLogin() {
        setIsLoading(true);
        const res = await login(formData.username, formData.password);
        setIsLoading(false);

        //successful login
        if (res) {
            closeFunction();
        }

        //failed login
        else {
            setError("Failed to log in. Please check your username and password and try again");
        }
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
            </form>

            <FancyButton label={"Submit"} onClick={handleLogin} disabled={isLoading} />
            {error && <p className={"errorText"}>{error}</p>}
        </PopupWrapper>
    )
}