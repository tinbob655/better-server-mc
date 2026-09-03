import React, {useState} from 'react';
import FormGroup from "../FormGroup.tsx";
import './passwordInput.scss';
import eyeOpen from '../../../assets/images/buttons/eyeOpen.svg';
import eyeClosed from '../../../assets/images/buttons/eyeClosed.svg';

interface PasswordInputParams {
    confirm?: boolean;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    label?: string;
}

export default function PasswordInput({confirm, value, setValue, label}: PasswordInputParams): React.ReactElement {

    const [passwordShown, setPasswordShown] = useState<boolean>(false);

    return (
        <div className={"passwordInputWrapper"}>
            <FormGroup
                name={confirm ? "confirmPassword" : "password"}
                value={value}
                setValue={setValue}
                label={label ?? (confirm ? "Confirm password" : "Password")}
                type={passwordShown ? "text" : "password"}
            />

            <button
                type={"button"}
                onClick={() => setPasswordShown(prev => !prev)}
                aria-label={passwordShown ? "Hide password" : "Show password"}
                aria-pressed={passwordShown}
            >
                <img src={passwordShown ? eyeClosed : eyeOpen} alt={`${passwordShown ? "Hide" : "Show"} password`} />
            </button>
        </div>
    )
}